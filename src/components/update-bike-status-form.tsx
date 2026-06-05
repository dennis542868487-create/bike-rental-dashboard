'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateBikeStatusAction } from '@/actions/update-bike-status';

export function UpdateBikeStatusForm({
  bikeId,
  currentStatus,
}: {
  bikeId: string;
  currentStatus: 'available' | 'rented' | 'maintenance';
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Update Bike Status</h2>

      <label>
        <div>Status</div>
        <select id="bikeStatus" defaultValue={currentStatus} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button
        type="button"
        onClick={() => {
          const status = (document.getElementById('bikeStatus') as HTMLSelectElement | null)?.value as 'available' | 'rented' | 'maintenance';

          startTransition(async () => {
            const result = await updateBikeStatusAction({ bikeId, status });
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
        {isPending ? 'Saving...' : 'Update Status'}
      </button>
    </section>
  );
}
