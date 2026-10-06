---
title: Yomban.ink — plan 000 understanding (design spikes)
created_session: "20261004_213034_2d1c21"
sessions: ["20261004_213034_2d1c21"]
approved: false
---

# Agent's current understanding

This is the plan-scope UNDERSTAND record for `/new-plan`, begun on 2026-10-04.
The directory `000_spike-plan/` is the final name confirmed by the dev in Q1.
The plan and phase specifications have been drafted after zero OPEN validation
and the dev's separate explicit proceed. The dev subsequently approved plan 000 via
`/approve-plan`; no plan, phase or task is active.
Invoking `/new-plan` alone was not treated as drafting approval. Local Q numbers below belong to this plan only; references
to project discovery questions are explicitly labelled.

## Settled pre-fill — sources, not new questions

The dev's opening brief supplies the scope below. Project discovery Q1–Q71,
its two amendments, the nine specifications, and spec-review §9 are settled
inputs to confirm/correct, not a questionnaire to re-run. Project-scope
`understanding.md` is unchanged; only genuinely new plan-scope questions appear
below. Project-structure decisions surfaced later would also need recording in
the project-scope file, with the dev's confirmation.

- Yomban.ink is a modular application platform, not a CMS. Its locked backend,
  build-time composition, module-owned Drizzle schema, prefixed TEXT identities,
  single-D1/batch atomicity and frontend independence are not reopened here.
- Plan 000 is the single design-spike plan through which the named deferred
  design gates close. It ships no product implementation. Each gate requires
  its own ADR in `docs/decisions/`, a concrete design and verification evidence;
  an ADR or a proposed test list alone does not close a gate.
- Foundational scope: project Q38, Q40, Q47, Q54, Q46, Q63 and Q70. Project Q38
  runs FIRST and inventories capabilities/required-versus-optional policy; it
  does not decide packaging or execution. Project Q54 supplies workflow
  semantics before Q40/Q47 close; Q40/Q47 close together and Q46 closes
  alongside them after that workflow input. No starter/dashboard/controller/
  panel technology is selected by the brief or by historical candidate defaults.
- Project Q63 includes concrete placement/migration mechanics and executed
  Better Auth prefixed-TEXT-ID compatibility evidence under the selected
  Drizzle/D1 adapter; failure is surfaced, never bypassed by changing ID policy.
- Project Q70 is additive, reopens no lock, and is an MVP deliverable whose
  DESIGN closes here and whose product IMPLEMENTATION belongs to the later MVP
  plan. Its confirmed SQLite/OPFS, shared Drizzle schema, datastore seam,
  aggregate-root, change-set, advisory lease, field-conflict and working-set
  shape is pre-fill from Amendment 001, not a new technology-selection question.
  Coordinate with Q38/Q40/Q45/Q52/Q54/Q56/Q66/Q67 and privacy scope Q71.
- Affected-work scope: project Q65 backup/retention/coordinated restore and
  erasure/DSR primitives reaching client-local replicas; Q66 durable effects,
  retries and idempotency; Q67 author/public consistency and preview isolation;
  Q68 security profiles, rate limiting and auth bootstrap. Each closes before
  its own affected implementation and MVP deployment, not as a blanket block
  on unrelated implementation. They remain owned inside plan 000.
- Explicitly excluded: project Q69 site purpose/dogfooding, search implementation,
  mobile delivery, additional complete production UI implementations, full pilot
  rebuilds and an MVP event bus. Q54 may record search's future home without
  designing or implementing search. The later MVP plan chooses the pilot-derived
  proving module set; the completed Q42 audit is input, not a new audit task.
- The eventual plan uses `docs/plans/000_<name>/000_<name>.md`, with `phases/`
  and `tasks/`. Decisions & resolutions preserve this file's settled Q&A lineage.
  Planning reviews are delegated, serial and capped at two passes, followed by
  a report to the dev; no automatic commit, activation or spike execution.
  Reviewed, decomposed task files are mirrored to the existing Trello board
  using the Orca templates and real review checklists, not file-only tracking.

## Source map

- [Project understanding](../../discovery/understanding.md): Answer lines govern
  historical Agent defaults; project Q19 is authoritative for sequencing/scope.
- [Amendment 001](../../discovery/understanding-amendments-001.md): additive
  local-first capability and its confirmed shape.
- [Amendment 002](../../discovery/understanding-amendments-002.md): Q70 MVP
  delivery and privacy/erasure reaching client-local data.
- [Specification index](../../specs/000_index.md): sequencing and canonical gate
  table. Focused specifications 001–008 supply the domain requirements.
- [Operations and quality](../../specs/008_operations-and-quality.md): recorded
  next-step sequence and operational evidence requirements.
