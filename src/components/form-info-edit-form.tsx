'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveFormInfoAction } from '@/actions/save-form-info';
import { InlineNotice } from '@/components/inline-notice';

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
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Form Appearance</h2>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
        Set the title and instructions customers see at the top of the intake form.
      </p>

      <label>
        <div style={{ marginBottom: 4 }}>Form Title</div>
        <input
          id="fi-title"
          type="text"
          defaultValue={formTitle}
          placeholder="e.g. Wander Bike Rental Form"
          style={{ width: '100%', padding: 10, boxSizing: 'border-box' }}
        />
      </label>

      <label>
        <div style={{ marginBottom: 4 }}>Form Intro / Instructions</div>
        <textarea
          id="fi-intro"
          defaultValue={formIntro}
          placeholder="e.g. Please complete this form before renting your bike."
          rows={3}
          style={{ width: '100%', padding: 10, boxSizing: 'border-box' }}
        />
      </label>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

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
        style={{ padding: '12px 16px', borderRadius: 12, border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 600, maxWidth: 220 }}
      >
        {isPending ? 'Saving...' : 'Save Form Info'}
      </button>
    </section>
  );
}
