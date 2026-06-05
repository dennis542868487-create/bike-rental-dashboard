'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveFormInfoAction } from '@/actions/save-form-info';

type Props = {
  id: string;
  formTitle: string;
  formIntro: string;
};

export function FormInfoEditForm({ id, formTitle, formIntro }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Form Appearance</h2>
      <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
        Controls the title and intro text shown at the top of the public customer intake form.
      </p>

      <label>
        <div style={{ marginBottom: 4 }}>Form Title</div>
        <input
          id="fi-title"
          type="text"
          defaultValue={formTitle}
          placeholder="e.g. Wander Bike Rental Form"
          style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 10, boxSizing: 'border-box' }}
        />
      </label>

      <label>
        <div style={{ marginBottom: 4 }}>Form Intro / Instructions</div>
        <textarea
          id="fi-intro"
          defaultValue={formIntro}
          placeholder="e.g. Please complete this form before renting your bike."
          rows={3}
          style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 10, boxSizing: 'border-box' }}
        />
      </label>

      {message ? (
        <p style={{ margin: 0, color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p>
      ) : null}

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const title = (document.getElementById('fi-title') as HTMLInputElement | null)?.value ?? '';
          const intro = (document.getElementById('fi-intro') as HTMLTextAreaElement | null)?.value ?? '';
          startTransition(async () => {
            const result = await saveFormInfoAction({ id, formTitle: title, formIntro: intro });
            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');
            if (result.ok) router.refresh();
          });
        }}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Saving...' : 'Save Form Info'}
      </button>
    </section>
  );
}
