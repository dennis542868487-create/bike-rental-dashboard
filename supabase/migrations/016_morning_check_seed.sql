insert into public.morning_check_areas (name, display_order, is_active, notes)
values
  ('Area A', 1, true, 'Default seed area'),
  ('Area B', 2, true, 'Default seed area'),
  ('Area C', 3, true, 'Default seed area'),
  ('Area D', 4, true, 'Default seed area'),
  ('Area E', 5, true, 'Default seed area')
on conflict (name) do nothing;

update public.bikes b
set morning_check_area_id = a.id,
    updated_at = now()
from public.morning_check_areas a
where (
    (b.bike_number in ('A-001', 'A-002') and a.name = 'Area A') or
    (b.bike_number in ('A-003', 'K-001') and a.name = 'Area B') or
    (b.bike_number in ('K-002') and a.name = 'Area C')
);

insert into public.morning_checks (check_date, staff_user_id, signature_path, notes, submitted_at)
select current_date - 1,
       p.id,
       'signatures/morning-check-seed-signature.png',
       'Seed morning check session',
       now() - interval '1 day'
from public.profiles p
where p.role = 'staff'
and not exists (
  select 1 from public.morning_checks mc where mc.check_date = current_date - 1
);

insert into public.morning_check_items (morning_check_id, bike_id, area_id, check_status, notes)
select mc.id,
       b.id,
       b.morning_check_area_id,
       case when b.bike_number = 'K-002' then 'sent_to_maintenance'::public.morning_check_status else 'all_good'::public.morning_check_status end,
       case when b.bike_number = 'K-002' then 'Seed issue found during morning check' else 'Seed all good' end
from public.morning_checks mc
join public.bikes b on b.bike_number in ('A-003', 'K-001', 'K-002')
where mc.check_date = current_date - 1
and not exists (
  select 1 from public.morning_check_items mci where mci.morning_check_id = mc.id and mci.bike_id = b.id
);
