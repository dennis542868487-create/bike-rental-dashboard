import { type NextRequest, NextResponse } from 'next/server';
import { getServerSessionProfile } from '@/lib/auth';
import { exportMorningCheckHistoryCsv } from '@/lib/morning-check-history';

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

  try {
    const csv = await exportMorningCheckHistoryCsv(from, to);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="morning-check-history.csv"',
      },
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Export failed', { status: 500 });
  }
}
