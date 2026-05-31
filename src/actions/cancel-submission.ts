'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function cancelSubmissionAction(input: { submissionId: string; reason?: string }) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.rpc(
    'cancel_submission',
    {
      p_submission_id: input.submissionId,
      p_reason: input.reason?.trim() || null,
    } as never,
  );

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Submission cancelled successfully.',
  };
}
