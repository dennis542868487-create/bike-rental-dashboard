import type { ReactNode } from 'react';

type DetailSectionProps = {
  children: ReactNode;
};

export function DetailSection({ children }: DetailSectionProps) {
  return (
    <section
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        background: '#fff',
        display: 'grid',
        gap: 16,
      }}
    >
      {children}
    </section>
  );
}
