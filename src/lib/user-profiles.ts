import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { UserProfileRow } from '@/types/user-profile';

export async function getUserProfiles(): Promise<UserProfileRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, is_active')
    .order('created_at', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? '',
    role: row.role,
    isActive: row.is_active,
  }));
}
