# Yomban.ink: clients and presentation

Status: Specification baseline derived from answered/recorded discovery; frontend independence is locked, but no public starter, dashboard, overlay-controller or panel implementation is selected. Candidate stacks are evaluation candidates only.

## Purpose

This specification fixes the boundary between the platform's framework-free capabilities and its optional, replaceable presentation surfaces. Consuming projects choose their own frontend; core services, shared contracts and headless clients work without any presentation framework or library. It records the exact presentation decisions that remain undecided, the gates that settle them, and the acceptance evidence that proves the boundary holds. [Q1, Q8, Q22, Q25, Q46, Q47, Q51]

## Locked decisions and constraints

- **Frontend independence is a platform invariant.** Core services, shared contracts and headless clients have no direct or transitive dependency on frontend frameworks or presentation libraries, including Svelte/SvelteKit and htmx. Chosen presentation dependencies belong to optional presentation packages only. Presentation/UI facets are optional module contributions, never prerequisites for module registration or for non-UI capabilities. [Q1, Q22, Q25, Q46, Q51]
- **Presentation is optional for consumers.** A consumer may replace or omit the bundled presentation surfaces without losing non-UI platform capabilities, and without core edits. A module may be service-only and register/operate with no UI facet at all. [Q1, Q5, Q28, Q30, Q34]
- **The MVP still ships a functional bundled dashboard and in-situ editing experience.** These are ordinary module capabilities for consumers, not inseparable core components; their replacement/omission cannot disable non-UI functionality. [Q1, Q7, Q30, Q46]
- **Dashboard, overlay controller and overlay panel are separate roles and separate choices.** They are distinct from the public-site starter and from each other. The host integration maps editable DOM to entity/field references and the **host retains ownership of its content DOM**; panel presentation is separate, and the host cannot be forced to adopt the panel library or have its existing configuration hijacked. [Q8, Q12, Q46, Q47]
- Product and repository/domain names are both **Yomban.ink / `yomban.ink`**; the name draws on Xhosa *yombane* (“electric”), framing it as “digital tattoos for the internet / electric ink.” The project is greenfield; owner/maintainer is Fred Every. [Q2–Q4]
- **The public-site starter is reopened; the former SvelteKit choice is superseded, not a current default.** No frontend implementation is selected for the public starter, dashboard, controller or panel. Choosing a presentation layer does not alter the platform's frontend-independence lock. [Q46, Q62]
- **Hono-rendered HTML + htmx dashboard and a plain TypeScript overlay controller + htmx panel are evaluation candidates, not adopted implementations.** Evaluating or rejecting them does not change the locked core independence requirements. Candidate evaluation is conditional: htmx-specific checks apply only if that candidate is selected. [Q40, Q46, Q47, Q61]
- **Shared framework-free contracts are locked** (per-module public types/runtime schemas + typed client from module source). Public DTOs are derived/mapped from stored types, not unfiltered database rows. Runtime wire mechanics—route shapes, runtime input/output validation, serialization, stable errors, browser-safe exports—are explicitly deferred to Q47. [Q10, Q47, Q51]
- **Backend stack is not reopened by frontend independence.** Workers, Hono, better-auth, TypeScript, pnpm, D1/Drizzle remain selected. [Q1, Q13, Q22]
- **Mobile (Capacitor) is architectural direction only, not an MVP deliverable.** [Q12, Q34, Q46]
- **A local-first client datastore + sync is a platform capability (Q70), additive.** The client store is a browser-safe export (SQLite in a worker over OPFS, bound through the core datastore capability); module and shared-contract surfaces stay framework-free. Sync/conflict **surfacing** is a presentation concern whose mechanism remains unselected alongside the dashboard/controller/panel choices (Q47). It is an **MVP deliverable** — the MVP ships the local-first store + sync. [Q25, Q47, Q51, Q70]

## Presentation surfaces and boundaries

The public application, public-site starter, bundled admin dashboard, overlay integration controller and overlay editing panel are **distinct roles**, not a single shared renderer. Concrete route shapes, package locations, execution/SSR hosting, auth-handler ownership and cookie/session/origin topology are Q40 outcomes, not inferred from directory names or a frontend framework. [Q8, Q12, Q40]

