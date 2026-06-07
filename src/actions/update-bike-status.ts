'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function updateBikeStatusAction(input: {
  bikeId: string;
  status: 'available' | 'rented' | 'maintenance';
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('bikes')
    .update({ status: input.status } as never)
    .eq('id', input.bikeId);

  if (error) {
    console.error('updateBikeStatusAction failed:', error);
    return {
      ok: false,
      message: 'Unable to update the bike status. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Bike status updated.',
  };
}
