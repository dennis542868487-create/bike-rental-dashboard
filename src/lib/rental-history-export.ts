import { createAdminSupabaseClient } from '@/lib/supabase-admin';

function escapeCsvValue(value: string) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export async function exportRentalHistoryCsv() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from('rentals')
    .select('rental_number, status, completed_at, final_fee, notes, customer:customers(first_name, last_name, phone_number, email), rental_bikes(bike:bikes(bike_number))')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rentals = (data ?? []) as unknown as Array<{
    rental_number?: string | null;
    status?: string | null;
    completed_at?: string | null;
    final_fee?: number | null;
    notes?: string | null;
    customer?: {
      first_name?: string | null;
      last_name?: string | null;
      phone_number?: string | null;
      email?: string | null;
    } | null;
    rental_bikes?: Array<{
      bike?: {
        bike_number?: string | null;
      } | null;
    }> | null;
  }>;

  const header = ['rental_number', 'customer_name', 'phone_number', 'email', 'bike_numbers', 'completed_at', 'final_fee', 'notes'];

  const rows = rentals.map((row) => {
    const customerName = `${row.customer?.first_name ?? ''} ${row.customer?.last_name ?? ''}`.trim();
    const bikeNumbers = row.rental_bikes?.map((item) => item.bike?.bike_number ?? '').filter(Boolean).join(', ') ?? '';

    return [
      row.rental_number ?? '',
      customerName,
      row.customer?.phone_number ?? '',
      row.customer?.email ?? '',
      bikeNumbers,
      row.completed_at ?? '',
      row.final_fee?.toString() ?? '',
      row.notes ?? '',
    ].map((value) => escapeCsvValue(String(value)));
  });

  return [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
