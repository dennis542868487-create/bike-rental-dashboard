create index idx_profiles_role on public.profiles(role);
create index idx_profiles_is_active on public.profiles(is_active);

create index idx_customers_phone_number on public.customers(phone_number);
create index idx_customers_email on public.customers(email);
create index idx_customers_name on public.customers(last_name, first_name);

create index idx_waiver_settings_version on public.waiver_settings(version);
create index idx_waiver_settings_is_active on public.waiver_settings(is_active);
create unique index idx_one_active_waiver on public.waiver_settings(is_active) where is_active = true;

create index idx_submissions_submission_number on public.customer_submissions(submission_number);
create index idx_submissions_phone_number on public.customer_submissions(phone_number);
create index idx_submissions_submitted_at on public.customer_submissions(submitted_at desc);
create index idx_submissions_status on public.customer_submissions(status);
create index idx_submissions_created_rental_id on public.customer_submissions(created_rental_id);

create index idx_rentals_rental_number on public.rentals(rental_number);
create index idx_rentals_customer_id on public.rentals(customer_id);
create index idx_rentals_submission_id on public.rentals(submission_id);
create index idx_rentals_status on public.rentals(status);
create index idx_rentals_start_time on public.rentals(start_time);
create index idx_rentals_expected_return_time on public.rentals(expected_return_time);
create index idx_rentals_completed_at on public.rentals(completed_at);
create index idx_rentals_created_by_user_id on public.rentals(created_by_user_id);

create index idx_bikes_bike_number on public.bikes(bike_number);
create index idx_bikes_status on public.bikes(status);
create index idx_bikes_is_archived on public.bikes(is_archived);
create index idx_bikes_bike_type on public.bikes(bike_type);

create index idx_rental_bikes_rental_id on public.rental_bikes(rental_id);
create index idx_rental_bikes_bike_id on public.rental_bikes(bike_id);
create index idx_rental_bikes_unassigned_at on public.rental_bikes(unassigned_at);

create index idx_maintenance_bike_id on public.maintenance_records(bike_id);
create index idx_maintenance_rental_id on public.maintenance_records(rental_id);
create index idx_maintenance_date on public.maintenance_records(maintenance_date desc);

create index idx_incidents_rental_id on public.incident_reports(rental_id);
create index idx_incidents_bike_id on public.incident_reports(bike_id);
create index idx_incidents_created_at on public.incident_reports(created_at desc);

create index idx_audit_logs_actor_user_id on public.audit_logs(actor_user_id);
create index idx_audit_logs_action on public.audit_logs(action);
create index idx_audit_logs_entity_type_entity_id on public.audit_logs(entity_type, entity_id);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);
