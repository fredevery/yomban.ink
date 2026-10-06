---
title: "Q63 — database placement, migration runner and auth integration (evidence: design traceability, dev input, unverified items)"
created_session: "20261006_125410_080115"
sessions: ["20261006_125410_080115"]
approved: false
---

# Q63 — Evidence report (task 2.3) — placement/migration/auth design traceability

> This is the **Q63 evidence report for task 2.3**
> (`docs/plans/000_spike-plan/tasks/phase_002/in-progress/task_2.3.md`). It records
> (a) what the task produced, (b) the **dev-input acceptance** recorded this session,
> (c) the design choices and their sources, and (d) the **UNVERIFIED items** to be
> proven by task 2.4's real-D1 harness.
>
> **Nothing in this report asserts an unexecuted check as run.** No tests, no D1
> execution, no harness and no package installation occurred in this task; those are
> task 2.4's deliverable. ADR-0005 is **Proposed, not accepted**; Q63 final acceptance
> waits for task 2.4 (proof) and phase-007 task 7.2 ("Reconcile and close Q63",
> `docs/plans/000_spike-plan/phases/phase_007.md`; task files fan out later).

## 1. What was produced

Exactly three documentation files, matching the task card's Files list — no other file
was created or modified, no code was written, no packages installed:

1. **`docs/plans/000_spike-plan/designs/q63_persistence-migrations.md`** — the
   provisional mechanics design: shared-vs-separate D1 comparison and selection,
   namespace/collision rules, topological ordering by the Q36 dependency graph,
   persistent ledger + namespacing, concurrent-deploy exclusion lock with fencing
   token, partial-failure/retry granularity, data-vs-schema migration rules,
   the Drizzle-generated-SQL execution path consistent with Q25, Better Auth base-schema
   ownership/generation/migration integration with the required prefixed-TEXT-ID
   compatibility check, safe module removal with data retention, empty/existing-version
   upgrade behaviour, and provisional Q65 backup/recovery requirements. Includes the
   **requirement matrix** (design §15) mapping every §Q63 scope bullet to its design
   section.
2. **`docs/decisions/0005-database-placement-and-migrations.md`** — ADR-0005, status
   **Proposed** (not Accepted/closed), with a note that acceptance follows task 2.4
   evidence + phase 7 reconciliation. Format matches ADR-0001/0004.
3. **This evidence report.**

## 2. Dev-input acceptance recorded this session

**Placement input: ACCEPTED (dev, 2026-10-06, session 20261006_125410_080115).**

The dev accepted, at this task's dev gate, the **provisional selection: ONE shared D1
database (not separately bound databases), with per-module table naming namespacing**
— recorded as design input in the design's §1/§2.2. This is the only placement
consistent with Q52's locked single-batch atomicity (a cross-module unit of work must
be one batch on one database). The migration ledger table, locking mechanism and
remaining mechanics were **designed provisionally inside that constraint** — the
constraint is dev-accepted input; the mechanics are this task's proposed design and
require the downstream gates before closure.

Not accepted/closed at this gate: ADR-0005 remains **Proposed**; no Q63 scope bullet
is marked proven; no ledger/lock/runner code exists. Acceptance of the design *content*
(ADR Proposed → Accepted) is a later dev-gated action following task 2.4 evidence and
phase 7 reconciliation — mirroring the Q54 pattern (input acceptance first, gate
closure later).

## 3. Design choices and sources

