'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type MorningCheckSubmitItem = {
  bikeId: string;
  checkStatus: 'all_good' | 'front_tire_flat' | 'rear_tire_flat' | 'sent_to_maintenance';
  notes?: string;
};

export async function submitMorningCheckAction(input: {
  checkDate: string;
  items: MorningCheckSubmitItem[];
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = createAdminSupabaseClient();

  const payload = input.items.map((item) => ({
    bike_id: item.bikeId,
    check_status: item.checkStatus,
    notes: item.notes ?? '',
  }));

  const { error } = await supabase.rpc('submit_morning_check', {
    p_check_date: input.checkDate,
    p_signature_path: 'signatures/morning-check-placeholder.txt',
    p_notes: 'Submitted from dashboard placeholder form',
    p_items: payload,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Morning Check submitted.',
  };
}
