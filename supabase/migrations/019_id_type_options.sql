create table public.id_type_options (
  id uuid primary key default gen_random_uuid(),
  value text not null unique,
  label text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_by_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.id_type_options enable row level security;

-- Active options are readable by everyone (including anonymous intake form users).
-- Owner can see all options including inactive ones.
create policy "id_type_options_select"
on public.id_type_options for select
using (is_active = true or public.is_owner());

-- Only owner can insert, update, delete.
create policy "id_type_options_owner_write"
on public.id_type_options for all
using (public.is_owner())
with check (public.is_owner());

-- Seed with the four options currently hardcoded in the intake form.
insert into public.id_type_options (value, label, is_active, sort_order) values
  ('drivers_licence', 'Driver''s Licence',                   true, 1),
  ('passport',        'Passport',                            true, 2),
  ('bcid',            'BCID',                                true, 3),
  ('other_gov_id',    'Other government-issued photo ID',    true, 4);
-- 'other' is a valid enum value but not seeded as active by default.
-- Owner can add it from the Settings UI.
