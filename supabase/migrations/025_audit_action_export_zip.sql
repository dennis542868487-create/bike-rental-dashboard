-- Adds EXPORT_ZIP to the audit_action enum.
-- Used by the morning check history ZIP export route.
-- IF NOT EXISTS makes this idempotent and safe to re-run.

alter type public.audit_action add value if not exists 'EXPORT_ZIP';

notify pgrst, 'reload schema';
