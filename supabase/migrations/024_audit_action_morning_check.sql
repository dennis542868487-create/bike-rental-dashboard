-- Adds SUBMIT_MORNING_CHECK to the audit_action enum.
-- This value is used by the submit_morning_check RPC (migration 012) but was
-- omitted from the original enum definition in migration 001.
-- IF NOT EXISTS makes this idempotent and safe to re-run.

alter type public.audit_action add value if not exists 'SUBMIT_MORNING_CHECK';

notify pgrst, 'reload schema';
