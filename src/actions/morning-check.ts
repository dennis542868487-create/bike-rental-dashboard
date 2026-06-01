'use server';

import { randomUUID } from 'node:crypto';
import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export type MorningCheckSubmitItem = {
  bikeId: string;
  checkStatus: 'all_good' | 'front_tire_flat' | 'rear_tire_flat' | 'sent_to_maintenance';
  notes?: string;
};

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

export async function submitMorningCheckAction(input: {
  checkDate: string;
  signatureDataUrl: string;
  items: MorningCheckSubmitItem[];
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  const signatureDataUrl = input.signatureDataUrl.trim();

  if (!input.checkDate || !signatureDataUrl) {
    return {
      ok: false,
      message: 'Check date and staff signature are required.',
    };
  }

  const parsedSignature = parseSignatureDataUrl(signatureDataUrl);

  if (!parsedSignature) {
    return {
      ok: false,
      message: 'Signature could not be processed. Please clear it and sign again.',
    };
  }

  const supabase = createAdminSupabaseClient();
  const signaturePath = `morning-check/${randomUUID()}.png`;

  const { error: uploadError } = await supabase.storage
    .from('signatures')
    .upload(signaturePath, parsedSignature.buffer, {
      contentType: parsedSignature.mimeType,
      upsert: false,
    });

  if (uploadError) {
    return {
      ok: false,
      message: 'Signature upload failed. Please try again.',
    };
  }

  const payload = input.items.map((item) => ({
    bike_id: item.bikeId,
    check_status: item.checkStatus,
    notes: item.notes ?? '',
  }));

  const { error } = await supabase.rpc(
    'submit_morning_check',
    {
      p_check_date: input.checkDate,
      p_signature_path: signaturePath,
      p_notes: 'Submitted from dashboard placeholder form',
      p_items: payload,
    } as never,
  );

  if (error) {
    await supabase.storage.from('signatures').remove([signaturePath]);

    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Morning Check submitted.',
  };
}
