import { formatDateTime } from '@/lib/format-date-time';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { ActiveRentalRow } from '@/types/active-rental';

export async function getActiveRentals(): Promise<ActiveRentalRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('rentals')
    .select('id, rental_number, expected_return_time, final_fee, status, customer:customers(first_name, last_name, phone_number), rental_bikes(bike: bikes(bike_number))')
    .eq('status', 'active')
    .order('expected_return_time', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    rentalNumber: row.rental_number,
    customerName: `${row.customer?.first_name ?? ''} ${row.customer?.last_name ?? ''}`.trim(),
    phoneNumber: row.customer?.phone_number ?? '',
    bikes: row.rental_bikes?.map((item) => item.bike?.bike_number).filter(Boolean).join(', ') ?? '',
    expectedReturnTime: formatDateTime(row.expected_return_time),
    fee: row.final_fee ? `$${row.final_fee}` : '$0',
    status: 'active',
  }));
}
