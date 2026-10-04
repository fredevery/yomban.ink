---
title: "Yomban.ink — spike phase 006: Composition, installation and dual-host/starter evidence — Q40 / Q47 / Q46"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 006 — Composition, installation and dual-host/starter evidence — Q40 / Q47 / Q46

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Prove the proposed final interfaces, topology and independent UI/starter choices before joint acceptance.
**Depends on:** Phase 005 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** Q40/Q47/Q46 evidence complete only when applicable browser/deployment cases pass; formal joint closure remains Phase 007.
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

## Task 6.1 — Prove exports, registry UOW and invocation lifetimes

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 5.4
**Blocked by:** 5.4
**Parallel:** false
**Objective:** Exercise actual Q40 composition boundaries, single-D1 registry participation and service/context lifetime.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/package.json
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/pnpm-lock.yaml
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/tsconfig.json
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/biome.json
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/README.md
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/src/proof.ts
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/src/proof.test.ts
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/vitest.config.ts
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/wrangler.jsonc
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/src/schema.ts
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/src/worker.ts
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/export-cases.md
- Modify: docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md
- Modify: docs/plans/000_spike-plan/evidence/q40_composition-lifecycle.md

**Acceptance:** Bounded isolated package fixture implements accepted export graph/composition root; no root product workspace. Prove service-only and optional presentation omission, no direct/transitive UI/core or server/browser leaks, module dependencies/unsupported contract/collision errors and deterministic enum+permission aggregation. Actual two registry services defer statements into ONE D1 batch; injected second-operation failure rolls back both, conditional read-dependent invariant is not a pre-read+later-write assertion. Invocation interleaving/config-secret refresh detects stale cached bindings or cross-user/env/trace leaks; import phase performs no binding I/O. Selected ID algorithm/client finality and namespace behavior are explicit and reused for auth/local paths.

**Verification:** Run export/bundling/import-negative and actual D1 rollback/lifetime tests; inspect package/dependency graph rather than string-checking source only. From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Repeat with swapped invocation config/context and absent optional facets.

**Execution notes:** TDD actual seam code; exact fixture package paths/manifests and generated metadata are allocated in Files before dispatch, keeping isolated under spikes/q40_composition-lifecycle/.

**Commits:** docs(spikes): prove exports, registry uow and invocation lifetimes (6.1) — proposal only; dev-triggered.

## Task 6.2 — Prove repo installation, ownership, upgrades and auth topology

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 6.1
**Blocked by:** 6.1
**Parallel:** false
**Objective:** Exercise actual Q40 install/update mechanics and selected deployment/session/config integration.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/install-cases.md
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/topology-cases.md
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/src/install-proof.ts
- Create: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/src/install-proof.test.ts
- Modify: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/package.json
- Modify: docs/plans/000_spike-plan/spikes/q40_composition-lifecycle/pnpm-lock.yaml
- Modify: docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md
- Modify: docs/plans/000_spike-plan/evidence/q40_composition-lifecycle.md

**Acceptance:** Use disposable LOCAL source git repo + generated fixture consumer, never commit/tag the project repo. Actual pnpm repo/subpackage/git-tag-semver resolution/update, independently versioned package transitions, current+N-1 contract acceptance and unsupported-major failure; no npm publishing/lockstep/tag-pinning shortcut. Non-destructive rerun preserves consumer-owned files, installed package updates work without regeneration; deterministic AI orientation artifacts and bounded fill/conformance checked. Topology proof covers selected local/deployed/preview route/SSR/auth-handler/cookie/session/origin/CORS/CSRF/config-refresh behavior with Q68 policies, one deployment per consuming project and isolated resources. Proof generator is not a shipped CLI.

**Verification:** Run clean fixture install→test/typecheck/build, modify a project-owned file, repeat/update and compare tool-calculated digests; selected semver update resolves real versions. From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q40_composition-lifecycle build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Execute browser/SSR/session topology probes and separately gated remote environment cases; record outputs and unavailable checks.

**Execution notes:** Validate exact install syntax through actual pnpm; failure of repo-subpackage semver direction is surfaced, not silently replaced with registry publishing or fixed tag references.

**Commits:** docs(spikes): prove repo installation, ownership, upgrades and auth topology (6.2) — proposal only; dev-triggered.

## Task 6.3 — Prove wire validation, dual-host editing and chosen UI lifecycle

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 6.2
**Blocked by:** 6.2
**Parallel:** false
**Objective:** Execute Q47 boundary and selected dashboard/controller/panel proofs through identical framework-free contracts.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/package.json
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/pnpm-lock.yaml
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/tsconfig.json
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/biome.json
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/README.md
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/src/proof.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/src/proof.test.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/src/contracts.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/src/client.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/src/host.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/src/worker.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/vitest.config.ts
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/wrangler.jsonc
- Create: docs/plans/000_spike-plan/spikes/q47_client-host-contracts/browser-cases.md
- Modify: docs/plans/000_spike-plan/designs/q47_client-host-contracts.md
- Modify: docs/plans/000_spike-plan/evidence/q47_client-host-contracts.md
- Modify: docs/plans/000_spike-plan/evidence/q67_consistency-preview.md

