---
title: "Q47 — client/wire/host/presentation contracts (evidence: traceability, dev inputs, unverified items)"
created_session: "20261006_212010_4c6797"
sessions: ["20261006_212010_4c6797"]
approved: false
---

# Q47 — Evidence report (task 3.2) — design traceability, dev inputs, unverified items

> This is the **Q47 evidence report for task 3.2**
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.2.md`). It records
> (a) what the task produced, (b) the design choices and their sources, (c) the **dev
> acceptance recorded 2026-10-07** (§3 — provisional items accepted in conversation;
> per-role selection still open), and (d) the **checks NOT run** — enumerated and
> assigned to their later proof tasks. It maintains the two SEPARATE sections required of a
> doc-only design task's evidence report: the recorded dev acceptance first, then the
> not-run checks — neither reads as executed.
>
> **Nothing in this report asserts an unexecuted check as run.** No two-host fixture, no
> boundary-lint proof, no htmx evaluation probe and no performance measurement exists; none
> is claimed to pass. Any observed output in this report would be a fabrication — there is
> none, deliberately. ADR-0007 is **Proposed, not accepted**; Q47 final acceptance waits for
> the phase-006/Q61-executed two-host fixture (Q47-defined, Q61-executed, Q7-discharged per
> the canonical gate table / review §9 D2) and the joint Q40/Q47/Q46 closure
> (phase-007 task 7.8; task files fan out later).

## 1. What was produced

Exactly three documentation files, matching the task card's Files list — in the AUTHORING
session (`20261006_212010_4c6797`) no other file was created or modified, no code was
written, no packages installed, no commands executed. (Subsequently, in session
`20261007_104930_b7edfe`, the dev acceptance was recorded in §3 below, the ADR's status
annotations were updated, and the plan-understanding amendment 001 was created — see §3.)

1. **`docs/plans/000_spike-plan/designs/q47_client-host-contracts.md`** — the provisional
   client/wire/host/presentation design: public DTO/runtime schemas + validation in/out
   (§2), serialization/route/error conventions (§2.3), typed module-source client with
   codegen/tRPC/OpenAPI rejected as primary (§3), headless vs DOM export split (§4),
   host notification/lifecycle contracts (§5), same-domain-operation rule for API+HTML with
   in-process HTML (§6), renderer-neutral standard-admin descriptions vs implementation-
   specific custom views (§7), focused editing-lifecycle needs (§8), unsaved state +
   local sync/conflict surfacing (§9), session-expiry/422/private-context handling (§10),
   the Q47-owned fixture definition (§11, per review §9 D2), separate dashboard/controller/
   panel candidate comparisons with no selection (§12), conditional htmx checks not
   adopting htmx (§13), performance targets adopted as working targets per the dev
   acceptance (§14; see §3), WCAG/CSP/browser support (§15), non-decisions (§16) and the
   requirement matrix (§17).
2. **`docs/decisions/0007-client-wire-host-and-presentation.md`** — ADR-0007, status
   **Proposed** (not accepted), recording settled contract decisions + the candidate
   comparisons as open/pending-dev-selection, with rejected alternatives. Allocation 0007
   verified free before writing (`docs/decisions/` held 0001–0006, 0014–0016 — no collision).
3. This evidence report.

## 2. Design choices and sources

| Design choice | Source/authority | Notes |
|---|---|---|
| Public DTOs derived/mapped from stored types; unmapped DB rows never exported (§2.1) | Q51 (deliberately derived/mapped, not private DB row exports); Q10 (stored types from Drizzle); Q71/C12 (PII classification at the mapping point) | Mapping is the audit point for field classification. |
| Shared runtime schema used for validation in AND out on both sides (§2.2) | Q51 (public types/runtime schemas shared); Q59 (Zod boundary validation locked) | Concrete schema-library pin is implementation detail, recorded at the proof task. |
| JSON serialization; prefixed TEXT ids; `Key='Key'` enum wire values; stable error envelope with closed code vocabulary incl. `revision_conflict`/`session_expired` (§2.3) | Q11 (ids); Q11/enums convention (enum values); Q51 (stable errors = Q47-owned); Q54 §6 (stale rejection surfaced) | Envelope lives in `@yomban-ink/contracts` (q40 §3). |
| Typed client authored from module source (operation table + shared schemas); table registered server-side so contract/route cannot drift (§3) | Q47/Q51 ("typed client from module source… no codegen/tRPC/OpenAPI as the primary mechanism"); Q61 (registration-time conformance) | Shared TS alone doesn't guarantee HTTP conformance (Q51) — the table+schema pairing is the conformance mechanism. |
| Headless exports DOM-API-free (stronger than no-presentation-dependency); DOM facet renderer-neutral; presentation facet optional (§4) | Q22/Q25/Q46/Q47/Q51 (frontend independence); Q35 (optional facets); Q61 (boundary lint direct AND transitive) | Design feeds the phase-006 lint encoding. |
| Host owns content DOM; typed host notifications with entity/field references + explicit lifecycle verbs (§5) | Q8/Q30/Q47; Q54 §10 (DOM→entity/field mapping, host-owned swaps); `004` §Acceptance | Notification transport (CustomEvents vs callbacks) is a candidate-mechanism detail, not a contract change. |
| API and HTML invoke the same domain/authorization operations; HTML may call in-process, not loop back over HTTP (§6) | Q34/Q47/Q51 (locked); q40 §4/§6 (one Worker, in-process HTML) | Symmetry is a fixture check (§11) + conformance assertion (Q61). |
| Renderer-neutral standard-admin descriptions; custom views explicitly implementation-specific and manifest-labelled (§7) | Q47 Answer; Q35 (explicit implementation labels) | Custom-view loss on renderer switch is deliberate and visible, never silent. |
| Focused editing needs + library lifecycle rule (presentation-facet-only libraries; explicit attach/detach; no CSP weakening) (§8) | Q47 (focused JS libraries with explicit lifecycle); Q54 §2.1 field kinds; Q58 (media pipeline); Q59 (sanitization/CSP); Q62 (WCAG AA incl. keyboard parity) | Library selections deferred to candidate proof tasks. |
| Unsaved-state model in headless contracts; typed sync-status/conflict-diff/lock-state surfacing surfaces; truthful acknowledgement (§9) | Q54 §6/§7 (revision checks, save semantics, truthful acks); Q70 + Amendment 001 (field-level three-way diff, rejected-ops bucket, advisory leases, lock eligibility decoupled from publish); Q40 §14 (Q70 seam) | Sync mechanics = task 3.4; only the surfacing contracts are Q47's. |
| Explicit session-expiry handling; 422-class truthful UI; private history-cache isolation beyond HTTP directives (§10) | Q59; Q67 (private responses/history snapshots; JS history caches need more than HTTP cache policy) | Candidate-evaluation check for any library history cache. |
| Fixture definition: plain + bounded reactive fixture, one page list+edit+publish, no routing/SSR/server-action/server-runtime, unchanged services/contracts; Q47 defines / Q61 executes / Q7 gates (§11) | `004` §Fixture definition; review §9 D2 (ownership + minimal scope); Q7/Q61 | Definition only — no fixture was implemented or run in this task. |
| Separate dashboard/controller/panel candidate comparisons; Hono/htmx and TS-controller/htmx-panel are candidates not defaults; choices independent of each other and of Q46 (§12) | Q8 (distinct roles); Q47 (explicit choices, candidate named); `004` §Locked (candidates, not adopted); task acceptance | No selection made; adoption requires executed proof + final dev decision. |
| Conditional htmx checks: HX-Request never authorization; sanitization; evaluation disabled; explicit 422/session-expiry; private history-cache isolation (§13) | Q59 (HX-Request not auth; sanitize; CSP not weakened); Q67 (history isolation); task acceptance | Checks do NOT adopt htmx; dropped if all roles reject htmx. |
| Performance targets: dashboard LCP ≤3.0s/INP ≤200ms; overlay first-edit ≤1.0s; save-ack ≤100ms truthful; public budgets unchanged (§14) | Q62 (public-only budgets; dashboard/overlay targets set in Q40/Q47 with Q54 input); q40 §17 (PROPOSALS forwarded to Q47); Q54 §7 | Values carried forward as PROPOSALS; subsequently ADOPTED as working targets by the dev (2026-10-07, §3 item 2) — adjustable on real measurement data. |
| WCAG 2.2 AA; evergreen + last 2 Safari/Firefox/Edge (§15) | Q62; `004` §Quality | Unchanged from spec. |

## 3. Dev acceptance (recorded 2026-10-07, session `20261007_104930_b7edfe`)

The dev accepted the pending items in conversation on 2026-10-07. Per the skill rule,
recording acceptance does NOT upgrade unverified mechanisms to settled — conditional
acceptances preserve their conditions, and the ADR remains **Proposed** pending the
phase-006 proofs and the joint closure.

1. **Dashboard/controller/panel candidate positions** (design §12): **ACCEPTED as
   directional input, selection still pending.** The dev recorded the intended shape:
   the bundled dashboard is the **devops/sysadmin/dev interface** — schema-generated
   collection list views + item detail views, plus config-management and devops-task
   interfaces — and a separate **in-situ editing overlay** targets content creators/
   editors/non-devs, combining in-place editing with a subset of dashboard features in
   modals/panels. The dev also requires a mechanism for modules or core to **flag which
   capabilities are available in-situ/overlay** — recorded as a NEW plan-understanding
   amendment question (amendment 001), not settled by this acceptance. Per-role
   candidate selection remains pending the phase-006 executed proofs + dev decision
   (joint 7.8); the comparisons remain the evaluation basis.
2. **Performance-target finalization** (design §14): **ACCEPTED** — the q40 §17
   proposal values are adopted as working targets, explicitly adjustable once the
   working system produces real measurement data. Public budgets remain unchanged.
3. **Wire-convention shapes** (design §2.3): **ACCEPTED with condition** — the error
   envelope and route conventions are accepted; the error `code` vocabulary must be a
   **module-owned PascalCase enum** (aggregated platform-wide at build per the enums
   non-negotiable) so consumers write `code === ErrorCode.ValidationFailed`-style
   checks.
4. **Host notification/lifecycle shape** (design §5): **ACCEPTED with condition** — the
   typed payload set and verb model are accepted as extensible; additions must be
   additive contract versions, never breaking changes.
5. **Fixture definition** (design §11): **ACCEPTED** — locked bounds correctly restated.
6. **Headless-is-DOM-API-free strengthening** (design §4): **ACCEPTED**.
7. **Standard-admin description mechanism** (design §7): **ACCEPTED**.

Workflow-input sequencing note: Q54's workflow input is ACCEPTED (2026-10-05, task 2.1) and
consumed here (§9/§14) — but the Q54 GATE is not Closed (closure at 7.7); q40's design is
likewise provisional pending joint closure (7.8). Q47 consumes them as provisional inputs,
per the accepted-input ≠ closed-gate rule (plan 000 "Evidence and closure rules").

## 4. Checks NOT run (assigned to later tasks; none executed in task 3.2)

Per the plan's evidence rules, the following are **NOT YET RUN** — enumerated so no later
task or reviewer mistakes design prose for proof:

1. **The two-host shared acceptance fixture** (design §11): plain server-rendered host +
   bounded reactive-framework host fixture reading/editing/publishing one entity through
   unchanged services/contracts, exercising the §11 mandatory checks. **Per the canonical
   gate table and review §9 D2: Q47 defines (this design §11), Q61 executes, Q7 gates.**
   Owner: the phase-006 conformance-harness proof (6.3 per the plan matrix).
2. **Dependency/export boundary checks** (design §4): boundary lint over real core/
   contracts/headless packages rejecting direct AND transitive presentation dependencies
   and leaked server-only/private fields; headless-DOM-API-free check. **Owner: phase-006
   (6.1–6.3 per the canonical gate table).**
3. **API-vs-HTML authorization symmetry assertion** (design §6): conformance proof that
   both surfaces yield identical authorization outcomes. **Owner: phase-006 / Q61 harness.**
4. **Candidate evaluation proofs** (design §12): bounded measurements/exercises for the
   dashboard, controller and panel candidates — including any htmx-specific evidence if a
   role later selects it. **Owner: phase-006 proof tasks; selection itself is the dev's
   final decision + joint 7.8 closure.**
5. **htmx conditional checks** (design §13): designed, not exercised — no htmx dependency
   was installed, no fragment flow was probed, no history-cache behaviour observed.
   **Owner: the selecting role's proof task, only if htmx is selected.**
6. **Performance measurements** (design §14): no LCP/INP/first-edit/save-ack measurement
   was taken — the adopted working targets (2026-10-07, §3 item 2) are not yet measured;
   measured later on the fixtures' host surfaces with representative Q54 field kinds.
   **Owner: phase-006 (6.3).**
7. **Focused-library viability probes** (design §8): no rich-editor/drag-drop/crop library
   was evaluated against the WCAG/browser matrix. **Owner: the candidate proof tasks.**
8. **Schema-library pin** (design §2.2): the runtime-schema library is named by shape
   (Zod-locked baseline per Q59) but not pinned or exercised. **Owner: the phase-006
   fixture/proof tasks record the pinned version.**

**Not blockers for this task:** items 1–8 are the later tasks' deliverables; this report's
only claim is that they have not run. Any observed output, exit code or version appearing
in a future revision of this report must come from those tasks' sessions.

## 5. Spec conflicts / deviations

- **ADR number:** task 3.2 names `docs/decisions/0007-client-wire-host-and-presentation.md`
  as Create. Verified free (`ls docs/decisions/`: 0001–0006, 0014–0016 present; 0007
  unoccupied) — **no deviation; allocation honoured.**
- **Consistency with q40 (task 3.1):** the design consumes q40's export classes (§2),
  per-side packages (§3), one-Worker in-process HTML topology (§6), session/CSRF topology
  (§10 via q40 §7) and §17 proposals (§14) without re-slicing q40 §3 — no re-slice was
  needed; the headless/browser-safe split maps cleanly onto `contracts`/`clients`.
- **Consistency with q54 (ACCEPTED input):** revision checks (§2.3 `revision_conflict`),
  save semantics (§9), DOM/host ownership (§5) and locks (§9) restate q54's accepted
  semantics as contract surfaces without altering them.
- **No conflict found** between this design and `002`/`004`/`005`/`007`/`008` locked
  sections; where `004` defers an item to Q47, this design supplies it and flags
  provisional status. No locked decision is reopened.
