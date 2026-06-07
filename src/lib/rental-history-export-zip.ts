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

  // Fetch rentals without embedding customer_submissions to avoid PostgREST
  // relationship ambiguity (rentals.submission_id and
  // customer_submissions.created_rental_id both link the two tables).
  let query = supabase
    .from('rentals')
    .select(
      'id, rental_number, start_time, completed_at, final_fee, payment_status, submission_id, ' +
      'customer:customers(first_name, last_name, phone_number, email), ' +
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

  const { data: rentalData, error: rentalError } = await query;
  if (rentalError) throw new Error(`Rental query failed: ${rentalError.message}`);

  const rentals = (rentalData ?? []) as unknown as Array<{
    id: string;
    rental_number: string;
    start_time?: string | null;
    completed_at?: string | null;
    final_fee?: number | null;
    payment_status?: string | null;
    submission_id?: string | null;
    customer?: {
      first_name?: string | null;
      last_name?: string | null;
      phone_number?: string | null;
      email?: string | null;
    } | null;
    rental_bikes?: Array<{
      bike?: { bike_number?: string | null } | null;
    }> | null;
  }>;

  // Collect distinct submission_ids so we can fetch submissions in one query.
  const submissionIds = [...new Set(
    rentals.map((r) => r.submission_id).filter((id): id is string => Boolean(id)),
  )];

  type SubmissionRow = {
    id: string;
    id_type?: string | null;
    id_last4?: string | null;
    full_id_number?: string | null;
    signature_path?: string | null;
  };

  const submissionMap = new Map<string, SubmissionRow>();

  if (submissionIds.length > 0) {
    const { data: subData, error: subError } = await supabase
      .from('customer_submissions')
      .select('id, id_type, id_last4, full_id_number, signature_path')
      .in('id', submissionIds);

    if (subError) throw new Error(`Submission query failed: ${subError.message}`);

    for (const sub of (subData ?? []) as SubmissionRow[]) {
      submissionMap.set(sub.id, sub);
    }
  }

  return rentals.map((r) => {
    const sub = r.submission_id ? submissionMap.get(r.submission_id) : undefined;
    return {
      rental_id: r.id,
      rental_number: r.rental_number,
      customer_name: `${r.customer?.first_name ?? ''} ${r.customer?.last_name ?? ''}`.trim(),
      phone: r.customer?.phone_number ?? '',
      email: r.customer?.email ?? '',
      photo_id_type: sub?.id_type ?? '',
      id_masked: sub?.id_last4 ? `****${sub.id_last4}` : '',
      full_id_number: sub?.full_id_number ?? '',
      bikes: r.rental_bikes?.map((rb) => rb.bike?.bike_number ?? '').filter(Boolean).join(', ') ?? '',
      start_time: r.start_time ?? '',
      completed_at: r.completed_at ?? '',
      fee: r.final_fee != null ? `$${r.final_fee}` : '$0',
      payment_status: r.payment_status ?? '',
      signature_path: sub?.signature_path ?? null,
    };
  });
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
