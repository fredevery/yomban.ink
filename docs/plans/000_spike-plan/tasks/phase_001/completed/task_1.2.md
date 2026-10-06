---
title: Prove capability checks and feature independence
created_session: '20261004_222104_e4336c'
sessions: ["20261005_132549_49f002"]
approved: true
---

# Task 1.2 — Prove capability checks and feature independence

> From: plan_000 phase_001 task 1.2 · spec: docs/plans/000_spike-plan/000_spike-plan.md

## Goal

Exercise the accepted capability policy through a bounded framework-free manifest/check
harness. Depends on task 1.1. The harness exposes a public capability-validation entry and
invokes it through both positive/negative manifest fixtures; capture diagnostics and inspect
its dependency graph.

## Files

- Create: `spikes/q38_capability-inventory/package.json`
- Create: `spikes/q38_capability-inventory/pnpm-lock.yaml`
- Create: `spikes/q38_capability-inventory/tsconfig.json`
- Create: `spikes/q38_capability-inventory/biome.json`
- Create: `spikes/q38_capability-inventory/README.md`
- Create: `spikes/q38_capability-inventory/src/proof.ts`
- Create: `spikes/q38_capability-inventory/src/proof.test.ts`
- Modify: `docs/plans/000_spike-plan/designs/q38_capability-inventory.md`
- Modify: `docs/plans/000_spike-plan/evidence/q38_capability-inventory.md`

## Acceptance

Write RED tests before the checker. Real manifest inputs cover a valid service-only module, absent optional capability, rejected missing required capability, wrong environment, undeclared dependency/capability and ordinary built-in/custom parity. Test actual checker behavior, not equality against a duplicated expected inventory. No presentation dependencies/binding access. Pin actual tool versions and explicitly supply working scripts/config; src tests are co-located.

## Verification

From repo root: `pnpm --dir spikes/q38_capability-inventory install --frozen-lockfile`, then `pnpm --dir spikes/q38_capability-inventory test`, `pnpm --dir spikes/q38_capability-inventory typecheck`, `pnpm --dir spikes/q38_capability-inventory lint`, `pnpm --dir spikes/q38_capability-inventory build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts.

## Commits (draft)

`docs(spikes): prove capability checks and feature independence (plan_000/task_1.2)` — proposal only; dev-triggered.
