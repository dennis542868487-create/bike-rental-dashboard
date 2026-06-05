import { DashboardBackLink } from '@/components/dashboard-back-link';
import { MorningCheckAreasEditForm } from '@/components/morning-check-areas-edit-form';
import { PageHeader } from '@/components/page-header';
import { getMorningCheckAreas } from '@/lib/morning-check-areas';

export default async function MorningCheckAreasPage() {
  const areas = await getMorningCheckAreas();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader
        title="Morning Check Areas"
        description="Manage inspection areas used during the daily bike check."
      />
      <MorningCheckAreasEditForm areas={areas} />
    </main>
  );
}
