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
  { label: 'Review Pending Submissions', href: '/dashboard/pending' },
  { label: 'Run Morning Check', href: '/dashboard/morning-check' },
  { label: 'Open Reports', href: '/dashboard/reports' },
  { label: 'Manage Settings', href: '/dashboard/settings' },
  { label: 'Customer Intake Form ↗', href: '/intake' },
];

export default async function DashboardPage() {
  const stats = await getDashboardOverviewStats();

  return (
    <main style={{ display: 'grid', gap: 24 }}>
      <section>
        <h1 style={{ margin: 0 }}>Overview</h1>
        <p style={{ color: '#6b7280' }}>Wander Bike internal operations dashboard.</p>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {stats.map((stat) => (
          <DashboardStatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} href={statHrefMap[stat.label]} />
        ))}
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Quick Links</h2>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', textDecoration: 'none', color: '#111827' }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#f9fafb', display: 'grid', gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Customer Form URL</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
          Share this link with customers before their rental. Also reachable via <code>/form</code>, <code>/waiver</code>, or <code>/rent</code>.
        </p>
        <code style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#111827', wordBreak: 'break-all' }}>
          /intake
        </code>
      </section>
    </main>
  );
}
