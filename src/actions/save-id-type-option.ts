'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

// Must match public.id_type enum values in the database.
const VALID_ID_TYPE_VALUES = ['drivers_licence', 'passport', 'bcid', 'other_gov_id', 'other'];

export async function addIdTypeOptionAction(input: { value: string; label: string; sortOrder: number }) {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  if (!VALID_ID_TYPE_VALUES.includes(input.value)) {
    return { ok: false as const, message: 'Invalid ID type value.' };
  }

  if (!input.label.trim()) {
    return { ok: false as const, message: 'Display label cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('id_type_options')
    .insert({
      value: input.value,
      label: input.label.trim(),
      is_active: true,
      sort_order: input.sortOrder,
      updated_by_user_id: access.user.id,
    } as never);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: 'ID type option added.' };
}

export async function updateIdTypeOptionAction(input: { id: string; label: string; isActive: boolean; sortOrder: number }) {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  if (!input.label.trim()) {
    return { ok: false as const, message: 'Display label cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('id_type_options')
    .update({
      label: input.label.trim(),
      is_active: input.isActive,
      sort_order: input.sortOrder,
      updated_by_user_id: access.user.id,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', input.id);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: 'Option saved.' };
}
