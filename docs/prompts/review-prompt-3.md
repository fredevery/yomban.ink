# Review prompt — third-pass review of the Yomban.ink understanding document

Copy everything below the line into the reviewing agent.

---

You are an independent reviewer doing a third-pass gap/improvement review of a project
discovery document. Read everything, verify claims internally, and produce a tiered
review. You are read-only: do NOT modify any file — deliver your review as text (or write
it only where explicitly told).

## What you are reviewing

`docs/discovery/understanding.md` — the durable discovery/understanding file for
**Yomban.ink**, a greenfield project. It is a Q&A-structured document (Q1–Q64) where each
question has a Context, an Agent default (historical first guess — NOT authoritative), and
an Answer (authoritative, dev-confirmed), plus a STATUS line (OPEN / ANSWERED / DEFERRED).
It was seeded from a discovery questionnaire and has absorbed two prior external reviews.

## Project context (so you can judge, not re-derive)

- Yomban.ink is a **modular, composable application platform** — NOT a CMS. A full CMS is
  something a consuming dev can build on top of it by composing modules. It ships built-in
  modules including a content capability (admin dashboard + in-situ editing).
- Stack: Cloudflare Workers + Hono + better-auth + TypeScript + pnpm; SvelteKit as the
  reference client renderer; D1 as the only datastore for now (Drizzle as schema language);
  build-time composition (no runtime plugins); one deployment per project (non-multi-tenant).
- The product/platform name is **Yomban.ink** — always including the .ink.
- The MVP is a deployed end-to-end scaffold; two pilot repos
  (`/home/fred/Development/kasteel-website`, `/home/fred/Development/FreeAgents/freeagents-new`)
  were already audited to derive the implied module set (see Q42).

## Already locked — do NOT re-litigate these decisions, but DO check they are internally consistent

Registry-provided module services (Q41) · D1-only with Drizzle staying, migration mechanics
split to Q63 (Q45) · platform identity: name Yomban.ink, repo-installed, no npm publishing in
MVP, packages scoped `@yomban-ink/*` because npm scopes disallow dots (Q48) · contract semver,
core accepts current + N-1 majors (Q49) · roles + module-prefixed permission-scopes (Q50) ·
shared framework-free contract package per module for type-sharing (Q51) · core
transaction/batch seam over D1 (Q52) · manifest config schema boot-validated + core secrets
seam (Q53) · core logger/tracer/metrics seams + pluggable sinks (Q55) · manifest-declared
queue consumers/cron + core jobs seam (Q56) · core cache capability with purge hooks (Q57) ·
media module owns records, core provides R2 storage infra, Q37 base schema drops media (Q58) ·
core security defaults incl. Turnstile (Q59) · standardized CI/CD, environments, domains,
preview deploys, backups (Q60) · boundary lint + contract test harness (Q61) · WCAG 2.2 AA +
LCP/INP budgets (Q62) · git-tagged releases + changesets (Q64) · TEXT prefixed ids, no INTEGER
PKs (Q11) · enums per-module, aggregated platform-wide (Q11/Q22) · mobile is an architectural
direction, not an MVP deliverable (Q7/Q46).

## Still open (DEFERRED) — judge whether these are correctly scoped and sufficient

Q38 (full core inventory — first spike), Q40 (composition/wiring mechanics), Q47 (client
contract mechanics), Q54 (content model + publishing workflow), Q63 (migration mechanics).

## What to check

1. **Internal consistency:** cross-references between questions (Q-numbers cited in Answers)
   — do they point at the right places and say compatible things? Do any two Answers
   contradict each other? Do the locked decisions above compose, or is there a latent
   conflict (e.g. between the Q51 contract package, the Q47 framework-agnostic client
   contract, and the Q40 composition mechanics)?
2. **Completeness of the Answer text:** any Answer that is thinner than its question
   promises, or that defers silently to another question without saying so.
3. **Missing questions:** what the document does not ask that it should, given the locked
   direction — platform-lifecycle, developer-experience, module-ecosystem, or operational
   gaps. Only propose genuinely load-bearing additions, not checklist padding.
4. **Feasibility/technical soundness:** any locked claim that is technically questionable
   on Cloudflare Workers/D1/better-auth (e.g. seam designs that don't survive Workers'
   constraints, D1 batch/transaction realities, better-auth integration assumptions).
5. **Prior-review fold verification:** `docs/discovery/review-gpt-6-astra.md` and
   `docs/discovery/review-gpt-6.1-sol-pro.md` were already folded in. Spot-check their
   points actually landed in the document; report anything dropped or half-applied.
6. **Fresh-session usability:** could a brand-new session pick this file up and orient
   correctly — statuses truthful, no stale claims, Agent defaults not mistaken for answers?
7. **Drift risk:** places where wording reintroduces ambiguity the decisions were meant to
   close (especially the platform-vs-CMS framing and the product-name consistency:
   every product reference must read "Yomban.ink", never bare "Yomban").

## Output format

- Verdict line up front (e.g. PASS / PASS-with-findings / FAIL, one sentence why).
- Findings tiered: **Must fix** / **Should improve** / **Consider** — each with the
  Q-number(s) it concerns, what is wrong, and a concrete suggested resolution.
- Reference specific line content, not vague themes. No praise padding, no restating the
  document back.
- End with a short "already locked — respected" confirmation listing any locked decision
  you checked for consistency, so gaps in your own coverage are visible.

Be adversarial about gaps and honest about uncertainty. If you are unsure whether something
is a real problem, say what would decide it rather than padding the findings list.
