# ADR-0008 — Public-site starter and bounded support (Q46)

- **Status:** Proposed (2026-10-07) — authored at task 3.3 of spike plan 000 phase_003.
  **PROPOSAL only.** Adoption awaits task 6.4 (phase-006 executed starter proof —
  scaffold/build, Workers topology exercise, measured budgets) after the dev accepts the
  shortlist, plus the **joint Q40/Q47/Q46 closure (phase-007 task 7.8)**. An ADR alone
  is not closure (Q19/Q61). **Dev acceptance of the shortlist + selection recorded
  2026-10-07** (session 20261007_171307_b06e33) — see evidence report §3
  (`evidence/q46_public-starter.md`); this ADR stays **Proposed** pending 6.4 + joint 7.8.
- **Deciders:** authored by the task-3.3 design agent under the phase-003 contract
  (proposed designs/ADRs; no unrun evidence asserted; no candidate adopted without
  explicit dev input). Dev acceptance of the shortlist/selection: **ACCEPTED
  2026-10-07** (with conditions — thin-starter discipline; SolidStart evaluated and not
  added; no htmx; Q47 dashboard independent; pure-app-consumption tension deferred to
  backlog item 8 — see evidence §3). Adoption: pending 6.4 + joint 7.8.
- **References:** design `docs/plans/000_spike-plan/designs/q46_public-starter.md`;
  evidence `docs/plans/000_spike-plan/evidence/q46_public-starter.md` (source-backed
  candidate matrix, verified 2026-10-07);
  `docs/specs/000_index.md` canonical gate table (Q46 row);
  `docs/discovery/understanding.md` Q7, Q8, Q12, Q14, Q18, Q19, Q40, Q46, Q47, Q51,
  Q54, Q62, Q69, Q70, Q71; amendments 001/002; review `docs/reviews/001_spec-review.md`
  §9 (D2 fixture ownership — fixtures are not starter candidates);
  ADR-0006 (q40 composition/topology — PRIMARY predecessor), ADR-0007 (q47
  client/wire/host/presentation — PRIMARY predecessor), ADR-0001 (locked foundations,
  frontend independence), ADR-0005 (Q63 persistence, provisional);
  `docs/decisions/0001-platform-foundations.md` (ceiling decisions).

## Context

