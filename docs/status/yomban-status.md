# Yomban.ink — Status

> Live “where are we”. Refreshed in the same session as any review/plan milestone.
> Sources: onboarding answers Q4, Q5–Q7, Q19, Q26, Q27.

## Current phase

**Plan 000 ACTIVE — phase 003 (Q40 / Q47 / Q46 / Q70 coupled design inputs) tasks
3.1–3.5 executed; phase review (task 3.5) complete, pending dev phase approval/close.**
All four coupled design trios shipped and their provisional decisions are dev-accepted
(acceptance ≠ adoption; ADRs 0006/0007/0008/0009 all Proposed):

- **Q40** — composition/installation/lifecycle: static workspace packages + one
  Worker-per-consumer; per-side `core-server`/`contracts`/`clients`; base32 monotonic
  prefixed IDs with client finality. Install-specifier syntax stays UNVERIFIED pending
  the phase-006 probe (6.1–6.2). Joint closure 7.8.
- **Q47** — client/wire/host/presentation contracts: shared runtime schemas, typed
  module-source client (no codegen/tRPC/OpenAPI as primary), Q47-owned two-host fixture
  definition (Q61 executes, Q7 gates); dashboard/controller/panel remain separate
  candidate comparisons (selection pending proofs + dev decision); in-situ capability
  flagging → plan-understanding amendment 001. Proof at 6.3; joint closure 7.8.
- **Q46** — public-site starter: Astro 7.x + `@astrojs/cloudflare` selection APPROVED
  by the dev (2026-10-07) with thin-`apps/web` + generality conditions (generality
  tension → backlog item 8); Next.js + `@opennextjs/cloudflare` the bounded runner-up.
  Adoption still awaits the executed proof at 6.4; joint closure 7.8.
- **Q70** — local-first datastore/sync: `@sqlite.org/sqlite-wasm` sahpool VFS +
  drizzle `sqlite-proxy` seam (same `sqliteTable` on both surfaces); advisory leases,
  change-sets → one D1 batch, three-way conflicts; executed read-only source
  verification (Safari <17 / sahpool 16.4+ floor recorded as a conditional risk).
  Browser/round-trip proofs at 5.1–5.3; reconciliation 7.6.

The phase review (task 3.5) re-ran the three prerequisite harnesses from repo root —
all commands exit 0 (7 + 21 + 14 tests) — plus the validators (OPEN 0 understanding /
valid state / clean diff), recorded phase ADR-0017 (process acceptance; PASS-with-
findings, no MUST — a Q47 §-ref fix, closure-matrix Q40/Q47/Q46/Q70 rows refreshed
from Planned, status doc refreshed; owner/browser/cloud checks N/A for this doc-only
phase, carried to 5.1/6.4). Earlier phases stand: phase 002 APPROVED (2026-10-06,
ADR-0016; Q54 input ACCEPTED / Q63 provisional, neither gate Closed — closure at
7.2/7.7); phase 001 CLOSED (Q38 Closed, ADR-0003). No foundational gate beyond Q38 is
Closed. The project remains **greenfield / specification stage** — the spike harnesses
are non-product proof code; no product code exists; the nine specs (`docs/specs/000–008`)
state requirements and design gates, not an implementation.

**Immediate next step (for a fresh session):** dev-triggered phase approval/close for
phase 003 (`/approve-phase` → `/commit-phase` → `/close-phase`), then `/start-phase`
phase 004 (affected-work gate designs Q65/Q66/Q67/Q68). See
[phase 003](../plans/000_spike-plan/phases/phase_003.md),
[phase ADR-0017](../decisions/0017-spike-phase-003-review.md) and the parent plan's
[task summaries + closure matrix](../plans/000_spike-plan/000_spike-plan.md).

## Confirmed decisions (superset: `docs/decisions/0001-platform-foundations.md`)

- Product: **modular, composable application platform — not a CMS** (Q1/Q43).
- Backend locked: Workers + Hono + better-auth + TypeScript + pnpm; D1/Drizzle; monorepo;
  one deployment per project (Q13/Q32).
- Build-time composition (no runtime plugins); registry-provided typed services (Q29/Q41).
- Prefixed sortable TEXT ids, no INTEGER PKs; module-owned PascalCase `Key='Key'` enums
  aggregated at build; permission keys `<Namespace>:<Member>` (Q11/Q50).
- **Frontend independence is locked** (Q22/Q46); **no** public starter / dashboard /
  controller / panel is *adopted* — Q46's Astro starter is a dev-approved selection
  proposal pending the 6.4 proof; Q47's htmx/TS-controller candidates remain unadopted.
- Repo-based distribution `@yomban-ink/*`, no npm publish; git-tagged releases; contract
  semver current + N-1 (Q48/Q49/Q64).
- Privacy: platform-guardrailed, per-project-policied; guardrails reach client-local data
  (Q59/Q65/Q70/Q71).

## MVP definition (Q7, amendment 002)

An **end-to-end deployed** platform scaffold robust enough to begin live projects (not a local
generator): scaffold → create module → migrate → dev → deploy. MVP client scope = a selected
**public-site starter** + the bundled **dashboard** + the **Q70 local-first store/sync** +
the **two host acceptance fixtures**. **MVP completion gate:** a representative pilot-derived
scenario runs from scaffold to deployed with **zero core edits** (a full pilot rebuild is not
required).

## Open gates (authoritative inventory: Q19; sequencing in `docs/specs/000_index.md`)

Foundational prerequisite spikes (one ADR + concrete design + verification evidence each):

| Gate | Subject | State |
|---|---|---|
| **Q38** | Core capability inventory (run **first**) | **Closed** (2026-10-05, ADR-0003) |
| **Q40** | Package/export/composition/deployment/installation/lifecycle | Design DELIVERED + dev-accepted provisional inputs; NOT Closed (6.1–6.2; joint 7.8) |
| **Q46** | Reopened public-site starter choice | Design + selection proposal dev-approved; NOT Closed (6.4; joint 7.8) |
| **Q47** | Framework-free client/wire/host/presentation interfaces | Design DELIVERED + dev-accepted provisional contracts; NOT Closed (6.3; joint 7.8) |
| **Q54** | Content/publishing/editing workflow semantics | Input ACCEPTED; NOT Closed (7.7) |
| **Q63** | DB placement/migration mechanics + Better Auth prefixed-ID evidence | Design DELIVERED + proof green; NOT Closed (7.2) |
| **Q70** | Local-first client datastore + sync (additive; **MVP deliverable**) | Design + source verification, dev-accepted policies; NOT Closed (5.1–5.3; 7.6) |

Final Q40/Q47 designs close **together**, after Q54 supplies workflow semantics; **Q46 closes
alongside** them in MVP scope.

Affected-work gates (each closes before its own affected implementation **and** MVP deployment):
**Q65** backup/retention/restore · **Q66** durable effects/retries/idempotency · **Q67** author
read-your-writes/public propagation/preview isolation · **Q68** security surface profiles /
rate limiting / first-admin bootstrap. Phase 004 designs Q65–Q68.

Post-MVP: **Q69** (purpose/dogfooding of the `yomban.ink` site), search, mobile/Capacitor,
additional complete production UI implementations.

## Freshness mechanism (Q27)

A recurring **project-state review** feeds `docs/reviews/` on cadence/milestone boundaries.
This status doc and the AGENTS.md “Current Phase:” pointer are refreshed in the same session as
any review or plan milestone (they go stale fastest).
