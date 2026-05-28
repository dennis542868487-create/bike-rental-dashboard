import { DashboardBackLink } from '@/components/dashboard-back-link';
import { MorningCheckHistoryPanel } from '@/components/morning-check-history-panel';
import { PageHeader } from '@/components/page-header';
import { getMorningCheckHistory } from '@/lib/morning-check-history';

export default async function MorningCheckHistoryPage() {
  const rows = await getMorningCheckHistory();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/morning-check" label="Back to Morning Check" />
      <PageHeader title="Morning Check History" description="Review previous daily inspection records." />
      <MorningCheckHistoryPanel rows={rows} />
    </main>
  );
}
