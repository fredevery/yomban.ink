# Yomban.ink: data and migrations

Status: Specification baseline derived from answered/recorded discovery. The decisions below — module-owned Drizzle schemas, canonical stored-type inference, mapped public DTOs, D1-only persistence with named requirements and no query-builder abstraction, prefixed sortable TEXT identifiers with no INTEGER primary keys, media-record ownership, and single-D1-prepared-statement-batch unit-of-work atomicity — are **locked**. The **client datastore capability and sync (Q70)** is additive: a browser-local SQLite store (the same SQLite dialect as D1) plus an op-log sync layer — it reopens no locked decision and adds no query-builder abstraction (see Amendment 001, [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)). The concrete database-placement and migration **mechanics** remain explicitly **deferred to spike plan 000 under Q63** and are marked as such; nothing beyond the locked decisions is promoted here. No implementation is selected.

## Purpose

This specification pins the platform's data layer and its trust boundary: where canonical stored types live and how they are derived, how modules declare what they persist, the identifier scheme that replaces INTEGER primary keys, and the exact atomicity a module may rely on when it writes. It deliberately separates what is **locked** from what Q63 must still resolve: shared-vs-separate D1 placement, migration namespace/collision rules, ordering, ledger/history and locking are Q63 outcomes, not decisions made here. [Q10, Q11, Q37, Q45, Q52, Q63]

## Locked decisions and constraints (non-negotiables)

- **Module-owned Drizzle schemas, locked.** Each module owns its tables and migrations; there is no unified core-controlled schema beyond a small Better Auth base schema. The core provides the migration runner, but iterating/logging over modules is not the full migration design — Q63 owns that. [Q22, Q25, Q37, Q63]
- **Canonical stored types are inferred, not authored as prose.** Each module declares its entities/schema in TypeScript; canonical **stored** types are inferred from those definitions in the module-owned schema layer, never written as prose or duplicated. ORM/schema/migrations use Drizzle. [Q10]
- **Public DTOs are deliberately derived/mapped from stored types.** Public DTOs in the framework-free module contracts are constructed/mapped from stored types, **not** unfiltered database rows or private DB-row exports. Runtime wire validation, route shapes, serialization and error conventions are explicitly owned by Q47, not this spec. [Q10, Q47, Q51]
- **D1-only for the MVP; no query-builder abstraction.** Manifests name the required D1 database/binding needs consumed (named, not datastore-agnostic). Drizzle remains the schema/query language; there is **no query-builder abstraction layer**. Additional datastore engines are future work under Q45's dialect constraint (any future engine must be SQLite-dialect-compatible or the abstraction/schema portability is revisited; no promise that arbitrary engines work unchanged). [Q10, Q45]
- **No INTEGER auto-increment primary keys; prefixed sortable TEXT id seam.** Every entity uses a **globally-unique, sortable, URL-safe TEXT id with an entity-type prefix** (e.g. `pg_<ulid|uuidv7>`), generated via one core **id-service seam**; modules declare their prefixes in the manifest. Independently generated identities avoid coordinating database sequences; INTEGER identities would require additional client/external mapping. Human slugs are secondary unique keys for externally routable content — identity is not addressability. [Q11, Q25, Q35]
- **Media records are module-owned; R2 is core infrastructure.** Media records are **not** core schema: an ordinary media module owns them, while the core provides R2 storage infrastructure and upload/transform contracts. [Q37, Q58, Q30]
- **Unit-of-work atomicity is one D1 database and one prepared-statement batch.** Statements run sequentially and a statement error rolls back the batch. This is **not** an arbitrary asynchronous JavaScript read/branch/write transaction, nor atomic across databases, R2, queues or cache purges. Cross-database/external effects require separately designed consistency/recovery (Q66), not a registry or D1 session masquerading as a transaction. [Q52]
- **Registry services contribute deferred operations to the same unit of work.** Registry-provided services (Q41) contribute deferred operations to the same single-D1 unit of work rather than independently committing; the participation contract and cross-module-rollback proof are owned by Q40 against Q52's batch atomicity. [Q36, Q41, Q52]

## Data ownership and the core/module boundary

