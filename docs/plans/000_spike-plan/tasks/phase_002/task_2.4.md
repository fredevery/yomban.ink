---
title: Prove migrations and Better Auth prefixed TEXT IDs
created_session: '20261005_203953_63d2f4'
sessions: []
approved: false
---

# Task 2.4 — Prove migrations and Better Auth prefixed TEXT IDs

> From: plan_000 phase_002 task 2.4 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_002.md

## Goal

Exercise the selected Drizzle/D1 adapter and migration candidate under actual Workers/D1
behavior.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 2.3

## Files

- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/package.json`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/pnpm-lock.yaml`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/tsconfig.json`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/biome.json`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/README.md`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/proof.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/proof.test.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/vitest.config.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/wrangler.jsonc`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/drizzle.config.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/schema.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/auth.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/auth.test.ts`
- Create: `docs/plans/000_spike-plan/spikes/q63_persistence-migrations/migrations/README.md`
- Modify: `docs/plans/000_spike-plan/designs/q63_persistence-migrations.md`
- Modify: `docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md`

## Acceptance

Real D1: empty/existing-version migration, collisions/dependency ordering, replay/retry
after injected failure and simultaneous deploy attempts with safe ledger state,
schema-vs-data upgrade and module removal retaining data. Better Auth generates required
schema and executes supported auth flows through its selected Drizzle/D1 adapter with
core-seam-generated entity-prefixed sortable TEXT IDs across every created auth entity and
FK. No integer/unprefixed fallback; inspect actual stored IDs/schema, not just a generateId
unit test. Pin temporary core-seam ID candidate as provisional pending Q40; final selected
ID and Q68 flows are rerun at reconciliation.

## Verification

Run actual schema-generation/migration commands (record exact command/output and generated
path list) plus real-D1 tests. From repo root:
`pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations install --frozen-lockfile`,
then `pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations test`,
`pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations typecheck`,
`pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations lint`,
`pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations build`; each must
exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate
evidence report, not assumed test counts. Failed compatibility blocks auth work and is
surfaced to the dev.

## Execution notes

RED tests for adapter persistence, upgrade/collision/replay/concurrency first. Q65 restore
of these fixtures follows in Phase 004; Q63 final acceptance waits for 7.2.

## Commits (draft)

`docs(spikes): prove migrations and better auth prefixed text ids (2.4)` — proposal only; dev-triggered.
