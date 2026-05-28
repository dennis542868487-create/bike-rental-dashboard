import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { PageHeader } from '@/components/page-header';
import { getBusinessSettings } from '@/lib/business-settings';

export default async function BusinessSettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader title="Business Settings" description="Core shop-level business defaults and operational notes." />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Business Name:</strong> {settings.businessName}</div>
          <div><strong>Timezone:</strong> {settings.timezone}</div>
          <div><strong>Primary Currency:</strong> {settings.primaryCurrency}</div>
        </DetailInfoGrid>

        <div>
          <strong>Deployment / Operations Note</strong>
          <div style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{settings.deploymentStageNote}</div>
        </div>
      </DetailSection>
    </main>
  );
}
