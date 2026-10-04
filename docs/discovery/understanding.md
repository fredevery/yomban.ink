---
title: Understanding file — Yomban.ink (project scope)
created_session: "20261003_134410_6d11cd"
sessions: []
approved: false
---

# Agent's current understanding

> The durable project-scope understanding file (Orca, plan_008) for the **`/onboard-new`**
> of **Yomban.ink** (repository `yomban.ink`). It pools the agent's understanding of the whole project in the shared B3
> grammar, seeded from the §5 discovery questionnaire groups A–H
> (`docs/discovery/project-onboarding-discovery.md`). Group I (migration-specific) is
> skipped — this is a greenfield project, not a migration.
>
> At run start the project was an **empty directory** (no git repo, no files) whose
> `yomban.ink` domain does not resolve; the only known fact is the name. Every `Agent
> default` below is therefore a provisional read, and answers come from discussion — the
> questionnaire is probed in **small groups** (this file grows as groups settle), never
> speculated from a codebase mine.
>
> Status machine: OPEN / ANSWERED / DEFAULTED / DEFERRED. The WRITE state refuses to persist
> any baseline layer while any question is OPEN; every OPEN must become ANSWERED, DEFAULTED,
> or DEFERRED (with the dev aware) before `scripts/validate-understanding.py` passes. DEFERRED
> does not imply post-MVP: Q19 distinguishes foundational prerequisites, affected-work gates
> and the explicit post-MVP website decision. Every deferral names its outcome and blockers. (That
> questionnaire and validator are framework-source references — they are not present at those
> relative paths in this project.)
>
> Current understanding at a glance: Yomban.ink is a **modular, composable application
> platform**, not a CMS, on Workers + Hono + better-auth + TypeScript + pnpm with D1/Drizzle.
> **Frontend independence is locked**: core/contracts/headless capabilities do not require
> any frontend framework/presentation library; optional UI consumes the same capabilities.
> **No public-site starter, dashboard, overlay controller or panel implementation is selected.**
> The former SvelteKit public starter choice is explicitly reopened (Q46). Hono/htmx dashboard
> and plain-TypeScript-controller/htmx-panel are **evaluation candidates**, not adopted stacks.
> The MVP ships a deployed end-to-end scaffold with working content/admin/editing surfaces
> and a representative pilot-derived zero-core-edit deployment proof; full pilot rebuilds follow.
> Foundational designs precede implementation; Q65–Q68 close before affected work and MVP
> deployment; Q69 site purpose is post-MVP and does not block platform work (Q19). Nothing
> is implemented yet. Where an Agent default and an Answer disagree, **Answer governs**;
> defaults are historical first guesses, not current choices. This file incorporates
> `docs/discovery/review-03-gpt-6.1-sol.md` with the dev's explicit clarification answers;
> recording a candidate or an ADR does not approve its adoption.
>
> **Amendment 001** (`docs/discovery/understanding-amendments-001.md`) records the
> local-first client datastore + sync capability (new Q70), resolves the custom
> query-language deliberation as NOT reopened, and amends Q10/Q11/Q35/Q37/Q38/Q40/
> Q45/Q52/Q54/Q66/Q67. No locked decision is reopened; the capability is additive.
>
> **Amendment 002** (`docs/discovery/understanding-amendments-002.md`) records the
> privacy / personal-data scope (new Q71: platform-guardrailed, per-project-policied,
> extended to client-local data) and confirms **Q70 (local-first client datastore +
> sync) is an MVP deliverable**. It amends Q7/Q59/Q65/Q70. No locked decision is reopened.

### Q1 — What is the project?

- Context: Identity & purpose (§5 A → Layers 1, 2): the problem it solves, who it's for, why it exists.
- Agent default: Unknown — the repo is a fresh, empty directory named `yomban.ink`; likely a web product/brand at that domain. Awaiting the dev.
- Answer: Yomban.ink is a **modular, composable application platform**, not a CMS (Q43). Modules own feature capabilities; core supplies cross-cutting infrastructure and framework-free capability contracts. Built-in modules include content/admin/editing, and consuming projects can add custom modules. **Frontend independence is locked:** consuming applications choose their frontend; core services, shared contracts and headless clients do not require a presentation framework/library. Presentation is an optional module facet; a working bundled dashboard/editing experience ships in the MVP but consumers can replace or omit it. No public-site starter, dashboard, overlay controller or panel implementation is selected yet (Q40/Q46/Q47); htmx is an evaluation candidate only. Motivation: avoid re-implementing common server/API/UI scaffolding across the dev's projects. The backend remains Workers + Hono + better-auth + TypeScript + pnpm, D1/Drizzle; frontend independence does not reopen these choices.
[STATUS: ANSWERED]

### Q2 — What is the product name, and what is the repository name?

- Context: The two can differ; both feed the entry point (§5 A → Layer 1).
- Agent default: Product name likely "Yomban.ink" (or similar; historical provisional guess); repository/dir name `yomban.ink`.
- Answer: Product name: **Yomban.ink**. Repository/domain name: **yomban.ink**. Etymology: *yombane* is Xhosa for "electric" → the framing is "digital tattoos for the internet / electric ink".
[STATUS: ANSWERED]

### Q3 — Who owns / maintains it?

- Context: Person, email, and any role/permission split (§5 A → Layers 1, 3).
- Agent default: Unknown — to be settled with the dev (may be a Fuxe.digital build or a client project).
- Answer: Sole owner/maintainer: **Fred Every, fred@fredevery.co.za**. Solo project — no role/permission split.
[STATUS: ANSWERED]

### Q4 — What is the current phase / maturity?

- Context: Spec / in development / maintenance / legacy (§5 A → Layer 1).
- Agent default: Greenfield — just started, no code yet.
- Answer: **Greenfield** — brand-new, just started, no code yet (spec stage).
[STATUS: ANSWERED]

### Q5 — What is in scope today? What is explicitly out of scope (non-goals)?

- Context: Scope boundaries that keep the MVP honest (§5 B → Layers 1, 6).
- Agent default: In scope — the platform core (Cloudflare Workers + Hono + better-auth), the module system (manifest/registry, build-time composition into `apps/api` + `apps/web|mobile`), the CLI (scaffold + AI scaffolding, create-module, migrate), and the CMS/content capability (admin dashboard + in-situ editing). Non-goals — runtime plugin loading, multi-tenancy, third-party module marketplace.
- Answer: **In scope:** platform core (Workers + Hono + better-auth); module manifest/registry and build-time composition; CLI scaffold/AI orientation, create/add/remove/list module, migrate, upgrade, dev/build/deploy (Q44); a functional built-in content dashboard and in-situ editing experience, ordinary module capabilities rather than platform identity. The public-site starter and dashboard/controller/panel implementation choices are prerequisite design work (Q40/Q46/Q47/Q54), not selected stacks. Presentation packages/starters are optional for consuming projects; core/headless capabilities work without them. **Non-goals:** runtime plugin loading, multi-tenancy, third-party module marketplace, scaffold-into-existing-project for MVP, mobile delivery and multiple complete production frontend renderers in MVP.
[STATUS: ANSWERED]

### Q6 — What features/ideas have been deferred, and why?

- Context: Scope/gate distinctions feed Q19 and later backlog; onboarding deferral is not automatically post-MVP work.
- Agent default: None deferred yet — greenfield; the only deferred items are the exploration spikes.
- Answer: Exploration questions in **Q19 (authoritative inventory)** are deferred only from onboarding, not silently backlogged: foundational spikes must conclude before implementation begins; Q65–Q68 must conclude before their affected work begins and before MVP deployment, as explicitly confirmed by the dev. **Post-MVP deferrals:** search (Q54), mobile/Capacitor delivery and additional complete public-site starters/UI implementations (Q46/Q47), and the purpose/dogfooding of yomban.ink itself (Q69). Q69 does not block platform/scaffold implementation. The Q42 pilot audit is complete; full pilot rebuilds follow MVP (Q7).
[STATUS: ANSWERED]

### Q7 — What is the MVP / current milestone, and what comes after it?

- Amendment 002 (see [understanding-amendments-002.md](understanding-amendments-002.md)): the MVP additionally ships the **Q70 local-first client datastore + sync** experience. MVP client scope = scaffold + bundled dashboard + selected public-site starter + local-first store/sync + the two acceptance fixtures.

- Context: The immediate deliverable and the near-term sequence (§5 B → Layer 6).
- Agent default: MVP = a working scaffold that can generate a project, create + wire a module, run migrations, and boot an app with one built-in module; then prove it by rebuilding the two pilots on it.
- Answer: The MVP must **ship end-to-end** — a deployed Worker and working client, not merely a local scaffold — robust enough to begin live projects. Sequence: prerequisite spikes (Q19) → MVP (deployed end-to-end) → full rebuilds of the two pilots. **MVP completion gate confirmed by the dev:** a representative pilot-derived scenario runs from scaffold to deployed with **zero core edits**; a full pilot rebuild is not required for MVP. The MVP plan selects its proving modules from the completed Q42 audit without committing to every audited candidate. Acceptance covers a clean generated project that installs, runs, tests and deploys; authentication and server-side permissions; authorized content editing and publication reflected in the deployed client; migrations from empty and existing databases; documented configuration, secrets, diagnostics and recovery; and the golden path scaffold → create module → migrate → dev → deploy. A functional bundled content dashboard and editing experience ship, while consuming projects can replace or omit their presentation. **Frontend-independence proof:** a plain HTML/server-rendered host and a bounded reactive-framework host fixture read/edit the same content through unchanged module services/contracts; host updates follow each host integration, not foreign DOM swaps. These are acceptance fixtures, not additional production renderers. The public-site starter choice is reopened with no implementation selected (Q46); dashboard/controller/panel choices and htmx evaluation remain in Q40/Q47/Q54. Mobile (Capacitor) is architectural direction only, **not** an MVP deliverable.
[STATUS: ANSWERED]

### Q8 — What is the high-level architecture?

- Context: Capability and presentation roles; the overview diagram is initial conceptual evidence, reconciled to later accepted answers rather than a mandatory UI/package layout.
- Agent default: Modular full-stack, mirrored server/client — each side organized into feature modules with a per-side shared core.
- Answer: Modular full-stack capability composition with explicit presentation boundaries. Modules own vertical capabilities (routes/handlers → controllers → business logic, schema/migrations and exposed services), with optional framework-free client functionality and optional presentation contributions; a service-only module is valid. Core supplies framework-free cross-cutting infrastructure interfaces and headless client seams. Public application, public-site starter, bundled admin dashboard, overlay integration controller and overlay editing panel are **distinct roles**, not a single shared 'renderer'. The dashboard consumes ordinary module capabilities and can be replaced/omitted by consumers; the MVP still ships working content/admin/editing surfaces. The host integration maps editable DOM to entity/field references and retains host ownership of content DOM; panel presentation is separate. `docs/discovery/highlevel-overview-diagram.svg` is the initial conceptual diagram, not an implementation/package prescription: its admin components denote feature responsibility, not server execution, and its mirrored halves do not make every UI facet mandatory. Q40 alone owns packaging-vs-execution, composition roots and deployment topology; Q47 owns headless/host/presentation interfaces. Neither diagram nor historical defaults select a frontend library.
[STATUS: ANSWERED]

