# Wander Bike Database Schema v1.2

## 1. Design Principles
- Database: PostgreSQL via Supabase.
- All primary keys use `uuid`.
- All timestamps use `timestamptz`.
- Sensitive fields must be protected by RLS and role-aware APIs.
- Bike archive is modeled with `is_archived boolean`, not as a bike status.
- Submission lifecycle is separate from rental lifecycle.
- Rental records in V1 must come from customer submissions.
- Waiver data must be snapshotted at submission time.
- Full ID number must only be returned through controlled server-side access.
- Morning Check is a daily operations module linked to bikes and maintenance, not just a UI page.

## 2. Enums

### `user_role`
- `owner`
- `staff`

### `submission_status`
- `pending`
- `converted`
- `cancelled`
- `voided`

### `rental_status`
- `active`
- `completed`
- `cancelled`
- `voided`

### `bike_status`
- `available`
- `rented`
- `maintenance`

### `payment_status`
- `unpaid`
- `paid`
- `refunded`
- `waived`

### `payment_method`
- `cash`
- `card`
- `etransfer`
- `other`

### `id_type`
- `drivers_licence`
- `passport`
- `bcid`
- `other_gov_id`
- `other`

### `audit_action`
- `VIEW_FULL_ID`
- `START_RENTAL`
- `COMPLETE_RENTAL`
- `CANCEL_SUBMISSION`
- `VOID_RENTAL`
- `UPDATE_RENTAL`
- `UPDATE_BIKE_STATUS`
- `ARCHIVE_BIKE`
- `EXPORT_CSV`
- `UPDATE_WAIVER`
- `CREATE_MAINTENANCE`
- `CREATE_INCIDENT`
- `SUBMIT_MORNING_CHECK`

### `morning_check_status`
- `all_good`
- `front_tire_flat`
- `rear_tire_flat`
- `sent_to_maintenance`

## 3. Tables

## 3.1 `profiles`
Maps Supabase auth users to app roles.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK, references `auth.users(id)` |
| email | text | yes | normalized email |
| full_name | text | no | display name |
| role | user_role | yes | `owner` or `staff` |
| is_active | boolean | yes | default true |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- Unique: `email`

Indexes:
- `idx_profiles_role`
- `idx_profiles_is_active`

---

