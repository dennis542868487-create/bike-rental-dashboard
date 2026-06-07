import Link from 'next/link';
import type { PendingSubmissionRow } from '@/types/pending-submission';

type PendingSubmissionsTableProps = {
  rows: PendingSubmissionRow[];
};

export function PendingSubmissionsTable({ rows }: PendingSubmissionsTableProps) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-muted)', textAlign: 'left' }}>
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
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                No pending submissions.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 12 }}>
                  <Link href={`/dashboard/pending/${row.id}`} style={{ color: 'var(--info)', textDecoration: 'none' }}>
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