### Q9 — Repo layout: monorepo or single package?

- Context: Where the key pieces live (§5 C → Layer 2).
- Agent default: Mirrors the diagram — server modules + client modules + a per-side shared core; whether that is a monorepo (workspaces) or a single package is still unresolved.
- Answer: **Monorepo.** (Open sub-question: whether the per-side Shared Core is its own workspace package(s) or lives inside each side — assigned to the Q40 composition exploration.)
[STATUS: ANSWERED]

### Q10 — Where do canonical stored types live?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): not reopened — adds a second execution surface for the same Drizzle SQLite schema (the browser-local SQLite store, Q70); D1-only-for-server and "no query-builder abstraction" stand; the SQLite-dialect constraint is satisfied by browser SQLite.

- Context: The DB schema / type package as single source of truth, not prose (§5 C → Layer 2).
- Agent default: Each module declares its own entities/schema in TypeScript; canonical types are inferred from those definitions in a shared schema layer, not prose.
- Answer: Each module declares its entities/schema in TypeScript; canonical **stored** types are inferred from those definitions in the module-owned schema layer, never prose. ORM/schema/migrations use Drizzle. Public DTOs are deliberately derived/mapped from stored types in the framework-free module contracts (Q51); they are not unfiltered database rows. Runtime wire validation and serialization/error conventions are assigned to Q47. **D1 only for MVP**: a manifest names the D1 database/binding requirements it consumes (Q45), not a datastore-agnostic schema. Shared versus separately bound databases and migration mechanics remain Q63; additional engines are future work under Q45's dialect constraint.
[STATUS: ANSWERED]

### Q11 — Identity conventions: slug IDs, ID generation, primary keys?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): the client-generated prefixed, sortable, TEXT id path now also serves offline record creation, change-set op ids and the sync idempotency key surface; safe retry/ownership remain Q66/Q70.

- Context: Identity conventions across entities (§5 C → Layer 2).
- Agent default: Globally-unique, sortable, URL-safe TEXT ids with an entity-type prefix, via a single core id-service; slug as a secondary key; no INTEGER PKs.
- Answer: **Globally-unique, sortable, URL-safe TEXT ids with an entity-type prefix** (e.g. `pg_<ulid|uuidv7>`), generated via one core id-service seam; modules declare prefixes in the manifest (Q35/Q39). Human slugs are secondary unique keys for externally routable content; identity is not addressability. **No INTEGER auto-increment PKs**: independently generated identities avoid coordinating database sequences; integer identities would require additional client/external mapping. A provisional client-generated ID path supports optimistic UI/offline; uniqueness alone does not define safe retry, ownership or repeated-ID/different-payload behaviour. Q40 owns the remaining ID mechanics (UUIDv7 vs ULID, prefix collision/registration, temporary vs final client ids and duplicate-request behaviour), with Q66 supplying reusable idempotency semantics. Time-sortable IDs do not guarantee global event ordering. Enums are module-owned, aggregated platform-wide, PascalCase `Key = 'Key'`. The identity policy is locked; **Better Auth prefixed-TEXT-ID compatibility is a required Q63 evidence check** against the selected Drizzle/D1 schema/adapter, including core auth entities. Failure blocks auth/pilot implementation and is surfaced to the dev rather than silently changing the ID policy.
[STATUS: ANSWERED]

### Q12 — What are the key entrypoints / API routes / surfaces a newcomer should know?

- Context: The surfaces that orient a new session (§5 C → Layer 2).
- Agent default: `apps/api` is a Hono app mounting each module's routes under its declared base path; `apps/web|mobile` render the modules' client entries; admin at a dashboard route + the in-situ overlay.
- Answer: Planned entrypoints: `apps/api` hosts Hono and each installed module's declared routes; `apps/web` represents the consuming public application, with its starter choice explicitly reopened (Q46). `apps/mobile` is a future architectural direction, not MVP delivery. The bundled admin dashboard, overlay host/controller and overlay editing panel are separate optional presentation surfaces for consumers; a module need not declare a client UI entry to register. Concrete route shapes, package locations, execution/SSR hosting, auth-handler ownership and cookie/session/origin topology are Q40 outcomes, not inferred from directory names or a frontend framework.
[STATUS: ANSWERED]

### Q13 — Frameworks, languages, tooling, and package manager?

- Context: The one-line-each stack (§5 D → Layers 1, 7); the dev supplied this as high-level context.
- Agent default: Cloudflare Workers + Hono + TypeScript + better-auth.
- Answer: **Cloudflare Workers** infrastructure (runtime/hosting); **Hono** as the base server engine; **better-auth** for auth handling; **TypeScript** throughout. Package manager: **pnpm**.
[STATUS: ANSWERED]

### Q14 — How do I run it? (dev commands, ports, test suite)

- Context: The run/test/typecheck/lint/build commands (§5 D → Layers 1, 7).
- Agent default: pnpm workspace scripts; `pnpm dev` runs the Worker (wrangler dev, local D1/R2/KV via Miniflare) plus the client dev server; Vitest + `@cloudflare/vitest-pool-workers`; Biome; tsc.
- Answer: Planned pnpm workspace scripts: `pnpm dev` runs the Worker under `wrangler dev` with local D1/R2/KV/queues via Miniflare, and runs any selected public starter/admin development server **only when that presentation topology needs one**. Tests use Vitest + `@cloudflare/vitest-pool-workers` with real D1 at the appropriate boundary; lint/format via Biome; typecheck via `tsc`. Ports are declarable in project config, not hardcoded. Q40/Q46 resolve the actual app/dev-server wiring before scaffold implementation. No implementation exists yet; these are planned commands rather than a working quickstart.
[STATUS: ANSWERED]

### Q15 — What environment variables / dev bindings are needed?

- Context: Feeds the committed `.env.example` / `.dev.vars.example`; real secrets never committed (§5 D → Layer 7).
- Agent default: `wrangler.toml`/`.jsonc` declares bindings (D1, R2, KV, queues); a committed `.dev.vars.example` carries non-secret dev values; secrets never committed.
- Answer: Confirmed — `wrangler.toml`/`.jsonc` declares the bindings (D1, R2, KV, queues); a committed `.dev.vars.example` carries the non-secret dev values; secrets (better-auth signing keys, etc.) are never committed.
[STATUS: ANSWERED]

### Q16 — Migration / seed / build procedures that aren't obvious from `package.json`?

- Context: Non-obvious operational procedures (§5 D → Layer 7).
- Agent default: the core `migrate` command (Q37) is primary; a seed path for local fixtures; build/deploy via wrangler.
- Answer: The core **migrate** command (Q37/Q44) is the primary DB procedure; its ordering/ledger/SQL execution mechanics remain Q63. **Upgrade** is separate platform package/code/contract work (Q49), not the migration command. Local fixtures and reset/reseed are planned with per-module setup/teardown (Q60); build/deploy use wrangler via standardized delivery tooling. Backup/restore procedures must be documented and exercised under Q65 before affected delivery/data-safety implementation and MVP deployment. No implementation exists yet.
[STATUS: ANSWERED]

### Q17 — What architectural/design choices have been made, and why?

- Context: One ADR each, with rejected alternatives (§5 E → Layer 3).
- Agent default: The locked choices each become an ADR, with rejected alternatives.
- Answer: Planned ADR set (each with rationale and rejected alternatives): modular composable application platform + module contract; backend stack Workers/Hono/better-auth/TypeScript/pnpm; build-time composition/no runtime plugins; module-owned Drizzle/D1 schema and core migration runner; ID conventions (Q11); one deployment per project/non-multi-tenancy; built-in content as ordinary modules rather than CMS identity (Q43); and the now-confirmed frontend-independent capability/presentation boundary (Q8/Q22/Q25/Q46). Deferred spikes in Q19 produce their own designs/evidence/ADRs; no ADR or diagram may silently select the reopened public starter or the unresolved dashboard/controller/panel implementation.
[STATUS: ANSWERED]

### Q18 — What choices were explicitly rejected, and why?

- Context: Feeds ADR "rejected alternatives" (§5 E → Layer 3).
- Agent default: Runtime plugin loading, multi-tenancy, INTEGER auto-increment PKs, scaffold-into-existing-project — all rejected.
- Answer: Rejected: runtime plugin loading (build-time composition instead); multi-tenancy (one deployment per project); INTEGER auto-increment PKs (independently generated TEXT identities avoid sequence coordination/mapping); scaffold-into-existing-project for MVP; and making any frontend framework/presentation library a prerequisite for platform consumption. The prior SvelteKit public-site starter decision is explicitly reopened by the dev (Q46); no replacement is selected. Framework independence is locked; its mechanics are Q40/Q47, not a renewed question of whether to support it.
[STATUS: ANSWERED]

### Q19 — What decisions are still open?

- Context: Open questions that are not yet locked (§5 E → Layer 3).
- Agent default: The exploration spikes are the open decisions.
- Answer: **Authoritative unresolved inventory and gates.** Foundational prerequisite spikes: **Q38 first**, full core capability inventory using Q42's shared-platform implications as input; then coupled Q40 (package/composition/deployment/installation/lifecycle mechanics), Q46 (reopened public-site starter choice), Q47 (framework-free client/wire/host/presentation interfaces and dashboard/controller/panel implementation choice), Q54 (content/publishing/editing workflows), Q63 (database placement/migration mechanics and Better Auth prefixed-ID evidence). Q40's public exports/topology remain provisional until Q46/Q47 close; final Q40/Q47 designs close together after Q54 supplies necessary workflow semantics. Q40 owns packaging-vs-execution; Q38 inventories capabilities rather than duplicating that decision. **Affected-work gates confirmed by the dev:** Q65 backup/restore design; Q66 durable effects/retry/idempotency; Q67 cache/read-your-writes/public propagation; Q68 security/bootstrap/rate-limit mechanics. Each closes before its affected implementation starts and before MVP deployment, not necessarily before unrelated implementation. **Post-MVP only:** Q69 site's purpose/dogfooding, which does not block platform/scaffold work; search/mobile/additional complete UI implementations per Q6. Q42 audit is complete; Q33/Q7 distinguish audit candidates from the chosen proving module set and later full pilot rebuilds. Previously locked Q41/Q45/Q48/Q49/Q50/Q51/Q52/Q53/Q55–Q62/Q64 retain their decision-level principles while named mechanics remain explicitly owned. Public-site starter, dashboard, controller and panel are unselected; Hono/htmx and TypeScript-controller/htmx-panel are **evaluation candidates only**, requiring evidence and the dev's explicit choice. Every prerequisite design question produces **one ADR plus a concrete design and verification evidence**, not an ADR alone: batch rollback, browser-only import, Better Auth prefixed IDs, two-host editing/CSP/focus/stale-revision checks and recovery tests as assigned. Spike plan 000 is planned, not yet authored; it must reflect these dependencies and distinguish foundational gates from affected-work gates.
[STATUS: ANSWERED]

