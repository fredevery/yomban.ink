# ADR-0005 — Database placement and migrations (Q63)

- **Status:** Proposed (2026-10-06) — authored at task 2.3 of spike plan 000 phase_002; **not
  accepted**. Acceptance follows task 2.4's real-D1 evidence (empty/existing-version migration,
  failure/retry/concurrent-deploy safety, Better Auth prefixed-TEXT-ID compatibility) and
  **phase 7 reconciliation (7.2)** — an ADR alone is not closure (Q19/Q61).
- **Deciders:** the shared-D1 placement input was dev-accepted provisionally (2026-10-06,
  session 20261006_125410_080115); the migration mechanics are authored by the task-2.3 design
  agent, pending dev ratification.
- **References:** design `docs/plans/000_spike-plan/designs/q63_persistence-migrations.md`;
  evidence `docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md`;
  `docs/specs/003_data-and-migrations.md` §Q63 + locked decisions;
  `docs/specs/008_operations-and-quality.md` (Q65);
  `docs/specs/000_index.md` canonical gate table (Q63 row);
  `docs/discovery/understanding.md` Q11, Q19, Q25, Q36, Q37, Q40, Q41, Q44, Q45, Q49, Q52,
  Q63, Q65;
  `docs/decisions/0001-platform-foundations.md` (D4/D5/D10/D14 ceiling this record);
  `docs/decisions/0015-spike-harness-location.md` (task 2.4 harness location).

## Context

Gate Q63 is the foundational data/migration mechanics spike (`003` §Q63; canonical gate
table). The locked decisions it operates within: module-owned Drizzle schemas + a core
migration runner (Q37), D1-only persistence with named D1 requirements (Q45), unit-of-work
atomicity = **one D1 database + one prepared-statement batch** (Q52), prefixed sortable
URL-safe TEXT ids via one core id-service seam — never INTEGER or unprefixed (Q11), and the
requirement that Drizzle-generated migration SQL gets an approved execution path despite the
raw-SQL prohibition (Q25). Q40 owns composition/wiring/ID mechanics and the unit-of-work
participation contract; Q65 owns backup/retention/restore. This record sets the mechanics;
it reopens no locked decision.

## Decision (provisional, proposed)

1. **Placement: one shared D1 database with per-module table namespacing.** Separately bound
   databases are rejected for the MVP: a cross-module unit of work (registry services
   contributing deferred operations, Q41) can only be one prepared-statement batch on one
   database (Q52); separate databases would either claim forbidden cross-database atomicity
   or require an unproven compensation design, lose cross-module FK integrity, and multiply
   ledger/lock surfaces. Manifests still name their required D1 needs (Q45) — under this
   placement they resolve to the same binding, preserving a future split path without a
   distributed transaction.

2. **Namespaces and collisions.** Tables are `<ns>_<entity>` per the owning module's
   manifest namespace; the `core_` prefix is reserved (ledger `core__migrations`, lock
   `core__migration_lock`, Better Auth base tables `core_user`, `core_session`, …). Collision
   checking is **conformance-time** (Q35/Q61: manifest-declared tables, namespace ownership,
   uniqueness across registered modules) — never discovered at deploy. Migration artifacts
   are namespaced by `(module_ns, migration_id)` in one ledger, so identical Drizzle-generated
   filenames across modules are not collisions; a duplicate `(ns, id)` pair is a registration
   failure.

3. **Ordering: topological by the Q36 dependency graph.** A module's migrations run after all
   its declared dependencies'; deterministic lexical tie-break within a layer; cycles are a
   registration-time failure; the observed order is recorded per run in the ledger.

4. **Persistent ledger: `core__migrations`.** One core-owned table, PK
   `(module_ns, migration_id)`, recording migration id, kind (schema/data), statement
   checksum, run/fencing identifiers, status and timestamps. A migration step and its ledger
   row are written **in the same D1 batch** (Q52) — the foundation of retry safety. The
   ledger is the sole authority for applied state.

