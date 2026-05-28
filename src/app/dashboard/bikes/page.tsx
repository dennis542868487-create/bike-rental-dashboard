import { BikesPanel } from '@/components/bikes-panel';
import { PageHeader } from '@/components/page-header';
import { SaveBikeForm } from '@/components/save-bike-form';
import { getBikes } from '@/lib/bikes';

export default async function BikesPage() {
  const rows = await getBikes();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Bikes" description="Bike inventory and current status overview." />
      <SaveBikeForm />
      <BikesPanel rows={rows} />
    </main>
  );
}
