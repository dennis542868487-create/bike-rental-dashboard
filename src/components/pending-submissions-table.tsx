import Link from 'next/link';
import type { PendingSubmissionRow } from '@/types/pending-submission';

type PendingSubmissionsTableProps = {
  rows: PendingSubmissionRow[];
};

export function PendingSubmissionsTable({ rows }: PendingSubmissionsTableProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Submission #</th>
            <th style={{ padding: 12 }}>Customer</th>
            <th style={{ padding: 12 }}>Phone</th>
            <th style={{ padding: 12 }}>Submitted At</th>
            <th style={{ padding: 12 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                No pending submissions.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>
                  <Link href={`/dashboard/pending/${row.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {row.submissionNumber}
                  </Link>
                </td>
                <td style={{ padding: 12 }}>{row.customerName}</td>
                <td style={{ padding: 12 }}>{row.phoneNumber}</td>
                <td style={{ padding: 12 }}>{row.submittedAt}</td>
                <td style={{ padding: 12 }}>{row.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
