import Link from 'next/link';
import type { RentalHistoryRow } from '@/types/rental-history';

type RentalHistoryTableProps = {
  rows: RentalHistoryRow[];
};

export function RentalHistoryTable({ rows }: RentalHistoryTableProps) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-muted)', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Rental #</th>
            <th style={{ padding: 12 }}>Customer</th>
            <th style={{ padding: 12 }}>Bikes</th>
            <th style={{ padding: 12 }}>Completed At</th>
            <th style={{ padding: 12 }}>Fee</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                No completed rentals yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 12 }}>
                  <Link href={`/dashboard/history/${row.id}`} style={{ color: 'var(--info)', textDecoration: 'none' }}>
                    {row.rentalNumber}
                  </Link>
                </td>
                <td style={{ padding: 12 }}>{row.customerName}</td>
                <td style={{ padding: 12 }}>{row.bikeNumbers}</td>
                <td style={{ padding: 12 }}>{row.completedAt}</td>
                <td style={{ padding: 12 }}>{row.fee}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
