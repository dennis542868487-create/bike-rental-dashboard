type BadgeTone = 'green' | 'primary' | 'amber' | 'gray' | 'red';

type StatusBadgeProps = {
  status: string;
};

const toneStyles: Record<BadgeTone, { background: string; border: string; color: string }> = {
  green: { background: 'var(--accent-soft)', border: '#b7dfc4', color: '#14532d' },
  primary: { background: 'var(--info-soft)', border: '#bfdbfe', color: '#1e3a8a' },
  amber: { background: 'var(--warning-soft)', border: '#f6d58d', color: '#7a4b00' },
  gray: { background: 'var(--surface-muted)', border: 'var(--border-strong)', color: 'var(--text-secondary)' },
  red: { background: 'var(--danger-soft)', border: '#fda29b', color: '#7a271a' },
};

/** Maps an operational status value to a display label + colour tone. */
function resolve(status: string): { label: string; tone: BadgeTone } {
  const key = status.trim().toLowerCase().replace(/[\s-]+/g, '_');
  const map: Record<string, { label: string; tone: BadgeTone }> = {
    available: { label: 'Available', tone: 'green' },
    all_good: { label: 'All Good', tone: 'green' },
    rented: { label: 'Rented', tone: 'primary' },
    active: { label: 'Active', tone: 'primary' },
    pending: { label: 'Pending', tone: 'amber' },
    maintenance: { label: 'Maintenance', tone: 'amber' },
    needs_attention: { label: 'Needs Attention', tone: 'amber' },
    archived: { label: 'Archived', tone: 'gray' },
    completed: { label: 'Completed', tone: 'gray' },
    cancelled: { label: 'Cancelled', tone: 'gray' },
    voided: { label: 'Voided', tone: 'red' },
    error: { label: 'Error', tone: 'red' },
  };

  if (map[key]) return map[key];

  // Fall back to a title-cased version of the raw status with a neutral tone.
  const label = status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return { label: label || status, tone: 'gray' };
}

/** Consistent, readable operational status pill used in tables and detail views. */
export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, tone } = resolve(status);
  const colors = toneStyles[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        lineHeight: '18px',
        background: colors.background,
        border: `1px solid ${colors.border}`,
        color: colors.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
