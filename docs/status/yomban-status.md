# Yomban.ink — Status

> Live “where are we”. Refreshed in the same session as any review/plan milestone.
> Sources: onboarding answers Q4, Q5–Q7, Q19, Q26, Q27.

## Current phase

**Plan 000 ACTIVE — phase 001 (Q38 FIRST) tasks 1.1–1.4 executed; pending dev phase
approval/close.** Q38 — core capability inventory — is **CLOSED** (the first and only
Closed gate; ADR-0003, design/evidence + repo-root harness `spikes/q38_capability-inventory/`,
all five harness commands exit 0, `Tests 7 passed (7)`). The phase review (task 1.4) re-ran
all harness commands and validators (OPEN 0 understanding / valid state / clean diff) and
recorded phase ADR-0014 (process acceptance; PASS-with-findings, no MUST — harness-path
drift flagged, scope limits carried, owner/browser/cloud checks N/A). Phase 001's
close-out edits are uncommitted; the dev's phase approval/close and any phase commit are
the next Orca verbs. The project remains **greenfield / specification stage** — the spike
harness is non-product proof code; no product code exists; the nine specs
(`docs/specs/000–008`) state requirements and design gates, not an implementation.

**Immediate next step (for a fresh session):** dev-triggered phase approval/close for
phase 001, then `/start-phase` phase 002 (workflow semantics / Q54 input + Q63 provisional
designs). See [phase 001](../plans/000_spike-plan/phases/phase_001.md),
[phase ADR-0014](../decisions/0014-spike-phase-001-review.md) and the parent plan's
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