### Q20 — How do we write software here?

- Context: Testing philosophy, cohesion, errors, state, perf, naming, dependency direction (§5 F → Layer 4).
- Agent default: TDD; lean routes; strict dependency direction; no `any`; types in a schema layer, logic separate.
- Answer: Confirmed — TDD (tests first; exercise real code at the right mock boundary, real D1 via `vitest-pool-workers`); one task → one scoped commit; lean route/handler files (logic lives in the module/core, not the route); strict dependency direction (modules → core, never core → module; module → module only via a declared manifest dep); no `any`; explicit error handling; naming/types declared in a schema layer, logic separate from types.
[STATUS: ANSWERED]

### Q21 — What is the git workflow?

- Context: Branch naming, conventional commits, PR habits, what not to commit (§5 F → Layer 4).
- Agent default: Conventional commits; one task → one scoped commit; direct-to-main (solo repo).
- Answer: Confirmed — conventional commits; one task → one scoped commit; direct-to-`main` (solo repo, no PR ceremony); branch naming optional for larger plans (confirm if/when wanted).
[STATUS: ANSWERED]

### Q22 — Any non-negotiable constraints?

- Context: Invariants that go in AGENTS.md's non-negotiables (§5 F → Layer 1).
- Agent default: docs-first; build-time composition only; enums PascalCase shared; TS strict, no `any`, no `export *`; TDD; module-owned schema + core migration runner.
- Answer: Non-negotiables: docs-first; build-time composition/no runtime plugins; module-owned Drizzle/D1 schema + core migration runner; TypeScript strict, no `any`, no `export *`; TDD; PascalCase `Key = 'Key'` enums, module-owned and aggregated platform-wide. **Frontend independence is locked:** core services, contracts and headless clients have no direct/transitive presentation framework/library dependency; presentation/UI facets are optional for modules and consumers, not prerequisites for registration or non-UI capabilities. A bundled dashboard/editing experience still ships in MVP; host/panel DOM ownership is explicit. Backend stack, D1 and registry-services remain chosen; this is not universal backend portability. Q11/Q25 govern IDs, dependency and capability prohibitions; Q46 records the reopened public starter, Q40/Q47 its unresolved mechanics. These invariants land in AGENTS.md.
[STATUS: ANSWERED]

### Q23 — Do we use subagents / delegation? If so, how?

- Context: When to delegate, prompt shape, verification standards (§5 F → Layer 4).
- Agent default: yes (Orca flow: fresh subagent per task, serial only; reviewers delegated with just-enough context) + the platform's AI-scaffolding command.
- Answer: Confirmed — yes (the Orca flow: a fresh subagent per task, serial only; reviewers delegated with just-enough context), plus the platform's AI-scaffolding command (Q31).
[STATUS: ANSWERED]

### Q24 — Which tech stack pieces each need a Do/Don't guardrail doc?

- Context: Best-practices file set (§5 G → Layer 5).
- Agent default: one guardrail doc per stack concern (typescript, worker, persistence, module-authoring, auth, testing, ids-and-enums, client, bindings).
- Answer: Best-practices docs: `typescript`; `worker` (Hono/Workers); `persistence` (D1/Drizzle); `module-authoring`; `auth` (better-auth); `testing` (Vitest/pool-workers); `ids-and-enums`; `client` (framework-free contracts, headless clients, host DOM integration and optional presentation facets); `bindings` (R2/KV/queues). Public starter/dashboard/panel-specific guardrails are separate optional presentation docs **after their implementation choices are made** (Q40/Q46/Q47), not a mandatory SvelteKit client-core guide. htmx guardrails are candidate-evaluation requirements only unless selected. Existing security/accessibility/dependency standards still apply regardless of presentation choice.
[STATUS: ANSWERED]

### Q25 — For each: what is not allowed?

- Context: Deliberately excluded tools/libraries per stack concern (§5 G → Layer 5).
- Agent default: no `any`; no `export *`; no raw SQL outside Drizzle; no runtime plugins; no INTEGER PKs; modules use the core datastore interface; the client contract layer stays framework-free.
- Answer: Not allowed: `any`, `export *`, raw SQL outside Drizzle, runtime plugin loading, INTEGER auto-increment PKs, or direct module imports/access to Cloudflare bindings (use core service/capability interfaces). Datastore is one capability, not a uniform abstraction for database/storage/cache/queues/auth. **Core services, shared contracts and headless clients must not directly or transitively depend on frontend frameworks or presentation libraries, including Svelte/SvelteKit and htmx**; chosen presentation dependencies belong to optional presentation packages. Browser contract exports must not expose server-only dependencies/private fields; DOM integration code is separate from headless/server-safe code. Modules cannot become dependent on public frontend server-action/routing conventions. Trusted compiled modules are not sandboxed by these seams. Drizzle-generated migration SQL still needs an approved runner execution path, explicitly owned by Q63; the raw-SQL prohibition is not a reason to omit migrations. Workers writable `/tmp` is request-local/non-persistent; persistent files go through R2.
[STATUS: ANSWERED]

### Q26 — What is currently in flight? What is the immediate next step?

- Context: The resumability handoff for a fresh session (§5 H → Layer 6).
- Agent default: Nothing in flight; next step = finish onboarding → author spike plan 000 → run spikes → MVP plan.
- Answer: Confirmed — nothing in flight. Complete onboarding sequence for a fresh session: baseline write → review → approval → commit → board/state → spike plan 000 (planned, not yet authored) → run the spikes → then the MVP plan.
[STATUS: ANSWERED]

### Q27 — How does the project keep its docs fresh / catch drift?

- Context: Feeds the `project-state-review` cadence and `docs/reviews/` (§5 H → Layer 6).
- Agent default: Recurring project state review → `docs/reviews/`, on cadence/milestones.
- Answer: Confirmed — a recurring project-state review feeding `docs/reviews/`, on cadence/milestones (the framework default, per project-onboarding-discovery §3).
[STATUS: ANSWERED]

### Q28 — What is a "module", precisely?

- Context: Composable feature capability ownership with optional server/headless/client/presentation facets; registration is not contingent on both UI halves.
- Agent default: A self-contained feature slice bundling its own server side (route handlers → controllers → business logic + admin dashboard UI components) and client side (module API client + admin overlay), declaring itself via a manifest/registry that the core wires in. (Dev: broadly accurate — exploring the contract in depth via Q34–Q37.)
- Answer: A module is a self-contained **vertical capability slice**, declared through a manifest/registry. It may supply server routes/logic/data/services, framework-free contracts and headless client functionality, and optional public/dashboard/panel presentation contributions as appropriate; **both UI halves are not mandatory**, and a service-only module can register and operate. Ownership of a feature does not mean implementing every presentation. Presentation-specific contributions are explicitly labelled and not automatically portable; consumers can substitute them without core edits. Contract inventory is Q35, dependencies Q36/Q41, ownership/migrations Q37/Q63; Q40 owns package/composition mechanics and Q47 host/presentation interfaces. Registry-provided runtime interaction is already locked (Q41).
[STATUS: ANSWERED]

### Q29 — How is composition wired — build-time or runtime?

- Context: Determines the module-loading model and how custom modules ship (unpacks Q1; §5 C/D → Layer 2).
- Agent default: Build-time — modules are packages installed into the project's monorepo and imported/wired by the core at build; no runtime plugin loader.
- Answer: **Build-time.** Modules are packages installed into the project's monorepo and imported/wired by the core at build — no runtime plugin loader.
[STATUS: ANSWERED]

### Q30 — What does the Core provide vs what a module provides?

- Context: Framework-free cross-cutting core infrastructure versus feature capability and optional presentation; Q38 inventories core and Q40 packages/wires it.
- Agent default: Core provides the scaffolding + the Shared Core interfaces (DB, filesystem, cache, auth, routing, admin shell); a module provides its feature's routes, logic, data model, admin UI, and client UI on top of those interfaces. (Dev: broadly accurate — exploring the boundary in depth via Q38–Q39.)
- Answer: Core provides cross-cutting scaffolding and **framework-free service/capability interfaces** for datastore, storage, filesystem, caching, authentication/authorization, routing/configuration/jobs/observability and required host/headless seams; the complete inventory remains Q38. Modules provide feature services, routes, business logic, schemas/migrations and optional client/presentation facets on those contracts. The bundled admin dashboard is an optional first-party **consumer**, not an inseparable mandatory core component; its replacement/omission cannot disable non-UI capabilities. Host/controller integration and editing-panel presentation are separate, with host-owned content DOM. Core owns infrastructure, not feature media records (Q58), and does not impose any public/frontend/panel framework. Capability interfaces are distinct; datastore is not one uniform interface for everything. Workers writable temp files are request-local/non-persistent; persistent objects use R2. Scaffold filesystem writes are local CLI generation, not production Worker filesystem semantics. Q39 governs core-vs-module and ordinary built-ins; Q40 resolves packaging/execution/composition.
[STATUS: ANSWERED]

### Q31 — What is the consumption / distribution model?

- Context: How a project adopts Yomban.ink and how custom modules are added (unpacks Q1; §5 C → Layer 2).
- Agent default: Yomban.ink is a monorepo framework/template the dev composes per project — core packages are consumed, and project-specific modules live alongside in the project's monorepo.
- Answer: Yomban.ink installs **from a repo** for MVP (Q48/Q64), providing a scaffold command that generates project-owned files including `package.json`, scripts and base wiring, plus commands to create/manage modules. Backend/module wiring is generated independently of a selected public-site starter; **the starter choice is reopened with none selected** (Q46). Dashboard/controller/panel packages are optional to consuming projects; the MVP includes a working reference content/admin/editing experience without forcing its UI library onto the host. **AI scaffolding remains required**, but Q40 must enumerate its deterministic artifacts, generated-versus-installed ownership, AI-fill/conformance boundary and consumer update mechanics before implementation; do not treat unnamed artifacts as already designed. Consumer AI orientation need not mirror Yomban.ink's own Orca workflow. No scaffold-into-existing-project support for MVP; pilot rebuilds are handled in their repos after the platform MVP. Full command inventory is Q44.
[STATUS: ANSWERED]

### Q32 — Tenancy: one deployment per project, or multi-project in one instance?

- Context: Single-project vs multi-tenant shapes the data model and core (unpacks Q1; §5 B/C → Layer 2).
- Agent default: One deployment per project — Yomban.ink is a scaffold reused across projects, not a shared multi-tenant host.
- Answer: **One deployment per project** — Yomban.ink is a reusable scaffold, not a shared multi-tenant host. (Dev: default correct.)
[STATUS: ANSWERED]

