---
title: "Yomban.ink — spike phase 003: Coupled design inputs — Q40 / Q47 / Q46 / Q70"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: true
status: Approved (2026-10-07 — dev sign-off via /approve-phase; ADR-0017 PASS-with-findings, no MUST)
---

# Phase 003 — Coupled design inputs — Q40 / Q47 / Q46 / Q70

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Design provisional coupled interfaces and evaluate distinct presentation/starter choices using accepted Q54 input.
**Depends on:** Phase 002 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** All four designs are accepted inputs only. Candidates remain proposed until bounded proof and explicit final acceptance.
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

## Task 3.1 — Design composition, installation and invocation lifecycle

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 2.5
**Blocked by:** 2.5
**Parallel:** false
**Objective:** Specify the full Q40 composition/export/deployment/install/lifecycle contract.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md
- Create: docs/plans/000_spike-plan/evidence/q40_composition-lifecycle.md
- Create: docs/decisions/0006-composition-installation-and-lifecycle.md

**Acceptance:** Using Q38/Q54/Q63 inputs, define server-only/headless/server-safe/browser/DOM/presentation exports, optional facets, per-side core layout and composition roots importing core+modules without core importing features. Choose packaging-vs-execution provisionally, one-deployment topology, route/SSR/auth-handler ownership, cookies/session propagation, credentialed CORS/trusted origins/CSRF for local/deployed/preview, no stale globals/binding I/O at init. Define immutable build metadata vs invocation user/env/UOW/trace/service/config/secret lifetime and sink completion/failure redaction. Specify exact repo/subpackage/tag-semver install/update and generated-vs-installed consumer ownership, non-destructive updates, deterministic AI artifacts/AI-fill+conformance boundary, contract current+N-1 upgrade vs DB migrate, ID algorithm/client-finality/namespace collisions and enum/permission aggregation. Registry services contribute operations to one D1 batch; no independent commit. Include Q70 browser-store session lifetime and provisional effect/security/consistency interfaces.

**Verification:** Full Q40 canonical-table and 002/003/004/006/007/008 scope maps to a design section/proof. Verify install specifiers/semver assumptions against actual pnpm/repo-package mechanics through evidence tasks, not invented syntax. Obtain dev acceptance of provisional inputs; final exports wait on joint closure.

**Execution notes:** Set dashboard/overlay performance target proposals with Q47 using Q54 workflow input; public targets unchanged. No root product package layout is authored.

**Commits:** docs(spikes): design composition, installation and invocation lifecycle (3.1) — proposal only; dev-triggered.

## Task 3.2 — Design client/wire/host/presentation contracts

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 3.1
**Blocked by:** 3.1
**Parallel:** false
**Objective:** Specify exact Q47 framework-free contracts and independently evaluate dashboard/controller/panel choices.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q47_client-host-contracts.md
- Create: docs/plans/000_spike-plan/evidence/q47_client-host-contracts.md
- Create: docs/decisions/0007-client-wire-host-and-presentation.md

**Acceptance:** Define mapped public DTO/runtime schemas, validation in/out, serialization/route/error conventions, typed module-source client, headless vs DOM exports and host notification/lifecycle contracts. Shared runtime schemas and a typed client from module source are primary: no primary codegen/tRPC inference/OpenAPI generation. Public API and optional HTML paths invoke the same domain/authorization operations; HTML may call them in-process and is not required to loop back over HTTP. Renderer-neutral standard-admin descriptions vs explicitly implementation-specific custom views. Host owns content DOM/config; panel mutates only its own DOM. Explicit separate candidate comparisons and dev-proposed dashboard/controller/panel choices (Hono/htmx and TS-controller/htmx-panel are candidates, not defaults). Include focused rich-editor/drag-drop/crop/repeater/media/progress lifecycle needs, unsaved state, local sync/conflict surfacing, performance targets, WCAG/CSP and browser support. If htmx is selected for a presentation role, design the conditional checks explicitly: HX-Request is never authorization; sanitize untrusted content and use hx-disable as applicable; disable unnecessary evaluation/script processing; explicit 422/session-expiry handling; private history-cache isolation. These checks do not adopt htmx. Define reactive fixture within locked one-page/list+edit-one/publish-action/no routing/SSR/server-action/server-runtime bounds; both hosts use unchanged services/contracts.

**Verification:** Trace 004 acceptance and review §9 D2 mandatory checks to fixture cases and Q54 needs. Dependency/export design must reject direct/transitive presentation dependencies in core/contracts/headless and leaked private/server fields. Candidate selection requires later executed proof and final dev decision.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): design client/wire/host/presentation contracts (3.2) — proposal only; dev-triggered.

