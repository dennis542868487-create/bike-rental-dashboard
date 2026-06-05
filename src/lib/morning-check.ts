import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { MorningCheckItem } from '@/types/morning-check';

export async function getMorningCheckItems(): Promise<MorningCheckItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bikes')
    .select('id, bike_number, bike_type, status, morning_check_area:morning_check_areas(id, name, is_active)')
    .neq('status', 'rented')
    .eq('is_archived', false)
    .order('bike_number', { ascending: true });

  if (error || !data) {
    return [];
  }

  const bikes = (data as unknown as Array<{
    id: string;
    bike_number: string;
    bike_type: string;
    status: 'available' | 'rented' | 'maintenance';
    morning_check_area?: {
      id?: string | null;
      name?: string | null;
      is_active?: boolean | null;
    } | null;
  // Exclude bikes whose assigned area exists but is inactive.
  }>).filter((row) => !row.morning_check_area || row.morning_check_area.is_active !== false);

  return bikes.map((row) => ({
    id: row.id,
    bikeNumber: row.bike_number,
    bikeType: row.bike_type,
    areaId: row.morning_check_area?.id ?? null,
    area: row.morning_check_area?.name ?? 'Unassigned',
    status: row.status === 'maintenance' ? 'sent_to_maintenance' : 'all_good',
    notes: row.status === 'maintenance' ? 'Already marked for maintenance' : undefined,
  }));
}
