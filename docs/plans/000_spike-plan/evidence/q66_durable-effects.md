---
title: "Q66 — design-stage evidence: candidate comparison, sources, dev-input checklist, NOT-proven list"
created_session: "20261008_195559_ce74a9"
sessions: []
approved: false
---

# Q66 — Design-stage evidence (durable effects and idempotency contracts)

> **Scope: design-stage evidence only.** This record contains **no claimed executions** — no
> harness was built, no fault was injected, and no test ran in task 4.1. All fault-case
> injections, duplicate-delivery, poison/replay and upgrade/payload-compatibility evidence are
> **task 4.2's deliverables** and are recorded below as NOT-proven. Session
> `20261008_195559_ce74a9`.
>
> Companion records: `designs/q66_durable-effects.md` (the design) and
> `docs/decisions/0010-durable-effects-and-idempotency.md` (ADR-0010, Proposed/not accepted).

## 1. Candidate comparison table

Candidates compared in `designs/q66_durable-effects.md` §4 — **all candidate-only, nothing
selected without dev approval**:

| Criterion | (A) D1 transactional outbox + manifest-declared cron/queue draining | (B) Queues-native + post-commit enqueue + compensation job | (C) Inline-retry classification |
|---|---|---|---|
| Gap recovery (F2) | Strong — outbox row pre-commit, in the same batch | Weak — needs a reconciliation sweep (outbox re-invented without pre-commit guarantee) | None — not durable |
| Q52 composition (registry contributions stay one batch) | Strong — outbox row is a deferred UOW contribution (Q52/Q40 §10) | Weak — enqueue is post-commit, not in the batch | n/a |
| Delivery guarantee fit | At-least-once + idempotent consumers (fits Q56's non-exactly-once) | Queues at-least-once + idempotent consumers; durability rests on the post-commit enqueue call | n/a |
| Operational surface | Outbox table + drain sweep (cron, Q56) + dedupe ledger + dead-letter/replay | Queue + compensation sweep + dead-letter/replay (same surface, less pre-commit guarantee) | Minimal |
| Evidence injectability (task 4.2) | Strong — F2/F3/F4/F5/F6/F7/F9 injectable against real D1 outbox/ledger/dead-letter in `vitest-pool-workers` | Enqueue-failure injection requires an artificial transport fault — less natural | n/a |

**SELECTED — approved by dev (2026-10-08):** (A) as the durable-business mechanism with (B) Queues as
the delivery transport — outbox = source of truth, Queues = delivery optimization. (C) is the
telemetry-only path, never for durable business work. All eight dev-input checklist items
(§3) are likewise approved (2026-10-08) as spike-stage values for task 4.2 harness use.

**Source-grounding note:** this comparison is a design argument from the locked constraints and
Amendment 001 — **not an implementation measurement**. Its value is that candidate (A) is the
only candidate that composes with Q52's one-batch ceiling without a post-hoc reconciliation
layer, and the most injectable for 4.2's fault set. Dev approval is the decision record, not
this table.

## 2. Source citation list

All pre-digested sources, cited exactly (verified against repo files this session):

| Source | Path | What it grounds |
|---|---|---|
| Task spec | `docs/plans/000_spike-plan/tasks/phase_004/in-progress/task_4.1.md` | Goal, files, verification, commit line — "Map 008 §Q66 / Q52/Q56/Q57 and Amendment 001 to fault cases; record selected mechanism and limits rather than silently adopting the Agent default. Q40 lifecycle/UOW interfaces remain explicitly provisional until reconciled." |
| Spec 008 | `docs/specs/008_operations-and-quality.md` L24, L25, L52, L61, L62, L70 | L24 manifest-declared consumers/cron + jobs seam, not exactly-once, no unawaited promises, no MVP event bus; L25 post-commit fan-out through core; L52 the Q66 row (acceptance); L61 tombstone GC cron; L62 change_set_id = sync idempotency key + current+N-1 (sync-path concretization); L70 op-log is sync-capability mechanism, NOT a general outbox |
| Understanding Q66 | `docs/discovery/understanding.md` (DEFERRED) | Full Q66 deferred statement — outbox as evaluation candidate, classification, at-least-once, idempotency, gap recovery, ack/backoff/dead-letter/replay, payload windows, evidence requirements, Q55 telemetry distinction, Q40 coordination, blocks affected write/job/publishing/effect implementation and MVP deployment |
| Amendment 001 Q66 | `docs/discovery/understanding.md` | change_set_id sync idempotency key (same+same dedupe / different-payload error); op-log concretization for the sync path; current+N-1 window |
| Understanding Q52 (locked) | `docs/discovery/understanding.md` | One D1 database + one prepared-statement batch; not atomic across DBs/R2/queues/cache; registry contributions to the same UOW |
| Understanding Q56 (locked) | `docs/discovery/understanding.md` | Manifest-declared consumers + cron, build-time wiring, jobs seam, not exactly-once, no MVP event bus, Q66 fault-case ownership |
| Understanding Q57 (locked) | `docs/discovery/understanding.md` | Cache capability + purge hooks through core; no visibility guarantee; Q67 consistency / Q66 recovery split |
| Understanding Q55 | `docs/discovery/understanding.md` | Telemetry vs durable business jobs distinction (observability seam input) |
| Understanding Q40 | `docs/discovery/understanding.md` | Q40 service participation/lifecycle coordination with Q66; interfaces provisional until reconciled |
| Understanding Q70 | `docs/discovery/understanding.md` | change_set_id conventions; Q70 §15 "No Q66/Q67 mechanisms beyond the named idempotency/transport couplings" |
| Q40 design §16 | `docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md` §16 (PROVISIONAL) | UOW commit boundary; per-effect idempotency keys generalizing change_set_id; contract versions current+N-1; participation composes without redesign |
| Q70 design | `docs/plans/000_spike-plan/designs/q70_local-first-sync.md` §6, §12, §15 | Client-generated prefixed TEXT change_set_id; dedupe/fail-stop one-batch; schema_version current+N-1; op-log sync-only; the named-couplings limit |
| ADR-0006 | `docs/decisions/0006-composition-installation-and-lifecycle.md` §16 provisional seams | The provisional-seam reference named in the task verification |
| ADR-0009 | `docs/decisions/0009-local-first-datastore-and-sync.md` | ADR format/tone for ADR-0010 |
| Phase acceptance | `docs/plans/000_spike-plan/phases/phase_004.md` Task 4.1 | Acceptance language: mechanism comparison with dev approval; outbox candidate-only; op-log not a general selection; classification; idempotency; gap recovery; ack/backoff/dead-letter/replay; payload windows; registry one-batch; separate R2/cross-DB/queues/cache recovery; no exactly-once/event-bus/unawaited claims; change_set_id conventions feed Q70 |

## 3. Dev-input checklist

Decisions requiring explicit dev approval — **ALL APPROVED by dev, 2026-10-08, as spike-stage
values for task 4.2 harness use; revisited at phase closure:**

1. **Mechanism selection — APPROVED.** (A) D1 transactional outbox as the durable-business
   mechanism
   with (B) Queues as the delivery transport (outbox = source of truth, Queues = delivery
   optimization). Candidate-only per phase acceptance; op-log remains sync-only (008 §70).
2. **Classification contract — APPROVED.** The Class-A (critical durable business) /
   Class-B (best-effort
   telemetry) table in design §2, and the rule that only the classification (not retries)
   promotes a Class-B effect.
3. **Idempotency key shape — APPROVED.** `<entity-prefix>_<effect-kind>_<target-id>[_<nonce>]`
   (producer-owned per-effect keys, generalizing `change_set_id`), dedupe-vs-reject semantics,
   and the consumer-side dedupe ledger row in the same D1 batch as the effect.
4. **Gap-recovery policy — APPROVED.** Drain sweep (manifest-declared cron) as the reconciler;
   sweep cadence **1 minute** (cron minimum granularity), oldest-first drain capped at
   100 rows/invocation, lag budget < 2× sweep cadence surfaced-not-enforced; bounded-lag
   surfaced, no window-closed claim.
5. **Ack/backoff/dead-letter/replay policy — APPROVED.** Explicit-ack-after-durable rule;
   bounded retries: **5 attempts** (matching the Queues max_retries ceiling) with exponential
   backoff base 10s ±20% jitter capped at 15m; dead-letter table + visible failure, manual
   replay only (through the dedupe ledger) via the Q56 jobs seam.
6. **Payload-compatibility contract — APPROVED.** Contract-version field on every Class-A
   payload; current+N-1 acceptance window (Q44/Q49); rejected-old → dead-letter with version
   in reason.
7. **Separate-recovery confirmation — APPROVED.** R2/cross-DB/queue-delivery/cache effects
   keep their own recovery/compensation, never claimed atomic under Q52 (design §9).
8. **Telemetry-only path (C) — APPROVED.** Inline-retry stays Class-B-only and never serves
   durable business work.

Dev approval of all eight items was given on 2026-10-08 and is recorded in the design doc
(header + §4/§6/§7) and ADR-0010's Status block. ADR-0010 overall remains Proposed/not
accepted; gate Q66 remains DEFERRED.

## 4. Explicit NOT-proven list

**No evidence runs claimed in task 4.1.** The following are task 4.2's deliverables (the
injectable fault set of design §3/§11), each NOT proven:

