---
title: Inject effect delivery failures and duplicates
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.2 — Inject effect delivery failures and duplicates

> From: plan_000 phase_004 task 4.2 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Prove the selected Q66 mechanism against actual D1 and appropriate queue/cache boundaries.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.1

## Blocked by

- 4.1

## Parallel

false

## Files

- Create: spikes/q66_durable-effects/package.json
- Create: spikes/q66_durable-effects/pnpm-lock.yaml
- Create: spikes/q66_durable-effects/tsconfig.json
- Create: spikes/q66_durable-effects/biome.json
- Create: spikes/q66_durable-effects/README.md
- Create: spikes/q66_durable-effects/src/proof.ts
- Create: spikes/q66_durable-effects/src/proof.test.ts
- Create: spikes/q66_durable-effects/vitest.config.ts
- Create: spikes/q66_durable-effects/wrangler.jsonc
- Create: spikes/q66_durable-effects/src/schema.ts
- Create: spikes/q66_durable-effects/src/worker.ts
- Modify: docs/plans/000_spike-plan/designs/q66_durable-effects.md
- Modify: docs/plans/000_spike-plan/evidence/q66_durable-effects.md

## Acceptance

TDD commit failure, commit-success/enqueue-failure, consumer-crash before/after acknowledgement, duplicate delivery, same-key different payload, purge failure/retry, poison/dead-letter/manual replay, payload N/N-1/rejected-old transitions and external recovery. Verify business rows/effect state and retry/recovery traces; successful business effects are not duplicated, failures stay visible. Mock only intentional external fault seams; actual D1 persistence and real Workers job lifecycle are exercised. Deployed broker/storage semantics needing cloud proof use separately gated synthetic resources, not production.

## Verification

Execute fault suite and inspect persisted effect/ledger state plus delivery traces. From repo root: `pnpm --dir spikes/q66_durable-effects install --frozen-lockfile`, then `pnpm --dir spikes/q66_durable-effects test`, `pnpm --dir spikes/q66_durable-effects typecheck`, `pnpm --dir spikes/q66_durable-effects lint`, `pnpm --dir spikes/q66_durable-effects build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Capture remote job evidence where the selected durability claim exceeds local emulation; unavailable resources block that claim.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

docs(spikes): inject effect delivery failures and duplicates (4.2) — proposal only; dev-triggered.
