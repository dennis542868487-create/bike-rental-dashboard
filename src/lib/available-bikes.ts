import { createServerSupabaseClient } from '@/lib/supabase-server';

export type AvailableBikeOption = {
  id: string;
  label: string;
};

export async function getAvailableBikes(): Promise<AvailableBikeOption[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bikes')
    .select('id, bike_number, bike_type, size')
    .eq('status', 'available')
    .eq('is_archived', false)
    .order('bike_number', { ascending: true });

  if (error || !data) {
    return [];
  }

  const bikes = data as unknown as Array<{
    id: string;
    bike_number: string;
    bike_type: string;
    size?: string | null;
  }>;

  return bikes.map((row) => ({
    id: row.id,
    label: `${row.bike_number} • ${row.bike_type}${row.size ? ` • ${row.size}` : ''}`,
  }));
}