### Q33 — What is the pilot project + MVP module set?

- Context: The first real consumer defines the MVP (unpacks Q1; §5 B → Layer 6).
- Agent default: Unknown — to be settled with the dev; a first project plus a minimal module set that proves composability.
- Answer: Two pilot consumers: `/home/fred/Development/kasteel-website` and `/home/fred/Development/FreeAgents/freeagents-new`. Their audit **is complete** in Q42; it is the evidence/input for core and content spikes, not another pending audit. Q42 lists reusable/project-specific candidates and shared infrastructure implications, not a commitment to ship every feature. The MVP implementation plan selects a representative pilot-derived proving module set under Q7's zero-core-edit scaffold-to-deployment gate; full pilot rebuilds follow MVP.
[STATUS: ANSWERED]

### Q34 — Module shape: vertical feature slice or horizontal layer?

- Context: How features are partitioned; unpacks Q28 (§5 C → Layer 2).
- Agent default: Vertical feature slice — one module owns a whole feature end-to-end (its routes, logic, data, admin + client UI), not a horizontal layer (e.g. "all controllers").
- Answer: **Vertical capability slice**, not a horizontal 'all controllers' layer. A module owns its feature's contracts/services/schema and whichever optional UI/client facets it supplies; no requirement to ship every server/client/presentation half. Proposed layout remains `apps/api` plus consuming public apps and `modules/**`, but separate public-site starter, bundled dashboard, overlay controller and panel execution/package boundaries are Q40 outcomes rather than already chosen folders. Each app imports only the facet for its layer; public framework routing/server actions do not define module registration or domain operations. `apps/mobile` is direction only, not MVP delivery. Q47 resolves framework-free/headless/host exports jointly with Q40.
[STATUS: ANSWERED]

### Q35 — Module contract: what does a module declare?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): the manifest additionally declares each module's aggregate roots (sync-and-lock units) and the child tables that ride under each root (Q70 §3).

- Context: The manifest/registry surface the core reads to wire a module; unpacks Q28 (§5 C → Layer 2).
- Agent default: A manifest declaring its identity/version, route base, owned entities/schema + migrations, permissions, admin UI + nav entries, client UI entries, config schema, and the core services it consumes.
- Answer: A manifest declares module identity/version and **target contract major** (Q49); declared module dependencies and **exposed services** (Q36/Q41); required core capabilities and **named D1 database/binding requirements** (Q45); owned entities/schema/migrations (Q37/Q63); ID prefix registration (Q11); module-prefixed permission keys (Q50); config schema (Q53); queue consumers/cron/job contributions (Q56); and **optional** public/admin/nav/editing presentation contributions with explicit implementation labels. Route bases apply where routes exist; UI entries are not mandatory for service-only modules. Core resolution/conformance checks validate dependency graph, contract compatibility, names/prefixes and required capabilities without importing a specific presentation. UI attributes/components/HTML fragments are not the mandatory module contract. Q38 inventories capabilities; Q40/Q47 design exact server/headless/browser/presentation exports and collisions/wiring.
[STATUS: ANSWERED]

### Q36 — Inter-module relationships: may modules depend on / extend each other?

- Context: Whether composition is core-only or modules compose with modules; unpacks Q28 (§5 C → Layer 2).
- Agent default: Modules may depend on other modules (declared in the manifest), forming a dependency graph the core resolves — no monkey-patching.
- Answer: Modules may depend on/extend other modules through **declared manifest dependencies** resolved as a dependency graph; no monkey-patching. **Runtime interaction is already locked to registry-provided typed services** (Q41), not a pending choice between direct imports and registry instances. Shared typed-code imports obey declared dependency/export boundaries; concrete runtime services are supplied by the registry. Q40 owns resolution/wiring/lifetime and same-unit-of-work participation, with Q52 defining D1 atomicity constraints.
[STATUS: ANSWERED]

### Q37 — Data ownership: does each module own its tables/migrations, or does the core own a unified schema?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): a module owns its aggregate-root definitions and declares which child tables ride under each root; the sync/lock/revision unit is the root (Q70 §3).

- Context: Determines migration strategy and schema ownership; unpacks Q28/Q30 (§5 C → Layer 2).
- Agent default: Each module owns its own tables + migrations; the core owns a small base schema (users/profile via better-auth, media), composed at build.
- Answer: Each module owns its tables and migrations; core owns a small Better Auth base schema, with its complete required auth entities/migration integration verified under Q63. **Media records are not core schema**: an ordinary media module owns them, while core provides R2 storage infrastructure and upload/transform contracts (Q58). Core provides the migration runner, but iterating/logging modules is not the full migration design. Q63 owns database placement, ordering, ledger/namespacing/collisions, concurrent-deploy locks, failure/retry mechanics, data-vs-schema migrations, Better Auth generation/integration and safe module removal/data retention. Removal cannot silently discard existing data; Q65 supplies backup/recovery constraints.
[STATUS: ANSWERED]

### Q38 — What exactly does the Core ship (per side: server + client)?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): the capability inventory gains a datastore capability seam that binds a Drizzle instance to the environment's SQLite driver (D1 server-side, browser SQLite client-side).

- Context: Inventory server and headless/client core capabilities, not a mandatory component framework; Q40 owns packaging/execution and Q47 host/presentation interfaces.
- Agent default: Server core = routing (Hono), module registry/wiring, config, DB access, storage (R2), cache (KV), queues, email, auth (better-auth), and the admin shell; client core = API-client base, auth client, state, component kit, and the admin-overlay host.
- Answer: **Deferred from onboarding; foundational first spike.** Intended outcome: full server/core/headless-client capability inventory and required-versus-optional capability policy, using Q42's **shared-platform implications** as audited input. Feature capabilities remain ordinary modules; presentation kit/dashboard/panel candidates must not become mandatory core dependencies. Inventory auth/config/jobs/storage/cache/logger/headless/host seams in light of the locked Q41/Q45/Q50–Q59 choices, not a blank-slate reopening. Design tokens remain a first-class consistency consideration for optional admin/panel presentation; their packaging is Q40, not permission to import UI into headless core. **Q40 alone owns packaging-vs-execution** (including Q8's diagram), and Q47 owns headless/host/presentation interfaces. Output: one ADR, concrete inventory and capability checks. Blocks Q35 capability verification, finalized Q25/Q30 boundaries, Q37 auth/base infrastructure inventory and foundational implementation start; Q45's D1-only principle is already locked.
[STATUS: DEFERRED]

### Q39 — What rule decides core vs module — and are built-in modules privileged?

- Context: Keeps the boundary principled; unpacks Q30 (§5 C → Layer 2).
- Agent default: Core = cross-cutting infrastructure any module needs (the Shared Core interfaces); a module = a feature. "Common" Yomban.ink-shipped features are ordinary modules on equal footing (no privileged access), so custom modules compete on the same contract.
- Answer: Confirmed — core = cross-cutting infrastructure any module needs (the Shared Core interfaces); a module = a feature. Yomban.ink's built-in features are ordinary modules on equal footing (no privileged access), so custom modules compete on the same contract.
[STATUS: ANSWERED]

### Q40 — Spike: how are modules composed/wired into the apps?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): the browser-side SQLite store is a new export boundary (a worker-hosted wasm-SQLite instance opened per session; no binding I/O at module initialization).

- Context: Own package/export/composition roots, installation/generated ownership, service lifecycle and separate public/admin/controller/panel deployment/auth topology; Q46/Q47 close coupled choices.
- Agent default: Each app imports the module part for its layer through the core's registry/wiring at build-time.
- Answer: **Deferred from onboarding; prerequisite composition/installation/lifecycle design.** Intended outcome: concrete package/export/wiring/deployment design plus one ADR and evidence. Owns: server-only, headless/server-safe, browser/DOM and optional presentation export boundaries; optional module facets and composition roots importing core + concrete modules without core importing feature implementations; per-side core package layout (Q9); packaging-versus-execution for public app, public-site starter, bundled admin, overlay controller and panel (Q8); route/SSR/hosting topology and auth-handler owner, browser/SSR cookies/session propagation, credentialed CORS/trusted origins/CSRF in local/deployed/preview environments, preserving one deployment per project; define dashboard/overlay-specific performance targets with Q47/Q54 before their implementation, leaving Q62 public LCP/INP budgets unchanged. Installation scope transferred from Q48: generated/project-owned files versus installed/upgradeable packages; exact repo/subpackage/tag-semver install mechanics; consumer updates without regeneration; deterministic AI-orientation artifact list and AI-fill/conformance boundary, separate from Orca workflow. Owns immutable build/registration metadata versus isolate initialization and invocation-scoped env/user/session/transaction/trace context, config/secret changes and service lifetime: no binding I/O at module initialization and no stale globally cached binding-derived client. Domain operations stay outside frontend server actions/router conventions. Owns Q11 ID mechanics/prefix collisions and Q41/Q52 services contributing deferred operations to the same single-D1 unit of work rather than independently committing. **No public starter/dashboard/controller/panel is selected**: coordinate the reopened Q46 starter and Q47 implementation/interface decisions, with Q54 workflow input; exports/topology are provisional until these close. Hono/htmx dashboard and plain-TypeScript-controller/htmx-panel are **evaluation candidates only** requiring recorded evidence and explicit dev selection; one working MVP implementation does not mean shipping parallel renderers. Evidence includes composition/dependency/browser-export checks, cross-module single-batch rollback and the shared two-host editing proof. Blocks scaffold ownership/update/AI artifacts, package exports/apps wiring/auth topology and foundational implementation start.
[STATUS: DEFERRED]

### Q41 — What is the locked module-to-module interaction mechanism?

- Context: Q36 runtime interaction was decided: registry-provided services. Q40 owns implementation wiring/lifetime; direct imports are not an alternative runtime interaction mechanism.
- Agent default: TBD — direct import vs registry instance both plausible; explore.
- Answer: Locked — **registry-provided services**. A module's manifest declares what it EXPOSES; dependents receive typed service instances from the core-resolved registry. Direct import of implementation packages stays allowed for typed shared code, but runtime interaction goes through the registry. Event bus / pub-sub is noted as a possible future addition (its webhook/integration payoff is real) but is not the MVP mechanism. The wiring mechanics remain with spike Q40.
[STATUS: ANSWERED]

### Q42 — Completed audit: the two pilots and their candidate module sets

