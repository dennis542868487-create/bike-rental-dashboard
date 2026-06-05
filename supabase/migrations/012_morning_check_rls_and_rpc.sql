alter table public.morning_check_areas enable row level security;
alter table public.morning_checks enable row level security;
alter table public.morning_check_items enable row level security;

create policy "morning_check_areas_staff_owner_select"
on public.morning_check_areas for select
using (public.is_staff_or_owner());

create policy "morning_check_areas_owner_write"
on public.morning_check_areas for all
using (public.is_owner())
with check (public.is_owner());

create policy "morning_checks_staff_owner_select"
on public.morning_checks for select
using (public.is_staff_or_owner());

create policy "morning_checks_staff_owner_insert"
on public.morning_checks for insert
with check (public.is_staff_or_owner());

create policy "morning_checks_owner_update"
on public.morning_checks for update
using (public.is_owner())
with check (public.is_owner());

create policy "morning_check_items_staff_owner_select"
on public.morning_check_items for select
using (public.is_staff_or_owner());

create policy "morning_check_items_staff_owner_insert"
on public.morning_check_items for insert
with check (public.is_staff_or_owner());

create policy "morning_check_items_owner_update"
on public.morning_check_items for update
using (public.is_owner())
with check (public.is_owner());

create or replace function public.submit_morning_check(
  p_check_date date,
  p_signature_path text,
  p_notes text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_morning_check_id uuid;
  v_item jsonb;
  v_bike_id uuid;
  v_area_id uuid;
  v_status public.morning_check_status;
  v_notes text;
  v_bike_status public.bike_status;
  v_maintenance_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_staff_or_owner() then
    raise exception 'forbidden';
  end if;

  insert into public.morning_checks (check_date, staff_user_id, signature_path, notes)
  values (p_check_date, auth.uid(), p_signature_path, p_notes)
  returning id into v_morning_check_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_bike_id := (v_item->>'bike_id')::uuid;
    v_area_id := nullif(v_item->>'area_id', '')::uuid;
    v_status := (v_item->>'check_status')::public.morning_check_status;
    v_notes := v_item->>'notes';
    v_maintenance_id := null;

    select status into v_bike_status
    from public.bikes
    where id = v_bike_id
    for update;

    if not found then
      raise exception 'bike not found';
    end if;

    if v_bike_status = 'rented' and v_status = 'all_good' then
      raise exception 'rented bike cannot be changed to available by morning check';
    end if;

    if v_status in ('front_tire_flat', 'rear_tire_flat', 'sent_to_maintenance') then
      insert into public.maintenance_records (
        bike_id,
        maintenance_date,
        work_done,
        notes,
        staff_user_id
      ) values (
        v_bike_id,
        now(),
        case
          when v_status = 'front_tire_flat' then 'Created from Morning Check: front tire flat'
          when v_status = 'rear_tire_flat' then 'Created from Morning Check: rear tire flat'
          else 'Created from Morning Check: sent to maintenance'
        end,
        v_notes,
        auth.uid()
      )
      returning id into v_maintenance_id;

      update public.bikes
      set status = 'maintenance',
          updated_at = now()
      where id = v_bike_id
        and status <> 'rented';
    elsif v_status = 'all_good' then
      update public.bikes
      set status = case when status = 'rented' then status else 'available' end,
          updated_at = now()
      where id = v_bike_id;
    end if;

    insert into public.morning_check_items (
      morning_check_id,
      bike_id,
      area_id,
      check_status,
      notes,
      created_maintenance_record_id
    ) values (
      v_morning_check_id,
      v_bike_id,
      v_area_id,
      v_status,
      v_notes,
      v_maintenance_id
    );
  end loop;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'SUBMIT_MORNING_CHECK',
    'morning_check',
    v_morning_check_id,
    jsonb_build_object('check_date', p_check_date)
  );

  return v_morning_check_id;
end;
$$;

revoke all on function public.submit_morning_check(date, text, text, jsonb) from public;
grant execute on function public.submit_morning_check(date, text, text, jsonb) to authenticated;
