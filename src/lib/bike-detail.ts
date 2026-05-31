import { formatDateTime } from '@/lib/format-date-time';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type BikeDetail = {
  id: string;
  bikeNumber: string;
  bikeType: string;
  size: string;
  status: string;
  area: string;
  notes: string;
  maintenanceHistory: { id: string; date: string; workDone: string; cost: string; notes: string }[];
  rentalHistory: { id: string; rentalNumber: string; status: string; completedAt: string }[];
};

export async function getBikeDetail(id: string): Promise<BikeDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('bikes')
    .select('id, bike_number, bike_type, size, status, notes, morning_check_area:morning_check_areas(name), maintenance_records(id, maintenance_date, work_done, cost, notes), rental_bikes(rental:rentals(id, rental_number, status, completed_at))')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const bike = data as unknown as {
    id: string;
    bike_number: string;
    bike_type: string;
    size?: string | null;
    status: string;
    notes?: string | null;
    morning_check_area?: {
      name?: string | null;
    } | null;
    maintenance_records?: Array<{
      id: string;
      maintenance_date: string;
      work_done: string;
      cost?: number | null;
      notes?: string | null;
    }> | null;
    rental_bikes?: Array<{
      rental?: {
        id: string;
        rental_number: string;
        status: string;
        completed_at?: string | null;
      } | null;
    }> | null;
  };

  const maintenanceHistory =
    bike.maintenance_records?.map((record) => ({
      id: record.id,
      date: formatDateTime(record.maintenance_date),
      workDone: record.work_done,
      cost: record.cost ? `$${record.cost}` : '$0',
      notes: record.notes ?? '',
    })) ?? [];

  const rentalHistory =
    bike.rental_bikes
      ?.map((row) => row.rental)
      .filter(Boolean)
      .map((rental) => ({
        id: rental?.id ?? '',
        rentalNumber: rental?.rental_number ?? '',
        status: rental?.status ?? '',
        completedAt: formatDateTime(rental?.completed_at ?? null),
      }))
      .filter((rental) => rental.id) ?? [];

  return {
    id: bike.id,
    bikeNumber: bike.bike_number,
    bikeType: bike.bike_type,
    size: bike.size ?? '',
    status: bike.status,
    area: bike.morning_check_area?.name ?? 'Unassigned',
    notes: bike.notes ?? '',
    maintenanceHistory,
    rentalHistory,
  };
}
