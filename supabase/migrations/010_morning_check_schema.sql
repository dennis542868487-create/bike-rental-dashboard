create type public.morning_check_status as enum ('all_good', 'front_tire_flat', 'rear_tire_flat', 'sent_to_maintenance');

create table public.morning_check_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_order integer not null,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bikes
  add column if not exists morning_check_area_id uuid references public.morning_check_areas(id) on delete set null;

create table public.morning_checks (
  id uuid primary key default gen_random_uuid(),
  check_date date not null,
  staff_user_id uuid not null references public.profiles(id) on delete restrict,
  signature_path text not null,
  notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.morning_check_items (
  id uuid primary key default gen_random_uuid(),
  morning_check_id uuid not null references public.morning_checks(id) on delete cascade,
  bike_id uuid not null references public.bikes(id) on delete restrict,
  area_id uuid references public.morning_check_areas(id) on delete set null,
  check_status public.morning_check_status not null,
  notes text,
  created_maintenance_record_id uuid references public.maintenance_records(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (morning_check_id, bike_id)
);
