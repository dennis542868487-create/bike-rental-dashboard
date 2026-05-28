import { createServerSupabaseClient } from '@/lib/supabase-server';

async function getActionAccessProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { ok: false as const, message: 'You must be logged in.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    return { ok: false as const, message: 'You do not have access to perform this action.' };
  }

  return { ok: true as const, session, profile };
}

export async function ensureStaffActionAccess() {
  const access = await getActionAccessProfile();

  if (!access.ok) {
    return access;
  }

  if (!['owner', 'staff'].includes(access.profile.role)) {
    return { ok: false as const, message: 'You do not have access to perform this action.' };
  }

  return access;
}

export async function ensureOwnerActionAccess() {
  const access = await getActionAccessProfile();

  if (!access.ok) {
    return access;
  }

  if (access.profile.role !== 'owner') {
    return { ok: false as const, message: 'Only the owner can perform this action.' };
  }

  return access;
}
