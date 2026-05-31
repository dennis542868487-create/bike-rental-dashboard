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

  const rental = data as unknown as {
    id: string;
    rental_number: string;
    expected_return_time: string;
    final_fee: number | null;
    notes: string | null;
    customer?: {
      first_name?: string | null;
      last_name?: string | null;
      phone_number?: string | null;
    } | null;
    rental_bikes?: Array<{
      unassigned_at?: string | null;
      bike?: {
        id?: string | null;
        bike_number?: string | null;
      } | null;
    }> | null;
  };

  const assignedBikes =
    rental.rental_bikes?.filter((item) => item.unassigned_at === null).map((item) => item.bike).filter(Boolean) ?? [];

  return {
    id: rental.id,
    rentalNumber: rental.rental_number,
    customerName: `${rental.customer?.first_name ?? ''} ${rental.customer?.last_name ?? ''}`.trim(),
    phoneNumber: rental.customer?.phone_number ?? '',
    bikeIds: assignedBikes.map((bike) => bike?.id ?? '').filter(Boolean),
    bikeNumbers: assignedBikes.map((bike) => bike?.bike_number ?? '').filter(Boolean),
    expectedReturnTime: rental.expected_return_time,
    finalFee: rental.final_fee ? `$${rental.final_fee}` : '$0',
    notes: rental.notes ?? '',
  };
}
