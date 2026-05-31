import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { MorningCheckHistoryRow } from '@/types/morning-check-history';

export async function getMorningCheckHistory(): Promise<MorningCheckHistoryRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.rpc('morning_check_history');

  if (error || !data) {
    return [];
  }

  const rows = data as unknown as Array<{
    morning_check_id: string;
    check_date: string;
    bike_number: string;
    area_name?: string | null;
    check_status: string;
    submitted_at: string;
  }>;

  return rows.map((row) => ({
    id: row.morning_check_id,
    checkDate: row.check_date,
    bikeNumber: row.bike_number,
    areaName: row.area_name ?? 'Unassigned',
    checkStatus: row.check_status,
    submittedAt: row.submitted_at,
  }));
}
