import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { BikeRow } from '@/types/bike';

export async function getBikes(): Promise<BikeRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bikes')
    .select('id, bike_number, bike_type, size, status, morning_check_area:morning_check_areas(name)')
    .eq('is_archived', false)
    .order('bike_number', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    bikeNumber: row.bike_number,
    bikeType: row.bike_type,
    size: row.size ?? '',
    status: row.status,
    area: row.morning_check_area?.name ?? 'Unassigned',
  }));
}
