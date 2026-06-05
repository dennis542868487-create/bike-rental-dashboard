'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function voidRentalAction(input: { rentalId: string; reason?: string }) {
  const access = await ensureOwnerActionAccess();

  if (!access.ok) {
    return access;
  }

  const trimmedReason = input.reason?.trim();
  if (!trimmedReason) {
    return { ok: false as const, message: 'A void reason is required.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.rpc(
    'void_rental',
    {
      p_rental_id: input.rentalId,
      p_reason: trimmedReason,
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
    message: 'Rental voided successfully.',
  };
}