Gate Q46 owns the **reopened public-site starter choice** (the former SvelteKit
decision stays superseded), the frontend-independence constraints around it, and the
bounded support commitment the MVP starter carries. Locked context it operates within:
frontend independence — no direct or transitive presentation dependency in
core/contracts/headless (Q22/Q25; ADR-0007 §4); one Worker deployment per project
hosting API + optional HTML/SSR (q40 §4/§6, provisional); the Q47 contracts are the
starter's only consumption interface (typed module-source client, surfacing contracts);
Q62 public budgets (LCP < 2.5s / INP < 200ms, public reference frontend only), WCAG
2.2 AA and evergreen + last-2 Safari/Firefox/Edge; Q70 local-first store + sync as an
MVP deliverable; Q7 ships **one** production starter; Q69 (yomban.ink's own site) is
post-MVP and must not influence this choice; the Q47 dashboard/controller/panel
candidates (Hono/htmx, TS-controller/htmx-panel) are separate decisions and do not
assign this one. This record reopens no locked decision; final closure is joint (7.8).

## Decisions (⭐-starred items were dev-ACCEPTED 2026-10-07 — still PROPOSED pending 6.4 / joint 7.8)

1. **Starter selection (⭐ dev-accepted 2026-10-07; PROPOSED pending 6.4/7.8): Astro (current major 7.x) with the official
   `@astrojs/cloudflare` SSR adapter** as the MVP public-site starter in `apps/web`,
   rendering inside the single Worker deployment and consuming Q47 contracts
   exclusively through `@yomban-ink/contracts` / `@yomban-ink/clients`. Rationale
   (design §5): direct Workers adapter with no Node-runtime emulation layer; 1:1 fit
   to the Q47 model (server-rendered pages via in-process domain operations +
   interactive islands on typed browser-safe clients); cheapest structural alignment
   with the public budgets (ship-no-JS-by-default); lowest maintenance burden for a
   solo maintainer. Verified facts: Astro 7.3.6, `@astrojs/cloudflare` 14.3.4
   (peer `astro ^7.2.0`), MIT, active repo (evidence §2.2).

2. **Bounded shortlist (⭐ dev-accepted 2026-10-07):** Astro/`@astrojs/cloudflare` vs
   Next.js/`@opennextjs/cloudflare` (Next 16.4.0, adapter 1.20.9; Node-runtime
   emulation on workerd; Next 14 support dropping Q1 2026 per adapter docs; Worker
   size-limit constraints documented). SvelteKit, Hono-rendered public HTML and
   static-only generators were inspected and rejected at/before shortlisting (design
   §3, evidence §2.4). No fourth candidate without a dev decision reopening this
   evaluation.

3. **Bounded support commitment (⭐ dev-accepted terms, 2026-10-07):** supported Astro major 7.x only,
   pinned at scaffold; previous major best-effort for one minor cycle; the adapter's
   peer range is the compatibility authority. The supported interface is the Q47
   consumption interface only — Astro APIs are starter-internal implementation, never
   a platform contract modules may import. Scaffold-generated starter files are
   project-owned after generation (never regenerated over); Astro packages are
   installed/upgraded; **Astro major upgrades are the consumer's responsibility** with
   documented guidance. Exclusions: no second starter/renderer in MVP; no experimental
   Astro features; no second deployment surface; SSR-first (per-route static
   prerendering is a consumer choice); no mobile shells (Capacitor is post-MVP
   direction); no Q69 site purpose. Budgets/WCAG/browser matrix apply unchanged and
   are **targets**, measured first at task 6.4.

4. **Fixtures are not starters.** The Q47-defined plain-host and bounded reactive
   fixtures (ADR-0007 §11) are acceptance proof of frontend independence; they are
   never starter candidates and never evidence of starter fitness.

5. **Q70 integration duties:** the starter consumes the Q70 browser-safe datastore
   seam exactly as exported (q40 §14), surfaces sync/conflict/lock state through
   ADR-0007 §9 contracts in interactive surfaces, and touches nothing else about
   sync/driver mechanics (task 3.4). Q65/Q71 erasure reaching on-device replicas
   applies to starter surfaces as seam consumers, not as starter-owned mechanics.

## Rejected alternatives

- **Next.js + `@opennextjs/cloudflare`** — viable and actively maintained, but
  requires a Node-runtime emulation layer on workerd plus an R2-backed incremental
  cache; the App Router's RSC/caching data model is a second data layer the Q47
  operation-table conformance mechanism does not model (drift risk); heavier
  maintenance cadence for a solo maintainer. Recorded as a shortlisted rejected
  alternative — revisitable only by an explicit dev decision.
- **SvelteKit + `@sveltejs/adapter-cloudflare`** — topology-compatible (kit 3.0.1,
  adapter 8.0.0 verified), but it is the **superseded** former choice; the dev
  reopened the decision deliberately. No compensating authoring/maintenance advantage
  was identified. Recorded as rejected-for-now, not a hard-filter failure.
- **Hono-rendered public HTML (+ optional htmx)** — role conflation with the Q47
  dashboard candidate (Q8 keeps public site and admin dashboard distinct) and no
  authoring layer; would be the highest-maintenance path. Also: adopting it here
  would silently couple Q46 to Q47's separate, still-open decision.
- **Static-only generator / hand-rolled SSR** — cannot serve dynamic public content
  through the one Worker cleanly (design §2 filter 6) and duplicates what Astro
  supplies.
- **Selecting the starter by inference from the Q47 dashboard candidates** — rejected:
  Q46 is an independent choice (task acceptance; ADR-0007 §12); no htmx adoption for
  any role follows from this record.
- **Declaring budget compliance at design time** — rejected (plan 000 evidence rules):
  LCP/INP/WCAG results exist only after phase-006 (6.4) measures the built starter.

## Non-decisions

This record adopts **no** starter (Proposal pending dev acceptance + 6.4 + joint 7.8);
selects no dashboard/controller/panel (ADR-0007 §12 open); adopts no htmx; designs no
Q70 sync/driver mechanics (task 3.4); sets no new performance numbers (Q62 unchanged);
takes no position on Q69. It reopens no locked decision
(Q10/Q11/Q13/Q22/Q25/Q29/Q32/Q46-supersession/Q47/Q51/Q54/Q59/Q62/Q70).

## Consequences

- The public-starter decision stays independent of the dashboard/panel choices; either
  can be decided without the other, and both close jointly at 7.8.
- If adopted, `apps/web` becomes an Astro project consuming platform packages only —
  core/contracts/clients stay framework-free and the ADR-0007 boundary-lint duties
  are unchanged; the starter's dependencies never leak into headless surfaces.
- The bounded support terms (§3) define exactly what the platform maintains and what
  it does not, protecting the solo maintainer from unbounded upgrade obligations.
- The MVP's "one public renderer" rule (Q7) is preserved; fixtures remain proof-only.
- Q62 budgets remain targets until measured on the built starter (6.4); nothing in
  this record claims performance achieved.

## Follow-on decisions needed

- ~~**Dev:** accept or adjust the shortlist and the selection proposal~~ — **DONE
  2026-10-07** (accepted with conditions; evidence §3).
- **Task 3.4 (Q70):** design sync/driver mechanics behind the consumption duties of
  Decision 5.
- **Task 6.4 (phase-006):** execute the starter proof — scaffold/build, Workers
  topology exercise, first LCP/INP/WCAG measurements, SEO/structured-data exercise;
  record observed results in the evidence report.
- **Tasks 6.1–6.2:** install-specifier mechanics (q40 §13, UNVERIFIED) underpin the
  starter's install-ownership terms.
- **Phase-007 (task 7.8):** reconcile and jointly close Q40/Q47/Q46; then this ADR may
  move Proposed → Accepted → Closed per the canonical gate table.
