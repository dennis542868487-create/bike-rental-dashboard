# Wander Bike Permission Matrix v1.1

## 1. Purpose
This document defines who can view, create, update, export, or access sensitive data across the Wander Bike internal rental dashboard.

Roles covered:
- Public customer
- Staff
- Owner

Principles:
- Public users can only submit intake data.
- Staff can operate the rental workflow.
- Owner can manage the system and access sensitive history.
- Full ID number is never returned by default list queries.
- Signature files are private.
- Sensitive access should be audit logged.
- Morning Check is a protected operational record, not an editable casual checklist.

## 2. Role Summary

### Public customer
- Can open the intake form.
- Can submit a customer intake form.
- Cannot log into the admin dashboard.
- Cannot browse submissions, rentals, bikes, reports, users, signatures, or morning check records.

### Staff
- Can log into the admin dashboard.
- Can process pending submissions.
- Can start rentals.
- Can manage active rentals.
- Can complete rentals.
- Can view and manage bikes for shop operations.
- Can add maintenance and incident records if enabled.
- Can create and submit Morning Check sessions.
- Cannot manage owner-level settings.
- Cannot export sensitive history by default.
- Cannot delete submitted Morning Check records.

### Owner
- Can do everything staff can do.
- Can manage settings, users, waiver configuration, and reporting.
- Can view full ID numbers under controlled access.
- Can export CSV.
- Can void records when necessary.
- Can manage Morning Check areas and review all Morning Check history.

## 3. Access Matrix by Module

Legend:
- ✅ allowed
- ⚠️ allowed with limits / audit / controlled flow
- ❌ not allowed

### 3.1 Authentication and Session

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| Open login page | ✅ | ✅ | ✅ |  |
| Log into dashboard | ❌ | ✅ | ✅ | Admin only |
| Log out | ❌ | ✅ | ✅ |  |
| Access protected dashboard routes | ❌ | ✅ | ✅ | Requires auth |

### 3.2 Customer Intake Form

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| Open intake form | ✅ | ✅ | ✅ | Public kiosk flow |
| Submit intake form | ✅ | ✅ | ✅ | Public insert only |
| Read arbitrary submissions from public flow | ❌ | ❌ | ❌ | Never public |
| Upload signature during intake | ✅ | ✅ | ✅ | Only for current submission flow |
| Read signature files directly | ❌ | ❌ | ❌ | Through authorized admin flow only |

### 3.3 Pending Submissions

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View pending submissions list | ❌ | ✅ | ✅ | Admin only |
| Search pending submissions | ❌ | ✅ | ✅ |  |
| View pending submission detail | ❌ | ✅ | ✅ |  |
| View masked ID in pending detail | ❌ | ✅ | ✅ | Default display |
| View full ID in pending verification flow | ❌ | ⚠️ | ⚠️ | Controlled flow + audit log |
| Enter rental details on pending submission | ❌ | ✅ | ✅ | quantities, bikes, times, fees, notes |
| Start rental from pending submission | ❌ | ✅ | ✅ | Transactional action |
| Cancel pending submission | ❌ | ✅ | ✅ | Logged action |
| Void pending submission | ❌ | ❌ | ✅ | Exceptional correction |

### 3.4 Rentals, Active Workflow, and Completion

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View active rentals list | ❌ | ✅ | ✅ |  |
| Search/filter active rentals | ❌ | ✅ | ✅ |  |
| View active rental detail | ❌ | ✅ | ✅ |  |
| Edit active rental notes | ❌ | ✅ | ✅ |  |
| Edit expected return time | ❌ | ✅ | ✅ |  |
| Edit assigned bikes | ❌ | ✅ | ✅ | Must preserve assignment history |
| View masked ID linked to rental | ❌ | ✅ | ✅ | Default display |
| View full ID linked to rental | ❌ | ❌ | ⚠️ | Owner only through controlled flow |
| Complete rental | ❌ | ✅ | ✅ | Transactional action |
| Cancel active rental | ❌ | ❌ | ✅ | Owner only |
| Void rental | ❌ | ❌ | ✅ | Owner only, audited |

