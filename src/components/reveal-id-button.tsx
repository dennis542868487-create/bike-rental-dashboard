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
      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#111827' }}>
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
          border: '1px solid #d1d5db',
          background: '#fff',
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: 13,
          color: '#374151',
        }}
      >
        {isPending ? 'Loading…' : 'Reveal ID'}
      </button>
      {error ? <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span> : null}
    </span>
  );
}
