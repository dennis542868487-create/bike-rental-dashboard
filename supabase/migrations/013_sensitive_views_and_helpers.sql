create or replace view public.customer_submissions_safe as
select
  id,
  customer_id,
  submission_number,
  first_name,
  last_name,
  phone_number,
  email,
  id_type,
  id_last4,
  waiver_version,
  waiver_accepted,
  waiver_accepted_at,
  signature_path,
  submitted_at,
  status,
  created_rental_id,
  created_at,
  updated_at
from public.customer_submissions;

revoke all on public.customer_submissions_safe from public;
grant select on public.customer_submissions_safe to authenticated;

create or replace function public.masked_submission_detail(p_submission_id uuid)
returns table (
  id uuid,
  submission_number text,
  first_name text,
  last_name text,
  phone_number text,
  email text,
  id_type public.id_type,
  id_last4 text,
  waiver_version text,
  waiver_accepted boolean,
  waiver_accepted_at timestamptz,
  signature_path text,
  submitted_at timestamptz,
  status public.submission_status
)
language sql
security definer
set search_path = public
as $$
  select
    cs.id,
    cs.submission_number,
    cs.first_name,
    cs.last_name,
    cs.phone_number,
    cs.email,
    cs.id_type,
    cs.id_last4,
    cs.waiver_version,
    cs.waiver_accepted,
    cs.waiver_accepted_at,
    cs.signature_path,
    cs.submitted_at,
    cs.status
  from public.customer_submissions cs
  where cs.id = p_submission_id;
$$;

revoke all on function public.masked_submission_detail(uuid) from public;
grant execute on function public.masked_submission_detail(uuid) to authenticated;
