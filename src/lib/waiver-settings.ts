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

  return {
    id: data.id,
    version: data.version,
    waiverText: data.waiver_text,
    customerInstructions: data.customer_instructions ?? '',
    isActive: data.is_active,
  };
}
