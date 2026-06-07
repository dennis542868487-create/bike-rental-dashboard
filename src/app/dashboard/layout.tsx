import { logoutAction } from '@/actions/logout';
import { DashboardNav } from '@/components/dashboard-nav';
import { requireDashboardAccess } from '@/lib/auth';
import { getBusinessSettings } from '@/lib/business-settings';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/pending', label: 'Pending Submissions' },
  { href: '/dashboard/active', label: 'Active Rentals' },
  { href: '/dashboard/bikes', label: 'Bikes' },
  { href: '/dashboard/history', label: 'Rental History' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/morning-check', label: 'Morning Check' },
  { href: '/dashboard/morning-check/history', label: 'Morning Check History' },
  { href: '/dashboard/settings', label: 'Settings' },
];

const externalLinks = [
  { href: '/intake', label: 'Open Customer Form ↗' },
];

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ profile }, businessSettings] = await Promise.all([
    requireDashboardAccess(),
    getBusinessSettings(),
  ]);
  const sessionProfile = profile as unknown as { full_name?: string | null; email?: string | null; role?: string | null };
  const displayName = sessionProfile.full_name || sessionProfile.email || 'Signed-in user';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside
        style={{
          borderRight: '1px solid var(--border)',
          padding: '20px 16px',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ padding: '4px 12px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Rental Dashboard
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 18, lineHeight: '24px', color: 'var(--primary)' }}>
            {businessSettings.businessName}
          </h2>
        </div>
        <DashboardNav navItems={navItems} externalLinks={externalLinks} />
      </aside>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            borderBottom: '1px solid var(--border)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: 'var(--surface)',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Internal Rental Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{displayName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{sessionProfile.role}</div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Log out
              </button>
            </form>
          </div>
        </header>
        <div style={{ padding: 24, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
