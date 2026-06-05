'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addMorningCheckAreaAction, updateMorningCheckAreaAction } from '@/actions/save-morning-check-area';
import type { MorningCheckAreaRow } from '@/types/morning-check-area';

type Props = {
  areas: MorningCheckAreaRow[];
};

export function MorningCheckAreasEditForm({ areas }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  function showResult(ok: boolean, msg: string) {
    setMessage(msg);
    setMessageType(ok ? 'success' : 'error');
    if (ok) router.refresh();
  }

  function get<T extends HTMLInputElement | HTMLTextAreaElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Edit Morning Check Areas</h2>

      {/* Existing areas */}
      <div style={{ display: 'grid', gap: 12 }}>
        {areas.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No areas configured yet. Add one below.</div>
        ) : (
          areas.map((area) => (
            <div key={area.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong style={{ fontSize: 14 }}>{area.name}</strong>
                <span style={{ fontSize: 12, color: area.isActive ? '#16a34a' : '#dc2626' }}>
                  {area.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                <label>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Area Name</div>
                  <input
                    id={`name-${area.id}`}
                    type="text"
                    defaultValue={area.name}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
                  />
                </label>
                <label>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Display Order</div>
                  <input
                    id={`order-${area.id}`}
                    type="number"
                    defaultValue={area.displayOrder}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
                  />
                </label>
                <label>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Notes</div>
                  <input
                    id={`notes-${area.id}`}
                    type="text"
                    defaultValue={area.notes}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input id={`active-${area.id}`} type="checkbox" defaultChecked={area.isActive} />
                <span style={{ fontSize: 14 }}>Active (appears in Morning Check)</span>
              </label>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const name = get(`name-${area.id}`)?.value ?? '';
                  const order = Number(get(`order-${area.id}`)?.value ?? 0);
                  const notes = get(`notes-${area.id}`)?.value ?? '';
                  const isActive = (document.getElementById(`active-${area.id}`) as HTMLInputElement | null)?.checked ?? false;
                  startTransition(async () => {
                    const result = await updateMorningCheckAreaAction({ id: area.id, name, isActive, displayOrder: order, notes });
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

      {/* Add new area */}
      <div style={{ border: '1px solid #d1fae5', borderRadius: 10, padding: 12, background: '#f0fdf4', display: 'grid', gap: 10 }}>
        <strong>Add New Area</strong>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <label>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Area Name</div>
            <input
              id="new-area-name"
              type="text"
              placeholder="e.g. A, B, Front Rack"
              style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
            />
          </label>
          <label>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Display Order</div>
            <input
              id="new-area-order"
              type="number"
              defaultValue={areas.length + 1}
              style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
            />
          </label>
          <label>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Notes</div>
            <input
              id="new-area-notes"
              type="text"
              placeholder="Optional"
              style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
            />
          </label>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const name = get<HTMLInputElement>('new-area-name')?.value ?? '';
            const order = Number(get<HTMLInputElement>('new-area-order')?.value ?? 0);
            const notes = get<HTMLInputElement>('new-area-notes')?.value ?? '';
            startTransition(async () => {
              const result = await addMorningCheckAreaAction({ name, displayOrder: order, notes });
              showResult(result.ok, result.message);
            });
          }}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#15803d', color: '#fff', maxWidth: 140, fontSize: 14 }}
        >
          {isPending ? 'Adding...' : 'Add Area'}
        </button>
      </div>

      {message ? (
        <p style={{ margin: 0, color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p>
      ) : null}
    </section>
  );
}
