---
title: Yomban.ink — spike plan 000
created_session: "20261004_213034_2d1c21"
sessions: ["20261004_213034_2d1c21"]
approved: true
status: Approved
---

# Yomban.ink — Spike Plan 000

> **For Hermes:** Use the Orca gated plan → phase → task lifecycle and fresh serial
> subagents for future task execution. This is a design-spike plan, not authorization
> to ship platform code. No automatic review dispatch before Discuss, activation,
> execution or commit. The durable task deck is extracted after the plan is reviewed.

**Goal:** Close the named foundational and affected-work design gates with one ADR,
concrete design and observed verification evidence per gate, leaving a coherent,
implementation-ready design baseline for the subsequent MVP plan.

**Architecture:** Capability inventory first; accepted workflow/data inputs next;
coupled topology/client/local-first designs next; operational/security designs and
fault proofs then feed local-first and frontend boundary proofs. Final cross-gate
reconciliation precedes formal closure and a scoped fold into the live reference docs.
Accepted inputs are not closed gates and cannot unblock product implementation.

**Tech stack:** Locked Workers/Hono/better-auth, TypeScript strict, pnpm, D1/Drizzle,
Vitest + `@cloudflare/vitest-pool-workers`, Biome and tsc. Q70's browser SQLite in a
Web Worker over OPFS, same Drizzle SQLite schema and proxy-driver direction is
confirmed. Exact versions/drivers, presentation choices and deferred mechanisms are
spike outcomes, not choices made by this plan.

**Dial:** Large; serial only; human gates before each task, candidate adoption,
resource provisioning and closure. **Current state:** Approved via the dev's
`/approve-plan` invocation (2026-10-04, session `20261004_221017_9e0945`). The final
budgeted reviewer returned PASS-with-findings, no MUST findings. Authorized SHOULD/source
clarifications are applied; not independently re-reviewed after the two-attempt cap.
Understanding is settled and explicit proceed/Discuss recorded. No spike has run and no
gate is closed. The plan is now **ACTIVE** — activated via the dev's `/start-plan` invocation
(2026-10-04, session `20261004_222104_e4336c`): `activePlan` set, PLAN card advanced out of
To do, `phase_001` prepped as the entry phase. Decomposition (`/extract-phases` then
`/extract-tasks`) is the next step, ahead of `/start-phase`. See [planning review](planning-review.md).

## Authority and settled inputs

Read [the plan understanding](understanding.md) first. Its Q1–Q6 are NEW plan-scope
questions; every other Q reference in this plan is a PROJECT discovery identifier.

- [Project discovery](../../discovery/understanding.md): Answer lines outrank
  historical Agent defaults; Q19 is authoritative for scope/sequencing.
- [Amendment 001](../../discovery/understanding-amendments-001.md): the confirmed
  additive Q70 shape; [Amendment 002](../../discovery/understanding-amendments-002.md):
  local-first is an MVP deliverable and privacy primitives reach on-device replicas.
