import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { MorningCheckAreaRow } from '@/types/morning-check-area';

export async function getMorningCheckAreas(): Promise<MorningCheckAreaRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('morning_check_areas')
    .select('id, name, display_order, is_active, notes')
    .order('display_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  const areas = data as unknown as Array<{
    id: string;
    name: string;
    display_order: number;
    is_active: boolean;
    notes?: string | null;
  }>;

  return areas.map((row) => ({
    id: row.id,
    name: row.name,
    displayOrder: row.display_order,
    isActive: row.is_active,
    notes: row.notes ?? '',
  }));
}
