import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { PageHeader } from '@/components/page-header';
import { getActiveWaiverSettings } from '@/lib/waiver-settings';

export default async function WaiverSettingsPage() {
  const waiver = await getActiveWaiverSettings();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader title="Waiver Settings" description="Manage active waiver text and customer instructions." />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Active Version:</strong> {waiver?.version ?? '—'}</div>
          <div><strong>Active:</strong> {waiver?.isActive ? 'Yes' : 'No'}</div>
        </DetailInfoGrid>

        <div>
          <strong>Customer Instructions</strong>
          <div style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{waiver?.customerInstructions || '—'}</div>
        </div>

        <div>
          <strong>Waiver Text</strong>
          <div style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{waiver?.waiverText || '—'}</div>
        </div>
      </DetailSection>
    </main>
  );
}
