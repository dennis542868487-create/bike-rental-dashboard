'use client';

import { useState } from 'react';

type Preset = 'today' | 'this_month' | 'custom';

const PRESET_LABELS: Record<Preset, string> = {
  today: 'Today',
  this_month: 'This Month',
  custom: 'Custom Range',
};

export function MorningCheckExportControls() {
  const [preset, setPreset] = useState<Preset>('today');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  function buildUrl(base: string): string {
    if (preset === 'today' || preset === 'this_month') {
      return `${base}?preset=${preset}`;
    }
    const params = new URLSearchParams();
    if (fromDate) params.set('from', fromDate);
    if (toDate) params.set('to', toDate);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  const csvUrl = buildUrl('/dashboard/morning-check/history/export');
  const zipUrl = buildUrl('/dashboard/morning-check/history/export-zip');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(Object.keys(PRESET_LABELS) as Preset[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPreset(p)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: preset === p ? '#111827' : '#fff',
              color: preset === p ? '#fff' : '#111827',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: preset === p ? 600 : 400,
            }}
          >
            {PRESET_LABELS[p]}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="From date"
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
          />
          <span style={{ color: '#6b7280', fontSize: 13 }}>to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="To date"
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a
          href={csvUrl}
          style={{
            display: 'inline-block',
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #d1d5db',
            textDecoration: 'none',
            color: '#111827',
            background: '#fff',
            fontSize: 14,
          }}
        >
          Export CSV
        </a>
        <a
          href={zipUrl}
          style={{
            display: 'inline-block',
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #111827',
            textDecoration: 'none',
            color: '#fff',
            background: '#111827',
            fontSize: 14,
          }}
        >
          Export ZIP
        </a>
      </div>
    </div>
  );
}
