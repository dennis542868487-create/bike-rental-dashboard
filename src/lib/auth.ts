import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getServerSessionProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { session: null, profile: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name, role, is_active')
    .eq('id', session.user.id)
    .maybeSingle();

  return { session, profile };
}

export async function requireDashboardAccess() {
  const { session, profile } = await getServerSessionProfile();

  if (!session || !profile || !profile.is_active || !['owner', 'staff'].includes(profile.role)) {
    redirect('/login');
  }

  return { session, profile };
}
