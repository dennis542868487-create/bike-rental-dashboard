import { ActiveRentalsPanel } from '@/components/active-rentals-panel';
import { PageHeader } from '@/components/page-header';
import { getActiveRentals } from '@/lib/active-rentals';

export default async function ActivePage() {
  const rows = await getActiveRentals();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Active Rentals" description="Rentals currently in progress." />
      <ActiveRentalsPanel rows={rows} />
    </main>
  );
}
