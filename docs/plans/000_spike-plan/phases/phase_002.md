---
title: "Yomban.ink — spike phase 002: Workflow and persistence inputs — Q54 / Q63"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 002 — Workflow and persistence inputs — Q54 / Q63

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Accept content workflow semantics early and prove placement/migration/auth inputs without claiming dependent final closures.
**Depends on:** Phase 001 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** Q54 workflow input accepted; Q63 design/evidence provisional pending Q65/Q40 reconciliation. Neither gate is Closed.
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

## Task 2.1 — Design content workflow semantics

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 1.4
**Blocked by:** 1.4
**Parallel:** false
**Objective:** Specify Q54 content fields, state transitions and editing requirements as presentation-independent workflow input.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q54_content-workflows.md
- Create: docs/plans/000_spike-plan/evidence/q54_content-workflows.md
- Create: docs/decisions/0004-content-workflow-semantics.md

**Acceptance:** Concrete type/field model includes text/rich-text/media/relation/repeater; stored types will be inferred from module Drizzle schema. Define legal/illegal draft/review/publish/schedule/revision transitions, immutable history and failed publish behavior, visibility/soft-delete/sort_order. Pin server revision checks, authorized preview needs, save/unsaved/debounce semantics, DOM entity/field references and host ownership. Locks follow shared/remote aggregate roots, not publish state; offline edits remain provisional. Describe required Q66/Q67 guarantees without inventing their mechanism/window. Record search future home only. ADR proposed, not closed.

**Verification:** Trace design to 005 §§6/8 (R1–R11), Q42/Q54/Q58 and Amendment 001. Dev accepts workflow INPUT before Q40/Q47 design; evidence report records that acceptance and unexecuted checks separately.

**Execution notes:** Resolve state semantics with the dev; do not interpret the discovery workflow arrow as a complete state machine or select a UI from it.

**Commits:** docs(spikes): design content workflow semantics (2.1) — proposal only; dev-triggered.

## Task 2.2 — Prove workflow transitions and optimistic saves

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 2.1
**Blocked by:** 2.1
**Parallel:** false
**Objective:** Execute bounded non-UI workflow proofs against real D1 and retain accepted workflow input.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/package.json
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/pnpm-lock.yaml
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/tsconfig.json
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/biome.json
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/README.md
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/src/proof.ts
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/src/proof.test.ts
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/vitest.config.ts
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/wrangler.jsonc
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/src/schema.ts
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/drizzle.config.ts
- Create: docs/plans/000_spike-plan/spikes/q54_content-workflows/migrations/README.md
- Modify: docs/plans/000_spike-plan/designs/q54_content-workflows.md
- Modify: docs/plans/000_spike-plan/evidence/q54_content-workflows.md

**Acceptance:** TDD real-D1 workflow/field fixtures: each field kind, valid/invalid transitions, scheduled and post-publish revision history, stale revision/concurrent save denial preserving newer data, failed/late saves not claiming publish success, resource-permission/preview denials and media/relation ownership. Use Drizzle-generated fixture migrations and the explicitly documented proof path; no product migration runner or media pipeline ships. External propagation/purge/security claims wait for Q66/Q67/Q68.

**Verification:** Run the Q54 harness scripts against actual D1 via Workers Vitest pool; inspect persisted rows/history on successful and rejected transitions. From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q54_content-workflows install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q54_content-workflows test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q54_content-workflows typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q54_content-workflows lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q54_content-workflows build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts.

**Execution notes:** Generate migration artifacts with the pinned Drizzle tooling, list exact generated paths before execution, and capture real failure output. The local fixture migration path is provisional evidence, not Q63 closure.

**Commits:** docs(spikes): prove workflow transitions and optimistic saves (2.2) — proposal only; dev-triggered.

## Task 2.3 — Design placement, migration runner and auth integration

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 2.2
**Blocked by:** 2.2
**Parallel:** false
**Objective:** Specify Q63 placement/namespace/ledger/locking/removal mechanics within locked D1 constraints.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q63_persistence-migrations.md
- Create: docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md
- Create: docs/decisions/0005-database-placement-and-migrations.md

**Acceptance:** Compare shared vs separately bound D1 with one-batch atomicity; select provisional placement with dev input. Specify table/migration namespace/collisions, dependency order, persistent ledger, concurrent-deploy exclusion/fencing, partial failure/retry, data-vs-schema migrations, Drizzle-generated SQL execution, empty/existing upgrade behavior, Better Auth complete base-schema generation/ownership, safe module removal/data retention and Q65 backup/recovery requirements. Q40 supplies wiring participation; recovery remains provisional until Q65. Identity cannot become INTEGER or unprefixed.

**Verification:** Requirement matrix covers every Q63 scope bullet in 003 §Q63. Check chosen package/adapter behavior against actual official docs and installed/pinned packages; record unknowns as evidence work, not a proven API. ADR stays proposed.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): design placement, migration runner and auth integration (2.3) — proposal only; dev-triggered.

## Task 2.4 — Prove migrations and Better Auth prefixed TEXT IDs

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 2.3
**Blocked by:** 2.3
**Parallel:** false
**Objective:** Exercise the selected Drizzle/D1 adapter and migration candidate under actual Workers/D1 behavior.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/package.json
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/pnpm-lock.yaml
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/tsconfig.json
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/biome.json
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/README.md
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/proof.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/proof.test.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/vitest.config.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/wrangler.jsonc
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/drizzle.config.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/schema.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/auth.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/src/auth.test.ts
- Create: docs/plans/000_spike-plan/spikes/q63_persistence-migrations/migrations/README.md
- Modify: docs/plans/000_spike-plan/designs/q63_persistence-migrations.md
- Modify: docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md

**Acceptance:** Real D1: empty/existing-version migration, collisions/dependency ordering, replay/retry after injected failure and simultaneous deploy attempts with safe ledger state, schema-vs-data upgrade and module removal retaining data. Better Auth generates required schema and executes supported auth flows through its selected Drizzle/D1 adapter with core-seam-generated entity-prefixed sortable TEXT IDs across every created auth entity and FK. No integer/unprefixed fallback; inspect actual stored IDs/schema, not just a generateId unit test. Pin temporary core-seam ID candidate as provisional pending Q40; final selected ID and Q68 flows are rerun at reconciliation.

**Verification:** Run actual schema-generation/migration commands (record exact command/output and generated path list) plus real-D1 tests. From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q63_persistence-migrations build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Failed compatibility blocks auth work and is surfaced to the dev.

**Execution notes:** RED tests for adapter persistence, upgrade/collision/replay/concurrency first. Q65 restore of these fixtures follows in Phase 004; Q63 final acceptance waits for 7.2.

**Commits:** docs(spikes): prove migrations and better auth prefixed text ids (2.4) — proposal only; dev-triggered.

## Task 2.5 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 2.4
**Blocked by:** 2.4
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0015-spike-phase-002-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_002.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review Q54 accepted workflow input and Q63 provisional persistence/auth proof; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

