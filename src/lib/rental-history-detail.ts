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

  const bikeNumbers = data.rental_bikes?.map((item) => item.bike?.bike_number).filter(Boolean) ?? [];

  return {
    id: data.id,
    rentalNumber: data.rental_number,
    customerName: `${data.customer?.first_name ?? ''} ${data.customer?.last_name ?? ''}`.trim(),
    bikeNumbers,
    completedAt: data.completed_at ?? '',
    finalFee: data.final_fee ? `$${data.final_fee}` : '$0',
    notes: data.notes ?? '',
    status: data.status,
  };
}
