---
title: Design placement, migration runner and auth integration
created_session: '20261005_203953_63d2f4'
sessions: []
approved: false
---

# Task 2.3 — Design placement, migration runner and auth integration

> From: plan_000 phase_002 task 2.3 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_002.md

## Goal

Specify Q63 placement/namespace/ledger/locking/removal mechanics within locked D1
constraints. ADR stays proposed.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 2.2

## Files

- Create: `docs/plans/000_spike-plan/designs/q63_persistence-migrations.md`
- Create: `docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md`
- Create: `docs/decisions/0005-database-placement-and-migrations.md`

## Acceptance

Compare shared vs separately bound D1 with one-batch atomicity; select provisional
placement with dev input. Specify table/migration namespace/collisions, dependency order,
persistent ledger, concurrent-deploy exclusion/fencing, partial failure/retry,
data-vs-schema migrations, Drizzle-generated SQL execution, empty/existing upgrade
behavior, Better Auth complete base-schema generation/ownership, safe module removal/data
retention and Q65 backup/recovery requirements. Q40 supplies wiring participation; recovery
remains provisional until Q65. Identity cannot become INTEGER or unprefixed.

## Verification

Requirement matrix covers every Q63 scope bullet in 003 §Q63. Check chosen package/adapter
behavior against actual official docs and installed/pinned packages; record unknowns as
evidence work, not a proven API. ADR stays proposed.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the
dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

`docs(spikes): design placement, migration runner and auth integration (2.3)` — proposal only; dev-triggered.
