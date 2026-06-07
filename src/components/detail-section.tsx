import type { ReactNode } from 'react';

type DetailSectionProps = {
  children: ReactNode;
};

export function DetailSection({ children }: DetailSectionProps) {
  return (
    <section
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 16,
        background: 'var(--surface)',
        display: 'grid',
        gap: 16,
      }}
    >
      {children}
    </section>
  );
}
