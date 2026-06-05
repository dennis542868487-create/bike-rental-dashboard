import { type NextRequest, NextResponse } from 'next/server';
import { zipSync, strToU8 } from 'fflate';
import { getServerSessionProfile } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { getRentalsForZipExport, buildRentalHistoryCsvForZip } from '@/lib/rental-history-export-zip';

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function thisMonthStartUtc(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

function thisYearStartUtc(): string {
  return `${new Date().getUTCFullYear()}-01-01`;
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
  } else if (preset === 'this_year') {
    from = thisYearStartUtc();
    to = todayUtc();
  } else {
    if (from && !DATE_RE.test(from)) from = null;
    if (to && !DATE_RE.test(to)) to = null;
  }

  const adminClient = createAdminSupabaseClient();

  try {
    const rentals = await getRentalsForZipExport(from, to);

    const signatureFileMap = new Map<string, string>();
    const zipFiles: Record<string, Uint8Array> = {};
    const missingSigs: string[] = [];

    for (const rental of rentals) {
      if (!rental.signature_path) {
        signatureFileMap.set(rental.rental_id, '');
        continue;
      }

      const zipSigPath = `signatures/rental_${rental.rental_number}_customer_signature.png`;

      const { data, error } = await adminClient.storage
        .from('signatures')
        .download(rental.signature_path);

      if (error || !data) {
        console.error(`[history/export-zip] Signature download failed for rental ${rental.rental_number}:`, error?.message);
        missingSigs.push(rental.rental_number);
        signatureFileMap.set(rental.rental_id, '');
        continue;
      }

      const buf = await data.arrayBuffer();
      zipFiles[zipSigPath] = new Uint8Array(buf);
      signatureFileMap.set(rental.rental_id, zipSigPath);
    }

    const csvContent = buildRentalHistoryCsvForZip(rentals, signatureFileMap);
    zipFiles['rental_history.csv'] = strToU8(csvContent);

    const rangeLabel = from && to ? `${from} to ${to}` : 'all records';
    const readmeLines = [
      'Rental History Export (Owner Only)',
      '===================================',
      '',
      'Files:',
      '  rental_history.csv  - Completed rental records with customer ID and signature information.',
      '  signatures/         - Customer signature PNG files.',
      '',
      'CSV Column Reference:',
      '  customer_signature_file  Points to the matching PNG inside the signatures/ folder.',
      '                           If blank, no signature file was available for that rental.',
      '  full_id_number           Full customer ID number as provided at intake.',
      '                           Blank if no submission was linked to the rental.',
      '  id_masked                Last-4 digits of the ID (safe for staff view).',
      '',
      'Matching:',
      '  Each CSV row has a customer_signature_file column.',
      '  Use the rental_number or rental_id to identify the matching signature PNG.',
      '  PNG filenames use rental_number only — full ID numbers are not in filenames.',
      '',
      `Date range: ${rangeLabel}`,
      `Exported at: ${new Date().toISOString()} (UTC)`,
      'Dates are stored and filtered in UTC.',
      '',
      'SECURITY NOTICE:',
      '  This export contains sensitive customer ID information and customer signatures.',
      '  Store this file securely. Do not share with staff or unauthorized parties.',
    ];

    if (missingSigs.length > 0) {
      readmeLines.push(
        '',
        `Note: ${missingSigs.length} signature file(s) could not be retrieved and are excluded from signatures/.`,
        `Missing: ${missingSigs.join(', ')}`,
      );
    }

    zipFiles['README.txt'] = strToU8(readmeLines.join('\n'));

    const fromLabel = from ?? 'all';
    const toLabel = to ?? 'all';
    const zipFilename = `rental-history_${fromLabel}_to_${toLabel}.zip`;

    const zipped = zipSync(zipFiles, { level: 6 });

    await adminClient.from('audit_logs').insert({
      actor_user_id: session.user.id,
      action: 'EXPORT_RENTAL_HISTORY_ZIP',
      entity_type: 'rental',
      entity_id: null,
      metadata: {
        from_date: from,
        to_date: to,
        record_count: rentals.length,
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
