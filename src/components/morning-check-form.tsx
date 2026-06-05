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
  bikeType: string;
  areaId: string | null;
  area: string;
  status: 'all_good' | 'front_tire_flat' | 'rear_tire_flat' | 'sent_to_maintenance';
  notes: string;
  noteOpen: boolean;
};

const STATUS_LABELS: Record<string, string> = {
  all_good: 'All Good',
  front_tire_flat: 'Front Tire Flat',
  rear_tire_flat: 'Rear Tire Flat',
  sent_to_maintenance: 'Sent to Maintenance',
};

export function MorningCheckForm({ items }: MorningCheckFormProps) {
  const initialItems = useMemo<EditableMorningCheckItem[]>(() => {
    return items.map((item) => ({
      id: item.id,
      bikeNumber: item.bikeNumber,
      bikeType: item.bikeType,
      areaId: item.areaId,
      area: item.area,
      status: item.status,
      notes: item.notes ?? '',
      noteOpen: !!item.notes,
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
      {/* Check Date */}
      <section style={{ display: 'grid', gap: 8, maxWidth: 280 }}>
        <label>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Check Date</div>
          <input
            type="date"
            value={checkDate}
            onChange={(e) => setCheckDate(e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}
          />
        </label>
      </section>

      {/* Bike Table */}
      {hasItems ? (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 80px 1fr 220px 90px',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            padding: '10px 12px',
            fontWeight: 600,
            fontSize: 13,
            color: '#374151',
            gap: 8,
          }}>
            <div>Bike #</div>
            <div>Type</div>
            <div>Area</div>
            <div>Status</div>
            <div>Notes</div>
          </div>

          {formItems.map((item, index) => (
            <div key={item.id}>
              {/* Main row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '100px 80px 1fr 220px 90px',
                padding: '10px 12px',
                borderTop: index > 0 ? '1px solid #f3f4f6' : undefined,
                alignItems: 'center',
                gap: 8,
                background: item.status === 'sent_to_maintenance' ? '#fef2f2'
                  : item.status !== 'all_good' ? '#fffbeb'
                  : '#fff',
              }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.bikeNumber}</div>
                <div style={{ fontSize: 13, color: '#6b7280', textTransform: 'capitalize' }}>{item.bikeType}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{item.area}</div>
                <select
                  value={item.status}
                  onChange={(e) => updateItem(item.id, { status: e.target.value as EditableMorningCheckItem['status'] })}
                  style={{
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 13,
                    background: item.status === 'sent_to_maintenance' ? '#fee2e2'
                      : item.status !== 'all_good' ? '#fef9c3'
                      : '#fff',
                  }}
                >
                  <option value="all_good">All Good</option>
                  <option value="front_tire_flat">Front Tire Flat</option>
                  <option value="rear_tire_flat">Rear Tire Flat</option>
                  <option value="sent_to_maintenance">Sent to Maintenance</option>
                </select>
                <button
                  type="button"
                  onClick={() => updateItem(item.id, { noteOpen: !item.noteOpen })}
                  style={{
                    padding: '5px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    background: item.notes ? '#f0fdf4' : '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: item.notes ? '#16a34a' : '#6b7280',
                  }}
                >
                  {item.notes ? '✎ Note' : '+ Note'}
                </button>
              </div>

              {/* Expandable notes row */}
              {item.noteOpen && (
                <div style={{ padding: '0 12px 10px', borderTop: '1px dashed #f3f4f6' }}>
                  <textarea
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                    placeholder="Add a note for this bike…"
                    rows={2}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 13,
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', color: '#6b7280' }}>
          No bikes are currently available for Morning Check. Only non-rented, non-archived bikes appear here.
        </div>
      )}

      {/* Staff Signature */}
      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 8 }}>
        <div style={{ fontWeight: 500, fontSize: 15 }}>Staff Signature <span style={{ color: '#dc2626' }}>*</span></div>
        <SignaturePadInput value={signatureDataUrl} onChange={setSignatureDataUrl} />
      </section>

      {message ? (
        <p style={{ margin: 0, color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !hasItems}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff', maxWidth: 240 }}
      >
        {isPending ? 'Submitting…' : 'Submit Morning Check'}
      </button>
    </div>
  );
}
