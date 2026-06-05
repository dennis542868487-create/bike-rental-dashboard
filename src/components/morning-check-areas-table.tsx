import type { MorningCheckAreaRow } from '@/types/morning-check-area';

type MorningCheckAreasTableProps = {
  rows: MorningCheckAreaRow[];
};

export function MorningCheckAreasTable({ rows }: MorningCheckAreasTableProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Area</th>
            <th style={{ padding: 12 }}>Order</th>
            <th style={{ padding: 12 }}>Active</th>
            <th style={{ padding: 12 }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                No morning check areas configured.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{row.name}</td>
                <td style={{ padding: 12 }}>{row.displayOrder}</td>
                <td style={{ padding: 12 }}>{row.isActive ? 'Yes' : 'No'}</td>
                <td style={{ padding: 12 }}>{row.notes || '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
