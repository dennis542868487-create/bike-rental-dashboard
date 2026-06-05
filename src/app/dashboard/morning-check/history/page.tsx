import { DashboardBackLink } from '@/components/dashboard-back-link';
import { MorningCheckExportControls } from '@/components/morning-check-export-controls';
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

      {userRole === 'owner' ? <MorningCheckExportControls /> : null}

      <MorningCheckHistoryPanel rows={rows} />
    </main>
  );
}
