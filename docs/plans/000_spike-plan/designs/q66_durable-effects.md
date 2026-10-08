---
title: "Q66 — post-commit durable effects and reusable retry/idempotency contracts (provisional design)"
created_session: "20261008_195559_ce74a9"
sessions: []
approved: false
---

# Q66 — Post-commit durable effects and reusable retry/idempotency contracts (design)

> **Status: PROPOSED/PROVISIONAL design input for gate Q66 — NOT a closed gate.**
> This is the task 4.1 deliverable
> (`docs/plans/000_spike-plan/tasks/phase_004/in-progress/task_4.1.md`). It maps 008 §Q66 /
> Q52/Q56/Q57 and Amendment 001 to concrete fault cases; records a **selected mechanism and
> limits rather than silently adopting any default**. The D1 transactional outbox is a
> **candidate only** — the Q70 sync op-log is that capability's own mechanism, not a general
> outbox selection (008 §70). Q40 lifecycle/UOW interfaces remain **explicitly provisional
> until reconciled** (phase-007). The accompanying ADR is **Proposed, not accepted**
> (`docs/decisions/0010-durable-effects-and-idempotency.md`).
>
> **Dev input recorded (2026-10-08):** all eight dev-input checklist items (evidence §3) are
> APPROVED as spike-stage values for task 4.2 harness use: (1) mechanism selection — outbox =
> source of truth, Queues = delivery transport; (2) classification contract; (3) idempotency
> key shape; (4) gap-recovery policy — sweep cadence 1 min (cron minimum), oldest-first drain
> capped at 100 rows/invocation, lag budget < 2× sweep cadence surfaced-not-enforced; (5)
> ack/retry policy — 5 attempts (matches Queues max_retries ceiling), exponential backoff
> base 10s ±20% jitter capped at 15m, dead-letter manual-replay-only; (6) payload-compatibility
> contract; (7) separate-recovery confirmation; (8) telemetry-only path C. All values
> revisited at phase closure with 4.2 fault evidence in hand. The ADR remains Proposed
> (not accepted) and gate Q66 remains DEFERRED.
>
> **Evidence note:** this is design-stage output only. **No harness was built, no fault was
> injected, and no test ran** — all fault-case injections, duplicate-delivery, poison/replay
> and upgrade/payload-compatibility evidence are task 4.2's deliverables and are listed as
> NOT RUN in `evidence/q66_durable-effects.md`. Session `20261008_195559_ce74a9`.

## 1. Scope & locked constraints

Q66 owns post-commit external/cross-boundary effects and their recovery. It operates within
these LOCKED ceilings:

- **Q52 (locked):** atomicity = one D1 database + one prepared-statement batch; statements run
  sequentially and a statement error rolls back the batch. **NOT atomic across databases, R2,
  queues, or cache purges.** Registry services contribute deferred operations to the same UOW
  rather than independently committing (participation designed by Q40).
- **Q56 (locked):** manifest-declared queue consumers + cron schedules, build-time core wiring,
  core jobs seam. Consumers never author wrangler queue/cron entries. Delivery/wiring is not
  exactly-once. Q66 owns at-least-once/idempotency, enqueue gaps, retries/dead-letter/replay,
  payload-version compatibility and failure recovery. No MVP event bus.
- **Q57 (locked):** typed core cache capability + purge/invalidation hooks; content writes
  trigger post-commit invalidation fan-out **through core**. Hooks guarantee no visibility
  (KV eventual, Cache API delete local-only). Q67 owns consistency; Q66 owns durable
  side-effect recovery for the fan-out.
- **Q55 (locked):** observability seam distinguishes non-critical best-effort telemetry from
  durable business jobs — Q66's classification is its input.
- **008 L24:** not exactly-once; no unawaited/short-lived request background promise supplies
  durability; no MVP event bus. L25: post-commit fan-out through core.
- **Amendment 001 Q66 (concretization for the SYNC PATH ONLY):** `change_set_id` is the sync
  idempotency key (same id + same payload → dedupe; same id + different payload → client error,
  surfaced); the "D1 transactional outbox" candidate is concretized as the sync op-log; payload
  contract version with current + N-1 acceptance window. 008 §70 confirms the op-log is the
  Q70 capability's mechanism — **Q66 remains the general owner**.
