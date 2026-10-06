---
title: Evaluate public-site starter and bounded support
created_session: '20261006_210311_463e93'
sessions: []
approved: false
---

# Task 3.3 — Evaluate public-site starter and bounded support

> From: plan_000 phase_003 task 3.3 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_003.md

## Goal

Compare Q46 starter candidates as a distinct choice, not inferred from admin/panel
technology.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 3.2

## Blocked by

- 3.2

## Parallel

false

## Files

- Create: `docs/plans/000_spike-plan/designs/q46_public-starter.md`
- Create: `docs/plans/000_spike-plan/evidence/q46_public-starter.md`
- Create: `docs/decisions/0008-public-site-starter.md`

## Acceptance

Choose a bounded shortlist after inspecting candidate Workers topology/contract
compatibility; compare workflow/SEO/public budgets/WCAG/browser/support/maintenance/install
ownership and Q70 integration requirements. Record selection proposal and bounded support
(supported versions/interfaces, generated ownership, update obligations/exclusions). Former
SvelteKit choice stays superseded, no automatic Hono/htmx adoption. One production starter
later; fixtures are not starters. No Q69 dogfooding influence.

## Verification

Candidate matrix is source-backed and maps to Q46 owning acceptance, Q62 targets and
Q40/Q47 interfaces. Dev accepts shortlist/selection proposal before proof; adopted choice
awaits 6.4 + joint 7.8. Do not declare unbuilt production performance achieved.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the
dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

`docs(spikes): evaluate public-site starter and bounded support (3.3)` — proposal only; dev-triggered.