- [Spec review §9](../../reviews/001_spec-review.md#9-recorded-resolutions-inputs-for-the-spec-fold):
  D1–D5 and Q-A are resolved inputs; earlier findings are dated history.
- [Onboarding log](../../discovery/onboarding.md) and
  [ADR-0002](../../decisions/0002-onboarding-baseline.md): baseline sign-off and
  actual housekeeping disposition.
- [Backlog](../../backlog/yomban-backlog.md): post-MVP scope and resolved
  housekeeping record.

## Entry checks and observed drift

- Branch `main`; latest commit `8c49b58` is the onboarding baseline. Initial git
  status has only the existing untracked `.project/`; no tracked modifications.
- `.project/state.json` validates, with `activePlan`, `currentPhase`, `currentTask`
  and `currentTaskSummary` all null. Activation pointers are untouched.
- The live Trello board is `https://trello.com/b/4f1jr3Wk/yombanink`; its seven
  canonical workflow lists exist and a complete board read contains no cards.
- Project understanding validator: 71 questions, OPEN 0, ANSWERED 59,
  DEFAULTED 0, DEFERRED 12. DEFERRED project design gates are the subject of this
  plan, not OPEN planning questions to re-ask.
- YB-S3 is already resolved: `000_index.md` contains the canonical gate table,
  cited by 002/003/005/006/007/008. YB-D3 is already resolved: 005 uses the house
  title/Status format. YB-D2 is resolved by observation: the prompt file is
  populated (6756 bytes). Do not add duplicate spike or backlog tasks for them.
- `docs/status/yomban-status.md` still reports onboarding in progress and
  board/state stand-up pending; that disagrees with the approved onboarding log,
  the onboarding commit, AGENTS.md and the verified board/state. This drift was
  surfaced to the dev; this loop has not edited that status file or AGENTS.md.

## New plan-scope questions — Group A: identity and proof boundary

### Q1 — What is the final name and canonical directory for plan 000?

- Context: The dev supplied `docs/plans/000_spike-plan/` as a working name and asked to settle it in this loop. The name must distinguish gate-design work from the later MVP implementation plan.
- Agent default: Keep `000_spike-plan`: plan document `docs/plans/000_spike-plan/000_spike-plan.md`, with this understanding file beside it and `phases/` plus `tasks/` below it.
- Answer: The dev confirmed `000_spike-plan`. Canonical plan document: `docs/plans/000_spike-plan/000_spike-plan.md`; this understanding file, `phases/`, `tasks/` and proof harnesses belong under the same plan directory.
[STATUS: ANSWERED]

### Q2 — What executable spike work is allowed without becoming product implementation?

- Context: Gate closure requires actual evidence: real D1 migration/auth/batch checks, browser-only imports and dual-host boundaries, OPFS persistence/sync, fault injection and coordinated restore. A docs-only plan cannot honestly close these gates. The brief prohibits shipping product implementation but does not specify where bounded proof code/dependencies may live.
- Agent default: Permit reproducible, non-product proof harnesses under `spikes/`, with isolated manifests/lockfiles and synthetic data. Do not create root production workspace packages/apps, ship a scaffold/dashboard/starter, or promote proof code into platform implementation. TDD and the applicable repo constraints still apply. Any cloud resources/deployment require a separate explicit task gate; no production data, credentials or deployments are implied.
- Answer: The dev permits isolated, reproducible proof harnesses retained under `spikes/`, with synthetic data and no shipped product implementation. Cloud provisioning/deployment remains separately task-gated. Harnesses are evidence, not production packages or approved product implementation.
[STATUS: ANSWERED]

## New plan-scope questions — Group B: artifact ownership and source convergence

### Q3 — Where do each gate's concrete design and evidence live?

- Context: Each gate needs one ADR plus concrete design plus evidence, but the corpus does not prescribe homes for the latter two. ADRs should reference a reproducible proof without copying its entire design or logs; plan 000 must remain the single gate-closure artifact.
- Agent default: One gate design at `docs/plans/000_spike-plan/designs/qNN_<topic>.md`, one evidence report at `docs/plans/000_spike-plan/evidence/qNN_<topic>.md` with commands, pinned versions, observed results, failures/limits and linked raw outputs; bounded harnesses under `spikes/qNN_<topic>/`. One ADR per gate in `docs/decisions/`, referencing those artifacts. The parent plan records the complete closure matrix and joint Q40/Q47/Q46 sign-off, not a competing gate-definition table. These design/evidence artifacts are produced by future gated spike tasks, not invented while drafting this plan.
- Answer: The dev confirmed separate per-gate design and evidence files within plan 000, linked from each gate's ADR, and a closure matrix in the parent plan. Proof harnesses remain under the plan's `spikes/` directory.
[STATUS: ANSWERED]

### Q4 — Does plan 000 fold accepted spike outcomes into the specifications?

- Context: Closing a gate while focused specs still say its design is deferred would leave contradictory live docs. The historical discovery answers and spec-review findings should not be overwritten to pretend the spikes were already complete. The current status doc also has the surfaced onboarding drift; AGENTS.md is protected and needs explicit approval before edits.
- Agent default: Include narrowly scoped source-convergence tasks in plan 000 after gate acceptance: fold accepted outcomes and closure links into the canonical index/focused specs and relevant guardrails/quickstart, preserve historical discovery/review records, and refresh status plus the explicitly gated AGENTS.md pointers. During this understanding loop, repair only the stale status summary and refresh the current session resume id; leave activation pointers null and leave AGENTS.md unchanged until an explicit approved milestone update. Do not reopen resolved housekeeping or write a production quickstart before implementation exists.
- Answer: The dev confirmed scoped spec/guardrail convergence after accepted spike outcomes while preserving historical discovery/review records, and authorized repairing the stale status summary plus current session resume id now. Activation pointers remain null; AGENTS.md edits remain separately approval-gated. The status/state repair has been applied; no spec or guardrail outcome is invented during planning.
[STATUS: ANSWERED]

## New plan-scope questions — Group C: orchestration and dependency boundaries

### Q5 — What Orca dial applies to this multi-gate design plan?

- Context: The shared core requires the dev to confirm the dial. This plan spans foundational and affected-work designs with executable evidence, human design selections, per-gate ADRs and source convergence; it cannot be a SMALL three-line task.
- Agent default: Large scope, with dependency-led phases and bounded tasks, but serial fresh subagents only. Every phase has its own review/sign-off boundary; task approval/commit gates remain explicit. Large does not authorize parallel work, automatic execution or reduced review/verification.
- Answer: The dev confirmed Large scope, serial and fully gated, with dependency-led phases, bounded tasks, phase reviews and serial fresh subagents only. No parallel execution or automatic lifecycle advancement is authorized.
[STATUS: ANSWERED]

### Q6 — May workflow input acceptance precede formal gate closure where designs are coupled?

- Context: Project Q19 requires Q54 workflow input before the joint Q40/Q47/Q46 closure; Q54 also consumes Q67 consistency/preview guarantees (005 §6.2), Q70 coordinates with composition/effects/consistency, and Q63 coordinates with Q65 recovery. Treating every cross-reference as a final-closure dependency would create cycles; treating provisional designs as closed would falsely unblock implementation.
- Agent default: Explicitly separate accepted design inputs from final closure. Q38 closes first. Q54 supplies accepted workflow semantics before final Q40/Q47/Q46 closure; Q63/Q70 and affected-work design inputs feed the relevant proofs, and still-provisional contracts are labelled as such. Split coupled spikes into bounded design, evidence and reconciliation tasks where necessary; no gate is closed until its ADR, concrete design, required observed evidence and dev acceptance are complete. Q40/Q47/Q46 close in one joint acceptance boundary; cross-gate reconciliation precedes the final plan-wide closure audit. Candidate mechanisms/quantitative policies are settled by future spike tasks, not selected while planning.
- Answer: The dev confirmed separating accepted design inputs from final gate closure. Coupled spikes may use explicitly provisional, accepted inputs without falsely closing their supplying gate. Closure still requires the complete ADR, concrete design, observed verification evidence and dev acceptance; Q38 closes first, and Q40/Q47/Q46 close jointly after Q54 supplies workflow input. The draft must make the dependency graph and reconciliation/closure boundaries explicit.
[STATUS: ANSWERED]

## Loop state

Groups A–C are answered: six new plan-scope questions, none intentionally deferred.
No further plan-scope ambiguity is currently identified. The plan draft and eight phase
specifications now exist, with 44 planned Task blocks. The approved PLAN card was
created at `/approve-plan`; standalone task files, TASK cards and spike ADRs do not
exist yet, and no design gate is claimed closed.
The framework validator reported six ANSWERED / zero OPEN, and the dev then
explicitly selected "Proceed to Draft" in a separate gate. Drafting is authorized;
plan approval, activation, spike execution and commits are not. The dev subsequently
accepted the draft's phase structure and Q1–Q6 lineage for independent review, capped
at two planning passes, with no Discuss changes requested. Attempt 1 timed out without
a verdict; attempt 2 returned PASS-with-findings. The dev explicitly authorized the
source-preserving Q47/candidate-evidence clarifications, now applied; no new design
choice or plan-scope question was introduced. The review cap is exhausted; no third
pass, approval, activation or commit was implied by that review. The dev subsequently
invoked `/approve-plan` (session `20261004_221017_9e0945`): the PLAN file alone is now
approved, mirrored to its PLAN card in To do. This understanding file's own approval
flag is unchanged; phases/tasks remain unapproved and no activation or commit occurred.
Next: `/extract-phases`, then `/extract-tasks`.
