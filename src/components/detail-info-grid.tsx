import type { ReactNode } from 'react';

type DetailInfoGridProps = {
  children: ReactNode;
};

export function DetailInfoGrid({ children }: DetailInfoGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 10,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}