### 3.5 Rental History

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View completed rental history list | ❌ | ⚠️ | ✅ | Staff can be limited by business rule |
| Search rental history | ❌ | ⚠️ | ✅ |  |
| Filter rental history by date/staff/bike | ❌ | ⚠️ | ✅ |  |
| View completed rental detail | ❌ | ⚠️ | ✅ |  |
| View masked ID in history | ❌ | ⚠️ | ✅ | Staff may get masked-only access |
| View full ID in history | ❌ | ❌ | ⚠️ | Owner only + audit log |
| Export rental history CSV | ❌ | ❌ | ✅ | Audited |

### 3.6 Bikes

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View bikes list | ❌ | ✅ | ✅ |  |
| Search/filter bikes | ❌ | ✅ | ✅ |  |
| View bike detail | ❌ | ✅ | ✅ |  |
| Add bike | ❌ | ✅ | ✅ | If shop wants staff to help inventory |
| Edit bike info | ❌ | ✅ | ✅ |  |
| Change bike status | ❌ | ✅ | ✅ | Audited recommended |
| Assign bike to morning check area | ❌ | ✅ | ✅ | Area linkage for operations |
| Upload bike photo | ❌ | ✅ | ✅ | Controlled storage |
| Archive bike | ❌ | ⚠️ | ✅ | Staff optional by business choice |
| Hard delete bike | ❌ | ❌ | ❌ | Not allowed in V1 |

### 3.7 Maintenance Records

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View maintenance records | ❌ | ✅ | ✅ |  |
| Add maintenance record | ❌ | ✅ | ✅ |  |
| Edit maintenance record | ❌ | ⚠️ | ✅ | Staff edits optional |
| Delete maintenance record | ❌ | ❌ | ⚠️ | Prefer not allowed; owner should archive/correct instead |

### 3.8 Incident Reports

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View incident reports | ❌ | ✅ | ✅ | Related workflow access |
| Add incident report | ❌ | ✅ | ✅ |  |
| Edit incident report | ❌ | ⚠️ | ✅ | Staff edits optional |
| Delete incident report | ❌ | ❌ | ⚠️ | Prefer not allowed; use correction flow |

### 3.9 Morning Check / Daily Bike Inspection

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View Morning Check page | ❌ | ✅ | ✅ | Daily operations module |
| Create Morning Check session | ❌ | ✅ | ✅ |  |
| View bikes grouped by area | ❌ | ✅ | ✅ | Excludes or disables rented bikes |
| Mark bike as all good / front flat / rear flat / sent to maintenance | ❌ | ✅ | ✅ | Operational input |
| Add per-bike notes | ❌ | ✅ | ✅ |  |
| Add session notes | ❌ | ✅ | ✅ |  |
| Sign Morning Check session | ❌ | ✅ | ✅ | One signature per session |
| Submit Morning Check session | ❌ | ✅ | ✅ | Transactional flow |
| Auto-update bike status from Morning Check | ❌ | ✅ | ✅ | System action during submit |
| Auto-create maintenance record from Morning Check | ❌ | ✅ | ✅ | System action during submit |
| Change rented bike to available via Morning Check | ❌ | ❌ | ❌ | Forbidden |
| View Morning Check history | ❌ | ✅ | ✅ | Staff can view recent/operational history |
| Filter Morning Check history by date | ❌ | ✅ | ✅ |  |
| Filter Morning Check history by area | ❌ | ✅ | ✅ |  |
| Filter Morning Check history by bike | ❌ | ✅ | ✅ |  |
| Filter Morning Check history by staff | ❌ | ✅ | ✅ |  |
| View Morning Check signature | ❌ | ✅ | ✅ | Authorized admin view only |
| Edit submitted Morning Check | ❌ | ❌ | ⚠️ | Owner correction only if allowed |
| Delete submitted Morning Check | ❌ | ❌ | ❌ | Not allowed in normal workflow |
| Export Morning Check history | ❌ | ❌ | ✅ | Optional owner-only feature |

