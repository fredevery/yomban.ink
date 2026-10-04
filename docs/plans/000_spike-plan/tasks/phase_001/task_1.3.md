---
title: Accept Q38 and record first gate closure
created_session: '20261004_222104_e4336c'
sessions: []
approved: false
---

# Task 1.3 — Accept Q38 and record first gate closure

> From: plan_000 phase_001 task 1.3 · spec: docs/plans/000_spike-plan/000_spike-plan.md

## Goal

Record the accepted inventory ADR and close Q38 with verified evidence before any subsequent
spike. Depends on task 1.2. Read the actual selected dependencies and owning specs; record
choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

## Files

- Modify: `docs/plans/000_spike-plan/designs/q38_capability-inventory.md`
- Modify: `docs/plans/000_spike-plan/evidence/q38_capability-inventory.md`
- Create: `docs/decisions/0003-core-capability-inventory.md`
- Modify: `docs/plans/000_spike-plan/000_spike-plan.md`

## Acceptance

ADR records inventory/policy, rejected alternatives and design/evidence links; dev acceptance is explicit. Run checker evidence again, reconcile required-vs-optional cases and update only Q38 to Closed with artifacts/version/acceptance. All other gates remain Planned. A failed check blocks closure.

## Verification

From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Inspect ADR/design/evidence parity and the parent closure matrix; Q38 must be the first Closed gate.

## Commits (draft)

`docs(spikes): accept q38 and record first gate closure (plan_000/task_1.3)` — proposal only; dev-triggered.
