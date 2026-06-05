alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.waiver_settings enable row level security;
alter table public.customer_submissions enable row level security;
alter table public.rentals enable row level security;
alter table public.bikes enable row level security;
alter table public.rental_bikes enable row level security;
alter table public.maintenance_records enable row level security;
alter table public.incident_reports enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_self_or_owner_select"
on public.profiles for select
using (auth.uid() = id or public.is_owner());

create policy "profiles_owner_update"
on public.profiles for update
using (public.is_owner())
with check (public.is_owner());

create policy "profiles_owner_insert"
on public.profiles for insert
with check (public.is_owner());

create policy "customers_staff_owner_all"
on public.customers for all
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "waiver_active_public_select"
on public.waiver_settings for select
using (is_active = true or public.is_owner());

create policy "waiver_owner_write"
on public.waiver_settings for all
using (public.is_owner())
with check (public.is_owner());

create policy "submissions_public_insert"
on public.customer_submissions for insert
with check (true);

create policy "submissions_staff_owner_select"
on public.customer_submissions for select
using (public.is_staff_or_owner());

create policy "submissions_staff_owner_update"
on public.customer_submissions for update
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "rentals_staff_owner_all"
on public.rentals for all
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "bikes_staff_owner_all"
on public.bikes for all
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "rental_bikes_staff_owner_all"
on public.rental_bikes for all
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "maintenance_staff_owner_all"
on public.maintenance_records for all
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "incident_staff_owner_all"
on public.incident_reports for all
using (public.is_staff_or_owner())
with check (public.is_staff_or_owner());

create policy "audit_owner_select"
on public.audit_logs for select
using (public.is_owner());

create policy "audit_staff_owner_insert"
on public.audit_logs for insert
with check (public.is_staff_or_owner());
