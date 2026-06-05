# SQL Migration Status

## Current status
The Wander Bike SQL migration set is now complete as a **v1 executable baseline**.

It includes:
- schema enums and tables
- indexes
- updated_at triggers and numbering helpers
- base RLS
- controlled full ID access helper
- rental transaction RPCs
- Morning Check schema and transaction RPC
- base seed and dev bootstrap seed
- safe masked submission helpers
- rental workflow hardening RPCs
- Morning Check history helper and seed
- storage bucket policies for signatures and bike photos

## What this means
This is ready to serve as the database foundation for app development and staged Supabase rollout.

## What is still considered future hardening
- More granular field-isolation patterns if needed
- Additional owner-only correction RPCs
- More production-specific seed strategy
- Full staging run verification against a live Supabase project

## Recommended next step
Use this migration set as the baseline and move to one of:
1. real Supabase test run
2. Next.js app scaffold and integration
3. stricter field-level security refinement if needed
