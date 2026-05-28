import { formatDateTime } from '@/lib/format-date-time';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { RentalHistoryRow } from '@/types/rental-history';

export async function getRentalHistory(): Promise<RentalHistoryRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('rentals')
    .select('id, rental_number, completed_at, final_fee, customer:customers(first_name, last_name), rental_bikes(bike:bikes(bike_number))')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    rentalNumber: row.rental_number,
    customerName: `${row.customer?.first_name ?? ''} ${row.customer?.last_name ?? ''}`.trim(),
    bikeNumbers: row.rental_bikes?.map((item) => item.bike?.bike_number).filter(Boolean).join(', ') ?? '',
    completedAt: formatDateTime(row.completed_at),
    fee: row.final_fee ? `$${row.final_fee}` : '$0',
  }));
}
