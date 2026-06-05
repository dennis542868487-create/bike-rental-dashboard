'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addIdTypeOptionAction, updateIdTypeOptionAction } from '@/actions/save-id-type-option';
import type { IdTypeOption } from '@/lib/id-type-settings';

// All values allowed by the public.id_type Postgres enum.
const ALL_ENUM_VALUES = [
  'drivers_licence',
  'passport',
  'bcid',
  'other_gov_id',
  'other',
] as const;

type Props = {
  options: IdTypeOption[];
};

export function IdTypeOptionsEditForm({ options }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  const usedValues = new Set(options.map((o) => o.value));
  const availableToAdd = ALL_ENUM_VALUES.filter((v) => !usedValues.has(v));

  function showResult(ok: boolean, msg: string) {
    setMessage(msg);
    setMessageType(ok ? 'success' : 'error');
    if (ok) router.refresh();
  }

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Edit ID Type Options</h2>

      {/* Existing options */}
      <div style={{ display: 'grid', gap: 12 }}>
        {options.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No options configured yet.</div>
        ) : (
          options.map((option) => (
            <div key={option.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{option.value}</code>
                <span style={{ fontSize: 12, color: option.isActive ? '#16a34a' : '#dc2626' }}>
                  {option.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <label>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Display Label</div>
                  <input
                    id={`label-${option.id}`}
                    type="text"
                    defaultValue={option.label}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
                  />
                </label>
                <label>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Sort Order</div>
                  <input
                    id={`sort-${option.id}`}
                    type="number"
                    defaultValue={option.sortOrder}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input id={`active-${option.id}`} type="checkbox" defaultChecked={option.isActive} />
                <span style={{ fontSize: 14 }}>Active (visible to customers)</span>
              </label>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const label = (document.getElementById(`label-${option.id}`) as HTMLInputElement | null)?.value ?? '';
                  const sortOrder = Number((document.getElementById(`sort-${option.id}`) as HTMLInputElement | null)?.value ?? 0);
                  const isActive = (document.getElementById(`active-${option.id}`) as HTMLInputElement | null)?.checked ?? false;
                  startTransition(async () => {
                    const result = await updateIdTypeOptionAction({ id: option.id, label, isActive, sortOrder });
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

      {/* Add new option */}
      {availableToAdd.length > 0 && (
        <div style={{ border: '1px solid #d1fae5', borderRadius: 10, padding: 12, background: '#f0fdf4', display: 'grid', gap: 10 }}>
          <strong>Add ID Type Option</strong>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Value</div>
              <select
                id="new-value"
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
              >
                {availableToAdd.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Display Label</div>
              <input
                id="new-label"
                type="text"
                placeholder="e.g. Other ID"
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Sort Order</div>
              <input
                id="new-sort"
                type="number"
                defaultValue={options.length + 1}
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box' }}
              />
            </label>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              const value = (document.getElementById('new-value') as HTMLSelectElement | null)?.value ?? '';
              const label = (document.getElementById('new-label') as HTMLInputElement | null)?.value ?? '';
              const sortOrder = Number((document.getElementById('new-sort') as HTMLInputElement | null)?.value ?? 0);
              startTransition(async () => {
                const result = await addIdTypeOptionAction({ value, label, sortOrder });
                showResult(result.ok, result.message);
              });
            }}
            style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#15803d', color: '#fff', maxWidth: 140, fontSize: 14 }}
          >
            {isPending ? 'Adding...' : 'Add Option'}
          </button>
        </div>
      )}

      {message ? (
        <p style={{ margin: 0, color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p>
      ) : null}
    </section>
  );
}
