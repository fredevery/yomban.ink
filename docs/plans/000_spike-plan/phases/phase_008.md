---
title: "Yomban.ink — spike phase 008: Live reference convergence and MVP handoff"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 008 — Live reference convergence and MVP handoff

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Fold accepted design outcomes into live reference docs, preserve historical sources and audit the implementation handoff without shipping code.
**Depends on:** Phase 007 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** All gates remain evidence-backed; docs converge; final plan approval/close remains dev-triggered. No MVP deliverable is reported shipped.
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

## Task 8.1 — Fold accepted design outcomes into live docs

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 7.9
**Blocked by:** 7.9
**Parallel:** false
**Objective:** Converge the canonical index and focused specs/guardrails on accepted spike results.
**Files:**
- Modify: docs/specs/000_index.md
- Modify: docs/specs/001_product-and-mvp.md
- Modify: docs/specs/002_module-platform-contract.md
- Modify: docs/specs/003_data-and-migrations.md
- Modify: docs/specs/004_clients-and-presentation.md
- Modify: docs/specs/005_content-and-editing.md
- Modify: docs/specs/006_cli-and-distribution.md
- Modify: docs/specs/007_security-and-identity.md
- Modify: docs/specs/008_operations-and-quality.md
- Modify: docs/best-practices/typescript.md
- Modify: docs/best-practices/worker.md
- Modify: docs/best-practices/persistence.md
- Modify: docs/best-practices/module-authoring.md
- Modify: docs/best-practices/auth.md
- Modify: docs/best-practices/testing.md
- Modify: docs/best-practices/ids-and-enums.md
- Modify: docs/best-practices/client.md
- Modify: docs/best-practices/bindings.md
- Modify: docs/conventions/architectural-patterns.md
- Modify: docs/quickstart.md
- Modify: docs/status/yomban-status.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify (explicit dev approval required): AGENTS.md

**Acceptance:** Fold only accepted outcomes/closure references and relevant changed guidance; do not rewrite unchanged docs for cosmetics. Index keeps canonical ownership/block authority and marks actual closures with links; focused docs retain locked decisions/domain-specific requirements rather than duplicate gate boilerplate. Live candidate/unselected/deferred text becomes accepted design-state without claiming product exists. Quickstart stays planned until MVP implementation, no working command fiction. Historical discovery/amendments/review §1–§9 and prior ADRs remain intact; no duplicate housekeeping tasks. AGENTS.md edit is separately approval-gated and limited to live doc map/state/selected-stack pointers. Any newly deferred design decision affecting named gate closure must be resolved/reopened, not hidden in backlog.

**Verification:** Run relative-link/product-name/current-choice drift checks across live reference docs and all plan design/evidence/ADR files; `git diff --check`; framework validators. Inspect every retired candidate/gate-open claim in context: historical records may remain historical, live guidance must not contradict accepted outcomes. Validate closure links and no production files added.

**Execution notes:** At task gate enumerate which guardrails actually need edits from accepted decisions; keep untouched guides unchanged. Present precise AGENTS.md patch for approval before applying it.

**Commits:** docs(spikes): fold accepted design outcomes into live docs (8.1) — proposal only; dev-triggered.

## Task 8.2 — Write and audit the MVP implementation handoff

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 8.1
**Blocked by:** 8.1
**Parallel:** false
**Objective:** Produce a concise implementation-ready design handoff and complete gate evidence audit.
**Files:**
- Create: docs/plans/000_spike-plan/handoff.md
- Create: docs/plans/000_spike-plan/evidence/plan-closure-audit.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Handoff names accepted capabilities, final packages/exports/topology/lifetime/ID/install ownership, content/wire/host/starter/UI choices, migration/auth/local-first/effect/cache/security/recovery policies, exact proof/ADR/design locations and implementation dependencies/known platform limits. Map later MVP acceptance (deployed golden path, chosen representative pilot-derived scenario with zero core edits, selected starter/dashboard/editing, Q70 working store/sync, two fixtures and security/ops) to designs; do not choose all Q42 modules or write MVP task deck here. Audit all eleven in-scope gates for complete one-ADR/design/evidence/acceptance, Q38 first and Q40/Q47/Q46 joint closure, no failed mandatory proof outstanding. Post-MVP Q69/search/mobile remain excluded.

**Verification:** Mechanically enumerate closure matrix/artifact existence and requirement coverage, inspect actual evidence output/acceptance records and rerun aggregate isolated harness test/typecheck/lint/build commands with owner/manual logs where required; framework validators and `git diff --check` pass. If code versions changed, stale evidence is rerun. A single failed required closure blocks plan completion.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): write and audit the mvp implementation handoff (8.2) — proposal only; dev-triggered.

## Task 8.3 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 8.2
**Blocked by:** 8.2
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0021-spike-phase-008-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_008.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review full live-reference fold, reproducible gate closures and honest non-product MVP handoff; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

