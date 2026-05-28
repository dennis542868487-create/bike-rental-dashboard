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

  const maintenanceHistory =
    data.maintenance_records?.map((record) => ({
      id: record.id,
      date: formatDateTime(record.maintenance_date),
      workDone: record.work_done,
      cost: record.cost ? `$${record.cost}` : '$0',
      notes: record.notes ?? '',
    })) ?? [];

  const rentalHistory =
    data.rental_bikes
      ?.map((row) => row.rental)
      .filter(Boolean)
      .map((rental) => ({
        id: rental.id,
        rentalNumber: rental.rental_number,
        status: rental.status,
        completedAt: formatDateTime(rental.completed_at),
      })) ?? [];

  return {
    id: data.id,
    bikeNumber: data.bike_number,
    bikeType: data.bike_type,
    size: data.size ?? '',
    status: data.status,
    area: data.morning_check_area?.name ?? 'Unassigned',
    notes: data.notes ?? '',
    maintenanceHistory,
    rentalHistory,
  };
}
