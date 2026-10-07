---
title: "Q46 — public-site starter (evidence: source-backed candidate matrix, verified facts, unverified items)"
created_session: "20261007_120050_2515b8"
sessions: ["20261007_120050_2515b8"]
approved: false
---

# Q46 — Evidence report (task 3.3) — source-backed candidate matrix

> This is the **Q46 evidence report for task 3.3**
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.3.md`). It backs
> `designs/q46_public-starter.md` with a source-backed candidate matrix. **No harness,
> install, build or measurement was run in this task** — this is a doc-only task and no
> performance claim is made anywhere. All version/activity facts below were verified
> against live sources on **2026-10-07**.
>
> **What the budget numbers mean:** LCP < 2.5s / INP < 200ms (Q62) and the WCAG/browser
> matrix are **TARGETS the unbuilt MVP public frontend must be measured against in the
> phase-006 proof (task 6.4)**. No row in this matrix is a measurement; "target
> posture" describes structural alignment only. Nothing unbuilt is declared achieved.

## 1. What was produced

Exactly three documentation files, matching the task card's Files list — no code, no
installs, no commands beyond read-only source verification (npm registry + GitHub API +
official docs pages fetched read-only).

1. `designs/q46_public-starter.md` — the design (hard filters, shortlist, comparison,
   selection proposal, bounded support).
2. `docs/decisions/0008-public-site-starter.md` — ADR-0008, **Proposed**.
3. This evidence report.

## 2. Source-backed candidate matrix

Verification method (2026-10-07): versions from the npm registry
(`registry.npmjs.org/<pkg>/latest`); repo activity/licence from the GitHub REST API;
capability claims from official documentation pages fetched directly. Sources listed
per row; URLs quoted in full. Where a claim could not be verified from a primary
source it is marked **UNVERIFIED**.

### 2.1 Verified platform facts (common to all candidates)

| Fact | Value verified 2026-10-07 | Source |
|---|---|---|
| Cloudflare documents Astro on Workers as an official framework guide | Workers docs "Framework guides / Web applications / Astro", page "Last updated Aug 12, 2026": "Astro is a JavaScript web framework designed for creating websites that display large amounts of content… renders as much content as possible at build time, or on-demand on the 'server' — this can be a Cloudflare Worker." Islands support "React, Preact, Svelte, Vue, SolidJS". | https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/ |
| Cloudflare documents Next.js on Workers via `@opennextjs/cloudflare` | OpenNext Cloudflare docs: "The `@opennextjs/cloudflare` adapter lets you deploy Next.js apps to Cloudflare Workers using the Node.js 'runtime' from Next.js." | https://opennext.js.org/cloudflare |
| Hono (the locked base server engine) current version | 4.13.13 (npm latest). Context only: Hono is the platform's server engine (Q13); it is not a starter candidate per design §3. | https://registry.npmjs.org/hono/latest |

### 2.2 Candidate A — Astro + `@astrojs/cloudflare`

| Claim | Verified value (2026-10-07) | Source |
|---|---|---|
| Astro current version | **7.3.6** (npm latest, published 2026-10-06). Major 6.0.0 published 2026-03-10; major 7.0.0 published 2026-06-22 — two majors in 2026, ~3 months apart; **upgrade cadence is an ongoing obligation, not a one-off**. | https://registry.npmjs.org/astro |
| Official Cloudflare adapter version | `@astrojs/cloudflare` **14.3.4**; peer range `astro ^7.2.0`, `wrangler ^4.125.0` (adapter tracks Astro majors via its own majors — compatibility authority is the adapter's peer range). | https://registry.npmjs.org/@astrojs/cloudflare/latest |
| Licence | MIT (LICENSE text read directly: "MIT License, Copyright (c) 2021 Fred K. Schott", with SvelteKit/Vite-derived MIT portions). GitHub API reports "NOASSERTION" due to the multi-part LICENSE file; the file itself is MIT-licensed content. | https://raw.githubusercontent.com/withastro/astro/main/LICENSE |
| Activity | Repo `withastro/astro`: 63,092 stars; last push 2026-10-07 (same day). | https://api.github.com/repos/withastro/astro |
| SSR on Workers, on-demand rendering, bindings, sessions | Official Cloudflare guide documents "Deploy an existing Astro project on Workers / Manual configuration / If your site uses on demand rendering", plus "Bindings", "Sessions", "Custom 404 pages", "Astro's build configuration", "Node.js requirements". | https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/ |
| SEO/structured data capability | **UNVERIFIED-BY-PRIMARY-DOC in this pass** (no official SEO doc page fetched): Astro's per-route metadata and JSON-LD patterns are widely documented in Astro's official docs and are uncontroversial, but this task verified SSR/capability pages, not a dedicated SEO page. Treated as capability-known, source-citation pending the 6.4 proof. | (gap recorded honestly) |
| Workers topology fit | Direct adapter (no Node-runtime emulation layer documented for the standard path); static assets + on-demand SSR in one Worker. | Cloudflare guide above |

### 2.3 Candidate B — Next.js + `@opennextjs/cloudflare`

| Claim | Verified value (2026-10-07) | Source |
|---|---|---|
| Next.js current version | **16.4.0** (npm latest). | https://registry.npmjs.org/next/latest |
| OpenNext Cloudflare adapter version | `@opennextjs/cloudflare` **1.20.9** (published 2026-10-06); peer range `next >=15.5.27 <16 || >=16.3.8`, `wrangler ^4.125.0`, plus `rclone.js ^0.6.6`. | https://registry.npmjs.org/@opennextjs/cloudflare/latest |
| Supported Next.js versions per adapter docs | "All minor and patch versions of Next.js 16 and the latest minors of Next.js 14 and 15 are supported. **Next.js 14 support will be dropped Q1 2026.** It is no more supported by the Next.js team." | https://opennext.js.org/cloudflare |
| Runtime model | "your app should use the Node.js runtime… which allows you to use the Node.js APIs provided by the Cloudflare Workers runtime. This is an important difference from `@cloudflare/next-on-pages`, which only supports the 'Edge' runtime." — confirms the adapter is a Node-runtime **emulation layer** on workerd, the design §4 topology caveat. | https://opennext.js.org/cloudflare |
| Supported features | App Router, Route Handlers, dynamic routes, SSG, SSR, Middleware, image optimization, Partial Prerendering; "Node Middleware introduced in 15.2 are not yet supported". Pages Router support continues per docs page. | https://opennext.js.org/cloudflare |
| Licence / activity | MIT; repo `vercel/next.js` 143,231 stars, last push 2026-10-07. | https://api.github.com/repos/vercel/next.js |
| Worker size limits | OpenNext docs carry a dedicated "Note on Worker Size Limits" section — a documented, real constraint class the Astro path does not share. | https://opennext.js.org/cloudflare |

### 2.4 Rejected-at-shortlist candidates (inspected, not shortlisted)

| Candidate | Verified facts (2026-10-07) | Verdict & source |
|---|---|---|
| SvelteKit + `@sveltejs/adapter-cloudflare` | Svelte 5.57.2; `@sveltejs/kit` 3.0.1; `@sveltejs/adapter-cloudflare` **8.0.0** (peer `@sveltejs/kit ^3.0.0-next.0`, `wrangler ^4.118.0`). MIT; kit repo 20,844 stars, last push 2026-10-06. Technically compatible with the topology. | Rejected-for-now (design §5): superseded former choice; no compensating advantage for a public content starter; not a hard-filter failure — revisitable on dev direction. Sources: https://registry.npmjs.org/@sveltejs/kit/latest, https://registry.npmjs.org/@sveltejs/adapter-cloudflare/latest, https://registry.npmjs.org/svelte/latest, https://api.github.com/repos/sveltejs/kit |
| Hono-rendered public HTML (+ optional htmx) | Hono 4.13.13 verified. It is the platform's server engine (Q13) and the Q47 **dashboard** candidate — not a public-site authoring starter. | Rejected (design §3): role conflation with Q47's separate choice; no authoring layer; highest maintenance burden. |
| Static-only generator / hand-rolled SSR | No single primary source needed: fails design §2 filters 1/6 (cannot host dynamic public content through the one Worker cleanly) and has the highest maintenance burden of any option. | Rejected. |

**Sources verified count:** 14 distinct primary sources (8 npm registry endpoints,
3 GitHub API endpoints, 2 official doc pages, 1 LICENSE file) — itemized in §2.

## 3. Dev acceptance (recorded 2026-10-07, session 20261007_171307_b06e33)

The dev reviewed the design in conversation (TL;DR walkthrough, candidate discussion,
swap-cost and generality questions) and then approved: "I approve Astro as the starter
framework."

| Item | Verdict |
|---|---|
| §2 hard filters | ACCEPTED as presented. |
| §3 bounded shortlist (Astro + `@astrojs/cloudflare` vs Next.js + `@opennextjs/cloudflare`) | ACCEPTED — no reopen directed; shortlist unchanged. |
| §5 selection proposal — Astro 7.x + `@astrojs/cloudflare` as the MVP public-site starter | **ACCEPTED.** |
| §6 bounded support terms | ACCEPTED as presented. |
| §7 Q70 consumption duties | ACCEPTED as presented; mechanics remain task 3.4's. |

Conditions and scope the acceptance carries:

1. **Thin-starter condition:** the dev probed swap-out cost and accepted Astro on the
   design's generated-ownership terms (§6). Recorded as a standing condition: `apps/web`
   stays thin — it renders the Q47/Q70 contract surfaces and carries no domain logic —
   so a future starter swap remains a bounded rewrite of one app, not a platform
   migration. (Enforcement home: phase-006 proof review; not a new platform mechanism.)
2. **SolidStart evaluated conversationally, not added:** the dev floated SolidJS/
   SolidStart (v2 stable, 2.0.5; Cloudflare deploy via Nitro V3 — verified read-only from
   start.solidjs.com, 2026-10-07). It passes the §2 hard filters on paper but loses the
   public-starter role on ship-no-JS/islands fit, its own server-functions data layer
   (the same second-data-layer drift class as Next's RSC), no native authoring layer,
   and solo-maintainer maturity risk (newly-stable v2 on a new Nitro major). **No reopen
   directed** — the shortlist stays bounded at two. Noted as a serious candidate for the
   still-open Q47 dashboard/panel role, not for Q46.
3. **htmx:** no adoption for any public-site role (design §3 rejection stands); the Q47
   dashboard choice remains independent and open.
4. **Dashboard stays Astro-independent:** the dev asked whether Astro should serve the
   dashboard too. Recorded as directional input only — Q47's dashboard/controller/panel
   comparison remains the evaluation basis; that selection stays gated on the executed
   proofs + dev decision.
5. **Generality note (Spahn App / Band Together / Critical Sheets):** the dev confirmed
   the platform targets many project types, not only content-heavy sites. The starter's
   role (public face) stays content-shaped across those types; interactive cores are
   per-project consumers of the headless clients/typed contracts. The one genuine
   tension — pure-app projects with a minimal public surface vs the SSR-first
   one-starter MVP — is deferred to `docs/backlog/yomban-backlog.md` (item 8) per the
   deferred-decisions-to-backlog rule.

**Acceptance is NOT adoption.** Per the design header, adoption still awaits task 6.4
(executed proof) + the dev's explicit adoption decision + joint Q40/Q47/Q46 closure
(7.8). §4's checks NOT run remain unrun — this acceptance upgrades no unverified item;
the SEO/structured-data row (§2.2) stays capability-known pending 6.4.

## 4. Checks NOT run (assigned to later tasks; none executed in task 3.3)

1. **Starter scaffold/compatibility probe** — no Astro (or Next) project was
   scaffolded, installed or built; no `@astrojs/cloudflare` peer-resolution was
   exercised. **Owner: phase-006 proof (6.4) after dev acceptance of the shortlist.**
2. **Workers-runtime compatibility proof** — SSR through the one Worker, bindings
   access via core seams, static-assets config, in-process HTML path per q40 §6.
   **Owner: 6.4.**
3. **Performance measurements** — no LCP/INP number exists. The Q62 budgets are
   **targets**; first measurements happen on the built starter in phase-006 (6.4).
   **Owner: 6.4.**
4. **WCAG 2.2 AA / browser-matrix verification** — no audit ran. **Owner: 6.4 and the
   MVP acceptance tasks.**
5. **SEO/structured-data verification** — Astro SEO docs were not fetched; the
   capability claim in §2.2 is capability-known but not primary-source-verified in this
   task. **Owner: 6.4 (fetch + exercise per-route metadata/JSON-LD through the
   starter).**
6. **Q70 integration exercise** — the starter's islands attaching the Q70 consumer
   seam is designed (design §7) but nothing was executed; mechanics are task 3.4's.
   **Owner: task 3.4 (design) + 6.4 (execution).**
7. **Install-ownership exercise** — the §6 generated-vs-installed split for the starter
   rides q40 §13's provisional specifier mechanics, themselves UNVERIFIED pending
   tasks 6.1–6.2. **Owner: 6.1/6.2 + 6.4.**

**Not blockers for this task:** items 1–7 are later tasks' deliverables; this report's
only claim is that they have not run. Any observed output or version appearing in a
future revision must come from those tasks' sessions.

## 5. Spec conflicts / deviations

- **ADR number:** task 3.3 names `docs/decisions/0008-public-site-starter.md` as
  Create. Verified free (`ls docs/decisions/`: 0001–0007, 0014–0016 present; 0008
  unoccupied) — **no deviation**.
- **Consistency with q40:** the design consumes the one-Worker topology (q40 §4/§6),
  export classes (§2), per-side packages (§3) and generated-vs-installed ownership
  (§13) without re-slicing; the starter renders inside the host per q40's explicit
  "SSR of the public starter… executes through the same Worker" placeholder.
- **Consistency with q47:** the starter consumes only q47's typed-client/surfacing
  contracts (§3/§4/§9) and is independent of the §12 dashboard/controller/panel
  comparisons — no inference in either direction; no htmx adoption.
- **Consistency with Q7:** exactly one production starter proposed; fixtures untouched
  as acceptance proof only.
- **No conflict found** with Q62/Q70/Q69 or amendments 001/002. No locked decision is
  reopened; the SvelteKit supersession stands.
