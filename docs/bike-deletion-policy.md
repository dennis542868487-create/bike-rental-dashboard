# Bike Deletion Policy

## Rule
Bikes must not be hard deleted in normal workflow.

## Why
Bike records can be linked to:
- rental history
- maintenance records
- incident reports
- Morning Check records

Hard deletion would break operational history and auditability.

## Required behavior
- archive bikes instead of deleting them
- rented bikes cannot be archived
- bikes with history must stay preserved in the database
- admin UI should not expose a destructive delete action for bikes

## Current implementation baseline
- bike management uses `is_archived` instead of destructive delete
- bike detail page exposes archive flow, not delete flow
- rental and operations history remain attached to preserved bike records

## Phase mapping
This document closes the intent of Phase 10.9 in the current app baseline by making the no-delete rule explicit and aligning the UI flow to archive-only behavior.
