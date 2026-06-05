import { PageHeader } from '@/components/page-header';
import { SettingsEntryList } from '@/components/settings-entry-list';
import { settingsEntries } from '@/types/settings';

export default function SettingsPage() {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Settings" description="Administrative configuration for the Wander Bike dashboard." />
      <SettingsEntryList items={settingsEntries} />
    </main>
  );
}
