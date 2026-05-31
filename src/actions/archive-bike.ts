'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function archiveBikeAction(input: { bikeId: string }) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = createAdminSupabaseClient();

  const { data: bike, error: bikeError } = await supabase
    .from('bikes')
    .select('id, status')
    .eq('id', input.bikeId)
    .maybeSingle();

  if (bikeError || !bike) {
    return {
      ok: false,
      message: bikeError?.message ?? 'Bike not found.',
    };
  }

  const bikeStatus = (bike as { status?: string } | null)?.status;

  if (bikeStatus === 'rented') {
    return {
      ok: false,
      message: 'Rented bikes cannot be archived.',
    };
  }

  const { error } = await supabase
    .from('bikes')
    .update({ is_archived: true } as never)
    .eq('id', input.bikeId);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Bike archived.',
  };
}
