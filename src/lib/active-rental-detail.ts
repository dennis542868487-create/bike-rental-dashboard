import { createServerSupabaseClient } from '@/lib/supabase-server';

export type ActiveRentalDetail = {
  id: string;
  rentalNumber: string;
  customerName: string;
  phoneNumber: string;
  bikeIds: string[];
  bikeNumbers: string[];
  expectedReturnTime: string;
  finalFee: string;
  notes: string;
};

export async function getActiveRentalDetail(id: string): Promise<ActiveRentalDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('rentals')
    .select('id, rental_number, expected_return_time, final_fee, notes, customer:customers(first_name, last_name, phone_number), rental_bikes(unassigned_at, bike:bikes(id, bike_number))')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const assignedBikes =
    data.rental_bikes?.filter((item) => item.unassigned_at === null).map((item) => item.bike).filter(Boolean) ?? [];

  return {
    id: data.id,
    rentalNumber: data.rental_number,
    customerName: `${data.customer?.first_name ?? ''} ${data.customer?.last_name ?? ''}`.trim(),
    phoneNumber: data.customer?.phone_number ?? '',
    bikeIds: assignedBikes.map((bike) => bike.id),
    bikeNumbers: assignedBikes.map((bike) => bike.bike_number),
    expectedReturnTime: data.expected_return_time,
    finalFee: data.final_fee ? `$${data.final_fee}` : '$0',
    notes: data.notes ?? '',
  };
}
