# Core Error Handling Rules

## Purpose
Define the minimum consistent error handling rules for core backend actions in the Wander Bike dashboard.

## Scope
Applies to:
- intake submission
- rental start / update / completion / cancellation / void flows
- maintenance creation
- incident creation
- Morning Check submission
- owner export endpoints

## Rules

### 1. Return a consistent action shape
Server actions should return:
- `ok: true` with a short success message, or
- `ok: false` with a short user-facing error message

### 2. Validate required input early
Before calling Supabase or RPCs:
- reject missing required fields
- reject obviously invalid values
- return plain actionable messages

### 3. Enforce authorization before data changes
Protected actions must check:
- authenticated session exists
- profile exists and is active
- role is allowed for the action

### 4. Keep business-rule failures readable
When RPCs or inserts fail due to workflow rules:
- surface a short message
- avoid leaking internal implementation detail when unnecessary

### 5. Use redirects only for navigation outcomes
Use redirect for:
- login success
- logout success
- public intake success

Do not use redirect as the main way to hide backend errors.

### 6. Owner-only routes should return explicit forbidden responses
Route handlers such as CSV export should:
- return `403` for unauthorized access
- return `500` for unexpected export failures

### 7. Keep critical corrections auditable
Actions that expose sensitive data or correct historical records should:
- write audit logs
- fail closed if authorization is missing

### 8. Prefer safe defaults
If a read fails unexpectedly in list/detail helpers:
- return empty result or `null` where the current UI already expects that shape
- avoid crashing the entire page unless the route truly cannot continue

## Current baseline in repo
This repo currently follows these patterns in core actions:
- action access guards in `src/lib/action-auth.ts`
- structured `{ ok, message }` returns in server actions
- RPC-level business rule enforcement for rental and Morning Check workflows
- explicit `403` / `500` responses in CSV export route handlers

## Done criteria mapping
This document closes Phase 4.12 by making core error handling expectations explicit and reusable across backend actions.