5. **Concurrent-deploy lock: database-backed exclusion + fencing.** A singleton
   `core__migration_lock` row acquired by an atomic conditional UPDATE inside one batch
   (absent-or-expired lease, TTL), carrying a monotonic **fencing token**: ledger writes
   record the token, and an expired-lease stale writer with a mismatched token is rejected.
   Deploy-time migration orchestration (release vs migrate serialization) is Q40's — this
   record supplies the in-database primitive only.

6. **Partial failure and retry.** One migration = one batch (statement error → batch
   rollback, no ledger row); a run stops at the first failed step and marks it in the
   ledger; re-runs skip applied `(ns, id)` pairs and resume topologically. Migrations larger
   than one batch (data migrations) are chunked into batch-sized steps with resumable
   per-chunk cursor rows and per-chunk idempotency.

7. **Data-vs-schema migrations.** Each artifact is declared `schema` or `data`. Schema
   migrations are pure Drizzle-generated DDL (all-or-nothing per batch). Data migrations
   transform existing rows, are chunked (§6), are idempotent per chunk, never hide inside a
   `schema` artifact (conformance failure), and run in topological position after the
   migrations that produced the columns they transform. External effects (R2/queues) of data
   migrations are excluded — Q66 owns external-effect recovery.

8. **Execution path for Drizzle-generated SQL (Q25).** Artifacts are produced **only** by
   `drizzle-kit generate` from module-owned `sqliteTable` schemas; the **core runner** is the
   approved execution path (design §§5–7, 12), executing statements through the D1 binding in
   prepared-statement batches. `drizzle-kit migrate/push` are excluded as the product
   mechanism (their own journal supersedes none of the ledger/lock/ordering requirements);
   task 2.2's `applyD1Migrations` fixture path remains provisional fixture evidence.

9. **Better Auth base schema: core-owned, generated, migrated by the same runner.** Core owns
   the base schema in the `core_` namespace, generated from the Better Auth configuration via
   the Better Auth CLI into the core Drizzle schema (per Better Auth's Drizzle-adapter docs:
   the CLI generates the Drizzle schema; migration handling stays with the ORM/tooling), then
   diffed/migrated like any other schema. The adapter receives the mapped, `core_`-prefixed
   schema. **Every auth entity uses core-seam-generated, entity-prefixed, sortable, URL-safe
   TEXT ids — no INTEGER and no unprefixed ids anywhere** (Q11). Prefixed-TEXT-ID
   compatibility is proven by executing supported auth flows and inspecting the actual stored
   IDs/schema (task 2.4); a failed check **blocks auth work and is surfaced to the dev**,
   never silently resolved by integer/unprefixed fallback.

