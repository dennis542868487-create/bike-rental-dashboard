insert into public.waiver_settings (
  version,
  waiver_text,
  id_type_options,
  customer_instructions,
  is_active
)
values (
  'v1',
  'Wander Bike rental waiver placeholder. Replace with final legal text before production.',
  '["drivers_licence", "passport", "bcid", "other_gov_id", "other"]'::jsonb,
  'Please complete this form before renting your bike.',
  true
)
on conflict (version) do nothing;

insert into public.bikes (bike_number, bike_type, size, status, is_archived, notes)
values
  ('A-001', 'adult', 'M', 'available', false, 'seed bike'),
  ('A-002', 'adult', 'L', 'available', false, 'seed bike'),
  ('A-003', 'adult', 'M', 'available', false, 'seed bike'),
  ('K-001', 'kid', 'S', 'available', false, 'seed bike'),
  ('K-002', 'kid', 'S', 'maintenance', false, 'seed bike')
on conflict (bike_number) do nothing;
