import { MorningCheckForm } from '@/components/morning-check-form';
import { PageHeader } from '@/components/page-header';
import { getMorningCheckItems } from '@/lib/morning-check';

export default async function MorningCheckPage() {
  const items = await getMorningCheckItems();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Morning Check" description="Daily bike inspection before opening." />
      <MorningCheckForm items={items} />
    </main>
  );
}
