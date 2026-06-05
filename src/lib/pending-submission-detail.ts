import { createServerSupabaseClient } from '@/lib/supabase-server';

export type PendingSubmissionDetail = {
  id: string;
  submissionNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  idType: string;
  idLast4: string;
  waiverAccepted: boolean;
  submittedAt: string;
};

export async function getPendingSubmissionDetail(id: string): Promise<PendingSubmissionDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('customer_submissions')
    .select('id, submission_number, first_name, last_name, phone_number, email, id_type, id_last4, waiver_accepted, submitted_at')
    .eq('id', id)
    .eq('status', 'pending')
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const submission = data as unknown as {
    id: string;
    submission_number: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string | null;
    id_type: string;
    id_last4: string;
    waiver_accepted: boolean;
    submitted_at: string;
  };

  return {
    id: submission.id,
    submissionNumber: submission.submission_number,
    firstName: submission.first_name,
    lastName: submission.last_name,
    phoneNumber: submission.phone_number,
    email: submission.email ?? '',
    idType: submission.id_type,
    idLast4: submission.id_last4,
    waiverAccepted: submission.waiver_accepted,
    submittedAt: submission.submitted_at,
  };
}
