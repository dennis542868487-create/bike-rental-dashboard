# Backup and Recovery Checklist

## Purpose
Provide a minimum operational checklist for backup awareness and recovery readiness for the Wander Bike dashboard.

## Backup checklist
- Confirm which Supabase project is production.
- Confirm who has owner/admin access to the production project.
- Confirm database backup/export options are understood before launch.
- Confirm storage buckets that contain signatures and bike photos are included in backup planning.
- Confirm critical environment variables are stored securely outside the running app.
- Confirm key operational docs are available to the owner.

## Recovery checklist
- Confirm you can identify the most recent healthy production deployment.
- Confirm you can restore app configuration and environment variables.
- Confirm you can reapply migrations in the correct order when rebuilding an environment.
- Confirm you can reconnect the app to the correct Supabase project without mixing staging and production.
- Confirm you can inspect critical tables after recovery:
  - profiles
  - customer_submissions
  - rentals
  - bikes
  - maintenance_records
  - incident_reports
  - morning_checks
- Confirm storage references such as `signature_path` and `photo_path` still point to expected bucket objects.

## Practical note
This checklist is intentionally lightweight for the current build stage. It should be expanded before true production rollout.

## Phase mapping
This document closes Phase 12.10 by making backup and recovery expectations explicit.
