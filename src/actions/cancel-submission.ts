'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function cancelSubmissionAction(input: { submissionId: string; reason?: string }) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  // Use the server client (anon key + user session) so that auth.uid() is available
  // inside the SECURITY DEFINER function. SECURITY DEFINER still bypasses RLS.
  // The admin (service_role) client has no sub claim in its JWT → auth.uid() = NULL.
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.rpc(
    'cancel_submission',
    {
      p_submission_id: input.submissionId,
      p_reason: input.reason?.trim() || null,
    } as never,
  );

  if (error) {
    console.error('cancelSubmissionAction failed:', error);
    return {
      ok: false,
      message: 'Unable to cancel this submission. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Submission cancelled successfully.',
  };
}
