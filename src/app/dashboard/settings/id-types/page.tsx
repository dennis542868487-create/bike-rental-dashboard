import { DashboardBackLink } from '@/components/dashboard-back-link';
import { IdTypeOptionsEditForm } from '@/components/id-type-options-edit-form';
import { PageHeader } from '@/components/page-header';
import { getAllIdTypeOptions } from '@/lib/id-type-settings';

export default async function IdTypeSettingsPage() {
  const options = await getAllIdTypeOptions();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader title="ID Type Options" description="Manage the photo ID types shown on the customer intake form." />

      <IdTypeOptionsEditForm options={options} />
    </main>
  );
}
