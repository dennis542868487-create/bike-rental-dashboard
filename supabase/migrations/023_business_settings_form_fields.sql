-- Adds configurable form title and intro text to business_settings.
-- These control what customers see on the public /intake page.

alter table public.business_settings
  add column if not exists form_title text,
  add column if not exists form_intro text;

-- Seed defaults matching the current hardcoded values in the app.
update public.business_settings
set
  form_title = coalesce(form_title, business_name || ' Rental Form'),
  form_intro = coalesce(form_intro, 'Please complete this form before renting your bike.');