- Context: Completed audit of `/home/fred/Development/kasteel-website` and `/home/fred/Development/FreeAgents/freeagents-new`; source for candidate modules/infrastructure, not final MVP build scope.
- Agent default: TBD — produced by the audit.
- Answer: **Locked from the pilot audits** (two subagent audits of the repos, spot-verified against collection files, schema, KV keys, and ADRs this session). The audit is completed input, not the selected MVP build set. The MVP plan selects representative proving modules under Q7; these lists imply reusable/per-project candidates and shared infrastructure, not a commitment to ship all features. The pilots imply two tiers of candidate built-in modules: **Kasteel-website modules:** menu (category→subcategory→drinks/food, ZAR pricing, featured, photos), coffee-blends, news, hours (trading hours), content (site_text editorial copy), site-config (singleton NAP/analytics/integration settings), reviews (Google Business Profile via OAuth, KV-cached), gallery (Instagram embed). **FreeAgents modules:** media-library (Work objects, streams/thumbnails, R2 + Cloudflare Images), feed (polymorphic parent→child aggregation graph, GenericFeed instances), studio-profiles (studios + case studies), taxonomy (styles/techniques), press (+ Toast blog posts), site-identity (staff/social/contact/about). **Shared platform-tier implications (both pilots):** a content/collection engine (draft/publish lifecycle, reference fields — both pilots are CMS-backed); publishing-lifecycle mixins (visibility, soft-delete, sort_order — identical shape in both); media/R2/Images pipeline (both); KV caching with versioned keys + write-invalidation (kasteel pattern, generalizes); SSR shell/routing/chrome; SEO/OpenGraph/meta; module registry + build-time wiring; job orchestration (FreeAgents' DO/Queues pattern — pairs with the Q56 contract); data export/backup. **Custom (per-project) module candidates:** kasteel — cafe-menu vertical, GBP-reviews integration, Instagram-gallery; FreeAgents — Slate-sync integration, bespoke media overrides (custom thumbnails), one-off redirects, splash screen. **Notable convergences:** both pilots use Hono SSR + htmx-style progressive enhancement with no SPA client; both are single-admin-editing models; both need the in-situ edit session/CSRF framework as a core concern. Both provide evidence for the needs behind Q41/Q50/Q56/Q57; pilot job orchestration and versioned KV caching inform those designs rather than proving the platform contracts are already implemented. The Hono SSR/htmx-style observations support investigating Q40/Q47's HTML/htmx candidate; they do not establish htmx library usage in both pilots or approve a platform UI stack. **Caveat:** FreeAgents is early-stage (Phases 001–002 done, 003 in progress) — its module set is partly derived from planned surfaces in docs/specs, not only shipped code. Kasteel is mid-migration OFF SonicJS to a bespoke CMS — Yomban.ink's content engine should be a shared rebuild, not a SonicJS import.
[STATUS: ANSWERED]

### Q43 — Product category naming: "CMS" or "Platform"?

- Context: The dev questions whether "CMS" undersells the composable system; affects the product description (Q1) and all baseline docs.
- Agent default: "Platform" is the better umbrella — the composable system is a modular application platform, of which CMS-style content/admin (the in-situ editing, dashboard, content modules) is one capability. "CMS" describes that capability, not the whole.
- Answer: **Platform.** Yomban.ink is a modular application platform — **not a CMS**. The content/admin capability (in-situ editing, dashboard, content modules) is built-in capability, and a full CMS is something a consuming dev can **build on top of** the platform by composing modules. "CMS" names an application category a consumer might build, not the product.
[STATUS: ANSWERED]

### Q44 — What commands does the Yomban.ink CLI expose?

- Context: The installed platform's command surface — scaffold/init (incl. AI scaffolding), create-module, migrate, dev/build/deploy, …; to be enumerated fully (§5 C/D → Layer 2).
- Agent default: `init`/scaffold (generate the file tree incl. `package.json` + AI scaffolding), `create module` (new-module skeleton), `migrate` (core migration runner over modules), plus dev/build/deploy.
- Answer: Planned CLI inventory: `init`/scaffold (project file tree, dependencies/scripts/wiring and AI orientation artifacts designed in Q40); `create module`; add/remove module; list modules; **migrate** (core DB migration runner, Q37/Q63); **upgrade** (package/code/contract changes and codemods, Q49, distinct from DB migrate); dev, build and deploy. Scaffold backend/module wiring is independent of public starter selection (Q46); presentation/dev-server topology is Q40, not a mandatory frontend convention. Add/remove honours dependencies, conformance and Q63 data-retention safety; installation/update/AI artifact mechanics remain explicit prerequisite design rather than invented command implementations.
[STATUS: ANSWERED]

### Q45 — Datastore-declaration interface (D1-only decision locked)

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): not reopened — D1-only-for-server and "no query-builder abstraction" stand; the browser-local SQLite store is a client capability, not a server binding (A1/A2).

- Context: Q10 datastore declaration is locked to named D1 requirements; multiple bindings do not imply cross-database transactions. Q63 designs placement/migrations.
- Agent default: A core-provided datastore interface a module selects via its manifest, with D1 as the first (only) implementation.
- Answer: **D1 only to start**; additional datastore support is future work. Drizzle remains schema/query language — no query-builder abstraction layer. Manifests name required D1 databases/bindings; Q63 designs shared versus separately bound placement and migration mechanics. **Q52 atomicity covers one database/batch only**; selecting multiple bindings does not imply a distributed transaction. Any future engine must be SQLite-dialect-compatible or the abstraction/schema portability revisited; no promise that arbitrary engines work unchanged. Cross-database/external effects require separately designed consistency/recovery (Q66), not a registry or D1 session masquerading as a transaction.
[STATUS: ANSWERED]

### Q63 — Spike: migration mechanics

- Context: Split from Q45 when its datastore stance was locked (per review). Module-owned migrations + the core runner (Q37) are chosen, but the mechanics are not: shared D1 database vs separately bound databases; table/migration-name collisions; dependency ordering (topological by the Q36 dep graph?); a persistent migration history (ledger) and its namespacing; a lock for concurrent deploys; partial failures and retries; data-vs-schema migrations; Better Auth schema ownership and migration integration; safe module removal and retention of existing data. Note: "no raw SQL outside Drizzle" still needs an execution path for Drizzle-generated SQL migrations — Better Auth's Drizzle integration generates schema but leaves migration handling to ORM/tooling.
- Agent default: One shared D1; per-module prefixed migration names; topological ordering by the module dep graph; a single migration-ledger table; retry with per-step idempotency.
- Answer: **Deferred from onboarding; foundational migration spike.** Intended outcome: one ADR plus concrete shared/separate D1 placement, table/migration namespace/collision rules, dependency ordering, persistent ledger/history, concurrent-deploy locking, partial failure/retry, data-vs-schema migrations, Better Auth required base-schema generation/integration and safe removal/retention design. Respect Q52 single-database/batch atomicity; no distributed transaction is implied by multiple bindings. Define execution of **Drizzle-generated SQL migration artifacts** consistent with Q25; Better Auth's Drizzle adapter generates schema while ORM/tooling owns migrations. Required evidence: empty and existing-version migration runs, failure/retry/concurrent-deploy safety and Better Auth selected Drizzle/D1 adapter with core-generated **prefixed TEXT ids** (Q11), including auth flows/required entities. A failed compatibility check blocks auth work and is surfaced, not silently resolved by integer IDs. Coordinate recovery/retention with Q65 and participation/wiring with Q40. Blocks schema/migration/Better Auth persistence implementation and foundational implementation start; module ownership/core runner and D1/Drizzle decisions remain locked.
[STATUS: DEFERRED]

### Q46 — Reopened choice: public-site starter, frontend independence and mobile direction

- Context: The dev explicitly reopened the former SvelteKit public reference starter during the review-03 fold. Frontend independence is locked; select the public starter separately from dashboard/controller/panel and future mobile direction.
- Agent default: `apps/web` = SvelteKit (reference client/renderer); `apps/mobile` = Capacitor shell over the web client; module client contract framework-agnostic.
- Answer: **Frontend independence is locked; the public-site starter choice is reopened by the dev during the review-03 fold. No frontend implementation is selected yet.** The former SvelteKit choice is superseded, not a current default. Consuming public applications choose their frontend; core services, shared contracts and headless client capabilities are independent of frontend frameworks and presentation libraries. UI is an optional module facet; the bundled dashboard is replaceable/omittable for consumers but a functional dashboard and in-situ editing experience still ship in the MVP. Overlay host/controller responsibilities are separate from panel presentation, and the host retains ownership of its content DOM. The public-site starter, dashboard, overlay controller and overlay panel implementation choices must be explicitly resolved through Q40/Q47, with Q54 supplying editing workflows. Hono-rendered HTML + htmx for the dashboard and a plain TypeScript controller + htmx panel remain **candidates to evaluate, not adopted implementations**; they do not automatically select the public starter. Mobile (Capacitor) is a supported architectural direction only, **not an MVP deliverable**. Deferred from onboarding: intended outcome is a recorded public-site starter selection and bounded support commitment, compatible with the locked framework-free contract; blocks starter scaffolding and MVP public-client implementation. Plain-page and reactive-host acceptance fixtures prove independence without committing the MVP to additional production renderers.
[STATUS: DEFERRED]

### Q47 — Spike: framework-agnostic client contract

- Context: Design the already-locked framework-free client/host/presentation contract and browser-safe wire boundaries; resolve separate dashboard/controller/panel choices without assigning the public starter by inference.
- Agent default: Framework-agnostic module **client contract** (typed API client + headless data/behaviour); the platform ships a SvelteKit reference renderer; other frameworks implement the same contract. UI-agnosticism design to explore.
- Answer: **Deferred from onboarding; prerequisite framework-free client/wire/host/presentation design.** Frontend independence and shared contract packages (Q51) are locked; this spike designs mechanics, not whether to support them. Output: one ADR, exact headless/host/presentation interfaces, dashboard/overlay-specific performance targets under Q62 and executable boundary proof, closed jointly with final Q40 exports/topology and Q46's reopened public starter choice. Owns browser-safe framework-free exports; public DTOs derived/mapped from stored types rather than private DB rows; shared runtime schemas, route input/output validation, serialization/API/error conventions and client contracts with no codegen/tRPC/OpenAPI as the primary mechanism. Separate DOM integration from headless/server-safe code; modules' UI facets are optional and renderer-neutral descriptions cover standard admin screens while custom views are explicitly implementation-specific, not universally portable components. Resolve **dashboard, overlay controller and editing-panel implementation choices** explicitly with Q40/Q54 workflow input, keeping them separate from the public starter. Candidate to evaluate: Hono-rendered HTML + htmx dashboard and a plain TypeScript overlay controller + htmx panel; rich editors/drag/drop/crop/progress/repeaters/unsaved state may need focused JS libraries with explicit lifecycle. The candidate is **not approved** and can be rejected without dropping core independence requirements. Scope swaps/processing to panel-owned DOM; the host updates its own content through documented notifications and cannot be forced to adopt the panel library or have its existing configuration hijacked. Shared proof: a plain/server-rendered host and bounded reactive-framework fixture read/edit/publish the same content through unchanged services/contracts, with authorization/validation, CSP, input/focus/keyboard/announcements, stale-revision conflicts and lifecycle/unsaved-state preservation. htmx-specific prototype checks: HX-Request is not authorization; sanitization plus hx-disable/disabled unnecessary eval and script processing; explicit 422/session-expiry handling; private content/history-cache isolation (HTTP no-store alone is not a JS snapshot-cache policy). Public API and HTML presentation paths call the same domain/permission operations, optionally in-process for HTML, not a required loopback HTTP call. Evidence and explicit dev choice precede any implementation selection. Blocks module client/wire/host interfaces, dashboard/controller/panel selection and final Q40 exports; fixtures do not commit the MVP to extra complete production UI implementations.
[STATUS: DEFERRED]

