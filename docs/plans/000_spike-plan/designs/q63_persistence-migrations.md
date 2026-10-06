---
title: "Q63 — database placement, migration runner and auth integration (provisional design)"
created_session: "20261006_125410_080115"
sessions: ["20261006_125410_080115"]
approved: false
---

# Q63 — Database placement, migration runner and auth integration (design)

> **Status: PROPOSED/PROVISIONAL design input for gate Q63 — NOT a closed gate.**
> This is the task 2.3 deliverable (`docs/plans/000_spike-plan/tasks/phase_002/in-progress/task_2.3.md`).
> It proposes the **mechanics** for Yomban.ink data persistence within the LOCKED constraints:
> module-owned Drizzle schemas (Q37), a core migration runner (Q37), D1-only persistence (Q45),
> one-D1-database/one-prepared-statement-batch unit-of-work atomicity (Q52), prefixed sortable
> URL-safe TEXT ids via one core id-service seam — never INTEGER or unprefixed (Q11), and
> Drizzle-generated migration SQL needing an approved execution path (Q25). The accompanying
> ADR is **Proposed, not accepted** (`docs/decisions/0005-database-placement-and-migrations.md`).
>
> **Evidence note:** per plan 000, the required Q63 evidence (empty/existing-version migration,
> failure/retry/concurrent-deploy safety, Better Auth adapter with core-generated prefixed TEXT
> IDs against real D1) is **NOT YET RUN** — no harness exists; that is **task 2.4's**
> deliverable. Nothing here is claimed as executed or passing. Unverified tooling behaviour is
> recorded in `evidence/q63_persistence-migrations.md`, never asserted as a proven API.
>
> **Q40 boundary:** this design consumes Q40's seams by reference (id-service seam, unit-of-work
> participation contract, package/wiring ownership) and designs none of them. Q40's final
> exports/topology remain provisional until the joint Q40/Q47 closure.

## 1. Scope and authority

Grounding sources for this design:

- **`docs/specs/003_data-and-migrations.md` §Q63** — the authoritative scope bullets (the
  design labels them (a)–(l) for reference, cross-referenced from the requirement matrix,
  §15) and the locked constraints this design must respect.
- **`docs/discovery/understanding.md`** — Q11 (identity seam, Better Auth compatibility as a
  required Q63 evidence check), Q19 (foundational prerequisite spike), Q25 (raw-SQL
  prohibition; Drizzle-generated SQL execution path owned here), Q36 (declared manifest
  dependency graph, no monkey-patching), Q37 (module-owned tables/migrations; core runner +
  small Better Auth base schema), Q40 (composition/wiring/ID mechanics/wiring participation),
  Q41 (registry services), Q45 (D1-only; multiple bindings never imply distributed
  transactions), Q52 (atomicity = one D1 database + one prepared-statement batch), Q63
  (mechanics deferred here), Q65 (backup/recovery — affected-work gate).
- **`docs/specs/008_operations-and-quality.md`** — Q65 backup/retention/restore pointers
  (D1 export as the chosen DB-backup direction; restore must be exercised; this design keeps
  recovery **provisional**).
- **`docs/specs/000_index.md`** canonical gate table Q63 row — owner/evidence/blocks.
- **Dev-accepted provisional input (this session, 2026-10-06):** ONE shared D1 database with
  per-module table naming namespacing — recorded as design input in
  `evidence/q63_persistence-migrations.md` §2, and adopted §3 below. The ledger, lock and
  remaining mechanics are designed **provisionally inside that constraint**.
- **Official tooling docs consulted:** Drizzle ORM docs (migrations; Cloudflare D1 connect
  guide) and Better Auth docs (Drizzle adapter, schema generation). Anything not verified
  against those docs is listed as an evidence unknown, not a proven API.

## 2. Placement: shared D1 vs separately bound databases

### 2.1 Comparison