- **Q40 §16 (PROVISIONAL):** a UOW's commit is the boundary — post-commit enqueue/cache effects
  are not atomic with the batch. The Q66 seam must accept per-effect idempotency keys (the Q70
  `change_set_id` pattern generalizes) and payload contract versions with the current+N-1
  window. Registry-service participation (§10) must compose with Q66's outbox/recovery
  evaluation without redesigning it. **All Q40 interfaces named here are provisional until
  reconciled at phase-007.**

Out of scope: exactly-once delivery (explicitly not claimed); an event bus (not adopted);
atomicity claims across D1 databases, R2, queues or cache purges (each keeps separate
recovery/compensation semantics per §9); Q67 cache-consistency design.

## 2. Effect classification

Q66's first contract is the classification every effect producer must declare, distinguishing
**critical durable business effects** from **best-effort telemetry** (the Q55/Q66 distinction).
Neither a registry call nor an unawaited/short-lived request background promise supplies
durability — critical effects get a durable mechanism; telemetry never blocks the producer and
is never recovered.

| Class | Definition | Durability | Examples (pilot-derived capabilities) |
|---|---|---|---|
| **A — Critical durable business effect** | The platform is wrong if the effect silently never happens | Durable: recorded pre-commit (outbox row in the same batch), at-least-once delivery, idempotent consumer, ack/backoff/dead-letter/replay | Publishing invalidation fan-out (Q57 — core-mediated post-commit purge of published content caches); sync push processing (Q70 — the server side of a client change-set, keyed by `change_set_id`); media processing (Q53 — R2 object post-processing jobs with their own R2 compensation); audit/security-relevant records (Amendment 002 privacy/erasure trail steps with server-side persistence) |
| **B — Best-effort telemetry** | Observability input only; loss is acceptable | No recovery: fire post-commit, never blocks, never retried, never dead-lettered | Timing spans, counters, log spans, non-security diagnostics, analytics pings — through the Q55 observability seam |

Rules:
1. Every effect site declares its class at authoring; unclassified sites are a review failure.
2. Class-B effects must never depend on, gate, or be recovered by Class-A machinery.
3. A producer cannot promote a Class-B effect by adding retries — only by moving it to Class-A
   via this classification (review-visible).
4. **No exactly-once claim is made for Class A** — at-least-once + consumer dedupe is the
   contract (§5).

## 3. Fault-case map

Each row maps a locked constraint (008 §Q66/Q52/Q56/Q57, Amendment 001) to a concrete fault
and required detection + recovery behavior. All behaviors are PROPOSED design values pending
dev approval and phase-007 reconciliation.

