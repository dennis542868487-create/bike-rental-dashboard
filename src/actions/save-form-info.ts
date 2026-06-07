'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function saveFormInfoAction(input: {
  id: string;
  formTitle: string;
  formIntro: string;
}) {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  if (!input.formTitle.trim()) {
    return { ok: false as const, message: 'Form title cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('business_settings')
    .update({
      form_title: input.formTitle.trim(),
      form_intro: input.formIntro.trim() || null,
      updated_by_user_id: access.user.id,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', input.id);

  if (error) {
    console.error('saveFormInfoAction failed:', error);
    return { ok: false as const, message: 'Unable to save form settings. Please try again.' };
  }

  return { ok: true as const, message: 'Form settings saved successfully.' };
}
