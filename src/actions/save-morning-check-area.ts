'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function addMorningCheckAreaAction(input: {
  name: string;
  displayOrder: number;
  notes: string;
}) {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  if (!input.name.trim()) {
    return { ok: false as const, message: 'Area name cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('morning_check_areas')
    .insert({
      name: input.name.trim(),
      display_order: input.displayOrder,
      is_active: true,
      notes: input.notes.trim() || null,
    } as never);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: 'Area added.' };
}

export async function updateMorningCheckAreaAction(input: {
  id: string;
  name: string;
  isActive: boolean;
  displayOrder: number;
  notes: string;
}) {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  if (!input.name.trim()) {
    return { ok: false as const, message: 'Area name cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('morning_check_areas')
    .update({
      name: input.name.trim(),
      is_active: input.isActive,
      display_order: input.displayOrder,
      notes: input.notes.trim() || null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', input.id);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: 'Area saved.' };
}
