'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveBusinessSettingsAction } from '@/actions/save-business-settings';
import type { BusinessSettings } from '@/lib/business-settings';
import { InlineNotice } from '@/components/inline-notice';

export function BusinessSettingsEditForm({ settings }: { settings: BusinessSettings }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  const field = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Edit Business Settings</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div style={{ marginBottom: 4 }}>Business Name</div>
          <input id="bs-name" type="text" defaultValue={settings.businessName}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Timezone</div>
          <input id="bs-timezone" type="text" defaultValue={settings.timezone}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Primary Currency</div>
          <input id="bs-currency" type="text" defaultValue={settings.primaryCurrency}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Default Rental Duration (hours)</div>
          <input id="bs-duration" type="number" min="1" defaultValue={settings.defaultRentalDurationHours ?? ''}
            placeholder="Optional"
            style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div style={{ marginBottom: 4 }}>Phone</div>
          <input id="bs-phone" type="tel" defaultValue={settings.phone}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Email</div>
          <input id="bs-email" type="email" defaultValue={settings.email}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
        </label>
      </div>

      <label>
        <div style={{ marginBottom: 4 }}>Address</div>
        <input id="bs-address" type="text" defaultValue={settings.address}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
      </label>

      <label>
        <div style={{ marginBottom: 4 }}>Operations Note</div>
        <textarea id="bs-note" defaultValue={settings.operationsNote}
          style={{ width: '100%', minHeight: 100, padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }} />
      </label>

      {message ? (
        <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice>
      ) : null}

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const durationRaw = (field('bs-duration') as HTMLInputElement | null)?.value ?? '';
          startTransition(async () => {
            const result = await saveBusinessSettingsAction({
              id: settings.id,
              businessName: field('bs-name')?.value ?? '',
              timezone: field('bs-timezone')?.value ?? '',
              primaryCurrency: field('bs-currency')?.value ?? '',
              phone: field('bs-phone')?.value ?? '',
              email: field('bs-email')?.value ?? '',
              address: field('bs-address')?.value ?? '',
              defaultRentalDurationHours: durationRaw ? Number(durationRaw) : null,
              operationsNote: field('bs-note')?.value ?? '',
            });
            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');
            if (result.ok) router.refresh();
          });
        }}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: 'var(--text-primary)', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </section>
  );
}
