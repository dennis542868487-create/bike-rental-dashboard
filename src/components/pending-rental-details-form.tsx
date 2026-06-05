'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cancelSubmissionAction } from '@/actions/cancel-submission';
import { startRentalAction } from '@/actions/start-rental';
import type { AvailableBikeOption } from '@/lib/available-bikes';

type PendingRentalDetailsFormProps = {
  submissionId: string;
  submittedAt: string;
  availableBikes: AvailableBikeOption[];
};

export function PendingRentalDetailsForm({ submissionId, submittedAt, availableBikes }: PendingRentalDetailsFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Rental Details</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <label>
          <div>Adult Bike Quantity</div>
          <input id="adultBikeQuantity" type="number" min="0" defaultValue="0" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Kid Bike Quantity</div>
          <input id="kidBikeQuantity" type="number" min="0" defaultValue="0" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Trailer Quantity</div>
          <input id="trailerQuantity" type="number" min="0" defaultValue="0" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Customer Submitted At</div>
          <div style={{ padding: '10px 0', fontSize: 14 }}>{submittedAt}</div>
        </div>
        <label>
          <div>Start Time</div>
          <input id="startTime" type="datetime-local" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <label>
        <div>Assign Bikes</div>
        <select id="bikeIds" multiple style={{ width: '100%', minHeight: 140, padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}>
          {availableBikes.map((bike) => (
            <option key={bike.id} value={bike.id}>
              {bike.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <div>Staff Notes</div>
        <textarea id="staffNotes" placeholder="Optional notes for this rental" style={{ width: '100%', minHeight: 100, padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            const adultBikeQuantity = Number((document.getElementById('adultBikeQuantity') as HTMLInputElement | null)?.value ?? 0);
            const kidBikeQuantity = Number((document.getElementById('kidBikeQuantity') as HTMLInputElement | null)?.value ?? 0);
            const trailerQuantity = Number((document.getElementById('trailerQuantity') as HTMLInputElement | null)?.value ?? 0);
            const startTime = (document.getElementById('startTime') as HTMLInputElement | null)?.value ?? '';
            const notes = (document.getElementById('staffNotes') as HTMLTextAreaElement | null)?.value ?? '';
            const bikeIds = Array.from((document.getElementById('bikeIds') as HTMLSelectElement | null)?.selectedOptions ?? []).map((option) => option.value);

            startTransition(async () => {
              const result = await startRentalAction({
                submissionId,
                adultBikeQuantity,
                kidBikeQuantity,
                trailerQuantity,
                bikeIds,
                startTime,
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
          {isPending ? 'Starting...' : 'Start Rental'}
        </button>

        <button
          type="button"
          onClick={() => {
            const notes = (document.getElementById('staffNotes') as HTMLTextAreaElement | null)?.value ?? '';

            startTransition(async () => {
              const result = await cancelSubmissionAction({
                submissionId,
                reason: notes,
              });

              setMessage(result.message);
              setMessageType(result.ok ? 'success' : 'error');

              if (result.ok) {
                router.push('/dashboard/pending');
                router.refresh();
              }
            });
          }}
          disabled={isPending}
          style={{ padding: 14, borderRadius: 12, border: '1px solid #d1d5db', background: '#fff', color: '#111827', maxWidth: 220 }}
        >
          {isPending ? 'Working...' : 'Cancel Submission'}
        </button>
      </div>
    </section>
  );
}
