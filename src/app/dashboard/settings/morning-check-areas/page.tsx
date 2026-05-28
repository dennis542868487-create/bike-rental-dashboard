import { DashboardBackLink } from '@/components/dashboard-back-link';
import { MorningCheckAreasPanel } from '@/components/morning-check-areas-panel';
import { PageHeader } from '@/components/page-header';
import { getMorningCheckAreas } from '@/lib/morning-check-areas';

export default async function MorningCheckAreasPage() {
  const rows = await getMorningCheckAreas();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader
        title="Morning Check Areas"
        description="Manage inspection areas used during the daily bike check."
      />
      <MorningCheckAreasPanel rows={rows} />
    </main>
  );
}
