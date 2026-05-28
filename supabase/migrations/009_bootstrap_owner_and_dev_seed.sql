-- Bootstrap guidance:
-- 1. Create auth users first through Supabase Auth or dashboard.
-- 2. Replace the placeholder emails below with real dev/staging accounts before running in shared environments.
-- 3. Do not use this file as-is in production without reviewing seeded accounts and data.

insert into public.profiles (id, email, full_name, role, is_active)
select au.id, au.email, 'Owner Account', 'owner', true
from auth.users au
where lower(au.email) = lower('owner@wanderbike.local')
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    is_active = excluded.is_active,
    updated_at = now();

insert into public.profiles (id, email, full_name, role, is_active)
select au.id, au.email, 'Staff Account', 'staff', true
from auth.users au
where lower(au.email) = lower('staff@wanderbike.local')
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    is_active = excluded.is_active,
    updated_at = now();

insert into public.customers (first_name, last_name, phone_number, email)
values
  ('Alice', 'Rider', '604-555-0101', 'alice@example.com'),
  ('Ben', 'Walker', '604-555-0102', 'ben@example.com'),
  ('Cathy', 'Hill', '604-555-0103', 'cathy@example.com')
on conflict do nothing;

insert into public.customer_submissions (
  customer_id,
  submission_number,
  first_name,
  last_name,
  phone_number,
  email,
  id_type,
  full_id_number,
  id_last4,
  waiver_version,
  waiver_text_snapshot,
  waiver_accepted,
  waiver_accepted_at,
  signature_path,
  submitted_at,
  status
)
select c.id,
       'S-DEV-000001',
       'Alice',
       'Rider',
       '604-555-0101',
       'alice@example.com',
       'drivers_licence',
       'D123456789',
       '6789',
       'v1',
       'Wander Bike rental waiver placeholder. Replace with final legal text before production.',
       true,
       now() - interval '2 hours',
       'signatures/dev-alice-signature.png',
       now() - interval '2 hours',
       'pending'
from public.customers c
where c.email = 'alice@example.com'
and not exists (
  select 1 from public.customer_submissions s where s.submission_number = 'S-DEV-000001'
);

insert into public.customer_submissions (
  customer_id,
  submission_number,
  first_name,
  last_name,
  phone_number,
  email,
  id_type,
  full_id_number,
  id_last4,
  waiver_version,
  waiver_text_snapshot,
  waiver_accepted,
  waiver_accepted_at,
  signature_path,
  submitted_at,
  status
)
select c.id,
       'S-DEV-000002',
       'Ben',
       'Walker',
       '604-555-0102',
       'ben@example.com',
       'passport',
       'P99887766',
       '7766',
       'v1',
       'Wander Bike rental waiver placeholder. Replace with final legal text before production.',
       true,
       now() - interval '1 day',
       'signatures/dev-ben-signature.png',
       now() - interval '1 day',
       'converted'
from public.customers c
where c.email = 'ben@example.com'
and not exists (
  select 1 from public.customer_submissions s where s.submission_number = 'S-DEV-000002'
);

insert into public.rentals (
  rental_number,
  submission_id,
  customer_id,
  status,
  adult_bike_quantity,
  kid_bike_quantity,
  trailer_quantity,
  start_time,
  expected_return_time,
  estimated_fee,
  final_fee,
  payment_method,
  payment_status,
  notes
)
select 'R-DEV-000001',
       s.id,
       c.id,
       'active',
       2,
       0,
       0,
       now() - interval '1 hour',
       now() + interval '3 hours',
       60.00,
       null,
       null,
       'unpaid',
       'Active seed rental'
from public.customer_submissions s
join public.customers c on c.id = s.customer_id
where s.submission_number = 'S-DEV-000002'
and not exists (
  select 1 from public.rentals r where r.rental_number = 'R-DEV-000001'
);

update public.customer_submissions s
set created_rental_id = r.id,
    updated_at = now()
from public.rentals r
where s.submission_number = 'S-DEV-000002'
  and r.rental_number = 'R-DEV-000001';

insert into public.rental_bikes (rental_id, bike_id)
select r.id, b.id
from public.rentals r
join public.bikes b on b.bike_number in ('A-001', 'A-002')
where r.rental_number = 'R-DEV-000001'
and not exists (
  select 1 from public.rental_bikes rb where rb.rental_id = r.id and rb.bike_id = b.id
);

update public.bikes
set status = 'rented', updated_at = now()
where bike_number in ('A-001', 'A-002');

insert into public.customer_submissions (
  customer_id,
  submission_number,
  first_name,
  last_name,
  phone_number,
  email,
  id_type,
  full_id_number,
  id_last4,
  waiver_version,
  waiver_text_snapshot,
  waiver_accepted,
  waiver_accepted_at,
  signature_path,
  submitted_at,
  status
)
select c.id,
       'S-DEV-000003',
       'Cathy',
       'Hill',
       '604-555-0103',
       'cathy@example.com',
       'bcid',
       'BC12344321',
       '4321',
       'v1',
       'Wander Bike rental waiver placeholder. Replace with final legal text before production.',
       true,
       now() - interval '2 days',
       'signatures/dev-cathy-signature.png',
       now() - interval '2 days',
       'converted'
from public.customers c
where c.email = 'cathy@example.com'
and not exists (
  select 1 from public.customer_submissions s where s.submission_number = 'S-DEV-000003'
);

insert into public.rentals (
  rental_number,
  submission_id,
  customer_id,
  status,
  adult_bike_quantity,
  kid_bike_quantity,
  trailer_quantity,
  start_time,
  expected_return_time,
  actual_return_time,
  estimated_fee,
  final_fee,
  payment_method,
  payment_status,
  notes,
  completed_at
)
select 'R-DEV-000002',
       s.id,
       c.id,
       'completed',
       1,
       1,
       0,
       now() - interval '2 days 5 hours',
       now() - interval '2 days 1 hours',
       now() - interval '2 days 30 minutes',
       45.00,
       45.00,
       'card',
       'paid',
       'Completed seed rental',
       now() - interval '2 days 30 minutes'
from public.customer_submissions s
join public.customers c on c.id = s.customer_id
where s.submission_number = 'S-DEV-000003'
and not exists (
  select 1 from public.rentals r where r.rental_number = 'R-DEV-000002'
);

update public.customer_submissions s
set created_rental_id = r.id,
    updated_at = now()
from public.rentals r
where s.submission_number = 'S-DEV-000003'
  and r.rental_number = 'R-DEV-000002';

insert into public.rental_bikes (rental_id, bike_id, returned_condition)
select r.id, b.id, 'returned in good condition'
from public.rentals r
join public.bikes b on b.bike_number in ('A-003', 'K-001')
where r.rental_number = 'R-DEV-000002'
and not exists (
  select 1 from public.rental_bikes rb where rb.rental_id = r.id and rb.bike_id = b.id
);

insert into public.maintenance_records (
  bike_id,
  maintenance_date,
  work_done,
  cost,
  notes
)
select b.id,
       now() - interval '1 day',
       'Seed maintenance: tire check and adjustment',
       15.00,
       'Created by dev seed'
from public.bikes b
where b.bike_number = 'K-002'
and not exists (
  select 1 from public.maintenance_records mr
  where mr.bike_id = b.id
    and mr.work_done = 'Seed maintenance: tire check and adjustment'
);
