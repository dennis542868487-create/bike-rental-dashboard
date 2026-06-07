'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type StartRentalInput = {
  submissionId: string;
  customerId?: string;
  adultBikeQuantity: number;
  kidBikeQuantity: number;
  trailerQuantity: number;
  bikeIds?: string[];
  startTime: string;
  notes?: string;
};

export async function startRentalAction(input: StartRentalInput) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const resolvedStartTime = input.startTime || new Date().toISOString();
  // Default expected return time to start time if not provided.
  // The DB requires expected_return_time >= start_time, which this satisfies.
  const resolvedExpectedReturnTime = resolvedStartTime;

  const supabase = await createServerSupabaseClient();

  const { data: submission, error: submissionError } = await supabase
    .from('customer_submissions')
    .select('id, customer_id')
    .eq('id', input.submissionId)
    .maybeSingle();

  if (submissionError || !submission) {
    if (submissionError) console.error('startRentalAction submission lookup failed:', submissionError);
    return {
      ok: false,
      message: 'This submission could not be found. Please refresh and try again.',
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
      p_expected_return_time: resolvedExpectedReturnTime,
      p_estimated_fee: 0,
      p_notes: input.notes ?? null,
    } as never,
  );

  if (error) {
    console.error('startRentalAction failed:', error);
    return {
      ok: false,
      message: 'Unable to start this rental. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Rental started successfully.',
  };
}
