---
title: "Yomban.ink — spike phase 005: Local-first persistence and sync evidence — Q70"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 005 — Local-first persistence and sync evidence — Q70

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Exercise the actual OPFS/shared-schema/Drizzle and sync design with the affected-work policies.
**Depends on:** Phase 004 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** Q70 evidence can become complete, but final closure waits on Phase 007 cross-gate reconciliation and owner browser evidence.
**Source authority:** [canonical gate table](../../../specs/000_index.md#canonical-gate-table),
[project understanding Q19](../../../discovery/understanding.md), amendments 001/002,
and the owning focused specs listed in the parent plan. No locked decision is reopened.

## Task execution contract

Each Task below is a future scoped Orca task, not work authorized by drafting this
file. Read the parent plan, settled understanding and owning source sections at its
task gate. State exactly what is already done before implementing; do not repeat
existing proofs. Obtain the dev's gate, then one fresh serial subagent executes.

Design tasks may create proposed designs/ADRs but must not assert unrun evidence.
Candidate/mechanism/policy adoption requires explicit dev input. Executable tasks
use TDD with real code at the correct boundary; exact new dependencies/config and
any driver-generated artifact paths are recorded before dispatch. Each harness has
working `test`, `typecheck`, `lint`, `build` scripts and pinned lockfile; run all four
and record observed outputs. A plan's expected result is not a passing test log.

Files below are exact allocated outputs. Generated migrations, optional presentation
fixture sources and chosen-library configs cannot be named before their owning
selection; when the choice is accepted, extend the task Files with the actual exact
paths BEFORE claim. This does not permit arbitrary product files or silently growing
scope. Later tasks use Modify on prior outputs. No `any`, `export *`, direct module
bindings/secrets, raw SQL outside Drizzle, implicit UI coupling or non-D1 atomicity.

Cloud resources/deployment and owner browser checks are separate explicit human
gates within affected tasks. Missing access/support blocks the required claim.
Secrets/production data never enter harnesses/evidence. Task Agent/Manual Review,
retro and scoped commit occur only through the matching dev-triggered Orca steps;
execution stops at deliverable-ready, never auto-review/commit/next-task.

## Task 5.1 — Prove real browser SQLite persistence and shared Drizzle queries

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.9
**Blocked by:** 4.9
**Parallel:** false
**Objective:** Run Q70 local store/worker/proxy and shared query code against browser SQLite and actual D1.
**Files:**
- Create: spikes/q70_local-first-sync/package.json
- Create: spikes/q70_local-first-sync/pnpm-lock.yaml
- Create: spikes/q70_local-first-sync/tsconfig.json
- Create: spikes/q70_local-first-sync/biome.json
- Create: spikes/q70_local-first-sync/README.md
- Create: spikes/q70_local-first-sync/src/proof.ts
- Create: spikes/q70_local-first-sync/src/proof.test.ts
- Create: spikes/q70_local-first-sync/vitest.config.ts
- Create: spikes/q70_local-first-sync/wrangler.jsonc
- Create: spikes/q70_local-first-sync/src/schema.ts
- Create: spikes/q70_local-first-sync/src/shared-queries.ts
- Create: spikes/q70_local-first-sync/src/sqlite-worker.ts
- Create: spikes/q70_local-first-sync/src/browser-entry.ts
- Create: spikes/q70_local-first-sync/index.html
- Create: spikes/q70_local-first-sync/browser-cases.md
- Modify: docs/plans/000_spike-plan/designs/q70_local-first-sync.md
- Modify: docs/plans/000_spike-plan/evidence/q70_local-first-sync.md

**Acceptance:** TDD worker/proxy request handling then real browser OPFS reload/reopen persistence, one module-owned sqliteTable schema and SAME shared Drizzle query code on server/client, no driver named by module. Actual driver/worker/wasm/OPFS migration compatibility and local transaction data+change-row atomicity; forced failure has neither half persisted. Physical Class 1/Class 2 separation, persist/estimate denial/quota behavior and session/crash/reopen/multi-tab policy checked. WAL requirements from amendment verified on actual chosen driver or blocker surfaced; no in-memory fallback. Browser scripts/dev server/test automation config are explicitly added before running and versions recorded.

**Verification:** Run gates against actual D1 and real browser store; record reload DB/change-row reads and transaction-failure traces. From repo root: `pnpm --dir spikes/q70_local-first-sync install --frozen-lockfile`, then `pnpm --dir spikes/q70_local-first-sync test`, `pnpm --dir spikes/q70_local-first-sync typecheck`, `pnpm --dir spikes/q70_local-first-sync lint`, `pnpm --dir spikes/q70_local-first-sync build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Record current supported-browser/Safari owner-run evidence with actual versions; emulation does not discharge Safari coverage.

**Execution notes:** Add browser-tool dependency/config only after verifying installed manifest and official support; exact generated/additional proof paths are written into the task Files before dispatch. Driver/build headers must satisfy Q68 CSP/origin policy, not weaken it.

**Commits:** docs(spikes): prove real browser sqlite persistence and shared drizzle queries (5.1) — proposal only; dev-triggered.

## Task 5.2 — Prove change-set sync, lease and conflict rules

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 5.1
**Blocked by:** 5.1
**Parallel:** false
**Objective:** Exercise Q70 push/pull/lease/conflict using real local SQLite plus real D1 acceptance.
**Files:**
- Modify: spikes/q70_local-first-sync/src/proof.ts
- Modify: spikes/q70_local-first-sync/src/proof.test.ts
- Create: spikes/q70_local-first-sync/src/sync.ts
- Create: spikes/q70_local-first-sync/src/sync.test.ts
- Create: spikes/q70_local-first-sync/src/worker.ts
- Modify: spikes/q70_local-first-sync/browser-cases.md
- Modify: docs/plans/000_spike-plan/designs/q70_local-first-sync.md
- Modify: docs/plans/000_spike-plan/evidence/q70_local-first-sync.md

**Acceptance:** One local action/transaction→one ordered change-set→one D1 batch, aggregate-root child rows inherit state, multi-root edit boundary explicit, FK/local_seq ordering and fail-stop/rejected-visible bucket. Same id/payload dedupe, different payload surfaced, server-derived writes in same batch, rollback whole on permission/stale/constraint failure. Test non-overlapping fields auto-merge, overlapping three-way mine/theirs/both-fork and stale offline reconnect preserving authored data. Leases server-clock expiry/renew/release, no live-other-user steal, same-user device takeover/crash/read-only old device; advisory not atomic correctness. Authorized working-set push/pull/classes, focus/interval/reconnect polling, per-record apply pause/watch/conflict alerts/global status; offline writes are provisional and revoked client ops strand visibly.

**Verification:** RED→GREEN sync/fault tests plus browser two-client traces against real D1; persisted rows, server-derived entries, retries/conflicts and lease takeover match selected policies. From repo root: `pnpm --dir spikes/q70_local-first-sync install --frozen-lockfile`, then `pnpm --dir spikes/q70_local-first-sync test`, `pnpm --dir spikes/q70_local-first-sync typecheck`, `pnpm --dir spikes/q70_local-first-sync lint`, `pnpm --dir spikes/q70_local-first-sync build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Reuse Q66/Q67/Q68 accepted contracts; test actual implementations through seams, never self-authored canned success responses.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): prove change-set sync, lease and conflict rules (5.2) — proposal only; dev-triggered.