| Dimension | **Shared D1 database** (one binding for all modules) | **Separately bound databases** (per-module D1 bindings) |
|---|---|---|
| Cross-module atomicity | A multi-module unit of work (registry services contributing deferred operations, Q41) can map to **one prepared-statement batch** — exactly Q52's atomicity. | Cross-module writes span databases; Q52 explicitly forbids claiming cross-database atomicity. Every cross-module write would need Q66-style compensation design that does not yet exist. |
| FKs across module boundaries | Possible within one SQLite file (declared, validated at conformance). | Impossible across D1 databases — relations degrade to unvalidated ids. |
| Deployment/migration | One ledger, one lock, one topological pass over the Q36 graph. | Per-database ledgers and locks; N× failure/retry surfaces. |
| Noisy-neighbour / blast radius | A runaway module share-scan affects the shared DB; all modules deploy schema together. | Isolation per module; modules migrate independently. |
| Cost/limits | One D1 database consumes one slot; simpler wrangler config. | One D1 per module — D1 is not designed for high database counts per account. |
| Scaling-out future | Migration to split placement later is a large re-plumbing. | Splitting is native, but the platform pays for it upfront without an atomicity payoff. |

### 2.2 Selected placement (provisional, dev-accepted input)

**One shared D1 database**, with per-module table naming namespacing. This is the only
placement consistent with Q52's locked single-batch atomicity: registry services contribute
deferred operations to **one** unit of work (Q41/Q52), and a unit of work touching module A
and module B can only be one batch if A and B share one database. Separately bound databases
would force every cross-module write to claim cross-database atomicity Q52 forbids, or to
queue for a Q66 compensation design that is not yet designed. The selection is
**provisional** — it is the placement the design proceeds under, and ADR-0005 stays Proposed
until task 2.4 evidence + phase 7 reconciliation.

**Manifest stance (Q45, unchanged):** manifests still name their required D1
database/binding needs. Under the shared placement the needs resolve to the **same** binding;
the named-requirement mechanism stays, so a future split does not change the manifest
contract. Multiple bindings, if ever selected later, imply **no distributed transaction**
(Q45/Q52).

## 3. Table/migration namespace and collision rules

- **Table names:** every table is prefixed with its owning module's **module namespace**
  (the manifest-registered namespace, also the enum/permission prefix): `<ns>_<entity>`
  (e.g. `content_pages`, `menu_categories`). Names are lowercase snake_case.
