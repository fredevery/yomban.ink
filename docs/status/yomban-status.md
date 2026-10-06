# Yomban.ink — Status

> Live “where are we”. Refreshed in the same session as any review/plan milestone.
> Sources: onboarding answers Q4, Q5–Q7, Q19, Q26, Q27.

## Current phase

**Plan 000 ACTIVE — phase 002 (Q54 / Q63) tasks 2.1–2.5 executed; pending dev phase
approval/close.** Q54 — content workflow semantics — INPUT is **ACCEPTED** (task 2.1
evidence §3; ADR-0004 Proposed) and exercised by the task-2.2 real-D1 harness (21/21
tests); the Q54 gate is NOT Closed (waits for Q67 guarantees, task 7.7). Q63 —
DB placement/migrations/Better Auth — design is **PROVISIONAL** (shared single D1
dev-accepted input; ADR-0005 Proposed) with the task-2.4 real-D1 proof run green (14/14
tests; prefixed TEXT IDs proven on stored rows; ID scheme flagged pending Q40); the Q63
gate is NOT Closed (final acceptance at task 7.2). The phase review (task 2.5) re-ran
both phase harnesses plus the phase-001 prerequisite harness — all commands exit 0 (21+14+7
tests) — and the validators (OPEN 0 understanding / valid state / clean diff), recording
phase ADR-0016 (process acceptance; PASS-with-findings, no MUST — review-ADR number
drift 0015→0016, ADR-0004 stale status line, closure-matrix rows predate 2.2/2.4;
owner/browser/cloud checks N/A). Phase 002's close-out edits are uncommitted; the dev's
phase approval/close and any phase commit are the next Orca verbs. Phase 001 is
approved/closed prior: Q38 CLOSED (ADR-0003). The project remains **greenfield /
specification stage** — the spike harnesses are non-product proof code; no product code
exists; the nine specs (`docs/specs/000–008`) state requirements and design gates, not
an implementation.

**Immediate next step (for a fresh session):** dev-triggered phase approval/close for
phase 002, then `/start-phase` phase 003 (coupled composition, contracts, candidate
presentations/starter and local-first seams). See [phase 002](../plans/000_spike-plan/phases/phase_002.md),
[phase ADR-0016](../decisions/0016-spike-phase-002-review.md) and the parent plan's
[task summaries + closure matrix](../plans/000_spike-plan/000_spike-plan.md).

## Confirmed decisions (superset: `docs/decisions/0001-platform-foundations.md`)

- Product: **modular, composable application platform — not a CMS** (Q1/Q43).
- Backend locked: Workers + Hono + better-auth + TypeScript + pnpm; D1/Drizzle; monorepo;
  one deployment per project (Q13/Q32).
- Build-time composition (no runtime plugins); registry-provided typed services (Q29/Q41).
- Prefixed sortable TEXT ids, no INTEGER PKs; module-owned PascalCase `Key='Key'` enums
  aggregated at build; permission keys `<Namespace>:<Member>` (Q11/Q50).
- **Frontend independence is locked** (Q22/Q46); **no** public starter / dashboard /
  controller / panel is selected (htmx candidates only).
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

| Gate | Subject | Blocks |
|---|---|---|
| **Q38** | Core capability inventory (run **first**) | capability verification; foundational implementation |
| **Q40** | Package/export/composition/deployment/installation/lifecycle | composition/install/lifecycle implementation |
| **Q46** | Reopened public-site starter choice | starter scaffolding; MVP public-client implementation |
| **Q47** | Framework-free client/wire/host/presentation interfaces | client/host interfaces; final Q40 exports |
| **Q54** | Content/publishing/editing workflow semantics | content/workflow, in-situ editing |
| **Q63** | DB placement/migration mechanics + Better Auth prefixed-ID evidence | schema/migration/auth persistence |
| **Q70** | Local-first client datastore + sync (additive; **MVP deliverable**) | the client-local store/sync layer |

Final Q40/Q47 designs close **together**, after Q54 supplies workflow semantics; **Q46 closes
alongside** them in MVP scope.

Affected-work gates (each closes before its own affected implementation **and** MVP deployment):
**Q65** backup/retention/restore · **Q66** durable effects/retries/idempotency · **Q67** author
read-your-writes/public propagation/preview isolation · **Q68** security surface profiles /
rate limiting / first-admin bootstrap.

Post-MVP: **Q69** (purpose/dogfooding of the `yomban.ink` site), search, mobile/Capacitor,
additional complete production UI implementations.

## Freshness mechanism (Q27)

A recurring **project-state review** feeds `docs/reviews/` on cadence/milestone boundaries.
This status doc and the AGENTS.md “Current Phase:” pointer are refreshed in the same session as
any review or plan milestone (they go stale fastest).
