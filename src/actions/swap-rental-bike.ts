'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type SwapRentalBikeInput = {
  rentalId: string;
  oldBikeId: string;
  newBikeId: string;
};

export async function swapRentalBikeAction(input: SwapRentalBikeInput) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = createAdminSupabaseClient();

  const { data: currentRentalBikes, error: currentRentalBikesError } = await supabase
    .from('rental_bikes')
    .select('bike:bikes(id, bike_number)')
    .eq('rental_id', input.rentalId)
    .is('unassigned_at', null);

  if (currentRentalBikesError) {
    return {
      ok: false,
      message: currentRentalBikesError.message,
    };
  }

  const matchedOldBike = currentRentalBikes?.find((item) => item.bike?.bike_number === input.oldBikeId);

  if (!matchedOldBike?.bike?.id) {
    return {
      ok: false,
      message: 'Current bike could not be resolved.',
    };
  }

  const { error } = await supabase.rpc('swap_rental_bike', {
    p_rental_id: input.rentalId,
    p_old_bike_id: matchedOldBike.bike.id,
    p_new_bike_id: input.newBikeId,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Bike swapped successfully.',
  };
}
