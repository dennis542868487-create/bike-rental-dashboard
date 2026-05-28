create extension if not exists pgcrypto;

create type public.user_role as enum ('owner', 'staff');
create type public.submission_status as enum ('pending', 'converted', 'cancelled', 'voided');
create type public.rental_status as enum ('active', 'completed', 'cancelled', 'voided');
create type public.bike_status as enum ('available', 'rented', 'maintenance');
create type public.payment_status as enum ('unpaid', 'paid', 'refunded', 'waived');
create type public.payment_method as enum ('cash', 'card', 'etransfer', 'other');
create type public.id_type as enum ('drivers_licence', 'passport', 'bcid', 'other_gov_id', 'other');
create type public.audit_action as enum (
  'VIEW_FULL_ID',
  'START_RENTAL',
  'COMPLETE_RENTAL',
  'CANCEL_SUBMISSION',
  'VOID_RENTAL',
  'UPDATE_RENTAL',
  'UPDATE_BIKE_STATUS',
  'ARCHIVE_BIKE',
  'EXPORT_CSV',
  'UPDATE_WAIVER',
  'CREATE_MAINTENANCE',
  'CREATE_INCIDENT'
);