| # | Source constraint | Fault case | Required detection | Required recovery (PROPOSED) |
|---|---|---|---|---|
| F1 | Q52 | **Commit failure** — the batch errors; outbox row (if in the batch) also rolled back | Batch error returns; producer knows before any enqueue | Nothing enqueued; producer reports failure; no partial post-commit effects. Registry contributions rolled back with the batch (Q52/Q40 §10). |
| F2 | Q52 + Amendment 001 (op-log form) | **Commit-success/enqueue-failure — the GAP.** Batch commits, then the enqueue/drain call fails | Enqueue-ack marking step fails or times out; outbox rows remain un-marked | Outbox is the source of truth: un-marked rows are picked up by the drain sweep (§6, manifest-declared cron). Bounded lag, surfaced. No claim the window is closed. |
| F3 | Q56 (delivery not exactly-once) | **Consumer crash before ack** — the delivery arrives, consumer dies mid-effect | Redelivery by transport after visibility timeout | At-least-once redelivery; consumer dedupe ledger (§5) makes the second run a no-op with the recorded outcome. |
| F4 | Q56 | **Consumer crash after ack, before effect durable** — ack'd but the effect is lost | Drain-marking of an outbox row is coupled to the drain sweep's outcome verification, not to consumer ack alone: a consumer ack without a verified durable outcome leaves the row in a marked-but-unverified state the sweep re-drives (the dedupe ledger no-ops a re-run whose effect did commit) | Explicit-ack-after-durable rule (§7); early-ack bugs are caught by the drain sweep's outcome verification; replay from dead-letter/outbox with the dedupe ledger. |
| F5 | Q56 + Amendment 001 | **Duplicate delivery** — same idempotency key, same payload | Consumer-side dedupe ledger lookup on receipt | Dedupe/no-op with the recorded outcome; effect not re-run (no duplicate successful business effects). |
| F6 | Amendment 001 (change_set_id pattern, generalized) | **Same key, different payload** — id reused with different data | Producer/consumer payload comparison at receipt | **Reject + surface (client error where the key is client-owned)** — never silently overwrite, never re-run with substituted data. |
| F7 | Q56 | **Poison message** — consumer errors on every attempt | Bounded retries exhausted | Backoff (§7); then dead-letter table + **visible failure** (surfaced, not silent); manual replay tooling seam (Q56 jobs seam). |
| F8 | Q57 | **Cache purge failure / retry** — post-commit invalidation fan-out partially fails | Fan-out outcome recorded; purge hook errors captured through Q55 | Class-A recovery: the fan-out is a durable post-commit effect — retried via the same mechanism (backoff → dead-letter → replay); hook non-guarantee (KV eventual, Cache API local) is NOT a purge failure — Q67 owns visibility. |
| F9 | Amendment 001 / Q44/Q49 | **Payload version handling** — current / N-1 / older-than-N-1 | Contract version read at consumer receipt | Current + N-1 accepted; **rejected-old** → dead-letter with version in the reason; surfaced, not silently dropped. |
| F10 | Q55 / 008 L24 | **Unawaited request promise treated as durable** — producer fires-and-forgets a background promise | Review rule + runtime: such promises are Class-B only | Never a Class-A mechanism; no durability claim; 008 L24 ceiling enforced. |

Injection targets for task 4.2: F2 (commit/enqueue gap), F3 (consumer crash pre-ack), F4
(consumer crash after ack / early-ack bug caught by drain-sweep outcome verification), F5
(duplicate delivery), F6 (same-key different-payload), F7 (poison/replay), F9 (upgrade/
payload compatibility) — **without duplicating successful business effects** (the F5/F3
recovery must be observable as a no-op, not a second run).

## 4. Mechanism comparison

Candidates (all explicitly candidate-only — nothing selected without dev approval):

