---
title: "Q47 — client/wire/host/presentation contracts (provisional design)"
created_session: "20261006_212010_4c6797"
sessions: ["20261006_212010_4c6797"]
approved: false
---

# Q47 — Client/wire/host/presentation contracts (design)

> **Status: PROPOSED/PROVISIONAL design input for gate Q47 — NOT a closed gate.**
> This is the task 3.2 deliverable
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.2.md`). It specifies the
> **framework-free wire/client/host/presentation contracts** for Yomban.ink within the LOCKED
> constraints: frontend independence (no direct or transitive presentation dependency in
> core/contracts/headless — Q22/Q25/Q46/Q47/Q51), public DTOs derived/mapped from stored types,
> never private DB rows (Q51), shared runtime schemas + typed client from module source as the
> PRIMARY mechanism with no primary codegen/tRPC inference/OpenAPI generation (Q47/Q51),
> build-time composition only (Q29), and module-owned exports per the Q40 export classes
> (design q40 §2). **No dashboard, overlay controller or panel implementation is selected** —
> the Hono/htmx dashboard and TS-controller/htmx-panel candidates are compared here
> (§12) and remain candidates only; final exports/topology close at the joint
> Q40/Q47/Q46 boundary (phase-007 task 7.8).
>
> **Evidence note:** per plan 000, no two-host fixture, no boundary-lint proof, no
> dependency/export check and no htmx evaluation probe has run — no harness exists and none is
> claimed to pass. The fixture definition here (§11) is the Q47-owned definition D2 assigns;
> Q61 executes it. See `evidence/q47_client-host-contracts.md` §4 for the not-run list.

## 1. Scope and authority

Grounding sources for this design:

- **`docs/specs/000_index.md` §Canonical gate table** — the authoritative Q47
  owner/evidence/block definition; cited, not restated.
- **`docs/specs/004_clients-and-presentation.md`** — the owning spec: locked frontend
  independence (§Locked decisions), presentation surfaces/roles (§Presentation surfaces),
  the fixture definition and Q47 ownership (§Acceptance criteria, review §9 D2), WCAG/
  budgets/browser matrix (§Quality and performance).
- **`docs/specs/002_module-platform-contract.md`** — shared contract package per module,
  export boundaries, conformance/boundary enforcement.
- **`docs/specs/005_content-and-editing.md`** — content field kinds, in-situ editing, host
  integration, unsaved/draft state.
- **`docs/specs/007_security-and-identity.md`** — safe-by-default surface profiles, CSRF/
  origin/sanitization, HX-Request never authorization.
- **`docs/specs/008_operations-and-quality.md`** — WCAG 2.2 AA, public LCP/INP budgets,
  browser matrix.
- **`docs/discovery/understanding.md`** — Q47 (the gate), Q51 (shared contracts; Q47 owns
  wire mechanics), Q54 (workflow input ACCEPTED), Q59 (security baseline), Q62 (targets),
  Q22/Q25 (independence, no `export *`), Q7 (the gate the fixture discharges), Q70 +
  amendments 001/002 (local-first store, conflict surfacing, MVP deliverable), Q68 (surface
  profiles), Q67 (private history/cache isolation).
- **Prior phase inputs:** `designs/q40_composition-lifecycle.md` (PRIMARY predecessor —
  task 3.1: export classes §2, per-side packages `core-server`/`contracts`/`clients` §3,
  route/SSR/auth topology §6, cookies/session/CSRF §7, performance-target PROPOSALS §17);
  `designs/q54_content-workflows.md` (ACCEPTED workflow input — field kinds §2, revision
  checks §6, save semantics §7, DOM/host ownership §10, locks §11); `designs/q63_…` (auth
  session/ID inputs, provisional).

## 2. Wire contracts: public DTOs, runtime schemas, validation in/out

### 2.1 Public DTOs are derived/mapped, never DB rows

- Each module's **public DTO surface** is deliberately defined in its headless/contracts
  export (q40 §2 "headless/server-safe" class): DTO types are **mapped from stored types**
  (Drizzle-inferred, Q10/Q51) through an explicit, per-field mapping step — private columns,
  internal revisions bookkeeping and server-only metadata never appear in a public DTO.
- Unmapped DB rows are never exported (Q51); the mapping is the audit point where a field is
  classified as public, private/server-only, or PII-marked (C12, redaction/Q71).

### 2.2 Runtime schemas shared by both sides

- Each public DTO ships with a **runtime schema** (Zod-shaped value schema — Q59 names Zod
  boundary validation as the locked baseline; the concrete library pin is implementation
  detail, recorded at the proof task) that is the **single source** used on BOTH sides:
  - **Input validation (in):** server route handlers parse request payloads against the
    schema before any domain operation runs; clients use the same schema for optimistic
    client-side checks and for parsing server responses.
  - **Output validation (out):** server responses are serialized from values that satisfy
    the same schema; a response the schema cannot produce is a server bug, surfaced by the
    conformance harness (Q61), not silently re-shaped.
- The schema lives in the module's shared contract export — server handler and browser
  client import the same artifact; there is no duplicated client-side copy.

### 2.3 Serialization, route shapes and error conventions

All **wire-mechanics conventions are Q47-owned here** (Q51 deference), framework-free:

- **Serialization:** JSON over HTTP for API paths; content-type-explicit. Dates serialize as
  ISO-8601 strings; ids are the prefixed sortable TEXT ids (Q11 — `pg_<ulid>`-style, never
  INTEGER); enums serialize as their string values (`Key = 'Key'`). No framework-specific
  serialization layer in contracts.
- **Route shapes:** modules declare route bases in their manifest (Q35); concrete paths mount
  under the module base (q40 §6). Conventions: resource-collection and resource-item shapes
  driven by the module's aggregate-root declarations (Amendment 001 Q35); action sub-paths
  for workflow verbs (e.g. publish) rather than verb-encoded method abuse. Route naming is a
  convention table in the conformance harness, not an invented URL scheme per module.
- **Error conventions:** a single stable error envelope defined in `@yomban-ink/contracts`
  (Q40 §3): `{ error: { code, message, details? } }` with a closed code vocabulary
  (validation_failed, unauthorized, forbidden, not_found, revision_conflict, lock_conflict,
  sync_rejected, rate_limited, session_expired, internal). Codes map to HTTP status; the
  client types match on codes, never on parsed message text. `revision_conflict` carries the
  server's current revision so Q54 §6 stale-save rejection is surfaced, not silent.
- **Validation failures** return `validation_failed` with per-field details from the runtime
  schema — the same detail shape the client renders in editing surfaces.

## 3. Typed module-source client (PRIMARY mechanism)

- **Primary mechanism (locked direction, Q47/Q51):** the typed client is authored **from the
  module's own source contracts** — each module's headless export exposes a client factory
  that composes (a) the public DTO/runtime schemas (§2.2) and (b) an operation table
  (operation name → route, method, input schema, output schema, error codes) declared in the
  same module source. `@yomban-ink/contracts` supplies the framework-free client base
  (transport injection, envelope decoding, session/cookie handling, retry-free truthful
  error surfacing); `@yomban-ink/clients` supplies the browser-safe factory surfaces (q40 §3).
- The server registers the same operation table at build-time wiring, so the declared
  contract and the mounted route cannot drift — a mismatch is a registration/conformance
  failure (Q61), not a runtime surprise. Shared TypeScript alone does not guarantee HTTP
  conformance; this table + schema pairing is the conformance mechanism (Q51).
- **Rejected as primary:** codegen from server implementations, tRPC inference, OpenAPI
  generation (Q47/Q51 — "no codegen/tRPC/OpenAPI as the primary mechanism"). OpenAPI
  emission from the contracts remains a **future optional output**, never the source of
  truth. Rejection rationale: inference couples the client to server implementation shapes
  (leaking private fields), and codegen adds a build-order dependency that breaks the
  module-source single-authority principle.
- **Session/auth on the wire:** browser clients carry the better-auth session cookie
  (q40 §7); machine clients use the `bearer()`-proven token path (q63 §9). The client base
  treats `session_expired` as a first-class outcome the host/presentation handles explicitly
  (§10), never as a transparent retry.

## 4. Headless vs DOM exports (frontend independence boundary)

Q47 owns the client-side split of q40 §2's export classes:

- **Headless/browser-safe exports** (in module contract packages + `@yomban-ink/clients`):
  DTO/runtime schemas, typed client factories, the Q70 browser datastore consumer seam
  (q40 §14), browser-safe id generation (q40 §11), pure state helpers (unsaved-state
  tracking, §9). **No DOM API may appear** in these exports — no `document`, `window`,
  DOM types in signatures. This is stronger than "no presentation dependency": it keeps the
  exports usable in Workers, node scripts and non-DOM browser contexts (service workers),
  and makes the boundary lint mechanically checkable (Q61).
- **DOM exports** (module DOM facet + core DOM contracts): host-notification contract types
  (§5), DOM entity/field mapping hooks (Q54 §10), overlay-controller integration points,
  editable-surface registration. Renderer-neutral — no framework/library dependency (Q47).
  DOM exports may touch DOM APIs but never import a presentation framework.
- **Presentation exports** (optional facet): HTML fragments/components, hx-* directives if
  the htmx candidate is later selected, styles. Checked separately by the boundary lint
  (Q61); never required for registration (Q35).
- **Enforcement:** direct AND transitive presentation dependencies are rejected in
  core/contracts/headless by the boundary lint in CLI/build/CI before registration (Q61);
  browser contract exports must not expose server-only dependencies or private fields
  (Q25/Q51). The dependency/export design here is what the lint encodes — the design
  obligation is discharged only by the phase-006 executed checks (evidence §4).

## 5. Host notification/lifecycle contracts (DOM facet)

- **Host owns its content DOM** (Q8/Q30/Q47; Q54 §10): the panel/overlay mutates **only
  panel-owned DOM surfaces**. All content-DOM updates happen through **documented
  notifications** to the host, which performs its own swaps using its own integration.
  The host's existing configuration is never hijacked; the host is never forced to adopt
  the panel's library (Q47).
- **Notification contract (proposed shape, provisional):** the DOM facet defines a
  renderer-neutral event/notification surface — typed host-notification payloads carrying
  the entity/field reference (Q54 §10), the change kind (field-updated, record-published,
  lock-state-changed, conflict-surfaced, sync-status-changed), and the new public DTO value
  where applicable. Notification transport (DOM CustomEvents vs callback registration) is
  a presentation-mechanism detail decided with the panel candidate (§12), not a contract
  change: both transports carry the same typed payloads from this contract.
- **Lifecycle contract:** the overlay/controller/panel integration defines explicit
  lifecycle verbs — activate (edit session opens; lock acquire attempted per Q54 §11),
  field-edit (panel-owned), commit-request (host performs its own update), deactivate
  (panel releases lock, flushes/preserves unsaved state per §9), destroy (teardown without
  host-DOM mutation). Each verb is a documented seam a host integration implements; hosts
  are never required to implement verbs they do not use, and unused verbs degrade
  explicitly (no silent no-ops).
- **DOM entity/field mapping** (Q54 §10): each editable surface maps to a record + field
  (or repeater entry + child field) reference. The mapping descriptor (data-attribute shape
  or registration API) is defined in the DOM facet contract so both the plain fixture and
  the reactive fixture use the identical mechanism.

## 6. Public API and optional HTML paths invoke the SAME domain/authorization operations

- Locked (Q34/Q47/Q51): the public API paths and the optional HTML admin/editing paths
  invoke **the same module domain services and the same server-side authorization checks**.
  HTML fragments may invoke them **in-process** (direct service call inside the same Worker
  invocation, q40 §4/§6) — HTML is **not required to loop back over HTTP** to the API.
- Consequence for the contract set: the domain operation layer (registry services, Q41)
  is the single authorization boundary; wire surfaces (JSON routes, HTML fragment routes)
  are thin adapters over it. A capability reachable via HTML must be reachable via API and
  vice versa, with identical authorization outcomes — this symmetry is a fixture check
  (§11) and a conformance-harness assertion (Q61).
- CSRF/origin enforcement applies on every cookie-authenticated mutation path — API and
  HTML alike — before module handlers run (Q59; q40 §7). Exact profiles are Q68's.

## 7. Renderer-neutral standard-admin descriptions vs custom views

- **Standard-admin descriptions (renderer-neutral):** modules declare their standard admin
  screens (list/detail/edit forms) as **declarative descriptions** — field kind, label,
  widget hint, validation reference, permission key — in the module manifest/contract
  (Q47: "renderer-neutral descriptions cover standard admin screens"). Any presentation
  implementation (the Hono/htmx dashboard candidate, a future alternative, the reactive
  fixture) renders these descriptions with its own mechanism. The descriptions carry no
  markup and no framework types.
- **Custom views are explicitly implementation-specific:** a module may ship bespoke
  admin views as **presentation-facet exports tied to a named presentation implementation**.
  They are labelled as such in the manifest (Q35 explicit implementation labels) and are
  **not universally portable components** — a consumer switching dashboard implementations
  loses custom views deliberately and visibly, never by silent degradation of standard
  screens. Standard screens keep working under any renderer; custom views never become a
  hidden dependency of the standard surface.

## 8. Focused editing-lifecycle needs (rich editor, drag/drop, crop, repeater, media, progress)

Q54's field kinds (§2.1: text, rich text, media, relation, repeater) imply focused
client-side behaviours that "may need focused JS libraries with explicit lifecycle" (Q47).
Q47 specifies the **needs and the lifecycle contract**, not the libraries:

- **Rich editor:** needs a contentEditable-based editing surface with sanitized document
  model in/out (sanitization at the panel boundary per Q59), keyboard/focus preservation,
  and serialization to the field's stored representation via the runtime schema. Lifecycle:
  editor attaches to panel-owned DOM on activate, detaches on deactivate/destroy with
  unsaved state preserved (§9); a failed/stale save never discards the draft (Q54 §7).
- **Drag/drop (ordering, repeater entries, media placement):** needs pointer/keyboard
  parity (WCAG 2.2 AA — keyboard reordering must exist), optimistic reorder with server
  `sort_order` confirmation (Q54 §5), and lifecycle-bound listeners (attached on activate,
  removed on destroy — no leaked document-level listeners).
- **Crop (media):** needs an in-panel crop interaction producing a normalized crop result
  that flows into the media upload/transform contract (Q58 — media module owns records,
  core provides R2/transform contracts); the crop tool is presentation-side only, it never
  touches storage bindings.
- **Repeater:** needs entry add/remove/reorder with child-field mapping (aggregate-root
  inheritance per Amendment 001 Q35/Q70 §3 — child rows inherit the root's lock/revision),
  per-entry validation via the same runtime schema, and unsaved-state accounting per entry
  (§9).
- **Media:** needs the upload → record → field-reference flow against Q58 contracts,
  upload progress surfaced as a progress lifecycle (below), and sanitization of untrusted
  file metadata.
- **Progress (uploads, long actions):** needs a progress-notification surface in the DOM
  facet contract (indeterminate + determinate states, cancellable where the underlying
  contract allows), so any panel implementation renders it consistently; progress is
  presentation of real transport state — never fabricated.
- **Library-lifecycle rule (locked direction from Q47):** any focused library a candidate
  adopts must (a) live in the presentation facet or panel package only — never in
  headless/contracts; (b) have explicit attach/detach lifecycle tied to §5's verbs; and
  (c) not weaken CSP or bypass sanitization (Q59). Library selection per candidate is
  deferred to the proof tasks (§12; evidence §4).

## 9. Unsaved state, local sync and conflict surfacing

- **Unsaved state is tracked client-side** (Q54 §7): the headless contracts include an
  unsaved-state model — which edits are unsaved, which are saved draft state — independent
  of the server. Lifecycle/unsaved-state preservation across host updates and panel
  deactivate is a mandatory fixture check (§11; `004` §Acceptance). Interrupted/late/failed
  saves retain the draft and surface the failure; a stale-rejected save leaves the draft
  intact for re-resolution (Q54 §6/§7).
- **Local sync surfacing (Q70 + Amendment 001):** the local-first store is the browser-safe
  Q70 consumer seam (q40 §14); sync mechanics are task 3.4's. Q47 owns only the
  **presentation surfacing**: (a) a typed sync-status surface in the headless contracts
  (pending/pushed/acknowledged/rejected states per change-set); (b) conflict-surfacing
  presentation of Q70's field-level three-way diff (mine/theirs/both-fork) and the visible
  rejected-ops bucket (never silently dropped — Q70 §5); (c) lock-state presentation of
  presence leases (advisory; offline edits unlocked-provisional; lock eligibility decoupled
  from publish state — Amendment 001 Q54). The mechanism (which component renders these)
  is a presentation choice (§12); the typed surfaces are contracts and belong here.
- **Truthful acknowledgement (Q54 §7):** save/publish acks never report success on
  stale/failed saves — enforced by the error envelope (`revision_conflict`,
  `sync_rejected`) and by the fixture's truthful-acknowledgement check (§11).

## 10. Session expiry, 422-class handling and private-context isolation

- **Session-expiry handling is explicit** (Q59/Q67): a cookie-authenticated surface that
  receives `session_expired` must present an explicit re-auth path; private responses and
  any presentation-library history/state caches obey `no-store`-equivalent isolation so
  drafts/secrets never leak between users or preview/public contexts (Q67). HTTP cache
  directives alone are not a policy for JavaScript history caches — a selected presentation
  library's history-cache behaviour must be verified to isolate private contexts (a
  candidate-evaluation check, §12/§13).
- **422-class handling:** validation and state-convention failures
  (`validation_failed`, `revision_conflict`, `lock_conflict`) surface with per-field
  details and preserve the client's input state — no silent clearing, no fabricated success.
- **CSP:** baseline CSP/security headers are never weakened for a presentation library
  (Q59); any candidate requiring CSP relaxation (e.g. inline handlers) is a documented
  candidate-evaluation finding, not an accepted default.

## 11. The shared acceptance fixtures (Q47-owned definition, per review §9 D2)

**Ownership (locked, D2):** Q47 owns the fixture definition (this section); **Q61 executes**
it in the conformance harness; **Q7 is the MVP gate** it discharges. The fixtures are
acceptance proof only — never production renderers, never a starter adoption (Q46 is a
separate choice).

**Common requirements (both fixtures):**
- One content entity type from the pilot-derived proving set; both fixtures read, edit and
  publish the **same** entity through **unchanged services/contracts** (q40 seams; q54
  semantics) — they differ **only** in presentation mechanism, never capability coverage.
- Mandatory checks exercised (`004` §Acceptance; `005`; Q54): authorization incl.
  unauthorized/expired session; input validation on invalid data; CSP-compatible operation;
  keyboard/focus/announcement/input-state preservation across swaps; stale-revision save
  conflict; unsaved-state/lifecycle preservation; truthful save/publish acknowledgement;
  API-vs-HTML authorization symmetry (§6).
- Interactions only through the framework-free shared contracts (typed browser-safe client +
  documented host notifications): no in-process service calls from the reactive fixture, no
  server-only/private-field access, no raw DB rows.
- Host seam: host owns its DOM; updates arrive via host-owned swaps; no foreign DOM
  replacement; host config never hijacked (Q8/Q47).

**Plain HTML/server-rendered fixture:** a server-rendered page (in-process HTML path per
§6) reading/editing/publishing the same entity; HTML fragment updates flow through the same
domain operations and the same authorization checks.

**Reactive-framework host fixture — minimal scope (LOCKED bounds; D2 + `004` §Fixture
definition):**
- **Surface:** a single page that lists and edits one content entity; "publish" is one
  action invoked through the contract. No multi-step workflow.
- **Excluded framework surface:** no routing, no SSR, no server actions, no framework
  data-loading conventions, no framework server runtime. Client-side rendering of that one
  page is permitted; anything beyond is out of bounds.
- **Bounding rule:** only enough framework surface to render that single page reactively.
  The reactive framework used is illustrative — it adopts neither the public starter nor any
  dashboard/controller/panel implementation.
- **Hono/htmx and TS-controller/htmx-panel are candidates, not defaults:** neither the
  fixture nor this design adopts htmx for any role; the conditional checks below activate
  only if a presentation role later selects htmx.

## 12. Dashboard / overlay-controller / overlay-panel candidate comparisons (separate, no selection)

Three **separate** role choices (Q8/Q47) compared independently below. **None is selected
here**; each requires later executed proof (phase-006 / Q61) and a final dev decision, and
final exports/topology close at joint 7.8.

### 12.1 Bundled admin dashboard

| Criterion | Candidate A — Hono-rendered HTML + htmx dashboard | Candidate B — plain-TS (no htmx) server-rendered dashboard |
|---|---|---|
| Fit to contracts (§2/§6) | HTML fragments call domain ops in-process (§6); htmx requests are just HTML surfaces — HX-Request never authorization (Q59) | Same in-process HTML path without the htmx layer; standard form/redirect flow |
| Standard-admin rendering (§7) | Renders renderer-neutral descriptions via server templates; partial swaps suit list/detail/edit | Renders the same descriptions; full-page or fragment refreshes |
| Editing lifecycle (§8) | Needs focused libraries for rich editor/drag/crop anyway — htmx does not supply them; mixed stack complexity | Same focused-library needs; fewer moving parts, more explicit JS |
| Session/CSRF/422 handling (§10) | Conditional checks of §13 required in full | Standard cookie/CSRF flow; no htmx-specific handling |
| Perf targets (§14) | Fragment swaps can help perceived INP; hx-boost/history behaviour must be isolated (Q67) | Straightforward cache/history story |
| Risk | htmx evaluation is its own proof obligation (§13); CSP/history isolation findings possible | Less ergonomic partial updates; still meets the same locked checks |
| Verdict here | **Candidate** — not adopted | **Candidate** — not adopted |

### 12.2 Overlay integration controller

| Criterion | Candidate A — plain TypeScript controller (no framework) | Candidate B — framework-backed controller |
|---|---|---|
| Fit to role (Q8/Q47) | Controller's job is DOM mapping/host integration (§5) — plain TS is the smallest surface that does it | Adds a framework dependency into the host page's context; host must then carry or tolerate it |
| Host independence | No host prerequisite beyond the DOM contracts; host never adopts controller tech (Q47) | Risk of forcing host-side runtime adoption — tension with "host cannot be forced to adopt the panel library" |
| Lifecycle (§5/§8) | Explicit attach/detach verbs map 1:1 to the lifecycle contract | Framework lifecycle must be reconciled with the contract verbs |
| Verdict here | **Candidate** (and aligned with the TS-controller/htmx-panel pairing shape) — not adopted | **Candidate** — not adopted |

### 12.3 Overlay editing panel

| Criterion | Candidate A — htmx-driven panel | Candidate B — plain-TS/other panel |
|---|---|---|
| Fit to panel-owned DOM (§5) | Panel mutates only its own surfaces; htmx swaps confined to panel regions | Same confinement by construction |
| Focused needs (§8) | Rich editor/crop/drag need focused libraries regardless; htmx covers fragment updates around them | Focused libraries + hand-written updates |
| Sanitization/CSP (Q59, §13) | Untrusted fragments must be sanitized; evaluation/script processing disabled; §13 checks mandatory | Standard sanitization duty |
| History/cache isolation (Q67/§10) | htmx history cache of private contexts is a known risk requiring explicit isolation | Standard history handling |
| Verdict here | **Candidate** — not adopted | **Candidate** — not adopted |

**Cross-cutting rule:** the dashboard, controller and panel choices are **independent**
(a TS-controller may pair with either panel candidate; a dashboard choice does not assign
the controller or panel, and neither assigns the Q46 public starter). No candidate is
adopted by implication of an ADR, a fixture or a diagram (`004` §Non-goals).

## 13. Conditional htmx checks (designed now; activated only if htmx is selected for a role)

These checks are **explicitly designed but do NOT adopt htmx** (task acceptance). If any
presentation role later selects htmx, all of the following are mandatory for that role:

1. **HX-Request is never authorization.** Every htmx-served path enforces the same
   server-side authorization and CSRF/origin rules as its JSON twin (Q59; q40 §7); the
   header only selects a response shape. A missing/absent HX-Request on the same route must
   yield the identical authorization outcome.
2. **Sanitize untrusted content.** Any content rendered from user/module data into an HTML
   fragment is escaped/sanitized at the boundary (Q59); the fragment path uses the same
   sanitization as JSON-stringified output, never a laxer HTML path.
3. **Disable unnecessary evaluation/script processing.** Fragment responses must not rely
   on htmx's inline-script evaluation; where a candidate's defaults would evaluate response
   content, the design requires it disabled, with any JS behaviour expressed through
   panel-owned, CSP-compatible code instead (`hx-disable` applied as applicable to
   untrusted regions).
4. **Explicit 422/session-expiry handling.** `validation_failed`/`revision_conflict`
   responses (422-class) and `session_expired` must render explicit, truthful UI states in
   the fragment flow — never a silent swap that reads as success (Q54 §7) and never an
   unhandled raw error body.
5. **Private history-cache isolation.** htmx's client-side history cache must not persist
   private/authenticated fragments across users or preview/public contexts (Q67):
   authenticated surfaces disable or partition the history cache and obey
   `no-store`-equivalent isolation (Q67 — HTTP directives alone are not a JavaScript-history
   policy). Verified by a dedicated candidate-evidence case before adoption.

These checks ride in the conformance harness **only if** the role adopting htmx is chosen;
if htmx is rejected for all roles, they are dropped without affecting core independence
(`004` §htmx acceptance evaluation).

## 14. Performance targets (adopted as working targets — dev acceptance 2026-10-07)

Q62 locks public budgets unchanged (LCP < 2.5s / INP < 200ms, public reference frontend
only). Using the accepted Q54 workflow input (deliberate + ~1–2s debounced saves; truthful
acks; lock/state surfaces), the q40 §17 proposals were **adopted by the dev as the
working targets (recorded 2026-10-07, evidence §3 item 2) — explicitly adjustable once
the working system produces real measurement data**:

| Target | Value (proposed) | Basis |
|---|---|---|
| Dashboard LCP (representative list view) | ≤ 3.0s | q40 §17 proposal; authenticated chrome vs public budgets |
| Dashboard INP (list + navigation) | ≤ 200ms | q40 §17 proposal |
| Overlay first-edit readiness (activation → editable field accepts input) | ≤ 1.0s | q40 §17; Q54's interaction point is the overlay, not a page load |
| Save-acknowledgement feedback (after the debounced save fires) | ≤ 100ms, truthful | q40 §17; Q54 §7 truthful-acknowledgement rule |
| Local sync status visibility | surfaced within the same interaction budget as save-ack (no separate numeric target proposed) | Q70 surfacing duty (§9); numeric target deliberately NOT invented here |

**Measurement basis:** on the two acceptance fixtures' host surfaces (§11) with
representative Q54 field kinds; bounded candidate measurements support §12 selection and
never claim the unbuilt MVP meets them (plan 000 evidence rules). **Adopted as working
targets by the dev (2026-10-07, recorded in evidence §3)** — the dev may adjust any
value once the working system produces real measurement data.

## 15. WCAG/CSP/browser support

- **WCAG 2.2 AA** for bundled admin/editing and rendered public content (Q62); library
  defaults never prove accessibility — edits/swaps preserve keyboard, focus, announcements
  and input state (checked in §11 fixtures). The focused editing surfaces (§8) must meet AA
  including keyboard parity for drag/drop.
- **CSP/security headers** per Q59 baseline on every surface; never weakened for a
  presentation library (§10/§13).
- **Browser support:** evergreen plus last 2 Safari/Firefox/Edge (Q62). Focused-editor
  candidates are evaluated against this matrix; anything requiring a wider matrix is a
  candidate finding, not a silent expansion of support.

## 16. What this design does not decide

- **No dashboard/controller/panel selection** — §12 compares; §12's verdicts are candidates
  only; adoption requires executed proof + explicit dev decision (phase-006/Q61; joint 7.8).
- **No htmx adoption** — §13 designs conditional checks only.
- **No Q46 public starter** — task 3.3; nothing here assigns it by inference.
- **No Q70 sync/driver mechanics** — task 3.4; §9 fixes only the typed surfacing contracts.
- **No Q68 profile shapes, token mechanics, rate limits** — q40 §7/§16 name the seams.
- **No Q67 freshness windows/preview mechanics** — §10/§13 state isolation duties only.
- **No focused-library selections** (rich editor, drag/drop, crop) — §8 states needs +
  lifecycle; candidates pick libraries at their proof tasks.
- **No product code, no fixture implementation** — the fixture definition (§11) is executed
  by Q61's harness; this task runs no harness.
- **No adopted performance targets at authoring time** — §14's q40 §17 proposals were
  subsequently ADOPTED by the dev as working targets (2026-10-07, evidence §3 item 2),
  adjustable on real measurement data.

## 17. Requirement matrix

Each task-3.2 acceptance clause resolved to the design section (labels are the design's own
device — the task text does not letter its clauses):

| Task 3.2 acceptance clause | Resolved in |
|---|---|
| Mapped public DTO/runtime schemas + validation in/out | §2.1, §2.2 |
| Serialization/route/error conventions | §2.3 |
| Typed module-source client; no primary codegen/tRPC/OpenAPI | §3 |
| Headless vs DOM exports | §4 |
| Host notification/lifecycle contracts | §5 |
| Public API + optional HTML invoke same domain/authorization operations; HTML may call in-process | §6 |
| Renderer-neutral standard-admin descriptions vs implementation-specific custom views | §7 |
| Rich editor/drag-drop/crop/repeater/media/progress lifecycle needs | §8 |
| Unsaved state; local sync/conflict surfacing | §9 |
| Performance targets (finalize §17 proposals with dev) | §14 (adopted as working targets 2026-10-07 — evidence §3) |
| WCAG/CSP/browser support | §15 (and §10 for CSP duties) |
| htmx conditional checks (not adopting htmx) | §13 |
| Reactive fixture within locked bounds; both hosts unchanged services/contracts | §11 |
| Explicit separate candidate comparisons, candidates not defaults | §12 |
| Session-expiry/422 handling; private history isolation | §10, §13 items 4–5 |
| Host owns content DOM; panel mutates only its own DOM | §5 |

**Completeness note:** every task-3.2 acceptance clause maps to a row. The §12 verdicts
remain candidates pending the phase-006 proofs + dev selection; the §14 targets were
adopted as working targets by the dev (2026-10-07, evidence §3) and remain adjustable.
