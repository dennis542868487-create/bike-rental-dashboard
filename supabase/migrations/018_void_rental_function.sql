-- Recreates void_rental to fix missing schema cache entry.
-- Adds non-empty reason validation and restricts bike restore to 'rented' status only.

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

  if p_reason is null or trim(p_reason) = '' then
    raise exception 'a void reason is required';
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

  -- Only restore bikes that are still in rented status.
  -- Completed rentals already have bikes returned; skip to avoid clobbering maintenance status.
  if v_rental.status = 'active' then
    update public.bikes
    set status = 'available', updated_at = now()
    where id in (
      select rb.bike_id
      from public.rental_bikes rb
      where rb.rental_id = p_rental_id
        and rb.unassigned_at is null
    )
    and status = 'rented';
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

revoke all on function public.void_rental(uuid, text) from public;
grant execute on function public.void_rental(uuid, text) to authenticated;
