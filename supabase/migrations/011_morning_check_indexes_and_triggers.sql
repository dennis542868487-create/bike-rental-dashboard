create index idx_morning_check_areas_display_order on public.morning_check_areas(display_order);
create index idx_morning_check_areas_is_active on public.morning_check_areas(is_active);
create index idx_bikes_morning_check_area_id on public.bikes(morning_check_area_id);
create index idx_morning_checks_check_date on public.morning_checks(check_date desc);
create index idx_morning_checks_staff_user_id on public.morning_checks(staff_user_id);
create index idx_morning_checks_submitted_at on public.morning_checks(submitted_at desc);
create index idx_morning_check_items_morning_check_id on public.morning_check_items(morning_check_id);
create index idx_morning_check_items_bike_id on public.morning_check_items(bike_id);
create index idx_morning_check_items_area_id on public.morning_check_items(area_id);
create index idx_morning_check_items_check_status on public.morning_check_items(check_status);

create trigger set_morning_check_areas_updated_at
before update on public.morning_check_areas
for each row execute function public.set_updated_at();

create trigger set_morning_checks_updated_at
before update on public.morning_checks
for each row execute function public.set_updated_at();
