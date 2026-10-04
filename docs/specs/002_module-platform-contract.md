# Yomban.ink: module platform contract

Status: Specification baseline derived from answered discovery; no implementation is selected beyond the decisions marked locked below. Several design questions the module contract depends on remain deferred foundational work; ADRs referenced here are planned, not yet written.

## Purpose

This specification defines Yomban.ink as a platform: the core/module boundary, the module manifest contract, the inter-module runtime mechanism, and the gates that must close before foundational implementation begins. It is the contract that consuming projects and third-party module authors rely on, so it is deliberately framework-free and composed at build time. [Q1, Q28, Q29, Q35, Q38–Q41]

## Product framing

Yomban.ink is a **modular, composable application platform — not a CMS**. Content, administration and editing are built-in module capabilities; a full CMS is something a consumer can compose from modules. Built-in features are ordinary modules on equal footing with custom modules (no privileged access), so custom modules compete on the same contract. A service-only module—no client UI, no presentation—is valid and can register and operate. [Q1, Q28, Q39, Q43]

## Locked decisions and constraints (non-negotiables)

- **Build-time composition, no runtime plugins.** Modules are packages installed into the project's monorepo and wired by the core at build; there is no runtime plugin loader and trusted compiled modules are not sandboxed. [Q5, Q18, Q22, Q25, Q29, Q61]
- **Monorepo, one deployment per project.** No multi-tenancy; each consuming project is its own deployment. [Q9, Q32]
- **Vertical capability slices.** A module owns a whole feature end-to-end—its contracts, routes, business logic, schema/migrations and whichever optional UI/client facets it supplies. No horizontal "all controllers" layer and no requirement to ship every server/client/presentation half. [Q28, Q34]
- **Frontend independence is locked.** Core services, shared contracts and headless clients have no direct or transitive dependency on presentation frameworks/libraries (including Svelte/SvelteKit and htmx). Presentation/UI facets are optional for modules and consumers, not prerequisites for registration or non-UI capabilities. This is not backend portability: Workers, Hono, better-auth, TypeScript, pnpm and D1/Drizzle are selected. [Q1, Q13, Q22, Q25, Q45–Q47, Q51]
- **No `any`, no `export *`, strict dependency direction.** Modules depend on core (never core on module); module-to-module interaction is only through declared manifest dependencies. Shared typed-code imports obey declared dependency/export boundaries; concrete runtime services are supplied by the registry. [Q20, Q22, Q25, Q36, Q41]
- **Registry-provided typed services is the intermodule runtime mechanism.** A module's manifest declares what it exposes; dependents receive typed service instances from the core-resolved registry. Direct imports of implementation packages remain allowed for typed shared code, but runtime interaction goes through the registry. There is **no event bus in the MVP**; it remains a possible future addition, not the MVP mechanism. [Q36, Q41, Q56]
- **Module contract semver: current + N-1.** The module contract (manifest shape + registry interfaces) carries its own major version; modules declare which contract major they target; the core accepts current and N-1 majors; an upgrade CLI plus codemods handle moves. Lockstep and feature-detection are rejected. Upgrade is separate from DB `migrate`. [Q44, Q49]
- **Branding and distribution.** Package scope `@yomban-ink/*`; no npm publishing for MVP—installation from a repo. Release/versioning uses git-tagged releases with package.json semver driven by changesets and conventional commits. [Q48, Q64]
- **Identity and ownership.** Product/repository name: Yomban.ink / `yomban.ink`; name derives from Xhosa *yombane* (“electric”), framed as “digital tattoos for the internet / electric ink.” Sole owner/maintainer: Fred Every (`fred@fredevery.co.za`); greenfield solo project. [Q2–Q4]
- **No direct binding or datastore access.** Modules never directly access Cloudflare bindings, raw SQL outside Drizzle, or secrets; they use core service/capability seams. Datastore is one capability, not a uniform abstraction for database/storage/cache/queues/auth. The **client datastore capability (Q70)** extends this: core binds a Drizzle instance to the environment's SQLite driver (D1 server-side, browser-local SQLite client-side) so modules name no driver and still never touch a binding. [Q22, Q25, Q30, Q45, Q53, Q70]

## Architectural roles

