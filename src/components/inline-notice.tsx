import type { CSSProperties, ReactNode } from 'react';

export type InlineNoticeType = 'success' | 'error' | 'warning' | 'info';

type InlineNoticeProps = {
  type: InlineNoticeType;
  children: ReactNode;
  style?: CSSProperties;
};

const palette: Record<InlineNoticeType, { background: string; border: string; color: string; icon: string }> = {
  success: { background: 'var(--accent-soft)', border: '#b7dfc4', color: '#14532d', icon: '✓' },
  error: { background: 'var(--danger-soft)', border: '#fda29b', color: '#7a271a', icon: '!' },
  warning: { background: 'var(--warning-soft)', border: '#f6d58d', color: '#7a4b00', icon: '!' },
  info: { background: 'var(--info-soft)', border: '#bfdbfe', color: '#1e3a8a', icon: 'i' },
};

/**
 * Consistent inline feedback notice used across the dashboard for
 * success / error / warning / info messages. Replaces the old raw
 * blue/red link-style text so feedback feels integrated with the UI.
 */
export function InlineNotice({ type, children, style }: InlineNoticeProps) {
  const tone = palette[type];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        borderRadius: 10,
        padding: '10px 12px',
        fontSize: 14,
        lineHeight: '20px',
        background: tone.background,
        border: `1px solid ${tone.border}`,
        color: tone.color,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: 999,
          background: tone.color,
          color: tone.background,
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {tone.icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
