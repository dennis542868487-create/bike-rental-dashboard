'use client';

import { useState } from 'react';
import type { ReportSummary } from '@/lib/reports';

type Period = 'today' | 'thisMonth' | 'thisYear';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  thisMonth: 'This Month',
  thisYear: 'This Year',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  unpaid: 'Unpaid',
  waived: 'Waived',
  refunded: 'Refunded',
};

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 20px 16px', background: '#fff' }}>
      <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, letterSpacing: '0.02em' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, color: '#111827', lineHeight: 1.1 }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>{sub}</div> : null}
    </div>
  );
}

function SmallCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', background: '#fff' }}>
      <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6, color: accent ?? '#111827' }}>{value}</div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ReportsContent({ data }: { data: ReportSummary }) {
  const [period, setPeriod] = useState<Period>('thisMonth');
  const selected = data.periods[period];

  return (
    <div style={{ display: 'grid', gap: 28 }}>
      {/* UTC note — small and soft */}
      <div style={{ fontSize: 12, color: '#9ca3af', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 8, padding: '6px 12px' }}>
        Note: Current report ranges use UTC until local timezone reporting is implemented.
      </div>

      {/* Date range tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid',
              borderColor: period === p ? '#111827' : '#e5e7eb',
              background: period === p ? '#111827' : '#fff',
              color: period === p ? '#fff' : '#374151',
              fontWeight: period === p ? 600 : 400,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Top KPI Row */}
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Key Metrics — {PERIOD_LABELS[period]}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <KpiCard label="Revenue" value={selected.revenue} sub={PERIOD_LABELS[period]} />
          <KpiCard label="Completed Rentals" value={selected.completedRentals} sub={PERIOD_LABELS[period]} />
          <KpiCard label="Active Rentals" value={data.current.activeRentals} sub="Right now" />
          <KpiCard label="Pending Submissions" value={data.current.pendingSubmissions} sub="Awaiting start" />
        </div>
      </section>

      {/* Payment Breakdown */}
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Payment Breakdown <span style={{ fontWeight: 400, color: '#9ca3af', textTransform: 'none', letterSpacing: 0 }}>— all completed rentals</span>
        </h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
          {(
            [
              { key: 'paid', value: data.payments.paid, color: '#16a34a' },
              { key: 'unpaid', value: data.payments.unpaid, color: '#dc2626' },
              { key: 'waived', value: data.payments.waived, color: '#6b7280' },
              { key: 'refunded', value: data.payments.refunded, color: '#d97706' },
            ] as const
          ).map((row, i) => (
            <div
              key={row.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 20px',
                borderTop: i > 0 ? '1px solid #f3f4f6' : undefined,
              }}
            >
              <span style={{ fontSize: 14, color: '#374151' }}>{PAYMENT_STATUS_LABELS[row.key]}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Operations */}
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Operational Health
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <SmallCard label="Bikes in Maintenance" value={data.current.bikesInMaintenance} accent={data.current.bikesInMaintenance > 0 ? '#d97706' : undefined} />
          <SmallCard label="Maintenance After Rental" value={data.operations.maintenanceNeeded} />
          <SmallCard label="Incident Flags" value={data.operations.incidentFlags} accent={data.operations.incidentFlags > 0 ? '#dc2626' : undefined} />
          <SmallCard label="All-time Completed" value={data.allTime.completedRentals} />
        </div>
      </section>

      {/* Trend placeholder */}
      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, background: '#f9fafb', textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Revenue & Rental Trends</div>
        <div style={{ fontSize: 13, color: '#9ca3af' }}>
          Trend charts will appear after more completed rental data is available.
        </div>
      </section>

      {/* Recent completed rentals */}
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recent Completed Rentals
        </h2>
        {data.recentRentals.length === 0 ? (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, background: '#fff', color: '#6b7280', textAlign: 'center' }}>
            No completed rentals yet.
          </div>
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 1fr 100px 90px',
              padding: '10px 16px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: 12,
              fontWeight: 600,
              color: '#6b7280',
              gap: 8,
            }}>
              <div>Completed</div>
              <div>Customer</div>
              <div>Bikes</div>
              <div>Amount</div>
              <div>Payment</div>
            </div>
            {data.recentRentals.map((row, i) => (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr 100px 90px',
                  padding: '10px 16px',
                  borderTop: i > 0 ? '1px solid #f3f4f6' : undefined,
                  fontSize: 13,
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{ color: '#6b7280' }}>{formatDate(row.completedAt)}</div>
                <div style={{ fontWeight: 500 }}>{row.customerName}</div>
                <div style={{ color: '#6b7280' }}>{row.bikeNumbers}</div>
                <div style={{ fontWeight: 600 }}>{row.fee}</div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 20,
                  display: 'inline-block',
                  background: row.paymentStatus === 'paid' ? '#dcfce7'
                    : row.paymentStatus === 'unpaid' ? '#fee2e2'
                    : row.paymentStatus === 'waived' ? '#f3f4f6'
                    : '#fef9c3',
                  color: row.paymentStatus === 'paid' ? '#16a34a'
                    : row.paymentStatus === 'unpaid' ? '#dc2626'
                    : row.paymentStatus === 'waived' ? '#6b7280'
                    : '#d97706',
                  textTransform: 'capitalize',
                }}>
                  {PAYMENT_STATUS_LABELS[row.paymentStatus] ?? row.paymentStatus}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
