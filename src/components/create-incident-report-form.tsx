'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createIncidentReportAction } from '@/actions/create-incident-report';

type IncidentBikeOption = {
  id: string;
  label: string;
};

export function CreateIncidentReportForm({ rentalId, bikes }: { rentalId: string; bikes: IncidentBikeOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Add Incident Report</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div>Bike</div>
          <select id="incidentBikeId" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}>
            <option value="">No specific bike</option>
            {bikes.map((bike) => (
              <option key={bike.id} value={bike.id}>{bike.label}</option>
            ))}
          </select>
        </label>
        <label>
          <div>Severity</div>
          <input id="incidentSeverity" type="text" placeholder="e.g. low, medium, high" style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
        </label>
      </div>

      <label>
        <div>Description</div>
        <textarea id="incidentDescription" placeholder="Describe what happened" style={{ width: '100%', minHeight: 120, padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
      </label>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button
        type="button"
        onClick={() => {
          const bikeId = (document.getElementById('incidentBikeId') as HTMLSelectElement | null)?.value ?? '';
          const severity = (document.getElementById('incidentSeverity') as HTMLInputElement | null)?.value ?? '';
          const description = (document.getElementById('incidentDescription') as HTMLTextAreaElement | null)?.value ?? '';

          startTransition(async () => {
            const result = await createIncidentReportAction({
              rentalId,
              bikeId,
              severity,
              description,
            });

            setMessage(result.message);
            setMessageType(result.ok ? 'success' : 'error');

            if (result.ok) {
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff', maxWidth: 220 }}
      >
        {isPending ? 'Saving...' : 'Create Incident Report'}
      </button>
    </section>
  );
}
