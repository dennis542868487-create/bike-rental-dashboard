'use client';

import { useState, useTransition } from 'react';
import { revealRentalIdAction } from '@/actions/reveal-rental-id';

type Props = {
  submissionId: string;
};

export function RevealIdButton({ submissionId }: Props) {
  const [fullId, setFullId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (fullId) {
    return (
      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>
        {fullId}
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await revealRentalIdAction(submissionId);
            if (result.ok) {
              setFullId(result.fullId);
            } else {
              setError(result.message);
            }
          });
        }}
        style={{
          padding: '4px 10px',
          borderRadius: 6,
          border: '1px solid var(--border-strong)',
          background: 'var(--surface)',
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: 13,
          color: 'var(--text-secondary)',
        }}
      >
        {isPending ? 'Loading…' : 'Reveal ID'}
      </button>
      {error ? <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span> : null}
    </span>
  );
}