### Q48 — Platform identity/distribution and ownership of deferred installation mechanics

- Context: Locked platform identity and repo distribution; installation/ownership/AI artifacts are transferred explicitly to Q40, release/versioning to Q64, post-MVP site purpose to Q69.
- Agent default: TBD — a mix of generated-and-then-project-owned files and upgradeable platform packages; AI scaffolding as generated agent-orientation docs/skills.
- Answer: **Identity/distribution locked:** product Yomban.ink; repository/domain `yomban.ink`; package scope **`@yomban-ink/*`** unconditionally; no npm publishing for MVP, installation from a repo. Remaining generated/project-owned versus installed/upgradeable boundaries, repo install/subpackage mechanics, consumer fixes/updates and concrete deterministic AI-scaffolding artifacts/AI-fill boundary are explicitly transferred to prerequisite **Q40**, not unanswered residues in this block. Consumer scaffolding need not duplicate Yomban.ink's Orca development workflow. Git release/versioning is Q64; the site's purpose/dogfooding is independently post-MVP Q69. Q31/Q44 are the chosen consumption/command directions, not proof these mechanisms already exist.
[STATUS: ANSWERED]

### Q64 — Release/versioning scheme (website-purpose split to Q69)

- Context: Repo release/versioning decision; actual install/update mechanics are Q40. The separate site-purpose/dogfooding question is explicitly post-MVP Q69.
- Agent default: Changesets + conventional commits; git-tagged releases consumed via package.json semver from the repo; yomban.ink = marketing/docs site (itself a Yomban.ink consumer, dogfooding).
- Answer: **Release/versioning locked:** git-tagged releases with package.json semver against the repo source; changesets + conventional commits drive versions. Lockstep and tag-pinning remain rejected. Q40 designs actual subpackage/repo/tag-semver install/update mechanics and the generated-versus-installed boundary before scaffold/upgrade implementation; this Answer does not invent a working package specifier. The separate website-purpose/dogfooding question is explicitly **post-MVP Q69**, not an open residue in this ANSWERED release decision.
[STATUS: ANSWERED]

### Q49 — Core↔module contract versioning + upgrade path

- Context: Locked module-contract semver/current-plus-N-1 compatibility and upgrade CLI/codemods; concrete repo/package/update mechanics are Q40, database migrations Q63.
- Agent default: Contract semver + a compatibility policy + an upgrade CLI with codemods.
- Answer: Locked — **contract semver**: the module-contract (manifest shape + registry interfaces) carries its own major version; modules declare which contract major they target; the core accepts current and N-1 majors; an upgrade CLI + codemods handle moves. Lockstep and feature-detection rejected.
[STATUS: ANSWERED]

### Q50 — What is the permissions / RBAC model?

- Context: Locked role-to-module-prefixed-scope model; server-side resource checks govern API and optional admin/editing presentation alike. Q68 owns registration/sign-in/first-admin/token mechanics and rate-limit surface profiles, not Q50's permission vocabulary.
- Agent default: Roles + scopes with resource-level checks, composed across modules via declared permissions.
- Answer: Locked — **roles + permission-scopes**. Modules declare permission keys (enum-defined, module-prefixed per the enums convention); roles map to permission sets; resource-level checks where a module needs them. better-auth maps onto this. Cross-module composition rules (can a role granted in module A satisfy module B's check?) are a detail for implementation, guided by the module-prefixed key convention.
[STATUS: ANSWERED]

### Q51 — Shared client/server contracts and ownership of deferred wire mechanics

- Context: Shared framework-free module contracts/types/clients are chosen; API serialization/error/runtime schema mechanics are explicitly deferred to Q47 rather than assumed solved by static types.
- Agent default: A framework-free typed contract package shared by server and clients; OpenAPI generation as a candidate output.
- Answer: **Shared contract package per module** is locked: framework-free public types/runtime schemas + typed client from the module's own source; server handlers/services and clients share appropriate contracts without inferring client API from server implementations or codegen. Stored types remain inferred from Drizzle schema (Q10); public DTOs are deliberately derived/mapped, not private DB row exports. Q47 explicitly owns remaining **wire mechanics**: API/route shapes, runtime input/output validation, serialization, stable errors and browser-safe exports; shared TypeScript alone does not guarantee HTTP conformance. Core/headless/contracts have no direct/transitive presentation dependency; optional HTML templates/UI components/hx-* directives are presentation exports, not mandatory module contracts. Public API and optional HTML admin paths invoke the same domain/authorization operations; HTML may call services in-process. tRPC inference and OpenAPI generation remain rejected as primary mechanisms; future OpenAPI emission on the contracts remains optional.
[STATUS: ANSWERED]

### Q52 — Transactions / unit-of-work seam?

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): the change-set maps 1:1 onto one D1 prepared-statement batch (Q70 §4); presence leases are advisory and must never be presented as atomicity under Q52.

- Context: Define the chosen core unit-of-work seam within real D1 batch atomicity and distinguish cross-module participation from external/distributed effects.
- Agent default: The core provides a transaction/batch seam over the datastore capability interface.
- Answer: **Core unit-of-work seam over D1 batch** is locked. **Atomicity is one D1 database and one prepared-statement batch**: statements run sequentially and a statement error rolls back the batch. This is not an arbitrary async JavaScript read/branch/write transaction, nor atomic across databases, R2, queues or cache purges. Modules declare transactional boundaries and use the core seam, never raw binding transactions. Registry services (Q41) must **contribute deferred operations to the same unit of work rather than independently commit**; Q40 designs that participation contract and proves cross-module rollback. Read-dependent invariants require conditional SQL/constraints or an explicitly supported design, not a pre-read assumed atomic with later writes. Q63 database placement must respect these limits; Q66 designs external/cross-database side effects and recovery, Q67 post-commit invalidation. D1 sessions/bookmarks provide consistency tools, not a substitute for multi-database transactions.
[STATUS: ANSWERED]

### Q53 — Config & secrets model?

- Context: Manifest configuration/secret seams with validation before serving effective configuration; Workers isolate/binding and invocation lifetimes are Q40 responsibilities.
- Agent default: Manifest config schema validated at boot; secrets reach modules only through a core seam, never direct binding access.
- Answer: **Manifest config schemas and core secrets seam** are locked; per-environment non-secret values live in project config, and modules never directly access bindings/secrets. Core validates configuration before serving each effective runtime configuration ('boot' is an initialization/validation boundary, not a long-lived process startup). Q40 owns build/static registration versus invocation-scoped env context and config/secret refresh: do not globally cache clients derived from bindings and retain stale credentials, and do not perform binding I/O outside an invocation. CLI/scaffold-time versus runtime validation/secret delivery mechanics are explicit Q40 design outcomes; invalid configuration must fail safely with diagnostics rather than relying on a one-time cold start. This preserves boot validation while making it compatible with Workers isolate/binding lifetime.
[STATUS: ANSWERED]

### Q54 — Content model + publishing workflow (the built-in content capability)

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): lock eligibility is decoupled from publish state — a record locks once it is shared/remote, regardless of publish state (Q70 §6).

- Context: The content capability (Q1/Q43) is asserted but never specified: how a module defines content types/fields (text, rich text, media, relation, repeater) and the draft → review → publish → schedule → revision workflow. In-situ editing mechanics are likewise unspecified (how the overlay maps DOM → content entity, draft preview, permission-gated edit affordances). This is the headline built-in capability — but still a module set on the platform, not the platform itself.
- Agent default: Content types/fields defined per module via schema; workflow states draft/review/publish/schedule/revision; the in-situ overlay maps edits onto content entities.
- Answer: **Deferred from onboarding; prerequisite content/publishing/editing design.** Intended outcome: content type/field definitions (text/rich text/media/relation/repeater), publishing/draft/review/schedule/revision semantics, optimistic concurrency/revision checks, preview permissions and DOM-to-entity/field host integration, plus one ADR and workflow/evidence tests. Content is a built-in module capability, not a new CMS platform identity. Dashboard/controller/panel are optional presentation for consumers but a functional editing experience ships in MVP; implementation choices remain Q40/Q47, not assigned by workflows. Preserve host-owned DOM, draft/unsaved state, deliberate or appropriate debounced saves and lifecycle/input/focus/keyboard/error handling; failed/late/stale saves cannot silently overwrite data or report successful publish. Plain/reactive host fixtures prove shared content operations and authorization without core edits. Any headless public content API through Q51 contracts still needs explicit DTO/access design rather than being 'free'. **Q67 owns author read-your-writes/public staleness/preview-cache isolation**, Q66 owns durable publish/invalidation effects; this spike supplies required publishing freshness/preview surfaces rather than independently inventing those guarantees. Conditional htmx candidate workflow proof uses the same content services and tests, without adopting its UI library. Search is explicitly **post-MVP**; decide its later home here without adding it to MVP. Blocks built-in content/workflow implementation, in-situ editing and pilot content requirements.
[STATUS: DEFERRED]

### Q55 — Observability seam?

- Context: Logger/tracer/metrics seams and sink configuration are locked; Q40 owns invocation context/sink lifecycle, Q66 distinguishes critical business effects from best-effort telemetry.
- Agent default: Core logger/tracer/metrics interfaces; error reporting via a pluggable sink.
- Answer: **Core logger/tracer/metrics seams + pluggable sinks** are locked; modules log via the seam, not raw console or Cloudflare bindings; sinks are project-configurable. Q40 owns invocation-scoped trace/user/service lifetime and async sink completion within Workers execution constraints; request context cannot leak through globals between invocations. Sink failure/redaction/error-reporting mechanics remain implementation design on these seams; Q66 distinguishes non-critical best-effort telemetry from durable business jobs. OpenTelemetry alignment remains an opportunity, not an MVP constraint.
[STATUS: ANSWERED]

### Q56 — Async work: queues, scheduled/cron, background jobs?

- Context: Manifest queue/cron wiring and jobs seam are locked; Q66 owns delivery/idempotency/retry/failure semantics before affected implementation.
- Agent default: The manifest declares queue consumers/cron schedules; the core provides the wiring.
- Answer: **Manifest-declared queue consumers + cron schedules** are locked, with build-time core wiring and a core jobs seam; consumers do not author wrangler queue/cron entries directly. **Delivery/wiring is not exactly-once execution**: Q66 owns at-least-once/idempotency, enqueue gaps, retries/dead-letter/replay, payload-version compatibility and failure recovery; it must close before affected async implementation and MVP deployment. Long-running/durable business work must not rely on an unawaited promise or short-lived best-effort request background work. Manifest services/capabilities retain the Workers runtime boundary without direct module binding access; no MVP event bus is introduced by jobs or host DOM notifications.
[STATUS: ANSWERED]

