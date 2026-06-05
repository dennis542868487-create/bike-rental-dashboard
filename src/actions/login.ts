'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { loginSchema } from '@/types/auth';

export async function loginAction(input: FormData) {
  const parsed = loginSchema.safeParse({
    email: input.get('email'),
    password: input.get('password'),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid login input',
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  redirect('/dashboard');
}
