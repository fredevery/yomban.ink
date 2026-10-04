# Yomban.ink — Status

> Live “where are we”. Refreshed in the same session as any review/plan milestone.
> Sources: onboarding answers Q4, Q5–Q7, Q19, Q26, Q27.

## Current phase

**Onboarding complete; plan 000 approved, awaiting decomposition.** The seven baseline
layers and approved onboarding log (`docs/discovery/onboarding.md`) landed in commit `8c49b58`.
The Trello board and valid `.project/state.json` exist; no plan, phase or task is active.
Plan 000 is drafted at `docs/plans/000_spike-plan/000_spike-plan.md`, with eight phase
specifications. Its understanding record validates six ANSWERED / zero OPEN questions. The project is **greenfield / specification stage** — no product code exists;
the nine specs (`docs/specs/000–008`) state requirements and design gates, not an implementation.

**Immediate next step (for a fresh session):** `/extract-phases` reconciles the existing
reviewed phase specifications, then `/extract-tasks` fans out checked task files and TASK
cards → activation via the Orca bookends → run the design spikes → the MVP implementation
plan. The dev approved plan 000 via `/approve-plan`; its PLAN card is in To do:
https://trello.com/c/hs1xvd2A/1-plan-000-yombanink-spike-plan.
Approval does not activate the plan or approve/execute its phases/tasks. Attempt 1 timed out without a verdict;
attempt 2 returned PASS-with-findings (no MUST, two SHOULD clarifications), now applied with
the dev's authorization and mechanically checked, not independently re-reviewed. The
understanding loop remains zero OPEN. No spike is closed by planning alone.

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
