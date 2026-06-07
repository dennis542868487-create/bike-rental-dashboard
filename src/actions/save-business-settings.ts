'use server';

import { ensureOwnerActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type SaveBusinessSettingsInput = {
  id: string;
  businessName: string;
  timezone: string;
  primaryCurrency: string;
  phone: string;
  email: string;
  address: string;
  defaultRentalDurationHours: number | null;
  operationsNote: string;
};

export async function saveBusinessSettingsAction(input: SaveBusinessSettingsInput) {
  const access = await ensureOwnerActionAccess();
  if (!access.ok) return access;

  if (!input.businessName.trim()) {
    return { ok: false as const, message: 'Business name cannot be empty.' };
  }

  if (!input.timezone.trim()) {
    return { ok: false as const, message: 'Timezone cannot be empty.' };
  }

  if (!input.primaryCurrency.trim()) {
    return { ok: false as const, message: 'Currency cannot be empty.' };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from('business_settings')
    .update({
      business_name: input.businessName.trim(),
      timezone: input.timezone.trim(),
      primary_currency: input.primaryCurrency.trim(),
      phone: input.phone.trim() || null,
      email: input.email.trim() || null,
      address: input.address.trim() || null,
      default_rental_duration_hours: input.defaultRentalDurationHours,
      operations_note: input.operationsNote.trim() || null,
      updated_by_user_id: access.user.id,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', input.id);

  if (error) {
    console.error('saveBusinessSettingsAction failed:', error);
    return { ok: false as const, message: 'Unable to save business settings. Please try again.' };
  }

  return { ok: true as const, message: 'Business settings saved successfully.' };
}
