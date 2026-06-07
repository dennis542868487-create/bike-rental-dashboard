import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { PageHeader } from '@/components/page-header';
import { WaiverSettingsEditForm } from '@/components/waiver-settings-edit-form';
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
          <div style={{ marginTop: 8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{waiver?.customerInstructions || '—'}</div>
        </div>

        <div>
          <strong>Waiver Text</strong>
          <div style={{ marginTop: 8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{waiver?.waiverText || '—'}</div>
        </div>
      </DetailSection>

      {waiver ? (
        <WaiverSettingsEditForm
          id={waiver.id}
          waiverText={waiver.waiverText}
          customerInstructions={waiver.customerInstructions}
          isActive={waiver.isActive}
        />
      ) : (
        <div style={{ border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: 16 }}>
          No active waiver found. Please seed one via Supabase before editing here.
        </div>
      )}
    </main>
  );
}
