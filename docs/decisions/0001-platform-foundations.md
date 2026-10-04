# ADR-0001 — Platform foundations (consolidated)

- **Status:** accepted (2026-10-04) — authored at the Orca onboarding baseline write.
- **Deciders:** the dev (owner). Recorded from settled discovery Answers; no decision is
  newly made here.
- **Sources:** `docs/discovery/understanding.md` Q1, Q8–Q13, Q17, Q18, Q22, Q28–Q32, Q37,
  Q39, Q43, Q45, Q46, Q51, Q52, Q63; `docs/reviews/001_spec-review.md` §9 (D1–D5, Q-A);
  `docs/specs/000_index.md` … `008_operations-and-quality.md`.

> **Scope of this record.** The discovery Answer (Q17) calls for rationale **and rejected
> alternatives** to be recorded for the platform's locked topics. This single consolidated
> ADR records them now; it is intended to be **split into per-topic ADRs later** (one per
> decision below) without changing their content. It is a *record* of locked decisions, not
> an approval of any open implementation choice, and it must not be read as selecting any
> deferred/candidate mechanism (public starter, dashboard/controller/panel, htmx, etc.).

## Context

Yomban.ink is a greenfield, docs-first project at specification stage: a **modular,
composable application platform — not a CMS** (Q1/Q43). Its foundations were settled during
discovery (Q1–Q71) and independently reviewed (`docs/reviews/001_spec-review.md`), whose §9
resolutions (D1–D5, Q-A) are folded into the specs. This ADR collects the locked foundation
decisions and the alternatives rejected for each, so a fresh session does not re-litigate them.

## Decisions

**D1 — Product category: modular application platform, not a CMS.**
Modules own feature capabilities; core supplies cross-cutting infrastructure and framework-free
capability contracts. A full CMS is something a consumer *builds on top of* the platform by
composing modules. *(Q1, Q43)*
*Rejected:* describing Yomban.ink as a CMS — it undersells the composable system and conflates
one capability (content/admin/editing) with the product identity.

**D2 — Backend stack: Workers + Hono + better-auth + TypeScript + pnpm.**
Cloudflare Workers runtime/hosting; Hono as the base server engine; better-auth for auth;
TypeScript throughout; pnpm as package manager; monorepo. *(Q13, Q9)*
*Rejected:* backend portability / an interchangeable server framework. Frontend independence
does **not** reopen the backend stack — the two are separate invariants.

**D3 — Build-time composition, no runtime plugins.**
Modules are packages installed into the project's monorepo and imported/wired by the core at
build. Trusted compiled modules are not sandboxed. *(Q29, Q22, Q25)*
*Rejected:* a runtime plugin loader — reintroduces the dynamic registration/authority the
build-time model deliberately avoids.

**D4 — Module-owned Drizzle/D1 schema + a core migration runner.**
Each module owns its tables and migrations; the core owns a small Better Auth base schema and
the migration runner. Canonical **stored** types are inferred from module Drizzle schema, never
prose; public DTOs are derived/mapped, not raw rows. Media records are module-owned (not core
schema). *(Q10, Q37, Q58)*
*Rejected:* a unified core-controlled schema; a query-builder abstraction above Drizzle.
Migration *mechanics* (placement, ledger, ordering, locking) are deferred to gate Q63.

**D5 — Identity: prefixed, sortable, URL-safe TEXT ids; no INTEGER PKs.**
Every entity gets a globally-unique, sortable, URL-safe TEXT id with an entity-type prefix
(e.g. `pg_<ulid|uuidv7>`), generated via one core id-service seam; modules declare prefixes.
Human slugs are secondary keys; identity is not addressability. *(Q11)*
*Rejected:* INTEGER auto-increment primary keys — they require coordinating database sequences
and additional client/external identity mapping. Better Auth prefixed-TEXT-ID compatibility is a
required Q63 evidence check (failure surfaces, never silently falls back to integer ids).

**D6 — One deployment per project (no multi-tenancy).**
Yomban.ink is a reusable scaffold, not a shared multi-tenant host. *(Q32)*
*Rejected:* multi-tenancy in one instance — shapes the data model and core around a sharing
model the product does not want.

**D7 — Built-in content is ordinary modules, not the platform identity.**
The content/admin/editing capability (in-situ editing, dashboard, content modules) is a built-in
module set on **equal footing** with custom modules — no privileged access. A working dashboard
and editing experience ship in the MVP but are replaceable/omittable by consumers. *(Q39, Q43,
Q30, Q28)*
*Rejected:* making content/admin/editing inseparable core components, or granting built-ins
privileged access — custom modules must compete on the same manifest/contract.

