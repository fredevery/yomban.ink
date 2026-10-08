---
title: Exercise coordinated restore and no-resurrection erasure
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.8 — Exercise coordinated restore and no-resurrection erasure

> From: plan_000 phase_004 task 4.8 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Prove Q65 recovery of actual D1 records and referenced assets, including replica safety scenarios.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.7

## Blocked by

- 4.7

## Parallel

false

## Files

- Create: spikes/q65_recovery-erasure/package.json
- Create: spikes/q65_recovery-erasure/pnpm-lock.yaml
- Create: spikes/q65_recovery-erasure/tsconfig.json
- Create: spikes/q65_recovery-erasure/biome.json
- Create: spikes/q65_recovery-erasure/README.md
- Create: spikes/q65_recovery-erasure/src/proof.ts
- Create: spikes/q65_recovery-erasure/src/proof.test.ts
- Create: spikes/q65_recovery-erasure/vitest.config.ts
- Create: spikes/q65_recovery-erasure/wrangler.jsonc
- Create: spikes/q65_recovery-erasure/src/worker.ts
- Create: spikes/q65_recovery-erasure/restore-runbook.md
- Create: spikes/q65_recovery-erasure/erasure-cases.md
- Modify: docs/plans/000_spike-plan/designs/q65_recovery-erasure.md
- Modify: docs/plans/000_spike-plan/evidence/q65_recovery-erasure.md

## Acceptance

Use synthetic populated Q63 migration/schema fixture with referenced media objects. Export D1 and protected copies, remove/corrupt primary records/assets in disposable gated resources, restore both into clean targets and verify identity/reference/content digests with tool-calculated hashes. Exercise relevant migration/media failure recovery, retained removal, primary-copy loss and access isolation. Test erasure before/after backup restore and replay, online/reconnecting/offline/revoked replica policies, retained tombstone ACK/GC and explicit purge; no silent record resurrection. Browser-local cases are provisional until Phase 005 real OPFS rerun.

## Verification

Run actual chosen export/copy/restore commands, record timings/count/digest/reference checks and failure recovery. From repo root: `pnpm --dir spikes/q65_recovery-erasure install --frozen-lockfile`, then `pnpm --dir spikes/q65_recovery-erasure test`, `pnpm --dir spikes/q65_recovery-erasure typecheck`, `pnpm --dir spikes/q65_recovery-erasure lint`, `pnpm --dir spikes/q65_recovery-erasure build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Remote protected-copy/isolation properties require separately gated real resource evidence; local R2/D1 simulations are labelled, not proof of disaster recovery access isolation.

## Execution notes

Cloud restore never uses production data/resources. Owner verifies resource names, costs and teardown. Record evidence blockers and privacy limits instead of marking missing device checks complete.

## Commits (draft)

docs(spikes): exercise coordinated restore and no-resurrection erasure (4.8) — proposal only; dev-triggered.
