-- Adds EXPORT_RENTAL_HISTORY_ZIP to the audit_action enum.
-- Used by the rental history ZIP export route (owner-only, includes full ID numbers and signatures).
-- IF NOT EXISTS makes this idempotent and safe to re-run.

alter type public.audit_action add value if not exists 'EXPORT_RENTAL_HISTORY_ZIP';

notify pgrst, 'reload schema';
