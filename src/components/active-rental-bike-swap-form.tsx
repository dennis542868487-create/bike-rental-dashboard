'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { swapRentalBikeAction } from '@/actions/swap-rental-bike';
import type { AvailableBikeOption } from '@/lib/available-bikes';
import { InlineNotice } from '@/components/inline-notice';

type ActiveRentalBikeSwapFormProps = {
  rentalId: string;
  currentBikeNumbers: string[];
  availableBikes: AvailableBikeOption[];
};

export function ActiveRentalBikeSwapForm({ rentalId, currentBikeNumbers, availableBikes }: ActiveRentalBikeSwapFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Swap Bike</h2>

      <div><strong>Currently Assigned:</strong> {currentBikeNumbers.join(', ') || '—'}</div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Bike to Remove</div>
          <select id="oldBikeId" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}>
            {currentBikeNumbers.map((bikeNumber) => (
              <option key={bikeNumber} value={bikeNumber}>{bikeNumber}</option>
            ))}
          </select>
        </label>
        <label>
          <div>Replacement Bike</div>
          <select id="newBikeId" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}>
            {availableBikes.map((bike) => (
              <option key={bike.id} value={bike.id}>{bike.label}</option>
            ))}
          </select>
        </label>
      </div>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          const oldBikeId = (document.getElementById('oldBikeId') as HTMLSelectElement | null)?.value ?? '';
          const newBikeId = (document.getElementById('newBikeId') as HTMLSelectElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await swapRentalBikeAction({
              rentalId,
              oldBikeId,
              newBikeId,
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
        {isPending ? 'Swapping...' : 'Swap Bike'}
      </button>
    </section>
  );
}
