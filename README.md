# Wander Bike Dashboard

Internal rental dashboard for Wander Bike.

This project currently includes planning docs, Supabase migrations, and the initial Next.js app scaffold.

## Environment variables

Copy `.env.example` to `.env.local` for local development.

Important:
- `NEXT_PUBLIC_SUPABASE_URL` is safe for browser use.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for browser use.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to browser code.

## Phase 1 foundation docs

See:
- `docs/environment-strategy.md`
- `docs/supabase-storage-plan.md`
- `docs/sql-production-checklist.md`
- `docs/sql-migration-status.md`
- `docs/core-error-handling-rules.md`
- `docs/bike-deletion-policy.md`
- `docs/data-retention-policy.md`
- `docs/backup-recovery-checklist.md`
- `docs/owner-staff-permission-checkpoint.md`

Note:
- storage buckets must still be created in the live Supabase project for each environment
