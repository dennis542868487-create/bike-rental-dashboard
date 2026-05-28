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
    .update({ status: input.status })
    .eq('id', input.bikeId);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Bike status updated.',
  };
}