- [Specification index](../../specs/000_index.md#canonical-gate-table): canonical
  gate definitions, ownership and blocks. The closure matrix below maps work to
  artifacts; it does not replace or duplicate the gate-definition authority.
- [Product/MVP](../../specs/001_product-and-mvp.md),
  [module contract](../../specs/002_module-platform-contract.md),
  [data](../../specs/003_data-and-migrations.md),
  [clients](../../specs/004_clients-and-presentation.md),
  [content](../../specs/005_content-and-editing.md),
  [CLI](../../specs/006_cli-and-distribution.md),
  [security](../../specs/007_security-and-identity.md),
  [operations](../../specs/008_operations-and-quality.md): all domain scope remains
  mandatory; task summaries do not narrow their owning gate sections.
- [Review §9](../../reviews/001_spec-review.md#9-recorded-resolutions-inputs-for-the-spec-fold):
  D1–D5/Q-A are resolved pre-fill. D1 requires the selected public starter; D2's
  one-page reactive fixture bounds are locked; D3/Q-A fix permission grammar and
  build aggregation; D4 fixes privacy posture; D5 fixes onboarding-before-plan order.
- [ADR-0001](../../decisions/0001-platform-foundations.md),
  [ADR-0002](../../decisions/0002-onboarding-baseline.md), `AGENTS.md`,
  `docs/conventions/` and `docs/best-practices/`: invariant ceiling and execution rules.

## Scope and non-goals

In scope: Q38, Q40, Q47, Q54, Q46, Q63, Q70 and Q65–Q68; executable bounded proofs,
per-gate designs/evidence/ADRs, cross-gate reconciliation and approved reference-doc
convergence. All named design gates remain owned here, including the affected-work
ones; none is silently transferred into an MVP implementation task.

Out of scope:

| Item | Disposition |
|---|---|
| Product implementation | Later MVP plan: no root production workspace, platform packages, shipped CLI/scaffold, production starter/dashboard/panel or operational rollout here |
| Q69 website purpose/dogfooding | Existing backlog; future post-MVP website plan; no influence on starter/contracts/release |
| Search | Post-MVP; Q54 records only its future home, no API/index/UI design |
| Mobile/Capacitor delivery; extra production renderers | Existing post-MVP backlog; no implementation or browser-proof substitution with a native wrapper |
| Full pilot rebuilds/new pilot audit | Q42 is completed input; future MVP plan selects proving modules; full rebuilds follow MVP |
| Event bus, CRDT/realtime coordination, query-builder abstraction | Not MVP mechanisms; Q70 is additive, same SQLite dialect and Drizzle, poll-based sync |
| Per-project legal/privacy policy | Consumer owns lawful basis, consent, DSR timelines and retention policy; platform designs its primitives and limitations |
| Re-splitting consolidated foundations ADR | Not needed to close these gates; retain ADR-0001 and its accepted decisions |
| YB-S3/YB-D2/YB-D3 housekeeping | Already resolved in live files/onboarding; no duplicate spike or backlog work |

Proof code is permitted ONLY under this plan's `spikes/` tree with isolated,
non-product manifests/lockfiles and synthetic data. It is not promoted into product
packages by copying or by passing tests. Generated fixture consumers/install exercises
stay under that tree or disposable directories outside the repo, never root `apps/`
or `packages/`. A later implementation must deliberately implement the accepted design.

## Artifact contract

Each gate's slug in the matrix is used consistently for:

- `designs/qNN_<slug>.md`: concrete, implementable design; candidate comparison and
  selected decision; exact contract/operation shapes, ownership and failure paths;
  dependencies, quantitative policies and rationale where the owning gate requires them.
- `evidence/qNN_<slug>.md`: requirement → test/probe → result mapping; reproduction
  commands/cwd, pinned packages/runtime versions, fixture identity, environment/browser
  versions, observed outputs/exit codes, failure cases, resource prerequisites and
  limitations. Link sanitized raw outputs in `evidence/raw/qNN/` when needed.
- `spikes/qNN_<slug>/`: bounded harness. New dependencies and config are explicit;
  list all authored proof files before task dispatch. Each executable harness exposes
  `test`, `typecheck`, `lint` and `build` scripts; use real D1 at its boundary.
- `docs/decisions/NNNN-<slug>.md`: one decision ADR for that gate, with alternatives,
  rationale, consequences and links to concrete design/evidence. ADRs begin proposed;
  accepted status records the dev's decision, never the agent's confidence alone.

No design/evidence/ADR files are created merely to make the plan look complete.
They are future task outputs. New-file allocations are rechecked at each task gate;
if an unrelated ADR has consumed an allocated number, surface and reconcile references
before writing, never overwrite or quietly renumber someone else's record.

Phase review ADRs are short process/sign-off records, separate from the one design
ADR per gate. They cannot substitute for a gate's evidence or create a second decision
owner. Phase reviews exercise the harnesses delivered so far, document real output
and distinguish an accepted input from gate closure.

## Evidence and closure rules

Gate states: Planned → Design input accepted (optional) → Evidence complete →
Reconciled → Closed. A state change identifies the dev's acceptance and artifact
versions. Failed or unavailable evidence remains BLOCKED, not “closed with TODOs”.

A gate closes ONLY when:

1. Its owning spec/canonical-table scope is completely covered by a concrete design.
2. Its one ADR records the explicitly accepted selection, including rejected alternatives.
3. Required evidence has actually run against the selected mechanism; documentation,
   mocks at the real D1 boundary, planned commands and an agent self-report are insufficient.
4. Cross-gate assumptions and security/atomicity/independence constraints are reconciled.
5. The dev accepts the design/evidence and the parent closure matrix records the result.

Q38 closes FIRST, before any later spike task. Q54's accepted workflow semantics must
precede final Q40/Q47 designs. Q40/Q47/Q46 close at ONE joint human acceptance boundary
in Phase 007 after Q54 workflow input, each with its own ADR/design/evidence. Q54's
final closure also waits for Q67 guarantees; this does not prevent its earlier workflow
input milestone. Q63 recovery/removal input and Q65 restore design, and Q70 plus
Q40/Q66/Q67 interfaces, may iterate as explicitly provisional inputs without cycles.

The formal dependency graph is a task graph, not a graph that requires every referenced
gate to be closed first. No accepted-input milestone authorizes product implementation.
Affected-work classification is unchanged: Q65–Q68 gate their own work and MVP deployment,
not unrelated implementation. This plan's serial scheduling is not a new platform blocker.

### Runtime, browser and cloud proof

- Real D1 proofs use the Workers Vitest pool; conditional-write/concurrency invariants
  are checked against one real batch, never an arbitrary JS transaction assumption.
- Workers invocation-lifetime and adapter/SQL behavior use actual selected dependencies,
  not invented APIs. No direct module bindings, raw SQL outside Drizzle, `any` or
  `export *`. Drizzle-generated migrations need the explicit Q63 execution path.
- Browser/DOM/OPFS checks run in real browser engines with versions recorded. The Q62
  matrix remains evergreen plus the last two Safari/Firefox/Edge. Emulated WebKit is
  useful preliminary evidence, not a claim to have tested real Safari/OPFS. Any owner-run
  device/browser checks are explicit manual evidence tasks; absence blocks closure.
- Multi-location cache/public propagation, remote restore/storage isolation and
  distributed limiter claims require deployment/resource evidence where local tooling
  cannot establish the property. Simulations are labelled as such and supplement,
  never replace, platform-specific required evidence.
- No cloud account/resource/deployment approval is implied. Each resource-using task
  starts by presenting resource names, synthetic-data scope, budget/limits, credentials
  handling, teardown and required owner action. If access is unavailable, report the
  blocker and retain the gate open; do not fabricate traces or accept a weaker guarantee.
- Secrets/PII never enter tracked evidence, fixture data or logs. Existing production
  resources/data are excluded. Erasure evidence records offline replica limitations
  honestly rather than claiming remote wipe of a disconnected device.
- Public LCP < 2.5s and INP < 200ms remain MVP reference-starter targets. Q40/Q47
  must set explicit dashboard/overlay targets. Bounded candidate measurements support
  selection, not a claim that the unbuilt production MVP already meets performance/WCAG.

## Phase index and execution dependencies

Phase files are self-contained design/evidence task specifications. All tasks execute
serially. The numbered phase sequence is:

| Phase | Goal / milestone | Gate state on exit | File |
|---|---|---|---|
| 001 | Inventory capabilities and prove required/optional checks | Q38 CLOSED with dev acceptance; all others open | [phase_001](phases/phase_001.md) |
| 002 | Define workflow semantics, placement/migrations and auth compatibility inputs | Q54 workflow input accepted; Q63 design/evidence provisional pending recovery reconciliation | [phase_002](phases/phase_002.md) |
| 003 | Design coupled composition, contracts, candidate presentations/starter and local-first seams | Q40/Q47/Q46/Q70 input designs accepted, not closed | [phase_003](phases/phase_003.md) |
| 004 | Design/prove durable effects, consistency, security and coordinated recovery | Q65–Q68 design/evidence inputs accepted, final reconciliation pending | [phase_004](phases/phase_004.md) |
| 005 | Prove local SQLite/shared queries, sync/leases/conflicts and replica safety | Q70 evidence complete if all browser/privacy checks pass; still awaiting reconciliation | [phase_005](phases/phase_005.md) |
| 006 | Prove composition/UOW/lifetime, installation and chosen presentation/starter boundaries | Q40/Q47/Q46 evidence complete; selections still require joint closure | [phase_006](phases/phase_006.md) |
| 007 | Reconcile all cross-gate inputs and perform explicit gate closures | All named gates CLOSED; Q40/Q47/Q46 jointly | [phase_007](phases/phase_007.md) |
| 008 | Fold accepted outcomes and audit MVP handoff | Live reference set converged, no product shipped; plan closure ready | [phase_008](phases/phase_008.md) |

Within each phase, tasks depend on the previous task unless the phase file states a
stronger prerequisite. Each phase's final review task produces a sign-off ADR and
recorded real checks; its human phase approval/close remains a separate Orca gate.
The next phase cannot start while the prior phase is active. Closed gates that a proof
change invalidates are reopened explicitly and re-verified, never left marked green.

Phase 007 reconciles in order: Q65 → Q63 → Q66 → Q67 → Q68 → Q70 → Q54 → joint
Q40/Q47/Q46. This is a closure schedule AFTER their proofs, not a claim that Q65 blocks
all preceding foundational design work. Material incompatibility sends the affected
proof/design back for rework; acceptance never forces a failed mechanism through.

## Gate-closure matrix (all outputs planned, no closure yet)

Paths below are allocations for future outputs, not links to nonexistent artifacts.
`Design/evidence/harness slug` expands using the artifact contract above.

| Project gate | Design/evidence/harness slug | One design ADR allocation | Principal tasks / closure | Current state |
|---|---|---|---|---|
| Q38 | q38_capability-inventory | docs/decisions/0003-core-capability-inventory.md | 1.1–1.3; first phase acceptance | Planned |
| Q54 | q54_content-workflows | docs/decisions/0004-content-workflow-semantics.md | 2.1–2.2; 7.7 | Planned |
| Q63 | q63_persistence-migrations | docs/decisions/0005-database-placement-and-migrations.md | 2.3–2.4; 7.2 | Planned |
| Q40 | q40_composition-lifecycle | docs/decisions/0006-composition-installation-and-lifecycle.md | 3.1; 6.1–6.2; joint 7.8 | Planned |
| Q47 | q47_client-host-contracts | docs/decisions/0007-client-wire-host-and-presentation.md | 3.2; 6.3; joint 7.8 | Planned |
| Q46 | q46_public-starter | docs/decisions/0008-public-site-starter.md | 3.3; 6.4; joint 7.8 | Planned |
| Q70 | q70_local-first-sync | docs/decisions/0009-local-first-datastore-and-sync.md | 3.4; 5.1–5.3; 7.6 | Planned |
| Q66 | q66_durable-effects | docs/decisions/0010-durable-effects-and-idempotency.md | 4.1–4.2; 7.3 | Planned |
| Q67 | q67_consistency-preview | docs/decisions/0011-content-consistency-and-preview-isolation.md | 4.3–4.4; 7.4 | Planned |
| Q68 | q68_security-bootstrap | docs/decisions/0012-security-profiles-and-auth-bootstrap.md | 4.5–4.6; 7.5 | Planned |
| Q65 | q65_recovery-erasure | docs/decisions/0013-backup-restore-and-replica-erasure.md | 4.7–4.8; 7.1 | Planned |

A Closed row adds exact design/evidence/ADR references, selected mechanism/version,
dev acceptance, successful verification and dependent reconciliations. Q69 is deliberately
absent: it is not a plan-000 gate. Phase review ADR allocations are 0014–0021, one per
phase, as specified in the phase files; these are review records, not gate closures.

## Decisions & resolutions — settled planning lineage

These are plan-structure decisions, NOT the future design-spike selections.

| Plan understanding question | Agreed resolution | Effect in this draft |
|---|---|---|
| Q1 | Keep 000_spike-plan | Canonical directory and nested same-name plan file |
| Q2 | Retain isolated reproducible proof harnesses under spikes/; no product implementation; cloud separately gated | Evidence scope and non-product/resource boundary |
| Q3 | Separate per-gate design and evidence files, linked from one ADR; parent closure matrix | Artifact contract and allocations |
| Q4 | Include scoped source convergence; preserve historical records; repair status/state now; AGENTS edits separately gated | Phase 008 and repaired planning resume pointers |
| Q5 | Large, serial, fully gated | Phase/task boundaries; no parallel agents or auto-advance |
| Q6 | Accepted design inputs are distinct from final closure | Explicit workflow-input milestone, provisional coupled designs and joint closure |

Understanding validator: six ANSWERED, zero OPEN. The dev explicitly selected
“Proceed to Draft” after validation. This authorizes this draft only; it is not
`/approve-plan`, `/start-plan`, a candidate adoption or a commit gate.

### Decisions left to execution (not unanswered planning assumptions)

All exact mechanisms/quantitative policies owned by the named gates remain spike
outputs: capability policy; package/export layout; ID algorithm and collision rules;
repo/subpackage semver installation/update path; workflow transitions; D1 placement,
ledger/locking/removal; wire/error conventions; dashboard/controller/panel/starter
choices and support commitment; local SQLite implementation/leases/sync protocol
mechanics; backup/retention/restore and erasure mechanics; durable effects;
public-staleness/acknowledgement policy; security/auth/bootstrap/limit parameters.

Each owning task compares candidates against the settled requirements, proposes a
choice to the dev, records approval and tests the actual selected path. No future
executor may turn a historical default or evaluation candidate into a choice silently.
A conflict with a locked decision is surfaced; plan 000 does not authorize reopening it.

## Verification of this planning artifact

Before Discuss/review and after findings are applied:

- `python3 /home/fred/Development/hermes/scripts/validate-understanding.py docs/plans/000_spike-plan/understanding.md` → OPEN 0.
- `python3 /home/fred/Development/hermes/scripts/validate-state.py .project/state.json` → valid, no activation pointers changed.
- `git diff --check` → no whitespace errors.
- Mechanical audit of the plan/phase tree: local Markdown links resolve; all eleven
  in-scope project gates map to design/evidence/ADR/evidence-task/closure; task IDs
  are unique and dependency references resolve with no cycles; every task includes
  exact Create/Modify paths, acceptance and concrete Verification; source paths exist,
  and future output paths are labelled Create rather than falsely claimed present.
- No gate is marked Closed, no task is marked completed and all planning frontmatter
  stays `approved: false` until the matching human approval verb.
- Independent delegated review AFTER Discuss: at most two planning passes, then an
  explicit must/should/defer report and recommendation. No unlimited polishing loop.

Root `pnpm test/lint/typecheck/build` scripts are planned only and do not exist yet.
Do not pretend running them verifies this doc plan. Later harness tasks author and
run their isolated scripts, and phase review runs those actually present.

## Discuss, review and decomposition boundary

Discuss completed: the dev accepted the dependency-led phase structure and settled
Q1–Q6 lineage for independent review, capped at two planning passes. No changes were
requested in Discuss. This is not plan approval or execution authorization. New
plan-scope decisions surfaced later are recorded here and appended to `understanding.md`
where needed; new OPEN questions block redrafting. Review attempt 1 timed out without
a verdict; attempt 2 returned PASS-with-findings (no MUST, two SHOULD clarifications).
The dev authorized and applied those source-preserving clarifications in 3.2/6.3/6.4.
The [review record](planning-review.md) preserves the verdict, limitations and final
edit status; no third pass or commit. The dev subsequently invoked `/approve-plan`,
recording `approved: true` in this plan only. Next: `/extract-phases` reconciles this
existing phase set, then `/extract-tasks` creates checked task files/cards. Approval
is not activation, phase/task approval, resource provisioning or spike execution.

After Discuss and the capped plan review, `/extract-phases` reconciles the already
written phase specifications rather than duplicating them; `/extract-tasks` fans their
Task blocks into `tasks/phase_###/task_<phase.task>.md` loose planned files, stamped
with the actual creating session and `approved: false`. Files are checked first,
then mirrored to the existing Trello board from the framework source templates:
PLAN purple, TASK blue; Agent Review (Spec-compliance, Code-quality) and a self-locating
Manual Review derived from each task's acceptance/verification, created and verified
at birth. No phase cards. Verify labels/list/card/checklist order from live reads.

The board is `https://trello.com/b/4f1jr3Wk/yombanink`. It was verified empty at entry.
At `/approve-plan`, the missing PLAN mirror was created from the canonical template in
To do with `Approved: true` and the purple PLAN label:
https://trello.com/c/hs1xvd2A/1-plan-000-yombanink-spike-plan.
Decomposition must reuse this card, not create a duplicate. TASK cards still require
checked standalone task files first; no task cards or task fan-out were created by
approval. This is not a file-only plan: task board stand-up is the explicit decomposition
handoff. Activation is only via the approved `/start-plan` and `/start-phase` bookends.

## Completion and MVP handoff

Plan 000 is complete only after all named gates genuinely close, scoped live docs
converge, phase reviews/sign-offs complete, evidence is reproducible and final plan
review/sign-off accepts the implementation-ready handoff. Phase 008 produces
`handoff.md` with accepted contracts/choices, proof locations, dependency constraints,
known platform limitations and MVP implementation acceptance mapped to the designs.
It is a handoff, not the MVP implementation plan or a commitment to audited pilot modules.

Q70 product delivery remains required in that later MVP plan; closing its design here
does not satisfy local-first MVP delivery. Likewise, bounded starter/dashboard/host
proofs are not shipped product surfaces. Q65–Q68 designs close here before their
later affected implementations/MVP deployment; implementation must verify its own
real behavior again, not borrow the spike's “passed” marker.

## Task completion summaries

- **1.1 — Inventory server/core/headless capabilities:** shipped `designs/q38_capability-inventory.md`
  (12 capability entries C1–C12, owner/environments/consumers/optionality/missing-behavior/locked-source
  each) + `evidence/q38_capability-inventory.md` (25 requirement rows → check cases, all results
  `NOT YET RUN (task 1.2)`), including the two-axis required/optional policy and Q42/Q70/Q71/Q70-MVP
  coverage. Dev gate decisions recorded: two-axis policy; design tokens NOT a core capability (Q40 owns
  packaging); PII/erasure = REQUIRED guardrail seams (C12); filesystem = one entry, CLI vs Worker
  request-local temp. Task 1.2 consumes C1–C12 + the policy and builds/runs the check harness.
