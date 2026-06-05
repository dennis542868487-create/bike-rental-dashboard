create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_app_role()
returns public.user_role
language sql
stable
as $$
  select p.role from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_app_role() = 'owner', false);
$$;

create or replace function public.is_staff_or_owner()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_app_role() in ('staff', 'owner'), false);
$$;

create sequence if not exists public.submission_number_seq;
create sequence if not exists public.rental_number_seq;

create or replace function public.generate_submission_number()
returns text
language sql
volatile
as $$
  select 'S-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.submission_number_seq')::text, 6, '0');
$$;

create or replace function public.generate_rental_number()
returns text
language sql
volatile
as $$
  select 'R-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.rental_number_seq')::text, 6, '0');
$$;

create or replace function public.set_submission_defaults()
returns trigger
language plpgsql
as $$
begin
  if new.submission_number is null or btrim(new.submission_number) = '' then
    new.submission_number := public.generate_submission_number();
  end if;

  if new.id_last4 is null or btrim(new.id_last4) = '' then
    new.id_last4 := right(new.full_id_number, 4);
  end if;

  return new;
end;
$$;

create or replace function public.set_rental_defaults()
returns trigger
language plpgsql
as $$
begin
  if new.rental_number is null or btrim(new.rental_number) = '' then
    new.rental_number := public.generate_rental_number();
  end if;
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger set_waiver_settings_updated_at
before update on public.waiver_settings
for each row execute function public.set_updated_at();

create trigger set_customer_submissions_updated_at
before update on public.customer_submissions
for each row execute function public.set_updated_at();

create trigger set_rentals_updated_at
before update on public.rentals
for each row execute function public.set_updated_at();

create trigger set_bikes_updated_at
before update on public.bikes
for each row execute function public.set_updated_at();

create trigger set_maintenance_records_updated_at
before update on public.maintenance_records
for each row execute function public.set_updated_at();

create trigger set_incident_reports_updated_at
before update on public.incident_reports
for each row execute function public.set_updated_at();

create trigger set_submission_defaults_before_insert
before insert on public.customer_submissions
for each row execute function public.set_submission_defaults();

create trigger set_rental_defaults_before_insert
before insert on public.rentals
for each row execute function public.set_rental_defaults();
