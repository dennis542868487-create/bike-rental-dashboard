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

  return {
    id: data.id,
    submissionNumber: data.submission_number,
    firstName: data.first_name,
    lastName: data.last_name,
    phoneNumber: data.phone_number,
    email: data.email ?? '',
    idType: data.id_type,
    idLast4: data.id_last4,
    waiverAccepted: data.waiver_accepted,
    submittedAt: data.submitted_at,
  };
}
