# ADR-0007 — Client, wire, host and presentation contracts (Q47)

- **Status:** Proposed (2026-10-06) — authored at task 3.2 of spike plan 000 phase_003.
  **Provisional contract decisions accepted by the dev in conversation (2026-10-07,
  session `20261007_104930_b7edfe`; evidence report §3 = the recorded acceptance):**
  performance targets adopted as working targets (adjustable on real data); wire
  conventions accepted with the error `code` as a module-owned PascalCase enum; host
  notification/lifecycle accepted as an additive-only extensible contract; fixture
  definition, headless-DOM-API-free rule and standard-admin descriptions accepted; the
  §12 comparisons accepted as evaluation basis with the dev's directional requirements
  (dashboard = devops/sysadmin/dev console; separate creator-facing in-situ overlay;
  in-situ capability flagging → plan-understanding amendment 001). The record stays
  **Proposed** (not accepted/Closed): per-role candidate selection waits on the
  phase-006 proofs (Q47-defined two-host fixture **executed by Q61**, Q7-discharged;
  dependency/export boundary lint) and the **joint Q40/Q47/Q46 closure (phase-007
  task 7.8)** — an ADR alone is not closure (Q19/Q61).
- **Deciders:** authored by the task-3.2 design agent under the phase-003 contract
  (proposed designs/ADRs; no unrun evidence asserted; no candidate adopted without explicit
  dev input). Dev acceptance of the provisional items RECORDED 2026-10-07 (session
  `20261007_104930_b7edfe`; evidence §3). Per-role candidate selection pending
  phase-006 proofs + joint 7.8.
- **References:** design `docs/plans/000_spike-plan/designs/q47_client-host-contracts.md`;
  evidence `docs/plans/000_spike-plan/evidence/q47_client-host-contracts.md`;
  `docs/specs/000_index.md` canonical gate table (Q47 row);
  `docs/specs/004_clients-and-presentation.md` (the owning spec);
  `docs/specs/002_module-platform-contract.md` (contract packages, exports);
  `docs/specs/005_content-and-editing.md` (content/editing workflows);
  `docs/specs/007_security-and-identity.md` (security baseline, HX-Request not auth);
  `docs/specs/008_operations-and-quality.md` (WCAG, budgets, browser matrix);
  `docs/discovery/understanding.md` Q7, Q8, Q10, Q11, Q22, Q25, Q34, Q35, Q40, Q46, Q47,
  Q50, Q51, Q54, Q58, Q59, Q61, Q62, Q67, Q68, Q70, Q71; amendments 001/002; review
  `docs/reviews/001_spec-review.md` §9 D2; ADR-0006 (q40 composition/topology — PRIMARY
  predecessor), ADR-0004 (Q54 workflow input, accepted), ADR-0005 (Q63 persistence,
  provisional); `docs/decisions/0001-platform-foundations.md` (ceiling decisions).

## Context

Gate Q47 owns the framework-free client/wire/host/presentation mechanics (`004`
§Undecided; canonical gate table): browser-safe exports, runtime wire mechanics (route
shapes, input/output validation, serialization, stable errors), DOM-integration
separation, the explicit dashboard/controller/panel choices, and the minimal-scope
definition of the bounded reactive-framework host fixture (review §9 D2). Locked context
it operates within: frontend independence — no direct or transitive presentation
dependency in core/contracts/headless (Q22/Q25/Q46/Q47/Q51); shared contract package per
module with public DTOs deliberately derived/mapped from stored types, never private DB
rows (Q51); shared runtime schemas + typed client from module source, with codegen/tRPC
inference/OpenAPI generation rejected as the primary mechanism (Q47/Q51); build-time
composition and the q40 export classes/packages/topology (ADR-0006, provisional); Q54's
ACCEPTED workflow input (debounced saves, truthful acknowledgement, revision checks,
host-owned DOM, advisory locks); Q59's safe-by-default baseline; Q62's budgets
(dashboard/overlay targets set with Q54 input, public unchanged); Q70 local-first
surfacing duties (Amendment 001/002). This record reopens no locked decision; final
exports/topology wait on the joint Q40/Q47/Q46 closure (7.8).

## Decisions (settled contract direction; starred items are open/pending dev selection)

1. **Public DTO/runtime schemas.** Each module's public DTO surface is deliberately
   mapped from its stored (Drizzle-inferred) types in the headless contract export —
   unmapped DB rows, private columns and server-only metadata are never exported. Each
   DTO ships a shared runtime schema (Zod-shaped per Q59's locked baseline; pin recorded
   at the proof task) used for **input validation (server parses before domain ops;
   clients pre-check), output truth (responses satisfy the same schema) and client
   parsing** — one artifact, both sides, no duplicated client copy.

