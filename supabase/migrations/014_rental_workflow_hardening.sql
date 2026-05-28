create or replace function public.update_active_rental(
  p_rental_id uuid,
  p_expected_return_time timestamptz default null,
  p_estimated_fee numeric default null,
  p_notes text default null
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

  if p_expected_return_time is not null and p_expected_return_time < v_rental.start_time then
    raise exception 'expected return time must be after start time';
  end if;

  update public.rentals
  set expected_return_time = coalesce(p_expected_return_time, expected_return_time),
      estimated_fee = coalesce(p_estimated_fee, estimated_fee),
      notes = coalesce(p_notes, notes),
      updated_by_user_id = auth.uid(),
      updated_at = now()
  where id = p_rental_id;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'UPDATE_RENTAL', 'rental', p_rental_id, jsonb_build_object('kind', 'update_active_rental'));
end;
$$;

create or replace function public.swap_rental_bike(
  p_rental_id uuid,
  p_old_bike_id uuid,
  p_new_bike_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rental_status public.rental_status;
  v_new_bike_status public.bike_status;
  v_new_bike_archived boolean;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_staff_or_owner() then
    raise exception 'forbidden';
  end if;

  select status into v_rental_status
  from public.rentals
  where id = p_rental_id
  for update;

  if not found then
    raise exception 'rental not found';
  end if;

  if v_rental_status <> 'active' then
    raise exception 'bike swap only allowed on active rentals';
  end if;

  select status, is_archived into v_new_bike_status, v_new_bike_archived
  from public.bikes
  where id = p_new_bike_id
  for update;

  if not found then
    raise exception 'new bike not found';
  end if;

  if v_new_bike_status <> 'available' or v_new_bike_archived = true then
    raise exception 'new bike is not available';
  end if;

  update public.rental_bikes
  set unassigned_at = now(),
      unassigned_by_user_id = auth.uid()
  where rental_id = p_rental_id
    and bike_id = p_old_bike_id
    and unassigned_at is null;

  update public.bikes
  set status = 'available', updated_at = now()
  where id = p_old_bike_id;

  insert into public.rental_bikes (rental_id, bike_id)
  values (p_rental_id, p_new_bike_id);

  update public.bikes
  set status = 'rented', updated_at = now()
  where id = p_new_bike_id;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'UPDATE_RENTAL',
    'rental',
    p_rental_id,
    jsonb_build_object('kind', 'swap_bike', 'old_bike_id', p_old_bike_id, 'new_bike_id', p_new_bike_id)
  );
end;
$$;

create or replace function public.cancel_submission(
  p_submission_id uuid,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission public.customer_submissions%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_staff_or_owner() then
    raise exception 'forbidden';
  end if;

  select * into v_submission
  from public.customer_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'submission not found';
  end if;

  if v_submission.status <> 'pending' then
    raise exception 'only pending submissions can be cancelled';
  end if;

  update public.customer_submissions
  set status = 'cancelled',
      updated_at = now()
  where id = p_submission_id;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'CANCEL_SUBMISSION',
    'customer_submission',
    p_submission_id,
    jsonb_build_object('reason', p_reason)
  );
end;
$$;

create or replace function public.void_rental(
  p_rental_id uuid,
  p_reason text default null
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

  if not public.is_owner() then
    raise exception 'forbidden';
  end if;

  select * into v_rental
  from public.rentals
  where id = p_rental_id
  for update;

  if not found then
    raise exception 'rental not found';
  end if;

  if v_rental.status not in ('active', 'completed') then
    raise exception 'only active or completed rentals can be voided';
  end if;

  if v_rental.status = 'active' then
    update public.bikes
    set status = 'available', updated_at = now()
    where id in (
      select rb.bike_id
      from public.rental_bikes rb
      where rb.rental_id = p_rental_id
        and rb.unassigned_at is null
    );
  end if;

  update public.rentals
  set status = 'voided',
      voided_at = now(),
      updated_by_user_id = auth.uid(),
      updated_at = now()
  where id = p_rental_id;

  if v_rental.submission_id is not null then
    update public.customer_submissions
    set status = 'voided',
        updated_at = now()
    where id = v_rental.submission_id;
  end if;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'VOID_RENTAL',
    'rental',
    p_rental_id,
    jsonb_build_object('reason', p_reason, 'previous_status', v_rental.status)
  );
end;
$$;

revoke all on function public.update_active_rental(uuid, timestamptz, numeric, text) from public;
revoke all on function public.swap_rental_bike(uuid, uuid, uuid) from public;
revoke all on function public.cancel_submission(uuid, text) from public;
revoke all on function public.void_rental(uuid, text) from public;

grant execute on function public.update_active_rental(uuid, timestamptz, numeric, text) to authenticated;
grant execute on function public.swap_rental_bike(uuid, uuid, uuid) to authenticated;
grant execute on function public.cancel_submission(uuid, text) to authenticated;
grant execute on function public.void_rental(uuid, text) to authenticated;