- Public application (`apps/web` represents the consuming public application): its starter choice is explicitly reopened under Q46 and unselected. [Q12, Q46]
- Bundled admin dashboard: optional first-party consumer; its implementation choice is unresolved under Q40/Q47. [Q8, Q30, Q47]
- Overlay integration controller: separates DOM-mapping/host integration responsibility from panel presentation; host owns its content DOM. [Q8, Q47]
- Overlay editing panel: its presentation is separate from the controller; implementation choice unresolved. [Q8, Q47]
- `apps/mobile` is direction only, not MVP packaging. [Q12, Q34, Q46]

Domain operations live outside frontend server-action/routing conventions; public framework routing and server actions do not define module registration or domain operations. Public API and optional HTML admin paths invoke the same domain/authorization operations; HTML may call services in-process. [Q34, Q47, Q51]

DOM integration code is separated from headless/server-safe code. Headless and browser-safe exports are distinct; browser contract exports must not expose server-only dependencies or private fields. [Q25, Q47]

## Undecided UI decisions and gates

The authoritative gate inventory is Q19; the following items are explicitly undecided and must be resolved by the named prerequisite designs, each producing **one ADR plus a concrete design and verification evidence** (an ADR alone is not closure):

- **Public-site starter** — requires an explicit choice and a bounded support commitment (Q46). It is reopened and unselected; resolves compatibility with the locked framework-free contract. Blocks starter scaffolding and MVP public-client implementation. MVP completion requires this selection (a public-site starter is in MVP scope); **Q46 closes alongside Q40/Q47 after Q54 supplies workflow input**, and MVP public-client implementation waits on that joint closure. [Q46, Q40, Q47, Q54]
- **Package/export/composition/deployment/installation/lifecycle mechanics** — Q40 owns packaging-versus-execution, composition roots, route/SSR/hosting and auth-handler topology, browser/SSR cookie/session propagation, credentialed CORS/trusted origins/CSRF across local/deployed/preview environments, generated-versus-installed ownership, and service/configuration lifetime (no binding I/O at init, no stale globally cached binding-derived clients). Exports/topology remain provisional until Q46/Q47 close. [Q40]
- **Framework-free client/wire/host/presentation interfaces and explicit dashboard/controller/panel choices** — Q47 owns browser-safe framework-free exports, runtime wire mechanics, DOM-integration separation, and the explicit dashboard/controller/panel implementation choice. It produces one ADR plus exact headless/host/presentation interfaces and executable boundary proof. No candidate is selected by implication. This includes owning the minimal-scope definition of the reactive-framework host fixture (§Acceptance criteria). [Q47]
- **Content/publishing/editing workflow semantics** — Q54 supplies the workflow input Q40/Q47 need (draft/review/publish/schedule/revision, unsaved/draft state, debounced saves, DOM-to-entity mapping, preview). Dashboard/controller/panel implementation choices are not assigned by workflows. [Q54, Q47, Q8]
- **Sequencing** — foundational Q40/Q47 close together, after Q54 supplies workflow semantics. Final export/topology choices close jointly. [Q19, Q40, Q47, Q54]
- **Dashboard/overlay performance targets** — set in Q40/Q47 using Q54 workflow input, before their implementation, not silently copied from public budgets. [Q62, Q40, Q47]
- **htmx acceptance evaluation** — conditional on selection. If the candidate is not adopted, htmx-specific checks are dropped without affecting core independence requirements. [Q40, Q46, Q47, Q61]
- **Offline/sync conflict surfacing** — how conflicts and lock state are presented is part of the Q40/Q47 presentation choices and reflects Q70's field-level diff (mine/theirs/both); no mechanism is selected. [Q40, Q47, Q70]

Deferred prerequisites referenced by this spec: Q38 (core capability inventory) and Q63 (migration mechanics) close before foundational implementation; Q65–Q68 are affected-work gates closing before their affected implementation and MVP deployment. These are governed in the linked specs and the [spec index](000_index.md). [Q19, Q38, Q63, Q65–Q68]

## Acceptance criteria

Frontend independence and shared capability use are proved by a **shared acceptance fixture**, not by adopting extra production renderers:

