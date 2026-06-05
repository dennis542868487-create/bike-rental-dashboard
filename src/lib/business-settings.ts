import { createServerSupabaseClient } from '@/lib/supabase-server';

export type BusinessSettings = {
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

const FALLBACK: BusinessSettings = {
  id: '',
  businessName: 'Wander Bike',
  timezone: 'America/Vancouver',
  primaryCurrency: 'CAD',
  phone: '',
  email: '',
  address: '',
  defaultRentalDurationHours: null,
  operationsNote: '',
};

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('business_settings')
    .select('id, business_name, timezone, primary_currency, phone, email, address, default_rental_duration_hours, operations_note')
    .maybeSingle();

  if (error || !data) return FALLBACK;

  const row = data as unknown as {
    id: string;
    business_name: string;
    timezone: string;
    primary_currency: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    default_rental_duration_hours?: number | null;
    operations_note?: string | null;
  };

  return {
    id: row.id,
    businessName: row.business_name,
    timezone: row.timezone,
    primaryCurrency: row.primary_currency,
    phone: row.phone ?? '',
    email: row.email ?? '',
    address: row.address ?? '',
    defaultRentalDurationHours: row.default_rental_duration_hours ?? null,
    operationsNote: row.operations_note ?? '',
  };
}
