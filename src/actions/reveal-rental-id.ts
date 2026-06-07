'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function revealRentalIdAction(submissionId: string): Promise<
  { ok: true; fullId: string } | { ok: false; message: string }
> {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  // view_full_submission_id is a SECURITY DEFINER RPC that writes an audit log
  // entry (action = 'VIEW_FULL_ID') every time it is called.
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.rpc('view_full_submission_id', {
    p_submission_id: submissionId,
  } as never);

  if (error) {
    console.error('revealRentalIdAction failed:', error);
    return { ok: false, message: 'Unable to retrieve the full ID. Please try again.' };
  }

  const rows = data as unknown as Array<{ full_id_number?: string | null }> | null;
  const fullId = rows?.[0]?.full_id_number ?? null;

  if (!fullId) {
    return { ok: false, message: 'Full ID not found for this submission.' };
  }

  return { ok: true, fullId };
}
