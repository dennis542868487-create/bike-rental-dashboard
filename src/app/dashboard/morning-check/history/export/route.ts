import { NextResponse } from 'next/server';
import { getServerSessionProfile } from '@/lib/auth';
import { exportMorningCheckHistoryCsv } from '@/lib/morning-check-history';

export async function GET() {
  const { session, profile } = await getServerSessionProfile();
  const sessionProfile = profile as { is_active?: boolean; role?: string } | null;

  if (!session || !sessionProfile || !sessionProfile.is_active || sessionProfile.role !== 'owner') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const csv = await exportMorningCheckHistoryCsv();

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
