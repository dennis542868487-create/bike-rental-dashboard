import type { ReportMetric } from '@/types/report';

type ReportMetricGridProps = {
  items: ReportMetric[];
};

export function ReportMetricGrid({ items }: ReportMetricGridProps) {
  if (items.length === 0) {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 24, background: 'var(--surface)', textAlign: 'center', color: 'var(--text-muted)' }}>
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
        <div key={item.label} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)' }}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{item.label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{item.value}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>{item.period}</div>
        </div>
      ))}
    </div>
  );
}