## Task 3.3 — Evaluate public-site starter and bounded support

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 3.2
**Blocked by:** 3.2
**Parallel:** false
**Objective:** Compare Q46 starter candidates as a distinct choice, not inferred from admin/panel technology.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q46_public-starter.md
- Create: docs/plans/000_spike-plan/evidence/q46_public-starter.md
- Create: docs/decisions/0008-public-site-starter.md

**Acceptance:** Choose a bounded shortlist after inspecting candidate Workers topology/contract compatibility; compare workflow/SEO/public budgets/WCAG/browser/support/maintenance/install ownership and Q70 integration requirements. Record selection proposal and bounded support (supported versions/interfaces, generated ownership, update obligations/exclusions). Former SvelteKit choice stays superseded, no automatic Hono/htmx adoption. One production starter later; fixtures are not starters. No Q69 dogfooding influence.

**Verification:** Candidate matrix is source-backed and maps to Q46 owning acceptance, Q62 targets and Q40/Q47 interfaces. Dev accepts shortlist/selection proposal before proof; adopted choice awaits 6.4 + joint 7.8. Do not declare unbuilt production performance achieved.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): evaluate public-site starter and bounded support (3.3) — proposal only; dev-triggered.

## Task 3.4 — Design local-first datastore and sync mechanics

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 3.3
**Blocked by:** 3.3
**Parallel:** false
**Objective:** Concretize Q70 confirmed shape without reopening Drizzle, identity or atomicity locks.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q70_local-first-sync.md
- Create: docs/plans/000_spike-plan/evidence/q70_local-first-sync.md
- Create: docs/decisions/0009-local-first-datastore-and-sync.md

**Acceptance:** Specify actual browser SQLite worker/OPFS driver and async Drizzle proxy seam, same sqliteTable/query code, browser-safe exports, session lifecycle and class-1 vs class-2 physical separation. Aggregate root/children declarations and multi-root action boundaries; local mutation+change-row transaction and WAL feasibility. Change-set envelope/order/group/idempotency, single D1 batch with server-derived writes, fail-stop/rejected bucket, per-field base/rev three-way conflict and merge/fork. Server-clock advisory leases, renewal/expiry/live-user no-steal/same-user takeover/offline provisional; record remote-status not publish state. Server-authoritative authored/cache/remote-only working sets, poll-on-focus/interval/reconnect push/pull/renew transport, remote-apply pause per actively leased record, watched/conflict-only alerts + global sync status. Current+N-1 payloads, too-old read-only/export, one-way local schema migration with snapshot, tombstone retention+all-replica ACK/GC and explicit purge. Couple with Q65 erasure/recovery and Q66/Q67 security/consistency inputs.

**Verification:** Map all Amendment 001 §§1–8 risk resolutions and Amendment 002 privacy/MVP scope to proof cases. Inspect actual SQLite driver/OPFS/Drizzle/proxy support including Safari/browser matrix and WAL requirements; unsupported mandatory behavior is a blocker requiring dev reconciliation, not a silent in-memory fallback.

**Execution notes:** Lease TTLs/poll cadence/schema versioning/storage isolation decisions are spike-owned explicit policies; no new query language, CRDT/event bus, native-wrapper MVP delivery or whole-remote replica.

**Commits:** docs(spikes): design local-first datastore and sync mechanics (3.4) — proposal only; dev-triggered.

## Task 3.5 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 3.4
**Blocked by:** 3.4
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0017-spike-phase-003-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_003.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review the four explicitly provisional designs and candidate proposals; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

**Review record (task 3.5, 2026-10-07):** phase review complete — ADR-0017 records
PASS-with-findings (no MUST). Verification: three prerequisite harnesses re-run from
repo root, all five commands exit 0 each (7 + 21 + 14 tests); `git diff --check`,
`validate-understanding.py` (OPEN: 0) and `validate-state.py` all exit 0; mechanical
sweeps (own-§ refs, source tallies, gate banners, file hygiene) clean. Findings: one
SHOULD fixed in pass (q47 design §17 `§13.4–5` → `§13 items 4–5`); SHOULDs recorded —
closure-matrix Q40/Q47/Q46/Q70 rows refreshed from Planned (review pass), status doc
refreshed; DEFERs (install-specifier syntax → 6.1–6.2; SEO verification → 6.4;
Q70 browser/round-trip proofs → 5.1) carried with named owners. Gate state preserved:
Q40/Q47/Q46/Q70 all NOT Closed; ADR-0006/0007/0008/0009 stay Proposed. Owner/browser/
cloud checks N/A for this doc-only phase. Close-out edits left uncommitted per the
task's (none) commit rule; `approved: true` flips only at the dev's `/approve-phase`.

