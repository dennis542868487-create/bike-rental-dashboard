'use client';

import { useState } from 'react';
import type { MorningCheckHistoryRow } from '@/types/morning-check-history';

type MorningCheckHistoryTableProps = {
  rows: MorningCheckHistoryRow[];
};

const STATUS_LABELS: Record<string, string> = {
  all_good: 'All Good',
  front_tire_flat: 'Front Tire Flat',
  rear_tire_flat: 'Rear Tire Flat',
  sent_to_maintenance: 'Sent to Maintenance',
};

type DayGroup = {
  checkDate: string;
  submittedAt: string;
  total: number;
  issues: number;
  rows: MorningCheckHistoryRow[];
};

function groupByDate(rows: MorningCheckHistoryRow[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const row of rows) {
    let group = map.get(row.checkDate);
    if (!group) {
      group = { checkDate: row.checkDate, submittedAt: row.submittedAt, total: 0, issues: 0, rows: [] };
      map.set(row.checkDate, group);
    }
    group.total += 1;
    if (row.checkStatus !== 'all_good') group.issues += 1;
    group.rows.push(row);
  }
  return Array.from(map.values());
}

export function MorningCheckHistoryTable({ rows }: MorningCheckHistoryTableProps) {
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());

  const toggleDate = (date: string) => {
    setOpenDates((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  };

  if (rows.length === 0) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, background: '#fff', color: '#6b7280', textAlign: 'center' }}>
        No morning check history yet.
      </div>
    );
  }

  const groups = groupByDate(rows);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {groups.map((group) => {
        const isOpen = openDates.has(group.checkDate);
        return (
          <div key={group.checkDate} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            {/* Summary row — always visible */}
            <button
              type="button"
              onClick={() => toggleDate(group.checkDate)}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto auto',
                gap: 16,
                padding: '12px 16px',
                background: '#f9fafb',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 15 }}>{group.checkDate}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{group.total} bikes</div>
              <div style={{ fontSize: 13, color: group.issues > 0 ? '#dc2626' : '#16a34a', fontWeight: 500 }}>
                {group.issues > 0 ? `${group.issues} issue${group.issues > 1 ? 's' : ''}` : 'No issues'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{group.submittedAt}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{isOpen ? '▲' : '▼'}</div>
            </button>

            {/* Detail rows — expandable */}
            {isOpen && (
              <div>
                {/* Detail header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 70px 1fr 160px 1fr',
                  padding: '8px 16px',
                  borderTop: '1px solid #e5e7eb',
                  background: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6b7280',
                  gap: 8,
                }}>
                  <div>Bike #</div>
                  <div>Type</div>
                  <div>Area</div>
                  <div>Result</div>
                  <div>Notes</div>
                </div>

                {group.rows.map((row, i) => (
                  <div
                    key={`${row.id}-${row.bikeNumber}-${i}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '90px 70px 1fr 160px 1fr',
                      padding: '8px 16px',
                      borderTop: '1px solid #f3f4f6',
                      fontSize: 13,
                      alignItems: 'start',
                      gap: 8,
                      background: row.checkStatus === 'sent_to_maintenance' ? '#fef2f2'
                        : row.checkStatus !== 'all_good' ? '#fffbeb'
                        : '#fff',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{row.bikeNumber}</div>
                    <div style={{ color: '#6b7280', textTransform: 'capitalize' }}>{row.bikeType || '—'}</div>
                    <div style={{ color: '#6b7280' }}>{row.areaName}</div>
                    <div style={{ color: row.checkStatus === 'all_good' ? '#16a34a' : '#dc2626' }}>
                      {STATUS_LABELS[row.checkStatus] ?? row.checkStatus}
                    </div>
                    <div style={{ color: '#374151' }}>{row.itemNotes || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
