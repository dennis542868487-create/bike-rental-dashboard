'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function createIncidentReportAction(input: {
  rentalId: string;
  bikeId?: string;
  description: string;
  severity?: string;
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const description = input.description.trim();

  if (!description) {
    return {
      ok: false,
      message: 'Incident description is required.',
    };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.from('incident_reports').insert({
    rental_id: input.rentalId,
    bike_id: input.bikeId?.trim() || null,
    description,
    severity: input.severity?.trim() || null,
    created_by_user_id: access.session.user.id,
  } as never);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Incident report created.',
  };
}
