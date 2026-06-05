# Wander Bike Internal Rental Dashboard
# Final Development Plan

## Principles
- Build a usable internal V1 for real shop operations.
- Keep work split into very small parts that can each be completed in about 2 minutes.
- All database changes must go through SQL migrations.
- Environments must be separated: local/dev, staging/preview, production.
- Build order: data and permissions first, then core logic, then UI, then deployment and QA.

## Phase 0. Project Setup

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 0.1 | Initialize Next.js project | None | Project runs locally |
| 0.2 | Install dependencies | 0.1 | package.json complete |
| 0.3 | Create directory structure | 0.1 | app/components/lib/actions/types/supabase/sql created |
| 0.4 | Configure Tailwind and global styles | 0.1 | Styles working |
| 0.5 | Create `.env.example` | 0.1 | Env template complete |
| 0.6 | Document server-only env safety rules | 0.5 | Service role key not exposed to client |

## Phase 1. Supabase Foundation

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 1.1 | Create Supabase project | 0.x | Project accessible |
| 1.2 | Enable Auth | 1.1 | Email/password auth available |
| 1.3 | Create storage buckets | 1.1 | `signatures`, `bike-photos` created |
| 1.4 | Create base enums | 1.1 | DB enums available |
| 1.5 | Create profiles / roles foundation | 1.4 | Auth users map to roles |
| 1.6 | Set up migration workflow | 1.1 | `supabase/migrations/` in use |
| 1.7 | Define dev / staging / production strategy | 1.1 | Environment roles documented |

## Phase 2. Database Schema

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 2.1 | Create `customers` table | 1.x | Customer data storable |
| 2.2 | Create `customer_submissions` table | 2.1 | Intake submissions storable |
| 2.3 | Create `rentals` table | 2.2 | Rental workflow storable |
| 2.4 | Create `bikes` table | 1.x | Bike inventory storable |
| 2.5 | Create `rental_bikes` table | 2.3, 2.4 | Rental-bike relations storable |
| 2.6 | Create `maintenance_records` table | 2.4 | Maintenance records storable |
| 2.7 | Create `incident_reports` table | 2.3 | Incident records storable |
| 2.8 | Create `waiver_settings` table | 1.x | Waiver settings storable |
| 2.9 | Create `audit_logs` table | 1.x | Audit logs storable |
| 2.10 | Add foreign keys / unique constraints / indexes | 2.1-2.9 | Relations complete, queries usable |
| 2.11 | Create base seed data | 2.10 | test bikes, waiver settings, and sample submissions/rentals exist where possible |
| 2.12 | Add `updated_at` triggers | 2.10 | Updated timestamps auto-maintained |
| 2.13 | Add submission number and rental number generators | 2.2, 2.3 | Unique submission and rental numbers exist |
| 2.14 | Add waiver snapshot fields | 2.2 | `waiver_version`, `waiver_text_snapshot`, `waiver_accepted_at`, `signature_path` stored |
| 2.15 | Add morning check schema | 2.4, 2.6 | morning check areas, sessions, items, and bike-area linkage designed |

## Phase 3. Security / RLS

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 3.0 | Create permission matrix | 2.x | owner/staff/public permissions are defined for each table, page, field, and action |
| 3.1 | Implement role resolution | 1.5 | owner/staff recognized |
| 3.2 | Add submissions RLS | 2.x, 3.0 | Public can insert intake, cannot read admin data |
| 3.3 | Add rentals RLS | 2.x, 3.0 | staff/owner access controlled |
| 3.4 | Add bikes RLS | 2.x, 3.0 | Bike data protected |
| 3.5 | Add maintenance / incidents RLS | 2.x, 3.0 | Sensitive records controlled |
| 3.6 | Add waiver settings RLS | 2.8, 3.0 | Only owner can edit |
| 3.7 | Add audit logs RLS | 2.9, 3.0 | Audit logs restricted |
| 3.8 | Add storage policies | 1.3, 3.x | Signatures private, bike photos controlled |
| 3.9 | Add RLS test checklist | 3.2-3.8 | verified public cannot read submissions, staff cannot view restricted data, owner can access owner-only records |