Public application, public-site starter, bundled admin dashboard, overlay integration controller and overlay editing panel are **distinct roles**, not a single shared renderer, and none is selected. The bundled admin dashboard is an optional first-party consumer of ordinary module capabilities, not an inseparable core component; replacing or omitting it must not disable non-UI capabilities. The host integration maps editable DOM to entity/field references and retains ownership of the content DOM; panel presentation is separate. Q40 alone owns packaging-versus-execution, composition roots and deployment topology; Q47 owns headless/host/presentation interfaces. [Q8, Q30, Q47]

The [high-level overview diagram](../discovery/highlevel-overview-diagram.svg) is conceptual evidence, **not** an implementation or package-layout prescription: admin elements indicate feature responsibility, not necessarily server execution, and mirrored sides do not make every UI facet mandatory. The diagram selects no frontend framework or presentation library. [Q8]

## What the core provides vs what a module provides

**Core** provides cross-cutting scaffolding and framework-free service/capability interfaces for datastore, storage (R2), filesystem, caching, authentication/authorization, routing, configuration, jobs and observability, plus required host/headless seams. The complete inventory is owned by Q38 and is not yet final. Core provides the migration runner and the unit-of-work seam. The datastore capability seam binds a Drizzle instance to the environment's SQLite driver (D1 server-side, browser-local SQLite client-side) so module code names no driver (Q70). Core does not impose any public/frontend/panel framework. (The `apps`/`modules` layout is proposed, not pre-selected package boundaries.) [Q14, Q30, Q34, Q37, Q52, Q55, Q56, Q57]

**A module** supplies feature services, routes, business logic, schemas/migrations and optional client/presentation facets on those contracts. Feature capabilities are ordinary modules; core does not own feature media records (an ordinary media module does, while core provides R2 infrastructure and upload/transform contracts). [Q30, Q37, Q39, Q58]

## The module manifest contract

A module is declared through a manifest/registry that the core reads to wire it at build time. UI attributes/components/HTML fragments are not the mandatory module contract, string or otherwise; renderer-neutral descriptions cover standard admin screens while custom views are explicitly implementation-specific. A manifest declares [Q35, Q11, Q36, Q37, Q41, Q45, Q49, Q50, Q53, Q56]:

- Module **identity and version**, and the **target contract major** it is built against (Q49).
- Declared **module dependencies** and **exposed services** (Q36/Q41).
- **Required core capabilities** and **named D1 database/binding requirements** consumed (Q45). D1 only for MVP; these name requirements, not a datastore-agnostic schema. Drizzle remains the schema/query language; no query-builder abstraction.
- **Owned entities/schema and migrations** (Q37/Q63), with migration mechanics pending; the module also declares its **aggregate roots** — the Q70 sync-and-lock units — and the child tables that ride under each root, since locks, revisions and conflict attach to the root and child rows inherit it.
- **ID prefix registration** (Q11): globally-unique, sortable, URL-safe TEXT ids with an entity-type prefix; no INTEGER auto-increment PKs. This registration point is the **single namespace authority** — permission-key namespaces reuse it rather than introducing a second registry.
- **Module-prefixed permission keys**, enum-defined per the PascalCase `Key = 'Key'` convention (Q50); roles map to permission sets, with resource-level checks where needed. The aggregated key grammar (`<ModuleNamespace>:<Member>`), its collision rule and cross-module composition semantics are defined in [Security and identity](007_security-and-identity.md) §Permissions.
- **Config schema** (Q53), validated by core against each effective runtime configuration; secrets reach modules only through a core seam, never direct binding access.
- **Queue consumers/cron/job contributions** (Q56): manifests declare these and core wires them at build; consumers do not author wrangler entries directly.
- **Optional** public/admin/nav/editing **presentation contributions with explicit implementation labels** (Q35, Q47, Q62).

Route bases apply only where routes exist; UI entries are not mandatory for service-only modules. Core resolution/conformance checks validate the dependency graph, contract compatibility, names/prefixes and required capabilities without importing a specific presentation. [Q35]

## Intermodule relationships

Modules may depend on/extend other modules through declared manifest dependencies resolved as a dependency graph—no monkey-patching. Runtime interaction is locked to registry-provided typed services (Q41). Registry services must contribute deferred operations to the same single-D1 unit of work rather than independently committing; the exact participation contract and proof of cross-module rollback are owned by Q40 against Q52's single-database/batch atomicity. [Q36, Q41, Q52]

## Conformance and boundary enforcement

