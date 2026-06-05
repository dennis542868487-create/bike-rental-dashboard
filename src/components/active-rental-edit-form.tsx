'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateActiveRentalAction } from '@/actions/update-active-rental';

type ActiveRentalEditFormProps = {
  rentalId: string;
};

export function ActiveRentalEditForm({ rentalId }: ActiveRentalEditFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Edit Active Rental</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Return Time</div>
          <input id="activeExpectedReturnTime" type="datetime-local" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Amount Collected (Estimated)</div>
          <input id="activeEstimatedFee" type="number" min="0" step="0.01" defaultValue="0" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <label>
        <div>Notes</div>
        <textarea id="activeRentalNotes" placeholder="Update notes for this active rental" style={{ width: '100%', minHeight: 100, padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button
        type="button"
        onClick={() => {
          const expectedReturnTime = (document.getElementById('activeExpectedReturnTime') as HTMLInputElement | null)?.value ?? '';
          const estimatedFee = Number((document.getElementById('activeEstimatedFee') as HTMLInputElement | null)?.value ?? 0);
          const notes = (document.getElementById('activeRentalNotes') as HTMLTextAreaElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await updateActiveRentalAction({
              rentalId,
              expectedReturnTime,
              estimatedFee,
              notes,
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
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </section>
  );
}
