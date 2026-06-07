import type { MorningCheckItem } from '@/types/morning-check';

type MorningCheckListProps = {
  items: MorningCheckItem[];
};

export function MorningCheckList({ items }: MorningCheckListProps) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((item) => (
        <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)' }}>
          <div style={{ fontWeight: 600 }}>{item.bikeNumber}</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{item.area}</div>
          <div style={{ marginTop: 8 }}>Status: {item.status}</div>
          {item.notes ? <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>Notes: {item.notes}</div> : null}
        </div>
      ))}
    </div>
  );
}
