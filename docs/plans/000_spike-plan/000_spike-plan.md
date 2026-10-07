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

| Item                                                             | Disposition                                                                                                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product implementation                                           | Later MVP plan: no root production workspace, platform packages, shipped CLI/scaffold, production starter/dashboard/panel or operational rollout here |
| Q69 website purpose/dogfooding                                   | Existing backlog; future post-MVP website plan; no influence on starter/contracts/release                                                             |
| Search                                                           | Post-MVP; Q54 records only its future home, no API/index/UI design                                                                                    |
| Mobile/Capacitor delivery; extra production renderers            | Existing post-MVP backlog; no implementation or browser-proof substitution with a native wrapper                                                      |
| Full pilot rebuilds/new pilot audit                              | Q42 is completed input; future MVP plan selects proving modules; full rebuilds follow MVP                                                             |
| Event bus, CRDT/realtime coordination, query-builder abstraction | Not MVP mechanisms; Q70 is additive, same SQLite dialect and Drizzle, poll-based sync                                                                 |
| Per-project legal/privacy policy                                 | Consumer owns lawful basis, consent, DSR timelines and retention policy; platform designs its primitives and limitations                              |
| Re-splitting consolidated foundations ADR                        | Not needed to close these gates; retain ADR-0001 and its accepted decisions                                                                           |
| YB-S3/YB-D2/YB-D3 housekeeping                                   | Already resolved in live files/onboarding; no duplicate spike or backlog work                                                                         |

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

| Phase | Goal / milestone                                                                             | Gate state on exit                                                                           | File                             |
| ----- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------- |
| 001   | Inventory capabilities and prove required/optional checks                                    | Q38 CLOSED with dev acceptance; all others open                                              | [phase_001](phases/phase_001.md) |
| 002   | Define workflow semantics, placement/migrations and auth compatibility inputs                | Q54 workflow input accepted; Q63 design/evidence provisional pending recovery reconciliation | [phase_002](phases/phase_002.md) |
| 003   | Design coupled composition, contracts, candidate presentations/starter and local-first seams | Q40/Q47/Q46/Q70 input designs accepted, not closed                                           | [phase_003](phases/phase_003.md) |
| 004   | Design/prove durable effects, consistency, security and coordinated recovery                 | Q65–Q68 design/evidence inputs accepted, final reconciliation pending                        | [phase_004](phases/phase_004.md) |
| 005   | Prove local SQLite/shared queries, sync/leases/conflicts and replica safety                  | Q70 evidence complete if all browser/privacy checks pass; still awaiting reconciliation      | [phase_005](phases/phase_005.md) |
| 006   | Prove composition/UOW/lifetime, installation and chosen presentation/starter boundaries      | Q40/Q47/Q46 evidence complete; selections still require joint closure                        | [phase_006](phases/phase_006.md) |
| 007   | Reconcile all cross-gate inputs and perform explicit gate closures                           | All named gates CLOSED; Q40/Q47/Q46 jointly                                                  | [phase_007](phases/phase_007.md) |
| 008   | Fold accepted outcomes and audit MVP handoff                                                 | Live reference set converged, no product shipped; plan closure ready                         | [phase_008](phases/phase_008.md) |

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

