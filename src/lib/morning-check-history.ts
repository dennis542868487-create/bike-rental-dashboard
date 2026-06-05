import { createAdminSupabaseClient } from '@/lib/supabase-admin';
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
    bike_type?: string | null;
    area_name?: string | null;
    check_status: string;
    item_notes?: string | null;
    submitted_at: string;
  }>;

  return rows.map((row) => ({
    id: row.morning_check_id,
    checkDate: row.check_date,
    bikeNumber: row.bike_number,
    bikeType: row.bike_type ?? '',
    areaName: row.area_name ?? 'Unassigned',
    checkStatus: row.check_status,
    itemNotes: row.item_notes ?? '',
    submittedAt: row.submitted_at,
  }));
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportMorningCheckHistoryCsv(): Promise<string> {
  // Admin client: bypasses RLS, safe for owner-only export route.
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from('morning_checks')
    .select(
      'id, check_date, submitted_at, signature_path, staff:profiles(full_name, email), morning_check_items(check_status, notes, bike:bikes(bike_number, bike_type), area:morning_check_areas(name))',
    )
    .order('check_date', { ascending: false })
    .order('submitted_at', { ascending: false });

  if (error) throw new Error(error.message);

  const checks = (data ?? []) as unknown as Array<{
    id: string;
    check_date: string;
    submitted_at: string;
    signature_path?: string | null;
    staff?: { full_name?: string | null; email?: string | null } | null;
    morning_check_items?: Array<{
      check_status: string;
      notes?: string | null;
      bike?: { bike_number?: string | null; bike_type?: string | null } | null;
      area?: { name?: string | null } | null;
    }> | null;
  }>;

  const header = [
    'check_date',
    'submitted_at',
    'staff_name',
    'staff_email',
    'signature_present',
    'bike_number',
    'bike_type',
    'area',
    'check_result',
    'notes',
  ];

  const STATUS_LABELS: Record<string, string> = {
    all_good: 'All Good',
    front_tire_flat: 'Front Tire Flat',
    rear_tire_flat: 'Rear Tire Flat',
    sent_to_maintenance: 'Sent to Maintenance',
  };

  const rows: string[][] = [];

  for (const check of checks) {
    const staffName = check.staff?.full_name ?? check.staff?.email ?? '';
    const staffEmail = check.staff?.email ?? '';
    // Signature is stored as a storage path. Exporting the raw path would be
    // meaningless to consumers (it requires a signed URL to access). We export
    // Yes/No instead to confirm it was captured at submission time.
    const signaturePresent = check.signature_path ? 'Yes' : 'No';

    for (const item of check.morning_check_items ?? []) {
      rows.push([
        check.check_date,
        check.submitted_at,
        staffName,
        staffEmail,
        signaturePresent,
        item.bike?.bike_number ?? '',
        item.bike?.bike_type ?? '',
        item.area?.name ?? 'Unassigned',
        STATUS_LABELS[item.check_status] ?? item.check_status,
        item.notes ?? '',
      ].map((v) => escapeCsv(String(v))));
    }
  }

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
