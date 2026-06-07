'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type CompleteRentalInput = {
  rentalId: string;
  actualReturnTime: string;
  finalFee: number;
  notes?: string;
  sendToMaintenance: boolean;
};

export async function completeRentalAction(input: CompleteRentalInput) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const resolvedActualReturnTime = input.actualReturnTime || new Date().toISOString();

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.rpc(
    'complete_rental',
    {
      p_rental_id: input.rentalId,
      p_actual_return_time: resolvedActualReturnTime,
      p_final_fee: input.finalFee,
      p_payment_method: null,
      p_payment_status: 'paid',
      p_notes: input.notes ?? null,
      p_maintenance_needed: input.sendToMaintenance,
    } as never,
  );

  if (error) {
    console.error('completeRentalAction failed:', error);
    return {
      ok: false,
      message: 'Unable to complete this rental. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Rental completed successfully.',
  };
}
