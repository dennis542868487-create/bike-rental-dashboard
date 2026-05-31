import Link from 'next/link';
import { logoutAction } from '@/actions/logout';
import { requireDashboardAccess } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/pending', label: 'Pending Submissions' },
  { href: '/dashboard/active', label: 'Active Rentals' },
  { href: '/dashboard/bikes', label: 'Bikes' },
  { href: '/dashboard/history', label: 'Rental History' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/morning-check', label: 'Morning Check' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireDashboardAccess();
  const sessionProfile = profile as unknown as { full_name?: string | null; email?: string | null; role?: string | null };
  const displayName = sessionProfile.full_name || sessionProfile.email || 'Signed-in user';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #e5e7eb', padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Wander Bike</h2>
        <nav style={{ display: 'grid', gap: 10 }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{ color: '#111827', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <header style={{ borderBottom: '1px solid #e5e7eb', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span>Internal Rental Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>{displayName}</div>
              <div style={{ fontSize: 13, color: '#6b7280', textTransform: 'capitalize' }}>{sessionProfile.role}</div>
            </div>
            <form action={logoutAction}>
              <button type="submit" style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>
                Log out
              </button>
            </form>
          </div>
        </header>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
