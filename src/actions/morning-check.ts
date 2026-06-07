'use server';

import { randomUUID } from 'node:crypto';
import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type MorningCheckSubmitItem = {
  bikeId: string;
  areaId?: string | null;
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

  // Use admin client for storage upload: the signatures bucket INSERT policy uses
  // `and false` to block direct client uploads, but admin (service role) bypasses RLS.
  const adminSupabase = createAdminSupabaseClient();
  // Use server client (user session JWT) for the RPC so auth.uid() resolves correctly.
  const supabase = await createServerSupabaseClient();

  const signaturePath = `morning-check/${randomUUID()}.png`;

  const { error: uploadError } = await adminSupabase.storage
    .from('signatures')
    .upload(signaturePath, parsedSignature.buffer, {
      contentType: parsedSignature.mimeType,
      upsert: false,
    });

  if (uploadError) {
    console.error('[morning-check] Signature upload error:', uploadError.message, uploadError);
    return {
      ok: false,
      message: 'Unable to upload the signature. Please try again.',
    };
  }

  const payload = input.items.map((item) => ({
    bike_id: item.bikeId,
    area_id: item.areaId ?? '',
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
    await adminSupabase.storage.from('signatures').remove([signaturePath]);

    console.error('submitMorningCheckAction failed:', error);
    return {
      ok: false,
      message: 'Unable to save the morning check. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Morning check saved.',
  };
}
