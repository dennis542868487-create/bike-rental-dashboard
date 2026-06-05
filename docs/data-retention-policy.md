# Data Retention Policy

## Purpose
Define the minimum retention expectations for operational and sensitive data in the Wander Bike dashboard.

## Core rules

### Customer submissions
- Keep customer submission records long enough to support rental verification, dispute handling, and operational history.
- Avoid deleting submission history casually.
- Sensitive fields such as full ID numbers should remain access-controlled even while retained.

### Rentals
- Keep rental records as part of the long-term operational ledger.
- Completed, cancelled, and voided rentals should remain preserved for auditability.

### Bikes
- Preserve bike records that have linked rental, maintenance, incident, or Morning Check history.
- Use archive instead of hard delete.

### Maintenance and incident records
- Preserve these as operational safety history.
- Do not remove them casually from normal admin workflow.

### Signatures and uploaded files
- Keep signature and bike-photo files aligned with the records they support.
- Signature access must remain private and controlled.
- If a storage cleanup process is introduced later, it must not orphan active database references.

## Practical default
Until a stricter legal/business retention schedule is defined:
- preserve historical records by default
- prefer archive/inactive states over deletion
- restrict sensitive access rather than deleting useful history prematurely

## Phase mapping
This note closes Phase 12.9 by making a baseline retention policy explicit for the current app.
