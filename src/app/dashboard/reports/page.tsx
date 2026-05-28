import { PageHeader } from '@/components/page-header';
import { ReportMetricGrid } from '@/components/report-metric-grid';
import { getReportMetricGroups } from '@/lib/reports';

export default async function ReportsPage() {
  const groups = await getReportMetricGroups();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Reports" description="Basic revenue and rental summary metrics." />

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', color: '#6b7280' }}>
        Current report ranges are calculated using UTC day, month, and year boundaries.
      </section>

      {groups.map((group) => (
        <section key={group.key} style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{group.title}</h2>
          <ReportMetricGrid items={group.items} />
        </section>
      ))}
    </main>
  );
}
