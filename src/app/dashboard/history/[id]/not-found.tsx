import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export default function RentalHistoryNotFound() {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <PageHeader title="Rental Not Found" description="This rental record could not be located." />
      <div style={{ padding: 24, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', display: 'grid', gap: 12 }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          The rental you&apos;re looking for does not exist or is not accessible.
        </p>
        <Link
          href="/dashboard/history"
          style={{ color: 'var(--info)', textDecoration: 'none', fontSize: 14 }}
        >
          ← Back to Rental History
        </Link>
      </div>
    </main>
  );
}
