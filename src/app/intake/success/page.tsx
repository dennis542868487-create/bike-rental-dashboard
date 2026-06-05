'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IntakeSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/intake');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          display: 'grid',
          gap: 16,
        }}
      >
        {/* Checkmark icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: 30,
          }}
        >
          ✓
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
            Thank you!
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: '#374151' }}>
            Your rental form has been submitted.
          </p>
          <p style={{ margin: 0, fontSize: 15, color: '#374151', fontWeight: 500 }}>
            Please return this device to staff.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#9ca3af' }}>
            This form will reset for the next customer.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#6b7280',
              animation: 'pulse 1s infinite',
            }}
          />
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Redirecting…</span>
        </div>
      </div>
    </main>
  );
}
