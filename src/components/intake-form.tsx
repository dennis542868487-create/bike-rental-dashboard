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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>First Name</div>
          <input {...register('firstName', { required: 'First name is required' })} type="text" style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
          {errors.firstName ? <p style={{ color: '#dc2626' }}>{errors.firstName.message}</p> : null}
        </label>
        <label>
          <div>Last Name</div>
          <input {...register('lastName', { required: 'Last name is required' })} type="text" style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
          {errors.lastName ? <p style={{ color: '#dc2626' }}>{errors.lastName.message}</p> : null}
        </label>
        <label>
          <div>Phone Number</div>
          <input {...register('phoneNumber', { required: 'Phone number is required' })} type="tel" style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
          {errors.phoneNumber ? <p style={{ color: '#dc2626' }}>{errors.phoneNumber.message}</p> : null}
        </label>
        <label>
          <div>Email</div>
          <input {...register('email', { required: 'Email is required' })} type="email" style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
          {errors.email ? <p style={{ color: '#dc2626' }}>{errors.email.message}</p> : null}
        </label>
        <label>
          <div>Photo ID Type</div>
          <select {...register('idType')} style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }}>
            {idTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label>
          <div>Photo ID Number</div>
          <input {...register('idNumber', { required: 'Photo ID number is required' })} type="text" style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 10 }} />
          {errors.idNumber ? <p style={{ color: '#dc2626' }}>{errors.idNumber.message}</p> : null}
        </label>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#f9fafb', display: 'grid', gap: 16 }}>
        <div>
          <strong>Waiver ({waiverVersion})</strong>
          {customerInstructions ? <p style={{ color: '#6b7280' }}>{customerInstructions}</p> : null}
          <p style={{ color: '#6b7280', whiteSpace: 'pre-wrap' }}>{waiverText}</p>
        </div>

        <div>
          <strong>Signature</strong>
          <div style={{ marginTop: 8 }}>
            <Controller
              control={control}
              name="signatureDataUrl"
              rules={{ required: 'Signature is required' }}
              render={({ field }) => <SignaturePadInput value={field.value} onChange={field.onChange} />}
            />
            {errors.signatureDataUrl ? <p style={{ color: '#dc2626' }}>{errors.signatureDataUrl.message}</p> : null}
          </div>
        </div>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input {...register('waiverAccepted', { required: 'You must accept the waiver' })} type="checkbox" />
          <span>I have read and agree to the waiver.</span>
        </label>
        {errors.waiverAccepted ? <p style={{ color: '#dc2626' }}>{errors.waiverAccepted.message}</p> : null}
      </div>

      {message ? <p style={{ color: messageType === 'error' ? '#dc2626' : '#2563eb' }}>{message}</p> : null}

      <button type="submit" disabled={isSubmitting || isPending} style={{ padding: 14, borderRadius: 12, border: 'none', background: '#111827', color: '#fff' }}>
        {isSubmitting || isPending ? 'Submitting...' : 'Submit Form'}
      </button>
    </form>
  );
}
