# Yomban.ink: product scope and MVP

Status: Specification baseline derived from answered discovery; no implementation is selected beyond the decisions marked locked below.

## Purpose

Yomban.ink is a modular, composable application platform—not a CMS—that avoids rebuilding common application infrastructure across projects. It provides cross-cutting infrastructure and capability contracts; built-in content, administration and editing are ordinary platform modules. Product name and repository/domain name are both `Yomban.ink` / `yomban.ink`. The name draws on Xhosa *yombane* (“electric”), framing the product as “digital tattoos for the internet / electric ink.” The owner and sole maintainer is Fred Every (`fred@fredevery.co.za`). The repository is greenfield and remains at specification stage. [Q1–Q4, Q43]

## Locked decisions and constraints

- Product category: modular application platform, not a CMS. A consumer may build a CMS by composing modules. [Q1, Q43]
- Frontend independence is a platform invariant: core, shared contracts and headless client capabilities do not depend directly or transitively on presentation frameworks/libraries. A consumer may replace or omit the bundled presentation. This does not mean backend portability: Workers, Hono, better-auth, TypeScript, pnpm and D1/Drizzle are selected. [Q1, Q13, Q22, Q25, Q45–Q47, Q51]
- Composition is build-time, not runtime plugin loading. The project is a monorepo, one deployment per consuming project; modules are vertical capability slices and built-in modules have no privileged core status. [Q9, Q28–Q30, Q32, Q34, Q39]
- The MVP includes a functional bundled content dashboard and in-situ editing experience — **the dashboard role is a locked deliverable; its implementation is unselected** — and requires a **selected public-site starter** as the deployed public client. No public-site starter, dashboard, overlay-controller or panel implementation has been selected yet. Hono-rendered HTML/htmx and plain-TypeScript-controller/htmx-panel are evaluation candidates only. [Q1, Q5, Q22, Q40, Q46, Q47, Q54]
- No runtime plugins, multi-tenancy, third-party module marketplace, scaffold-into-existing-project, mobile delivery, or multiple complete production frontend renderers in MVP. [Q5, Q18, Q32, Q46]
- Pilot audit (Q42) provides evidence and candidate modules, not a commitment to build every audited candidate. The MVP plan selects a representative pilot-derived proving set; complete rebuilds of both pilots follow MVP. [Q7, Q33, Q42]

## MVP requirements

The MVP is a deployed, end-to-end platform scaffold robust enough to begin live projects—not merely a local generator. A clean generated project must install, run, test and deploy. The golden path is scaffold → create module → migrate → dev → deploy. It must provide authentication and server-side permissions; authorized content editing and publication reflected in the deployed client; migrations against empty and existing databases; documented configuration, secrets, diagnostics and recovery; and a working bundled content/admin/editing experience. [Q7, Q31, Q37, Q44, Q50, Q54, Q63, Q60]

MVP completion includes a representative pilot-derived scenario that proceeds from scaffold to deployed with zero core edits. Full pilot rebuilds are not required for this gate. A plain HTML/server-rendered host and a bounded reactive-framework host fixture must read, edit and publish the same content through unchanged services/contracts; these are acceptance fixtures, not additional production renderers. [Q7, Q33, Q42, Q47, Q61]

The MVP includes a **selected public-site starter** as the deployed public client and a **local-first client datastore + sync experience (Q70)** — a public-facing consumer frontend and an offline-capable client-local store are in MVP scope, alongside the bundled dashboard and the two acceptance fixtures. The fixture's minimal scope is defined in [Clients and presentation](004_clients-and-presentation.md) §Acceptance criteria (its ownership: defined by Q47, executed by Q61, gated by Q7). [Q7, Q46, Q47, Q61, Q70]

## Verifiable acceptance criteria

- From a clean environment, scaffolded output installs, runs tests and typechecks, builds and deploys through the documented golden path.
- A selected representative pilot-derived module scenario is deployed without edits to platform core; the selected modules are explicitly chosen by the future MVP plan, not inferred from the full audit list.
- Authentication and server-side authorization protect module operations. Authorized content edits and publication appear through the consuming client without changing the shared services/contracts between the two host fixtures.
- Migrations are exercised from empty and existing database states; configuration, secrets handling, diagnostics and recovery procedures are documented.
- The bundled editing experience meets the content workflow, security, consistency and accessibility criteria in the linked specifications; consumers can replace/omit optional presentation without losing non-UI capabilities.
- MVP deployment is gated on foundational design closure and on Q65–Q68 affected-work designs/evidence; these affected gates do not prohibit unrelated work whose own prerequisites are satisfied.

## Deferred design and gates

The authoritative gate inventory is Q19. The following foundational prerequisite work must close before foundational implementation begins:

- Q38: core capability inventory (first), including required/optional policy; informs module capability checks and core boundaries.
- Q40: coupled composition, packaging, deployment, installation and lifecycle design; final export/topology choices close with Q47 after Q54 workflow input.
- Q46: explicitly reopened public-site starter choice; no starter is selected.
- Q47: framework-free client/wire/host/presentation interfaces and explicit dashboard/controller/panel choices; no candidate is adopted by implication.
- Q54: content types, publishing/editing workflows and evidence.
- Q63: database placement/migration mechanics and Better Auth prefixed-ID compatibility evidence.
- Q70: local-first client datastore + sync capability (additive; reopens no locked decision; owned in spike plan 000). **An MVP deliverable** — the MVP ships a working local-first store + sync experience; the gate closes its design before that implementation.

Each foundational spike produces one ADR plus a concrete design and verification evidence; ADR creation alone is not closure. Q65 backup/restore, Q66 durable effects/idempotency, Q67 cache/author/public consistency and Q68 security/bootstrap/rate-limit are affected-work gates: each closes before its affected implementation and before MVP deployment, but need not block unrelated implementation. Q69 site purpose/dogfooding is explicitly post-MVP and does not block platform/scaffold work. Q70 (local-first client datastore + sync) is an additive foundational gate — it reopens no locked decision and adds no query-builder abstraction. See [Operations and quality](008_operations-and-quality.md) and the [spec index](000_index.md) for ownership, evidence and gate details. [Q19, Q38, Q40, Q46, Q47, Q54, Q63, Q65–Q70]

## Post-MVP scope and explicit non-goals

- Full rebuilds of Kasteel and FreeAgents follow MVP. Pilot audit entries remain candidates pending MVP selection. [Q7, Q33, Q42]
- Search, mobile/Capacitor delivery, additional complete production UI implementations, and the purpose/dogfooding of the `yomban.ink` site are post-MVP. Q69 is independent of platform/scaffold work. [Q6, Q19, Q46, Q54, Q69]
- Runtime plugin loading, multi-tenancy, marketplace, scaffold-into-existing-project and backend/frontend framework coupling are not MVP goals. [Q5, Q18, Q22, Q25, Q32]

## Related specifications

- [Module platform contract](002_module-platform-contract.md)
- [Data and migrations](003_data-and-migrations.md)
- [Clients and presentation](004_clients-and-presentation.md)
- [Content and editing](005_content-and-editing.md)
- [CLI and distribution](006_cli-and-distribution.md)
- [Security and identity](007_security-and-identity.md)
- [Operations and quality](008_operations-and-quality.md)
- Historical discovery: [understanding.md](../discovery/understanding.md); amendment record: [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)
