import Link from 'next/link';

type StatAccent = 'primary' | 'accent' | 'warning' | 'neutral';

type DashboardStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  accent?: StatAccent;
};

const accentColors: Record<StatAccent, string> = {
  primary: 'var(--info)',
  accent: 'var(--accent)',
  warning: 'var(--warning)',
  neutral: 'var(--border-strong)',
};

export function DashboardStatCard({ label, value, hint, href, accent = 'neutral' }: DashboardStatCardProps) {
  const cardStyle = {
    position: 'relative' as const,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 18px',
    paddingLeft: 18,
    background: 'var(--surface)',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    display: 'block',
    overflow: 'hidden',
  };

  const content = (
    <>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: accentColors[accent],
        }}
      />
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 32, lineHeight: '36px', fontWeight: 700, marginTop: 6, color: 'var(--text-primary)' }}>{value}</div>
      {hint ? <div style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text-muted)', marginTop: 6 }}>{hint}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} style={cardStyle}>
        {content}
      </Link>
    );
  }

  return <div style={cardStyle}>{content}</div>;
}
