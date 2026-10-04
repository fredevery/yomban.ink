# Architectural Patterns — Yomban.ink

*Why* the architecture looks the way it does (not *what* — see `docs/specs/`). A fresh agent
encountering an unfamiliar pattern should find the rationale here. Sources: Q8, Q9, Q29–Q32,
Q40, Q46, Q52, Q70 + `docs/decisions/0001-platform-foundations.md`.

## 1. Docs-first architecture

No code until the spec/plan says so. The doc stack is the source of truth; the answering path is
`docs/discovery` (settled Q&A) → `docs/specs` (what) → `docs/decisions` (why) → `docs/plans`
(order) → `docs/conventions` + `docs/best-practices` (how). An agent implementing from a reviewed
spec produces consistent work; from vague instructions it invents conventions ad-hoc.
**Don’t** jump to code with a design decision unresolved — write it down, review it, implement.

## 2. Platform, not CMS — modules are vertical capability slices

Content/admin/editing are **ordinary built-in modules** on equal footing with custom modules
(no privileged access). A module owns a feature end-to-end — its contracts, routes, business
logic, schema/migrations and whichever **optional** UI/client facets it supplies; a **service-only
module** (no UI) is valid. Ownership of a feature does not mean implementing every presentation.
**Don’t** add a horizontal “all controllers” layer, or make UI facets a prerequisite for module
registration / non-UI capabilities.

## 3. Build-time composition + registry-provided services

Modules are packages installed into the consumer’s monorepo and **imported/wired by the core at
build** — there is no runtime plugin loader, so the dependency graph and capability contracts are
known and checkable at build/CI time. Runtime interaction between modules goes through
**registry-provided typed services** (a manifest declares what a module EXPOSES); direct imports
are allowed only for typed shared code. **Don’t** introduce runtime registration, a central
service registry, monkey-patching, or an MVP event bus.

## 4. Frontend independence (the load-bearing invariant)

Core services, shared contracts and headless clients have **no direct or transitive dependency
on any presentation framework/library** (incl. Svelte/SvelteKit and htmx). Presentation is an
optional module facet and an optional consumer choice; the host retains ownership of its content
DOM. This is proven by a shared acceptance fixture (a plain HTML/server-rendered host and a
bounded reactive-framework host reading/editing the same content through **unchanged**
services/contracts) — not by shipping extra production renderers. **Don’t** let a UI/library
choice leak into core, contracts or headless code, and don’t weaken CSP for a presentation
library.

## 5. One deployment per project (not multi-tenant)

The platform is a reusable scaffold composed per project; each consuming project is its own
deployment. This keeps the data model and core simple (no shared-host tenancy). **Don’t** design
shared cross-project resources or a tenancy model into the core.

## 6. One datastore language on both surfaces (D1 ↔ browser SQLite)

The server datastore is **D1** with **Drizzle** as the schema/query language (no query-builder
abstraction). The Q70 client capability binds a **browser-local SQLite** store (Web Worker over
OPFS) to the *same* `sqliteTable` schema and Drizzle code, through a framework-free core
datastore capability seam — one dialect, no new abstraction. **Don’t** add a dialect-neutral
query language or a datastore abstraction above Drizzle; any future server engine must be
SQLite-dialect-compatible.

## 7. Atomicity is honest about D1

The unit-of-work seam is **one D1 database + one prepared-statement batch**: a statement error
rolls the whole batch back. It is **not** an arbitrary async JS transaction, and **not** atomic
across databases, R2, queues or cache purges — those get separately designed recovery (Q66).
Offline/local-first writes are provisional until sync acceptance. **Don’t** claim cross-boundary
atomicity or rely on pre-read-then-write invariants.

## 8. Deferred ≠ undecided-by-accident

The foundation is locked, but named **gates** (Q38/Q40/Q46/Q47/Q54/Q63/Q70 + Q65–Q68) each
produce one ADR **plus** a concrete design and verification evidence before their affected
implementation. Recording a candidate (e.g. htmx) is not adopting it. **Don’t** treat a “planned”
mechanism as already designed, and don’t let a diagram or ADR silently select an unselected
implementation.