## Phase 4. Core Backend Logic

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 4.1 | Create Supabase server/client helpers | 1.x | Reusable helpers available |
| 4.2 | Implement `submitCustomerForm()` | 2.x, 3.x | Pending submission can be created |
| 4.3 | Implement `startRental()` transaction | 2.x, 3.x | pending -> active, bikes -> rented |
| 4.4 | Implement `completeRental()` transaction | 2.x, 3.x | active -> completed, bikes updated correctly |
| 4.5 | Implement `updateActiveRental()` | 4.3 | Active rental editable |
| 4.6 | Implement `cancelSubmission()` | 4.2 | Pending submission cancellable |
| 4.7 | Implement `voidRental()` owner only | 4.4 | Exception correction flow exists |
| 4.8 | Implement `createMaintenanceRecord()` | 2.6 | Maintenance can be recorded |
| 4.9 | Implement `createIncidentReport()` | 2.7 | Incidents can be recorded |
| 4.10 | Implement `exportRentalHistoryCsv()` | 2.x | Owner can export CSV |
| 4.11 | Implement `viewFullId()` with audit log | 2.9 | Full ID access logged |
| 4.12 | Define core error handling rules | 4.2-4.11 | Critical errors handled consistently |
| 4.13 | Add bike availability validator | 4.3 | Duplicate bike rental prevented |
| 4.14 | Add audit log writer | 2.9 | Key actions consistently logged |
| 4.15 | Add dashboard stats query | 2.x | Overview stats retrievable |
| 4.16 | Add revenue summary query | 2.x | Report stats retrievable |
| 4.17 | Add `submitMorningCheck()` transaction | 2.15, 3.x | morning check submission updates bike status and creates maintenance when needed |
| 4.18 | Add morning check history queries | 2.15 | morning check history retrievable by date, area, bike, and staff |

## Phase 5. Auth

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 5.0 | Bootstrap first owner account | 1.5 | real owner auth user is linked to owner profile |
| 5.1 | Build login page | 1.2 | Login page accessible |
| 5.2 | Implement login flow | 5.1 | Users can log in |
| 5.3 | Implement logout | 5.2 | Users can log out safely |
| 5.4 | Add route protection | 5.2 | Unauthenticated users blocked from dashboard |

## Phase 6. Customer Intake Form

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 6.1 | Build intake page shell | 4.2 | Page opens |
| 6.2 | Add customer fields | 6.1 | Name/phone/email input works |
| 6.3 | Add ID fields | 6.1 | ID type and full ID number input works |
| 6.4 | Add waiver display | 2.8 | Current waiver visible |
| 6.5 | Add agreement checkbox | 6.4 | Submit blocked until checked |
| 6.6 | Add signature pad | 6.1 | Customer can sign |
| 6.7 | Connect submit action | 4.2 | Submission creates pending record |
| 6.8 | Build success page | 6.7 | Success feedback shown |
| 6.9 | Optimize mobile / iPad UI | 6.1-6.8 | Counter workflow usable |
| 6.10 | Add validation messages | 6.7 | Clear error prompts shown |
| 6.11 | Add signature upload failure handling | 6.7 | Retry/error path works |
| 6.12 | Bind waiver snapshot on submit | 2.14 | Submitted waiver version preserved |

## Phase 7. Dashboard Shell

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 7.1 | Build dashboard layout | 5.4 | Core admin shell exists |
| 7.2 | Build sidebar | 7.1 | Main navigation works |
| 7.3 | Build header / user menu | 7.1 | User state visible |
| 7.4 | Build shared table/card UI | 7.1 | Reusable list components exist |
| 7.5 | Do one preview deploy | 7.1 | Staging/preview verified |

