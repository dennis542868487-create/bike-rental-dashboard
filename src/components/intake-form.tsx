'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { submitIntakeAction } from '@/actions/intake';
import { SignaturePadInput } from '@/components/signature-pad-input';
import type { IntakeFormValues } from '@/types/intake';

type IdTypeOption = {
  value: string;
  label: string;
};

type IntakeFormProps = {
  waiverVersion: string;
  waiverText: string;
  customerInstructions: string;
  idTypeOptions: IdTypeOption[];
};

// Shared styles to keep all fields visually consistent.
const field: React.CSSProperties = {
  width: '100%',
  padding: '14px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 10,
  fontSize: 16,          // 16px prevents iOS auto-zoom
  boxSizing: 'border-box',
  background: '#fff',
  color: '#111827',
  lineHeight: 1.4,
};

const label: React.CSSProperties = {
  display: 'block',
  fontWeight: 500,
  fontSize: 14,
  color: '#374151',
  marginBottom: 6,
};

const card: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 20,
  background: '#fff',
  display: 'grid',
  gap: 16,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
  color: '#111827',
  paddingBottom: 4,
  borderBottom: '1px solid #f3f4f6',
};

const errorMsg: React.CSSProperties = {
  color: '#dc2626',
  fontSize: 13,
  marginTop: 4,
};

export function IntakeForm({ waiverVersion, waiverText, customerInstructions, idTypeOptions }: IntakeFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IntakeFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      idType: idTypeOptions[0]?.value ?? '',
      idNumber: '',
      signatureDataUrl: '',
      waiverAccepted: false,
    },
  });

  const onSubmit = async (values: IntakeFormValues) => {
    startTransition(async () => {
      const result = await submitIntakeAction(values);
      if (result?.message) {
        setMessage(result.message);
        setMessageType(result.ok ? 'success' : 'error');
      }
      if (result?.ok) {
        reset();
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>

      {/* ── Section 1: Customer Info ─────────────────────────────── */}
      <div style={card}>
        <h2 style={sectionTitle}>Customer Info</h2>

        {/* First + Last name side by side on wider screens */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div>
            <label style={label}>First Name</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              type="text"
              autoComplete="given-name"
              style={field}
            />
            {errors.firstName ? <p style={errorMsg}>{errors.firstName.message}</p> : null}
          </div>
          <div>
            <label style={label}>Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              type="text"
              autoComplete="family-name"
              style={field}
            />
            {errors.lastName ? <p style={errorMsg}>{errors.lastName.message}</p> : null}
          </div>
        </div>

        <div>
          <label style={label}>Phone Number</label>
          <input
            {...register('phoneNumber', { required: 'Phone number is required' })}
            type="tel"
            autoComplete="tel"
            style={field}
          />
          {errors.phoneNumber ? <p style={errorMsg}>{errors.phoneNumber.message}</p> : null}
        </div>

        <div>
          <label style={label}>
            Email{' '}
            <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            style={field}
          />
        </div>
      </div>

      {/* ── Section 2: Photo ID ──────────────────────────────────── */}
      <div style={card}>
        <h2 style={sectionTitle}>Photo ID</h2>

        <div>
          <label style={label}>ID Type</label>
          <select {...register('idType')} style={field}>
            {idTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={label}>ID Number</label>
          <input
            {...register('idNumber', { required: 'Photo ID number is required' })}
            type="text"
            style={field}
          />
          {errors.idNumber ? <p style={errorMsg}>{errors.idNumber.message}</p> : null}
        </div>
      </div>

      {/* ── Section 3: Waiver & Signature ───────────────────────── */}
      <div style={card}>
        <h2 style={sectionTitle}>Waiver &amp; Signature</h2>

        {/* Waiver text */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, background: '#f9fafb' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#374151' }}>
            Waiver <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: 12 }}>({waiverVersion})</span>
          </div>
          {customerInstructions ? (
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 10px' }}>{customerInstructions}</p>
          ) : null}
          <div
            style={{
              maxHeight: 220,
              overflowY: 'auto',
              fontSize: 13,
              color: '#6b7280',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {waiverText}
          </div>
        </div>

        {/* Signature */}
        <div>
          <label style={{ ...label, marginBottom: 0 }}>
            Staff Signature <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <Controller
            control={control}
            name="signatureDataUrl"
            rules={{ required: 'Signature is required' }}
            render={({ field: f }) => (
              <SignaturePadInput value={f.value} onChange={f.onChange} />
            )}
          />
          {errors.signatureDataUrl ? <p style={errorMsg}>{errors.signatureDataUrl.message}</p> : null}
        </div>

        {/* Waiver checkbox */}
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            {...register('waiverAccepted', { required: 'You must accept the waiver' })}
            type="checkbox"
            style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
            I have read and agree to the waiver above.
          </span>
        </label>
        {errors.waiverAccepted ? <p style={errorMsg}>{errors.waiverAccepted.message}</p> : null}
      </div>

      {/* Error / success message */}
      {message ? (
        <p style={{ margin: 0, fontSize: 14, color: messageType === 'error' ? '#dc2626' : '#16a34a' }}>
          {message}
        </p>
      ) : null}

      {/* Submit CTA */}
      <div style={{ display: 'grid', gap: 10 }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '16px 24px',
            borderRadius: 12,
            border: 'none',
            background: isLoading ? '#6b7280' : '#111827',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            width: '100%',
            letterSpacing: '0.01em',
          }}
        >
          {isLoading ? 'Submitting…' : 'Submit Rental Form'}
        </button>
        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>
          Please return the device to staff after submitting.
        </p>
      </div>

    </form>
  );
}
