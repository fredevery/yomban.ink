---
title: "Yomban.ink — spike phase 007: Cross-gate reconciliation and formal closures"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 007 — Cross-gate reconciliation and formal closures

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Close every remaining gate on observed, reconciled evidence, preserving the required Q40/Q47/Q46 joint boundary.
**Depends on:** Phase 006 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** All eleven named design gates Closed only if every required test/manual/cloud case and human decision genuinely passes. Q38 remains first.
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

## Task 7.1 — Reconcile and close Q65

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 6.5
**Blocked by:** 6.5
**Parallel:** false
**Objective:** Reconcile Q65 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q65_recovery-erasure.md
- Modify: docs/plans/000_spike-plan/evidence/q65_recovery-erasure.md
- Modify: docs/decisions/0013-backup-restore-and-replica-erasure.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile actual Q63 migration/removal fixtures and Q70 OPFS replica results with selected backup/retention/erasure runbooks. Recovery meets declared expectations; restore/replay cannot resurrect erased identities, and offline replica limitations/ack horizons are explicit. Re-run DB+asset restore and actual local reconnect/purge cases. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q65 (7.1) — proposal only; dev-triggered.

## Task 7.2 — Reconcile and close Q63

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.1
**Blocked by:** 7.1
**Parallel:** false
**Objective:** Reconcile Q63 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q63_persistence-migrations.md
- Modify: docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md
- Modify: docs/decisions/0005-database-placement-and-migrations.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile Q40 selected ID algorithm/UOW/wiring and Q68 required auth methods/bootstrap with actual Better Auth base schema/adapter proofs. Re-run ALL created auth entities/FKs with selected prefixed TEXT IDs and accepted Q68 flows, empty/existing migration, failure/retry/concurrent deploy and Q65 recovery/removal scenarios. Generation-only or custom generateId tests do not prove compatibility. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q63 (7.2) — proposal only; dev-triggered.

## Task 7.3 — Reconcile and close Q66

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.2
**Blocked by:** 7.2
**Parallel:** false
**Objective:** Reconcile Q66 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q66_durable-effects.md
- Modify: docs/plans/000_spike-plan/evidence/q66_durable-effects.md
- Modify: docs/decisions/0010-durable-effects-and-idempotency.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile actual Q40 single-D1 registry contributions, Q54 schedule/publish, Q70 change_set_id and Q67 purge recovery. Re-run commit/enqueue/purge failures, duplicates/different-payload/poison/replay/version upgrades under final effect and change-set envelopes; no non-D1 atomicity or event bus claim. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q66 (7.3) — proposal only; dev-triggered.

## Task 7.4 — Reconcile and close Q67

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.3
**Blocked by:** 7.3
**Parallel:** false
**Objective:** Reconcile Q67 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q67_consistency-preview.md
- Modify: docs/plans/000_spike-plan/evidence/q67_consistency-preview.md
- Modify: docs/decisions/0011-content-consistency-and-preview-isolation.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile final proposed Q40 deployment/auth topology, Q47 selected-history behavior, Q54 publish/schedule and Q70 author/remote-poll semantics. Re-run actual author/public/multi-colo propagation and failed-purge recovery, unauthorized/expired preview plus history/account-switch isolation. Accepted exact staleness/ack policy must match observed evidence, not stale KV assumptions. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q67 (7.4) — proposal only; dev-triggered.

## Task 7.5 — Reconcile and close Q68

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.4
**Blocked by:** 7.4
**Parallel:** false
**Objective:** Reconcile Q68 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q68_security-bootstrap.md
- Modify: docs/plans/000_spike-plan/evidence/q68_security-bootstrap.md
- Modify: docs/decisions/0012-security-profiles-and-auth-bootstrap.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile Q63 prefixed-ID auth evidence, Q40 selected session/origin topology, Q47 actual presentation/CSP and Q70 sync working-set/push paths. Re-run every-surface profile coverage and denied undeclared surfaces, bootstrap/recovery, CSRF/origin/session/token/resource negatives and real concurrency/distributed limiter claims. No presentation header trust or weakening CSP. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q68 (7.5) — proposal only; dev-triggered.