| Project gate | Design/evidence/harness slug | One design ADR allocation                                        | Principal tasks / closure       | Current state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | ---------------------------- | ---------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q38          | q38_capability-inventory     | docs/decisions/0003-core-capability-inventory.md                 | 1.1–1.3; first phase acceptance | **Closed** (2026-10-05, task 1.3) — design [designs/q38_capability-inventory.md](designs/q38_capability-inventory.md) (§1–§7 inventory/policy accepted; §9 acceptance note); evidence [evidence/q38_capability-inventory.md](evidence/q38_capability-inventory.md) (§4a task-1.2 run; §4b task-1.3 acceptance re-run); ADR [docs/decisions/0003-core-capability-inventory.md](../../decisions/0003-core-capability-inventory.md). Selected mechanism/version: framework-free capability manifest/check harness (`validateModule(manifest, platform)`) at repo-root `spikes/q38_capability-inventory/` — Node v26.8.1, pnpm 12.6.0, TypeScript 5.9.2, Vitest 3.2.4, @biomejs/biome 2.1.4 (versions as observed in the §4b re-run). Dev acceptance: explicit at the task-1.1 dev gate (inventory/policy) and the task-1.3 claim gate ("confirmed…please continue"). Successful verification: the five harness commands re-run from repo root in the acceptance session, each exit 0, `Tests 7 passed (7)` — a failed check would have blocked closure. Dependent reconciliations: none outstanding at closure; recorded scope limits (cross-module C9 collision, dependency cycles, repo-wide scans, real D1/OPFS surfaces) belong to their owning gates (Q35/Q45/Q63/Q70) and are carried in ADR-0003. |
| Q54          | q54_content-workflows        | docs/decisions/0004-content-workflow-semantics.md                | 2.1–2.2; 7.7                    | Input ACCEPTED (2026-10-05, task 2.1) — design [designs/q54_content-workflows.md](designs/q54_content-workflows.md) (field kinds/state machine/history/revision checks/save semantics/preview/DOM-host/lock stance); evidence [evidence/q54_content-workflows.md](evidence/q54_content-workflows.md) (§3 dev workflow-INPUT acceptance ACCEPTED; §4 unexecuted checks = task 2.2); ADR-0004 Proposed, not closed. Gate NOT Closed — Q54 gate closure waits for this ADR's acceptance plus the Q67 guarantees (task 7.7); workflow/evidence proof ran green (2026-10-06, 21/21 tests).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Q63          | q63_persistence-migrations   | docs/decisions/0005-database-placement-and-migrations.md         | 2.3–2.4; 7.2                    | Design DELIVERED (2026-10-06, task 2.3) — design [designs/q63_persistence-migrations.md](designs/q63_persistence-migrations.md) (§2 shared-single-D1 placement dev-accepted; §§3–12 namespace/topological ordering/ledger/lock+fencing/retry/data-vs-schema/Drizzle-SQL path/Better-Auth base schema/removal/upgrade; §15 requirement matrix (a)–(l)); evidence [evidence/q63_persistence-migrations.md](evidence/q63_persistence-migrations.md) (§2 dev-accepted placement input; §4 nine UNVERIFIED items = task 2.4); ADR-0005 Proposed, not accepted. Gate NOT Closed — proof ran green (2026-10-06, 14/14 tests incl. Better Auth 1.3.27 prefixed TEXT IDs on stored rows); closure is 7.2 (Q65/Q40 reconciliation).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Q40          | q40_composition-lifecycle    | docs/decisions/0006-composition-installation-and-lifecycle.md    | 3.1; 6.1–6.2; joint 7.8         | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q47          | q47_client-host-contracts    | docs/decisions/0007-client-wire-host-and-presentation.md         | 3.2; 6.3; joint 7.8             | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q46          | q46_public-starter           | docs/decisions/0008-public-site-starter.md                       | 3.3; 6.4; joint 7.8             | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q70          | q70_local-first-sync         | docs/decisions/0009-local-first-datastore-and-sync.md            | 3.4; 5.1–5.3; 7.6               | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q66          | q66_durable-effects          | docs/decisions/0010-durable-effects-and-idempotency.md           | 4.1–4.2; 7.3                    | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q67          | q67_consistency-preview      | docs/decisions/0011-content-consistency-and-preview-isolation.md | 4.3–4.4; 7.4                    | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q68          | q68_security-bootstrap       | docs/decisions/0012-security-profiles-and-auth-bootstrap.md      | 4.5–4.6; 7.5                    | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q65          | q65_recovery-erasure         | docs/decisions/0013-backup-restore-and-replica-erasure.md        | 4.7–4.8; 7.1                    | Planned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

A Closed row adds exact design/evidence/ADR references, selected mechanism/version,
dev acceptance, successful verification and dependent reconciliations. Q69 is deliberately
absent: it is not a plan-000 gate. Phase review ADR allocations are 0014–0021, one per
phase, as specified in the phase files; these are review records, not gate closures.

## Decisions & resolutions — settled planning lineage

These are plan-structure decisions, NOT the future design-spike selections.

