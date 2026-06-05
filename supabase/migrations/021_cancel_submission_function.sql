-- Recreates cancel_submission to fix missing schema cache entry.
-- Identical logic to 014_rental_workflow_hardening.sql; CREATE OR REPLACE is safe to rerun.

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

revoke all on function public.cancel_submission(uuid, text) from public;
grant execute on function public.cancel_submission(uuid, text) to authenticated;
