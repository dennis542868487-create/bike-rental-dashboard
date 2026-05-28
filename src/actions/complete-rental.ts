'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

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

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.rpc('complete_rental', {
    p_rental_id: input.rentalId,
    p_actual_return_time: input.actualReturnTime,
    p_final_fee: input.finalFee,
    p_payment_method: null,
    p_payment_status: 'paid',
    p_notes: input.notes ?? null,
    p_maintenance_needed: input.sendToMaintenance,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Rental completed successfully.',
  };
}
