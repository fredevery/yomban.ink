---
title: "Q70 — local-first datastore and sync mechanics (provisional design)"
created_session: "20261007_183604_4c9d75"
sessions: []
approved: false
---

# Q70 — Local-first datastore and sync mechanics (design)

> **Status: PROPOSED/PROVISIONAL design input for gate Q70 — NOT a closed gate.**
> **Dev acceptance: 2026-10-07 (session `20261007_191409_68fc38`) — the provisional design
> and §16 policies are dev-accepted (see evidence §6); acceptance is NOT adoption and this
> gate is NOT closed.**
> This is the task 3.4 deliverable
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.4.md`). It concretizes the
> Q70 confirmed shape (Amendment 001 §§1–8; `docs/discovery/understanding-amendments-001.md`)
> inside the LOCKED constraints: Drizzle remains the schema/query language with no
> query-builder abstraction (Q10/Q45 — not reopened), D1-only for the server datastore (Q45),
> unit-of-work atomicity = one D1 database + one prepared-statement batch (Q52), prefixed
> sortable URL-safe TEXT ids via the core id-service seam (Q11/Q40), frontend independence
> (Q22/Q25/Q61). The accompanying ADR is **Proposed, not accepted**
> (`docs/decisions/0009-local-first-datastore-and-sync.md`).
>
> **Evidence note:** the driver/tooling claims below are backed by executed read-only source
> verification (`evidence/q70_local-first-sync.md` §2, verified 2026-10-07). **No harness was
> built and no browser ran** — real-browser OPFS persistence, the worker/proxy bridge and the
> sync round trip are phase-005 task 5.1's deliverables and are listed as NOT RUN in evidence
> §4. Q70 is an **MVP deliverable** (Amendment 002); its implementation ships after this gate's
> proofs and closure.
>
> **Q40 boundary:** this design lives inside q40 §14's export boundary (browser-safe export;
> worker-hosted wasm-SQLite opened per session, never at module initialization, never a
> module-scope global) and consumes the datastore capability seam (Q38 C1), the id-service
> seam (Q11/q40 §11) and the unit-of-work participation contract (Q52/q40 §10) by reference.
> It designs none of them.

## 1. Scope and authority

Grounding sources:

- **`docs/discovery/understanding-amendments-001.md`** — the Q70 confirmed shape (§B Q70,
  §§1–8) and the Q10/Q11/Q35/Q37/Q38/Q40/Q45/Q52/Q54/Q66/Q67 amendments; the query-language
  deliberation outcome **NOT reopened** (§A1/A2). The design maps every §-numbered resolution
  to a section and proof case (§19).
- **`docs/discovery/understanding-amendments-002.md`** — Q71 privacy scope
  (platform-guardrailed, per-project-policied; erasure reaches on-device replicas) and Q70's
  MVP-deliverable status.
- **`docs/specs/003_data-and-migrations.md` §Q70** — the authoritative scope bullets; and
  **`docs/specs/000_index.md` §Canonical gate table** (Q70 row) — owner/evidence/block.
- **`docs/specs/004_clients-and-presentation.md`** — the store is a browser-safe
  framework-free export; sync/conflict **surfacing** is presentation (Q47 §9 owns the surface;
  this design owns the mechanics).
- **Prior phase inputs:** `designs/q40_composition-lifecycle.md` §2/§8/§10/§14 (export
  boundary, invocation-scoped lifetime, UOW contract, browser-store session lifetime);
  `designs/q47_client-host-contracts.md` §3/§9/§14 (typed client, sync/conflict surfacing
  contract, sync-status surface); `designs/q63_persistence-migrations.md` (server-side
  Drizzle/D1/migration mechanics this sync rides); `designs/q46_public-starter.md` §7 (starter
  consumes the seam; mechanics are this task's).
- **Executed tooling verification:** `evidence/q70_local-first-sync.md` §2 —
  `@sqlite.org/sqlite-wasm`, Drizzle `sqlite-proxy`, SQLite wasm OPFS/VFS/WAL documentation,
  MDN storage/persistence docs, verified 2026-10-07 against live sources.

## 2. Browser SQLite worker/OPFS driver and the async Drizzle proxy seam

### 2.1 VFS selection (evidence-backed comparison)

| Option | Persistence | Worker requirement | Browser floor | Concurrency | Verdict |
|---|---|---|---|---|---|
| `opfs` VFS | OPFS | Dedicated worker + **COOP/COEP headers** (SharedArrayBuffer) | Safari **≥ 17** (Safari < 17 incompatible); Chromium ~mid-2022+; Firefox 111+ | Multi-tab/multi-worker locking with retry | Alternative — rejected as default: COOP/COEP narrows embedding (Q68 tension) and drops Safari 16.x |
| `opfs-sahpool` VFS | OPFS | Dedicated worker, **no COOP/COEP** | "All major browsers since March 2023" (Safari 16.4+) | **No client-transparent concurrency**; single connection per DB; multiple sandboxed instances under different names | **SELECTED** (default) |
| `opfs-wl` VFS (3.53.0+) | OPFS | Worker + `Atomics.waitAsync()` (widespread only since 2025) | Newest browsers only | Web-Locks-based | Alternative — not portable enough for MVP |
| WASMFS | OPFS | Custom non-canonical build | — | No concurrency | Rejected: unsupported, custom build |
| kvvfs (localStorage) | Storage object | Main thread only | — | — | Rejected: not worker/OPFS, not multi-record |
| sql.js / in-memory | None | — | — | — | Rejected (locked, Amendment 001 §1): does not survive reload |

### 2.2 Selected driver shape (provisional)

**`@sqlite.org/sqlite-wasm` (npm, latest 3.53.4-build2 at verification; SQLite 3.53.4) loaded
in a dedicated module Web Worker**, using the `opfs-sahpool` VFS via
`sqlite3.installOpfsSAHPoolVfs()` and the OO1 API (`sqlite3.oo1.DB`). The Worker1/Promiser
APIs are deprecated upstream (2026-04-15, README) and are **not** used; the platform owns a
small typed request/response bridge over `postMessage` instead.

**Single-connection discipline (spike-owned storage-isolation policy, evidence-driven):** one
OO1 connection per OPFS database file per worker. The sahpool VFS has **no client-transparent
multi-connection support and a latent same-thread multi-connection locking bug prior to
SQLite 3.54** — the current release is 3.53.4 — so the worker serializes every request against
one connection. Multi-tab access is a policy question, not a VFS feature: one tab owns the
worker (acquired via Web Locks); other tabs open **read-only against their own Class 2 cache
view** and display a "taken over in another tab" state. The alternative (the `opfs` VFS's
transparent multi-tab locking) is recorded for phase-005 reconciliation if tab-handoff proves
intolerable — it costs COOP/COEP headers and Safari 16.x support.

**Node caveat recorded:** the npm package supports Node only in-memory — irrelevant to the
browser target but recorded so no harness attempts Node OPFS persistence.

### 2.3 The async Drizzle proxy seam (same schema, same query code, no fork)

- **Main thread:** `drizzle` from `drizzle-orm/sqlite-proxy` — the documented generic async
  seam: `drizzle(callback)` or `drizzle(callback, batchCallback, config)` where the callback is
  `(sql: string, params: unknown[], method: 'run' | 'all' | 'values' | 'get') => Promise<{ rows: unknown[] }>`
  (verified against drizzle-orm 0.45.3's published type definitions and docs, evidence §2).
- **Bridge:** the callback serializes the built SQL + params over `postMessage` to the SQLite
  worker, which executes on the OO1 connection and returns rows. Drizzle's `transaction()`
  emits `begin`/`commit`/`rollback` (nested: `savepoint`/`release`/`rollback to`) **through
  the same callback** (verified in the published session code) — so a local transaction is a
  real SQLite transaction on the worker's connection, not an emulation. `batch()` maps to the
  optional batch callback, executed as one worker-side transaction.
- **Same schema, no fork:** modules import the ONE `sqliteTable` schema package (Q10). Server
  code binds it via `drizzle-orm/d1` over the D1 binding; browser code binds the same schema
  via the sqlite-proxy seam. **No module names a driver** — the core datastore capability seam
  (Q38 C1) returns the environment-bound Drizzle instance. The schema package's **browser-safe
  export** carries the table definitions and query builders only (no `d1` import, no Node API)
  so the browser bundle tree-shakes the server driver (boundary lint per Q61).
- **Strict typing:** the bridge callback is fully typed; no `any`, no `export *` —
  illustrative shape:

  ```ts
  import { drizzle, type AsyncRemoteCallback } from 'drizzle-orm/sqlite-proxy';
  import type { PostMessageBridge } from '@yomban-ink/core-client/bridge';

  const callback: AsyncRemoteCallback = async (sql, params, method) =>
    bridge.exec({ sql, params, method }); // worker replies with { rows: unknown[] }
  ```

- **No new query language:** everything above is Drizzle query code already written for the
  server (Amendment 001 §A1); the seam adds a driver binding, not an abstraction layer.

## 3. Session lifecycle and Class 1 vs Class 2 physical storage separation

- **Session lifecycle (q40 §14 boundary):** the worker + wasm-SQLite instance is opened
  **per session** — on first consumer-seam use in a page session, never at module
  initialization, never cached at module scope. Session end (page unload or explicit close)
  closes the OO1 connections, checkpoints/finalizes the sahpool handles and terminates the
  worker. OPFS files persist across sessions by construction (verified: OPFS is
  origin-partitioned persistent storage; sync access handles are worker-only — MDN).
- **Physical separation — two sandboxed sahpool instances under different names** (verified
  supported: "multiple instances under different names, each sandboxed from one another"):
  - **Class 1 — authored/owned:** `class1_authored.sqlite3`. `navigator.storage.persist()`
    requested at session start; eviction response per §16's policy; this database holds
    working-set records, the op-log, lease/revision metadata and tombstones. Synced;
    permanent local presence for owned data.
  - **Class 2 — referenced read-only cache:** `class2_cache.sqlite3`. Pull-cache with a
    versioned pointer; **evictable without notice**; rebuilt by re-pull. Never holds the only
    copy of anything.
- **Eviction guardrails (Amendment 001 §8, "OPFS eviction" bullet):** `navigator.storage.estimate()` monitored
  per session; when quota pressure is detected or `persist()` is denied, the app **warns and
  gates destructive actions while unsynced change-sets exist** (export offered) — never
  silently proceeds. Class 1 data is synced promptly so a worst-case eviction loses only
  already-pushed history (rebuildable from the remote).
- **Incognito/guest modes:** storage may be unavailable or non-persistent (documented
  browser behaviour, evidence §2) — the seam degrades to a visible "session-only" mode with
  sync-on-every-action, never to a silent in-memory fallback pretending persistence.

## 4. Aggregate roots, children and multi-root action boundaries

- **Record = aggregate root + child rows one logical edit writes** (Amendment 001 §3):
  the manifest declares each module's aggregate roots and the child tables riding under each
  (Q35/Q37 amendment). Locks, revisions, tombstones and conflict state attach to the **root**;
  child rows inherit the root's state and are never independently locked, versioned or synced.
- **Change rows carry `root_id`;** child-row ops are ordered inside the change-set so FKs
  validate on local application (children after parents; deletes reversed). The local
  transaction applies root + children together.
- **Multi-root action boundary:** a user action touching **two roots is two records** — two
  leases, two change-sets (Amendment 001 §3, MVP lock granularity is per record). The
  platform's action dispatcher splits at declared root boundaries; there is **no cross-root
  local transaction and no cross-set atomicity claim on the server** (Q52: one batch per
  set). If the second set is rejected after the first applied, the rejected set lands in the
  visible rejected bucket (§7) and the user resolves — compensation is designed as
  user-visible state, never as silent partial application. Modules that need cross-root
  atomicity must model one root instead (conformance guidance, Q61).
- **Purely-local records** (created offline, never pushed) have no lease, no server rev and
  no conflict surface until first push; their ids are final-at-creation client ids
  (q40 §11, Amendment 001 Q11).

## 5. Local mutation + change-row in one transaction; WAL feasibility

- **One user action → one local SQLite transaction** (Amendment 001 §8, "one local
  transaction" bullet): the data writes
  (root + children) and the change-row(s) commit atomically via Drizzle's
  `transaction()` (real `BEGIN`/`COMMIT` on the worker connection, §2.3). All mutations go
  through the single datastore-capability write path — no second write path exists to
  bypass it (Q38 C1). A forced failure leaves **neither half** persisted (proven in 5.1's
  harness; not yet run).
- **WAL feasibility (verified, evidence §2):** since SQLite 3.47 WAL is possible on
  OPFS-hosted databases **only with `pragma locking_mode=exclusive` activated immediately
  after open**, and it provides **no concurrency benefit** in this environment (the WASM
  build lacks shared-memory APIs). The design adopts: **WAL with exclusive locking** —
  acceptable because the single-connection worker is the only writer (§2.2). The
  atomicity guarantee does not depend on WAL (rollback-journal mode is equally atomic);
  WAL's benefit here is potential sahpool read performance. If the phase-005 harness
  observes WAL friction on sahpool, the downgrade to default journal mode is a
  **dev reconciliation decision, not an in-place executor authority** (like every §16
  policy row); atomicity is unaffected either way. Recorded so the Amendment-001 "WAL mode"
  bullet is never read as a correctness requirement.
- **Reconcile safety net (optional, Amendment 001 §8, "one local transaction" bullet):** a startup reconciliation pass
  compares the op-log against Class 1 data (change-rows without data = rolled-back crash
  artefacts impossible under ACID; data without change-rows = a pre-op-log legacy row →
  rebuild change-row or quarantine + surface). Designed as a safety net, not a correctness
  dependency.

## 6. Change-set envelope, ordering, grouping, idempotency

- **Envelope (one per user action):**

  ```ts
  interface ChangeSet {
    change_set_id: string;      // client-generated prefixed TEXT id — THE idempotency key (Q66)
    installation_id: string;    // client installation identity
    local_seq: number;          // monotonic per installation
    schema_version: number;     // sync payload contract version (§12)
    root_id: string;            // aggregate root this set touches
    base_rev: number;           // root revision the client based this action on
    ops: ChangeOp[];            // ordered, FK-valid local application order
  }
  ```

  **Envelope-field reconciliation with the source amendment:** Amendment 001 §B §4 defines
  a change-set as "a `group_id` plus an ordered op list" — the envelope's
  `change_set_id` **is that `group_id`** (one identifier, two names in the sources; this
  design uses `change_set_id` throughout because it carries the Q66 idempotency duty).
  `ChangeOp` shape (each op's `op_id` on the client-id path per the Amendment 001 Q11
  amendment, plus entity/table, mutation kind, field values and base/rev data) is sketched
  here only as a responsibility, not fixed: the exact op field list lands with the 5.1
  harness and Q66's idempotency design, on the same TEXT-id rules (Q11).

- **Ordering:** within a set, client's FK-valid application order; **across sets, per-client
  `local_seq` order.** No global order exists or is needed — records are single-writer per
  lease and a client cannot reference an id it has not seen (Amendment 001 §4). Sets from
  different installations converge per root through conflict resolution (§8), not ordering.
- **Grouping:** one user action = one change-set (per-action atomicity, never cross-action);
  the server may coalesce a set's ops into its batch but never splits one set across batches.
- **Idempotency:** `change_set_id` is the idempotency key (Amendment 001 Q66): same id +
  same payload → dedupe (acknowledge, apply nothing); same id + **different** payload →
  client error surfaced (never silently ignored). Re-push after timeout/network failure is
  therefore safe.

## 7. Server application: one D1 batch, server-derived writes, fail-stop, rejected bucket

- **One change-set → one D1 prepared-statement batch** (Q52; Amendment 001 Q52/Q66): the
  sync endpoint applies the set's ops **plus its bookkeeping rows** (change-set record, rev
  bump, lease touch) as ONE batch on the shared D1 database (ADR-0005 placement). Any
  statement failure rolls back the whole set — **no partial action**.
- **Server-derived writes** (rules-engine recompute, derived columns, registry services
  contributing via the UOW contract, q40 §10) **fold into the same batch** and emit their own
  change entries for pull — downstream clients learn derived effects through the normal pull
  path, not out-of-band.
- **Authorization failure → the set is rejected, not applied** (whole-set semantics):
  rejected sets return with a reason and land in the client's **visible rejected bucket**
  (Amendment 001 §5 / §8 "stranded bucket" bullet) — never silently dropped, never partially applied. The bucket
  surfaces per Q47 §9's surfacing contract (rejected state per change-set).
- **Fail-stop per push, per client (Amendment 001 §4):** a push round trips the client's
  pending sets in `local_seq` order and **stops at the first failure** — later sets wait (they
  may depend on the failed set's records). Retry semantics ride §6's idempotency.
- **Lease-superseded / offline-revocation detection:** if a lease was expired-and-stolen or
  revoked while the client was offline, the rejected/stale ops route to the stranded bucket
  with the reason (Amendment 001 §8 "stranded bucket" bullet); the record drops to read-only pending user resolution.

## 8. Per-field base/rev three-way conflict resolution

- **Per-field base:** every field edit records the **base** — the field's value plus the
  root revision it was read at. On push, conflict exists on a field iff **the server's current
  value differs from the client's base AND the client changed that field**
  (Amendment 001 §5). Non-overlapping field edits auto-merge (each side's changed fields
  apply; the root rev advances).
- **Server rev model (provisional):** a monotonic per-root `rev` on the server; a field's
  last-touching rev is derivable from change history. The per-field base is the pair
  `(value, rev_at_read)`; the three-way diff presents **base / mine / theirs**.
- **Resolution:** per-field or bulk — **mine / theirs / both-fork** (fork writes both values
  into user-visible fork slots, Amendment 001 §5/D4). No CRDT, no automatic text merge
  (locked non-goal). Resolution is itself a user action → one new change-set (§6).
- **Surfacing:** conflicts are data, presentation is Q47's (§9 typed sync-status + conflict
  surfaces). Rejected/stale ops join the visible bucket (§7).

## 9. Server-clock advisory presence leases

**Advisory only — never an atomicity claim under Q52** (Amendment 001 Q52/Q70 §6). A lease
says "someone is actively editing"; it does not gate transactions.

- **Eligibility:** a record is leasable once it **exists on the remote** (shared/remote) —
  lock eligibility is **decoupled from publish state** (Amendment 001 Q54). Purely-local
  records never lock. The client tracks **remote-status** (local-only vs shared) — **record
  remote-status, never publish state**, as the lock-eligibility input.
- **Lifecycle:** acquire on open of an actively-edited record; heartbeat ≈ TTL/3; release on
  close; expire after TTL measured on the **server clock** (client clocks never trusted).
  Acquire/renew piggyback on the sync round trip (§11) — no separate lease service.
- **Lease TTL (spike-owned policy):** **TTL = 120 s**, heartbeat 40 s, renewal piggybacked
  per sync poll. Rationale: long enough to survive a slow poll cycle + jitter, short enough
  that a crashed tab frees the record within ~2 min. Tunable at phase-005 with observed
  round-trip data.
- **Steal policy (Amendment 001 §6):** expired lease → grant to the requester. **Live lease
  to a different user → no steal**: requester gets read-only + "who is editing" + optional
  request-access. **Live lease to the same user on another device → takeover reassigns** to
  the new device; the old device demotes to read-only on its next poll (lease record carries
  a takeover epoch the old device detects).
- **Offline provisional:** offline edits are **unlocked-provisional** — no lease is claimed,
  edits are marked provisional and are conflict-checked on reconnect (§8). Provisional state
  is visible, never silently promoted.
- **Server enforcement:** the lease table (`core_lease`-class, core-owned like other sync
  bookkeeping) is checked inside the change-set application batch — a set whose root is
  actively leased by a different user is rejected to the bucket (§7). This is authorization
  shaping, not atomicity.

## 10. Server-authoritative working sets

- **Classes (Amendment 001 §7):** **Class 1 authored/owned** — bidirectional, permanent
  local (§3's `class1_authored.sqlite3`); **Class 2 referenced read-only** — pull-cache,
  versioned pointer, evictable (`class2_cache.sqlite3`); **Class 3 remote-only** — auth,
  config, listings: never stored locally, read through the typed client.
- **Membership:** a record enters the working set when the user owns it, it belongs to the
  user's declared scope, or the user adopts it. The **subscription is server-authoritative**
  — the pull endpoint filters by the caller's permissions (Q50/007); a client may only pull
  what it is permitted to see. The client never widens its own scope.
- **The whole remote is never replicated** (non-goal); Class 2 caches only what the working
  set references.

## 11. Transport: poll-on-focus / interval / reconnect — push, pull, renew

- **MVP transport is poll-based** (Amendment 001 §7; Q41: no event bus, no unsolicited push).
  One round trip per cycle does three things: **push** pending change-sets in `local_seq`
  order (fail-stop per §7), **pull** working-set changes since the client's watermark
  (server-authoritative filter, §10), **renew** held leases (§9).
- **Poll cadence (spike-owned policy):** poll **immediately on focus/visibility regain**;
  **every 30 s while the document is visible**; **no timers while hidden** (except one
  immediate poll on visibility return); **immediately on reconnect** (`online` event or
  first successful fetch after a failure). Rationale: 30 s bounds staleness within the
  advisory-lease world (120 s TTL) while staying well under battery/rate budgets; focus/reconnect
  events cover the human-perceived cases. WebSocket/SSE remains a later upgrade (Q41),
  not an MVP mechanism.
- **Remote-apply pause per leased record (Amendment 001 §8 "pause remote-apply" bullet):** while this client holds an
  **active lease** on a record, incoming remote changes for that root are **held, not
  applied** (they would clobber the in-progress edit); the client queues and applies them at
  release/takeover, conflict-checked per §8. **Only that record pauses — the sync loop keeps
  running for everything else.** Records whose lease is held by another user apply remote
  changes normally (this client is read-only on them).
- **Alerts (narrow, Amendment 001 §7):** silent apply for records the user is not editing;
  escalate only on (a) genuine conflict (§8) or (b) explicitly-watched records; plus the
  **global sync-status indicator** (pending/pushed/acknowledged/rejected/offline states —
  Q47 §9's typed surface). No notification channel exists in MVP.

## 12. Payload versions: current + N-1; too-old → read-only/export

- **Sync payloads carry `schema_version`** (the change-set envelope field, §6); the server
  accepts **current and N-1 majors** (mirrors Q44/Q49's contract window; Amendment 001 §8
  "schema/payload drift" bullet).
  Additive-only change within a contract major; tolerant readers on the client for server
  payloads one major behind.
- **Client too old** (server current > client version + 1, or a payload the client cannot
  read): the client enters **read-only + export** — it stops pushing, offers a local export
  (§13 snapshot format), and prompts refresh. Never a silent data loss path.
- **Server-side:** change-set envelopes older than N-1 are rejected with a version error
  (surfaced to the bucket with reason), never coerced.

## 13. Local schema migration: one-way, with pre-migration snapshot

- **Local schema versioning policy (spike-owned):** the local databases carry their own
  `schema_version` in a local metadata table; migrations are **generated by `drizzle-kit
  generate` from the same `sqliteTable` schema** (same artifact source as the server's, Q63
  §12 — one source, two execution paths), shipped inside the app bundle (no server round
  trip needed to migrate a local store), **one-way/forward-only** (no downgrades; a
  downgrade = wipe + re-pull/re-export), and executed by a small core-owned local runner on
  session open before the seam returns the Drizzle instance.
- **Pre-migration snapshot (Amendment 001 §8 "schema/payload drift" bullet):** before applying a migration, the runner
  snapshots each affected database (`sqlite3_js_export`-class byte export into OPFS +
  `navigator.storage` hygiene), keeping the store **rebuildable**. Snapshot retention: the
  latest one per database (previous is deleted on successful migration commit) — bounded
  storage cost, sufficient rollback.
- **Failure during local migration:** the transactional migration + snapshot leaves the
  previous version intact; the seam surfaces the failure read-only with export rather than
  opening a half-migrated store.

## 14. Tombstones: retention, all-replica ACK GC, explicit purge

- **Deletes are tombstones** (Amendment 001 §8 "tombstones" bullet): a delete writes a tombstone row on the
  root (children inherit) — locally and via the change-set on the server — so offline
  replicas converge on the deletion instead of resurrecting rows.
- **GC policy (spike-owned):** a tombstone is hard-deleted only when **both**: (a) its age
  exceeds the retention window — **30 days** (spike policy; tunable) — AND (b) **all known
  replicas have acknowledged** it (each installation's pull ACKs a per-installation
  watermark; a tombstone is GC-eligible when every installation that has ever synced the
  record's scope is past it). The GC is a **manifest-declared cron job** (Q56) hard-deleting
  eligible tombstones server-side; Class 1 replicas purge their own acknowledged tombstones
  locally at the same watermark.
- **Explicit purge overrides:** a user (or a DSR erasure, §15) may **purge immediately** —
  the tombstone and its history are hard-deleted out of window; offline replicas receive the
  purge directive on next contact (§15). Purge is explicit and logged, never automatic.

## 15. Coupling: Q65 erasure/recovery and Q66/Q67 inputs

- **Q65 (erasure reaches on-device replicas — Amendment 002/Q71):** the erasure primitive
  Q65 designs must (a) delete server-side (record + tombstone + history, out-of-window purge
  §14), (b) emit an **erasure directive** that propagates through the sync pull and
  hard-deletes the record from Class 1 local storage — **a DSR is not satisfied by
  server-side deletion alone**; (c) handle the offline client: the directive persists until
  acknowledged (all-replica-ack machinery, §14) so a client that was offline at erasure time
  purges on next contact. This design supplies the local-side mechanics (tombstone/purge/
  directive-ack); the erasure/retention policy interface is Q65's. Q65's backup/restore:
  the §13 snapshot + export path is the local-store input to Q65's coordinated restore.
- **Q66 (idempotency/payload version):** `change_set_id` idempotency (§6), payload
  `schema_version` current + N-1 (§12), and the sync op-log as the concretized form of Q66's
  "D1 transactional outbox" evaluation candidate (Amendment 001 Q66). Q66 owns post-commit
  effect recovery generally; this design claims nothing beyond the single batch (Q52).
- **Q67 (read-your-writes/propagation):** local-first read-your-writes is
  **local-by-construction** (writes land in Class 1 before the UI proceeds); the remote pull
  is poll-based and scoped to the server-authoritative working set (§10/§11). Q67's public
  propagation/preview/staleness rules continue to govern the remote surface and are
  untouched here.

## 16. Spike-owned explicit policies (proposed values, stated — not left open)

| Policy | Value | Rationale / revisit trigger |
|---|---|---|
| Lease TTL | 120 s; heartbeat 40 s (TTL/3) | Survives poll cycle + jitter; crashed tab frees in ~2 min. Revisit with 5.1 round-trip data |
| Poll cadence | On focus; 30 s while visible; none hidden; on reconnect | Bounds staleness under the TTL; battery/rate budget. Revisit if sync-status complaints surface |
| Schema versioning | `schema_version` on payloads + local stores; current + N-1 majors; one-way local migrations with snapshot; too-old → read-only/export | Mirrors Q44/Q49; never a silent loss path |
| Storage isolation | Two sandboxed sahpool instances (`class1_authored`, `class2_cache`); single connection per DB per worker; Web Locks tab ownership; persist() + estimate() guardrails | Evidence-driven (sahpool properties); revisit if multi-tab editing demand emerges (opfs VFS + COOP/COEP alternative recorded) |
| Tombstone retention | 30 days AND all-replica ACK; manifest-declared cron GC; explicit purge overrides | Bounded storage; DSR-safe (§15) |
| WAL | WAL + `locking_mode=exclusive`, acceptable under single-writer; atomicity does not depend on it | Verified WAL/OPFS constraints; any sahpool downgrade routes through dev reconciliation (5.1) |

## 17. Non-goals (task execution notes; locked)

- **No new query language** — Drizzle is the only schema/query language; the seam adds no
  abstraction above it (Amendment 001 §A1).
- **No CRDT / event bus / realtime coordination** — conflicts surface to the user; no
  WebSocket/SSE in MVP (Q41; Amendment 001 §7).
- **No native-wrapper MVP delivery** — Tauri/Capacitor filesystem wrappers are post-MVP
  backlog (Q12/Q46); browser evidence is not substituted.
- **No whole-remote replica** — the working set is server-authoritative and bounded (§10).
- **No group locks** — per-record (aggregate-root) locks only for MVP (Amendment 001 §3).
- **No publish-state coupling** — lock eligibility rides remote-status (§9), amending Q54's
  scope per Amendment 001.

## 18. What this design does not decide

- **No Q40 mechanics:** composition roots, package layout, install specifiers — consumed by
  reference (§2.3's export shape rides q40 §2's browser-safe class).
- **No Q47 presentation:** which component renders sync-status/conflict/lease surfaces —
  Q47 §9 owns surfacing; this design produces the typed state only.
- **No Q65 erasure/retention policy or backup format** — requirements named (§15); Q65 owns
  the mechanism.
- **No Q66/Q67 mechanisms** beyond the named idempotency/transport couplings (§15).
- **No server lease/cluster table DDL finalization:** the `core_lease`-class table shape is
  provisional; exact DDL lands with the phase-005 harness and Q63-style migration artifacts.
- **No product code:** the worker, bridge, sync client and lease logic are designed; task
  5.1 exercises them in an isolated harness (real browser + real D1). Nothing is implemented
  in this task.

## 19. Requirement matrix — Amendment 001 §§1–8 + Amendment 002 → design sections and proof cases

Proof cases are the phase-005 task 5.1 harness checks (real browser OPFS + real D1) plus
phase-004's affected-work designs where noted. "NOT RUN" here = designed, proven later; no
claim in this design is executed evidence.

| Amendment 001 § | Resolution | Design § | Proof case (owner) |
|---|---|---|---|
| §1 Local store | sqlite-wasm worker + sahpool + Drizzle sqlite-proxy; survives reload; sql.js excluded | §2, §2.1, §2.3 | Reload/reopen persistence on real OPFS; shared-schema query run on D1 AND browser store (5.1) |
| §2 Capability seam | browser-safe export; driver bound by core seam; per-session lifetime | §2.3, §3 | Browser-export boundary lint; no binding I/O at init (5.1/6.x) |
| §3 Record/aggregate root | manifest-declared roots; child inheritance; multi-root = two records/two leases/two sets | §4 | Root/child change-set shape + split-boundary case (5.1) |
| §4 Change-set sync unit | envelope/order/grouping/idempotency; one set = one D1 batch; fail-stop | §6, §7 | Re-push dedupe; set-failure rollback with neither half; server-derived write in-batch (5.1) |
| §5 Conflict detection | per-field base/rev; auto-merge; three-way diff; mine/theirs/both-fork; rejected bucket | §8, §7 | Non-overlap merge; overlap conflict; fork outcome; bucket visibility (5.1) |
| §6 Presence leases | advisory; TTL/heartbeat/renewal; no-steal/takeover; offline provisional; remote-status not publish state | §9 | TTL expiry steal; same-user takeover demotion; rejected cross-user set (5.1) |
| §7 Working set + transport | Class 1/2/3; server-authoritative pull; poll focus/interval/reconnect push+pull+renew; narrow alerts; global status | §10, §11, §3 | Permission-filtered pull; remote-apply pause; visibility-driven cadence (5.1) |
| §8 "one local transaction" | data + change-row atomic; single write path; WAL; reconcile net | §5 | Forced-failure atomicity trace on real store (5.1) |
| §8 "per-action atomicity" | one action = one change-set | §6, §7 | (with the one-local-transaction case) |
| §8 "tombstones" | retention + all-replica ACK + cron; explicit purge | §14 | GC eligibility matrix incl. offline replica (5.1 + Q56 cron) |
| §8 "OPFS eviction" | persist()/estimate(); physical separation; sync promptly; gate destructive actions | §3, §16 | persist-denied/quota warning path (5.1) |
| §8 "schema/payload drift" | version-tagged payloads; current + N-1; too-old read-only/export; one-way local migration + snapshot | §12, §13 | Version rejection + too-old read-only; migration snapshot/rollback (5.1) |
| §8 "stranded bucket" | lease-superseded/offline-revocation routing | §7, §9 | Offline-revocation then re-push → bucket (5.1) |
| §8 "pause remote-apply" | per-leased-record hold; loop continues | §11 | Paused record + concurrent other-record apply (5.1) |
| Amendment 002 (Q71 privacy) | erasure reaches Class 1; purge + directive-ack mechanics supplied | §14, §15 | Erasure directive on offline client (Q65 design + 5.1) |
| Amendment 002 (MVP status) | design closes via this gate; implementation ships in MVP | — | Phased per canonical gate table (closure at 7.x) |

**Locked-decision respect check:** Q10/Q45 (Drizzle, no abstraction, D1-only server) — §2.3;
Q11 (prefixed TEXT ids, final-at-creation) — §4/§6; Q52 (one D1 batch; leases advisory) —
§7/§9; frontend independence (browser-safe export, no presentation dependency) — §2.3/Q61.
None reopened.
