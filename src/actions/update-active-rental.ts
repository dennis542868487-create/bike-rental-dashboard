'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type UpdateActiveRentalInput = {
  rentalId: string;
  expectedReturnTime: string;
  estimatedFee: number;
  notes?: string;
};

export async function updateActiveRentalAction(input: UpdateActiveRentalInput) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.rpc(
    'update_active_rental',
    {
      p_rental_id: input.rentalId,
      p_expected_return_time: input.expectedReturnTime || null,
      p_estimated_fee: input.estimatedFee,
      p_notes: input.notes ?? null,
    } as never,
  );

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Active rental updated.',
  };
}
