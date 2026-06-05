import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { RentalHistoryPanel } from '@/components/rental-history-panel';
import { RentalHistoryExportControls } from '@/components/rental-history-export-controls';
import { getServerSessionProfile } from '@/lib/auth';
import { getRentalHistory } from '@/lib/rental-history';

export default async function HistoryPage() {
  const rows = await getRentalHistory();
  const { profile } = await getServerSessionProfile();
  const userRole = (profile as { role?: string } | null)?.role;

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Rental History" description="Completed rentals and historical records." />
      {userRole === 'owner' ? (
        <div style={{ display: 'grid', gap: 16, padding: '16px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <div>
            <Link
              href="/dashboard/history/export"
              style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', textDecoration: 'none', color: '#111827', background: '#fff' }}
            >
              Export CSV
            </Link>
          </div>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#374151' }}>
              Export ZIP (Owner Only)
            </p>
            <RentalHistoryExportControls />
          </div>
        </div>
      ) : null}
      <RentalHistoryPanel rows={rows} />
    </main>
  );
}
