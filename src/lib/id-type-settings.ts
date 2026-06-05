import { createServerSupabaseClient } from '@/lib/supabase-server';

export type IdTypeOption = {
  id: string;
  value: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
};

// Returns all options (active + inactive) — for the owner settings page.
export async function getAllIdTypeOptions(): Promise<IdTypeOption[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('id_type_options')
    .select('id, value, label, is_active, sort_order')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return (data as unknown as Array<{
    id: string;
    value: string;
    label: string;
    is_active: boolean;
    sort_order: number;
  }>).map((row) => ({
    id: row.id,
    value: row.value,
    label: row.label,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  }));
}

// Returns only active options sorted by sort_order — for the customer intake form.
export async function getActiveIdTypeOptions(): Promise<IdTypeOption[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('id_type_options')
    .select('id, value, label, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return (data as unknown as Array<{
    id: string;
    value: string;
    label: string;
    is_active: boolean;
    sort_order: number;
  }>).map((row) => ({
    id: row.id,
    value: row.value,
    label: row.label,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  }));
}
