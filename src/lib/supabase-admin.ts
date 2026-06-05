import { createClient } from '@supabase/supabase-js';
import { getSupabaseServiceRoleKey, getSupabaseUrl } from '@/lib/env';
import type { SupabaseDatabase } from '@/lib/supabase-types';

export function createAdminSupabaseClient() {
  return createClient<SupabaseDatabase>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
