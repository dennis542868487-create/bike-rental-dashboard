import Link from 'next/link';
import type { ActiveRentalRow } from '@/types/active-rental';

type ActiveRentalsTableProps = {
  rows: ActiveRentalRow[];
};

export function ActiveRentalsTable({ rows }: ActiveRentalsTableProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
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
              <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                No active rentals.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>
                  <Link href={`/dashboard/active/${row.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {row.rentalNumber}
                  </Link>
                </td>
                <td style={{ padding: 12 }}>{row.customerName}</td>
                <td style={{ padding: 12 }}>{row.phoneNumber}</td>
                <td style={{ padding: 12 }}>{row.bikes}</td>
                <td style={{ padding: 12 }}>{row.startTime}</td>
                <td style={{ padding: 12 }}>{row.fee}</td>
                <td style={{ padding: 12 }}>{row.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
