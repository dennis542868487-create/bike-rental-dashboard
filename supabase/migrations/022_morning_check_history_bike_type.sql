-- Adds bike_type to the morning_check_history RPC output.
-- DROP is required because Postgres does not allow CREATE OR REPLACE
-- when the RETURNS TABLE column list changes.
-- The function has no callers outside the app layer; DROP IF EXISTS is safe.

drop function if exists public.morning_check_history(date, date);

create function public.morning_check_history(
  p_from_date date default null,
  p_to_date date default null
)
returns table (
  morning_check_id uuid,
  check_date date,
  staff_user_id uuid,
  bike_id uuid,
  bike_number text,
  bike_type text,
  area_name text,
  check_status public.morning_check_status,
  item_notes text,
  submitted_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    mc.id,
    mc.check_date,
    mc.staff_user_id,
    mci.bike_id,
    b.bike_number,
    b.bike_type,
    mca.name,
    mci.check_status,
    mci.notes,
    mc.submitted_at
  from public.morning_checks mc
  join public.morning_check_items mci on mci.morning_check_id = mc.id
  join public.bikes b on b.id = mci.bike_id
  left join public.morning_check_areas mca on mca.id = mci.area_id
  where (p_from_date is null or mc.check_date >= p_from_date)
    and (p_to_date is null or mc.check_date <= p_to_date)
  order by mc.check_date desc, mc.submitted_at desc, b.bike_number asc;
$$;

revoke all on function public.morning_check_history(date, date) from public;
grant execute on function public.morning_check_history(date, date) to authenticated;

notify pgrst, 'reload schema';
