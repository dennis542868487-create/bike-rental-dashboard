import Link from 'next/link';
import { StatusBadge } from '@/components/status-badge';
import type { ActiveRentalRow } from '@/types/active-rental';

type ActiveRentalsTableProps = {
  rows: ActiveRentalRow[];
};

export function ActiveRentalsTable({ rows }: ActiveRentalsTableProps) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-muted)', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Rental #</th>
            <th style={{ padding: 12 }}>Customer</th>
            <th style={{ padding: 12 }}>Phone</th>
            <th style={{ padding: 12 }}>Bikes</th>
            <th style={{ padding: 12 }}>Start Time</th>
            <th style={{ padding: 12 }}>Fee</th>
            <th style={{ padding: 12 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                No active rentals.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 12 }}>
                  <Link href={`/dashboard/active/${row.id}`} style={{ color: 'var(--info)', textDecoration: 'none' }}>
                    {row.rentalNumber}
                  </Link>
                </td>
                <td style={{ padding: 12 }}>{row.customerName}</td>
                <td style={{ padding: 12 }}>{row.phoneNumber}</td>
                <td style={{ padding: 12 }}>{row.bikes}</td>
                <td style={{ padding: 12 }}>{row.startTime}</td>
                <td style={{ padding: 12 }}>{row.fee}</td>
                <td style={{ padding: 12 }}><StatusBadge status={row.status} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
