import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { PageHeader } from '@/components/page-header';
import { getActiveIdTypeSettings } from '@/lib/id-type-settings';

export default async function IdTypeSettingsPage() {
  const settings = await getActiveIdTypeSettings();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader title="ID Type Settings" description="Manage the customer-facing photo ID options." />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Source Version:</strong> {settings?.version ?? '—'}</div>
          <div><strong>Option Count:</strong> {settings?.idTypeOptions.length ?? 0}</div>
        </DetailInfoGrid>

        <div>
          <strong>ID Type Options</strong>
          {(settings?.idTypeOptions?.length ?? 0) > 0 ? (
            <ul style={{ marginTop: 8, color: '#374151' }}>
              {(settings?.idTypeOptions ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <div style={{ marginTop: 8, color: '#6b7280' }}>No ID type options configured.</div>
          )}
        </div>
      </DetailSection>
    </main>
  );
}
