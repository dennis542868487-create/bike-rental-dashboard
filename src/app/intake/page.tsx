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
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--border)',
        padding: '24px 16px 48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: '100%', maxWidth: 640 }}>
        {/* Page title — simple, no brand section */}
        <div style={{ marginBottom: 20, paddingLeft: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            {businessSettings.formTitle}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            {businessSettings.formIntro}
          </p>
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
      </div>
    </main>
  );
}