**Core** owns the migration runner, a small Better Auth base schema (with its complete required auth entities/migration integration verified under Q63), and R2 storage infrastructure plus upload/transform contracts. It does **not** own feature media records. [Q37]

**A module** owns its tables and migrations, the schema definitions its stored types are inferred from, and the required D1 bindings named in its manifest. A module never directly accesses raw Cloudflare bindings or raw SQL outside Drizzle; Drizzle remains the query layer and there is no query-builder abstraction. [Q25, Q37, Q45]

## Identifier seam and ID policy

Identity is locked to the prefixed, sortable, URL-safe TEXT scheme with no INTEGER primary keys. The **remaining ID mechanics are Q40's** to settle — UUIDv7 vs ULID, prefix collision/registration, temporary vs final client-generated ids, and repeated-ID/different-payload duplicate-request behaviour (with Q66 supplying reusable idempotency semantics). A provisional client-generated ID path supports optimistic UI/offline; uniqueness alone does not define safe retry, ownership or repeated-ID/different-payload behaviour. Time-sortable IDs do not guarantee global event ordering. [Q11, Q40, Q66]

**Better Auth prefixed-TEXT-ID compatibility is a required Q63 evidence check.** The selected Drizzle/D1 adapter must support the platform's prefixed TEXT ids for core auth entities, including auth flows/required entities, before auth/pilot implementation begins. A failed check **blocks auth work and is surfaced to the dev**, never silently resolved by falling back to integer IDs or changing the identity policy. [Q11, Q63] → see [Security and identity](007_security-and-identity.md)

## Unit of work

The **core unit-of-work seam over D1 batch** is locked. Atomicity is exactly one D1 database and one prepared-statement batch; it is not arbitrary async JS read/branch/write, and it is **not** atomic across databases, R2, queues or cache purges. Modules declare transactional boundaries and use the core seam, never raw binding transactions. Registry services contribute deferred operations to the same unit of work (Q40 designs that participation contract and proves cross-module rollback). Read-dependent invariants require conditional SQL/constraints or an explicitly supported design, not a pre-read assumed atomic with later writes. D1 sessions/bookmarks provide consistency tools, not a substitute for multi-database transactions. Q63 placement must respect these limits; Q66 designs external/cross-database side effects and recovery; Q67 post-commit invalidation. [Q45, Q52, Q40, Q41, Q66, Q67]

## Drizzle and the migration execution path

Drizzle is the schema/query language and there is no query-builder abstraction. The raw-SQL prohibition (`no raw SQL outside Drizzle`) is **not** a reason to omit migrations: Drizzle-generated migration SQL still needs an approved execution path, explicitly owned by Q63 and consistent with Q25. Better Auth's Drizzle integration generates schema but leaves migration handling to the ORM/tooling. [Q25, Q45, Q63]

## Q63 — Database placement and migration mechanics (foundational gate, spike plan 000)

Q63 splits from Q45 now that D1-only is locked. Module-owned migrations plus the core runner (Q37) are chosen; the mechanics are not. It is **deferred from onboarding by explicit dev decision** and is a **foundational prerequisite spike** (Q19), owned in spike plan 000.

