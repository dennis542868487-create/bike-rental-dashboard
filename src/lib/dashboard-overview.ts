import { createServerSupabaseClient } from '@/lib/supabase-server';

export type DashboardOverviewStat = {
  label: string;
  value: string | number;
  hint?: string;
};

export async function getDashboardOverviewStats(): Promise<DashboardOverviewStat[]> {
  const supabase = await createServerSupabaseClient();

  const [{ count: activeCount }, { count: availableCount }, { count: maintenanceCount }, { count: completedCount }] = await Promise.all([
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('bikes').select('*', { count: 'exact', head: true }).eq('status', 'available').eq('is_archived', false),
    supabase.from('bikes').select('*', { count: 'exact', head: true }).eq('status', 'maintenance').eq('is_archived', false),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
  ]);

  return [
    {
      label: 'Active Rentals',
      value: activeCount ?? 0,
      hint: 'Currently out in the field',
    },
    {
      label: 'Available Bikes',
      value: availableCount ?? 0,
      hint: 'Ready to rent',
    },
    {
      label: 'Maintenance Bikes',
      value: maintenanceCount ?? 0,
      hint: 'Needs repair or inspection',
    },
    {
      label: 'Completed Rentals',
      value: completedCount ?? 0,
      hint: 'Historical completed rentals',
    },
  ];
}
