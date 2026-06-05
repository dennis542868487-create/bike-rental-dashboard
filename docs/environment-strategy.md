# Environment Strategy

## Goal
Keep local/dev, staging/preview, and production clearly separated for the Wander Bike dashboard.

## Environments

### 1. Local / Dev
Purpose:
- active feature development
- migration drafting
- UI iteration
- test seed usage allowed

Rules:
- use `.env.local`
- safe to use bootstrap/dev seed data
- never treat as production-like source of truth

### 2. Staging / Preview
Purpose:
- validate migrations before production
- verify auth, RLS, RPCs, and workflow behavior
- test realistic data flows with safer non-production accounts

Rules:
- use separate Supabase project from production
- review seed usage carefully
- validate rental workflow, Morning Check, reports, and permission differences here first

### 3. Production
Purpose:
- real shop operations

Rules:
- separate Supabase project and credentials
- no unreviewed dev seed execution
- service role key remains server-side only
- production changes should only happen after staging verification

## Required separation
- separate Supabase URL and keys per environment
- separate auth users per environment
- separate storage buckets per environment
- do not point preview or local app builds at production for testing

## Promotion path
1. Build and test locally
2. Apply migrations and verify in staging/preview
3. Run workflow and security checks in staging
4. Promote to production only after staging passes

## Minimum Phase 1 done criteria
- team understands there are three distinct environments
- local/dev, staging/preview, and production are documented separately
- production is explicitly protected from test seed habits
