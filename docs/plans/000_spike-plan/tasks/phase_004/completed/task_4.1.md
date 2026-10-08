---
title: Design durable effects and idempotency
created_session: '20261008_165607_7dd859'
sessions:
  - '20261008_195559_ce74a9'
approved: true
---

# Task 4.1 — Design durable effects and idempotency

> From: plan_000 phase_004 task 4.1 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Specify Q66 post-commit durability and reusable retry/idempotency contracts.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 3.5

## Blocked by

- 3.5

## Parallel

false

## Files

- Create: docs/plans/000_spike-plan/designs/q66_durable-effects.md
- Create: docs/plans/000_spike-plan/evidence/q66_durable-effects.md
- Create: docs/decisions/0010-durable-effects-and-idempotency.md

## Acceptance

Compare/select a mechanism with dev approval; D1 transactional outbox is candidate only (Q70 op-log is not a general outbox selection). Define business-vs-telemetry classification, at-least-once assumptions, idempotency keys/ownership and same-ID/same-payload dedupe vs different-payload error, commit/enqueue gap recovery, acknowledgement/backoff/dead-letter/replay, payload current+N-1 compatibility and sanitized diagnostics. Registry contributions remain one D1 batch; R2/cross-DB/queues/cache effects have separate recovery/compensation. No exactly-once/event-bus or unawaited-request durability claims. Sync change_set_id conventions feed Q70.

## Verification

Map 008 §Q66 / Q52/Q56/Q57 and Amendment 001 to fault cases; record selected mechanism and limits rather than silently adopting the Agent default. Q40 lifecycle/UOW interfaces remain explicitly provisional until reconciled.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

docs(spikes): design durable effects and idempotency (4.1) — proposal only; dev-triggered.
