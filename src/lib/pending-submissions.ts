import { formatDateTime } from '@/lib/format-date-time';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { PendingSubmissionRow } from '@/types/pending-submission';

export async function getPendingSubmissions(): Promise<PendingSubmissionRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('customer_submissions')
    .select('id, submission_number, first_name, last_name, phone_number, submitted_at, status')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    submissionNumber: row.submission_number,
    customerName: `${row.first_name} ${row.last_name}`,
    phoneNumber: row.phone_number,
    submittedAt: formatDateTime(row.submitted_at),
    status: 'pending',
  }));
}