10. **Module removal with data retention.** Removal never silently discards data: with no
    data present, a generated final migration may drop the tables; with data present the
    default is **retain** (tables left in place, code removed, ledger rows kept and marked
    module-removed) or **export-then-drop** (export procedure = Q65's). Dependent modules
    block removal (Q36 graph; Q44). Ledger history is always retained.

11. **Empty and existing-version behaviour.** Empty DB: bootstrap the ledger/lock, then one
    full topological run (the scaffold → create module → migrate golden path, Q7/Q37).
    Existing version: apply only pending migrations in topological position; already-applied
    migrations never re-run; per-module history is append-only; checksum mismatch against the
    ledger is a hard drift failure, not a silent override. Platform package/contract
    `upgrade` remains Q49's separate command, distinct from DB migrate (Q44).

12. **Q65 backup/recovery requirements named, not designed.** Removal defaults to retention;
    ledger history survives removals; the Q65 D1-export direction is the recorded backup
    direction, not proof of coordinated recovery; restore of records **and referenced R2
    objects** plus recovery from migration-failure cases must be exercised under Q65.
    Recovery remains **provisional** until Q65 closes.

## Rejected alternatives

- **Separately bound per-module D1 databases for the MVP** — rejected (dev-accepted input,
  forced by Q52): cross-module units of work could not be one batch; every cross-module write
  would claim forbidden atomicity or need an undesigned compensation path; cross-module FKs
  would be impossible. The named-requirement manifest mechanism is retained so a later split
  remains possible.
- **Drizzle Kit's own `migrate`/`push` as the production migration mechanism** — rejected:
  its journal/table conventions bypass the ledger, lock, namespacing and ordering
  requirements Q63 owns; it is at most a local-dev convenience.
- **Hand-written SQL migration artifacts or ad-hoc SQL data transformations** — rejected
  (Q25): artifacts come only from `drizzle-kit generate`; data transformations are Drizzle
  query code the runner executes.
- **Unprefixed table names or a module using the `core_` prefix** — rejected: namespace
  ownership is the collision rule; `core_` is reserved for core/ledger/lock/auth-base.
- **Applying a module's migrations in registration order instead of the Q36 topological
  order** — rejected: dependencies must exist before dependents' migrations run.
- **Ledger written separately from the migration batch** — rejected (Q52): step + ledger row
  commit together or not at all; otherwise retry cannot trust the ledger.
- **Time-based/absence-based lock without fencing** — rejected: on serverless there is no
  long-lived lock holder; an expired-lease stale writer must be detectable (token fencing),
  not merely assumed dead.
- **Data mutations hidden inside schema migrations or run as one unbounded batch** —
  rejected: declared `data` kind, chunked, resumable, per-chunk idempotent.
- **Silent drop of module data on removal** — rejected (Q37): removal retains data by
  default; dropping requires an empty table or a prior export.
- **Falling back to INTEGER or unprefixed IDs for Better Auth entities on adapter friction**
  — rejected (Q11): a failed compatibility check blocks auth work and is surfaced to the
  dev; the identity policy is locked.
- **Inventing Q40 wiring, Q65 backup mechanics or Q66/Q67 effects here** — rejected: those
  gates own their mechanisms; this record references their seams and requirements only.

## Non-decisions

This record selects **no** ID-generation internals (UUIDv7 vs ULID, prefix registration,
temporary/final client ids — Q40's), no composition/package/wiring/deploy-orchestration
mechanics (Q40), no backup format, retention duration, restore procedure or storage/vendor
mechanism (Q65), no external-effect or cache mechanics (Q66/Q67), and no product code (the
runner, ledger and lock are designed, not implemented — task 2.4 exercises the selected
tooling in an isolated harness). It reopens no locked decision (Q10/Q11/Q25/Q37/Q41/Q45/Q52).

## Consequences

- Modules and the Better Auth base schema migrate through one runner on one shared database;
  the ledger/lock/fencing design is the contract task 2.4's harness must exercise (RED tests
  for adapter persistence, upgrade/collision/replay/concurrency first).
- Q63 gate closure requires: task 2.4's real-D1 evidence (empty/existing-version,
  failure/retry/concurrent-deploy, removal-retention, and the executed-auth-flows
  prefixed-TEXT-ID inspection), the dev's acceptance of this ADR, and phase 7 reconciliation
  (7.2). None is granted by this record.
- A failed Better Auth prefixed-TEXT-ID compatibility check blocks auth work and is surfaced
  to the dev — it never silently changes the identity policy.
- MVP deployment remains gated on Q63 closure plus Q65/Q66 affected-work designs/evidence.

## Follow-on decisions needed

- **Task 2.4:** execute the designed mechanics against real D1 (harness at repo-root
  `spikes/q63_persistence-migrations/` per ADR-0015); record observed outputs in the evidence
  report; Modify this design/evidence with findings.
- **Q40:** id-service internals, unit-of-work participation contract, composition/install/
  deploy wiring (including how `pnpm migrate` is invoked at deploy).
- **Q65:** backup/retention/restore design consuming §13's requirements; restore of task 2.4
  fixtures in phase 4.
- **Phase 7 (7.2):** reconcile Q63 with the other foundational gates; then this ADR may move
  Proposed → Accepted → Closed per the canonical gate table.