2. **Wire conventions.** JSON over HTTP; ISO-8601 dates; prefixed sortable URL-safe TEXT
   ids on the wire (Q11); enums as their string values. A single stable error envelope
   `{ error: { code, message, details? } }` with a closed code vocabulary
   (`validation_failed`, `unauthorized`, `forbidden`, `not_found`, `revision_conflict`,
   `lock_conflict`, `sync_rejected`, `rate_limited`, `session_expired`, `internal`),
   defined in `@yomban-ink/contracts`; clients match on codes, never message text.
   **Dev acceptance (2026-10-07): the code vocabulary ships as a module-owned PascalCase
   enum** (aggregated platform-wide at build per the enums non-negotiable), so consumers
   write `code === ErrorCode.ValidationFailed`-style checks.
   `revision_conflict` carries the server's current revision so Q54 stale-save rejection
   is surfaced, not silent. Route shapes: manifest-declared module bases (Q35/q40 §6)
   with resource/item/action conventions driven by aggregate-root declarations.

3. **Typed module-source client (PRIMARY).** The client is authored from the module's own
   source: a typed client factory composing the public DTO/runtime schemas with an
   **operation table** (name → route, method, input/output schemas, error codes) declared
   in the same module source; `@yomban-ink/contracts` supplies the framework-free client
   base; `@yomban-ink/clients` the browser-safe factories (q40 §3). The server registers
   the same table at build-time wiring — a contract/route mismatch is a registration
   failure (Q61), which is how "shared TS doesn't guarantee HTTP conformance" (Q51) is
   closed. **Codegen, tRPC inference and OpenAPI generation are rejected as primary**
   (Q47/Q51); OpenAPI emission remains a future optional output, never the source of
   truth. `session_expired` is a first-class client outcome with explicit host/presentation
   handling, never a transparent retry.

4. **Headless vs DOM exports.** Headless/browser-safe exports carry DTOs/schemas, typed
   client factories, the Q70 datastore consumer seam and pure state helpers — **no DOM
   APIs and no direct or transitive presentation dependency** (stricter than the
   independence lock alone; mechanically lintable, Q61). DOM exports are renderer-neutral
   (host-notification types, DOM entity/field mapping hooks, overlay integration points)
   and may touch DOM APIs but never import a presentation framework. Presentation exports
   are an optional manifest-declared facet (Q35). Browser exports never expose
   server-only dependencies or private fields (Q25/Q51).

5. **Host notification/lifecycle contracts.** The host owns its content DOM; the
   panel/overlay mutates only panel-owned surfaces and **notifies the host**, which
   performs its own swaps through its own integration; host configuration is never
   hijacked and the host never adopts the panel's library by force (Q8/Q47; Q54 §10).
   Typed host-notification payloads carry the entity/field reference, change kind and new
   public DTO value; the lifecycle contract defines explicit verbs (activate / field-edit /
   commit-request / deactivate / destroy) with explicit degradation for unused verbs.
   **Dev acceptance (2026-10-07): payload set + verb model accepted as ADDITIVE-ONLY
   extensible** — additions are new contract versions, never breaking changes.
   Notification transport rides with the panel candidate (open, ⭐); the typed payload
   contract is settled here.

6. **Same domain/authorization operations on API and HTML.** Public API and optional HTML
   paths invoke the same module domain services and server-side authorization checks;
   HTML may call them **in-process** (same Worker invocation, q40 §4) and is not required
   to loop back over HTTP. Wire surfaces are thin adapters; capability symmetry between
   API and HTML is a fixture/conformance check. CSRF/origin enforcement applies on every
   cookie-authenticated mutation path before module handlers (Q59; profiles = Q68).

7. **Standard-admin descriptions vs custom views.** Standard admin screens are declared as
   renderer-neutral descriptions (field kind, label, widget hint, validation reference,
   permission key) renderable by any presentation implementation. Custom views are
   explicitly implementation-specific presentation-facet exports, manifest-labelled (Q35),
   never universally portable, and never a hidden dependency of the standard surface —
   a renderer switch loses them deliberately and visibly.

8. **Focused editing lifecycle needs.** Rich editor, drag/drop, crop, repeater, media and
   progress each get an explicit needs + lifecycle specification (design §8): focused
   libraries may exist but only in presentation/panel packages, with attach/detach
   lifecycle tied to the §5 verbs, sanitization intact, CSP unweakened, WCAG 2.2 AA
   keyboard parity (e.g. keyboard reordering for drag/drop). Unsaved state is tracked
   client-side in the headless contracts; interrupted/late/failed/stale saves retain the
   draft and surface the failure; acknowledgements are truthful (Q54 §6/§7).

