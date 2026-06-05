import Link from 'next/link';
import { DashboardBackLink } from '@/components/dashboard-back-link';
import { MorningCheckHistoryPanel } from '@/components/morning-check-history-panel';
import { PageHeader } from '@/components/page-header';
import { getServerSessionProfile } from '@/lib/auth';
import { getMorningCheckHistory } from '@/lib/morning-check-history';

export default async function MorningCheckHistoryPage() {
  const rows = await getMorningCheckHistory();
  const { profile } = await getServerSessionProfile();
  const userRole = (profile as { role?: string } | null)?.role;

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/morning-check" label="Back to Morning Check" />
      <PageHeader title="Morning Check History" description="Review previous daily inspection records." />

      {userRole === 'owner' ? (
        <div>
          <Link
            href="/dashboard/morning-check/history/export"
            style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', textDecoration: 'none', color: '#111827', background: '#fff' }}
          >
            Export CSV
          </Link>
        </div>
      ) : null}

      <MorningCheckHistoryPanel rows={rows} />
    </main>
  );
}
