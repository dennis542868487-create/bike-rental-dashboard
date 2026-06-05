'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveUserProfileAction } from '@/actions/save-user-profile';
import type { UserProfileRow } from '@/types/user-profile';

type Props = {
  users: UserProfileRow[];
};

export function UserRoleEditList({ users }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  function showResult(ok: boolean, msg: string) {
    setMessage(msg);
    setMessageType(ok ? 'success' : 'error');
    if (ok) router.refresh();
  }

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Users & Roles</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {users.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{user.fullName || '—'}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
              </div>

              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                <label>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Role</div>
                  <select
                    id={`role-${user.id}`}
                    defaultValue={user.role}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
                  >
                    <option value="staff">Staff</option>
                    <option value="owner">Owner</option>
                  </select>
                </label>

                <label style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 20 }}>
                  <input id={`active-${user.id}`} type="checkbox" defaultChecked={user.isActive} />
                  <span style={{ fontSize: 14 }}>Active</span>
                </label>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const role = (document.getElementById(`role-${user.id}`) as HTMLSelectElement | null)?.value as 'owner' | 'staff';
                  const isActive = (document.getElementById(`active-${user.id}`) as HTMLInputElement | null)?.checked ?? false;
                  startTransition(async () => {
                    const result = await saveUserProfileAction({
                      profileId: user.id,
                      email: user.email,
                      fullName: user.fullName,
                      role,
                      isActive,
                    });
                    showResult(result.ok, result.message);
                  });
                }}
                style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff', maxWidth: 100, fontSize: 14 }}
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))
        )}
      </div>

      {message ? (
        <p style={{ margin: 0, color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p>
      ) : null}
    </section>
  );
}
