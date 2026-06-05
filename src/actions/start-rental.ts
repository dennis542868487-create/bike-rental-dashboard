'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type StartRentalInput = {
  submissionId: string;
  customerId?: string;
  adultBikeQuantity: number;
  kidBikeQuantity: number;
  trailerQuantity: number;
  bikeIds?: string[];
  startTime: string;
  expectedReturnTime: string;
  estimatedFee: number;
  notes?: string;
};

export async function startRentalAction(input: StartRentalInput) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const resolvedStartTime = input.startTime || new Date().toISOString();

  if (!input.expectedReturnTime) {
    return { ok: false as const, message: 'Expected return time is required.' };
  }

  const supabase = createAdminSupabaseClient();

  const { data: submission, error: submissionError } = await supabase
    .from('customer_submissions')
    .select('id, customer_id')
    .eq('id', input.submissionId)
    .maybeSingle();

  if (submissionError || !submission) {
    return {
      ok: false,
      message: submissionError?.message ?? 'Submission not found.',
    };
  }

  const submissionCustomerId = (submission as { customer_id?: string | null } | null)?.customer_id ?? null;

  const { error } = await supabase.rpc(
    'start_rental',
    {
      p_submission_id: input.submissionId,
      p_customer_id: input.customerId ?? submissionCustomerId,
      p_adult_bike_quantity: input.adultBikeQuantity,
      p_kid_bike_quantity: input.kidBikeQuantity,
      p_trailer_quantity: input.trailerQuantity,
      p_bike_ids: input.bikeIds ?? [],
      p_start_time: resolvedStartTime,
      p_expected_return_time: input.expectedReturnTime,
      p_estimated_fee: input.estimatedFee,
      p_notes: input.notes ?? null,
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
    message: 'Rental started successfully.',
  };
}
