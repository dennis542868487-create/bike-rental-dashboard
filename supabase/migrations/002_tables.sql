create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone_number text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.waiver_settings (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  waiver_text text not null,
  id_type_options jsonb not null default '[]'::jsonb,
  customer_instructions text,
  is_active boolean not null default true,
  updated_by_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_submissions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  submission_number text not null unique,
  first_name text not null,
  last_name text not null,
  phone_number text not null,
  email text,
  id_type public.id_type not null,
  full_id_number text not null,
  id_last4 text not null,
  waiver_version text not null,
  waiver_text_snapshot text not null,
  waiver_accepted boolean not null default true,
  waiver_accepted_at timestamptz not null,
  signature_path text not null,
  submitted_at timestamptz not null default now(),
  status public.submission_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rentals (
  id uuid primary key default gen_random_uuid(),
  rental_number text not null unique,
  submission_id uuid not null unique references public.customer_submissions(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  status public.rental_status not null default 'active',
  adult_bike_quantity integer not null default 0 check (adult_bike_quantity >= 0),
  kid_bike_quantity integer not null default 0 check (kid_bike_quantity >= 0),
  trailer_quantity integer not null default 0 check (trailer_quantity >= 0),
  start_time timestamptz not null,
  expected_return_time timestamptz not null,
  actual_return_time timestamptz,
  estimated_fee numeric(10,2) check (estimated_fee is null or estimated_fee >= 0),
  final_fee numeric(10,2) check (final_fee is null or final_fee >= 0),
  payment_method public.payment_method,
  payment_status public.payment_status not null default 'unpaid',
  notes text,
  incident_flag boolean not null default false,
  maintenance_needed boolean not null default false,
  created_by_user_id uuid references public.profiles(id) on delete set null,
  updated_by_user_id uuid references public.profiles(id) on delete set null,
  completed_by_user_id uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  cancelled_at timestamptz,
  voided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rentals_expected_return_after_start check (expected_return_time >= start_time)
);

alter table public.customer_submissions
  add column created_rental_id uuid references public.rentals(id) on delete set null;

create table public.bikes (
  id uuid primary key default gen_random_uuid(),
  bike_number text not null unique,
  bike_type text not null,
  size text,
  status public.bike_status not null default 'available',
  is_archived boolean not null default false,
  photo_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rental_bikes (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  bike_id uuid not null references public.bikes(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  unassigned_by_user_id uuid references public.profiles(id) on delete set null,
  returned_condition text,
  return_requires_maintenance boolean not null default false,
  created_at timestamptz not null default now(),
  unique (rental_id, bike_id, assigned_at)
);

create table public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete restrict,
  rental_id uuid references public.rentals(id) on delete set null,
  maintenance_date timestamptz not null,
  work_done text not null,
  cost numeric(10,2) check (cost is null or cost >= 0),
  notes text,
  staff_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.incident_reports (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  bike_id uuid references public.bikes(id) on delete set null,
  description text not null,
  severity text,
  created_by_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb,
  created_at timestamptz not null default now()
);