- [ ] **NOT-proven: commit/enqueue gap (F2)** — commit-success/enqueue-failure recovery via
  drain sweep; bounded lag surfaced. Requires fault injection (injected enqueue/purge failures).
- [ ] **NOT-proven: consumer crash before ack (F3)** — at-least-once redelivery + dedupe
  no-op (no duplicate successful business effects). Requires injected duplicate delivery /
  consumer crash.
- [ ] **NOT-proven: consumer crash after ack (F4)** — early-ack bug caught by the drain
  sweep's outcome verification; marked-but-unverified row re-driven, dedupe ledger no-ops a
  re-run whose effect did commit. Requires injected early-ack/crash-after-ack fault.
- [ ] **NOT-proven: same-id/same-payload dedupe (F5)** — duplicate delivery observable as a
  no-op with recorded outcome. Requires injected duplicate delivery.
- [ ] **NOT-proven: same-id/different-payload reject (F6)** — client error surfaced, never
  silently overwritten. Requires injected same-key/different-payload input.
- [ ] **NOT-proven: poison message → dead-letter (F7)** — bounded retries, backoff, dead-letter
  + visible failure, manual replay through dedupe ledger. Requires injected poison/replay.
- [ ] **NOT-proven: payload version handling (F9)** — current accepted, N-1 accepted,
  older-than-N-1 rejected-old → dead-letter with version reason; across-deploy compatibility.
  Requires injected upgrade/payload-compatibility input.
- [ ] **NOT-proven: registry/UOW composition (§9)** — outbox row as a UOW contribution in one
  D1 batch; one change-set = one batch fail-stop (Q70 §12). Requires real-D1 batch tests.
- [ ] **NOT-proven: dedupe ledger atomicity (§5)** — ledger insert + effect writes commit
  atomically; crash mid-effect leaves no false claim. Requires real-D1 batch tests.

**Also not claimed:**
- No harness built; no test runs (design-stage only; no `vitest-pool-workers` execution).
- No remote/cloud evidence (no deployed Worker, no real Queues/cron/KV/Cache behavior observed).
- No remote/outbox/queue/cron configuration proposed into any wrangler manifest — the mechanism
  is design-stage and un-adopted.
- No dev approval of the design beyond the eight checklist items recorded (§3, all approved
  2026-10-08 as spike-stage values); ADR-0010 is Proposed/not accepted.
- No Q40 interface accepted — §16's named interfaces remain explicitly provisional until
  phase-007 reconciliation (7.2/7.8).
- No Q66 gate closure — Q66 remains DEFERRED/open; closure is dev-driven.
