import { MorningCheckForm } from '@/components/morning-check-form';
import { PageHeader } from '@/components/page-header';
import { getMorningCheckAreas } from '@/lib/morning-check-areas';
import { getMorningCheckItems } from '@/lib/morning-check';

export default async function MorningCheckPage() {
  const [items, allAreas] = await Promise.all([getMorningCheckItems(), getMorningCheckAreas()]);
  const areas = allAreas.filter((a) => a.isActive);

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Morning Check" description="Daily bike inspection before opening." />
      <MorningCheckForm items={items} areas={areas} />
    </main>
  );
}
