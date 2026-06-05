create table public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Wander Bike',
  timezone text not null default 'America/Vancouver',
  primary_currency text not null default 'CAD',
  phone text,
  email text,
  address text,
  default_rental_duration_hours integer,
  operations_note text,
  updated_by_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_settings enable row level security;

-- Business name and contact info are not sensitive; public read is fine for the intake page.
create policy "business_settings_public_select"
on public.business_settings for select
using (true);

-- Only owner can modify.
create policy "business_settings_owner_write"
on public.business_settings for all
using (public.is_owner())
with check (public.is_owner());

-- Singleton row seeded from current hardcoded defaults.
insert into public.business_settings (
  business_name,
  timezone,
  primary_currency,
  operations_note
) values (
  'Wander Bike',
  'America/Vancouver',
  'CAD',
  'Business settings are currently documented as app-level defaults and can be moved to persistent storage later.'
);
