import Link from 'next/link';
import { DashboardStatCard } from '@/components/dashboard-stat-card';
import { getDashboardOverviewStats } from '@/lib/dashboard-overview';

const statHrefMap: Record<string, string> = {
  'Active Rentals': '/dashboard/active',
  'Available Bikes': '/dashboard/bikes',
  'Maintenance Bikes': '/dashboard/bikes',
  'Completed Rentals': '/dashboard/history',
};

const quickLinks = [
  { label: 'Review Pending Submissions', href: '/dashboard/pending', external: false },
  { label: 'Run Morning Check', href: '/dashboard/morning-check', external: false },
  { label: 'Open Reports', href: '/dashboard/reports', external: false },
  { label: 'Manage Settings', href: '/dashboard/settings', external: false },
  { label: 'Open Customer Form', href: '/intake', external: true },
];

export default async function DashboardPage() {
  const stats = await getDashboardOverviewStats();

  return (
    <main style={{ display: 'grid', gap: 28 }}>
      <section>
        <h1 style={{ margin: 0 }}>Overview</h1>
        <p style={{ margin: '6px 0 0', fontSize: 15, color: 'var(--text-secondary)' }}>
          Monitor today&apos;s rentals, bikes, checks, and customer submissions.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            href={statHrefMap[stat.label]}
            accent={stat.accent}
          />
        ))}
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Quick Links</h2>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 18px',
                background: 'var(--surface)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              <span>{item.label}</span>
              <span aria-hidden="true" style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                {item.external ? '↗' : '→'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 18,
          background: 'var(--surface-muted)',
          display: 'grid',
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0 }}>Customer Form URL</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: 'var(--text-secondary)' }}>
          Share this link with customers before they rent. The form is also available at <code>/form</code>, <code>/waiver</code>, and <code>/rent</code>.
        </p>
        <code
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 14,
            color: 'var(--text-primary)',
            wordBreak: 'break-all',
          }}
        >
          /intake
        </code>
      </section>
    </main>
  );
}
