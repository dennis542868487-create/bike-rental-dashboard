'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function saveBikeAction(input: {
  bikeId?: string;
  bikeNumber: string;
  bikeType: string;
  size?: string;
  notes?: string;
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const bikeNumber = input.bikeNumber.trim();
  const bikeType = input.bikeType.trim();

  if (!bikeNumber || !bikeType) {
    return {
      ok: false,
      message: 'Bike number and bike type are required.',
    };
  }

  const supabase = createAdminSupabaseClient();
  const payload = {
    bike_number: bikeNumber,
    bike_type: bikeType,
    size: input.size?.trim() || null,
    notes: input.notes?.trim() || null,
  };

  const query = input.bikeId
    ? supabase.from('bikes').update(payload).eq('id', input.bikeId)
    : supabase.from('bikes').insert(payload);

  const { error } = await query;

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: input.bikeId ? 'Bike updated.' : 'Bike created.',
  };
}
