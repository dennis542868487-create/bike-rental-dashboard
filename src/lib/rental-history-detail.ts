import { createServerSupabaseClient } from '@/lib/supabase-server';

export type RentalHistoryDetail = {
  id: string;
  rentalNumber: string;
  customerName: string;
  bikeNumbers: string[];
  completedAt: string;
  finalFee: string;
  notes: string;
  status: string;
};

export async function getRentalHistoryDetail(id: string): Promise<RentalHistoryDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('rentals')
    .select('id, rental_number, status, completed_at, final_fee, notes, customer:customers(first_name, last_name), rental_bikes(bike:bikes(bike_number))')
    .eq('id', id)
    .in('status', ['completed', 'voided'])
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const rental = data as unknown as {
    id: string;
    rental_number: string;
    status: string;
    completed_at?: string | null;
    final_fee?: number | null;
    notes?: string | null;
    customer?: {
      first_name?: string | null;
      last_name?: string | null;
    } | null;
    rental_bikes?: Array<{
      bike?: {
        bike_number?: string | null;
      } | null;
    }> | null;
  };

  const bikeNumbers = rental.rental_bikes?.map((item) => item.bike?.bike_number ?? '').filter(Boolean) ?? [];

  return {
    id: rental.id,
    rentalNumber: rental.rental_number,
    customerName: `${rental.customer?.first_name ?? ''} ${rental.customer?.last_name ?? ''}`.trim(),
    bikeNumbers,
    completedAt: rental.completed_at ?? '',
    finalFee: rental.final_fee ? `$${rental.final_fee}` : '$0',
    notes: rental.notes ?? '',
    status: rental.status,
  };
}
