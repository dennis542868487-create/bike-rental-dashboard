import { type NextRequest, NextResponse } from 'next/server';
import { zipSync, strToU8 } from 'fflate';
import { getServerSessionProfile } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { getMorningChecksForExport, buildCsvForZip } from '@/lib/morning-check-history';

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function thisMonthStartUtc(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const { session, profile } = await getServerSessionProfile();
  const sessionProfile = profile as { is_active?: boolean; role?: string } | null;

  if (!session || !sessionProfile || !sessionProfile.is_active || sessionProfile.role !== 'owner') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const preset = searchParams.get('preset');
  let from = searchParams.get('from');
  let to = searchParams.get('to');

  if (preset === 'today') {
    from = todayUtc();
    to = todayUtc();
  } else if (preset === 'this_month') {
    from = thisMonthStartUtc();
    to = todayUtc();
  } else {
    if (from && !DATE_RE.test(from)) from = null;
    if (to && !DATE_RE.test(to)) to = null;
  }

  const adminClient = createAdminSupabaseClient();

  try {
    const checks = await getMorningChecksForExport(from, to);

    const signatureFileMap = new Map<string, string>();
    const zipFiles: Record<string, Uint8Array> = {};
    const missingSigs: string[] = [];

    for (const check of checks) {
      if (!check.signature_path) continue;

      const zipSigPath = `signatures/morning_check_${check.check_date}_${check.morning_check_id}.png`;

      const { data, error } = await adminClient.storage
        .from('signatures')
        .download(check.signature_path);

      if (error || !data) {
        console.error(`[export-zip] Signature download failed for check ${check.morning_check_id}:`, error?.message);
        missingSigs.push(check.morning_check_id);
        signatureFileMap.set(check.morning_check_id, '');
        continue;
      }

      const buf = await data.arrayBuffer();
      zipFiles[zipSigPath] = new Uint8Array(buf);
      signatureFileMap.set(check.morning_check_id, zipSigPath);
    }

    const csvContent = buildCsvForZip(checks, signatureFileMap);
    zipFiles['morning_check_history.csv'] = strToU8(csvContent);

    const rangeLabel = from && to ? `${from} to ${to}` : 'all records';
    const readmeLines = [
      'Morning Check History Export',
      '============================',
      '',
      'Files:',
      '  morning_check_history.csv  - Exported morning check records.',
      '  signatures/                - Staff signature PNG files.',
      '',
      'CSV Column Reference:',
      '  staff_signature_file  Points to the matching PNG inside the signatures/ folder.',
      '                        If blank, no signature file was available for that record.',
      '',
      'Matching:',
      '  Each CSV row includes a staff_signature_file column.',
      '  Multiple bike rows for the same morning check share the same staff_signature_file value.',
      '',
      `Date range: ${rangeLabel}`,
      `Exported at: ${new Date().toISOString()} (UTC)`,
      'Dates are stored and filtered in UTC.',
    ];

    if (missingSigs.length > 0) {
      readmeLines.push('', `Note: ${missingSigs.length} signature file(s) could not be retrieved and are excluded from signatures/.`);
    }

    zipFiles['README.txt'] = strToU8(readmeLines.join('\n'));

    const fromLabel = from ?? 'all';
    const toLabel = to ?? 'all';
    const zipFilename = `morning-check-history_${fromLabel}_to_${toLabel}.zip`;

    const zipped = zipSync(zipFiles, { level: 6 });

    await adminClient.from('audit_logs').insert({
      actor_user_id: session.user.id,
      action: 'EXPORT_ZIP',
      entity_type: 'morning_check',
      entity_id: null,
      metadata: {
        from_date: from,
        to_date: to,
        record_count: checks.length,
        missing_signatures: missingSigs.length,
      },
    } as never);

    return new NextResponse(zipped, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Export failed', { status: 500 });
  }
}