A boundary-lint + contract/conformance harness ships at MVP. Conformance runs as executable checks **in CLI/build/CI before build-time registration**; deployed request initialization is not a test runner. It enforces dependency direction, no `export *`, no direct module bindings, declared module dependencies/contract compatibility, and browser-safe exports. Core/headless/shared-contract packages have no direct or transitive frontend/presentation dependencies; optional presentation packages are checked separately, and trusted compiled modules are not sandboxed by lint. The exact manifest/export/lifecycle interfaces for the harness come from Q40/Q47. Enum/permission-key aggregation is a build-time step producing a derived platform-wide artifact; conformance validates its names/prefixes/collisions before registration (no runtime registry). [Q22, Q25, Q61]

## Workflow and unit of work

Modules declare transactional boundaries and use the core unit-of-work seam over D1 batch, never raw binding transactions. Atomicity is one D1 database and one prepared-statement batch; it is not atomic across databases, R2, queues or cache purges. Conformance is build-time; durable business effects, retries and idempotency (Q66) and cache/read-your-writes consistency (Q67) are separate affected-work gates and are not implied by registration. [Q52, Q61, Q66, Q67]

## Enumerating what this specification deliberately does not decide

Per the authoritative gate inventory (Q19), the following are foundational prerequisite designs that must close before foundational implementation. Each produces **one ADR plus a concrete design and verification evidence** — an ADR alone is not closure. The planned ADRs below are planned, not existing, and recording a candidate is not an approval.

## Deferred design, owner, evidence and block

### Q38 — Core capability inventory (first foundational gate)
- **Owner/design:** inventory of server/core/headless-client capabilities and the required-versus-optional capability policy.
- **Evidence:** one ADR, the concrete inventory and capability checks, using Q42's completed shared-platform implications as audited input rather than reopening locked choices verbatim.
- **Block:** blocks Q35 capability verification, finalized Q25/Q30 boundaries, Q37 auth/base infrastructure inventory, and foundational implementation start.
- **Boundary:** inventories capabilities; it does **not** decide packaging-versus-execution, which Q40 alone owns. [Q19, Q38]

### Q40 — Package/export/composition/deployment/installation/lifecycle (foundational, alone owns package-vs-execution)
- **Owner/design:** concrete package/export/wiring/deployment design. Owns server-only, headless/server-safe, browser/DOM and optional presentation export boundaries; optional module facets and composition roots importing core + concrete modules without core importing feature implementations; per-side core package layout; packaging-versus-execution for public app, starter, admin, controller and panel; route/SSR/hosting topology and auth-handler owner (cookies/session propagation, credentialed CORS/trusted origins/CSRF, one deployment per project); install/generated-ownership mechanics, repo/subpackage/tag-semver install rules, consumer updates without regeneration, and the deterministic AI-orientation artifact list and AI-fill/conformance boundary; immutable build metadata vs invocation-scoped context and service lifetime (no binding I/O at module initialization, no stale globally cached binding-derived client); ID mechanics/prefix collisions and the build-time enum/permission aggregation artifact; and registry services contributing deferred operations to the same single-D1 unit of work.
- **Evidence:** one ADR plus design and verification evidence, including cross-module rollback proof and served-effective-config validation.
- **Close:** final export/topology choices close together with Q47 after Q54 supplies workflow semantics.
- **Block:** blocks composition, installation, lifecycle, and related packaging implementation until closed; public starter/dashboard/controller/panel remain unselected. [Q19, Q40, Q41, Q44, Q48, Q52, Q53]

### Q47 — Framework-free client/wire/host/presentation (foundational)
Frontend independence and shared contract packages (Q51) are locked; this spike designs mechanics, not whether to support them. Owns browser-safe exports, public DTOs derived from stored types, independent shared runtime schemas, route input/output validation, serialization/API/error conventions, separate DOM integration from headless code, and explicit dashboard/controller/panel implementation choices (no candidate is approved by implication). Blocks module client/wire/host interfaces and final Q40 exports. [Q19, Q47, Q51]

### Q46 — Reopened public-site starter
The public-site starter choice is explicitly reopened with none selected. Frontend independence is locked regardless. Blocks starter scaffolding and MVP public-client implementation. [Q19, Q46]

