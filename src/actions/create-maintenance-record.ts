'use server';

import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function createMaintenanceRecordAction(input: {
  bikeId: string;
  maintenanceDate: string;
  workDone: string;
  cost?: number;
  notes?: string;
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const workDone = input.workDone.trim();

  if (!workDone) {
    return {
      ok: false,
      message: 'Work done is required.',
    };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.from('maintenance_records').insert({
    bike_id: input.bikeId,
    maintenance_date: input.maintenanceDate || new Date().toISOString(),
    work_done: workDone,
    cost: typeof input.cost === 'number' && !Number.isNaN(input.cost) ? input.cost : null,
    notes: input.notes?.trim() || null,
    staff_user_id: access.user.id,
  } as never);

  if (error) {
    console.error('createMaintenanceRecordAction failed:', error);
    return {
      ok: false,
      message: 'Unable to save this maintenance record. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Maintenance record created.',
  };
}