| Criterion | (A) D1 transactional outbox + manifest-declared cron/queue draining | (B) Cloudflare Queues-native with post-commit enqueue + compensation job | (C) Inline-retry classification |
|---|---|---|---|
| Gap recovery (F2) | Strong: outbox row written in the same batch as the business effect; un-marked rows drained by sweep — source of truth never lost | Weak: needs a reconciliation sweep for un-enqueued work — effectively re-inventing the outbox without the pre-commit record | None: not durable at all |
| Q52 composition (registry contributions stay one batch) | Strong: outbox row is a deferred operation in the same UOW batch (Q52/Q40 §10); one D1 database, one batch | Weak: enqueue happens post-commit; registry contributions and the enqueue cannot be one batch without the outbox layer | n/a |
| Delivery guarantee fit | Requires at-least-once delivery + idempotent consumers (fits Q56's stated non-exactly-once) | Queues at-least-once + idempotent consumers; durability rests on the post-commit enqueue call | n/a |
| Operational surface | Outbox table + drain sweep (manifest-declared cron) + consumer dedupe ledger + dead-letter/replay | Queue + compensation sweep + dead-letter/replay; the compensation sweep is the same surface with less pre-commit guarantee | Minimal |
| Evidence injectability (task 4.2) | Strong: F2/F3/F4/F5/F6/F7/F9 injectable against real D1 outbox rows, dedupe ledger and dead-letter in `vitest-pool-workers` | Injecting the enqueue failure requires an artificial transport fault for what is a normal call — less natural | n/a |

**SELECTED — approved by dev (2026-10-08): (A) as the durable-business mechanism, with
(B) Queues as the delivery transport — i.e. the outbox is the source of truth, Queues is the
delivery optimization.** (Approval covers the mechanism selection in this section; the
companion ADR-0010 remains Proposed until accepted through its own gate.) Concretely: a Class-A effect's outbox row is written as a deferred
operation in the same D1 batch as the business effect (Q52); the drain sweep (manifest-declared
cron, Q56) and/or a queue consumer delivers the effect; consumers idempotently run it and
mark outcomes. (C) is the telemetry-only path and **never** for durable business work.

Limits of the selected mechanism (spike-stage values, dev-approved 2026-10-08, revisited at
phase closure):
- **No exactly-once** — at-least-once + consumer dedupe; delivery may duplicate, effects may
  not.
- **No event bus** — no MVP module event bus is adopted (008 L24); the outbox is per-UOW
  pre-commit recording, not a bus.
- **No unawaited-request durability** — background promises on a request are Class-B only
  (008 L24).
- **R2, cross-database, queue-delivery and cache effects each keep separate
  recovery/compensation** — never claimed atomic under Q52 (§9).
- **Q70 op-log stays sync-only** — the Amendment 001 concretization does not make the op-log a
  general outbox selection (008 §70).

## 5. Idempotency contract

- **Key ownership:** the **producer** assigns a per-effect idempotency key at authoring time,
  generalizing the Q70 `change_set_id` pattern. **PROPOSED key shape:**
  `<entity-prefix>_<effect-kind>_<target-id>[_<nonce>]` — URL-safe TEXT, prefixed sortable
  TEXT ids convention (Q11/ADR-0006 §10), the nonce used only where a producer may legitimately
  emit the same entity/kind/target pair more than once with distinct business intent. Where the
  key is client-owned (sync path), the client assigns it (`change_set_id`, §10).
- **Same id + same payload → dedupe/no-op** with the recorded outcome (the consumer records the
  outcome against the key; a duplicate receives the recorded outcome, not a re-run).
- **Same id + different payload → reject + surface** — never silently overwrite, never re-run
  with substituted data; where the key is client-owned this surfaces as a client error
  (Amendment 001).
- **Consumer-side dedupe ledger row in the same D1 batch as the effect itself** — the ledger
  insert and the effect's own writes commit atomically (Q52), so a crash mid-effect cannot
  leave the ledger claiming an effect that didn't commit.
- Payloads carry the contract version (§8); the version is part of the dedupe comparison
  surface.

## 6. Commit/enqueue gap recovery

- The **outbox row is the source of truth**; it is written pre-commit, in the same batch as the
  business effect (Q52).
- **Enqueue-success marking happens after the batch** — a separate marking step records that
  delivery has been initiated. If it fails (F2), the row remains un-marked.
- The **drain sweep — a manifest-declared cron (Q56) — is the reconciler**: it drains un-marked
  rows, delivering them through the same consumer path with the dedupe ledger.
- **No claim that the window is closed.** The gap is real: between commit and marking there is
  bounded lag during which delivery relies on the sweep. The lag is bounded, observable, and
  surfaced — the sweep cadence is a spike-owned policy value, **dev-approved 2026-10-08 at
  1 minute** (cron minimum granularity), oldest-first drain capped at 100 rows/invocation,
  lag budget < 2× sweep cadence surfaced-not-enforced.
- Marking is idempotent (marking a marked row is a no-op).

## 7. Ack/backoff/dead-letter/replay

- **Explicit-ack only after the effect is durable** — the consumer acks after its own effect
  writes commit (including the dedupe ledger row). Never ack-before-effect (F4).
- **Bounded retries with backoff** — attempt count and backoff schedule are spike-owned policy
  values, **dev-approved 2026-10-08 at 5 attempts** (matching the Queues max_retries ceiling),
  exponential backoff base 10s with ±20% jitter capped at 15m; dead-letter is
  manual-replay-only; they apply to Class-A effects only.
- **Poison messages → dead-letter table + visible failure** — after retries exhaust, the payload,
  idempotency key, version and failure reason are recorded; the failure is **surfaced**
  (Q55 seam), never silent.
- **Manual replay tooling seam** — replay from dead-letter (and, where needed, from the outbox)
  through the Q56 core jobs seam; the replay goes through the same dedupe ledger, so replays
  cannot duplicate successful effects.
- Class-B telemetry: no ack/retry/dead-letter semantics at all.
- **Known interaction (contingency for task 4.2):** the sweep will re-drive in-flight rows whose
  queue delivery hasn't exhausted retries — the dedupe ledger makes such re-drives harmless
  no-ops, but if 4.2's evidence shows the wasted work is noisy, the fix is a "delivering" state
  on the outbox row, not a cadence change.

## 8. Payload compatibility

- **Every effect payload carries the contract version** — a PROPOSED contract-version field on
  every Class-A payload.
- **Current + N-1 acceptance window** (Q44/Q49): consumers accept the current version and the
  immediately previous one.
- **Rejected-old handling:** older-than-N-1 payloads → dead-letter with the version in the
  reason, surfaced (F9) — never silently dropped; replays never auto-upgrade old versions.
- **Across deploys:** consumers and producers upgrade on the same window rule, so a deploy that
  moves the version from N to N+1 keeps both N and N+1 consumers functional during the rollout.

## 9. Registry/UOW composition

- **Registry contributions remain one D1 batch** — participating registry services contribute
  deferred operations to the UOW; the UOW commits as one D1 database + one prepared-statement
  batch (Q52, Q40 §10 participation). The outbox row is a contribution of this kind.
- **Post-commit effects run via their own seams after commit** — preserved Q40 §16 language:
  "post-commit enqueue/cache effects are not atomic with the batch (Q52). The Q66 seam must
  accept per-effect idempotency keys (the Q70 change_set_id pattern generalizes) and payload
  contract versions with the current+N-1 acceptance window (Amendment 001 Q66). Registry-service
  participation (§10) must compose with Q66's outbox/recovery evaluation without redesigning it."
  **All Q40 lifecycle/UOW interfaces named here remain explicitly provisional until reconciled**
  (phase-007 joint closure 7.2/7.8).
- **Separate recovery/compensation, never claimed atomic under Q52:**
  - **R2 effects** (e.g. media processing): own compensation (e.g. object cleanup) — never
    part of a D1 batch.
  - **Cross-database effects:** own cross-DB recovery — never claimed atomic.
  - **Queue-delivery effects:** the gap recovery of §6 — delivery is not atomic with commit.
  - **Cache purge effects (Q57/Q67):** the fan-out of §3 F8 — hooks guarantee no visibility;
    Q67 owns consistency, Q66 owns recovery.

## 10. Sync change_set_id conventions feeding Q70

- The Amendment 001/Q70 contract is the **sync-path instance of this record's §5/§8 contract**:
  - `change_set_id` is client-generated, prefixed TEXT, **the sync idempotency key** (Q70 §6).
  - **Same id + same payload → dedupe** (Q70 §6; Amendment 001).
  - **Same id + different payload → client error, surfaced** — never silent (Amendment 001).
  - Sync payloads carry `schema_version` with the **current + N-1 acceptance window** (Q70 §12).
- **Q70 keeps its op-log as its own mechanism, not a general outbox** — 008 §70: the op-log is
  the Q70 capability's mechanism; Q66 remains the general owner. Q70 §15 takes "No Q66/Q67
  mechanisms beyond the named idempotency/transport couplings."
- One change-set = one D1 batch, fail-stop (Q70 §12) — consistent with §9's one-batch rule.

## 11. Diagnostics & sanitized evidence

- **Failure surfacing through Q55 seams** — dead-letter entries, rejected-old reasons, gap lag
  and dedupe outcomes flow through the observability seam; Class-A failures are visible, never
  silent.
- **Redaction-by-default (Amendment 002)** — diagnostics carry the idempotency key, contract
  version and failure reason, with payload contents redacted by default; any on-device/
  privacy-relevant payload follows Amendment 002's guardrails.
- **Evidence harness notes for task 4.2** — the injectable fault set is §3's F2 (gap), F3
  (consumer crash pre-ack), F5 (duplicate delivery), F6 (same-key different-payload), F7
  (poison/replay), F9 (upgrade/payload compatibility); every injection must demonstrate the
  recovery **without duplicating successful business effects** (dedupe observable as a no-op).
  Evidence runs against real D1 via `vitest-pool-workers`. No harness was built in task 4.1 —
  see `evidence/q66_durable-effects.md` for the NOT-proven list.
