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

  const settings = data as unknown as {
    id: string;
    version: string;
    id_type_options?: string[] | null;
  };

  return {
    id: settings.id,
    version: settings.version,
    idTypeOptions: Array.isArray(settings.id_type_options) ? settings.id_type_options : [],
  };
}
