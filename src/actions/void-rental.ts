'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function voidRentalAction(input: { rentalId: string; reason?: string }) {
  const access = await ensureOwnerActionAccess();

  if (!access.ok) {
    return access;
  }

  const trimmedReason = input.reason?.trim();
  if (!trimmedReason) {
    return { ok: false as const, message: 'A void reason is required.' };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.rpc(
    'void_rental',
    {
      p_rental_id: input.rentalId,
      p_reason: trimmedReason,
    } as never,
  );

  if (error) {
    console.error('voidRentalAction failed:', error);
    return {
      ok: false,
      message: 'Unable to void this rental. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Rental voided successfully.',
  };
}
