import { DashboardBackLink } from '@/components/dashboard-back-link';
import { FormInfoEditForm } from '@/components/form-info-edit-form';
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
        description="Customize the public rental form title, instructions, ID options, waiver text, and success message."
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
          <h2 style={{ margin: 0, fontSize: 18 }}>Photo ID Options</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Controls the ID type dropdown shown to customers on the intake form.
          </p>
        </div>
        <IdTypeOptionsEditForm options={idTypeOptions} />
      </section>

      {/* Waiver */}
      <section style={{ display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>Waiver Text</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
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
          <div style={{ border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: 16 }}>
            No active waiver found. Please seed one via Supabase before editing here.
          </div>
        )}
      </section>
    </main>
  );
}
