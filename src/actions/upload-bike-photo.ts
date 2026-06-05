'use server';

import { createHash } from 'node:crypto';
import { ensureStaffActionAccess } from '@/lib/action-auth';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function uploadBikePhotoAction(input: {
  bikeId: string;
  fileName: string;
  contentType: string;
  dataBase64: string;
}) {
  const access = await ensureStaffActionAccess();

  if (!access.ok) {
    return access;
  }

  if (!input.dataBase64) {
    return {
      ok: false,
      message: 'Photo data is required.',
    };
  }

  const supabase = createAdminSupabaseClient();
  const buffer = Buffer.from(input.dataBase64, 'base64');
  const extension = input.fileName.split('.').pop() || 'jpg';
  const digest = createHash('sha1').update(buffer).digest('hex').slice(0, 12);
  const photoPath = `bikes/${input.bikeId}/${digest}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('bike-photos')
    .upload(photoPath, buffer, {
      contentType: input.contentType || 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    return {
      ok: false,
      message: uploadError.message,
    };
  }

  const { error } = await supabase
    .from('bikes')
    .update({ photo_path: photoPath } as never)
    .eq('id', input.bikeId);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: 'Bike photo uploaded.',
  };
}
