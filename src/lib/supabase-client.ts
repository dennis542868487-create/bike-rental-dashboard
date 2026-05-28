import { createClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/env';
import type { SupabaseDatabase } from '@/lib/supabase-types';

export function createBrowserSupabaseClient() {
  return createClient<SupabaseDatabase>(getSupabaseUrl(), getSupabaseAnonKey());
}
