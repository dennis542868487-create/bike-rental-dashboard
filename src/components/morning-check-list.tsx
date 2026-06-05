import type { MorningCheckItem } from '@/types/morning-check';

type MorningCheckListProps = {
  items: MorningCheckItem[];
};

export function MorningCheckList({ items }: MorningCheckListProps) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((item) => (
        <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
          <div style={{ fontWeight: 600 }}>{item.bikeNumber}</div>
          <div style={{ color: '#6b7280', marginTop: 4 }}>{item.area}</div>
          <div style={{ marginTop: 8 }}>Status: {item.status}</div>
          {item.notes ? <div style={{ marginTop: 8, color: '#6b7280' }}>Notes: {item.notes}</div> : null}
        </div>
      ))}
    </div>
  );
}
