import type { MorningCheckHistoryRow } from '@/types/morning-check-history';

type MorningCheckHistoryTableProps = {
  rows: MorningCheckHistoryRow[];
};

export function MorningCheckHistoryTable({ rows }: MorningCheckHistoryTableProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Check Date</th>
            <th style={{ padding: 12 }}>Bike</th>
            <th style={{ padding: 12 }}>Area</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                No morning check history yet.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${row.id}-${row.bikeNumber}-${index}`} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{row.checkDate}</td>
                <td style={{ padding: 12 }}>{row.bikeNumber}</td>
                <td style={{ padding: 12 }}>{row.areaName}</td>
                <td style={{ padding: 12 }}>{row.checkStatus}</td>
                <td style={{ padding: 12 }}>{row.submittedAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
