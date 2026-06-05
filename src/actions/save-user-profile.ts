'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function saveUserProfileAction(input: {
  profileId?: string;
  email: string;
  password?: string;
  fullName?: string;
  role: 'owner' | 'staff';
  isActive: boolean;
}) {
  const access = await ensureOwnerActionAccess();

  if (!access.ok) {
    return access;
  }

  const email = input.email.trim().toLowerCase();

  if (!email) {
    return {
      ok: false,
      message: 'Email is required.',
    };
  }

  const supabase = createAdminSupabaseClient();

  if (!input.profileId) {
    const password = input.password?.trim();

    if (!password) {
      return {
        ok: false,
        message: 'Password is required when creating a user.',
      };
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      return {
        ok: false,
        message: authError?.message ?? 'Could not create auth user.',
      };
    }

    const { error: insertError } = await supabase.from('profiles').insert({
      id: authUser.user.id,
      email,
      full_name: input.fullName?.trim() || null,
      role: input.role,
      is_active: input.isActive,
    } as never);

    if (insertError) {
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return {
        ok: false,
        message: insertError.message,
      };
    }

    return {
      ok: true,
      message: 'User created.',
    };
  }

  // Last-owner protection: ensure at least one active owner remains after this change.
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', input.profileId)
    .maybeSingle();

  const currentRow = currentProfile as { role?: string; is_active?: boolean } | null;
  const losingOwnerStatus =
    currentRow?.role === 'owner' &&
    currentRow?.is_active === true &&
    (input.role === 'staff' || input.isActive === false);

  if (losingOwnerStatus) {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'owner')
      .eq('is_active', true)
      .neq('id', input.profileId);

    if ((count ?? 0) === 0) {
      return { ok: false as const, message: 'Cannot remove the last active owner.' };
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      email,
      full_name: input.fullName?.trim() || null,
      role: input.role,
      is_active: input.isActive,
    } as never)
    .eq('id', input.profileId);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'User profile updated.',
  };
}
