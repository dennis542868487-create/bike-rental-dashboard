import Link from 'next/link';
import type { SettingsEntry } from '@/types/settings';

type SettingsEntryListProps = {
  items: SettingsEntry[];
};

const entryHrefMap: Record<string, string> = {
  'customer-form': '/dashboard/settings/customer-form',
  users: '/dashboard/settings/users',
  waiver: '/dashboard/settings/waiver',
  'id-types': '/dashboard/settings/id-types',
  'morning-check': '/dashboard/settings/morning-check-areas',
};

export function SettingsEntryList({ items }: SettingsEntryListProps) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((item) => {
        const href = entryHrefMap[item.id];

        return (
          <Link
            key={item.id}
            href={href ?? '/dashboard/settings'}
            style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', textDecoration: 'none', color: '#111827', display: 'grid', gap: 6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <span style={{ color: '#2563eb', fontSize: 14 }}>Open</span>
            </div>
            <div style={{ color: '#6b7280' }}>{item.description}</div>
          </Link>
        );
      })}
    </div>
  );
}
