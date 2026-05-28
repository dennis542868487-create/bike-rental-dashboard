import Link from 'next/link';
import type { BikeRow } from '@/types/bike';

type BikesTableProps = {
  rows: BikeRow[];
};

export function BikesTable({ rows }: BikesTableProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Bike #</th>
            <th style={{ padding: 12 }}>Type</th>
            <th style={{ padding: 12 }}>Size</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Area</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                No bikes found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>
                  <Link href={`/dashboard/bikes/${row.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {row.bikeNumber}
                  </Link>
                </td>
                <td style={{ padding: 12 }}>{row.bikeType}</td>
                <td style={{ padding: 12 }}>{row.size}</td>
                <td style={{ padding: 12 }}>{row.status}</td>
                <td style={{ padding: 12 }}>{row.area}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