### 3.10 Morning Check Areas Settings

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View Morning Check areas admin page | ❌ | ❌ | ✅ | Owner only |
| Create area | ❌ | ❌ | ✅ |  |
| Edit area | ❌ | ❌ | ✅ |  |
| Reorder areas | ❌ | ❌ | ✅ |  |
| Deactivate area | ❌ | ❌ | ✅ |  |

### 3.11 Waiver and Form Settings

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View active waiver text in intake form | ✅ | ✅ | ✅ | Public-facing content |
| View waiver settings admin page | ❌ | ❌ | ✅ | Owner only |
| Edit waiver text | ❌ | ❌ | ✅ | Audited |
| Edit ID type options | ❌ | ❌ | ✅ |  |
| Edit customer instructions | ❌ | ❌ | ✅ |  |
| Activate a new waiver version | ❌ | ❌ | ✅ | Must preserve prior snapshots |

### 3.12 Reports and Revenue

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View dashboard overview counts | ❌ | ✅ | ✅ | active rentals, available bikes, overdue count |
| View today fee summary | ❌ | ⚠️ | ✅ | Staff access optional by owner choice |
| View reports page | ❌ | ⚠️ | ✅ | Owner default |
| View daily/monthly/yearly revenue details | ❌ | ❌ | ✅ | Owner only by default |
| Export reports CSV | ❌ | ❌ | ✅ | Audited |

### 3.13 Users and Roles

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| View own profile basics | ❌ | ✅ | ✅ |  |
| View all users | ❌ | ❌ | ✅ | Owner only |
| Create staff account | ❌ | ❌ | ✅ | Owner only |
| Change user role | ❌ | ❌ | ✅ | Owner only |
| Disable staff account | ❌ | ❌ | ✅ | Owner only |
| Create another owner | ❌ | ❌ | ⚠️ | Strongly restricted |

### 3.14 Audit Logs

| Action | Public | Staff | Owner | Notes |
|---|---:|---:|---:|---|
| Write audit log via system action | ❌ | ✅ | ✅ | System-generated |
| View audit logs | ❌ | ❌ | ✅ | Owner only |
| Export audit logs | ❌ | ❌ | ⚠️ | Optional, owner only |

## 4. Sensitive Data Rules

### 4.1 Full ID number
- Public: never allowed.
- Staff: allowed only during pending verification flow through controlled access.
- Owner: allowed through controlled access in pending, active, or history contexts.
- All full ID views must write `VIEW_FULL_ID` audit logs.
- Default list queries and normal detail queries must not include `full_id_number`.

### 4.2 Signature files
- Stored in private bucket.
- Never listable publicly.
- Never directly exposed as public URLs.
- Admin access should go through authorized retrieval flow.
- Morning Check staff signatures follow the same private access rule.

### 4.3 CSV export
- Owner only by default.
- Must be audit logged.
- Sensitive fields should be carefully scoped in exported data.

## 5. Recommended Operational Defaults

These are the defaults I recommend for V1:
- Staff can view pending and active workflows.
- Staff can start and complete rentals.
- Staff can view masked ID by default.
- Staff can temporarily view full ID only during pending verification.
- Staff cannot export CSV.
- Staff cannot edit waiver settings.
- Staff cannot manage users.
- Staff can submit Morning Check sessions but cannot modify submitted records.
- Owner can access all reports, settings, exports, audit logs, and Morning Check area management.

## 6. RLS / API Enforcement Notes
- Public role: insert-only path for intake submissions and related signature upload flow.
- Staff role: no direct unrestricted table access to `full_id_number`.
- Full ID access should be routed through a dedicated RPC/server action.
- Signature retrieval should be routed through a dedicated authorized path.
- Morning Check submission should be handled through a transactional server action or RPC.
- Rented bikes should be excluded or locked from being reset to available by Morning Check flows.
- Owner-only actions should be enforced in both UI and backend authorization.

## 7. Recommended Next Step
After this permission matrix, the next deliverable should be:
1. Extend Supabase-ready SQL migration files with Morning Check support, or
2. Write a Morning Check transaction spec / RPC spec.
