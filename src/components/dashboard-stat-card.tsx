import Link from 'next/link';

type DashboardStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
};

export function DashboardStatCard({ label, value, hint, href }: DashboardStatCardProps) {
  const content = (
    <>
      <div style={{ fontSize: 14, color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
      {hint ? <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>{hint}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', textDecoration: 'none', color: '#111827', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>{content}</div>;
}
