# Owner / Staff Permission Checkpoint

## Purpose
Provide a focused checkpoint for verifying that owner-only and staff-allowed actions remain correctly separated.

## Checkpoint expectations

### Staff should be able to
- log into the dashboard
- view pending submissions, active rentals, bikes, Morning Check, and rental history
- start rentals, update active rentals, complete rentals, and submit Morning Check
- create maintenance and incident records

### Staff should not be able to
- access `/dashboard/settings/*`
- use owner-only user management changes
- use owner-only correction flows unless explicitly allowed
- access owner-only exports if the UI and backend are configured correctly

### Owner should be able to
- access all settings pages
- create/update user access
- access owner-only exports
- use owner-only correction flows such as void rental

## Practical verification steps
1. Sign in as staff.
2. Confirm dashboard workflow pages load.
3. Confirm `/dashboard/settings` redirects or blocks staff.
4. Confirm staff can still use pending, active, bike, and Morning Check workflows.
5. Sign in as owner.
6. Confirm owner can access settings and user management.
7. Confirm owner can see export/correction flows that staff cannot.

## Current code baseline
The current app enforces this separation through:
- dashboard auth gate in `src/lib/auth.ts`
- owner-only settings layout in `src/app/dashboard/settings/layout.tsx`
- owner-only action guard in `src/lib/action-auth.ts`
- owner-only export and correction flows in selected pages/actions

## Phase mapping
This checkpoint note closes Phase 13.8 as a defined verification target for owner/staff permission differences in the current build.
