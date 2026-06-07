'use client';

import { useMemo, useState, useTransition } from 'react';
import { SignaturePadInput } from '@/components/signature-pad-input';
import { submitMorningCheckAction } from '@/actions/morning-check';
import type { MorningCheckItem } from '@/types/morning-check';
import type { MorningCheckAreaRow } from '@/types/morning-check-area';
import { InlineNotice } from '@/components/inline-notice';

type MorningCheckFormProps = {
  items: MorningCheckItem[];
  areas: MorningCheckAreaRow[];
};

type EditableMorningCheckItem = {
  id: string;
  bikeNumber: string;
  bikeType: string;
  areaId: string | null;
  status: 'all_good' | 'front_tire_flat' | 'rear_tire_flat' | 'sent_to_maintenance';
  notes: string;
  noteOpen: boolean;
};

type AreaGroup = {
  key: string;
  id: string | null;
  name: string;
  items: EditableMorningCheckItem[];
};

export function MorningCheckForm({ items, areas }: MorningCheckFormProps) {
  const initialItems = useMemo<EditableMorningCheckItem[]>(() => {
    return items.map((item) => ({
      id: item.id,
      bikeNumber: item.bikeNumber,
      bikeType: item.bikeType,
      areaId: item.areaId,
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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const updateItem = (id: string, patch: Partial<EditableMorningCheckItem>) => {
    setFormItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const toggleCollapsed = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const areaGroups = useMemo<AreaGroup[]>(() => {
    const activeAreaIds = new Set(areas.map((a) => a.id));
    const groups: AreaGroup[] = [];

    for (const area of areas) {
      const areaItems = formItems.filter((item) => item.areaId === area.id);
      if (areaItems.length > 0) {
        groups.push({ key: area.id, id: area.id, name: area.name, items: areaItems });
      }
    }

    const unassignedItems = formItems.filter((item) => !item.areaId || !activeAreaIds.has(item.areaId));
    if (unassignedItems.length > 0) {
      groups.push({ key: 'unassigned', id: null, name: 'Unassigned', items: unassignedItems });
    }

    return groups;
  }, [formItems, areas]);

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
        setCollapsed(new Set());
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
            style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }}
          />
        </label>
      </section>

      {/* Area Sections */}
      {hasItems ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {areaGroups.map((group) => {
            const isCollapsed = collapsed.has(group.key);
            return (
              <div
                key={group.key}
                style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}
              >
                {/* Area header */}
                <button
                  type="button"
                  onClick={() => toggleCollapsed(group.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    border: 'none',
                    background: isCollapsed ? 'var(--surface-muted)' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: isCollapsed ? 'none' : '1px solid var(--border)',
                    minHeight: 52,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                    {group.name}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {group.items.length} bike{group.items.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1 }}>
                      {isCollapsed ? '▶' : '▼'}
                    </span>
                  </span>
                </button>

                {/* Bike list (hidden when collapsed) */}
                {!isCollapsed && (
                  <div>
                    {/* Column headers */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 70px 1fr 90px',
                        padding: '8px 12px',
                        background: 'var(--surface-muted)',
                        borderBottom: '1px solid var(--border)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        gap: 8,
                      }}
                    >
                      <div>Bike #</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div>Notes</div>
                    </div>

                    {group.items.map((item, index) => (
                      <div key={item.id}>
                        {/* Bike row */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 70px 1fr 90px',
                            padding: '10px 12px',
                            borderTop: index > 0 ? '1px solid var(--border)' : undefined,
                            alignItems: 'center',
                            gap: 8,
                            minHeight: 52,
                            background:
                              item.status === 'sent_to_maintenance'
                                ? '#fef2f2'
                                : item.status !== 'all_good'
                                  ? '#fffbeb'
                                  : '#fff',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{item.bikeNumber}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            {item.bikeType}
                          </div>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateItem(item.id, {
                                status: e.target.value as EditableMorningCheckItem['status'],
                              })
                            }
                            style={{
                              width: '100%',
                              padding: '8px 6px',
                              border: '1px solid var(--border-strong)',
                              borderRadius: 8,
                              fontSize: 13,
                              background:
                                item.status === 'sent_to_maintenance'
                                  ? '#fee2e2'
                                  : item.status !== 'all_good'
                                    ? '#fef9c3'
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
                              padding: '8px 6px',
                              border: '1px solid var(--border-strong)',
                              borderRadius: 8,
                              background: item.notes ? '#f0fdf4' : '#fff',
                              cursor: 'pointer',
                              fontSize: 12,
                              color: item.notes ? '#16a34a' : 'var(--text-muted)',
                              minHeight: 36,
                              width: '100%',
                            }}
                          >
                            {item.notes ? '✎ Note' : '+ Note'}
                          </button>
                        </div>

                        {/* Inline note editor */}
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
                                border: '1px solid var(--border-strong)',
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
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 16,
            background: 'var(--surface)',
            color: 'var(--text-muted)',
          }}
        >
          No bikes are currently available for Morning Check. Only non-rented, non-archived bikes appear here.
        </div>
      )}

      {/* Staff Signature */}
      <section
        style={{
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
          background: 'var(--surface)',
          display: 'grid',
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 500, fontSize: 15 }}>
          Staff Signature <span style={{ color: '#dc2626' }}>*</span>
        </div>
        <SignaturePadInput value={signatureDataUrl} onChange={setSignatureDataUrl} />
      </section>

      {message ? (
        <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !hasItems}
        style={{
          padding: 14,
          borderRadius: 12,
          border: 'none',
          background: 'var(--text-primary)',
          color: '#fff',
          maxWidth: 240,
        }}
      >
        {isPending ? 'Submitting…' : 'Submit Morning Check'}
      </button>
    </div>
  );
}