## Task 7.6 — Reconcile and close Q70

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.5
**Blocked by:** 7.5
**Parallel:** false
**Objective:** Reconcile Q70 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q70_local-first-sync.md
- Modify: docs/plans/000_spike-plan/evidence/q70_local-first-sync.md
- Modify: docs/decisions/0009-local-first-datastore-and-sync.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile accepted Q65 recovery/erasure, Q66 idempotency/versioning, Q67 consistency, Q68 auth and final-candidate Q40/Q47 seams. Re-run shared schema+queries on D1/OPFS, atomic local write+log→single-D1-set, lease/takeover/offline conflicts, authorized working set, upgrade/snapshot/tombstone/purge and actual browser-support cases. Q70 remains additive and an MVP implementation deliverable, not satisfied by this closure. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q70 (7.6) — proposal only; dev-triggered.

## Task 7.7 — Reconcile and close Q54

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.6
**Blocked by:** 7.6
**Parallel:** false
**Objective:** Reconcile Q54 against the now-proven coupled designs and obtain explicit dev closure.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q54_content-workflows.md
- Modify: docs/plans/000_spike-plan/evidence/q54_content-workflows.md
- Modify: docs/decisions/0004-content-workflow-semantics.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Reconcile the earlier accepted workflow semantics with closed Q65–Q68/Q70 guarantees and final-candidate Q47 host contracts. Rerun field/state/history/revision/save/preview/media-relation proofs and dual-host lifecycle/authorization/keyboard behavior. Final design contains concrete workflow semantics, safe publish acknowledgement and unsaved/offline conflict interaction; no search implementation or implicit UI choice. Inspect all owning-spec requirements, rerun selected-mechanism evidence affected by reconciliation, and inspect linked raw/manual outputs. A proposed ADR becomes accepted only on the dev's explicit design decision. Parent closure row includes actual artifact versions/results/acceptance; missing evidence or material incompatibility blocks closure and sends affected tasks for scoped rework, not a TODO green marker. No product implementation is authorized.

**Verification:** Run the gate's isolated test/typecheck/lint/build commands from the artifact contract plus every named coupled regression; use actual browser/cloud outputs where the owning requirement demands them. Audit ADR/design/evidence/version parity against the final selected interfaces, then ask the dev for closure. Record PASS/FAIL and limitations; no assumed pass from a previous candidate run.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): reconcile and close q54 (7.7) — proposal only; dev-triggered.

## Task 7.8 — Close Q40/Q47/Q46 JOINTLY

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.7
**Blocked by:** 7.7
**Parallel:** false
**Objective:** Perform the single joint acceptance of final composition/exports, client/host/presentation interfaces and public-site starter selection.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md
- Modify: docs/plans/000_spike-plan/designs/q47_client-host-contracts.md
- Modify: docs/plans/000_spike-plan/designs/q46_public-starter.md
- Modify: docs/plans/000_spike-plan/evidence/q40_composition-lifecycle.md
- Modify: docs/plans/000_spike-plan/evidence/q47_client-host-contracts.md
- Modify: docs/plans/000_spike-plan/evidence/q46_public-starter.md
- Modify: docs/decisions/0006-composition-installation-and-lifecycle.md
- Modify: docs/decisions/0007-client-wire-host-and-presentation.md
- Modify: docs/decisions/0008-public-site-starter.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** Prerequisite: Q38 first closure plus accepted Q54 semantics and now-reconciled Q54/Q63/Q70/Q65–Q68. Exact final export/topology/client/wire/DOM/presentation/starter contracts agree; chosen dashboard/controller/panel and public starter are separate EXPLICIT dev selections with recorded alternatives/evidence, bounded support and actual Q62 admin/overlay target values. Browser-only imports and real transitive dependency graph, dual-host unchanged contracts, CSP/history/focus/unsaved/conflict behavior, one-D1 registry rollback, invocation context/refresh and real repo semver/ownership/update proof all pass under FINAL selected versions. Rework invalidated proofs before asking acceptance. Each gate retains one ADR/design/evidence; do not combine the three into a single ADR. Update all three closure rows only at this joint human acceptance boundary.

**Verification:** Rerun Q40/Q47/Q46 harness test/typecheck/lint/build scripts plus affected auth/OPFS/Q54 regressions and actual local/deployed/preview browser probes. Inspect design/ADR/evidence parity and required browser/manual/cloud logs; then obtain explicit joint dev acceptance. Any failure leaves the joint group unclosed.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): close q40/q47/q46 jointly (7.8) — proposal only; dev-triggered.

## Task 7.9 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.8
**Blocked by:** 7.8
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0020-spike-phase-007-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_007.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review all gate closure artifacts and the Q38-first/Q54-input/joint-Q40-Q47-Q46 ordering; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

