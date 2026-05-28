# SQL Production Checklist

## Before running migrations
- Confirm environment is correct: local/dev, staging, or production.
- Confirm production database is not being used for testing.
- Confirm `service_role` key is server-side only.
- Review placeholder bootstrap emails before applying dev seed files.

## Migration order
Run in this order:
1. 001_extensions_and_enums.sql
2. 002_tables.sql
3. 003_indexes.sql
4. 004_functions_and_triggers.sql
5. 005_rls.sql
6. 006_rpc_helpers.sql
7. 007_rental_transactions.sql
8. 008_seed_bootstrap.sql
9. 009_bootstrap_owner_and_dev_seed.sql
10. 010_morning_check_schema.sql
11. 011_morning_check_indexes_and_triggers.sql
12. 012_morning_check_rls_and_rpc.sql
13. 013_sensitive_views_and_helpers.sql
14. 014_rental_workflow_hardening.sql
15. 015_morning_check_hardening.sql
16. 016_morning_check_seed.sql
17. 017_storage_policies.sql

## Security checks
- RLS enabled on all sensitive tables.
- Public intake can insert submissions but cannot read submissions.
- `full_id_number` is not returned by default queries.
- Full ID access only works through controlled RPC.
- Signature storage is private.
- Morning Check signatures follow the same private access rule.
- Audit logging works for sensitive actions.

## Workflow checks
- Pending submission can be converted into an active rental.
- Selected bikes become `rented` on rental start.
- Completed rentals return bikes to `available` or `maintenance`.
- Bike swapping preserves rental bike history.
- Morning Check can create maintenance records for problem bikes.
- Morning Check cannot reset a `rented` bike to `available`.

## Seed checks
- Active waiver exists.
- Seed bikes exist.
- Dev/staging owner and staff profiles map correctly if auth users exist.
- Sample pending, active, completed, and morning check records exist where expected.

## Production caution
- Do not run dev seed files in production without review.
- Replace placeholder waiver text before production.
- Replace placeholder bootstrap emails before production.
- Validate all RPCs in staging before production rollout.
