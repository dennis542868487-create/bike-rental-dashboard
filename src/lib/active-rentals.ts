import { formatDateTime } from '@/lib/format-date-time';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { ActiveRentalRow } from '@/types/active-rental';

export async function getActiveRentals(): Promise<ActiveRentalRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('rentals')
    .select('id, rental_number, start_time, final_fee, status, customer:customers(first_name, last_name, phone_number), rental_bikes(bike: bikes(bike_number))')
    .eq('status', 'active')
    .order('start_time', { ascending: true });

  if (error || !data) {
    return [];
  }

  const rentals = data as unknown as Array<{
    id: string;
    rental_number: string;
    start_time: string;
    final_fee: number | null;
    status: string;
    customer?: {
      first_name?: string | null;
      last_name?: string | null;
      phone_number?: string | null;
    } | null;
    rental_bikes?: Array<{
      bike?: {
        bike_number?: string | null;
      } | null;
    }> | null;
  }>;

  return rentals.map((row) => ({
    id: row.id,
    rentalNumber: row.rental_number,
    customerName: `${row.customer?.first_name ?? ''} ${row.customer?.last_name ?? ''}`.trim(),
    phoneNumber: row.customer?.phone_number ?? '',
    bikes: row.rental_bikes?.map((item) => item.bike?.bike_number ?? '').filter(Boolean).join(', ') ?? '',
    startTime: formatDateTime(row.start_time),
    fee: row.final_fee ? `$${row.final_fee}` : '$0',
    status: 'active',
  }));
}