## Task 5.3 — Prove local upgrades, storage loss and erasure/restore interaction

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 5.2
**Blocked by:** 5.2
**Parallel:** false
**Objective:** Exercise Q70 resilience and Q65 on-device no-resurrection rules on the actual local store.
**Files:**
- Create: spikes/q70_local-first-sync/src/resilience.ts
- Create: spikes/q70_local-first-sync/src/resilience.test.ts
- Modify: spikes/q70_local-first-sync/browser-cases.md
- Modify: spikes/q70_local-first-sync/src/sqlite-worker.ts
- Modify: docs/plans/000_spike-plan/designs/q70_local-first-sync.md
- Modify: docs/plans/000_spike-plan/evidence/q70_local-first-sync.md
- Modify: docs/plans/000_spike-plan/evidence/q65_recovery-erasure.md

**Acceptance:** Payload current+N-1 accepted, too-old client read-only+export, additive-major compatibility and selected one-way local migration with actual pre-migration snapshot/recovery. Tombstone retention AND replica ACK, GC job and explicit purge; deletion propagates to real OPFS when reachable and reconnect denies erased/revoked replay after restore. Offline/unreachable limitations and missing acknowledgements remain visible. Quota/persist refusal/eviction/export/unsynced destructive-action warnings, rebuild safety and local authored-vs-cache loss behavior. No silent loss of rejected/authored ops, restored erased data or preview across accounts.

**Verification:** Run resilience/failure tests and actual browser migrations/snapshot/reconnect/purge cases, then replay Q65 restore scenario against local replica. From repo root: `pnpm --dir spikes/q70_local-first-sync install --frozen-lockfile`, then `pnpm --dir spikes/q70_local-first-sync test`, `pnpm --dir spikes/q70_local-first-sync typecheck`, `pnpm --dir spikes/q70_local-first-sync lint`, `pnpm --dir spikes/q70_local-first-sync build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Record manual supported-browser evidence and residual platform risks; required unsupported behavior blocks closure.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): prove local upgrades, storage loss and erasure/restore interaction (5.3) — proposal only; dev-triggered.

## Task 5.4 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 5.3
**Blocked by:** 5.3
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0018-spike-phase-005-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_005.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review Q70 actual OPFS/sync/resilience evidence, cross-referencing Q65–Q68; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

