---
title: Prove workflow transitions and optimistic saves
created_session: '20261005_203953_63d2f4'
sessions: ["20261005_221941_20df22"]
approved: true
---

# Task 2.2 — Prove workflow transitions and optimistic saves

> From: plan_000 phase_002 task 2.2 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_002.md

## Goal

Execute bounded non-UI workflow proofs against real D1 and retain accepted workflow input.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 2.1

## Files

- Create: `spikes/q54_content-workflows/package.json`
- Create: `spikes/q54_content-workflows/pnpm-lock.yaml`
- Create: `spikes/q54_content-workflows/tsconfig.json`
- Create: `spikes/q54_content-workflows/biome.json`
- Create: `spikes/q54_content-workflows/README.md`
- Create: `spikes/q54_content-workflows/src/proof.ts`
- Create: `spikes/q54_content-workflows/src/proof.test.ts`
- Create: `spikes/q54_content-workflows/vitest.config.ts`
- Create: `spikes/q54_content-workflows/wrangler.jsonc`
- Create: `spikes/q54_content-workflows/src/schema.ts`
- Create: `spikes/q54_content-workflows/drizzle.config.ts`
- Create: `spikes/q54_content-workflows/migrations/README.md`
- Modify: `docs/plans/000_spike-plan/designs/q54_content-workflows.md`
- Modify: `docs/plans/000_spike-plan/evidence/q54_content-workflows.md`

## Acceptance

TDD real-D1 workflow/field fixtures: each field kind, valid/invalid transitions, scheduled
and post-publish revision history, stale revision/concurrent save denial preserving newer
data, failed/late saves not claiming publish success, resource-permission/preview denials
and media/relation ownership. Use Drizzle-generated fixture migrations and the explicitly
documented proof path; no product migration runner or media pipeline ships. External
propagation/purge/security claims wait for Q66/Q67/Q68.

## Verification

Run the Q54 harness scripts against actual D1 via Workers Vitest pool; inspect persisted
rows/history on successful and rejected transitions. From repo root:
`pnpm --dir spikes/q54_content-workflows install --frozen-lockfile`,
then `pnpm --dir spikes/q54_content-workflows test`,
`pnpm --dir spikes/q54_content-workflows typecheck`,
`pnpm --dir spikes/q54_content-workflows lint`,
`pnpm --dir spikes/q54_content-workflows build`; each must exit 0
and assert the listed behavioral cases. Record observed outputs/versions in the gate
evidence report, not assumed test counts.

## Execution notes

Generate migration artifacts with the pinned Drizzle tooling, list exact generated paths
before execution, and capture real failure output. The local fixture migration path is
provisional evidence, not Q63 closure.

## Commits (draft)

`docs(spikes): prove workflow transitions and optimistic saves (2.2)` — proposal only; dev-triggered.
