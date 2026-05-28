# Supabase Storage Plan

## Purpose
This document defines the required Supabase Storage buckets for the Wander Bike dashboard and how they should be used.

## Required buckets

### 1. `signatures`
Use for:
- customer intake signature files
- Morning Check signature files

Requirements:
- private bucket
- no public read access
- file access should only happen through authorized server-side/admin flows
- production files should use stable path conventions and avoid exposing personal data in file names

Suggested path conventions:
- `intake/<submission-id>/<filename>`
- `morning-check/<check-id>/<filename>`

### 2. `bike-photos`
Use for:
- bike inventory photos

Requirements:
- controlled bucket, not open public write
- read/write should follow owner/staff permissions
- archive/delete behavior should prefer controlled replacement over casual hard deletion

Suggested path conventions:
- `bikes/<bike-id>/<filename>`

## Environment checklist
Create these buckets in each environment:
- local/dev
- staging/preview
- production

For each environment, confirm:
- `signatures` bucket exists
- `bike-photos` bucket exists
- `signatures` is private
- `bike-photos` access is intentionally controlled
- test/dev environments do not share production storage

## Live setup checklist
Perform this in the Supabase dashboard for each environment:

1. Open **Storage**
2. Create bucket `signatures`
3. Set `signatures` to private
4. Create bucket `bike-photos`
5. Confirm `bike-photos` is not open for uncontrolled public writes
6. Record completion in deployment notes or rollout checklist

## Phase 1 done criteria for 1.3
This part is only fully complete when:
- `signatures` exists in the target Supabase project
- `bike-photos` exists in the target Supabase project
- the intended privacy/access model is written down

## Policy model

### `signatures`
- no direct client-side bucket reads
- no direct client-side bucket writes
- access should go through authorized server-side flows only

### `bike-photos`
- staff/owner can read
- staff/owner can upload/update
- delete should stay owner-only by default

Implemented migration:
- `supabase/migrations/017_storage_policies.sql`

## Notes
- Bucket creation itself happens in the live Supabase project, not in this repo.
- This file documents the required target state so Phase 1 is explicit and repeatable.
- Repo documentation can prepare this step, but cannot by itself prove live bucket creation.
