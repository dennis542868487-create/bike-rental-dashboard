import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { getServerSessionProfile } from '@/lib/auth';

export async function getFullSubmissionIdForPendingDetail(submissionId: string) {
  const { profile } = await getServerSessionProfile();

  if (!profile || !profile.is_active || !['owner', 'staff'].includes(profile.role)) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.rpc('view_full_submission_id', {
    p_submission_id: submissionId,
  });

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0]?.full_id_number ?? null;
}
