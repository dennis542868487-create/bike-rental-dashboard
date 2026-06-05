create or replace function public.view_full_submission_id(p_submission_id uuid)
returns table (
  submission_id uuid,
  full_id_number text,
  id_last4 text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_owner() and public.current_app_role() <> 'staff' then
    raise exception 'forbidden';
  end if;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'VIEW_FULL_ID', 'customer_submission', p_submission_id, jsonb_build_object('reason', 'controlled_view'));

  return query
  select cs.id, cs.full_id_number, cs.id_last4
  from public.customer_submissions cs
  where cs.id = p_submission_id;
end;
$$;

revoke all on function public.view_full_submission_id(uuid) from public;
grant execute on function public.view_full_submission_id(uuid) to authenticated;