9. **Unsaved state, local sync and conflict surfacing.** The contracts define a typed
   sync-status surface (per change-set pending/pushed/acknowledged/rejected),
   conflict-surfacing presentation of Q70's field-level three-way diff
   (mine/theirs/both-fork) and the visible rejected-ops bucket, and lock-state
   presentation of advisory presence leases (offline edits unlocked-provisional; lock
   eligibility decoupled from publish state — Amendment 001 Q54). Sync mechanics are
   task 3.4's (Q70); only surfacing contracts are Q47's. Rendering mechanisms ride the
   presentation choices.

10. **Private-context isolation.** Session expiry is handled explicitly (no silent
    failure); 422-class responses preserve client input state; private responses and any
    presentation-library history/state caches obey isolation beyond HTTP directives
    (Q67) — a candidate's history-cache behaviour is a mandatory evaluation check.

11. **The shared acceptance fixtures (Q47-owned definition; review §9 D2).** Plain
    server-rendered host + bounded reactive-framework host fixture read/edit/publish ONE
    content entity through unchanged services/contracts: single page list + edit-one +
    one publish action; no routing, no SSR, no server actions, no framework data-loading
    conventions, no framework server runtime (client-side rendering of the page
    permitted); interactions only via the typed browser-safe client + documented host
    notifications; host-owned DOM swaps. Mandatory checks: authorization incl.
    unauthorized/expired session; validation; CSP compatibility; keyboard/focus/
    announcement/input-state preservation; stale-revision conflict; unsaved-state/
    lifecycle preservation; truthful acknowledgement; API-vs-HTML authorization symmetry.
    **Q47 defines (this record); Q61 executes; Q7 gates.** Fixtures are acceptance proof
    only — never production renderers, never a starter adoption (Q46).

12. **Dashboard/controller/panel candidates — comparisons accepted as evaluation basis
    (2026-10-07); per-role selection still OPEN (⭐).** Three separate, independent role
    choices compared in design §12: dashboard (A: Hono-rendered HTML + htmx vs B:
    plain-TS server-rendered), overlay controller (A: plain TypeScript vs B:
    framework-backed), overlay panel (A: htmx-driven vs B: plain-TS/other). The dev's
    **directional requirements** (recorded 2026-10-07; not a technology selection): the
    bundled dashboard is the **devops/sysadmin/dev interface** — schema-generated
    collection list + item detail views, config-management and devops-task interfaces;
    the **in-situ overlay** targets content creators/editors/non-devs — in-place editing
    plus a subset of dashboard features in modals/panels, with a **flagging mechanism
    for which capabilities are in-situ-available** (new plan-understanding amendment 001
    question — design/ownership NOT settled here). Per-role candidate selection requires
    the candidate proof tasks' executed evidence and the dev's final decision; the
    choices are independent of each other and never assign the Q46 public starter by
    inference.

13. **Conditional htmx checks — designed, NOT adopting htmx.** If a presentation role
    later selects htmx, all of the following are mandatory for that role: HX-Request is
    never authorization (same server-side authorization/CSRF as the JSON twin);
    untrusted content sanitized at the fragment boundary; unnecessary evaluation/script
    processing disabled (`hx-disable` as applicable); explicit truthful 422-class and
    session-expiry handling; private history-cache isolation for authenticated contexts
    (Q67). If htmx is rejected for all roles, these checks drop without affecting core
    independence (`004`).

14. **Performance targets — ADOPTED as working targets (dev acceptance 2026-10-07).**
    Public budgets unchanged (LCP < 2.5s / INP < 200ms, public reference frontend only,
    Q62). The q40 §17 proposals are adopted as the working targets: dashboard LCP
    ≤ 3.0s / INP ≤ 200ms on a representative list view; overlay first-edit readiness
    ≤ 1.0s; save-ack feedback ≤ 100ms after the debounced save fires (truthful, Q54 §7);
    sync-status visibility within the save-ack interaction budget (no separate numeric
    target invented). The dev explicitly reserved the right to **adjust these values
    once the working system produces real measurement data**. Measured later on the
    fixtures' host surfaces with representative Q54 field kinds; candidate measurements
    support §12 selection and never claim the unbuilt MVP meets them.

## Rejected alternatives

- **Codegen from server implementations / tRPC inference / OpenAPI generation as the
  primary client mechanism** — rejected (locked, Q47/Q51): inference couples the client
  to server implementation shapes and risks leaking private fields; codegen adds a
  build-order dependency against module-source single authority. OpenAPI emission stays
  a future optional output.