| Design choice | Source/authority | Notes |
|---|---|---|
| One shared D1 database (§2.2) | Dev-accepted input this session (§2 above); forced by Q52 (`003` locked decision: atomicity = one D1 DB + one batch; `understanding.md` Q52) | Separately bound DBs cannot host a cross-module one-batch unit of work (Q41/Q52). Q45's named-D1-requirement mechanism retained so a future split does not change the manifest contract. |
| Per-module table namespace `<ns>_<entity>`; reserved `core_` prefix; conformance-time collision rejection (§3) | `003` §Q63 bullet (namespace/collision rules); Q35/Q37 (manifest-declared schema/ownership); Q61 conformance; discovery-Q63 agent default (per-module prefixed names) | Collision is checked at registration, never discovered at deploy. |
| Topological ordering by manifest dependency graph; deterministic tie-break; cycle = registration failure (§4) | Q36 (declared manifest dependencies, no monkey-patching); `003` §Q63 bullet (topological by Q36 graph) | Order recomputed per run; ledger records observed order. |
| Ledger `core__migrations`, PK `(module_ns, migration_id)`; ledger row committed in the same batch as its migration step (§5) | `003` §Q63 bullet (persistent ledger + namespacing); Q52 batch atomicity; discovery-Q63 agent default (single migration-ledger table; per-step idempotency) | Per-step batch atomicity is the retry foundation — designed, **to be proven** (§4 below). |
| Database-backed singleton lock row + lease/TTL + monotonic fencing token; conditional-UPDATE acquire (§6) | `003` §Q63 bullet (lock for concurrent deploys); Q52 (batch atomicity as the only primitive); Q40 (deploy/migrate orchestration owned there) | No long-lived process exists on Workers, so exclusion must be in-database. Mutual exclusion and fencing **to be proven** with concurrent batches (task 2.4). |
| Step = one migration = one D1 batch (statement error → batch rollback); chunked resumable data migrations; retry skips applied pairs; failure marked in ledger, run stops (§7) | `003` §Q63 bullet (partial failures/retries); Q52; discovery-Q63 agent default (retry with per-step idempotency); `008` Q65 (migration-failure recovery named as Q65 evidence) | Injected-failure/retry/ledger-safety proof = task 2.4 acceptance. |
| `schema` vs `data` kinds declared; data migrations chunked + per-chunk idempotent; hidden DML in schema migrations rejected (§8) | `003` §Q63 bullet (data-vs-schema migrations) | Chunk cursors live in the ledger. |
| Artifacts only via `drizzle-kit generate`; core runner executes via D1 batches; `drizzle-kit migrate/push` excluded as the product mechanism (§12) | Q25 (`003` "Drizzle and the migration execution path": generated SQL needs an approved Q63-owned path); Q37 (core runner) | Task 2.2's `applyD1Migrations` fixture path is provisional fixture evidence, not the product path (`003` §Q63 + phase_002 task 2.2 execution note). |
| Better Auth base schema core-owned; generated via Better Auth CLI into Drizzle schema; migrated by the same runner; `core_`-prefixed mapped table names (§9) | Q37 (core owns small Better Auth base schema; "complete required auth entities/migration integration verified under Q63"); `003` ("Better Auth's Drizzle integration generates schema but leaves migration handling to the ORM/tooling") | **Verified against official docs this session:** Better Auth's Drizzle-adapter docs document `npx @better-auth/cli generate` producing the Drizzle schema, migration left to Drizzle tooling, a `schema` mapping option (map adapter names to your Drizzle tables) and `usePlural`. Exact option behaviour under the pinned adapter version = task 2.4 check. |
| Prefixed TEXT IDs for every auth entity; verified by executed flows + stored-ID inspection; failure blocks auth work and is surfaced (§9) | Q11 (identity locked; Better Auth compatibility is a **required Q63 evidence check**; failure blocks, never silently integer fallback); `003` "Identifier seam" + acceptance criteria | The id-service **seam** is referenced; its internals (UUIDv7/ULID etc.) are Q40's — not selected here. |
| Removal: default = retain tables/ledger when data present; drop only when empty or export-then-drop; dependents block removal; ledger rows always retained (§10) | Q37 ("Removal cannot silently discard existing data; Q65 supplies backup/recovery constraints"); `003` §Q63 bullet (safe module removal); Q44 (`add/remove module` honours dependencies + Q63 retention safety) | Export format/procedure = Q65's, not designed here. |
| Empty-DB bootstrap then full topological run; existing-version = pending-only, append-only per-module history, checksum drift = hard failure (§11) | `003` MVP requirements (scaffold → create module → migrate golden path); `003` §Q63 "Required evidence" (empty and existing-version migration runs); discovery-Q63 | Upgrade (platform packages/contracts) is Q49's separate `upgrade` command — distinct from DB migrate (Q44). |
| Q65 requirements named, mechanism not selected (§13) | `008` §Q65 (D1 export chosen direction; exercised restore of records + referenced assets; no native R2 versioning; blocks MVP deployment until closed); `003` §Q63 bullet | Recovery remains **provisional** until Q65 design (explicit task-card acceptance line). |
| Q40 wiring referenced only (§1, §6, §9, §14) | Q40 (owns composition/wiring/install/deploy topology, ID mechanics, unit-of-work participation contract) | Task-card acceptance: "Q40 supplies wiring participation" — referenced, not designed. |