### Q57 — Cache + invalidation?

- Context: Cache capability and purge hooks are chosen, but visibility, version authority and secure draft/preview caching require Q67 design; Q66 owns durable invalidation effects.
- Agent default: A core cache capability interface with explicit purge/invalidation hooks wired to content writes.
- Answer: **Core typed cache capability with purge/invalidation hooks** is locked; content writes trigger post-commit invalidation fan-out through core, not ad-hoc direct KV access in modules. Hooks alone do not guarantee visibility: KV is eventually consistent (even immediate same-location visibility is not guaranteed), and Cache API deletion is local to its invoking data centre, not automatic global purge. **Q67 explicitly designs author read-your-writes, public propagation/staleness, cache/version-pointer authority, invalidation failure/retry and preview isolation** before affected cache/editing work and MVP deployment; Q54 supplies publishing/preview needs and Q66 durable side-effect recovery. Authenticated drafts/previews must bypass public caches or use provably isolated cache keys and permissions; a stale KV version pointer cannot be assumed to solve consistency. Direct KV/manual invalidation remains rejected; the implementation must meet the defined guarantees through the core seam.
[STATUS: ANSWERED]

### Q58 — Media/upload pipeline?

- Context: Settled media ownership: module records, core R2 infrastructure. Upload/key/transform/signing/asset-ownership contracts are media implementation work under Q54/Q59/Q65, not an unresolved core-media exception.
- Agent default: A media module owns media records; the core provides storage infrastructure (R2) plus upload/transform contracts.
- Answer: **Media module owns records; core provides R2 storage infrastructure + upload/transform contracts**. Core base schema does not own media (Q37). Signed URLs, Images transforms and per-module asset ownership remain named pipeline contract details for the media implementation, exercised against content field requirements in Q54. They are not a pending media-ownership spike or a privileged built-in-module exception. Input/upload validation follows Q59/Q68 and object/data recovery follows Q65; media field ownership is settled while concrete pipeline contracts still require implementation design.
[STATUS: ANSWERED]

### Q59 — Security model & defaults?

- Amendment 002 (see [understanding-amendments-002.md](understanding-amendments-002.md)): privacy guardrails are locked alongside the security baseline — redaction-by-default, a PII-classification seam and erasure/retention primitives reaching client-local replicas (Q70); lawful basis/consent/DSR policy remain per-project (new Q71).

- Context: Safe baseline protections and applicable mandatory surface profiles; explicit rate limiting, first-admin provisioning and auth/registration mechanics remain Q68.
- Agent default: Safe-by-default core: CSP/security headers, CSRF handling, Zod input validation, Turnstile on public forms, token auth for machine clients.
- Answer: **Safe-by-default core protections** remain locked: CSP/security headers, CSRF, Zod boundary validation, upload validation, server-validated Turnstile for public forms, machine-client token auth; **rate-limit/abuse policy is now an explicit core responsibility**, distinct from Turnstile. Baseline protections apply to every registered surface; module declarations select applicable cookie-authenticated, machine-authenticated or public-form profiles, not an unprotected opt-in or opt-out. Every API/HTML-fragment/mutation path enforces server-side authorization and applicable CSRF/origin rules; Better Auth does not automatically cover custom module routes and a presentation header such as HX-Request is not an auth boundary. Untrusted content must be escaped/sanitized and not introduce executable UI behaviours; do not weaken CSP for a presentation library. **Q68 owns the unresolved concrete profiles, credentials/origins/session rules, rate-limit storage, permitted auth/registration methods and first-admin bootstrap**; it closes before affected security/auth/public-surface implementation and MVP deployment. Private responses and library history snapshots obey Q67 preview/data-isolation requirements. UI-specific controls remain conditional on the selected presentation implementation, not mandated htmx runtime use.
[STATUS: ANSWERED]

### Q60 — Delivery/ops: CI/CD, environments, domains, data safety?

- Context: Standard CI/environments/domains/preview/local fixtures plus mandatory data safety; unavailable native R2 versioning is replaced by explicit Q65 backup/restore design ownership.
- Agent default: CI/CD (GitHub Actions) → wrangler deploy; staging/prod environments; per-project custom domains; backups via D1 export + R2 versioning.
- Answer: Standardized delivery is locked: GitHub Actions → wrangler deploy, staging/prod, per-project custom domains, preview deployments and local reset/reseed; per-module fixture/teardown details are within this. Backup/data-safety requirement remains mandatory, with **D1 export** as the DB backup procedure and **R2 backup/retention mechanics explicitly owned by Q65**: native R2 bucket versioning is unavailable and is not the chosen backup mechanism. Application object revisions alone are not a recoverable backup. Q65 must produce recovery/retention and restore evidence for D1 records plus referenced objects before affected ops/data-safety implementation and MVP deployment. Q40 supplies public/admin hosting and auth/preview topology; 'preview deployment' does not itself promise isolated data resources. Secrets never enter committed examples; Q68 supplies auth/security constraints for environments.
[STATUS: ANSWERED]

### Q61 — Module conformance test kit + boundary enforcement?

- Context: Enforce module capability/export/dependency contracts in CLI/build/CI; registration is build-time and headless packages cannot depend on presentation libraries. Shared acceptance fixtures exercise actual boundaries.
- Agent default: Boundary lint + contract test harness shipped in the platform; modules conform by construction.
- Answer: **Boundary lint + contract/conformance harness** ship at MVP. Run executable conformance in **CLI/build/CI before build-time registration**; deployed request initialization is not a test runner. Lint enforces dependency direction, no `export *`, no direct module bindings, declared module dependencies/contract compatibility and browser-safe exports. Core/headless/shared-contract packages have **no direct or transitive frontend/presentation dependencies** (including Svelte/SvelteKit and htmx); optional presentation packages are checked separately and trusted compiled modules are not sandboxed by lint. Q40/Q47 define actual manifest/export/lifecycle interfaces for the harness. Shared acceptance proof (Q7): plain HTML/server-rendered and bounded reactive-framework hosts read/edit/publish through unchanged services/contracts with host-owned DOM updates, authorization/validation, CSP, lifecycle/unsaved-state/focus/keyboard/error handling and stale-revision checks. Fixtures are not extra production renderers; htmx-specific checks are conditional on evaluation/selection. Q63 requires real-D1 migration/Better Auth prefixed-ID evidence; Q65 restore and Q66/Q67 effect/cache failure tests gate affected implementations. A conformance score remains a later opportunity.
[STATUS: ANSWERED]

### Q62 — Non-functional targets?

- Context: Named accessibility/browser/SEO/uptime targets, with LCP/INP scope explicitly confirmed for public reference frontend; dashboard/overlay targets must be set in their prerequisite designs.
- Agent default: WCAG 2.2 AA; SEO/structured data for content; a perf budget (LCP/INP); a modern-browser matrix; uptime per-project best-effort.
- Answer: **WCAG 2.2 AA** is required for bundled admin/editing and rendered public content; **SEO/structured data** for public content. **LCP < 2.5s and INP < 200ms apply to the public reference frontend only**, explicitly confirmed by the dev. Its technology is unselected under reopened Q46; choosing a starter does not alter these budgets. Dashboard/overlay-specific performance targets are to be set in Q40/Q47 using Q54 workflow input **before their implementation**, not silently copied from public budgets or omitted. Browser support: evergreen + last 2 Safari/Firefox/Edge; uptime best-effort per project. These feed Q7 acceptance; library defaults do not prove accessibility and edits/swaps must preserve keyboard/focus/announcements/input state.
[STATUS: ANSWERED]

### Q65 — Deferred design: backup, retention and coordinated restore

- Amendment 002 (see [understanding-amendments-002.md](understanding-amendments-002.md)): erasure/retention primitives extend to the client-local store (Q70); a data-subject request cannot be satisfied by server-side deletion alone.

- Context: Review-03 finding 1 corrects Q60's unavailable native R2 versioning assumption. D1 records, R2 objects and their references need recoverable backup/retention, not only object revisions. Datastore/media ownership remains Q37/Q45/Q58.
- Agent default: D1 exports plus immutable object revisions and a separately protected backup copy; retention/restore mechanics to evaluate, not selected implementations.
- Answer: **Deferred from onboarding by explicit dev decision; affected-work gate, not a blanket pre-implementation gate.** Owner: delivery/data-safety design in spike plan 000, coordinated with Q60 environments, Q63 migration/removal safety and Q58 media keys/ownership. Intended outcome: one ADR plus a concrete D1/R2 backup, retention, restore and recovery procedure covering consistency of records and referenced objects, credentials/isolation, retention/deletion and documented recovery expectations. Native R2 bucket versioning is unavailable; do not prescribe it as backup. Application-level immutable revisions alone do not protect against deletion of all copies/buckets; evaluate recoverable separately protected copies without silently selecting a storage/vendor mechanism. Require an exercised restore test of DB records and referenced assets and recovery from relevant migration/media failure cases. D1 export remains the chosen DB backup direction, not proof of coordinated recovery. **Blocks affected ops/data-safety/media-retention implementation and MVP deployment**; must close before that work starts. Unrelated implementation may proceed once its own gates close.
[STATUS: DEFERRED]

### Q66 — Deferred design: durable side effects, retries and idempotency

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): change_set_id is the sync idempotency key; the D1 transactional outbox evaluation candidate is concretized as the sync op-log; sync payloads carry the contract version with a current + N-1 acceptance window.

- Context: Review-03 finding 11 expands Q52/Q56/Q57: one successful D1 commit followed by failed queue enqueue or cache purge leaves missing effects, and at-least-once queue delivery can repeat effects. Registry service composition does not close that failure window.
- Agent default: A transactional outbox for important D1-associated effects, with idempotent consumers and replay/dead-letter tooling; candidate only, not a chosen mechanism.
- Answer: **Deferred from onboarding by explicit dev decision; affected-work gate.** Owner: async/unit-of-work consistency design in spike plan 000, coordinated with Q40 service participation/lifecycle, Q52 single-D1 atomicity, Q56 job wiring, Q57/Q67 invalidation and Q54 publishing. Intended outcome: one ADR plus contracts for post-commit effects, at-least-once assumptions, idempotency responsibility/keys and repeated-ID/different-data handling, enqueue-gap recovery, acknowledgement/retry/backoff/dead-letter/manual replay, payload version compatibility across deploys and failure diagnostics. Distinguish critical durable business work from best-effort telemetry; neither a registry call nor an unawaited/short-lived request background promise supplies durability. A D1 transactional outbox is an **evaluation candidate**, not a silently locked architecture; no MVP module event bus is adopted. Cross-database, R2 and queue/cache effects have explicitly separate recovery/compensation semantics, never claimed atomic under Q52. Require injected commit/enqueue/purge failures, duplicate delivery, poison/replay and upgrade/payload compatibility evidence without duplicating successful business effects. **Blocks affected write/job/publishing/effect implementation and MVP deployment**; closes before that work starts, without blocking unrelated implementation after its own gates.
[STATUS: DEFERRED]

