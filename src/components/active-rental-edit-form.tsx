'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateActiveRentalAction } from '@/actions/update-active-rental';
import { InlineNotice } from '@/components/inline-notice';

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type ActiveRentalEditFormProps = {
  rentalId: string;
  currentStartTime?: string | null;
  currentReturnTime?: string | null;
  currentAmountCollected?: string | null;
  currentNotes?: string | null;
};

export function ActiveRentalEditForm({
  rentalId,
  currentStartTime,
  currentReturnTime,
  currentAmountCollected,
  currentNotes,
}: ActiveRentalEditFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Edit Active Rental</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Start Time</div>
          <input
            id="activeStartTime"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(currentStartTime)}
            style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}
          />
        </label>
        <label>
          <div>Return / Completion Time</div>
          <input
            id="activeReturnTime"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(currentReturnTime)}
            style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}
          />
        </label>
        <label>
          <div>Amount Collected</div>
          <input
            id="activeAmountCollected"
            type="number"
            min="0"
            step="0.01"
            defaultValue={currentAmountCollected ?? '0'}
            style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}
          />
        </label>
      </div>

      <label>
        <div>Notes</div>
        <textarea
          id="activeRentalNotes"
          defaultValue={currentNotes ?? ''}
          placeholder="Notes for this rental"
          style={{ width: '100%', minHeight: 100, padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}
        />
      </label>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          const startTime = (document.getElementById('activeStartTime') as HTMLInputElement | null)?.value ?? '';
          const returnTime = (document.getElementById('activeReturnTime') as HTMLInputElement | null)?.value ?? '';
          const amountCollectedRaw = (document.getElementById('activeAmountCollected') as HTMLInputElement | null)?.value ?? '';
          const notes = (document.getElementById('activeRentalNotes') as HTMLTextAreaElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await updateActiveRentalAction({
              rentalId,
              startTime: startTime || undefined,
              returnTime: returnTime || undefined,
              amountCollected: amountCollectedRaw !== '' ? Number(amountCollectedRaw) : undefined,
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
        style={{ padding: 14, borderRadius: 12, border: 'none', background: 'var(--text-primary)', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </section>
  );
}
