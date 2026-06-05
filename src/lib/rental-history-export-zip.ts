import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type RentalZipExportRow = {
  rental_id: string;
  rental_number: string;
  customer_name: string;
  phone: string;
  email: string;
  photo_id_type: string;
  id_masked: string;
  full_id_number: string;
  bikes: string;
  start_time: string;
  completed_at: string;
  fee: string;
  payment_status: string;
  signature_path: string | null;
};

export async function getRentalsForZipExport(
  fromDate?: string | null,
  toDate?: string | null,
): Promise<RentalZipExportRow[]> {
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from('rentals')
    .select(
      'id, rental_number, start_time, completed_at, final_fee, payment_status, ' +
      'customer:customers(first_name, last_name, phone_number, email), ' +
      'submission:customer_submissions(id_type, id_last4, full_id_number, signature_path), ' +
      'rental_bikes(bike:bikes(bike_number))',
    )
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (fromDate) {
    query = query.gte('completed_at', `${fromDate}T00:00:00.000Z`) as typeof query;
  }
  if (toDate) {
    query = query.lte('completed_at', `${toDate}T23:59:59.999Z`) as typeof query;
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rentals = (data ?? []) as unknown as Array<{
    id: string;
    rental_number: string;
    start_time?: string | null;
    completed_at?: string | null;
    final_fee?: number | null;
    payment_status?: string | null;
    customer?: {
      first_name?: string | null;
      last_name?: string | null;
      phone_number?: string | null;
      email?: string | null;
    } | null;
    submission?: {
      id_type?: string | null;
      id_last4?: string | null;
      full_id_number?: string | null;
      signature_path?: string | null;
    } | null;
    rental_bikes?: Array<{
      bike?: { bike_number?: string | null } | null;
    }> | null;
  }>;

  return rentals.map((r) => ({
    rental_id: r.id,
    rental_number: r.rental_number,
    customer_name: `${r.customer?.first_name ?? ''} ${r.customer?.last_name ?? ''}`.trim(),
    phone: r.customer?.phone_number ?? '',
    email: r.customer?.email ?? '',
    photo_id_type: r.submission?.id_type ?? '',
    id_masked: r.submission?.id_last4 ? `****${r.submission.id_last4}` : '',
    full_id_number: r.submission?.full_id_number ?? '',
    bikes: r.rental_bikes?.map((rb) => rb.bike?.bike_number ?? '').filter(Boolean).join(', ') ?? '',
    start_time: r.start_time ?? '',
    completed_at: r.completed_at ?? '',
    fee: r.final_fee != null ? `$${r.final_fee}` : '$0',
    payment_status: r.payment_status ?? '',
    signature_path: r.submission?.signature_path ?? null,
  }));
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildRentalHistoryCsvForZip(
  rentals: RentalZipExportRow[],
  signatureFileMap: Map<string, string>,
): string {
  const header = [
    'rental_id',
    'rental_number',
    'customer_name',
    'phone',
    'email',
    'photo_id_type',
    'id_masked',
    'full_id_number',
    'bikes',
    'start_time',
    'completed_at',
    'fee',
    'payment_status',
    'customer_signature_present',
    'customer_signature_file',
  ];

  const rows = rentals.map((r) => {
    const sigFile = signatureFileMap.get(r.rental_id) ?? '';
    const sigPresent = sigFile ? 'Yes' : 'No';
    return [
      r.rental_id,
      r.rental_number,
      r.customer_name,
      r.phone,
      r.email,
      r.photo_id_type,
      r.id_masked,
      r.full_id_number,
      r.bikes,
      r.start_time,
      r.completed_at,
      r.fee,
      r.payment_status,
      sigPresent,
      sigFile,
    ].map((v) => escapeCsv(String(v)));
  });

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
