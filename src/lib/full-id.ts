import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { getServerSessionProfile } from '@/lib/auth';

export async function getFullSubmissionIdForPendingDetail(submissionId: string) {
  const { profile } = await getServerSessionProfile();
  const sessionProfile = profile as unknown as { is_active?: boolean; role?: string } | null;

  if (!sessionProfile || !sessionProfile.is_active || !['owner', 'staff'].includes(sessionProfile.role ?? '')) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.rpc(
    'view_full_submission_id',
    {
      p_submission_id: submissionId,
    } as never,
  );

  const rows = data as unknown as Array<{ full_id_number?: string | null }> | null;

  if (error || !rows || rows.length === 0) {
    return null;
  }

  return rows[0]?.full_id_number ?? null;
}
