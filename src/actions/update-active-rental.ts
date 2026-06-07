'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type UpdateActiveRentalInput = {
  rentalId: string;
  startTime?: string;
  returnTime?: string;
  clearReturnTime?: boolean;
  amountCollected?: number;
  notes?: string;
};

export async function updateActiveRentalAction(input: UpdateActiveRentalInput) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.rpc(
    'update_active_rental',
    {
      p_rental_id: input.rentalId,
      p_start_time: input.startTime || null,
      p_return_time: input.returnTime || null,
      p_amount_collected: input.amountCollected ?? null,
      p_notes: input.notes ?? null,
      p_clear_return_time: input.clearReturnTime ?? false,
    } as never,
  );

  if (error) {
    console.error('updateActiveRentalAction failed:', error);
    return {
      ok: false,
      message: 'Unable to update this rental. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Rental updated.',
  };
}
