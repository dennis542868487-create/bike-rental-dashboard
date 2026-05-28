import { createServerSupabaseClient } from '@/lib/supabase-server';

export type IdTypeSettingsDetail = {
  id: string;
  version: string;
  idTypeOptions: string[];
};

export async function getActiveIdTypeSettings(): Promise<IdTypeSettingsDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('waiver_settings')
    .select('id, version, id_type_options')
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    version: data.version,
    idTypeOptions: Array.isArray(data.id_type_options) ? data.id_type_options : [],
  };
}