## 4. Unverified items — to be proven by task 2.4 (real-D1 harness)

None of the following has been executed or observed. Each is **designed** in the
design document and is task 2.4's required evidence under the phase-002 contract
("Design tasks may create proposed designs/ADRs but must not assert unrun evidence"):

1. **Per-step batch atomicity on real D1** (§5): that a migration statement batch
   plus its ledger row commit or roll back together under actual D1/Workers behaviour.
2. **Lock mutual exclusion + fencing on real D1** (§6): concurrent deploy attempts
   (two batches racing the singleton lock row) resolve with exactly one holder, and
   an expired-lease stale writer with a mismatched token cannot mark ledger rows.
3. **Retry after injected failure with safe ledger state** (§7): failure mid-run,
   re-run skips applied pairs, resumes, and the ledger never shows an applied
   migration whose statements failed (or the reverse).
4. **Collision/dependency-ordering behaviour** (§3, §4): conformance-declared
   collisions and graph ordering exercised against the actual runner logic in the
   harness.
5. **Empty-DB and existing-version migration runs** (§11): both paths on real D1.
6. **Data-migration chunked resumability** (§8): per-chunk idempotency under retry.
7. **Module removal retaining data** (§10): removal with data present leaves tables
   and ledger rows intact.
8. **Better Auth adapter compatibility under the pinned versions** (§9): schema
   generation via the Better Auth CLI, adapter schema-mapping options (`usePlural`,
   schema mapping) for `core_`-prefixed tables, and **executed supported auth flows
   with stored-ID/schema inspection** proving core-seam-generated entity-prefixed
   TEXT IDs on every auth entity and FK — no integer/unprefixed fallback. Also
   unverified this session: the **exact CLI commands/flags and adapter option
   surface for the pinned better-auth version** (docs consulted were the current
   public docs; the pinned-version check is task 2.4's). **No package was installed
   and no API was proven here.**
9. **D1 batch-size limits vs large migrations** (§7): the step-chunking bound must
   be calibrated to observed D1 limits in the harness.

Executed in this task: document reading (the sources in the design §1 and §3), the
official-docs checks recorded above (Drizzle D1/migrations docs and Better Auth
Drizzle-adapter docs, via direct fetch of the official pages), design authoring, ADR
authoring and this report. **Not executed:** any test, migration, D1 call, harness
command, or package installation. Task 2.4's verification commands (`pnpm --dir …
install/test/typecheck/lint/build`) have **not** been run and their outputs are not
claimed anywhere.

## 5. Task 2.4 hook

Task 2.4 (`spikes/q63_persistence-migrations/` — repo-root `spikes/` per ADR-0015)
Modifies this design and evidence report with observed outputs. Per the phase file:
RED tests for adapter persistence, upgrade/collision/replay/concurrency first; Q65
restore of these fixtures follows in Phase 004; **Q63 final acceptance waits for 7.2
(reconciliation)** — neither task 2.4 nor this design closes the gate.
