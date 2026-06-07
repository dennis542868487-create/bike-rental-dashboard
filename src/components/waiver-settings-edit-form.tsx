'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveWaiverSettingsAction } from '@/actions/save-waiver-settings';
import { InlineNotice } from '@/components/inline-notice';

type WaiverSettingsEditFormProps = {
  id: string;
  waiverText: string;
  customerInstructions: string;
  isActive: boolean;
};

export function WaiverSettingsEditForm({ id, waiverText, customerInstructions, isActive }: WaiverSettingsEditFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Edit Waiver Settings</h2>

      <label>
        <div style={{ marginBottom: 4 }}>Customer Instructions</div>
        <textarea
          id="waiverCustomerInstructions"
          defaultValue={customerInstructions}
          placeholder="Instructions shown to customers before the waiver"
          style={{ width: '100%', minHeight: 100, padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }}
        />
      </label>

      <label>
        <div style={{ marginBottom: 4 }}>Waiver Text</div>
        <textarea
          id="waiverText"
          defaultValue={waiverText}
          placeholder="Full waiver text customers must accept"
          style={{ width: '100%', minHeight: 240, padding: 10, border: '1px solid var(--border-strong)', borderRadius: 10, boxSizing: 'border-box' }}
        />
      </label>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input id="waiverIsActive" type="checkbox" defaultChecked={isActive} />
        <span>Active (used on the customer intake form)</span>
      </label>

      {message ? (
        <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice>
      ) : null}

      <button
        type="button"
        onClick={() => {
          const newWaiverText = (document.getElementById('waiverText') as HTMLTextAreaElement | null)?.value ?? '';
          const newInstructions = (document.getElementById('waiverCustomerInstructions') as HTMLTextAreaElement | null)?.value ?? '';
          const newIsActive = (document.getElementById('waiverIsActive') as HTMLInputElement | null)?.checked ?? false;

          startTransition(async () => {
            const result = await saveWaiverSettingsAction({
              id,
              waiverText: newWaiverText,
              customerInstructions: newInstructions,
              isActive: newIsActive,
            });

            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');

            if (result.ok) {
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: 'var(--text-primary)', color: '#fff', maxWidth: 200 }}
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </section>
  );
}
