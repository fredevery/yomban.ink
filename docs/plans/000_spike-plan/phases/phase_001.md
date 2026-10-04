---
title: "Yomban.ink — spike phase 001: Core capability inventory — Q38 FIRST"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 001 — Core capability inventory — Q38 FIRST

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Close Q38 before any other design-spike task; inventory capabilities without deciding packaging or execution.
**Depends on:** None; Q38 runs FIRST.
**Exit state:** Only Q38 may close. A failing inventory/check or missing dev acceptance blocks Phase 002.
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

## Task 1.1 — Inventory server/core/headless capabilities

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** None
**Blocked by:** None
**Parallel:** false
**Objective:** Define the complete capability inventory and required-versus-optional policy from the settled sources.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q38_capability-inventory.md
- Create: docs/plans/000_spike-plan/evidence/q38_capability-inventory.md

**Acceptance:** Inventory datastore (D1 plus client-local driver seam), storage/R2, filesystem/CLI-vs-Worker persistence, cache/invalidation, auth/authorization, routing/config/secrets, jobs, observability/redaction, identifiers, registry/UOW, headless/host seams and PII classification/erasure hooks. Each entry specifies owner, environments, consumers, optionality, missing-capability behavior and locked source. Include Q42 shared implications and Q70 additions. Built-in features remain ordinary modules; dashboard/component kit/panel/design-token presentation is not mandatory core. Do not select package paths/execution topology here.

**Verification:** Inspect every inventory row against project Q30/Q35/Q37/Q38/Q39/Q42/Q45/Q50–Q59/Q70/Q71 and 002 §§Core/Manifest; map each requirement to a concrete capability/check case in evidence. Obtain dev input acceptance before building checks.

**Execution notes:** Compare feature-vs-infrastructure classification, resolve genuine inventory choices with the dev and record them; design/evidence report initially labels execution results not yet run.

**Commits:** docs(spikes): inventory server/core/headless capabilities (1.1) — proposal only; dev-triggered.

## Task 1.2 — Prove capability checks and feature independence

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 1.1
**Blocked by:** 1.1
**Parallel:** false
**Objective:** Exercise the accepted capability policy through a bounded framework-free manifest/check harness.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/package.json
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/pnpm-lock.yaml
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/tsconfig.json
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/biome.json
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/README.md
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/src/proof.ts
- Create: docs/plans/000_spike-plan/spikes/q38_capability-inventory/src/proof.test.ts
- Modify: docs/plans/000_spike-plan/designs/q38_capability-inventory.md
- Modify: docs/plans/000_spike-plan/evidence/q38_capability-inventory.md

**Acceptance:** Write RED tests before the checker. Real manifest inputs cover a valid service-only module, absent optional capability, rejected missing required capability, wrong environment, undeclared dependency/capability and ordinary built-in/custom parity. Test actual checker behavior, not equality against a duplicated expected inventory. No presentation dependencies/binding access. Pin actual tool versions and explicitly supply working scripts/config; src tests are co-located.

**Verification:** From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts.

**Execution notes:** The harness exposes a public capability-validation entry and invokes it through both positive/negative manifest fixtures; capture diagnostics and inspect its dependency graph.

**Commits:** docs(spikes): prove capability checks and feature independence (1.2) — proposal only; dev-triggered.

## Task 1.3 — Accept Q38 and record first gate closure

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 1.2
**Blocked by:** 1.2
**Parallel:** false
**Objective:** Record the accepted inventory ADR and close Q38 with verified evidence before any subsequent spike.
**Files:**
- Modify: docs/plans/000_spike-plan/designs/q38_capability-inventory.md
- Modify: docs/plans/000_spike-plan/evidence/q38_capability-inventory.md
- Create: docs/decisions/0003-core-capability-inventory.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md

**Acceptance:** ADR records inventory/policy, rejected alternatives and design/evidence links; dev acceptance is explicit. Run checker evidence again, reconcile required-vs-optional cases and update only Q38 to Closed with artifacts/version/acceptance. All other gates remain Planned. A failed check blocks closure.

**Verification:** From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q38_capability-inventory build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Inspect ADR/design/evidence parity and the parent closure matrix; Q38 must be the first Closed gate.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): accept q38 and record first gate closure (1.3) — proposal only; dev-triggered.

## Task 1.4 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 1.3
**Blocked by:** 1.3
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0014-spike-phase-001-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_001.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review Q38 inventory, checker evidence and actual FIRST closure; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

