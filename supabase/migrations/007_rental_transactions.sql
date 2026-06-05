create or replace function public.start_rental(
  p_submission_id uuid,
  p_customer_id uuid,
  p_adult_bike_quantity integer,
  p_kid_bike_quantity integer,
  p_trailer_quantity integer,
  p_bike_ids uuid[],
  p_start_time timestamptz,
  p_expected_return_time timestamptz,
  p_estimated_fee numeric,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rental_id uuid;
  v_unavailable_count integer;
  v_submission customer_submissions%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_staff_or_owner() then
    raise exception 'forbidden';
  end if;

  if p_expected_return_time < p_start_time then
    raise exception 'expected return time must be after start time';
  end if;

  if coalesce(array_length(p_bike_ids, 1), 0) = 0 then
    raise exception 'at least one bike is required';
  end if;

  select * into v_submission
  from public.customer_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'submission not found';
  end if;

  if v_submission.status <> 'pending' then
    raise exception 'submission is not pending';
  end if;

  select count(*) into v_unavailable_count
  from public.bikes
  where id = any(p_bike_ids)
    and (status <> 'available' or is_archived = true)
  for update;

  if v_unavailable_count > 0 then
    raise exception 'one or more selected bikes are not available';
  end if;

  insert into public.rentals (
    submission_id,
    customer_id,
    status,
    adult_bike_quantity,
    kid_bike_quantity,
    trailer_quantity,
    start_time,
    expected_return_time,
    estimated_fee,
    notes,
    created_by_user_id,
    updated_by_user_id
  ) values (
    p_submission_id,
    p_customer_id,
    'active',
    p_adult_bike_quantity,
    p_kid_bike_quantity,
    p_trailer_quantity,
    p_start_time,
    p_expected_return_time,
    p_estimated_fee,
    p_notes,
    auth.uid(),
    auth.uid()
  )
  returning id into v_rental_id;

  insert into public.rental_bikes (rental_id, bike_id)
  select v_rental_id, unnest(p_bike_ids);

  update public.bikes
  set status = 'rented', updated_at = now()
  where id = any(p_bike_ids);

  update public.customer_submissions
  set status = 'converted',
      created_rental_id = v_rental_id,
      updated_at = now()
  where id = p_submission_id;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, after_data)
  values (
    auth.uid(),
    'START_RENTAL',
    'rental',
    v_rental_id,
    jsonb_build_object('submission_id', p_submission_id, 'bike_ids', p_bike_ids)
  );

  return v_rental_id;
end;
$$;

create or replace function public.complete_rental(
  p_rental_id uuid,
  p_actual_return_time timestamptz,
  p_final_fee numeric default null,
  p_payment_method public.payment_method default null,
  p_payment_status public.payment_status default 'paid',
  p_notes text default null,
  p_maintenance_needed boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rental rentals%rowtype;
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
    raise exception 'rental is not active';
  end if;

  update public.rentals
  set status = 'completed',
      actual_return_time = p_actual_return_time,
      final_fee = coalesce(p_final_fee, final_fee),
      payment_method = coalesce(p_payment_method, payment_method),
      payment_status = coalesce(p_payment_status, payment_status),
      notes = coalesce(p_notes, notes),
      maintenance_needed = p_maintenance_needed,
      completed_by_user_id = auth.uid(),
      completed_at = now(),
      updated_by_user_id = auth.uid(),
      updated_at = now()
  where id = p_rental_id;

  update public.rental_bikes
  set returned_condition = coalesce(returned_condition, 'returned'),
      return_requires_maintenance = p_maintenance_needed
  where rental_id = p_rental_id
    and unassigned_at is null;

  update public.bikes b
  set status = case when p_maintenance_needed then 'maintenance' else 'available' end,
      updated_at = now()
  where b.id in (
    select rb.bike_id
    from public.rental_bikes rb
    where rb.rental_id = p_rental_id
      and rb.unassigned_at is null
  );

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, after_data)
  values (
    auth.uid(),
    'COMPLETE_RENTAL',
    'rental',
    p_rental_id,
    jsonb_build_object('actual_return_time', p_actual_return_time, 'maintenance_needed', p_maintenance_needed)
  );
end;
$$;

revoke all on function public.start_rental(uuid, uuid, integer, integer, integer, uuid[], timestamptz, timestamptz, numeric, text) from public;
revoke all on function public.complete_rental(uuid, timestamptz, numeric, public.payment_method, public.payment_status, text, boolean) from public;

grant execute on function public.start_rental(uuid, uuid, integer, integer, integer, uuid[], timestamptz, timestamptz, numeric, text) to authenticated;
grant execute on function public.complete_rental(uuid, timestamptz, numeric, public.payment_method, public.payment_status, text, boolean) to authenticated;
