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
    if (bikeError) console.error('archiveBikeAction bike lookup failed:', bikeError);
    return {
      ok: false,
      message: 'This bike could not be found. Please refresh and try again.',
    };
  }

  const bikeStatus = (bike as { status?: string } | null)?.status;

  if (bikeStatus === 'rented') {
    return {
      ok: false,
      message: 'This bike cannot be archived while it is rented.',
    };
  }

  const { error } = await supabase
    .from('bikes')
    .update({ is_archived: true } as never)
    .eq('id', input.bikeId);

  if (error) {
    console.error('archiveBikeAction failed:', error);
    return {
      ok: false,
      message: 'Unable to archive this bike. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Bike archived.',
  };
}
