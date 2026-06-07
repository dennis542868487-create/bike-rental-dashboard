'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createMaintenanceRecordAction } from '@/actions/create-maintenance-record';
import { InlineNotice } from '@/components/inline-notice';

export function CreateMaintenanceRecordForm({ bikeId }: { bikeId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--surface)', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Add Maintenance Record</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Maintenance Date</div>
          <input id="maintenanceDate" type="datetime-local" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }} />
        </label>
        <label>
          <div>Cost</div>
          <input id="maintenanceCost" type="number" min="0" step="0.01" defaultValue="0" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }} />
        </label>
      </div>

      <label>
        <div>Work Done</div>
        <input id="maintenanceWorkDone" type="text" placeholder="Describe the maintenance work" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }} />
      </label>

      <label>
        <div>Notes</div>
        <textarea id="maintenanceNotes" placeholder="Optional maintenance notes" style={{ width: '100%', minHeight: 100, padding: 10, marginTop: 4, border: '1px solid var(--border-strong)', borderRadius: 10 }} />
      </label>

      {message ? <InlineNotice type={messageType === 'error' ? 'error' : 'success'}>{message}</InlineNotice> : null}

      <button
        type="button"
        onClick={() => {
          const maintenanceDate = (document.getElementById('maintenanceDate') as HTMLInputElement | null)?.value ?? '';
          const workDone = (document.getElementById('maintenanceWorkDone') as HTMLInputElement | null)?.value ?? '';
          const cost = Number((document.getElementById('maintenanceCost') as HTMLInputElement | null)?.value ?? 0);
          const notes = (document.getElementById('maintenanceNotes') as HTMLTextAreaElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await createMaintenanceRecordAction({
              bikeId,
              maintenanceDate,
              workDone,
              cost,
              notes,
            });

            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');

            if (result.ok) {
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: 'var(--text-primary)', color: '#fff', maxWidth: 240 }}
      >
        {isPending ? 'Saving...' : 'Create Maintenance Record'}
      </button>
    </section>
  );
}
