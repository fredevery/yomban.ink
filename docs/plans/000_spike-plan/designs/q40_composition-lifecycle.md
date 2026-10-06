---
title: "Q40 — composition, installation and invocation lifecycle (provisional design)"
created_session: "20261006_212010_4c6797"
sessions: ["20261006_212010_4c6797"]
approved: false
---

# Q40 — Composition, installation and invocation lifecycle (design)

> **Status: PROPOSED/PROVISIONAL design input for gate Q40 — NOT a closed gate.**
> This is the task 3.1 deliverable
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.1.md`). It proposes the
> **composition/export/installation/lifecycle mechanics** for Yomban.ink within the LOCKED
> constraints: build-time composition only (Q29), registry-provided typed services (Q41),
> unit-of-work atomicity = one D1 database + one prepared-statement batch (Q52), prefixed
> sortable URL-safe TEXT ids via one core id-service seam (Q11), frontend independence
> (Q22/Q25/Q46/Q47), `@yomban-ink/*` repo distribution with no npm publish (Q48), and
> git-tagged semver releases (Q64). The accompanying ADR is **Proposed, not accepted**
> (`docs/decisions/0006-composition-installation-and-lifecycle.md`). **No public starter,
> dashboard, overlay controller or panel is selected** — packaging/execution choices here are
> provisional and reconcile with Q47 (task 3.2) and Q46 (task 3.3); final exports/topology
> close at the joint Q40/Q47/Q46 boundary (phase-007 task 7.8).
>
> **Evidence note:** per plan 000, no composition/dependency/browser-export check, no
> cross-module single-batch rollback proof and no install-mechanics probe has run — no
> harness exists and none is claimed to pass. Install-specifier/semver behaviour is cited
> from documented pnpm semantics and is **UNVERIFIED pending the phase-006 install
> evidence task** (6.1–6.2); nothing here asserts an executed check.
> See `evidence/q40_composition-lifecycle.md` §4 for the unverified list.

## 1. Scope and authority

Grounding sources for this design:

- **`docs/specs/000_index.md` §Canonical gate table** — the authoritative Q40
  owner/evidence/block definition; cited, not restated.
- **`docs/specs/002_module-platform-contract.md`** — manifest contract (§"The module
  manifest contract"), intermodule relationships + UOW participation pointer (§"Intermodule
  relationships"), conformance/boundary enforcement (§"Conformance and boundary
  enforcement"), architectural roles (§"Architectural roles").
- **`docs/specs/003_data-and-migrations.md`** — identifier seam (Q11), unit of work (Q52),
  Q40's ID-mechanics and UOW-participation ownership (§"Deferred design…").
- **`docs/specs/004_clients-and-presentation.md`** — frontend independence, presentation
  surfaces, the Q40-owned topology/cookie/CORS items (§"Undecided UI decisions and gates").
- **`docs/specs/006_cli-and-distribution.md`** — repo distribution under `@yomban-ink/*`,
  command inventory, the Q40-owned install/generated-ownership mechanics (§"Consumption
  and distribution model", §"Deferred design and gates").
- **`docs/specs/007_security-and-identity.md`** — identity conventions (Q11), permission
  grammar and namespace registration (§Permissions), config/secrets lifetime pointers
  (§Configuration and secrets), the Q40 adjacency note (§"Adjacent spike links").
- **`docs/specs/008_operations-and-quality.md`** — observability seam + invocation-scoped
  lifetimes and redaction (§"Runtime and delivery seams"), Q62 targets.
- **`docs/discovery/understanding.md`** — Q8 (roles), Q9 (monorepo; per-side core layout is
  this spike's open sub-question), Q11 (ID mechanics), Q12 (entrypoints; concrete topology is
  a Q40 outcome), Q29/Q30/Q32/Q34/Q39 (composition, core/module, one deployment, slices),
  Q35–Q37, Q39, Q40 (the gate itself), Q41 (registry services), Q44 (CLI inventory), Q45,
  Q48/Q49/Q52/Q53/Q55 (installation transfer, contract semver, UOW, config/secrets,
  observability), Q57, Q62, Q64, Q70 + Amendment 001 (browser-store export boundary,
  opened per session), Amendment 002 (privacy guardrails; Q70 MVP deliverable).
- **Prior phase inputs (accepted/provisional, not closed gates):**
  `designs/q38_capability-inventory.md` (C1–C12 capability inventory + two-axis policy —
  Closed gate, consumed as the capability set this design packages);
  `designs/q54_content-workflows.md` (workflow semantics — INPUT accepted; supplies the
  editing/preview/unsaved-state input for the dashboard/overlay target proposals, §17);
  `designs/q63_persistence-migrations.md` (shared single-D1 placement, ledger/lock, Better
  Auth `core_` base schema, prefixed-TEXT-ID proof — provisional; supplies the migration
  invocation, ID-seam and auth-topology inputs, §§5, 6, 11).

## 2. Export classes and optional facets

Every module package publishes its surface as **explicit export classes** (named
subpath-style export groups; exact path syntax is packaging detail, §4). No `export *`
anywhere (Q25); each class is an explicit, lint-checked boundary (Q61).

| Export class | Audience / environment | Carries | Forbidden in it |
|---|---|---|---|
| **server-only** | Worker/server execution | Route registrations, business services, Drizzle schema/migrations, manifest, queue/cron contributions, permission keys, config schema | Any browser/DOM import; any presentation dependency; any direct binding/secret access (Q25/Q53) |
| **headless / server-safe** | Shared by server and browser | Public DTO types + runtime schemas (Q51), typed client factories (Q47 owns wire mechanics), shared contract code | Server-only imports; private DB row exports; direct or transitive presentation dependency (Q22/Q25/Q51) |
| **browser-safe** | Browser, framework-free | The Q70 datastore capability consumer surface (driver-bound Drizzle instance; Amendment 001 Q40), client-side id generation, browser-safe config reads | Node/Worker-only APIs; server-only imports; presentation dependency |
| **DOM** | Browser, DOM-integrated | Host-notification contracts, DOM entity/field mapping hooks (Q54 §10), overlay-controller-facing integration points | Framework/library dependencies (renderer-neutral, Q47); host content-DOM mutation beyond documented notifications |
| **presentation (optional facet)** | Browser/server HTML where a module contributes UI | Optional HTML fragments/components, hx-* directives if the htmx candidate is later selected, design-token-consistent styles | Anything required for registration; a module is valid with none (Q35) |

Rules binding the classes:

- **Optional facets are declared, not implied:** a module's manifest names which facets it
  supplies (public/admin/nav/editing, with explicit implementation labels — Q35/Q47). A
  service-only module declares none and registers fully (Q35; task-1.2 harness proven).
- **Frontend independence is mechanically enforced:** headless/server-safe and browser-safe
  exports have no direct or transitive presentation dependency — boundary lint
  (Q61), executed in CLI/build/CI before registration. Presentation packages are checked
  separately (Q61) and never weaken CSP/safety (Q59).
- **Browser contract exports must not expose server-only dependencies or private fields**
  (Q25/Q47); the lint boundary distinguishes the classes.
- **The browser-local store is a new export boundary** (Amendment 001 Q40): the Q70
  datastore capability seam's browser surface is exported browser-safe (§14); the
  worker-hosted wasm-SQLite instance is opened **per session**, never at module
  initialization (§9) — consistent with "no binding I/O at module initialization".

## 3. Per-side core layout (Q9's open sub-question, resolved provisionally)

Q9 locked monorepo and deferred "whether the per-side shared core is its own workspace
package(s) or lives inside each side" to this spike. **Provisional selection: separate
workspace packages**, one per export side, all under `@yomban-ink/*`:

- `@yomban-ink/core-server` — server-only seams: registry/wiring, unit-of-work seam,
  routing, config/secrets, observability, auth handler hosting, migration runner host,
  jobs/cache/storage capability seams (the C1–C12 REQUIRED/OPTIONAL seams of Q38 §2/§3).
- `@yomban-ink/contracts` — the framework-free shared surface: public DTO/runtime-schema
  conventions (Q51), typed-client base (Q47 owns wire mechanics), shared error/serialization
  types, enum-aggregation build contract (§12). No server-only or presentation imports.
- `@yomban-ink/clients` — browser-safe/headless client surfaces: browser-safe client
  factories, the Q70 browser datastore consumer seam, browser-safe id generation.

Rationale: export-class separation becomes package separation, so the frontend-independence
lint (Q61) can check package-level dependency graphs (a contract/clients package cannot
accidentally import server or presentation code) and consumers import exactly the sides they
use. This is **provisional** — Q47's contract design (task 3.2) and the phase-006 boundary
proof may re-slice; no root product package layout is authored by this task (execution note).

Module packages mirror the classes: each module ships its declared facets as explicit
export groups of one package (or a small sibling package pair where a module carries both a
headless contract package and a server implementation — Q51's "shared contract package per
module" stays package-addressable).

## 4. Packaging vs execution (PROVISIONAL selection, flagged)

**Packaging (chosen provisionally): static pnpm-workspace packages, consumed at build
time.** The platform is distributed as `@yomban-ink/*` workspace packages installed into the
consumer's monorepo (or consumed in-repo via the workspace protocol); composition is
TypeScript-level wiring executed by the consumer's build — no runtime plugin loader (Q29),
no dynamic module discovery. Trusted compiled modules are not sandboxed (Q25/Q61).

**Execution (chosen provisionally): one Cloudflare Worker per consuming project hosting
all server roles.** Public API routes, the optional HTML/admin/dashboard routes, module
routes, the better-auth handler and the Q70 sync endpoint execute in **one Worker
deployment** (one per project — never multi-tenant, Q32). A separate presentation dev
server exists only when the selected topology needs one (Q14/Q44 — starter-independent,
Q46); SSR of the public starter, once Q46 selects one, executes through the same Worker
unless the starter's accepted design proves a second surface necessary (a Q46 outcome, not
assumed here).

Rejected-for-now alternative (recorded, revisitable at phase-006 proof): splitting
public/admin into separately deployed Workers per role. It is rejected provisionally because
it multiplies cookie/origin/CSRF surfaces (§7), splits the single-D1 unit-of-work story
across deployments (Q52), and buys nothing for the MVP scale; one deployment per project
(Q32) is the locked shape this design preserves.

**Flag: this is the packaging-vs-execution choice Q40 alone owns (Q38/Q8); it is made
PROVISIONALLY here and requires explicit dev acceptance. Final exports/topology wait on the
joint Q40/Q47/Q46 closure (7.8).** No `apps/`/`packages/` root product layout is authored
by this task.

## 5. Composition roots: core imports modules, never the reverse

- **Composition root (per consumer project):** a project-owned entry module generated by
  scaffold (Q44/Q48) that (a) imports `@yomban-ink/core-server`, (b) imports the concrete
  module packages the project selected, (c) passes their manifests to the core's
  **build-time registration** (`registerModules([...])`-shaped call — name provisional), and
  (d) exports the wired Hono application for `wrangler` execution. The root is
  **project-owned generated code**: consumers may edit it; `upgrade` never regenerates it
  destructively (§13).
- **Dependency direction is one-way:** the composition root imports core + modules;
  modules import core seams and each other only via **declared manifest dependencies**
  resolved as registry-provided typed services (Q36/Q41); **core imports no feature
  implementation** — it knows the manifest shape, never a concrete module. Direct imports of
  implementation packages remain allowed for typed shared code only (Q41); runtime
  interaction is registry-mediated. This direction is conformance-linted (Q61) before
  registration.
- **Registration is a build/CLI-time conformance boundary:** the registry validates the
  manifest set — dependency graph acyclicity and ordering (Q36; Q63 §4 consumes the same
  graph), contract-major compatibility (Q49), capability requirements vs the Q38 policy
  (missing REQUIRED fails; missing OPTIONAL degrades explicitly), table-namespace and
  ID-prefix/permission-namespace collisions (Q63 §3, §11), config-schema presence (Q53),
  aggregate-root declarations (Amendment 001 Q35) — **before** any wiring is emitted.
  Deployed request initialization is never a test runner (Q61).

## 6. Route/SSR/auth-handler ownership and hosting topology

- **Route ownership:** each module declares route bases in its manifest (Q35); the core
  mounts them onto the consumer's Hono app at build-time wiring under the module's declared
  base path (Q12). Modules never author wrangler entries for queues/cron (Q56) and never
  touch router conventions of a public frontend framework — **domain operations stay
  outside frontend server-action/router conventions** (Q40; `004` §"Presentation surfaces").
- **Auth-handler ownership:** core owns the better-auth handler mount (one canonical mount
  point in `@yomban-ink/core-server`); modules consume the auth/authorization seam (C5) and
  never register auth endpoints themselves. better-auth does not automatically cover custom
  module routes — every registered module route still enforces server-side authorization and
  applicable CSRF/origin rules (Q59; Q68 owns the concrete profiles).
- **SSR/hosting:** the Worker serves API + optional HTML/SSR in one deployment (§4). Which
  public-starter technology renders SSR is Q46's reopened, unselected choice; this design
  only fixes that the platform does not require a second production server surface and that
  a starter's dev-server needs are topology outcomes, not mandatory conventions (Q14/Q44).
- **Roles stay distinct:** public application, public-site starter, bundled admin
  dashboard, overlay controller and panel remain distinct roles (Q8) — the single
  deployment hosts roles; it does not merge them into one shared renderer. The bundled
  dashboard is an optional first-party module consumer, replaceable/omittable without core
  edits (Q30/Q46).

## 7. Cookies/session propagation; credentialed CORS/trusted origins/CSRF

All of this is **provisional and consumed by Q68** (surface profiles) and Q67 (private
preview isolation); Q40 fixes the topology-level ownership:

- **Session propagation:** browser clients carry the better-auth session cookie;
  server-side SSR/renderer paths and HTML-fragment paths resolve the session **in-process**
  from the incoming request (same invocation) — no cookie re-issue across surfaces; the
  bearer-token path for machine clients and server-side token reads exists per the
  Q63-proven `bearer()` plugin behaviour (q63 design §9 / task 2.4; PROVEN).
  Headless browser clients (Q70 sync surface) propagate the same session cookie on the
  poll/push transport; offline edits remain unlocked-provisional and are authorized only at
  sync acceptance (`007` §"Local-first sync scope").
- **Credentialed CORS + trusted origins:** the core owns a single trusted-origin registry
  configured per environment: local (`wrangler dev` origin(s)), deployed (per-project custom
  domains, Q60), and preview deployments (Q60 — a preview does not imply isolated data).
  Cross-origin browser calls that need credentials are answered only for registered trusted
  origins with explicit `credentials` handling; everything else is same-origin by topology
  (§6). Origin registration is project config (Q53), validated at the same boot boundary.
- **CSRF:** the core applies CSRF/origin enforcement on every cookie-authenticated mutation
  path — API and HTML alike — before module handlers run; `HX-Request` or any presentation
  header is never an authorization boundary (Q59). Exact profile shapes, token mechanics and
  rate limiting are Q68's (this design names the seam; Q68 owns the rules).
- **One deployment, one origin story:** because all server roles share one Worker (§4),
  cookie scope, CSRF and trusted-origin configuration have exactly one authority point — a
  direct consequence of the §4 topology selection and one reason it is preferred.

## 8. Lifecycle: immutable build metadata vs invocation-scoped context

Two disjoint lifetime classes (Q40/Q53/Q55):

**Immutable build/registration metadata** — fixed when the consumer builds/deploys:

- the registered module set, manifests, resolved dependency graph, route table, queue/cron
  wiring, permission/enum aggregates (§12), contract-major acceptance set (Q49), ID-prefix
  registry (§11), and the validated project config *schema* shape.

**Invocation-scoped context** — created per request/event, never cached in module scope:

- the effective runtime configuration values, the environment's binding-derived clients
  (D1/R2/KV/queues) reached **only through core seams**, the user/session/authorization
  subject, the trace/request context, and the unit-of-work (§10).

Rules (locked direction from Q53/Q55, mechanics designed here):

- **No binding I/O at module initialization.** Module factories/initializers receive
  capability *handles* (seam interfaces), never bindings, and perform no I/O at registration
  or isolate-init time. Amendment 001's browser-store rule is the client-side twin: the
  wasm-SQLite store opens per session (§14), never at init.
- **No stale globally cached binding-derived client.** Core derives each binding-backed
  client **per invocation** from the request's `env` and hands it through the seam; modules
  cannot cache them (they never see the binding). A module that caches a seam handle caches
  an interface, never a credential-bearing client — and seam implementations are documented
  as per-invocation. Config/secret *values* are validated per effective runtime
  configuration (Q53 "boot" = per-invocation validation boundary) so a changed secret is
  picked up by the next invocation rather than pinned at cold start; invalid configuration
  fails safely with diagnostics (Q53).
- **Isolate reuse is safe by construction:** because nothing module-scoped carries
  invocation state, a warm isolate reused across requests cannot leak request context
  through globals (Q55: request context cannot leak between invocations). Conformance lint
  forbids module-scope mutable module state that captures env/invocation objects (Q61).

## 9. Observability invocation context; sink completion/failure redaction

- **Invocation-scoped trace/user/service lifetime:** the core creates a trace context per
  invocation carrying trace id, service identity (consumer project + module namespace where
  applicable), authenticated subject reference (id only, never full session payloads) and
  UOW identity; it is handed via the observability seam (C8) and **never** stored on
  globals (Q55).
- **Sink completion within Workers execution:** sinks are project-configurable; the design
  requirement is that a sink write either completes within the invocation's execution or is
  explicitly flushed via `ctx.waitUntil` by the core seam — **a module never awaits or
  manages sink lifecycle itself**. Sink-failure handling (retry/drop policy) is
  implementation design on this seam (Q55), not selected here.
- **Redaction-by-default is the locked guardrail (Q59/Q71):** default logs/traces/
  diagnostics carry no PII, no request bodies, no tokens, no full auth payloads. **Sink
  completion/failure paths obey the same redaction** — a failure diagnostic or a flushed
  buffer never becomes the leak path (e.g. an error report serializing the failed request's
  session). The PII-classification seam (C12) marks fields so redaction is mechanical.
  Q66 owns the best-effort-telemetry vs durable-business-effect distinction.

## 10. Unit-of-work participation contract (Q41/Q52) — provisional interface

The locked rule: registry services **contribute deferred operations to the same single-D1
unit of work rather than independently committing** (Q52). The provisional participation
interface:

- A registry service method invoked inside an active unit of work receives (or resolves via
  the invocation context, §8) a **unit-of-work handle** whose only write operation is
  `contribute(op)` — appending a prepared statement (or a Drizzle-composed operation) to the
  invocation's single batch. Services expose **no independent commit/execute path on the
  handle**: a service that needs its own write outside a caller's UOW opens its own UOW
  explicitly, which is a separate batch — never silently merged.
- **Atomicity stays exactly one database + one batch** (Q52): contributing operations may
  span modules because Q63's dev-accepted placement is one shared D1 database
  (ADR-0005 Decision 1; acceptance recorded in q63 evidence §2);
  the batch rolls back on any statement error. No atomicity is claimed across databases,
  R2, queues or cache purges (Q52/Q66); post-commit invalidation fan-out (Q57) and durable
  effects (Q66) run **after** the batch commits, via their own seams.
- **Cross-module rollback proof:** the executable proof that a module-B service contribution
  rolls back together with module-A's writes in one batch is **task 6.1/6.2's required
  evidence** (canonical gate table Q40 evidence) — designed here, NOT YET RUN.
- Read-dependent invariants inside a UOW use conditional SQL/constraints, not pre-read
  assumptions (Q52); D1 bookmarks/sessions are consistency tools, not transactions (Q45/Q52).

## 11. ID mechanics: algorithm, client finality, namespace collisions (Q11)

- **Algorithm (PROVISIONAL selection):** `<prefix>_<sortable material>` where material is a
  **monotonic-timestamp Crockford-base32 ULID-style value** (48-bit ms timestamp + 80 bits
  randomness, monotonically incremented within a millisecond), matching the base32
  monotonic scheme the task-2.4 harness proved through better-auth's
  `advanced.database.generateId` on real D1 (ADR-0005 §9: `usr_/ses_/acct_/vrf_` PROVEN
  end-to-end). UUIDv7 is the recorded alternative (same properties, hyphenated hex form);
  ULID-style base32 is preferred provisionally for URL-safety and consistency with the
  proven harness. **Dev acceptance required; final choice closes with the gate.**
- **Client finality (PROVISIONAL):** client-generated ids (offline record creation,
  change-set `op_id`s, sync idempotency keys — Q11 Amendment 001) are **final at creation**:
  there is no temporary-then-rekeyed "final" id swap. Uniqueness plus server-side
  dedupe/rejection semantics (same `change_set_id` + same payload → dedupe; same id +
  different payload → client error, surfaced — Q66 Amendment 001) supply safe retry/ownership;
  Q66 owns the reusable idempotency semantics. This avoids a rename/migration class entirely.
- **Namespace collisions:** the manifest's ID-prefix registration (Q35) is the **single
  namespace authority**, reused by permission-key namespaces (`007` §Permissions — one
  authority, not two). Prefix registration and collision checking are **conformance-time**:
  a duplicate entity-type prefix across modules is a registration failure (never discovered
  at runtime); the reserved `core_`/auth prefixes (`usr_`, `ses_`, `acct_`, `vrf_`, ledger/
  lock table naming per Q63 §3) are unavailable to modules. The aggregated prefix set is a
  build artifact like the enum aggregate (§12) — no runtime registry lookup.
- Time-sortable ids do not guarantee global event ordering (Q11); ordering claims ride on
  explicit sequence columns/ledgers, never on id comparison.

## 12. Enum/permission build-time aggregation

- Enums are module-owned (PascalCase `Key = 'Key'`); **aggregation is a build-time step
  producing a derived platform-wide artifact** — the build/CLI collects each module's enums
  and permission keys from source plus manifest declaration and emits the aggregate; there
  is **no central hand-maintained registry and no runtime registry lookup** (Q11/Q61;
  `007` §Identity conventions).
- Permission keys use the locked grammar `<ModuleNamespace>:<Member>` (entity-scoped
  `<Namespace>:<Entity>.<Member>` available); the namespace token registers at the same
  manifest registration point as ID prefixes (§11). Collision rules per `007` §Permissions:
  same member across different namespaces is fine; duplicate namespace or duplicate member
  within a module is a build/conformance error — validated **before registration** (Q61).
- The derived artifact is generated into the consumer's build output (owned: generated,
  §13) and regenerated on every build; consumers never hand-edit it.

## 13. Installation, update and generated-vs-installed ownership (Q48 transfer)

Scope transferred from Q48 to this gate: exact repo/subpackage/tag-semver install mechanics;
generated-vs-installed boundary; consumer updates without regeneration.

**Distribution shape (locked by Q48/Q64, mechanics designed here):**

- All platform packages use scope `@yomban-ink/*`; **no npm publishing** for MVP —
  installation is **from a repository** (Q48).
- Releases are **git-tagged with `package.json` semver**, driven by changesets +
  conventional commits; lockstep and tag-pinning are rejected (Q64).

**Install specifier policy (PROVISIONAL; every syntax claim UNVERIFIED pending the
phase-006 install evidence task — see evidence §4):**

| Consumer situation | Specifier form (provisional) | Notes |
|---|---|---|
| Consumer monorepo carrying platform packages in-workspace (scaffold default) | pnpm **workspace protocol**: `"@yomban-ink/core-server": "workspace:^"` | Workspace resolution within the consumer's own `pnpm-workspace.yaml`; semver-range variant so local packages satisfy declared ranges. **UNVERIFIED**: exact workspace-protocol range semantics per pnpm version. |
| Out-of-repo consumer installing from the Yomban.ink source repository | pnpm **git-URL dependency with semver range**, e.g. `pnpm add github:<org>/<repo>#semver:<tag-range>` (per-package subdirectory via pnpm's subpath/`#path:` support where needed) | Q64's "package.json semver against the repo source" intent. **UNVERIFIED**: the exact git+semver+subdirectory specifier combination pnpm resolves for multi-package repos, and whether a registry-free semver range against git tags resolves as documented. Fallback candidate if git-semver proves unsupported: pin the tag exactly (`#<tag>`), with the `upgrade` CLI owning range advancement — flagged as a dev decision if the probe fails. |
| Spike/consumer-local path installs (fixtures only) | `file:` / `link:` protocols | Evidence/harness use only; never the product distribution path. |

**Semver-range semantics (PROVISIONAL, UNVERIFIED):** platform packages carry independent
package versions (changesets per package; no lockstep — Q64 rejects lockstep). Consumers
declare caret-style ranges against platform minor releases; the core's **contract major**
(Q49) is the compatibility axis the registry checks (current + N-1 accepted; a module
targeting an unsupported contract major fails closed with a diagnostic — `006` acceptance).
Whether pnpm resolves `workspace:^` and git-tag semver ranges identically is precisely what
the phase-006 install harness must observe; this design claims **no verified specifier
behaviour**.

**Generated vs installed (consumer ownership) — the Q40-owned boundary:**

| Class | Ownership | Update behaviour |
|---|---|---|
| Installed/upgradeable | `@yomban-ink/*` packages (core + built-in modules + built-in dashboard/panel presentation packages) | Consumer updates via the package manager + `pnpm upgrade` flow; `upgrade` CLI (Q49) adds contract-major migrations/codemods — **distinct from DB `migrate`** (Q44) |
| Generated, then **project-owned** (scaffold once; never regenerated over) | composition root entry, project `package.json` scripts, `wrangler` config, `.dev.vars.example`, trusted-origin/project config files, AI-orientation artifacts | Scaffold re-runs **must not regenerate consumer-owned files destructively** (`006` deferred-boundary criterion); platform updates reach consumers through package updates, **without requiring regeneration** — the defining non-destructive-update rule (Q48/Q40) |
| Generated, **platform-managed** (regenerated every build) | the enum/permission aggregate artifact (§12), derived TS build outputs | Regenerated; consumers never edit |

**AI-orientation artifacts + AI-fill/conformance boundary (Q48 transfer):**

- **Deterministic artifact list (proposed):** scaffold emits, deterministically (same
  inputs → same outputs): `AGENTS.md` consumer orientation stub, a platform-capabilities
  summary (module set + manifest-declared capabilities), an AI orientation doc enumerating
  the seams a module may use (C1–C12 policy summary) and the boundary rules (no direct
  bindings, no `export *`, no presentation imports into headless), and module-skeleton
  templates for `create module`. The list is **exactly this set unless the dev amends it**;
  nothing here invents extra generated surfaces.
- **AI-fill/conformance boundary:** generated AI-orientation docs are **documentation
  only** — they never substitute for conformance. Any AI- or human-filled module code must
  pass the same registration/conformance checks (Q61) as hand-written modules; the fill
  boundary is "conformance accepts or rejects the result", never "the artifact list trusts
  the fill". This stays **separate from Yomban.ink's own Orca authoring workflow** (Q48:
  consumer scaffolding need not mirror it).

## 14. Q70 browser-store session lifetime (Amendment 001 Q40 boundary)

- The browser-local SQLite store is a **browser-safe export** (§2): the core datastore
  capability seam binds a Drizzle instance to the environment's SQLite driver — D1
  server-side, browser SQLite client-side — same `sqliteTable` schema and same query code
  (Q38 C1; Q70).
- **Session lifetime:** the worker-hosted wasm-SQLite instance is **opened per session** and
  closed/relinquished at session end (Amendment 001 Q40: "opened per session") — never at
  module initialization, never cached as a module-scope global (mirrors §8's no-stale-global
  rule client-side). OPFS persistence is per Q70: `navigator.storage.persist()` requested,
  `navigator.storage.estimate()` monitored, Class-1 authored data physically separated from
  Class-2 cache.
- The client store sits **outside** the server UOW by definition (local writes are one local
  SQLite transaction; sync maps one change-set onto one server D1 batch — Q52 Amendment
  001); presence leases are advisory, never atomicity (Q52).
- The detailed mechanics (driver selection, OPFS, sync protocol) are **task 3.4's (Q70)
  design** — this section fixes only the export boundary and lifetime ownership Q40 owes.

## 15. Contract current+N-1 upgrade vs DB migration (Q49/Q63 interface)

- **Contract semver is package/code territory:** the module contract (manifest shape +
  registry interfaces) carries its own major; modules declare their target major; the core
  accepts **current and N-1** (Q49 — locked). Moves between accepted majors go through the
  **`upgrade` CLI + codemods**, which is package/code/contract work, **distinct from DB
  `migrate`** (Q44/Q63).
- **DB migration is orthogonal and ledger-driven:** schema/data migrations run through the
  Q63 core runner (ledger `core__migrations`, lock+fencing, topological order) whenever the
  installed module set changes its pending migration set — triggered by the `migrate`
  command and/or the deploy path (Q63 §6 leaves release-vs-migrate orchestration to this
  design). **Provisional orchestration:** `migrate` runs as an explicit step in the golden
  path (scaffold → create module → **migrate** → dev → deploy, Q7/Q44); deploy does not
  silently migrate — the Q63 lock/fencing primitive makes a CI-invoked `pnpm migrate` safe
  against concurrent deploys, and phase-006 evidence must exercise that ordering. This
  split (upgrade ≠ migrate) is what keeps a contract-major jump from ever implying a
  schema change without an explicit, ledger-recorded migration.
- A module pinned below the accepted window fails registration closed with a clear
  diagnostic (`006` acceptance); it is never silently feature-detected (Q49 rejects
  feature-detection).

## 16. Provisional effect/security/consistency interfaces (Q66/Q67/Q68)

Q40 names the seams those gates must satisfy; it selects none of their mechanisms:

- **Q66 (durable effects):** a UOW's commit is the boundary — post-commit enqueue/cache
  effects are **not** atomic with the batch (Q52). The Q66 seam must accept per-effect
  idempotency keys (the Q70 `change_set_id` pattern generalizes) and payload contract
  versions with the current+N-1 acceptance window (Amendment 001 Q66). Registry-service
  participation (§10) must compose with Q66's outbox/recovery evaluation without
  redesigning it.
- **Q67 (consistency/preview):** publish/preview surfaces call the same domain operations
  (Q51); the invalidation fan-out hooks (Q57) are invoked post-commit through core. Author
  read-your-writes, public staleness and preview-isolation guarantees are Q67's; this
  design only guarantees the invocation-context and single-deployment shape they build on.
- **Q68 (security/bootstrap):** the trusted-origin registry, session propagation and CSRF
  seams of §7 are Q68's input surface profiles' host; first-admin bootstrap, auth methods,
  rate-limit storage and profile shapes are Q68 outcomes. The single-deployment topology
  (§4) is what makes Q68's "every registered surface carries a profile, no opt-out"
  enforceable at one mount point.

## 17. Dashboard/overlay performance-target PROPOSALS (with Q47; Q54 input)

Q62 locks public LCP < 2.5s / INP < 200ms for the public reference frontend only, unchanged.
Dashboard/overlay targets must be set in Q40/Q47 using Q54 workflow input **before
implementation**, not copied from public budgets. Using the accepted Q54 workflow input
(deliberate + ~1–2s debounced saves; optimistic-revision rejection surfaced; lock/state
surfaces), the following are **PROPOSALS for Q47 (task 3.2) to finalize with the dev — not
adopted targets**:

- **Bundled dashboard (admin lists/edit surfaces):** LCP ≤ 3.0s and INP ≤ 200ms on a
  representative dashboard list view; navigation between dashboard views INP ≤ 200ms.
  Rationale: admin surfaces are authenticated, cache-isolated (Q67) and carry more chrome
  than public pages; 3.0s bounds perceived load while remaining stricter than a lax default.
- **Overlay editing panel (in-situ):** **first-edit readiness** — from overlay activation
  to an editable field accepting input ≤ 1.0s (the Q54 editing workflow's interaction point
  is the overlay, not a page load); save acknowledgement feedback ≤ 100ms after the debounced
  save fires, with the Q54 truthful-acknowledgement rule (no false success on stale/failed
  saves).
- **Measurement basis:** measured on the two acceptance fixtures' host surfaces (plain +
  reactive fixture, `004` §Acceptance) with representative Q54 field kinds; bounded
  candidate measurements support selection and never claim the unbuilt MVP meets them
  (plan 000 evidence rules).
- These proposals ride to Q47 for finalization; Q62 public budgets are unchanged.

## 18. What this design does not decide

- **No public starter, dashboard, overlay controller or panel is selected** — Q46/Q47 own
  those choices; the Hono/htmx dashboard and plain-TS-controller/htmx-panel candidates
  remain evaluation candidates only (Q40/Q46/Q47). Final exports/topology close jointly
  (7.8).
- **No root product package layout is authored** (execution note) — §3/§4 select the
  *shape* (workspace packages, one Worker), not the repo's directory tree.
- **No Q47 wire mechanics** (route shapes, validation, serialization, error conventions,
  browser-safe export details) — Q47's (§2 cites the boundary only).
- **No Q70 sync/driver mechanics** — task 3.4's; §14 fixes the boundary/lifetime only.
- **No Q66/Q67/Q68 mechanisms** — §16 names requirements and seams only.
- **No verified install-specifier behaviour** — §13's table is provisional; the phase-006
  install evidence task observes actual pnpm mechanics before any specifier is treated as
  designed fact (evidence §4).
- **No product code** — everything here is designed; composition/dependency/browser-export
  checks, cross-module single-batch rollback and the install probe are later tasks' harness
  evidence.

## 19. Requirement matrix

Each Q40 scope bullet (canonical gate table + task 3.1 acceptance wording, with the spec
sections it maps to) resolved to the design section:

| Q40 scope item (source) | Resolved in |
|---|---|
| Export boundaries: server-only / headless-server-safe / browser/DOM / presentation; optional facets (`002` §manifest; Q38 C11; Q35) | §2 (+ §3 package split) |
| Per-side core package layout (Q9 open sub-question) | §3 (provisional; flagged) |
| Composition roots importing core+modules without core importing features (Q29/Q36/Q41) | §5 |
| Packaging-vs-execution for public app / starter / bundled admin / overlay controller / panel (Q8) | §4 (PROVISIONAL, flagged) |
| One-deployment-per-project topology (Q32) | §4, §6 |
| Route/SSR/auth-handler ownership (Q12/Q40; `004` §Undecided) | §6 |
| Browser/SSR cookies/session propagation (`004` §Undecided; Q63 §9 bearer) | §7 |
| Credentialed CORS/trusted origins/CSRF local/deployed/preview (`004` §Undecided; Q59) | §7 (profiles = Q68) |
| Immutable build metadata vs isolate-init/invocation env/user/session/UOW/trace; config/secret changes; service lifetime (Q53/Q55) | §8, §9 |
| No binding I/O at init; no stale globally cached binding-derived client (Amendment 001 Q40; Q53) | §8 (client twin §14) |
| Sink completion/failure redaction (Q55/Q71) | §9 |
| Registry services contribute deferred ops to ONE D1 batch; no independent commit; cross-module rollback proof (Q41/Q52) | §10 (proof = task 6.1/6.2 evidence) |
| ID algorithm / client finality / namespace collisions (Q11) | §11 (algorithm+finality PROVISIONAL) |
| Enum/permission build-time aggregation (Q11/Q61; `007` §Permissions) | §12 |
| Exact repo/subpackage/tag-semver install/update; generated-vs-installed ownership; non-destructive updates (Q48/Q64 transfer; `006` deferred-boundary) | §13 (specifiers UNVERIFIED) |
| Deterministic AI artifacts + AI-fill/conformance boundary, separate from Orca workflow (Q48) | §13 (AI artifacts) |
| Contract current+N-1 upgrade vs DB migration (Q49/Q44/Q63) | §15 |
| Q70 browser-store session lifetime (Amendment 001 Q40) | §14 (mechanics = task 3.4) |
| Provisional effect/security/consistency interfaces (Q66/Q67/Q68) | §16 |
| Dashboard/overlay performance targets with Q47/Q54 before implementation; public unchanged (Q62) | §17 (PROPOSALS) |
| Evaluation candidates remain candidates; no silent adoption (Q40/Q46/Q47) | §4, §18 |
| Evidence: composition/dependency/browser-export checks, cross-module single-batch rollback, two-host editing proof (canonical gate table) | mapped to phase-006 tasks 6.1–6.3; **NOT YET RUN** (evidence §4) |

**Matrix completeness note:** the design labels above are the design's own device (the
canonical gate table does not letter its bullets); every task-3.1 acceptance clause maps to
a row, and rows marked PROVISIONAL/UNVERIFIED require explicit dev acceptance before any of
this content is treated as settled.
