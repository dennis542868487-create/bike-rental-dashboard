'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { voidRentalAction } from '@/actions/void-rental';
import { InlineNotice } from '@/components/inline-notice';

export function VoidRentalForm({ rentalId }: { rentalId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #fecaca', borderRadius: 12, padding: 16, background: '#fff7f7', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18, color: '#991b1b' }}>Owner Correction</h2>
      <p style={{ margin: 0, color: '#7f1d1d' }}>Void this rental only for exceptional correction cases.</p>

      <label>
        <div>Void Reason</div>
        <textarea id="voidReason" placeholder="Explain why this rental is being voided" style={{ width: '100%', minHeight: 96, padding: 10, marginTop: 4, border: '1px solid #fca5a5', borderRadius: 10 }} />
      </label>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          const reason = (document.getElementById('voidReason') as HTMLTextAreaElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await voidRentalAction({ rentalId, reason });
            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');

            if (result.ok) {
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#b91c1c', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Voiding...' : 'Void Rental'}
      </button>
    </section>
  );
}
