import { createServerSupabaseClient } from '@/lib/supabase-server';

export type WaiverSettingsDetail = {
  id: string;
  version: string;
  waiverText: string;
  customerInstructions: string;
  isActive: boolean;
};

export async function getActiveWaiverSettings(): Promise<WaiverSettingsDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('waiver_settings')
    .select('id, version, waiver_text, customer_instructions, is_active')
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const waiver = data as unknown as {
    id: string;
    version: string;
    waiver_text: string;
    customer_instructions?: string | null;
    is_active: boolean;
  };

  return {
    id: waiver.id,
    version: waiver.version,
    waiverText: waiver.waiver_text,
    customerInstructions: waiver.customer_instructions ?? '',
    isActive: waiver.is_active,
  };
}
