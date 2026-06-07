'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { uploadBikePhotoAction } from '@/actions/upload-bike-photo';
import { InlineNotice } from '@/components/inline-notice';

export function UploadBikePhotoForm({ bikeId }: { bikeId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Upload Bike Photo</h2>

      <label>
        <div>Select Photo</div>
        <input id="bikePhotoFile" type="file" accept="image/*" style={{ width: '100%', marginTop: 8 }} />
      </label>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          const fileInput = document.getElementById('bikePhotoFile') as HTMLInputElement | null;
          const file = fileInput?.files?.[0];

          if (!file) {
            setMessage('Please choose an image file.');
            setMessageType('error');
            return;
          }

          startTransition(async () => {
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            bytes.forEach((byte) => {
              binary += String.fromCharCode(byte);
            });
            const dataBase64 = btoa(binary);

            const result = await uploadBikePhotoAction({
              bikeId,
              fileName: file.name,
              contentType: file.type,
              dataBase64,
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
        {isPending ? 'Uploading...' : 'Upload Photo'}
      </button>
    </section>
  );
}