## 3.2 `customers`
Logical customer record used for repeat renters.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| first_name | text | yes |  |
| last_name | text | yes |  |
| phone_number | text | yes | normalized if possible |
| email | text | no | nullable if unavailable |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`

Indexes:
- `idx_customers_phone_number`
- `idx_customers_email`
- `idx_customers_name`

Note:
- V1 should not hard-enforce deduping. Reuse when confidently matched, otherwise allow separate records.
- Legal and rental history should rely on submission snapshots, not mutable customer master data.

---

## 3.3 `morning_check_areas`
Stores configurable inspection areas for daily opening checks.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| name | text | yes | area label, e.g. Area A |
| display_order | integer | yes | sort order |
| is_active | boolean | yes | default true |
| notes | text | no | optional internal notes |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- Unique: `name`

Indexes:
- `idx_morning_check_areas_display_order`
- `idx_morning_check_areas_is_active`

---

## 3.4 `customer_submissions`
Stores customer intake form submissions.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| customer_id | uuid | no | FK to `customers(id)` |
| submission_number | text | yes | unique human-friendly reference |
| first_name | text | yes | snapshot from form |
| last_name | text | yes | snapshot from form |
| phone_number | text | yes | snapshot from form |
| email | text | no | snapshot from form |
| id_type | id_type | yes | submitted ID type |
| full_id_number | text | yes | sensitive, controlled access only |
| id_last4 | text | yes | derived masked helper |
| waiver_version | text | yes | snapshot of waiver version |
| waiver_text_snapshot | text | yes | full waiver text at submission time |
| waiver_accepted | boolean | yes | must be true for valid submission |
| waiver_accepted_at | timestamptz | yes | acceptance timestamp |
| signature_path | text | yes | private storage path |
| submitted_at | timestamptz | yes | default now() |
| status | submission_status | yes | initially `pending` |
| created_rental_id | uuid | no | FK to `rentals(id)` once converted |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- Unique: `submission_number`
- FK: `customer_id -> customers(id)`
- FK: `created_rental_id -> rentals(id)`

Indexes:
- `idx_submissions_submission_number`
- `idx_submissions_phone_number`
- `idx_submissions_submitted_at`
- `idx_submissions_status`
- `idx_submissions_created_rental_id`

Notes:
- Public intake can insert here, but cannot read across submissions.
- `status = converted` means a rental has been created from this submission.
- `full_id_number` must never be returned by default list queries.

---

## 3.5 `rentals`
Core rental record controlled by staff.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| rental_number | text | yes | unique human-friendly number |
| submission_id | uuid | yes | FK to `customer_submissions(id)` |
| customer_id | uuid | yes | FK to `customers(id)` |
| status | rental_status | yes | active/completed/cancelled/voided |
| adult_bike_quantity | integer | yes | default 0 |
| kid_bike_quantity | integer | yes | default 0 |
| trailer_quantity | integer | yes | default 0 |
| start_time | timestamptz | yes | set when rental starts |
| expected_return_time | timestamptz | yes | expected return |
| actual_return_time | timestamptz | no | actual return |
| estimated_fee | numeric(10,2) | no | optional estimate |
| final_fee | numeric(10,2) | no | final charged amount |
| payment_method | payment_method | no | optional in V1 |
| payment_status | payment_status | yes | default `unpaid` |
| notes | text | no | staff notes |
| incident_flag | boolean | yes | default false |
| maintenance_needed | boolean | yes | default false |
| created_by_user_id | uuid | no | FK to `profiles(id)` |
| updated_by_user_id | uuid | no | FK to `profiles(id)` |
| completed_by_user_id | uuid | no | FK to `profiles(id)` |
| completed_at | timestamptz | no | when marked completed |
| cancelled_at | timestamptz | no | when canceled |
| voided_at | timestamptz | no | when voided |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- Unique: `rental_number`
- Unique: `submission_id` (one final rental per submission)
- FK: `submission_id -> customer_submissions(id)`
- FK: `customer_id -> customers(id)`
- FK: `created_by_user_id -> profiles(id)`
- FK: `updated_by_user_id -> profiles(id)`
- FK: `completed_by_user_id -> profiles(id)`
- Check: quantities >= 0
- Check: fees >= 0 when present
- Check: `expected_return_time >= start_time`

Indexes:
- `idx_rentals_rental_number`
- `idx_rentals_customer_id`
- `idx_rentals_submission_id`
- `idx_rentals_status`
- `idx_rentals_start_time`
- `idx_rentals_expected_return_time`
- `idx_rentals_completed_at`
- `idx_rentals_created_by_user_id`

Notes:
- Rentals in V1 begin at `active`, not `pending`.
- `startRental()` and `completeRental()` must update this table transactionally.

---

## 3.6 `bikes`
Bike inventory master table.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| bike_number | text | yes | unique shop-visible bike ID |
| bike_type | text | yes | e.g. adult, kid, e-bike if needed |
| size | text | no | optional size label |
| status | bike_status | yes | available/rented/maintenance |
| is_archived | boolean | yes | default false |
| morning_check_area_id | uuid | no | FK to `morning_check_areas(id)` |
| photo_path | text | no | storage path |
| notes | text | no | internal notes |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- Unique: `bike_number`
- FK: `morning_check_area_id -> morning_check_areas(id)`

Indexes:
- `idx_bikes_bike_number`
- `idx_bikes_status`
- `idx_bikes_is_archived`
- `idx_bikes_bike_type`
- `idx_bikes_morning_check_area_id`

Rules:
- Archived bikes cannot be assigned to new rentals.
- Rented bikes cannot be archived.
- Bikes with rental history cannot be hard deleted.

---

## 3.7 `rental_bikes`
Join table linking rentals and assigned bikes.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| rental_id | uuid | yes | FK to `rentals(id)` |
| bike_id | uuid | yes | FK to `bikes(id)` |
| assigned_at | timestamptz | yes | default now() |
| unassigned_at | timestamptz | no | set if bike is swapped out before rental completes |
| unassigned_by_user_id | uuid | no | FK to `profiles(id)` |
| returned_condition | text | no | optional return notes |
| return_requires_maintenance | boolean | yes | default false |
| created_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- FK: `rental_id -> rentals(id)`
- FK: `bike_id -> bikes(id)`
- FK: `unassigned_by_user_id -> profiles(id)`
- Unique: `(rental_id, bike_id, assigned_at)`

Indexes:
- `idx_rental_bikes_rental_id`
- `idx_rental_bikes_bike_id`
- `idx_rental_bikes_unassigned_at`

Notes:
- Current bike assignments are rows where `unassigned_at is null`.
- If a bike is swapped during an active rental, do not delete the old row. Set `unassigned_at` instead.

---

## 3.8 `morning_checks`
Stores one submitted morning check session.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| check_date | date | yes | shop day being inspected |
| staff_user_id | uuid | yes | FK to `profiles(id)` |
| signature_path | text | yes | private storage path |
| notes | text | no | session-level notes |
| submitted_at | timestamptz | yes | when final check was submitted |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- FK: `staff_user_id -> profiles(id)`

Indexes:
- `idx_morning_checks_check_date`
- `idx_morning_checks_staff_user_id`
- `idx_morning_checks_submitted_at`

Notes:
- One signature is captured per morning check session, not per bike.

---

## 3.9 `morning_check_items`
Stores each bike inspection result inside a morning check session.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| morning_check_id | uuid | yes | FK to `morning_checks(id)` |
| bike_id | uuid | yes | FK to `bikes(id)` |
| area_id | uuid | no | FK to `morning_check_areas(id)` |
| check_status | morning_check_status | yes | inspection result |
| notes | text | no | optional bike-specific notes |
| created_maintenance_record_id | uuid | no | FK to `maintenance_records(id)` |
| created_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- FK: `morning_check_id -> morning_checks(id)`
- FK: `bike_id -> bikes(id)`
- FK: `area_id -> morning_check_areas(id)`
- FK: `created_maintenance_record_id -> maintenance_records(id)`
- Unique: `(morning_check_id, bike_id)`

Indexes:
- `idx_morning_check_items_morning_check_id`
- `idx_morning_check_items_bike_id`
- `idx_morning_check_items_area_id`
- `idx_morning_check_items_check_status`

Rules:
- Morning Check must not change a bike in `rented` status back to `available`.
- Problem results should create related maintenance records.

---

## 3.10 `maintenance_records`
Maintenance history for bikes.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| bike_id | uuid | yes | FK to `bikes(id)` |
| rental_id | uuid | no | FK to `rentals(id)` if related to a return |
| maintenance_date | timestamptz | yes | when work was done or logged |
| work_done | text | yes | required description |
| cost | numeric(10,2) | no | optional |
| notes | text | no | additional notes |
| staff_user_id | uuid | no | FK to `profiles(id)` |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- FK: `bike_id -> bikes(id)`
- FK: `rental_id -> rentals(id)`
- FK: `staff_user_id -> profiles(id)`
- Check: cost >= 0 when present

Indexes:
- `idx_maintenance_bike_id`
- `idx_maintenance_rental_id`
- `idx_maintenance_date`

---

## 3.11 `incident_reports`
Incident logs tied to a rental.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| rental_id | uuid | yes | FK to `rentals(id)` |
| bike_id | uuid | no | optional FK to `bikes(id)` |
| description | text | yes | incident details |
| severity | text | no | optional, can stay simple in V1 |
| created_by_user_id | uuid | no | FK to `profiles(id)` |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- FK: `rental_id -> rentals(id)`
- FK: `bike_id -> bikes(id)`
- FK: `created_by_user_id -> profiles(id)`

Indexes:
- `idx_incidents_rental_id`
- `idx_incidents_bike_id`
- `idx_incidents_created_at`

Note:
- V1 allows at most one directly linked bike per incident row. If multi-bike incident handling is needed later, introduce `incident_bikes`.

---

## 3.12 `waiver_settings`
Current editable waiver configuration.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| version | text | yes | unique waiver version label |
| waiver_text | text | yes | current full waiver text |
| id_type_options | jsonb | yes | configurable ID options |
| customer_instructions | text | no | optional instructions |
| is_active | boolean | yes | default true |
| updated_by_user_id | uuid | no | FK to `profiles(id)` |
| created_at | timestamptz | yes | default now() |
| updated_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- Unique: `version`
- FK: `updated_by_user_id -> profiles(id)`
- Business rule: only one row may have `is_active = true`

Indexes:
- `idx_waiver_settings_version`
- `idx_waiver_settings_is_active`
- Partial unique index recommended for single active waiver

Notes:
- V1 should enforce a single active waiver through SQL constraint or partial unique index.

---

## 3.13 `audit_logs`
Audit trail for sensitive access and important state changes.

| Column | Type | Required | Notes |
|---|---|---:|---|
| id | uuid | yes | PK |
| actor_user_id | uuid | no | FK to `profiles(id)` |
| action | audit_action | yes | audited action |
| entity_type | text | yes | e.g. rental, bike, submission |
| entity_id | uuid | no | related entity |
| before_data | jsonb | no | optional snapshot |
| after_data | jsonb | no | optional snapshot |
| metadata | jsonb | no | optional extra context, e.g. ip/user-agent/reason |
| created_at | timestamptz | yes | default now() |

Constraints:
- PK: `id`
- FK: `actor_user_id -> profiles(id)`

Indexes:
- `idx_audit_logs_actor_user_id`
- `idx_audit_logs_action`
- `idx_audit_logs_entity_type_entity_id`
- `idx_audit_logs_created_at`

Notes:
- `metadata` should include request context for sensitive events like `VIEW_FULL_ID` and `EXPORT_CSV`.
- Morning Check submission and auto-created maintenance actions should also be logged.

---

## 4. Key Relationships
- One `customer` can have many `customer_submissions`.
- One `customer` can have many `rentals`.
- One `customer_submission` can create zero or one final `rental`.
- One `rental` can have many `rental_bikes`.
- One `bike` can appear in many `rental_bikes` over time.
- One `morning_check_area` can contain many bikes.
- One `morning_check` can have many `morning_check_items`.
- One `bike` can appear in many `morning_check_items` over time.
- One `bike` can have many `maintenance_records`.
- One `rental` can have many `incident_reports`.
- One `profile` can create/update many records.

## 5. Important Derived / Access Rules
- `id_last4` should be derived from `full_id_number` and used for masked display.
- Staff may view full ID only during permitted verification flows.
- Owner may view full ID broadly, but access should still be audit logged.
- Normal list queries and default detail queries should not return `full_id_number`.
- Full ID should be returned only through controlled RPC/server action flows.
- Signature files must live in private storage and only be retrievable through authorized flows.
- Public intake should be able to insert submissions but must not be able to select arbitrary submission data.
- Morning Check should default to shop operational bikes and must not override currently rented bikes.

## 6. Morning Check Status Mapping Rules
- `all_good` -> bike should remain `available` if it is not currently `rented`.
- `front_tire_flat` -> bike becomes `maintenance` and a maintenance record should be created.
- `rear_tire_flat` -> bike becomes `maintenance` and a maintenance record should be created.
- `sent_to_maintenance` -> bike becomes `maintenance` and a maintenance record should be created.
- If a bike is currently `rented`, Morning Check must not force it back to `available`.

## 7. Required SQL-Level Follow-ups
The SQL migration version should explicitly implement:
1. `updated_at` triggers for mutable tables.
2. Partial unique index for a single active waiver.
3. Generated or server-assigned `submission_number` and `rental_number`.
4. RLS policies that prevent normal staff list queries from reading `full_id_number`.
5. Controlled RPC/server action path for full ID access with audit logging.
6. Morning Check tables, enum, indexes, and bike-area foreign key.
7. `submitMorningCheck()` transactional flow that updates bike status and creates maintenance records.

## 8. Recommended Next Step
After this schema doc, the next deliverable should be:
1. Update `permission-matrix.md` to include Morning Check, or
2. Extend Supabase-ready SQL / migration files with Morning Check support.