### Q67 — Deferred design: author consistency, public propagation and preview isolation

- Amendment 001 (see [understanding-amendments-001.md](understanding-amendments-001.md)): local-first read-your-writes is local-by-construction; the remote pull transport is poll-based for MVP, scoped to the server-authoritative working set; Q67's public-propagation/preview rules still govern the remote.

- Context: Review-03 finding 12 expands Q7/Q54/Q57. Cache purge hooks alone do not define read-your-writes, public staleness, global visibility or secure draft preview; KV is eventually consistent and Cache API deletion is local to a data centre.
- Agent default: Bypass caches for authenticated author previews, then version public content with an authoritative version source and explicit propagation budget; evaluate rather than assume KV pointer freshness.
- Answer: **Deferred from onboarding by explicit dev decision; affected-work gate.** Owner: cache/editing consistency design in spike plan 000, with Q54 supplying draft/publish/schedule/preview needs, Q57 the capability and Q66 reliable effect/retry handling. Intended outcome: one ADR plus explicit author read-your-writes behaviour, publication acknowledgement semantics, tolerated public propagation/staleness window, authoritative version/pointer source, local/global purge mechanism, failure/retry diagnostics and cache key/permission policy. No concrete public-staleness time or global synchronous visibility is selected during this fold; a stale KV version pointer cannot solve freshness by assumption. Drafts/authenticated previews bypass shared public caches or use provably isolated keys/access; ensure private/no-store responses and presentation-library history snapshots cannot expose drafts/secrets between users or preview/public contexts. HTTP cache directives alone are not a policy for JavaScript history caches. Require author/public/multiple-cache-location, publish/schedule, purge-failure/retry and unauthorized-preview evidence; keep the same guarantees for API and optional HTML presentation paths. **Blocks affected cache/content-preview/editing consistency implementation and MVP deployment**; closes before that work starts, not before unrelated implementation whose own gates are met.
[STATUS: DEFERRED]

### Q68 — Deferred design: security surface profiles, rate limiting and auth bootstrap

- Context: Review-03 finding 13 restores explicit rate-limit policy and clarifies Q59's contradictory opt-in defaults. Q50 roles/scopes do not choose sign-in/registration methods or create the first authorized administrator. All custom API and HTML routes need baseline enforcement.
- Agent default: Mandatory surface profiles for cookie auth, machine tokens and public forms; explicit first-admin provisioning and serverless-safe atomic rate-limit storage. Exact auth methods, storage and provisioning procedure remain to decide.
- Answer: **Deferred from onboarding by explicit dev decision; affected-work gate.** Owner: core security/auth design in spike plan 000, coordinated with Q40 deployment/session/SSR topology, Q50 permission model, Q53 secrets, Q59 locked protections and Q67 private preview/cache isolation. Intended outcome: one ADR plus mandatory baseline/profile applicability, permitted auth/sign-in/registration methods, first-admin bootstrap/provisioning/recovery, server-side role/scope/resource authorization and session/credential/origin/CSRF rules for cookie-authenticated, machine-authenticated and public-form surfaces. Token issuance/scopes/revocation must use the same permission boundary; no permissive profile or frontend nav gating substitutes for server authorization. Choose rate-limit/abuse limits, trusted client identity/proxy handling and storage/atomicity appropriate for Workers; Turnstile remains server-validated public-form protection, not a substitute for all auth/API/upload limits. Better Auth's default isolate-memory limiter must not be assumed distributed/serverless-wide; its own auth protection does not automatically cover custom mutations. Preserve CSP/security headers/Zod/upload validation and sanitization without weakening policy for a UI library; presentation headers (including HX-Request if that candidate is used) are not authentication. Evidence includes denied undeclared/unprotected surfaces, expired sessions, forbidden origins/CSRF, token/resource permissions, rate-limit concurrency/storage, bootstrap and untrusted upload/content cases. **Blocks affected auth/security/public-surface implementation and MVP deployment**; closes before that work starts, not before unrelated implementation after its own gates.
[STATUS: DEFERRED]

### Q69 — Post-MVP: what lives at yomban.ink itself?

- Context: Split from Q48/Q64 by review-03 finding 2 so the locked product/repo identity and release decisions do not conceal an open site-purpose or dogfooding choice.
- Agent default: Marketing/docs site built as a Yomban.ink consumer for dogfooding; historical proposal, not approved purpose or MVP deliverable.
- Answer: **Explicitly deferred until after MVP by the dev.** Intended outcome: decide whether the domain hosts marketing/docs, a product/application home and/or a dogfooding consumer, then define its scope in a separate post-MVP website plan/decision. Owner: that future site-purpose decision, not the foundational platform spike plan. **Does not block platform/scaffold implementation or MVP deployment.** Product name remains Yomban.ink, repository/domain `yomban.ink`; no site-purpose assumption may influence core/module contracts, starter selection or release/versioning (Q48/Q64).
[STATUS: DEFERRED]

### Q70 — Local-first client datastore and sync capability (foundational spike)

- Amendment 002 (see [understanding-amendments-002.md](understanding-amendments-002.md)): **MVP deliverable** — the MVP must ship a working local-first store + sync experience (its design still closes via this foundational gate, with implementation shipping in MVP).

- Context: The dev wants the frontend to write to a local/browser datastore that syncs with the remote, enabling offline capability and shared schema/query code across frontend and backend (and easing work on the local-first CriticalSheets pilot). Touches Q10/Q11/Q35/Q37/Q38/Q40/Q45/Q52/Q54/Q66/Q67. Amendment 001 (`understanding-amendments-001.md`) is its record.
- Agent default: A core datastore capability binding a Drizzle instance to the environment's SQLite driver (D1 server-side, browser SQLite client-side), plus a sync layer (op-log outbox, presence leases, field-level conflict surfacing).
- Answer: **New foundational capability; DEFERRED as a spike (one ADR plus a concrete design and verification evidence) in spike plan 000, coordinated with Q38/Q40/Q45/Q52/Q54/Q56/Q66/Q67. Additive — reopens no locked decision (see amendments 001 §A; the custom query language is NOT reopened).** Confirmed shape: (1) **local store** = SQLite in a Web Worker over OPFS (persistent across reloads), driven by Drizzle's SQLite proxy driver, same `sqliteTable` schema as the server; (2) **datastore capability seam** = framework-free, browser-safe, returns a driver-bound Drizzle instance so module code runs on both surfaces without naming a driver (a new Q40 export boundary); (3) **"record" = aggregate root** plus the rows one logical edit writes — locks/revisions/tombstones/conflict attach to the root, child rows inherit it; module manifests declare aggregate roots (per-record locking for MVP, group locks later); (4) **sync unit = change-set** — one user action → one local SQLite transaction → one change-set → one server D1 batch (Q52), pushed in `local_seq` order, applied all-or-nothing per set with the whole set rejected on any auth failure, `change_set_id` as the idempotency key (Q66), fail-stop on partial rejection, server-derived writes folded into the same batch; (5) **conflict detection is field-level** (per-field base value+rev; non-overlapping edits auto-merge; surface a three-way diff with mine/theirs/both-fork; rejected ops visible, never dropped); (6) **presence-lease locks** — acquire on open (only for records that exist remotely), heartbeat ~TTL/3, release on close, server-clock TTL expiry; no steal of a live lease by another user, same-user second device reassigns; leases are **advisory, not atomicity** (Q52); offline edits are unlocked-provisional; lock eligibility is **decoupled from publish state**; (7) **working-set scope** — the local store holds the user's working set (Class 1 authored bidirectional / Class 2 read-only cache / Class 3 remote-only), server-authoritative subscription (a security boundary, Q50/007), poll-on-focus/interval/reconnect transport (no MVP event bus or unsolicited push; WebSocket/SSE later), narrow alerting (silent apply unless conflict or explicitly watched); (8) **nine risk resolutions** — data-write + change-row in one local SQLite transaction and a single write path; per-action atomicity; delete tombstones with retention AND all-replicas-acknowledged then a GC cron job (Q56), explicit purge overrides; `navigator.storage.persist()` + quota monitoring + Class1/Class2 separation + prompt sync (OPFS can be evicted; Tauri/Capacitor filesystems are safer); payload version tags with current + N-1 acceptance, too-old-client → read-only+export, tolerant readers, additive-only changes, versioned local migrations with a pre-migration snapshot; lease-superseded detection and a stranded-rejected-ops bucket; defer remote-apply for a record under an active lease (not the whole loop). Full detail: `understanding-amendments-001.md` §B.
- Owner/question: local-first client datastore + sync design in **spike plan 000**, coordinated with Q38/Q40/Q45/Q52/Q54/Q56/Q66/Q67. Outcome: one ADR plus concrete design and verification evidence — an ADR alone is not closure.
- Block: blocks the local-first client store, the sync/lock/conflict layer and their affected implementation; does not block unrelated implementation whose own gates are met.
[STATUS: DEFERRED]

### Q71 — Privacy / personal-data handling: platform-level or per-project?

- Context: Surfaced when the spec-review fold (finding YB-S2 / decision D4) was reconciled against Amendment 001 (Q70), which places authored data on-device (browser OPFS). Neither the specs nor the base record previously stated whether personal-data handling is a platform responsibility or a per-project one, despite user auth, public forms (Turnstile), uploads and POPIA-relevant South African pilots. Amendment 002 (`understanding-amendments-002.md`) is its record.
- Agent default: Leave privacy to consuming projects (the Q59 security baseline alone).
- Answer: **Platform-guardrailed, per-project-policied — and the guardrails extend to client-local data.** Platform-level guardrails (locked): redaction-by-default in the observability seam (no PII, request bodies, tokens or full auth payloads in default logs/traces/diagnostics); a data-classification / PII-marking seam so modules flag PII-bearing fields; erasure/retention primitives so a project can fulfil a data-subject request, **explicitly reaching on-device replicas** (OPFS Class-1 authored data under Q70), so a DSR is not satisfied by server-side deletion alone; and safe defaults on platform-shipped surfaces (auth minimalism, Turnstile, upload validation, no PII leakage through cache/history per Q67). Per-project (consumer-owned, explicitly not a platform gate): lawful basis; consent wording/capture; DSR fulfilment policy/timelines; data-specific retention periods; cross-border transfer; regulator registration (POPIA/GDPR); privacy notices. POPIA is in scope (owner and both pilots are South African). Owner: Q65 (erasure/retention primitives, extended to local data), Q70 (client-local store + tombstone/purge), Q59 (security baseline) and Q68 (surface profiles); concrete privacy/erasure mechanics fold into Q65/Q70 in spike plan 000.
[STATUS: ANSWERED]