### Q54 — Content/publishing/editing
Content types/fields, draft/review/publish/schedule/revision semantics, preview permissions and DOM-to-entity host integration, with one ADR plus workflow/evidence tests. Blocks built-in content/workflow implementation, in-situ editing and pilot content requirements. [Q19, Q54]

### Q63 — Database placement and migration mechanics
Shared/separate D1 placement, namespace/collision rules, dependency ordering, ledger/history, concurrent-deploy locking, failure/retry, data-vs-schema migrations, Better Auth base-schema generation/integration and safe module removal/retention. Must prove Better Auth compatibility with core-generated prefixed TEXT ids against the selected Drizzle/D1 adapter; a failed check blocks auth work and is surfaced, not silently resolved by integer IDs. Blocks schema/migration/Better Auth persistence implementation and foundational implementation start. [Q19, Q37, Q45, Q63]

### Q70 — Client datastore capability and sync (additive foundational gate)
The browser-local SQLite store (the same SQLite dialect as D1, driven through the core datastore capability) plus the op-log sync layer: change-sets, presence leases, field-level conflict surfacing and server-authoritative working-set scope. Reopens no locked decision and adds no query-builder abstraction; owned in spike plan 000. Blocks the client-local store and sync/lock/conflict implementation, not unrelated work. [Q38, Q40, Q45, Q52, Q66, Q67, Q70]

### Q65–Q68 — Affected-work gates (not blanket pre-implementation gates)
Each closes before its own affected implementation and before MVP deployment, but does not block unrelated implementation whose own prerequisites are satisfied: **Q65** backup/retention/restore; **Q66** durable effects/retries/idempotency; **Q67** author read-your-writes, public propagation and preview isolation; **Q68** security surface profiles, rate limiting and auth/first-admin bootstrap. [Q19, Q65–Q68]

## MVP criteria (module-platform scope)

- A clean generated project installs, runs, tests and deploys; the golden path is scaffold → create module → migrate → dev → deploy. [Q7, Q31, Q44]
- Build-time composition wires installed modules into the app; built-in and custom modules register and operate on the same contract with no privileged access. [Q29, Q39]
- Module manifests declare identity/version, target contract major, dependencies, exposed services, required capabilities, named D1 requirements, schema/migrations, ID prefix, permissions, config, jobs and optional labelled UI contributions; conformance checks run in CLI/build/CI before registration. [Q35, Q49, Q61]
- A representative pilot-derived scenario is deployed from scaffold with zero core edits; a service-only module registers without UI facets. [Q7, Q28, Q33, Q39, Q42]
- The frontend-independence proof holds: plain HTML/server-rendered and bounded reactive-framework host fixtures read/edit/publish the same content through unchanged module services/contracts; these are acceptance fixtures, not additional production renderers. The fixture's minimal scope is defined in [Clients and presentation](004_clients-and-presentation.md) §Acceptance criteria. [Q7, Q47, Q61]
- MVP deployment is gated on Q38/Q40/Q54/Q63 foundational closure and on Q65–Q68 affected-work designs/evidence. [Q19, Q60, Q65–Q68]

## Post-MVP scope and explicit non-goals

- Full pilot rebuilds follow MVP; the Q42 audit lists candidates and shared-platform implications, not a commitment to implement every audited module. [Q7, Q33, Q42]
- An event bus/pub-sub remains a possible future addition, not an MVP mechanism; its webhook/integration payoff is real but deferred. [Q41, Q54]
- Search, mobile/Capacitor delivery, additional complete production UI implementations, and the purpose/dogfooding of the `yomban.ink` site are post-MVP; Q69 does not block platform/scaffold work. [Q6, Q19, Q46, Q54, Q69]
- Runtime plugin loading, multi-tenancy, third-party module marketplace, scaffold-into-existing-project, an unordered datastore abstraction, and backend/frontend framework coupling are not goals. [Q5, Q18, Q22, Q25, Q32, Q45]

## Related specifications

- [Specification index](000_index.md)
- [Product and MVP](001_product-and-mvp.md)
- [Data and migrations](003_data-and-migrations.md)
- [Clients and presentation](004_clients-and-presentation.md)
- [Content and editing](005_content-and-editing.md)
- [CLI and distribution](006_cli-and-distribution.md)
- [Security and identity](007_security-and-identity.md)
- [Operations and quality](008_operations-and-quality.md)
- Historical discovery: [understanding.md](../discovery/understanding.md); amendment record: [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)