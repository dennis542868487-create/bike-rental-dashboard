'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveUserProfileAction } from '@/actions/save-user-profile';

export function CreateUserProfileForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Create User</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Email</div>
          <input id="newUserEmail" type="email" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Password</div>
          <input id="newUserPassword" type="password" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Full Name</div>
          <input id="newUserFullName" type="text" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
        <label>
          <div>Role</div>
          <select id="newUserRole" defaultValue="staff" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}>
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
        </label>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input id="newUserIsActive" type="checkbox" defaultChecked />
        <span>Active</span>
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button
        type="button"
        onClick={() => {
          const email = (document.getElementById('newUserEmail') as HTMLInputElement | null)?.value ?? '';
          const password = (document.getElementById('newUserPassword') as HTMLInputElement | null)?.value ?? '';
          const fullName = (document.getElementById('newUserFullName') as HTMLInputElement | null)?.value ?? '';
          const role = (document.getElementById('newUserRole') as HTMLSelectElement | null)?.value as 'owner' | 'staff';
          const isActive = (document.getElementById('newUserIsActive') as HTMLInputElement | null)?.checked ?? false;

          startTransition(async () => {
            const result = await saveUserProfileAction({
              email,
              password,
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
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </section>
  );
}
