---
title: "Q46 — public-site starter evaluation and bounded support (provisional design)"
created_session: "20261007_120050_2515b8"
sessions: ["20261007_120050_2515b8"]
approved: false
---

# Q46 — Public-site starter evaluation and bounded support (design)

> **Status: PROPOSED/PROVISIONAL design input for gate Q46 — NOT a closed gate.**
> **Dev acceptance of the shortlist + selection recorded 2026-10-07**
> (session 20261007_171307_b06e33) — see evidence §3; acceptance is NOT adoption.
> This is the task 3.3 deliverable
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.3.md`). It evaluates the
> **reopened public-site starter choice** as a distinct choice, never inferred from the
> admin/panel technology (Q47 candidates stay independent; the former SvelteKit choice
> stays **superseded**). It proposes a selection **and a bounded support commitment**;
> adoption awaits task 6.4 (phase-006 proof) + the joint Q40/Q47/Q46 closure
> (phase-007 task 7.8). The accompanying ADR is **Proposed, not accepted**
> (`docs/decisions/0008-public-site-starter.md`).
>
> **Evidence note:** per plan 000, no starter has been installed, scaffolded, built or
> measured — no LCP/INP number is claimed. The candidate matrix
> (`evidence/q46_public-starter.md`) is source-backed against official docs/registries
> verified 2026-10-07. **All performance-budget numbers below are TARGETS, never
> measurements of an unbuilt system.** See evidence §4 for the unverified list.

## 1. Scope and authority

Grounding sources:

- **`docs/specs/000_index.md` §Canonical gate table** — Q46's owner/evidence/block rows.
- **`docs/discovery/understanding.md`** — Q46 (reopened choice, bounded-support outcome),
  Q62 (public LCP < 2.5s / INP < 200ms reference-frontend-only; WCAG 2.2 AA; SEO/
  structured data; evergreen + last 2 Safari/Firefox/Edge), Q40 (composition/topology
  owns packaging-vs-execution; provisional until Q46/Q47 close), Q47 (client/wire/host/
  presentation contracts; its dashboard/panel candidates do not assign this choice),
  Q7/Q7-amendment-002 (MVP ships **one** selected public starter + local-first store),
  Q70 (browser-local SQLite store + sync — MVP deliverable), Q69 (yomban.ink site
  purpose — post-MVP, **must not influence this choice**), Q14/Q44 (dev-server wiring is
  a topology outcome).
- **Amendments 001/002** — `docs/discovery/understanding-amendments-001.md` (Q70
  local-first client datastore + sync export boundary) and
  `docs/discovery/understanding-amendments-002.md` (privacy guardrails reaching
  client-local data).
- **Prior phase inputs:** `designs/q40_composition-lifecycle.md` (PRIMARY predecessor —
  export classes §2, per-side packages §3, one-Worker topology §4/§6, generated-vs-
  installed ownership §13, Q70 browser-store lifetime §14);
  `designs/q47_client-host-contracts.md` (PRIMARY predecessor — typed module-source
  client §3, headless/DOM/presentation export split §4, sync/conflict surfacing §9,
  fixtures §11 — **fixtures are acceptance proof, not starter candidates**);
  `designs/q54_content-workflows.md` (ACCEPTED input — content model, publishing);
  `designs/q63_persistence-migrations.md` (D1/Drizzle/better-auth inputs, provisional).

## 2. Constraints any candidate must satisfy (hard filters)

Applied **before** any comparison; a candidate failing a hard filter is rejected without
further scoring:

1. **Consumes the host, does not replace it.** The candidate renders inside the ONE
   Cloudflare Worker deployment (q40 §4/§6) and consumes `@yomban-ink/contracts` +
   `@yomban-ink/clients` typed browser-safe surfaces (q47 §3/§4). It must not demand a
   second production server surface or its own server runtime (q40 §6: "the platform
   does not require a second production server surface").
2. **No framework dependency leaks into headless.** The starter lives entirely in the
   presentation side (`apps/web`); core/contracts/clients stay framework-free — the
   candidate must be consumable WITHOUT the platform depending on it (frontend
   independence, Q22/Q25; ADR-0007 §4).
3. **One production starter.** The MVP ships exactly one complete public renderer
   (Q7); a candidate must be able to BE that renderer, not a fragment.
4. **Fixtures are not starters.** The Q47-defined plain-host and bounded reactive
   fixtures (ADR-0007 §11) prove contracts; they are never starter candidates nor
   evidence of starter fitness.
5. **No Q69 dogfooding.** yomban.ink's own future site purpose is post-MVP and plays
   no role in scoring.
6. **SSR + SEO capability.** Q62 requires SEO/structured data for public content; a
   candidate must support server-rendered (or pre-rendered) HTML with per-route
   metadata/structured data on Workers.
7. **Superseded choices stay superseded.** The former SvelteKit starter choice is not
   reinstated by default; SvelteKit is evaluated as a fresh candidate only if it earns
   it. Hono/htmx (dashboard/panel candidates, Q47) are NOT automatically adoptable here.

## 3. Bounded shortlist (chosen AFTER compatibility inspection)

Two candidates pass the §2 hard filters and form the shortlist:

- **Candidate A — Astro + `@astrojs/cloudflare` (SSR adapter on Workers).**
- **Candidate B — Next.js + `@opennextjs/cloudflare` (OpenNext adapter on Workers).**

Also inspected and rejected at the hard-filter stage (full matrix in evidence):

- **SvelteKit + `@sveltejs/adapter-cloudflare`** — passes topology compatibility, but
  carries the single-digits-year-old superseded decision history, a runtime SSR dev
  server with its own adapter topology (Vite), and — decisively for a solo maintainer —
  no content-authoring strengths that offset Astro's. Rejected **for now** (recorded as
  a rejected alternative, not a hard-filter failure).
- **Hono-rendered HTML (+ optional htmx)** — rejected as a public starter: it is the
  Q47 dashboard candidate surface; adopting it here would merge two roles Q8 keeps
  distinct and would make the "public site" a hand-rolled renderer with no authoring
  layer — highest maintenance burden for the solo maintainer. The Q46 choice stays
  independent of the Q47 dashboard decision either way.
- **Plain static-site generator / no-framework SSR** — cannot meet the in-process HTML +
  typed-client consumption contract cleanly and duplicates what Astro already supplies;
  highest maintenance burden.

**Shortlist boundedness:** two candidates, one Worker topology, one store seam — the
matrix below is the whole comparison; no fourth candidate may be added without a dev
decision reopening this evaluation.

## 4. Comparison matrix (summary)

Full source-cited rows: `evidence/q46_public-starter.md` §2. Verified-fact columns
(versions verified 2026-10-07) are carried there; the design records the comparison
judgments.

| Criterion | A — Astro 7 (`@astrojs/cloudflare` 14.3.4) | B — Next.js 16 (`@opennextjs/cloudflare` 1.20.9) |
|---|---|---|
| Workers topology fit | First-class: official Cloudflare framework guide; adapter targets Workers directly; static assets + on-demand SSR in one Worker | Fit via adapter translation layer: OpenNext emulates the Node.js runtime on Workers; more moving parts (R2 incremental cache, workerd-specific package constraints) |
| Consumption of Q47 contracts (typed client from module source, §3) | Islands consume `@yomban-ink/clients` browser-safe factories per island; server components/pages call host-provided in-process services or the typed client | Same consumption is possible; but the App Router's data conventions (caching, RSC) add a framework data layer the Q47 contracts deliberately do not model — risk of drift between the operation table and RSC data flow |
| Authoring/workflow fit (content site; Q54 model behind it) | Strong: content collections, file-based routing, minimal JS by default — closest match to "starter that renders module content publicly" | Strong general framework; authoring is a third-party concern; larger API surface for a solo maintainer to maintain |
| SEO/structured data (Q62) | Per-route metadata + structured data via components; pre-rendered HTML default | Excellent (framework pioneered app-level metadata); equally capable |
| Public budgets (Q62: LCP < 2.5s / INP < 200ms — TARGETS) | Zero-JS-by-default aligns with the budgets; islands bound client JS per page | Capable, but RSC payload + hydration model carries more inherent client weight; both remain TARGETS until measured |
| WCAG 2.2 AA | Framework-neutral obligation; Astro's minimal-JS default reduces a11y risk surface | Same obligation; more client-side rendering paths to audit |
| Browser matrix (evergreen + last 2 Safari/Firefox/Edge) | No candidate-specific constraint | Node.js-runtime emulation on workerd introduces workerd API coverage as an extra compatibility axis (documented, monitored by OpenNext) |
| Maintenance burden (solo maintainer) | Lower: smaller core API, adapter maintained by Cloudflare; two majors in 2026, ~3 months apart (6.0 2026-03, 7.0 2026-06) — an ongoing upgrade obligation | Higher: Next.js majors are frequent and OpenNext must chase them (Next 14 support dropping Q1 2026 per its docs); adapter sits one layer behind the framework |
| Install ownership (q40 §13) | Starter packages installed/upgraded via pnpm per q40 §13; generated `apps/web` is project-owned after scaffold; `@astrojs/cloudflare` + `wrangler` configs generated, then owned | Same ownership shape; larger generated config surface (worker entry, R2 binding for incremental cache, custom Worker hooks) |
| Q70 integration (browser-local SQLite store + sync, MVP) | Islands attach the Q70 consumer seam (q40 §14) per interactive island; static pages unaffected | Same seam attaches within RSC/client components; additional interplay with RSC cache/refresh semantics to design in task 3.4/proof |

## 5. Selection PROPOSAL

**PROPOSED: Candidate A — Astro (current major 7.x) with the official
`@astrojs/cloudflare` SSR adapter, as the MVP public-site starter in `apps/web`,
rendering inside the single Worker deployment (q40 §4/§6) and consuming Q47 contracts
exclusively through `@yomban-ink/contracts` / `@yomban-ink/clients` surfaces.**

Rationale (ranked):

1. **Topology fit with the least translation.** Astro's Workers adapter is the
   officially documented Cloudflare path; SSR + static assets run in the one Worker
   with no Node-runtime emulation layer. Next/OpenNext is viable but inserts an
   emulation layer (workerd Node-compat, R2-based incremental cache) that is
   infrastructure the platform would then be coupled to.
2. **Contract fit.** The Q47 model — pages render server-side from in-process domain
   operations; interactivity via typed browser-safe clients and host notifications —
   maps 1:1 onto Astro's server-rendered pages + islands. Next's App Router brings a
   second data layer (RSC/caching) the contracts do not model, a real drift risk
   against the operation-table conformance mechanism (ADR-0007 §3).
3. **Budget posture.** Astro's ship-no-JS-by-default is the cheapest structural
   alignment with LCP < 2.5s / INP < 200ms (targets; not measurements).
4. **Solo-maintainer maintenance burden.** Fewer framework majors to track, no
   emulation-layer breakage class, smaller audit surface for WCAG/CSP.
5. **No inference from Q47.** This selection is made on Q46's own criteria; the
   dashboard/controller/panel comparisons (ADR-0007 §12) neither support nor oppose it,
   and htmx is not adopted for any public-site role by this design.

**Rejected alternatives (with reasons, none reopened):** Next.js/OpenNext (§4 rows:
emulation layer, RSC data-model drift, heavier maintenance); SvelteKit (superseded
choice; viable but no compensating advantage for a public content starter; recorded as
revisitable if the dev directs); Hono-rendered public HTML (role conflation with the
Q47 dashboard candidate; no authoring layer); static-only generators (no SSR path for
dynamic public content through the one Worker).

## 6. Bounded support commitment (the Q46 deliverable the gate asks for)

If adopted (task 6.4 + joint 7.8), the platform commits to the following **bounded**
support — anything outside it is out of support, not silently degraded:

| Term | Commitment |
|---|---|
| Supported versions | **Astro current major (7.x) only**, pinned at scaffold time and upgradable; the previous Astro major gets best-effort compatibility at scaffold/upgrade time for one minor cycle, then drops. The official `@astrojs/cloudflare` adapter's supported Astro range is the compatibility authority. |
| Supported interface | The **Q47 consumption interface only**: server-rendered pages calling in-process domain operations through the host, islands consuming `@yomban-ink/clients` typed factories and Q70/Q47 surfacing contracts. Astro-specific APIs (content collections, integrations, image pipeline) are starter-internal implementation, never a platform contract — modules must not import them. |
| Generated ownership (q40 §13) | Scaffold generates the starter project (`apps/web`), its Astro config, adapter config and wrangler assets config **once**; thereafter **project-owned** — platform updates reach it via package upgrades, never regeneration (non-destructive-update rule). The `@astrojs/cloudflare` + `astro` packages themselves are installed/upgraded. |
| Update obligations | The platform's `upgrade` CLI (Q49) covers platform packages; **Astro major upgrades are the consumer's responsibility** with documented guidance, because starter internals are project-owned. Platform releases do not pin an Astro minor beyond the scaffold-time pin. |
| Exclusions (explicit) | NOT supported: alternative renderers/starters in the MVP (Q7: one starter); Astro's experimental features; second deployment surfaces; SSG-only or SPA-only starter modes as platform-supported paths (the starter is SSR-first; static prerendering of individual routes is a per-route consumer choice); mobile shells (Q46: Capacitor is architectural direction only, post-MVP); any Q69 site purpose. |
| Budgets | Q62 public budgets (LCP < 2.5s / INP < 200ms) and WCAG 2.2 AA + evergreen + last-2 Safari/Firefox/Edge apply unchanged and are **targets to be measured in phase-006 proof (6.4)** — nothing here claims they are met. |

## 7. Q70 integration requirements the starter must satisfy (interface fixed; mechanics = task 3.4)

- The starter consumes the Q70 datastore consumer seam exactly as exported
  browser-safe (q40 §14): same `sqliteTable` schemas and query code, wasm-SQLite over
  OPFS opened **per session**, never at init.
- Interactive surfaces (islands) attach the typed sync-status / conflict-diff /
  lock-state surfacing contracts of ADR-0007 §9; server-rendered public pages are
  read-only against served content and never touch the local store.
- The starter must not wrap or abstract the store seam — it renders the seam's outputs;
  sync/driver mechanics are task 3.4's and this design pre-commits to none of them.
- Q65/Q71 erasure reaching on-device replicas (Amendment 002) applies to starter
  surfaces as consumers of the seam, not as a starter-owned mechanism.

## 8. What this design does not decide

- **No adoption** — PROPOSAL only; adoption awaits task 6.4 executed proof + the dev's
  explicit decision + joint Q40/Q47/Q46 closure (7.8).
- **No starter implementation** — no code, no scaffold, no config authored here.
- **No measured performance** — budgets are targets; phase-006 (6.4) measures.
- **No Q47 dashboard/controller/panel inference** — independent choices; no htmx
  adoption for any role from this record.
- **No Q70 mechanics** — §7 fixes consumption duties only.
- **No Q69 influence** — yomban.ink's own site is post-MVP and scored nowhere.

## 9. Requirement matrix

| Task 3.3 acceptance clause | Resolved in |
|---|---|
| Bounded shortlist after inspecting Workers topology/contract compatibility | §2 (hard filters), §3 (shortlist), evidence §2 (compatibility inspection, source-backed) |
| Compare workflow/authoring fit | §4 (authoring row) |
| SEO/structured-data support (Q62) | §4 (SEO row); §6 budgets row |
| Public performance budgets | §4 (budgets row); §6; §8 (targets-only rule) |
| WCAG 2.2 AA + browser support matrix | §4 (WCAG/browser rows); §6 |
| Maintenance burden | §4 (maintenance row); §5 rationale 4 |
| Install ownership (generated vs installed, per Q40) | §4 (install row); §6 (generated-ownership terms) |
| Q70 integration requirements | §7 |
| Selection proposal + rejected alternatives | §5 |
| Bounded support (versions/interfaces, generated ownership, update obligations/exclusions) | §6 |
| Former SvelteKit choice superseded; no automatic Hono/htmx; one starter; fixtures not starters; no Q69 | §2 (filters 3–5, 7), §3, §5, §8 |

**Completeness note:** every task-3.3 acceptance clause maps to a row. All candidate
facts cite `evidence/q46_public-starter.md` (verified 2026-10-07); judgments are this
design's, flagged PROPOSED pending dev acceptance and the 6.4/7.8 gates.
