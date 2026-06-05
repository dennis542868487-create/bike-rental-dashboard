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

// ─── Shared export types ─────────────────────────────────────────────────────

export type MorningCheckExportRow = {
  morning_check_id: string;
  check_date: string;
  submitted_at: string;
  signature_path: string | null;
  staff_name: string;
  staff_email: string;
  items: Array<{
    check_status: string;
    notes: string;
    bike_number: string;
    bike_type: string;
    area_name: string;
  }>;
};

export async function getMorningChecksForExport(
  fromDate?: string | null,
  toDate?: string | null,
): Promise<MorningCheckExportRow[]> {
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from('morning_checks')
    .select(
      'id, check_date, submitted_at, signature_path, staff:profiles(full_name, email), morning_check_items(check_status, notes, bike:bikes(bike_number, bike_type), area:morning_check_areas(name))',
    )
    .order('check_date', { ascending: false })
    .order('submitted_at', { ascending: false });

  if (fromDate) query = query.gte('check_date', fromDate) as typeof query;
  if (toDate) query = query.lte('check_date', toDate) as typeof query;

  const { data, error } = await query;
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

  return checks.map((c) => ({
    morning_check_id: c.id,
    check_date: c.check_date,
    submitted_at: c.submitted_at,
    signature_path: c.signature_path ?? null,
    staff_name: c.staff?.full_name ?? c.staff?.email ?? '',
    staff_email: c.staff?.email ?? '',
    items: (c.morning_check_items ?? []).map((item) => ({
      check_status: item.check_status,
      notes: item.notes ?? '',
      bike_number: item.bike?.bike_number ?? '',
      bike_type: item.bike?.bike_type ?? '',
      area_name: item.area?.name ?? 'Unassigned',
    })),
  }));
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const STATUS_LABELS: Record<string, string> = {
  all_good: 'All Good',
  front_tire_flat: 'Front Tire Flat',
  rear_tire_flat: 'Rear Tire Flat',
  sent_to_maintenance: 'Sent to Maintenance',
};

export async function exportMorningCheckHistoryCsv(
  fromDate?: string | null,
  toDate?: string | null,
): Promise<string> {
  const checks = await getMorningChecksForExport(fromDate, toDate);

  const header = [
    'morning_check_id',
    'check_date',
    'submitted_at',
    'staff_name',
    'staff_email',
    'staff_signature_present',
    'bike_number',
    'bike_type',
    'area',
    'check_result',
    'notes',
  ];

  const rows: string[][] = [];

  for (const check of checks) {
    const signaturePresent = check.signature_path ? 'Yes' : 'No';

    for (const item of check.items) {
      rows.push([
        check.morning_check_id,
        check.check_date,
        check.submitted_at,
        check.staff_name,
        check.staff_email,
        signaturePresent,
        item.bike_number,
        item.bike_type,
        item.area_name,
        STATUS_LABELS[item.check_status] ?? item.check_status,
        item.notes,
      ].map((v) => escapeCsv(String(v))));
    }
  }

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function buildCsvForZip(
  checks: MorningCheckExportRow[],
  signatureFileMap: Map<string, string>,
): string {
  const header = [
    'morning_check_id',
    'check_date',
    'submitted_at',
    'staff_name',
    'staff_email',
    'staff_signature_present',
    'staff_signature_file',
    'bike_number',
    'bike_type',
    'area',
    'check_result',
    'notes',
  ];

  const rows: string[][] = [];

  for (const check of checks) {
    const signatureFile = signatureFileMap.get(check.morning_check_id) ?? '';
    const signaturePresent = signatureFile ? 'Yes' : 'No';

    for (const item of check.items) {
      rows.push([
        check.morning_check_id,
        check.check_date,
        check.submitted_at,
        check.staff_name,
        check.staff_email,
        signaturePresent,
        signatureFile,
        item.bike_number,
        item.bike_type,
        item.area_name,
        STATUS_LABELS[item.check_status] ?? item.check_status,
        item.notes,
      ].map((v) => escapeCsv(String(v))));
    }
  }

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