## Phase 8. Pending Submissions

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 8.1 | Build pending list page | 7.1, 4.2 | Pending submissions visible |
| 8.2 | Add search | 8.1 | Search by customer/phone/number works |
| 8.3 | Build detail page | 8.1 | Single submission review works |
| 8.4 | Add masked/full ID display logic | 4.11 | Permission-based ID display works |
| 8.5 | Add rental detail form | 8.3 | Staff can enter rental details |
| 8.6 | Add bike assignment UI | 8.5 | Staff can assign available bikes |
| 8.7 | Add Start Rental button | 4.3 | Pending can become active |
| 8.8 | Add success / error feedback | 8.7 | Result messages clear |
| 8.9 | Add pending error states | 8.7 | Common pending flow failures handled |
| 8.10 | Add full ID view audit integration | 8.4 | Full ID views logged |
| 8.11 | Add cancel pending submission | 4.6 | Pending can be canceled |

## Phase 9. Active Rentals

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 9.1 | Build active list page | 4.3 | Active rentals visible |
| 9.2 | Add search / filters | 9.1 | Search/filter active rentals works |
| 9.3 | Build detail page | 9.1 | Active rental detail visible |
| 9.4 | Add edit form | 9.3 | Notes/return time editable |
| 9.5 | Add assigned bike editor | 4.5 | Bike changes sync correctly |
| 9.6 | Add incident form | 4.9 | Incidents can be added |
| 9.7 | Add Complete Rental button | 4.4 | Rental can be completed |
| 9.8 | Add overdue indicator | 9.1 | Overdue rental shown clearly |
| 9.9 | Add active rental error states | 9.7 | Duplicate complete and similar failures handled |
| 9.10 | Add bike return condition | 9.7 | Return state can be captured |
| 9.11 | Add maintenance needed flag | 9.7 | Bike can be sent to maintenance after return |
| 9.12 | Add complete confirmation modal | 9.7 | Misclick protection exists |

## Phase 10. Bikes & Maintenance

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 10.1 | Build bikes list page | 7.1 | Bike inventory visible |
| 10.2 | Add search / filters | 10.1 | Bike filtering works |
| 10.3 | Add bike form | 10.1 | New bikes can be created |
| 10.4 | Add bike edit form | 10.1 | Bikes can be edited |
| 10.5 | Add bike photo upload | 1.3 | Bike photos upload works |
| 10.6 | Build bike detail page | 10.1 | Bike detail visible |
| 10.7 | Show rental linkage | 10.6 | Bike rental history visible |
| 10.8 | Show maintenance history | 10.6 | Bike maintenance visible |
| 10.9 | Add maintenance form | 4.8 | New maintenance record can be added |
| 10.10 | Add archive bike flow | 10.4 | Bike can be archived, not hard-deleted |

## Phase 10B. Morning Check / Daily Bike Inspection

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 10B.1 | Add morning check areas settings page | 7.1, 2.15, 3.x | Owner can manage inspection areas |
| 10B.2 | Add bike-to-area assignment support | 2.15, 10.4 | Bikes can be linked to default inspection areas |
| 10B.3 | Build morning check page | 7.1, 4.17 | Staff can open daily inspection workflow |
| 10B.4 | Group bikes by area | 10B.3 | Bikes display by inspection area |
| 10B.5 | Add per-bike check status controls | 10B.3 | Staff can mark all good / front flat / rear flat / sent to maintenance |
| 10B.6 | Add per-bike notes input | 10B.3 | Staff can add optional bike notes |
| 10B.7 | Add staff signature capture | 10B.3 | One signature captured per morning check session |
| 10B.8 | Submit morning check session | 4.17 | Morning check session and items saved |
| 10B.9 | Auto-update bike status from results | 4.17 | Problem bikes become maintenance, rented bikes not overridden |
| 10B.10 | Auto-create maintenance records when needed | 4.17 | Flat / sent-to-maintenance results create maintenance records |
| 10B.11 | Build morning check history page | 4.18 | History view searchable by date, area, bike, and staff |
| 10B.12 | Show morning check history on bike detail page | 10.6, 10B.11 | Bike detail includes inspection history |
| 10B.13 | Prevent edits/deletes of submitted checks by staff | 10B.8 | Submitted operational records are protected |
| 10B.14 | Add morning check export option for owner | 10B.11 | Owner can export history if needed |

