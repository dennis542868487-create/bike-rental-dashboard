'use server';

import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { getActiveWaiverSettings } from '@/lib/waiver-settings';
import type { IntakeFormValues } from '@/types/intake';

function normalizeIntakeValues(values: IntakeFormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    phoneNumber: values.phoneNumber.trim(),
    email: values.email?.trim().toLowerCase() || null,
    idType: values.idType,
    idNumber: values.idNumber.trim(),
    signatureDataUrl: values.signatureDataUrl.trim(),
    waiverAccepted: values.waiverAccepted,
  };
}

function parseSignatureDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const [, mimeType, base64] = match;
  return {
    mimeType,
    buffer: Buffer.from(base64, 'base64'),
  };
}

export async function submitIntakeAction(values: IntakeFormValues) {
  const normalizedValues = normalizeIntakeValues(values);

  if (
    !normalizedValues.firstName ||
    !normalizedValues.lastName ||
    !normalizedValues.phoneNumber ||
    !normalizedValues.idNumber ||
    !normalizedValues.signatureDataUrl
  ) {
    return {
      ok: false,
      message: 'Please complete all required fields.',
    };
  }

  if (!normalizedValues.idType) {
    return {
      ok: false,
      message: 'ID type options are not available right now. Please ask staff for help.',
    };
  }

  if (!normalizedValues.waiverAccepted) {
    return {
      ok: false,
      message: 'Waiver acceptance is required.',
    };
  }

  if (normalizedValues.idNumber.length < 4) {
    return {
      ok: false,
      message: 'Photo ID number must be at least 4 characters.',
    };
  }

  const waiverSettings = await getActiveWaiverSettings();

  if (!waiverSettings) {
    return {
      ok: false,
      message: 'Waiver settings are not available right now. Please try again shortly.',
    };
  }

  const parsedSignature = parseSignatureDataUrl(normalizedValues.signatureDataUrl);

  if (!parsedSignature) {
    return {
      ok: false,
      message: 'Signature could not be processed. Please clear it and sign again.',
    };
  }

  const supabase = createAdminSupabaseClient();
  const submittedAt = new Date().toISOString();
  const signaturePath = `intake/${randomUUID()}.png`;

  const { error: uploadError } = await supabase.storage
    .from('signatures')
    .upload(signaturePath, parsedSignature.buffer, {
      contentType: parsedSignature.mimeType,
      upsert: false,
    });

  if (uploadError) {
    return {
      ok: false,
      message: 'Signature upload failed. Please try signing again or ask staff for help.',
    };
  }

  const { error } = await supabase.from('customer_submissions').insert({
    first_name: normalizedValues.firstName,
    last_name: normalizedValues.lastName,
    phone_number: normalizedValues.phoneNumber,
    email: normalizedValues.email,
    id_type: normalizedValues.idType,
    full_id_number: normalizedValues.idNumber,
    id_last4: normalizedValues.idNumber.slice(-4),
    waiver_version: waiverSettings.version,
    waiver_text_snapshot: waiverSettings.waiverText,
    waiver_accepted: normalizedValues.waiverAccepted,
    waiver_accepted_at: submittedAt,
    signature_path: signaturePath,
    submitted_at: submittedAt,
    status: 'pending',
  } as never);

  if (error) {
    await supabase.storage.from('signatures').remove([signaturePath]);

    console.error('intakeAction failed:', error);
    return {
      ok: false,
      message: 'Something went wrong while submitting this form. Please try again or ask staff for help.',
    };
  }

  redirect('/intake/success');
}
