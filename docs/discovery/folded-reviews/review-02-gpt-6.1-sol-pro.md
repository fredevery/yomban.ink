Reviewed docs/discovery/understanding.md (47 questions, 42 answered, 5 deferred) alongside the architecture diagram. Verdict up front: the doc is excellent at the module CONTRACT SHAPE and the core/module boundary philosophy, but it under-specifies the cross-cutting runtime seams a platform must own, and it is silent on the platform's own lifecycle (versioning/upgrade). Details below, tiered.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GAPS IN THE DISCOVERY ITSELF (process)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Q38 (full Per-Side Core inventory) is DEFERRED, but it is foundational. Q35's manifest references "core services it consumes," and Q25/Q30 assert the core/module boundary — none of that is verifiable until Q38 is answered. Promote it to the FIRST spike with exit criteria; every other spike depends on knowing what the core actually exposes.
- No success criteria for the MVP. Q7 says "ship end-to-end" but there's no measurable definition of done. A platform MVP needs one — e.g. "rebuild pilot A from scaffold to deployed with zero core edits, in under a day."
- No non-functional targets: performance budget, browser-support matrix, a11y level (WCAG), SEO/structured data for CMS content, uptime. For a CMS-bearing platform, SEO and a11y are functional requirements, not polish.
- Spikes have no exit-criteria / artifact format. Q40/41/42/45/47 all say "explore." Define what each produces (an ADR, a prototype, a doc) so they converge instead of staying open forever.
- The platform's own identity is undefined: the npm package name for init/scaffold, how it is "installed" (public npm, private registry, git template), the release/versioning scheme, and what lives at yomban.ink itself (marketing/docs vs the product). Q31 says "installed" but not from where.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ARCHITECTURAL GAPS (must resolve before/at MVP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Core↔module versioning + upgrade path — the biggest omission. Q35 gives a module a version, but nothing defines the CONTRACT version a module targets, or how a consuming project upgrades the core across breaking changes. Build-time-imported modules will silently break when the core moves. Needs: contract semver, a compatibility policy, and an upgrade CLI + codemods. migrate (Q37/Q44) covers DB only.

2. Migration SYSTEM mechanics, not just ownership. Q37 locks module-owned migrations + a core runner, but leaves undefined: global ordering across modules (topological by the Q36 dep graph?), the migration ledger (one table; per-module namespacing), a LOCK for concurrent deploys, and data-vs-schema migrations. Operationally load-bearing — get it wrong and pilot #2 cannot deploy cleanly.

3. Transactions / unit-of-work seam. D1's atomicity is limited; modules doing multi-table writes need a core-provided transaction/batch interface. Not mentioned anywhere.

4. RBAC / permissions model. Q35 has a module "declare permissions" and the admin shell gate nav, but the model itself (roles, scopes, resource-level permissions, cross-module composition) is undefined. Per your enums-over-strings rule this wants explicit enum-defined domain values — and the admin dashboard, in-situ editing gating, and API authorization all hang off it.

5. API style + client/server type-sharing. Q46 wants a "typed API client" and Q12 defers route shape to Q40, but nothing says where the client's types come from. The options (end-to-end types à la tRPC, OpenAPI-generated client, a hand-maintained contract package) have very different consequences for the framework-agnostic goal (Q47). This is the crux of Q46/Q47 and it is unspecified.

6. Config & secrets model. Q35 declares a module "config schema" and Q15 covers env bindings, but there's no mechanism: per-environment config, boot-time validation of module config, a secrets-access seam (modules must not read bindings directly per Q25), and config at CLI/scaffold time vs runtime.

