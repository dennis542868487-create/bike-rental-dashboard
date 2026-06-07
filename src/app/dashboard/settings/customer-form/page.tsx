import { DashboardBackLink } from '@/components/dashboard-back-link';
import { FormInfoEditForm } from '@/components/form-info-edit-form';
import { InlineNotice } from '@/components/inline-notice';
import { IdTypeOptionsEditForm } from '@/components/id-type-options-edit-form';
import { PageHeader } from '@/components/page-header';
import { WaiverSettingsEditForm } from '@/components/waiver-settings-edit-form';
import { getBusinessSettings } from '@/lib/business-settings';
import { getAllIdTypeOptions } from '@/lib/id-type-settings';
import { getActiveWaiverSettings } from '@/lib/waiver-settings';

export default async function CustomerFormSettingsPage() {
  const [businessSettings, idTypeOptions, waiver] = await Promise.all([
    getBusinessSettings(),
    getAllIdTypeOptions(),
    getActiveWaiverSettings(),
  ]);

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader
        title="Customer Form Settings"
        description="Manage the public rental form title, instructions, photo ID options, waiver text, and confirmation message."
      />

      {/* Form title + intro */}
      <FormInfoEditForm
        id={businessSettings.id}
        formTitle={businessSettings.formTitle}
        formIntro={businessSettings.formIntro}
      />

      {/* ID Type Options */}
      <section style={{ display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Photo ID Options</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Choose which photo ID options customers can select on the intake form.
          </p>
        </div>
        <IdTypeOptionsEditForm options={idTypeOptions} />
      </section>

      {/* Waiver */}
      <section style={{ display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Waiver Text</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            The waiver text and customer instructions shown during the intake form signing step.
          </p>
        </div>
        {waiver ? (
          <WaiverSettingsEditForm
            id={waiver.id}
            waiverText={waiver.waiverText}
            customerInstructions={waiver.customerInstructions}
            isActive={waiver.isActive}
          />
        ) : (
          <InlineNotice type="warning">
            No active waiver is set up yet. An administrator needs to add one before it can be edited here.
          </InlineNotice>
        )}
      </section>
    </main>
  );
}