- **Owner, evidence and block: canonical gate table in the [Specification index](000_index.md#canonical-gate-table)** — coordinated with Q52 (single-D1/batch atomicity), Q25 (Drizzle-generated SQL execution path), Q40 (service participation/wiring) and Q65 (backup/recovery/retention).
- **Intended design scope (unresolved here):**
  - **shared D1 database vs separately bound databases** (selecting multiple bindings does not imply a distributed transaction);
  - **table/migration namespace and collision rules**;
  - **dependency ordering** — topological by the Q36 dependency graph;
  - **a persistent migration history (ledger) and its namespacing**;
  - **a lock for concurrent deploys**;
  - **partial failures and retries**;
  - **data-vs-schema migrations**;
  - **Better Auth schema ownership and migration integration** (its required base schema generation/integration);
  - **safe module removal** and retention of existing data (removal cannot silently discard existing data; Q65 supplies backup/recovery constraints);
  - execution of **Drizzle-generated SQL migration artifacts** consistent with Q25. [Q37, Q44, Q63, Q65]
- **Atomicity constraint:** the design respects Q52's single-database/prepared-statement-batch atomicity; no distributed transaction is implied by multiple bindings. [Q45, Q52, Q63]
- **Required evidence:** empty and existing-version migration runs; failure/retry/concurrent-deploy safety; and Better Auth with the **selected Drizzle/D1 adapter using core-generated prefixed TEXT ids** (Q11), including auth flows/required entities. A **failed compatibility check blocks auth work and is surfaced**, not silently resolved by integer IDs. [Q11, Q63]
- **Blocks:** see the canonical gate table — affected **schema/migration and Better Auth persistence implementation**, and foundational implementation start; module ownership/core runner and D1/Drizzle decisions remain locked. [Q19, Q37, Q63]

## Q70 — Client datastore capability and sync (foundational gate, additive)

Q70 is **additive**: it reopens no locked decision and adds no query-builder abstraction. The locked stance is unchanged — Drizzle remains the schema/query language (Q10/Q45), the server datastore is D1-only, and a custom dialect-neutral query language is rejected. The dev confirmed **SQLite is acceptable on both surfaces**, so a browser-local SQLite store shares one dialect with D1 and needs no abstraction. Owned in spike plan 000, coordinated with Q38/Q40 (capability seam and browser export), Q45/Q52 (dialect and unit of work), Q66 (idempotency/payload version) and Q67 (read-your-writes). The design is Q70's in the discovery record and [Amendment 001](../discovery/understanding-amendments-001.md); its material here:

- **Local store.** SQLite in a Web Worker over OPFS (persistent across reloads), driven by Drizzle's SQLite proxy driver, using the module's same `sqliteTable` schema. The core datastore capability binds the driver per environment (D1 server-side, browser SQLite client-side) so module code names no driver (Q38/Q40).
- **Record = aggregate root.** The sync/lock/revision/conflict unit is an aggregate root plus the rows one logical edit writes; child rows inherit the root's state and are never independently locked, versioned or synced. Modules declare their aggregate roots in the manifest (Q35/Q37).
- **Change-set sync unit.** One user action → one local SQLite transaction → one change-set → one D1 prepared-statement batch (Q52). A change-set is a `group_id` plus an ordered op list; `change_set_id` is the idempotency key (Q66); a failure rejects the whole set (no partial action); server-derived writes fold into the same batch.
- **Field-level conflict detection.** Per-field base value + rev; non-overlapping field edits auto-merge; conflicts surface as a three-way diff (mine/theirs/both); rejected ops are visible, never dropped.
- **Local durability.** The data write and its change-row are one local SQLite transaction; `navigator.storage.persist()` is requested (OPFS can be evicted) and authored (Class 1) data is separated from cache (Class 2).
- **Versioning.** Sync payloads carry the contract version with a current + N-1 acceptance window (Q44/Q49); local schema migrations ship with the app, versioned, one-way, with a pre-migration snapshot.

- **Owner, evidence and block: canonical gate table in the [Specification index](000_index.md#canonical-gate-table)** — coordinated with Q38/Q40/Q45/Q52/Q66/Q67. [Q38, Q40, Q45, Q52, Q66, Q67, Q70]
- **Does not reopen:** Q10/Q45 (Drizzle, no query-builder abstraction, D1-only server), Q11 (identity) or Q52 (batch atomicity); it extends them.

## Deferred design, owner and block summary

The authoritative gate inventory is Q19; **owner/evidence/block for every gate is the canonical gate table in the [Specification index](000_index.md#canonical-gate-table)**. Data-layer gate pointers:

- **Q63** (above) — the foundational migration/placement spike.
- **Q70** (above) — the additive client datastore + sync capability; reopens no locked decision. [Q70]
- **Q40** owns ID mechanics and the registry deferred-UOW participation contract on top of Q52's batch atomicity. [Q11, Q40, Q41, Q52]
- **Q45** left datastore-declaration locked to named D1 requirements; multiple bindings do not imply cross-database transactions. [Q45]
- **Q65/Q66** are affected-work gates → see [Operations and quality](008_operations-and-quality.md).
- **Q47** owns public-DTO wire mechanics over the mapped DTOs locked here. [Q10, Q47] → see [Clients and presentation](004_clients-and-presentation.md)

## MVP requirements (data scope)

- A generated project installs, migrates, runs, tests and deploys; the golden path is scaffold → create module → migrate → dev → deploy, with the core `migrate` command as the primary DB procedure (ordering/ledger/SQL execution per Q63). `upgrade` is separate platform package/code/contract work, not the migration command. [Q7, Q31, Q37, Q44, Q63]
- Module manifests declare owned entities/schema/migrations, ID prefix registration and named D1 requirements; conformance checks validate these in CLI/build/CI before registration. [Q35, Q37, Q45, Q61]
- Persistence is D1-only with module-owned Drizzle schemas and no query-builder abstraction; media records are owned by an ordinary media module over core R2 infrastructure. [Q25, Q37, Q45, Q58]
- All writes go through the core unit-of-work seam as one-D1 prepared-statement batches; registry services contribute deferred operations to that same batch. [Q41, Q52]
- MVP deployment is gated on Q63 foundational closure and on Q65/Q66 affected-work designs/evidence; Better Auth prefixed-TEXT-ID compatibility is demonstrated (or its failure surfaced) before auth/pilot work. [Q11, Q19, Q63, Q65, Q66]

## Verifiable acceptance criteria

- Stored types are inferred from module-owned Drizzle schema definitions; public DTOs are mapped/derived from them, not unfiltered database rows. [Q10, Q47, Q51]
- Identities are globally-unique, sortable, URL-safe TEXT ids with entity-type prefixes, generated via one core id-service seam; no INTEGER auto-increment PKs exist anywhere. [Q11, Q25]
- Migrations run through the core runner on module-owned schemas; Drizzle-generated SQL executes via the Q63-approved path once that gate closes. [Q25, Q37, Q63]
- A unit of work is atomic across exactly one D1 database and one prepared-statement batch; a statement error rolls back the batch, and no arbitrary-JS or cross-database/distributed atomicity is claimed. [Q52]
- Registry services contribute deferred operations to the same batch; cross-module rollback is proven per Q40. [Q41, Q52, Q40]
- Better Auth runs against prefixed TEXT ids under the selected Drizzle/D1 adapter (Q63 evidence); failure is surfaced, never worked around with integer IDs. [Q11, Q63]
- A client-local SQLite store shares the module's Drizzle SQLite schema and runs the same query code as the server; sync treats one user action as one change-set applied as exactly one D1 batch, with field-level conflict detection (Q70).

## Post-MVP scope and explicit non-goals

- No INTEGER PKs, no identity routed through addressability, and no alternative identity scheme in remainder scope. [Q11, Q18, Q25]
- No datastore-agnostic schema and no query-builder abstraction; the client-local SQLite store is the same SQLite dialect, not a new engine, and a custom dialect-neutral query language remains rejected (Amendment 001/Q70). Additional datastore engines are future work under Q45's dialect constraint. [Q10, Q45, Q70]
- No automatic cross-database, R2, queue or cache-purge atomicity; Q52 covers one D1 database/batch only, and Q66 designs external-effect recovery. [Q52, Q66]
- No migration mechanics decided by implication in this spec; placement/ordering/ledger/locking/removal are Q63 outcomes and are not pre-selected here. [Q19, Q63]

## Related specifications

- [Product scope and MVP](001_product-and-mvp.md)
- [Module platform contract](002_module-platform-contract.md)
- [Clients and presentation](004_clients-and-presentation.md)
- [Content and editing](005_content-and-editing.md)
- [CLI and distribution](006_cli-and-distribution.md)
- [Security and identity](007_security-and-identity.md)
- [Operations and quality](008_operations-and-quality.md)
- Spec index: [000_index.md](000_index.md)
- Historical discovery: [understanding.md](../discovery/understanding.md) (see Q10, Q11, Q19, Q22, Q25, Q35, Q37, Q40, Q41, Q45, Q47, Q51, Q52, Q58, Q63, Q65, Q66, Q70); amendment record: [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)