7. Module conformance test kit + boundary enforcement. Q25/Q26/Q37 list rules (no direct bindings, no export *, dependency direction) but nothing ENFORCES them. Ship a boundary-lint config (eslint / dependency-cruiser) plus a contract test harness every module must pass — this is what turns Q39's "custom modules compete on the same contract" from intent into guarantee.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. CROSS-CUTTING CAPABILITIES THE PLATFORM SHOULD OWN (should; some defer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8.  Async work: queue consumers + scheduled/cron + background jobs. Q15 lists a queues binding but there's no module contract to declare one. Every real module needs this.
9.  Observability seam: logging, traces, metrics, error reporting. Absent. Modules need a core logger/tracer interface that does not leak CF bindings.
10. Cache + invalidation. KV is a binding but there's no cache contract and — critically for a CMS with in-situ editing — no PURGE/invalidation story. Edge caching without invalidation makes editing look broken.
11. Media/upload pipeline. Q37's core base schema names "media," but no contract for uploads, R2 keys, image transforms (Cloudflare Images), signed URLs, or per-module asset ownership. The CMS needs it day one.
12. CMS content model + editing workflow. "CMS capability" (Q1/Q43) is asserted but never specified: how a module defines content types/fields (text, rich text, media, relation, repeater), and the draft → review → publish → schedule → revision workflow. This is arguably the headline capability and it is an empty box. In-situ editing mechanics are likewise unspecified (how the overlay maps DOM → content entity, draft preview, permission-gated edit affordances).
13. Security model. No question on sessions/CSRF, security headers/CSP, input validation (Zod?), upload validation, or machine-client auth (API keys/tokens). A platform core should ship safe defaults here.
14. Data safety: export/backup/DR (D1 + R2) and a "reset/reseed local" DX path. Q16 mentions a seed path but not per-module fixtures or teardown.
15. Delivery/ops: CI/CD, environments (staging vs prod), preview deploys, custom domains/DNS per project, Workers Routes. Absent entirely.
16. Rate limiting / abuse protection (Turnstile) for public forms — directly relevant since kasteel-website is a client site with contact surfaces.
17. Search. A content platform needs it eventually; at minimum decide the deferral explicitly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. TENSIONS / INCONSISTENCIES TO RECONCILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Drizzle vs Q45. Q10/Q37 lock module-owned Drizzle (SQLite/D1-flavoured) schemas, while Q45 wants modules to declare their datastore. A Drizzle schema is not datastore-agnostic; resolving Q45 may force a query-builder abstraction, or a narrowed stance that supported datastores are dialect-compatible with SQLite. Flag now — it constrains IDs (Q11), migrations, and the whole interface.
- Q24's client guardrail doc names SvelteKit, but Q46/Q47 want a framework-agnostic contract. Scope SvelteKit to the reference renderer only inside that doc.
- Q14 lists D1/R2/KV but not queues; Q15 assumes queues. Q5's in-scope list omits queues too. Align.
- Q11's prefixed TEXT ids: confirm better-auth's user/profile schema works cleanly with prefixed TEXT ids (it generally supports custom ids, but verify the adapter schema before locking, since it is pilot-blocking if it does not).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. OPPORTUNITIES (differentiators worth designing for, not just gaps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Headless content delivery as a first-class output. If the CMS serialises through the same typed contract, Yomban gets a public content API for free (mobile, external consumers) — a real platform differentiator, and it de-risks apps/mobile.
- Event bus / pub-sub as the Q41 module-to-module mechanism. Events decouple modules and hand you webhooks/integrations for free, versus direct-import or registry-instance.
- AI scaffolding as a real product surface. Q31/Q44 mention it but leave it undefined. Define the deterministic template contract and the AI-fill boundary so generated modules are conformant by construction (pairs with #7's test kit).
- Contract test kit + module conformance score. Turns "ascending on the same contract" into something automatically provable.
- Core design-system / tokens shipped client-side. Q38's default lists a component kit; making tokens first-class is the consistency lever for the admin shell and in-situ overlay.
- Golden-path DX spec: explicitly define what a consuming developer does in their first hour (scaffold → create module → migrate → dev → deploy) and make it an MVP acceptance target.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. RECOMMENDED NEXT ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Promote Q38 to spike #1 with exit criteria — it unblocks the manifest contract.
2. Add questions/ADRs for: contract versioning + upgrade, RBAC model, API style + type-sharing, migration mechanics, transactions seam, config/secrets, content model + publish workflow, observability, async (queues/cron), cache invalidation, media pipeline, security defaults, delivery/CI-CD. Most are must or should for MVP.
3. Give spikes a standard exit-criteria format (each spike → one ADR).
4. Resolve the Q45/Drizzle tension before locking the datastore interface.

Want me to fold these into the discovery set — e.g. add the new questions (Q48+) to understanding.md and write this review to docs/discovery/review-gpt-6.1-sol-pro.md (the existing review-gpt-6-aster.md is empty)? I can also turn the must-items into backlog entries instead, if you'd rather keep the understanding file at its locked 47.