| Plan understanding question | Agreed resolution                                                                                                      | Effect in this draft                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Q1                          | Keep 000_spike-plan                                                                                                    | Canonical directory and nested same-name plan file                               |
| Q2                          | Retain isolated reproducible proof harnesses under spikes/; no product implementation; cloud separately gated          | Evidence scope and non-product/resource boundary                                 |
| Q3                          | Separate per-gate design and evidence files, linked from one ADR; parent closure matrix                                | Artifact contract and allocations                                                |
| Q4                          | Include scoped source convergence; preserve historical records; repair status/state now; AGENTS edits separately gated | Phase 008 and repaired planning resume pointers                                  |
| Q5                          | Large, serial, fully gated                                                                                             | Phase/task boundaries; no parallel agents or auto-advance                        |
| Q6                          | Accepted design inputs are distinct from final closure                                                                 | Explicit workflow-input milestone, provisional coupled designs and joint closure |

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

- **3.4 — Design local-first datastore and sync mechanics:** shipped
  `designs/q70_local-first-sync.md` (19 sections: `@sqlite.org/sqlite-wasm` sahpool driver +
  drizzle `sqlite-proxy` seam — same `sqliteTable`, no schema fork; two sandboxed sahpool
  instances for Class 1/2 physical separation; per-session worker lifecycle; aggregate
  roots + multi-root action boundaries; one local transaction (data + change-row) with
  WAL+exclusive-locking (atomicity NOT dependent on WAL; downgrade = dev reconciliation);
  change-set envelope (`change_set_id` = Amendment 001 §B §4's `group_id`) → one D1 batch
  with server-derived writes, fail-stop + rejected bucket; per-field base/rev three-way
  conflicts; 120 s/40 s server-clock advisory leases, no-steal/same-user takeover/offline
  provisional, remote-status not publish state; Class 1/2/3 server-authoritative working
  sets; poll-on-focus/30 s-visible/reconnect transport; per-leased-record remote-apply
  pause; current+N-1 payloads, too-old → read-only/export; one-way local migration with
  snapshot; 30-day+all-replica-ACK tombstone GC + explicit purge; Q65/Q66/Q67 couplings;
  §16 spike-owned policy table (PROPOSED values); Amendment 001 §§1–8 + 002 proof-case
  matrix) + `evidence/q70_local-first-sync.md` (executed 2026-10-07: sqlite-wasm
  3.53.4-build2 tarball/registry + Safari floor opfs ≥17/sahpool 16.4+; drizzle-orm 0.45.3
  sqlite-proxy API from published .d.ts; 8 checks NOT run + conditional blockers recorded —
  no silent in-memory fallback) + ADR
  [docs/decisions/0009-local-first-datastore-and-sync.md](../../decisions/0009-local-first-datastore-and-sync.md)
  (Proposed; 11 decisions incl. sahpool-default/single-connection/Web-Locks tab ownership,
  WAL-optional, poll-only transport). Reviews: spec + quality passes to zero (findings
  fixed: §8.x citation scheme → topic-keyed, WAL downgrade → dev reconciliation,
  group_id reconciliation, ChangeOp deferral to 5.1/Q66, terminology normalization;
  bounded re-reviews all PASS, no new defects). Retro: one orca lesson surfaced
  (source-citation numbering must be verified, invented schemes attributed) → proposal
  034 to the orca codebase. Unblocks task 3.5 (phase review).

- **3.3 — Evaluate public-site starter and bounded support:** shipped
  `designs/q46_public-starter.md` (hard filters → bounded two-candidate shortlist →
  comparison matrix → selection proposal → bounded-support commitment table: supported
  versions Astro 7.x only with the adapter peer range as authority, Q47-consumption-only
  interface, generated-then-project-owned `apps/web`, Astro majors = consumer
  responsibility, explicit exclusions; Q70 consumption duties §7) +
  `evidence/q46_public-starter.md` (source-backed candidate matrix, 14 primary sources
  verified 2026-10-07; Astro SEO claim marked UNVERIFIED-BY-PRIMARY-DOC, assigned to 6.4;
  budgets recorded as targets) + ADR
  [docs/decisions/0008-public-site-starter.md](../../decisions/0008-public-site-starter.md)
  (Proposed; selection **Astro 7.x + `@astrojs/cloudflare`** over Next.js/OpenNext —
  no Node-runtime emulation layer, 1:1 fit to the Q47 pages+islands contract model;
  SvelteKit stays superseded, Hono/htmx not adopted for any public role, fixtures
  proof-only, one starter, no Q69 influence). Dev accepted the shortlist/selection at the
  2026-10-07 gate (Manual Review green); pure-app/minimal-public-surface consumption
  deferred to backlog item 8. Adoption awaits task 6.4 proof + joint 7.8 closure.
  Reviews: two passes to zero (spec + quality; findings fixed, bounded re-review PASS,
  no new defects). Retro: no new project ADR; one backlog observation (two same-named
  understanding-amendments-001 files — dev-directed). Unblocks task 6.4 (phase-006
  starter proof).
- **3.2 — Design client/wire/host/presentation contracts:** shipped
  `designs/q47_client-host-contracts.md` (17 sections: mapped public DTO/runtime schemas
  with validation in/out + serialization/route/error envelope; typed module-source client
  PRIMARY — codegen/tRPC inference/OpenAPI generation rejected as primary; headless
  DOM-API-free vs DOM vs presentation exports; host notification/lifecycle contracts;
  public API + optional HTML invoke the SAME domain/authorization ops, HTML in-process;
  renderer-neutral standard-admin descriptions vs explicit implementation-specific custom
  views; host owns content DOM/config, panel mutates only its own DOM; editing-lifecycle
  needs rich-text/drag-drop/crop/repeater/media/progress; unsaved state + local
  sync/conflict surfacing; session-expiry/422/private history-cache isolation; Q47 fixture
  per review §9 D2 (one page/list + edit-one + publish-action, no routing/SSR/
  server-action/server-runtime; both hosts on unchanged services/contracts); THREE
  separate candidate comparisons — dashboard Hono/htmx vs TS-controller/htmx-panel vs
  alternatives, no selection adopted; conditional htmx security checks designed WITHOUT
  adopting htmx (HX-Request never authorization, sanitize, hx-disable, no unneeded
  evaluation, 422/expiry, history isolation); perf targets dashboard LCP ≤3.0s/INP ≤200ms
  + overlay first-edit ≤1.0s/save-ack ≤100ms pending final dev adoption; WCAG 2.1 AA,
  CSP, browser matrix; non-decisions + requirement matrix) + `evidence/q47_client-host-contracts.md`
  (§2 traceability table; §3 seven items pending dev acceptance — candidate positions,
  perf-target finalization, wire shapes, host verb model, headless DOM-API-free
  strengthening, standard-admin mechanism; §4 eight checks NOT run with owners: fixture =
  Q47-defined/Q61-executed/Q7-gated, boundary lint = phase-006) + ADR
  [docs/decisions/0007-client-wire-host-and-presentation.md](../../decisions/0007-client-wire-host-and-presentation.md)
  (Proposed; 14 decisions with starred open items; 11 rejected alternatives). Reviews: two
  passes to zero (spec + quality; findings fixed and bounded re-reviews PASS — dev worked
  the Manual Review items green by hand). Retro: no project ADR; one orca amendment
  proposal (032, orca repo retros — sibling-derived-evidence single-dispatch boundary).
  Unblocks task 3.3 (Q46).
- **2.3 — Design placement, migration runner and auth integration:** shipped `designs/q63_persistence-migrations.md`
- **3.1 — Design composition, installation and invocation lifecycle:** shipped
  `designs/q40_composition-lifecycle.md` (19 sections + requirement matrix: export
  classes server-only/headless/server-safe/browser/DOM/presentation + optional manifest
  facets; per-side core as framework-free `core-server`/`contracts`/`clients` packages
  resolving Q9's open sub-question; composition roots import core+modules, core imports
  no features; packaging = static workspace packages + ONE Worker per consumer hosting
  all server roles; route/SSR/auth-handler ownership with in-process session on SSR and
  `bearer()` for token reads; per-environment trusted-origin registry + CSRF on
  cookie-authenticated mutations; immutable build metadata vs per-invocation env/user/
  session/UOW/trace context — no binding I/O at init, no stale cached binding clients;
  sink completion via waitUntil + redaction on success AND failure; UOW participation =
  services get `contribute(op)` on ONE D1 batch, no independent commit on the handle; ID
  algorithm `prefix_` + monotonic Crockford-base32 ULID-style with client ids final at
  creation; enum/permission build-time aggregation into a derived artifact; install =
  `workspace:^` in-workspace + git-URL/tag-semver out-of-repo (SHAPE accepted, syntax
  UNVERIFIED pending the phase-006 probe), generated-vs-installed ownership table,
  non-destructive updates; deterministic AI-orientation artifacts + AI-fill must pass
  conformance; `upgrade` (contract majors + codemods) distinct from `migrate` (explicit
  golden-path step, deploy never silently migrates); Q70 browser store per-session,
  outside server UOW; provisional Q66/Q67/Q68 seams named; dashboard LCP ≤3.0s/INP
  ≤200ms + overlay first-edit ≤1.0s/save-ack ≤100ms PROPOSALS forwarded to Q47) +
  `evidence/q40_composition-lifecycle.md` (§2 traceability table; §3 dev acceptance
  ACCEPTED in-conversation 2026-10-06 for all 7 provisional items — install-specifier
  acceptance CONDITIONAL: shape accepted, syntax stays UNVERIFIED; §4 seven checks NOT
  run with owners assigned to phase-006/Q47/Q68) + ADR
  [docs/decisions/0006-composition-installation-and-lifecycle.md](../../decisions/0006-composition-installation-and-lifecycle.md)
  (Proposed; 11 rejected alternatives; full acceptance waits phase-006 proofs + joint
  7.8 closure). Reviews: two passes to zero (spec: 2 should locator fixes + bounded
  re-review PASS; quality: 1 should + 1 defer fixed + bounded re-review PASS, zero new
  findings). No new ADR from the retro — no amendment proposed. Unblocks task 3.2 (Q47).
- **2.3 — Design placement, migration runner and auth integration:** shipped `designs/q63_persistence-migrations.md`
  (15 sections: shared-single-D1 placement comparison with dev-accepted selection; `core_`-reserved
  per-module `<ns>_<entity>` namespace with conformance-time collision rejection; topological ordering
  by the Q36 manifest graph; `core__migrations` ledger batch-committed with its step; `core__migration_lock`
  TTL-lease + fencing token; step-granularity retry/resume; declared data-vs-schema migration kinds with
  chunked idempotent data migrations; drizzle-kit-generate-only artifacts executed via the core runner;
  Better Auth core-owned base schema with required prefixed-TEXT-ID compatibility check (failure blocks
  auth work); removal retaining data by default; empty/existing-version upgrade behaviour; provisional
  Q65 recovery requirements; §15 requirement matrix mapping bullets (a)–(l)) +
  `evidence/q63_persistence-migrations.md` (§2 dev-accepted shared-D1 placement input, 2026-10-06;
  §4 nine UNVERIFIED items explicitly assigned to task 2.4's real-D1 harness — no unexecuted check
  asserted as run) + ADR [docs/decisions/0005-database-placement-and-migrations.md](../../decisions/0005-database-placement-and-migrations.md)
  (Proposed; 12 decisions, 11 rejected alternatives). Q63 still provisional — proof is task 2.4,
  closure is phase-007 task 7.2. Reviews: two passes to zero (spec: 2 should fixed, bounded re-review
  PASS; quality: 1 must + 3 should fixed, bounded re-review PASS; 2 defers recorded).
- **2.4 — Prove migrations and Better Auth prefixed TEXT IDs:** shipped the real-D1 spike
  harness `spikes/q63_persistence-migrations/` (location per ADR-0015; repo-root `spikes/`
  convention, task/phase Files reconciled at claim) — a migration-runner candidate
  (`src/proof.ts`) with a `core__migrations` ledger + `core__migration_lock` TTL-lease/fencing
  proving per-step batch atomicity, empty/existing-version runs, collision/dependency ordering,
  replay/retry after injected failure with safe ledger state, concurrent-deploy exclusion,
  schema-vs-data chunked upgrades and module removal retaining data (10 tests); plus Better Auth
  1.3.27 over its drizzleAdapter on real D1 executing real sign-up/sign-in/session flows with
  stored-row + sqlite_master inspection proving the PROVISIONAL core-seam ID scheme
  (`usr_/ses_/acct_/vrf_` + sortable base32 material, pending Q40) on every entity and FK —
  no INTEGER PK, no unprefixed fallback (4 tests). 14/14 TDD tests; all five verification
  commands exit 0 (drizzle-kit generate → `migrations/0000_luxuriant_virginia_dare.sql` + `meta/`).
  Design §9 amended with three adapter findings (model-name schema keying, `timestamp` mode for
  Date objects, `bearer()` for token session reads); evidence §6 records observed outputs
  (gate table, versions, stored IDs); design §15 + evidence §4 mark §4 items 1–8 PROVEN,
  item 9 (batch-size calibration) to phase 7. Q63 stays provisional — closure is 7.2.
  Reviews: two passes to zero (spec: 2 should fixed, bounded re-review all-PASS/no-new-defects;
  quality: 4 should fixed, same). No new ADR — ADR-0005 stays Proposed pending 7.2.
- **2.1 — Design content workflow semantics:** shipped `designs/q54_content-workflows.md`
  (field kinds text/rich text/media/relation/repeater with stored types inferred from module
  Drizzle schema; draft/review/published/scheduled state machine with legal/illegal tables —
  review required, drafts have no revisions, failed publish = failed-attempt event not a
  revision; server-side stale-revision rejection; deliberate + ~1–2s debounced saves;
  permission-gated cache-isolated preview needs; DOM entity/field refs with host DOM
  ownership; lock eligibility decoupled from publish state, offline edits provisional;
  Q66/Q67 named-required without mechanism; post-MVP search home) +
  `evidence/q54_content-workflows.md` (traceability matrix to 005 §§6/8 R1–R11, Q42/Q54/Q58,
  Amendment 001; §3 dev workflow-INPUT acceptance ACCEPTED at the approve gate; §4 unexecuted
  checks = task 2.2) + ADR [docs/decisions/0004-content-workflow-semantics.md](../../decisions/0004-content-workflow-semantics.md)
- **2.2 — Prove workflow transitions and optimistic saves:** shipped the real-D1 spike
  harness `spikes/q54_content-workflows/` (location per ADR-0015, dev-decided at claim;
  repo-root `spikes/` convention) — Drizzle fixture schema (aggregate-root records with
  prefixed TEXT ids, append-only revisions + history events, media fixture records), a
  WorkflowEngine proving designs §§2–9 (all five field kinds, legal/illegal transitions,
  scheduled + post-publish revision history, failed-publish-as-EVENT, atomic conditional-UPDATE
  optimistic saves, truthful acknowledgement, permission-gated preview, media/relation
  ownership) — 21 TDD tests passing against real D1 via vitest-pool-workers 0.8.19 +
  vitest 3.1.4 (inside vpw's supported range; corrected at review), drizzle-kit-generated
  fixture migrations (`migrations/0000_wise_unicorn.sql` + `meta/`); all five verification
  commands exit 0 from repo root (Node 26.8.1, pnpm 12.6.0, TS 5.9.2). Design §14 conformance
  note + evidence §5 execution record (observed outputs, TDD RED-first, location + vpw-version
  deviations logged). Reviews: spec pass PASS→fixed→re-review PASS; code-quality PASS→7 fixes
  →re-review PASS, no new defects. Q54 workflow INPUT accepted and now exercised by tests;
  Q63 still provisional pending 2.3/2.4. Created ADR
  [docs/decisions/0015-spike-harness-location.md](../../decisions/0015-spike-harness-location.md).
  (Proposed, not closed). Review: two passes to zero (spec: 2 should fixed + 2 defer recorded,
  bounded re-review PASS; quality: 3 should + 2 defer fixed, bounded re-review PASS).
  Q54 INPUT accepted; Q40/Q47 may consume it; the GATE itself closes at task 2.2/7.7.
- **1.1 — Inventory server/core/headless capabilities:** shipped `designs/q38_capability-inventory.md`
  (12 capability entries C1–C12, owner/environments/consumers/optionality/missing-behavior/locked-source
  each) + `evidence/q38_capability-inventory.md` (25 requirement rows → check cases, all results
  `NOT YET RUN (task 1.2)`), including the two-axis required/optional policy and Q42/Q70/Q71/Q70-MVP
  coverage. Dev gate decisions recorded: two-axis policy; design tokens NOT a core capability (Q40 owns
  packaging); PII/erasure = REQUIRED guardrail seams (C12); filesystem = one entry, CLI vs Worker
  request-local temp. Task 1.2 consumes C1–C12 + the policy and builds/runs the check harness.
- **1.2 — Prove capability checks and feature independence:** shipped `spikes/q38_capability-inventory/`
  (relocated from the spec'd `spikes/` path by dev decision — live pointers in
  evidence/design/README reconciled): framework-free TS harness with public `validateModule(manifest, platform)`
  entry, 7 Vitest tests (TDD RED→GREEN) covering R14.1–R14.6 plus an empty-facet malformed-manifest hardening
  case; REQUIRED-missing → fail naming the capability, OPTIONAL-missing → explicit degrade, wrong facet →
  explicit mismatch, undeclared usage/dependency → conformance failure, built-in/custom parity. All five
  verification commands exit 0 (Node 26.8.1, pnpm 12.6.0, TS 5.9.2, Vitest 3.2.4, Biome 2.1.4); evidence §2
  result cells + §4a populated with observed outputs, including scope limits for task 1.3 (no cross-module C9
  prefix-collision check, no dependency-cycle detection, per-module validation only). Review: spec + quality
  passes to zero with bounded re-review (PASS, no new defects).
- **1.3 — Accept Q38 and record first gate closure:** acceptance re-run of all five harness commands from
  repo root (each exit 0, `Tests 7 passed (7)`; Node 26.8.1, pnpm 12.6.0, TS 5.9.2, Vitest 3.2.4, Biome 2.1.4)
  recorded in evidence §4b with required-vs-optional reconciliation and explicit dev acceptance; created
  `docs/decisions/0003-core-capability-inventory.md` (C1–C12 + policy, six rejected alternatives, scope
  limits, non-decisions); design §9 acceptance note; parent closure matrix: **Q38 → Closed** (first and only
  Closed gate; all others Planned). Review: two passes to zero (2 should fixed + bounded re-review PASS,
  2 defer recorded: stale task-file Verification paths → phase-review reconciliation; commit-tag drift).
  Q35 verification, Q25/Q30, Q37 unblocked per the canonical gate table.
- **2.5 — Phase review and input/closure sign-off:** independent review re-ran both phase
  harnesses and the phase-001 prerequisite harness from repo root — all fifteen commands
  exit 0 (q54: 21/21 tests; q63: 14/14; q38: 7/7; observed versions match evidence —
  vitest 3.1.4, vpw 0.8.19, better-auth 1.3.27, TS 5.9.2, Biome 2.1.4, Node/pnpm runtime),
  plus the validators (OPEN 0 / state OK) and clean `git diff --check`. Q54 PASS
  (workflow INPUT accepted, evidence separates acceptance from unexecuted checks, 21
  real-D1 tests reproduce); Q63 PASS (provisional proof intact with the pending-Q40 ID
  scheme flagged and batch-size calibration deferred to 7.2; gates NOT Closed anywhere).
  Verdict: **PASS-with-findings, no MUST** — SHOULD: review-ADR allocation 0015 was
  consumed by ADR-0015 (harness location), review recorded as ADR-0016; ADR-0004 status
  line cites stale "PENDING" acceptance; parent closure-matrix Q54/Q63 rows predate the
  green 2.2/2.4 runs. DEFER: D1 batch-size calibration (7.2), task-file path drift.
  Blocked owner/browser/cloud checks: none — N/A. Created
  [docs/decisions/0016-spike-phase-002-review.md](../../decisions/0016-spike-phase-002-review.md)
  (process acceptance; references ADR-0004/0005, no design selection). Close-out edits
  uncommitted; dev phase approval/close is the next Orca verb.
- **1.4 — Phase review and input/closure sign-off:** independent review re-ran all five harness
  commands from repo root — each exit 0 (`Tests 7 passed (7)`, Vitest 3.2.4; Node 26.8.1,
  pnpm 12.6.0, TS 5.9.2, Biome 2.1.4) — plus the understanding/state validators (OPEN 0 /
  state OK) and `git diff --check` (clean). Evidence inspected against acceptance: Q38 stands
  as the first and only Closed gate, all others Planned; dev acceptance explicit; sanitized
  evidence matches §4a/§4b. Verdict: **PASS-with-findings, no MUST** — SHOULD: harness-path
  drift (spec strings name `spikes/…`, live harness is repo-root
  `spikes/q38_capability-inventory/`) flagged for later reconciliation; SHOULD: scope limits
  (cross-module C9 collision, cycles, real D1/OPFS, repo-wide sweeps) carried per ADR-0003;
  DEFER: bespoke Q42 R15 fixtures, commit-tag drift. Blocked owner/browser/cloud checks: none
  in this phase — **N/A**. Created phase review ADR
  [docs/decisions/0014-spike-phase-001-review.md](../../decisions/0014-spike-phase-001-review.md)
  (process acceptance only; no design selection). Close-out edits left uncommitted; dev phase
  approval/close is the next Orca verb.