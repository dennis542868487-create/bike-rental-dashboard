'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { archiveBikeAction } from '@/actions/archive-bike';
import { InlineNotice } from '@/components/inline-notice';

export function ArchiveBikeForm({ bikeId }: { bikeId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #fed7aa', borderRadius: 12, padding: 16, background: '#fff7ed', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18, color: '#9a3412' }}>Archive Bike</h2>
      <p style={{ margin: 0, color: '#9a3412' }}>Archive this bike to remove it from active inventory lists.</p>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            const result = await archiveBikeAction({ bikeId });
            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');

            if (result.ok) {
              router.push('/dashboard/bikes');
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#c2410c', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Archiving...' : 'Archive Bike'}
      </button>
    </section>
  );
}
