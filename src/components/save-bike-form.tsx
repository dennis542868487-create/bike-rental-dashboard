'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveBikeAction } from '@/actions/save-bike';

export function SaveBikeForm({
  bikeId,
  defaultValues,
}: {
  bikeId?: string;
  defaultValues?: {
    bikeNumber?: string;
    bikeType?: string;
    size?: string;
    notes?: string;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>{bikeId ? 'Edit Bike' : 'Add Bike'}</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Bike Number</div>
          <input id="bikeNumber" type="text" defaultValue={defaultValues?.bikeNumber ?? ''} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Bike Type</div>
          <input id="bikeType" type="text" defaultValue={defaultValues?.bikeType ?? ''} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Size</div>
          <input id="bikeSize" type="text" defaultValue={defaultValues?.size ?? ''} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <label>
        <div>Notes</div>
        <textarea id="bikeNotes" defaultValue={defaultValues?.notes ?? ''} style={{ width: '100%', minHeight: 100, padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button
        type="button"
        onClick={() => {
          const bikeNumber = (document.getElementById('bikeNumber') as HTMLInputElement | null)?.value ?? '';
          const bikeType = (document.getElementById('bikeType') as HTMLInputElement | null)?.value ?? '';
          const size = (document.getElementById('bikeSize') as HTMLInputElement | null)?.value ?? '';
          const notes = (document.getElementById('bikeNotes') as HTMLTextAreaElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await saveBikeAction({
              bikeId,
              bikeNumber,
              bikeType,
              size,
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
        {isPending ? 'Saving...' : bikeId ? 'Save Bike' : 'Create Bike'}
      </button>
    </section>
  );
}
