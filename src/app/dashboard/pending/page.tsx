import { PageHeader } from '@/components/page-header';
import { PendingSubmissionsPanel } from '@/components/pending-submissions-panel';
import { getPendingSubmissions } from '@/lib/pending-submissions';

export default async function PendingPage() {
  const rows = await getPendingSubmissions();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Pending Submissions" description="Customer intake forms waiting for staff review." />
      <PendingSubmissionsPanel rows={rows} />
    </main>
  );
}
