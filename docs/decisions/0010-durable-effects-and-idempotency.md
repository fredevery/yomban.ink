# ADR-0010 — Durable effects and idempotency (Q66)

- **Status:** Proposed (2026-10-08) — authored at task 4.1 of spike plan 000 phase_004; **not
  accepted** (closure-wise). **All eight dev-input checklist items are APPROVED by dev
  (2026-10-08) as spike-stage values for task 4.2 harness use**, recorded in the design doc
  (`q66_durable-effects.md`) header and the evidence report §3 — including the mechanism
  selection (decision 2) and the policy numbers for gap recovery (sweep cadence 1 min) and
  retries (5 attempts, backoff base 10s ±20% jitter cap 15m). Values are revisited at phase
  closure with 4.2 fault evidence in hand. Q66 is an affected-work gate: acceptance of
  this input is NOT closure; executed fault evidence follows at task 4.2 (phase_004) and gate
  closure follows the phase-007 reconciliation schedule. An ADR alone is not closure
  (understanding Q19). Gate Q66 remains **DEFERRED**.
- **Deciders:** authored by the task-4.1 design agent under the phase-004 contract (proposed
  designs/ADRs; no unrun evidence asserted; no policy adopted without explicit dev input).
  All mechanism/policy values in this record are **PROPOSED** — dev approval is recorded in the
  evidence report before task 4.2 builds on them.
- **References:** design
  `docs/plans/000_spike-plan/designs/q66_durable-effects.md`; evidence
  `docs/plans/000_spike-plan/evidence/q66_durable-effects.md`;
  `docs/specs/008_operations-and-quality.md` §Q66 (L52) and the explicit
  nothing-selected statement (L70);
  `docs/discovery/understanding.md` Q66 (DEFERRED), Q52, Q55, Q56, Q57;
  `docs/discovery/understanding-amendments-001.md` (Q66 amendment: `change_set_id`
  idempotency; op-log concretization for the sync path; current + N-1 payload window);
  `docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md` §16
  (provisional Q66/Q67/Q68 interfaces — **explicitly provisional until reconciled**);
  `docs/plans/000_spike-plan/designs/q70_local-first-sync.md` §6/§12/§15
  (`change_set_id` idempotency key, schema-version window, op-log scoped to sync);
  `docs/decisions/0001-platform-foundations.md` (ceiling decisions);
  `docs/specs/000_index.md` canonical gate table (Q66 row).

## Context

Gate Q66 is the affected-work design for post-commit durable effects, retries and
idempotency. The failure window it owns is created by the locked ceilings: unit-of-work
atomicity is one D1 database and one prepared-statement batch (Q52) — so a successful
commit followed by a failed queue enqueue or cache purge leaves missing effects, and
at-least-once queue delivery (Q56) can repeat effects. Neither a registry call nor an
unawaited/short-lived request background promise supplies durability. Manifest-declared
queue consumers/cron and the core jobs seam are locked (Q56); the typed cache capability
with post-commit invalidation fan-out is locked (Q57), but KV is eventually consistent and
Cache API deletion is local-only. Q40 §16 provisionally names the seam shape: post-commit
enqueue/cache effects are not atomic with the batch; the Q66 seam must accept per-effect
idempotency keys (generalizing the Q70 `change_set_id` pattern) and payload contract
versions with the current + N-1 acceptance window; registry-service participation composes
with the outbox/recovery evaluation without redesign. Q55 requires distinguishing critical
durable business work from best-effort telemetry. Amendment 001 concretizes the D1
transactional outbox evaluation candidate **as the sync op-log for the sync path only**;
spec 008 §L70 states the op-log is that capability's mechanism, not a general
server-side outbox selection — Q66 remains the owner of the general mechanism.

## Decisions (spike-stage values, dev-approved 2026-10-08 for task 4.2 harness use; revisited
at phase closure)

1. **Effect classification (approved).** Effects are classified as **critical durable
   business effects** (publish invalidation fan-out, media processing, sync push handling,
   audit/ledger writes) versus **best-effort telemetry** (metrics, traces, non-essential
   logs). Critical effects get the durable mechanism of decision 2; telemetry never does —
   it is dropped on failure with surfaced counts, never retried into a durability claim.
