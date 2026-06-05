'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type SaveWaiverSettingsInput = {
  id: string;
  waiverText: string;
  customerInstructions: string;
  isActive: boolean;
};

export async function saveWaiverSettingsAction(input: SaveWaiverSettingsInput) {
  const access = await ensureOwnerActionAccess();

  if (!access.ok) {
    return access;
  }

  if (!input.waiverText.trim()) {
    return { ok: false as const, message: 'Waiver text cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('waiver_settings')
    .update({
      waiver_text: input.waiverText.trim(),
      customer_instructions: input.customerInstructions.trim() || null,
      is_active: input.isActive,
      updated_by_user_id: access.user.id,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', input.id);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: 'Waiver settings saved.' };
}
