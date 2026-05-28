import type { ReportMetric } from '@/types/report';

type ReportMetricGridProps = {
  items: ReportMetric[];
};

export function ReportMetricGrid({ items }: ReportMetricGridProps) {
  if (items.length === 0) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, background: '#fff', textAlign: 'center', color: '#6b7280' }}>
        No report metrics available.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
          <div style={{ fontSize: 14, color: '#6b7280' }}>{item.label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{item.value}</div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>{item.period}</div>
        </div>
      ))}
    </div>
  );
}
