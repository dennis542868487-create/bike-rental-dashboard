import { IntakeForm } from '@/components/intake-form';
import { getBusinessSettings } from '@/lib/business-settings';
import { getActiveIdTypeOptions } from '@/lib/id-type-settings';
import { getActiveWaiverSettings } from '@/lib/waiver-settings';

export default async function IntakePage() {
  const [waiverSettings, idTypeOptions, businessSettings] = await Promise.all([
    getActiveWaiverSettings(),
    getActiveIdTypeOptions(),
    getBusinessSettings(),
  ]);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'start center', padding: 24, background: '#f9fafb' }}>
      <section style={{ width: '100%', maxWidth: 720, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, display: 'grid', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>{businessSettings.businessName} Rental Form</h1>
          <p style={{ color: '#6b7280' }}>Please complete this form before renting your bike.</p>
        </div>

        {!waiverSettings ? (
          <div style={{ border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: 16 }}>
            Waiver settings are not available right now. Please ask staff for help before continuing.
          </div>
        ) : (
          <IntakeForm
            waiverVersion={waiverSettings.version}
            waiverText={waiverSettings.waiverText}
            customerInstructions={waiverSettings.customerInstructions}
            idTypeOptions={idTypeOptions}
          />
        )}
      </section>
    </main>
  );
}
