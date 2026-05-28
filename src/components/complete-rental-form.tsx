'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { completeRentalAction } from '@/actions/complete-rental';

type CompleteRentalFormProps = {
  rentalId: string;
};

export function CompleteRentalForm({ rentalId }: CompleteRentalFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Complete Rental</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Actual Return Time</div>
          <input id="actualReturnTime" type="datetime-local" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Final Fee</div>
          <input id="finalFee" type="number" min="0" step="0.01" defaultValue="0" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <label>
        <div>Completion Notes</div>
        <textarea id="completionNotes" placeholder="Optional notes when closing this rental" style={{ width: '100%', minHeight: 100, padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
      </label>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input id="sendToMaintenance" type="checkbox" />
        <span>Send bikes to maintenance after return</span>
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button
        type="button"
        onClick={() => {
          const actualReturnTime = (document.getElementById('actualReturnTime') as HTMLInputElement | null)?.value ?? '';
          const finalFee = Number((document.getElementById('finalFee') as HTMLInputElement | null)?.value ?? 0);
          const notes = (document.getElementById('completionNotes') as HTMLTextAreaElement | null)?.value ?? '';
          const sendToMaintenance = (document.getElementById('sendToMaintenance') as HTMLInputElement | null)?.checked ?? false;

          startTransition(async () => {
            const result = await completeRentalAction({
              rentalId,
              actualReturnTime,
              finalFee,
              notes,
              sendToMaintenance,
            });

            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');

            if (result.ok) {
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Completing...' : 'Complete Rental'}
      </button>
    </section>
  );
}