- **Core/base tables** are prefixed `core_`: the migration ledger (`core__migrations`, §5),
  the migration lock (`core__migration_lock`, §6), and the **Better Auth base schema tables**
  (`core_user`, `core_session`, `core_account`, `core_verification`, … — exact set generated
  by the Better Auth CLI per §9; the `core_` prefix maps the adapter's table names, per the
  adapter's schema-mapping option).
- **No module may use the `core_` prefix** — it is reserved and checked at conformance
  (Q35/Q61). A module's declared tables outside its own namespace are rejected.
- **Collisions are declared/checked, not discovered at deploy time:** the manifest declares
  every owned table (Q35/Q37); the composition conformance check (Q61) validates namespace
  ownership, `core_` reservation and uniqueness across all registered modules **before
  registration**. Any collision is a registration-time failure, never a runtime migration
  error.
- **Migration artifact namespacing:** each module owns a migrations directory
  (`migrations/<ns>/` inside the module package) holding its Drizzle-generated SQL artifacts
  (§8). The ledger keys a migration by `(module_ns, migration_id)` — identical
  Drizzle-generated filenames (e.g. `0000_wise_unicorn.sql`) across modules are therefore
  **not** collisions; a collision is only a duplicate `(ns, id)` pair, which is a conformance
  failure. The lock/ledger tables sit in the core namespace and are created by the runner's
  bootstrap before any module migration.

## 4. Dependency ordering — topological by the Q36 graph

- The core runner orders migrations **topologically over the module dependency graph**
  declared in manifests (Q36: declared manifest dependencies, no monkey-patching). A module's
  migrations run **after** all of its declared dependencies' migrations.
- Modules with no inter-module dependency form the initial layer; ties within a layer resolve
  deterministically (lexical by namespace) so runs are reproducible and evidence-comparable.
- **Cycles are a registration-time failure** (conformance, Q61) — the runner refuses to start
  rather than breaking a cycle heuristically at deploy time.
- Ordering is **per migration run**, recomputed from the current installed module set; the
  ledger records the observed order per run (§5) for auditability.
- New modules added later slot into the topological order of the current set; existing
  modules are not re-run (§10).

## 5. Persistent migration history ledger and its namespacing

- **Ledger table: `core__migrations`** — one core-owned table in the shared database, created
  before any module migration runs. Columns (provisional shape): `module_ns`, `migration_id`
  (the Drizzle-generated tag, e.g. `0000_wise_unicorn`), `kind` (`schema` | `data`), applied
  batch/bookmark identifier, statement checksum (for drift detection), a run/invocation
  identifier, `applied_at` and status fields including failure marks (§7).
- **Primary key `(module_ns, migration_id)`** — per-module namespacing inside a single ledger;
  no per-module ledger tables. The ledger itself is never module-owned.
- The ledger is written **in the same D1 batch as the migration's statement batch** where the
  migration's DDL/DML runs — under Q52's batch atomicity, a migration step and its ledger row
  commit together or not at all. **This per-step batch atomicity is the retry/safety
  foundation (§7) and MUST be verified against real D1 behaviour in task 2.4** (it is not yet
  run evidence).
- The ledger is the authority for "what has been applied": the runner never trusts memory,
  file presence or a binding's own tooling state.

## 6. Lock for concurrent deploys (exclusion/fencing)

Two deploys racing the same shared database must not interleave. Since there is no
long-lived server process, the lock is a **database-backed advisory exclusion lock with a
fencing token**:

- **Lock table: `core__migration_lock`** — a single row (singleton). Acquiring the lock is one
  **atomic conditional UPDATE of that row inside one D1 batch**: a claim succeeds only if the
  current lease is absent or expired (lease timestamp + TTL). The row's `UNIQUE`/single-row
  shape plus the conditional update makes the acquire mutually exclusive within the database —
  two concurrent batches cannot both claim. **This mutual-exclusion property must be proven
  against real concurrent D1 batches in task 2.4 — it is designed, not yet run.**
- **Lease + TTL:** a holder holds the lock for a bounded lease; a crashed deploy cannot wedge
  the database forever — after TTL expiry, a new claimant takes over and marks the abandoned
  run as failed in the ledger (§7).
- **Fencing token:** the lock row carries a monotonically increasing attempt counter. Ledger
  writes record the token; an old holder whose lease expired and whose token no longer matches
  must not mark its runs as applied — a late stale writer is detectable and its ledger writes
  are rejected (token mismatch). This is fencing, not just exclusion.
- **Deployment wiring (release vs migrate) is Q40's:** this design supplies the in-database
  exclusion primitive; how CI/deploy serializes around it (or whether deploys run migrations
  at all vs a separate `pnpm migrate` step) is Q40's composition/deployment design — referenced, not designed here.

## 7. Partial failures and retries

- **Granularity = one migration step = one D1 batch.** Each migration file's statements run in
  one prepared-statement batch together with its ledger row (§5): statement error → batch
  rollback → nothing applied, no ledger row. D1 batch semantics are the rollback mechanism.
- **A migration larger than one batch** (e.g. a data migration, §8) is chunked into explicit
  batch-sized steps, each with its own ledger progress row — resumability is at step
  granularity, never "rest of file".
- **Retry:** a run (manual re-invoke of `pnpm migrate`, or a new deploy) re-reads the ledger,
  skips `(ns, id)` pairs already applied, and resumes at the first unapplied step in
  topological order. Per-step idempotency requirement: each step must be safely re-runnable
  from an empty side (guaranteed for schema steps by the all-or-nothing batch; required
  **by design** for data-migration steps via their chunk cursor — verified in task 2.4).
- **Failure recording:** the failed step is marked in the ledger (status = failed, with the
  fencing token and diagnostics pointer); the run stops — the runner never skips a failed
  step and continues. Marking is itself a batch so it is durable.
- **Concurrent-deploy interference during recovery** is handled by the lock (§6): the
  recovering run acquires the lock and the fencing token before resuming.
- **Injected-failure evidence** (retry after failure, safe ledger state) is task 2.4's
  required proof — designed here, not yet executed.

## 8. Data-vs-schema migrations

- Every migration artifact is declared as **`schema`** or **`data`** (manifest-level or
  front-matter in the module's migration metadata; the ledger records the kind).
- **Schema migrations** are Drizzle-generated DDL (§8): all-or-nothing per batch, no data
  transformation.
- **Data migrations** transform existing rows (backfills, renames with copy, derived-column
  seeding). Rules:
  - They run **as chunked batches** (§7) with a resumable cursor row in the ledger — never one
    unbounded batch, because batch size limits make a whole-table rewrite a failure risk.
  - They are **declared, not hidden** inside a schema migration: a `schema` migration that
    mutates rows is a conformance failure.
  - Data migrations must be **idempotent per chunk** (detect already-transformed rows) so a
    retry does not double-apply.
  - Within a topological run, data migrations for a module run at the position their
    dependency order assigns — after their dependency's migrations that produced the columns
    they transform.
- Cross-database or external effects of a data migration (R2, queues) are **out of scope** —
  Q66 owns external-effect recovery; the runner claims atomicity only inside D1 (Q52).

## 9. Better Auth base schema: ownership and complete generation/migration integration

- **Ownership:** core owns the Better Auth **base schema** — the only non-module-owned schema
  (Q37). Better Auth tables live in the `core_` namespace (§3) and are migrations in the
  runner's ordering as a pseudo-module (`core`, dependency of all modules that require auth).
- **Complete generation:** the base schema is **generated from the Better Auth configuration**
  via the Better Auth CLI's schema generation into the core's Drizzle schema file (per Better
  Auth's docs: `npx @better-auth/cli generate` outputs a Drizzle schema matching the
  configured auth options/plugins), then migrated by the **same core runner** — Better Auth's
  Drizzle integration generates schema and leaves migration handling to the ORM/tooling
  (`003` "Drizzle and the migration execution path"; verified against Better Auth's Drizzle
  adapter docs). Regenerating after an auth-plugin change produces a Drizzle diff and then a
  normal Drizzle-generated migration (§8).
- **Table-name mapping:** the adapter receives the schema with the `core_`-prefixed table
  names mapped (Better Auth's Drizzle adapter supports passing a schema object with table
  mappings, and `usePlural` for plural table names — per its docs; exact option set verified
  against the pinned adapter version is **task 2.4's** check, recorded then).
- **Prefixed TEXT IDs — the required compatibility check (Q11/Q63):** every Better Auth entity
  (user, session, account, verification, …) uses a **core-seam-generated, entity-prefixed,
  sortable, URL-safe TEXT id** — e.g. `au_user_…`, never INTEGER, never unprefixed. The
  adapter must accept platform-generated IDs for auth entities, verified **by executing
  supported auth flows and inspecting the actual stored IDs/schema** — not by a generateId
  unit test alone (task-card acceptance for 2.4). A failed compatibility check **blocks auth
  work and is surfaced to the dev**; it is never silently resolved by falling back to integer
  or unprefixed IDs (Q11/`003`).
- **Version pinning:** the adapter/auth CLI versions are pinned in the task 2.4 harness
  (`package.json` + lockfile); behaviour claims in the design cite official docs at the time
  of writing and are re-verified against the pinned versions during that task.

## 10. Module removal with data retention

- **Removal never silently discards existing data** (Q37/Q63). Removal of an installed module
  is a distinct, explicit step (the CLI's `remove module`, Q44) with three outcomes, gated on
  data presence (row counts in the module's tables):
  1. **No data present** — the module's tables may be dropped by a generated final schema
     migration (Drizzle-generated, executed by the runner); ledger rows for the module are
     **retained** as history, marked module-removed.
  2. **Data present, retention path chosen (default)** — the module's tables are **left in
     place** (schema remains, code removed). Its dependency-edge positions are vacated; the
     runner's ordering ignores removed modules. Retention duration/restore interplay is
     **Q65's** (provisional here, §13).
  3. **Data present, export-then-drop** — data is exported (the export procedure is Q65's
     D1-export direction, not designed here) and only then the final drop migration runs.
  In every case the **ledger rows and the module's data survive the removal decision itself**;
  silent drop is impossible.
- **Dependency constraint:** a module cannot be removed while another installed module
  declares a dependency on it (Q36 graph) — the CLI's add/remove honours the graph (Q44);
  conformance rejects the removal rather than dangling dependents.
- The design does **not** invent a data-archival format: that is Q65's (§13).

## 11. Empty-database and existing-version upgrade behaviour

- **Empty database:** bootstrap creates `core__migrations` + `core__migration_lock`, then runs
  the full topological pass (§4) applying every module's migrations (and Better Auth's base
  migrations) in one run — the golden path `scaffold → create module → migrate` (Q7/Q37/Q63).
- **Existing version:** the runner reads the ledger, computes the set of available-but-
  unapplied migrations per module, topologically orders the *pending* set and applies only
  those. Already-applied migrations are never re-run; **out-of-order arrivals** (a module
  added whose migration id is older than another's already-applied — i.e. new-module
  insertion, not reordering of a live module's history) are applied in topological position
  of the current set. Rewriting/reordering a module's **own applied history** is forbidden
  (append-only per module); checksum mismatch against the ledger is a hard failure (drift
  detection), not a silent override.
- **Empty-DB and upgrade paths must be proven on real D1 in task 2.4** (task-card acceptance
  for 2.4) — designed here, not yet run.

## 12. Execution of Drizzle-generated SQL migration artifacts (consistent with Q25)

- **Artifact production:** modules generate their migration SQL with the pinned **Drizzle
  Kit** from their own `sqliteTable` schema (`drizzle-kit generate`) — the only artifact
  source; hand-written SQL files are not accepted (Q25's raw-SQL prohibition; data
  transformations, where required, are expressed as Drizzle query code executed by the runner,
  not as ad-hoc SQL strings).
- **Artifact execution:** the **core runner owns execution** (Q25: Drizzle-generated SQL needs
  an approved execution path — this design is that path, pending gate closure). The runner
  loads the generated artifacts (journal + SQL files), splits them per its step rules (§7),
  and executes statements through the **D1 binding in prepared-statement batches**, writing
  ledger rows in the same batch (§5). No statement runs outside the runner.
- **Harness vs product:** the task 2.2 fixture path (`readD1Migrations` +
  `applyD1Migrations` from `@cloudflare/vitest-pool-workers` against Miniflare D1) is
  **provisional fixture evidence only** — the product path is the core runner designed here.
  Whether task 2.4's harness also uses `applyD1Migrations` for its fixture migrations or
  exercises the runner logic directly is decided at that task's gate (the runner itself is
  product code and does not ship from the spike).
- **`drizzle-kit migrate`/`push` do not run against the shared production database as the
  product mechanism** — Drizzle Kit's own migrate applies via its own journal/`__drizzle_
  migrations` table and is a local-dev convenience at most; the platform's ledger/lock/ordering
  requirements (§§3–7) supersede it. This exclusion is stated so tooling convenience never
  bypasses the runner.

## 13. Q65 backup/recovery requirements (remain provisional)

Q65 is an **affected-work gate** (backup/retention/coordinated restore); this design only
names the requirements it must satisfy and **selects no backup mechanism**:

- Migration runs and module removals must not destroy the only copy of data: **default
  retention on removal** (§10 outcome 2) and ledger-retained history are the minimum.
- The Q65 D1-export direction is the recorded backup direction — **not proof of coordinated
  recovery**; restore of DB records **and referenced R2 objects** must be exercised under Q65.
- Recovery from relevant **migration failure cases** (failed/partial run, drifted checksum,
  abandoned lock) must be part of Q65's exercised-restore evidence.
- **Backup/restore of the migration fixtures produced by task 2.4 follows in Phase 004** —
  not in this phase. Nothing here prescribes R2 bucket versioning (unavailable per Q65's
  review-03 finding) or a storage vendor.

## 14. What this design does not decide

- **No ID mechanics beyond the locked prefix scheme:** UUIDv7-vs-ULID, prefix registration
  details, temporary-vs-final client ids, duplicate-request behaviour — **Q40's**, referenced
  via the id-service seam only (§9 uses "the core id-service seam" without selecting its
  internals).
- **No Q40 wiring design:** composition roots, package exports, install mechanics, deploy-time
  migration invocation, auth topology — Q40 owns wiring participation; this design consumes
  its seams (§1, §6, §9).
- **No Q65 mechanism** (backup format, retention durations, restore procedure, R2 handling) —
  §13 names requirements only.
- **No Q66/Q67 mechanics** — external-effect recovery and cache invalidation are untouched;
  the runner claims no atomicity beyond one D1 batch (Q52).
- **No product code:** the runner, ledger and lock are **designed**; task 2.4 exercises the
  selected adapter/tooling and the designed mechanics against real D1 in an isolated harness.
  Nothing is implemented in this task.

## 15. Requirement matrix

Each Q63 scope bullet from `docs/specs/003_data-and-migrations.md` §Q63 (with discovery-Q63
and the task-card acceptance wording) mapped to the design section that resolves it:

| Q63 scope bullet | Resolved in |
|---|---|
| (a) shared D1 database vs separately bound databases (multiple bindings ≠ distributed transaction) | §2 (comparison + selection); respects Q45/Q52 |
| (b) table/migration namespace and collision rules | §3 |
| (c) dependency ordering — topological by the Q36 dependency graph | §4 |
| (d) persistent migration history (ledger) and its namespacing | §5 |
| (e) lock for concurrent deploys (exclusion/fencing) | §6 |
| (f) partial failures and retries | §7 |
| (g) data-vs-schema migrations | §8 |
| (h) execution of Drizzle-generated SQL migration artifacts consistent with Q25 | §12 (artifact source, core-runner execution path, tooling exclusions) |
| (i) Better Auth schema ownership + complete base-schema generation/migration integration | §9 |
| (j) safe module removal and retention of existing data | §10 |
| (k) empty and existing-version upgrade behaviour (required evidence shapes) | §11 |
| (l) Q65 backup/recovery requirements (provisional until Q65) | §13 |
| Q40 wiring participation (referenced, not designed) | §1, §6 (deploy serialization deferred), §9 (id-service seam), §14 |
| Unit-of-work atomicity respected (one D1 DB + one batch; no distributed claims) | §2.2, §5, §7, §8, §12; cross-DB/R2/queue effects excluded (Q52/Q66) |
| Identity never INTEGER/unprefixed (Q11) — Better Auth included | §9 (prefixed TEXT IDs; failure blocks auth work, surfaced to dev) |
| Better Auth prefixed-TEXT-ID compatibility as required evidence (flows + stored IDs) | §9; proof = task 2.4, not yet run (evidence §4) |

**Matrix completeness note:** the design's labels (a)–(l) cover every bullet of `003` §Q63's
"Intended design scope" list — rows (k) and (l) additionally absorb the "Required evidence"
bullet and the Q65 `008` pointer. The "Atomicity constraint" and "Blocks" bullets map to
constraints respected (§2, §14), not additional design outputs. Their **execution** is task
2.4's, per the evidence report's §4 unverified list.