**D8 — Frontend independence is a locked platform invariant.**
Core services, shared contracts and headless clients carry **no direct or transitive**
presentation-framework/library dependency (including Svelte/SvelteKit and htmx). UI facets are
optional module contributions; the public-site starter, bundled dashboard, overlay controller
and overlay editing panel are **distinct roles**, none selected. A shared acceptance fixture
(plain HTML/server-rendered host + a bounded reactive-framework host) proves the boundary.
*(Q1, Q8, Q22, Q25, Q46, Q47, Q51)*
*Rejected:* making any frontend framework/presentation library a prerequisite for platform
consumption; the former SvelteKit public-site starter choice (explicitly **reopened** by the dev
during the review-03 fold — superseded, not a current default).

**D9 — Registry-provided typed services are the inter-module runtime mechanism.**
A module's manifest declares what it EXPOSES; dependents receive typed service instances from
the core-resolved registry. Direct imports remain allowed for typed shared code. No event bus in
the MVP. *(Q36, Q41)*
*Rejected:* monkey-patching / ad-hoc module coupling; direct-import-only runtime interaction.

**D10 — Unit-of-work atomicity = one D1 database + one prepared-statement batch.**
Statements run sequentially; a statement error rolls back the batch. Registry services contribute
deferred operations to the same unit of work rather than independently committing. *(Q52)*
*Rejected:* arbitrary async JS read/branch/write transactions; cross-database/R2/queue/cache
atomicity (Q66 designs external-effect recovery instead).

**D11 — Permission model: roles + module-prefixed permission-scopes.**
Modules declare permission keys as enum-defined, module-prefixed keys; roles map to permission
sets; resource-level checks where needed; better-auth maps onto this. The aggregated key grammar
is `<ModuleNamespace>:<Member>` (PascalCase), with the namespace registered at the same point as
ID prefixes (one namespace authority). Enums/permission keys are **aggregated by build** into a
derived artifact — no central registry. *(Q50, Q11, Q22; review §9 D3/Q-A)*
*Rejected:* implicit cross-module satisfaction by bare member name (composition defaults to
*explicit* satisfaction); a central runtime enum/permission registry (reintroduces runtime
registration the build-time model forbids).

**D12 — Repo-based distribution, `@yomban-ink/*`, no npm publish in MVP; git-tagged releases.**
Installation is from a repository; package scope `@yomban-ink/*`; release/versioning uses
git-tagged releases with package.json semver driven by changesets + conventional commits. Module
contract semver accepts current + N-1 majors; upgrade CLI + codemods (distinct from DB migrate).
*(Q31, Q48, Q49, Q64)*
*Rejected:* npm publishing in MVP; lockstep and tag-pinned releases; feature-detection as the
upgrade mechanism.

**D13 — Privacy: platform-guardrailed, per-project-policied.**
Platform ships safe-by-default guardrails (redaction-by-default in the observability seam, a
PII-classification seam, erasure/retention primitives **reaching client-local replicas**); the
consuming project owns policy (lawful basis, consent, DSR fulfilment, retention periods,
cross-border transfer, regulator registration, notices). POPIA is in scope. *(Q59, Q65, Q70,
Q71; review §9 D4)*
*Rejected:* pure per-project (contradicts the platform's safe-by-default security precedent);
pure platform-level (the platform cannot own a project's lawful basis).

**D14 — The client datastore/sync capability (Q70) is additive and an MVP deliverable.**
A browser-local SQLite store (Web Worker over OPFS, same `sqliteTable` schema as the server,
driven through a framework-free core datastore capability seam) plus an op-log sync layer
(change-sets, presence leases, field-level conflict surfacing, server-authoritative working-set
scope). It reopens **no** locked decision and adds **no** query-builder abstraction; the custom
dialect-neutral query language is explicitly **not** reopened. Its design closes via foundational
gate Q70 in spike plan 000; its affected implementation ships in the MVP. *(Q70, amendments
001/002; Q10, Q45, Q52, Q66, Q67)*
*Rejected:* a custom dialect-neutral query language (the shared-schema goal is met by Drizzle +
a driver seam); PGLite/Postgres-dialect for the client (forfeits the shared-schema benefit).

## Consequences

- The locked foundations above are the ceiling a fresh session reads before the conventions
  layer; the deferred **gates** (Q38, Q40, Q46, Q47, Q54, Q63, Q70 foundational; Q65–Q68
  affected-work; Q69 post-MVP) each produce **one ADR plus a concrete design and verification
  evidence** — an ADR alone is not closure.
- This consolidated record should be **split per-topic** (D1–D14) when convenient; splitting
  must preserve the decisions and their rejected alternatives verbatim.
- No decision here selects a public starter, dashboard/controller/panel implementation, or the
  htmx candidate; those remain unselected and require recorded evidence + the dev's explicit
  choice.

## Follow-on decisions needed

- The foundational and affected-work gates are owned by **spike plan 000** (planned, not yet
  authored). See `docs/status/yomban-status.md` and `docs/specs/000_index.md` for sequencing.