2. **Mechanism (SELECTED — approved by dev, 2026-10-08).** A **D1 transactional outbox as the
   durable-business mechanism, with Cloudflare Queues as the delivery transport**: the
   outbox row is written in the SAME D1 prepared-statement batch as the business change
   (Q52-compatible; registry contributions remain one batch), a manifest-declared cron/queue
   drain (Q56 jobs seam) delivers effects, and the outbox is the source of truth while the
   queue is a delivery optimization — a missed enqueue is recovered by the drain sweep.
   Rejected for durable business work: Queues-native post-commit enqueue alone (leaves the
   commit/enqueue gap to a compensation sweep that must reconstruct intent) and inline-retry
   (no durability across isolate death). The Q70 sync op-log remains the sync capability's
   own mechanism — it is NOT adopted as the general outbox.
3. **Idempotency contract (approved).** The **producer owns the idempotency key**,
   generalizing the Q70 `change_set_id` pattern: a prefixed, sortable TEXT id shaped
   `<entity-prefix>_<effect-kind>_<target-id>[_<nonce>]` (shape proposed). Same id +
   same payload → dedupe/no-op with the recorded outcome; same id + different payload →
   reject and surface (never silently overwrite). The consumer-side dedupe ledger row is
   written in the same D1 batch as the effect itself, so dedupe shares the effect's
   atomicity.
4. **Delivery semantics (approved).** At-least-once delivery with **explicit acknowledgement
   only after the effect is durable**; bounded retries with backoff (**5 attempts**, matching
   the Queues max_retries ceiling; exponential backoff base 10s with ±20% jitter capped at
   15m); exhausted retries move
   the effect to a dead-letter state that stays visible (never silently dropped); manual
   replay operates through the Q56 jobs seam. **No exactly-once guarantee is claimed** —
   dedupe (decision 3), not delivery, provides effective-once business outcomes.
5. **Commit/enqueue gap recovery (approved).** The gap between D1 commit and queue
   enqueue is recovered by the outbox drain sweep (manifest-declared cron) at a
   **1-minute cadence** (cron minimum), oldest-first drain capped at 100 rows/invocation,
   lag budget < 2× sweep cadence surfaced-not-enforced; enqueue-success
   is marked after the batch. The window is never claimed closed — recovery is bounded lag,
   surfaced through diagnostics.
6. **Separate recovery per effect surface (locked ceiling, restated).** R2, cross-database,
   queue and cache-purge effects each carry their own recovery/compensation semantics and
   are **never claimed atomic under Q52**. No MVP event bus; no durability from
   unawaited requests.
7. **Payload compatibility (approved).** Every effect payload carries the contract version
   with a **current + N-1 acceptance window** (Q44/Q49, mirroring Amendment 001 and the Q70
   §12 window); rejected-old payloads fail visibly with a version diagnostic.
8. **Diagnostics (approved).** Effect failures surface through the Q55 logger/tracer/metrics
   seams with **redaction-by-default** (Amendment 002 privacy guardrails); evidence harness
   traces are sanitized before retention.

## Limits and consequences

- Q40 §16 lifecycle/UOW interfaces remain **explicitly provisional until reconciled**
  (phase-007); this design preserves their language without hardening them.
- All fault-case evidence (commit failure, commit-success/enqueue failure, consumer crash
  before/after acknowledgement, duplicate delivery, same-key different payload,
  poison/dead-letter/replay, payload N/N-1/rejected-old, external recovery) is **task 4.2's
  deliverable** — nothing here is executed proof.
- Selection of the mechanism (decision 2) and all other dev-input items (decisions 1, 3–8)
  are **approved by dev (2026-10-08) as spike-stage values for task 4.2 harness use**;
  task 4.2 may build the harness against them. Values are revisited at phase closure with
  4.2 fault evidence in hand.
- No discovery gate is Closed by this record; Q66 stays DEFERRED until the plan's closure
  schedule runs it.
