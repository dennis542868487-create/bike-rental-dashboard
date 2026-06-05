'use client';

import { useMemo, useState, useTransition } from 'react';
import { SignaturePadInput } from '@/components/signature-pad-input';
import { submitMorningCheckAction } from '@/actions/morning-check';
import type { MorningCheckItem } from '@/types/morning-check';

type MorningCheckFormProps = {
  items: MorningCheckItem[];
};

type EditableMorningCheckItem = {
  id: string;
  bikeNumber: string;
  areaId: string | null;
  area: string;
  status: 'all_good' | 'front_tire_flat' | 'rear_tire_flat' | 'sent_to_maintenance';
  notes: string;
};

export function MorningCheckForm({ items }: MorningCheckFormProps) {
  const initialItems = useMemo<EditableMorningCheckItem[]>(() => {
    return items.map((item) => ({
      id: item.id,
      bikeNumber: item.bikeNumber,
      areaId: item.areaId,
      area: item.area,
      status: item.status,
      notes: item.notes ?? '',
    }));
  }, [items]);

  const [checkDate, setCheckDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [formItems, setFormItems] = useState<EditableMorningCheckItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const updateItem = (id: string, patch: Partial<EditableMorningCheckItem>) => {
    setFormItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await submitMorningCheckAction({
        checkDate,
        signatureDataUrl,
        items: formItems.map((item) => ({
          bikeId: item.id,
          areaId: item.areaId,
          checkStatus: item.status,
          notes: item.notes,
        })),
      });

      setMessage(result.message);
      setMessageType(result.ok ? 'success' : 'error');

      if (result.ok) {
        setCheckDate('');
        setSignatureDataUrl('');
        setFormItems(initialItems);
      }
    });
  };

  const hasItems = formItems.length > 0;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <section style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
        <label>
          <div>Check Date</div>
          <input
            type="date"
            value={checkDate}
            onChange={(event) => setCheckDate(event.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}
          />
        </label>
      </section>

      <div style={{ display: 'grid', gap: 12 }}>
        {hasItems ? (
          formItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 8 }}>
              <div style={{ fontWeight: 600 }}>{item.bikeNumber}</div>
              <div style={{ color: '#6b7280' }}>{item.area}</div>
              <select
                value={item.status}
                onChange={(event) => updateItem(item.id, { status: event.target.value as EditableMorningCheckItem['status'] })}
                style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}
              >
                <option value="all_good">All Good</option>
                <option value="front_tire_flat">Front Tire Flat</option>
                <option value="rear_tire_flat">Rear Tire Flat</option>
                <option value="sent_to_maintenance">Sent to Maintenance</option>
              </select>
              <textarea
                value={item.notes}
                onChange={(event) => updateItem(item.id, { notes: event.target.value })}
                placeholder="Optional notes"
                style={{ minHeight: 80, padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}
              />
            </div>
          ))
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', color: '#6b7280' }}>
            No bikes are currently available for Morning Check. Only non-rented, non-archived bikes appear here.
          </div>
        )}
      </div>

      <section style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>Staff Signature</div>
          <SignaturePadInput value={signatureDataUrl} onChange={setSignatureDataUrl} />
        </label>
        {message ? (
          <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p>
        ) : null}
        <button type="button" onClick={handleSubmit} disabled={isPending || !hasItems} style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff' }}>
          {isPending ? 'Submitting...' : 'Submit Morning Check'}
        </button>
      </section>
    </div>
  );
}
