import { BikesPanel } from '@/components/bikes-panel';
import { PageHeader } from '@/components/page-header';
import { SaveBikeForm } from '@/components/save-bike-form';
import { getBikes } from '@/lib/bikes';
import { getMorningCheckAreas } from '@/lib/morning-check-areas';

export default async function BikesPage() {
  const [rows, allAreas] = await Promise.all([getBikes(), getMorningCheckAreas()]);
  const areas = allAreas.filter((a) => a.isActive).map((a) => ({ id: a.id, name: a.name }));

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Bikes" description="Bike inventory and current status overview." />
      <SaveBikeForm areas={areas} />
      <BikesPanel rows={rows} />
    </main>
  );
}
