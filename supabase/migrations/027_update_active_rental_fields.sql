-- Replace update_active_rental with a version that records actual operational data:
-- start_time, actual return time, amount collected, and notes.
-- The old signature (expected_return_time, estimated_fee) is dropped.
-- expected_return_time and estimated_fee remain in the table for DB constraint
-- compatibility but are no longer used by the UI or this function.

drop function if exists public.update_active_rental(uuid, timestamptz, numeric, text);

create or replace function public.update_active_rental(
  p_rental_id        uuid,
  p_start_time       timestamptz default null,
  p_return_time      timestamptz default null,
  p_amount_collected numeric      default null,
  p_notes            text         default null,
  p_clear_return_time boolean     default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rental public.rentals%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_staff_or_owner() then
    raise exception 'forbidden';
  end if;

  select * into v_rental
  from public.rentals
  where id = p_rental_id
  for update;

  if not found then
    raise exception 'rental not found';
  end if;

  if v_rental.status <> 'active' then
    raise exception 'only active rentals can be updated';
  end if;

  update public.rentals
  set
    -- Update start_time when provided; keep expected_return_time >= new start_time
    start_time            = coalesce(p_start_time, start_time),
    expected_return_time  = case
                              when p_start_time is not null
                              then greatest(expected_return_time, p_start_time)
                              else expected_return_time
                            end,
    -- Explicit null-clear supported via p_clear_return_time flag
    actual_return_time    = case
                              when p_clear_return_time then null
                              else coalesce(p_return_time, actual_return_time)
                            end,
    -- Always write amount and notes so staff can zero / clear them
    final_fee             = coalesce(p_amount_collected, final_fee),
    notes                 = coalesce(p_notes, notes),
    updated_by_user_id    = auth.uid(),
    updated_at            = now()
  where id = p_rental_id;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'UPDATE_RENTAL',
    'rental',
    p_rental_id,
    jsonb_build_object('kind', 'update_active_rental_fields')
  );
end;
$$;

revoke all on function public.update_active_rental(uuid, timestamptz, timestamptz, numeric, text, boolean) from public;
grant execute on function public.update_active_rental(uuid, timestamptz, timestamptz, numeric, text, boolean) to authenticated;