**Acceptance:** Real invalid input AND output validation, serialization/stable errors/private-field rejection/browser-only imports. Plain HTML/server-rendered host and a bounded reactive ONE-PAGE host list/edit/publish the SAME entity through unchanged typed browser-safe contracts and notifications; reactive no routing/SSR/server actions/data-loading/framework server runtime. Same authorization/expired session/validation/CSP/focus/keyboard/announcements/stale-revision/unsaved-state coverage, host owns DOM/config, panel swaps only its DOM. Candidate-selected dashboard/controller/panel have explicit teardown/rich-editor/drag-drop/crop/repeater/media/progress/save/lock/conflict lifecycle checks with Q70 and history/preview isolation Q67. Optional omission still permits non-UI operation. Performance targets chosen explicitly, bounded measurements/WCAG checks recorded without claiming production delivery. If htmx is selected for any presentation role, prove HX-Request cannot bypass auth; sanitize untrusted content with hx-disable as applicable; disable unnecessary eval/script processing in the actual configuration; exercise explicit 422/session-expiry fragment/error handling and private history isolation. No htmx-specific checks apply if it is rejected, and this does not select htmx. Record each evaluated dashboard/controller/panel candidate's observed results, measurements and rejection reasons in evidence/q47_client-host-contracts.md (relative to the plan directory) before joint task 7.8; distinguish source-based rejection from a candidate actually executed and never invent results for an untested alternative.

**Verification:** Run harness/wire/dependency-boundary tests and real supported-browser dual-host actions/DOM mutation observers/keyboard+CSP/history checks; inspect that services/contracts did not change between hosts. From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q47_client-host-contracts install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q47_client-host-contracts test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q47_client-host-contracts typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q47_client-host-contracts lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q47_client-host-contracts build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Record selected library/framework versions and owner browser evidence.

**Execution notes:** Before dispatch, allocate exact fixture HTML/reactive/dashboard/controller/panel source/config paths under this harness and add actual selected dependencies; do not invent unavailable component APIs or use the proof to select a public starter by inference.

**Commits:** docs(spikes): prove wire validation, dual-host editing and chosen ui lifecycle (6.3) — proposal only; dev-triggered.

## Task 6.4 — Prove proposed public starter and support contract

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 6.3
**Blocked by:** 6.3
**Parallel:** false
**Objective:** Verify Q46 proposed starter against final-candidate Q40/Q47 contracts in a bounded consuming fixture.
**Files:**
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/package.json
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/pnpm-lock.yaml
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/tsconfig.json
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/biome.json
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/README.md
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/src/proof.ts
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/src/proof.test.ts
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/starter-cases.md
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/browser-cases.md
- Create: docs/plans/000_spike-plan/spikes/q46_public-starter/support-matrix.md
- Modify: docs/plans/000_spike-plan/designs/q46_public-starter.md
- Modify: docs/plans/000_spike-plan/evidence/q46_public-starter.md

**Acceptance:** Use actual selected candidate/version to consume shared contracts and publish output, optional editing overlay/host-owned DOM, SEO/meta/content security, chosen Workers topology/session/dev-server wiring and ownership/install/update support. Verify selected support obligations/exclusions with concrete fixture cases; dashboard/panel technology need not match starter. Record evaluated starter candidates' actual probe/measurement results and rejection reasons in evidence/q46_public-starter.md (relative to the plan directory) before joint task 7.8, explicitly distinguishing source-based comparisons from executed candidate evidence. Bounded performance/accessibility/browser assessment supports the dev decision, public LCP/INP budgets unchanged and production MVP proof later. Q70 browser capability remains independent and integrations required by chosen role work without headless presentation coupling. No complete production starter/scaffold ships.

**Verification:** Run candidate build/typecheck/test/lint and browser read/edit/publish plus topology/import checks using the actual fixture; source-backed support matrix and measured limits included. From repo root: `pnpm --dir docs/plans/000_spike-plan/spikes/q46_public-starter install --frozen-lockfile`, then `pnpm --dir docs/plans/000_spike-plan/spikes/q46_public-starter test`, `pnpm --dir docs/plans/000_spike-plan/spikes/q46_public-starter typecheck`, `pnpm --dir docs/plans/000_spike-plan/spikes/q46_public-starter lint`, `pnpm --dir docs/plans/000_spike-plan/spikes/q46_public-starter build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Proposed choice remains open until joint 7.8 explicit acceptance.

**Execution notes:** Allocate actual candidate fixture paths/config/dependencies before dispatch after reading selected package APIs. Deployment/resources separately gated; failures reject/rework the proposal rather than weakening frontend independence.

**Commits:** docs(spikes): prove proposed public starter and support contract (6.4) — proposal only; dev-triggered.

## Task 6.5 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 6.4
**Blocked by:** 6.4
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0019-spike-phase-006-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_006.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review Q40 composition/install/lifetime and Q47/Q46 actual dual-host/UI/starter evidence, still awaiting joint closure; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

