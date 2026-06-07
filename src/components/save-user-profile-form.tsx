'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveUserProfileAction } from '@/actions/save-user-profile';
import { InlineNotice } from '@/components/inline-notice';

export function SaveUserProfileForm({
  profileId,
  defaultValues,
}: {
  profileId: string;
  defaultValues: {
    email: string;
    fullName: string;
    role: 'owner' | 'staff';
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Update User Profile</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Email</div>
          <input id="userEmail" type="email" defaultValue={defaultValues.email} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }} />
        </label>
        <label>
          <div>Full Name</div>
          <input id="userFullName" type="text" defaultValue={defaultValues.fullName} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Role</div>
          <select id="userRole" defaultValue={defaultValues.role} style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}>
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 28 }}>
          <input id="userIsActive" type="checkbox" defaultChecked={defaultValues.isActive} />
          <span>Active</span>
        </label>
      </div>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          const email = (document.getElementById('userEmail') as HTMLInputElement | null)?.value ?? '';
          const fullName = (document.getElementById('userFullName') as HTMLInputElement | null)?.value ?? '';
          const role = (document.getElementById('userRole') as HTMLSelectElement | null)?.value as 'owner' | 'staff';
          const isActive = (document.getElementById('userIsActive') as HTMLInputElement | null)?.checked ?? false;

          startTransition(async () => {
            const result = await saveUserProfileAction({
              profileId,
              email,
              fullName,
              role,
              isActive,
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
        {isPending ? 'Saving...' : 'Save User Profile'}
      </button>
    </section>
  );
}