## Phase 11. Rental History & Reports

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 11.1 | Build rental history page | 4.4 | Completed rentals visible |
| 11.2 | Add history search | 11.1 | Search history works |
| 11.3 | Add date range filter | 11.1 | Date filter works |
| 11.4 | Add staff filter | 11.1 | Staff filter works |
| 11.5 | Build history detail view | 11.1 | Full completed rental detail visible |
| 11.6 | Add CSV export | 4.10 | Owner can export filtered CSV |
| 11.7 | Build reports page | 4.15, 4.16 | Reports page shows summary |
| 11.8 | Add day / month / year summary | 11.7 | Aggregation switching works |

## Phase 12. Settings / PWA / Deployment

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 12.1 | Build waiver settings page | 2.8 | Owner can edit waiver |
| 12.2 | Build ID type settings | 12.1 | Owner can update ID options |
| 12.3 | Build business settings | 7.1 | Basic shop settings editable |
| 12.4 | Build user management | 5.0 | Owner can manage staff |
| 12.5 | Add PWA manifest | 0.x | App installable |
| 12.6 | Add service worker / caching | 12.5 | Basic PWA behavior works |
| 12.7 | Do production deploy | 7.5 | Production site available |
| 12.8 | Write README / ops notes | All prior | Handoff/deploy docs complete |
| 12.9 | Add data retention policy note | 2.x | Retention policy documented |
| 12.10 | Add backup / recovery checklist | 12.7 | Backup awareness documented |

## Phase 13. QA / Hardening

| Part | Task | Dependencies | Done Criteria |
|---|---|---:|---|
| 13.1 | Auth checkpoint | 5.x | owner/staff login works |
| 13.2 | Intake checkpoint | 6.x | Customer can submit pending |
| 13.3 | Pending -> Active checkpoint | 8.x | Start Rental works |
| 13.4 | Bike rented status checkpoint | 8.x | Bike status sync correct |
| 13.5 | Active -> Complete checkpoint | 9.x | Complete Rental works |
| 13.6 | Bike return status checkpoint | 9.x | Bike post-return state correct |
| 13.7 | History / Reports checkpoint | 11.x | Reports and history accurate |
| 13.8 | Owner / Staff permission checkpoint | 3.x, 5.x | Permission differences correct |
| 13.9 | Morning Check checkpoint | 10B.x | Morning Check area grouping, status updates, and maintenance creation work correctly |
| 13.10 | Mobile / iPad usability checkpoint | 6.x, 7.x, 10B.x | Shop-floor usability acceptable |
| 13.11 | Production smoke test | 12.7 | Production core flow passes |

## Required Execution Order
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 7
8. Phase 6
9. Phase 8
10. Phase 9
11. Phase 10
12. Phase 10B
13. Phase 11
14. Phase 12
15. Phase 13

## Key Rules
- All DB changes go through migrations.
- local/dev, staging, and production must stay separate.
- Full ID numbers are permission-controlled.
- Signatures must use private storage.
- Full ID views must be audit logged.
- Bike model uses `status = available | rented | maintenance` and `is_archived = true | false`.
- Each submission must preserve `waiver_version`, `waiver_text_snapshot`, `waiver_accepted_at`, and `signature_path`.
- `startRental()` must be transactional.
- `completeRental()` must be transactional.
- Morning Check is a dedicated daily operations module, not just a page.
- Morning Check results must not override bikes currently in `rented` status.
- Morning Check problem results must automatically create maintenance records.
- Permission Matrix should be defined before finalizing RLS behavior.
- Seed data and auth bootstrap should be treated as separate setup concerns.
- Production readiness should include an explicit security checklist before launch.