- A plain HTML/server-rendered host and a bounded reactive-framework host fixture read, edit and publish the **same content through unchanged services/contracts**, covering authorization, validation, CSP, input/focus/keyboard/announcements, stale-revision conflicts and lifecycle/unsaved-state preservation. The fixture's minimal scope is defined under *Fixture definition* below. [Q7, Q47, Q61]
- The host updates its own content through documented notifications and host-owned DOM swaps; no foreign DOM replacement, and the host's existing configuration is never hijacked. [Q8, Q47]
- Host updates follow each host integration; an update introduced by one presentation does not require changing shared services/contracts used by the other. [Q54, Q61]
- These fixtures are acceptance proof only, not additional production renderers committed to for the MVP. [Q7, Q47, Q61]
- **Fixture definition (minimal scope, locked):** the reactive-framework host fixture is a single page that lists and edits **one content entity** through the framework-free shared contracts only (typed browser-safe client + documented host notifications) — **no routing, no SSR/server actions, no framework data-loading conventions, no framework server runtime**; client-side rendering of that one page is permitted. The plain HTML/server-rendered fixture reads/edits/publishes the **same** entity. Both fixtures differ **only** in presentation mechanism, never in capability coverage. [Q7, Q47, Q61]
- **Fixture ownership:** the definition is owned by **Q47** (its "executable boundary proof"); **Q61** executes it in the conformance harness; **Q7** is the MVP gate it discharges. [Q7, Q47, Q61]
- Every mutation path (API and HTML/editing) enforces server-side authorization and applicable CSRF/origin rules; a presentation header such as HX-Request is not an auth boundary. Untrusted content is escaped/sanitized; CSP is not weakened for a presentation library. [Q59]
- htmx-candidate checks are conditional on selection; the bounded reactive fixture and plain/server-rendered fixture remain mandatory regardless (definitions under *Fixture definition*). [Q40, Q46, Q47, Q61]
- Conformance: core/headless/shared-contract packages pass boundary lint with no direct/transitive frontend/presentation dependency (checked in CLI/build/CI before build-time registration). [Q25, Q61]
- The local-first client datastore is a browser-safe, framework-free export; adopting it introduces no presentation dependency and does not weaken frontend independence (boundary lint per Q61). [Q25, Q61, Q70]

## Quality and performance targets

- **WCAG 2.2 AA** is required for bundled admin/editing and rendered public content; public content carries **SEO/structured data**. Library defaults do not prove accessibility; edits/swaps must preserve keyboard, focus, announcements and input state. [Q62]
- **LCP < 2.5s and INP < 200ms apply to the public reference frontend only**, explicitly confirmed. The reference frontend **is** the Q46-selected public-site starter (a selected starter is required for MVP); the starter's technology is unselected, and choosing it does not alter these budgets. Dashboard/overlay-specific targets are set in Q40/Q47 with Q54 workflow input before implementation. [Q62]
- Browser support: evergreen plus last 2 Safari/Firefox/Edge. Uptime is best-effort per project. [Q62]

## Post-MVP scope and non-goals

- Search, mobile/Capacitor delivery, and additional complete production public-site/renderer implementations are post-MVP. The public starter and dashboard/controller/panel implementations remain undecided regardless. [Q6, Q19, Q46, Q47, Q54]
- No public starter, dashboard, controller or panel is selected for the MVP; no candidate is adopted by implication of an ADR or diagram. [Q17, Q40, Q46, Q47]
- Frontend independence does not imply backend portability; the backend stack remains selected. [Q1, Q22]

## Related specifications

- [Product and MVP](001_product-and-mvp.md)
- [Module platform contract](002_module-platform-contract.md)
- [Data and migrations](003_data-and-migrations.md)
- [Content and editing](005_content-and-editing.md)
- [CLI and distribution](006_cli-and-distribution.md)
- [Security and identity](007_security-and-identity.md)
- [Operations and quality](008_operations-and-quality.md)
- [Specification index](000_index.md)
- Historical discovery: [understanding.md](../discovery/understanding.md) (see Q8, Q12, Q19, Q25, Q40, Q46, Q47, Q51, Q54, Q59, Q61, Q62, Q70); amendment record: [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)