- **A laxer headless boundary (DOM APIs allowed in headless exports)** — rejected: the
  DOM-API-free reading keeps headless exports usable in Workers/non-DOM contexts and is
  mechanically lintable (Q61); accepted by the dev as a strengthening (2026-10-07,
  evidence §3 item 6), not a loosening.
- **HTML paths looping back over HTTP to the API for in-process calls** — rejected
  (Q51/task acceptance): unnecessary hop; in-process invocation with identical
  authorization is the locked allowance.
- **Renderer-neutral descriptions for custom views / porting custom views across
  renderers** — rejected: custom views are explicitly implementation-specific
  (Q47); forcing portability would either gut custom capability or fake neutrality.
- **Panel directly mutating host content DOM / host adopting the panel library** —
  rejected (locked, Q8/Q47): host-owned DOM updates through documented notifications only.
- **Silent last-write-wins or fabricated success on stale/failed saves** — rejected
  (locked, Q54 §6/§7): server-side revision checks surface `revision_conflict`; acks are
  truthful.
- **Weakening CSP or skipping sanitization for a presentation library** — rejected
  (locked, Q59): baseline protections on every surface; any relaxation is a documented
  candidate-evaluation finding, never an accepted default.
- **Treating HX-Request (or any presentation header) as an authorization boundary** —
  rejected (locked, Q59); the §13 checks exist precisely to prevent it if htmx is chosen.
- **Selecting a dashboard, controller, panel or public starter in this record** —
  rejected: explicit dev choices requiring executed proof (Q40/Q46/Q47); no adoption by
  implication of an ADR or fixture.
- **Copying public LCP/INP budgets onto dashboard/overlay** — rejected (Q62): targets are
  set with Q54 workflow input; the §14 values are the dev's adopted working targets
  (2026-10-07), distinct from and adjustable independently of the public budgets.
- **Dropping the reactive fixture if htmx is rejected everywhere** — rejected
  (`004` §Acceptance): both fixtures are mandatory regardless of any candidate outcome.

## Non-decisions

This record selects **no** dashboard, overlay controller or panel implementation
(§12 open); no htmx adoption (§13 conditional only); no public starter (Q46/task 3.3);
no Q70 sync/driver mechanics (task 3.4); no Q68 profile/token/rate-limit mechanics; no
Q67 freshness windows/preview mechanics (duties named only); no focused-library
selections (needs/lifecycle specified; candidates pick at proof); §14 performance targets
adopted as working targets only (2026-10-07, adjustable — not final measured claims);
no product code or fixture implementation (Q61 executes §11).
It reopens no locked decision (Q10/Q11/Q22/Q25/Q29/Q34/Q46/Q51/Q54/Q59/Q62/Q70).

## Consequences

- Modules author their public contract (DTOs + runtime schema + operation table) once;
  server routes and browser clients derive from the same artifact, and contract/route
  drift is a registration failure rather than a runtime discovery.
- The frontend-independence boundary becomes mechanically checkable at three levels:
  package separation (q40 §3), export-class lint (no presentation dependency,
  no `export *`, no server-only/private leakage) and the headless-DOM-API-free rule —
  encoded by the phase-006 boundary proof.
- The fixture definition is final input for Q61's conformance harness; the two-host
  proof and boundary checks are Q47's required gate evidence, not optional.
- Dashboard/controller/panel work cannot start until the dev selects per role after the
  candidate proofs; nothing in the contract set pre-adopts any candidate.
- Q47 gate closure requires: the recorded dev acceptance (provisional items accepted
  2026-10-07; per-role candidate selection still open, §12), the phase-006 executed
  fixture + boundary proofs, and the joint Q40/Q47/Q46 closure (7.8). Selection of the
  remaining open item is not granted by this record.

## Follow-on decisions needed

- **Dev:** per-role candidate selection after the phase-006 proofs (§12 — the only
  remaining open item; the seven evidence-§3 provisional acceptances were recorded
  2026-10-07).
- **Task 3.3 (Q46):** select the public starter independently — no inference from §12.
- **Task 3.4 (Q70):** design sync/driver mechanics behind §9's surfacing contracts.
- **Phase-006 (tasks 6.1–6.3):** execute the two-host fixture, dependency/export
  boundary checks, API-vs-HTML symmetry assertion and candidate/perf measurements;
  record observed results in the evidence report.
- **Phase-007 (task 7.8):** reconcile and jointly close Q40/Q47/Q46; then this ADR may
  move Proposed → Accepted → Closed per the canonical gate table.

