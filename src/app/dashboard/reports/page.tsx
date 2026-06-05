import { PageHeader } from '@/components/page-header';
import { ReportsContent } from '@/components/reports-content';
import { getReportSummary } from '@/lib/reports';

export default async function ReportsPage() {
  const data = await getReportSummary();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader
        title="Reports"
        description="Revenue, rental activity, and operational health."
      />
      <ReportsContent data={data} />
    </main>
  );
}
