import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getServerSessionProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { session: null, profile: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name, role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  return { session: { user }, profile };
}

export async function requireDashboardAccess() {
  const { session, profile } = await getServerSessionProfile();
  const sessionProfile = profile as { is_active?: boolean; role?: string } | null;

  if (!session || !sessionProfile || !sessionProfile.is_active || !['owner', 'staff'].includes(sessionProfile.role ?? '')) {
    redirect('/login');
  }

  return { session, profile };
}
