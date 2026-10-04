---
title: Understanding amendments 001 — Yomban.ink (local-first client datastore + sync)
created_session: "20261004_204211"
sessions: []
approved: false
amends: understanding.md
---

# Understanding amendments 001

> Amendment record for `docs/discovery/understanding.md`. Captures the outcome of the
> custom-query-language / offline-first deliberation and the resulting new platform
> capability: a **local-first client datastore with sync to the remote D1 store**.
>
> It amends Q10, Q11, Q35, Q37, Q38, Q40, Q45, Q52, Q54, Q66 and Q67, and adds **Q70**.
> **No locked decision is reopened.** The new capability lands additively inside the
> existing gate inventory (Q38/Q40/Q45/Q52/Q66/Q67). Where this amendment and the base
> file differ, this amendment governs for the amended scope; the base file remains
> authoritative for everything else.
>
> Status machine: OPEN / ANSWERED / DEFAULTED / DEFERRED, matching the base file.

## A. Query-language deliberation — outcome: NOT reopened

### A1 — Was the custom query language (dialect-neutral query layer) reopened?

- Context: The dev proposed re-visiting a custom query language so the frontend can query its datastore the same way as the backend — schema and queries written once and shared — and so the platform is decoupled from Drizzle/a given datastore engine. Q10/Q45 had locked the opposite stance: Drizzle remains the schema/query language and there is **no query-builder abstraction** layer; the MVP is D1-only, with any future engine required to be SQLite-dialect-compatible or the abstraction/schema portability revisited.
- Agent default: Reopen Q10/Q45 and introduce a dialect-neutral query AST compiled to both a local (Postgres/PGLite) and a remote (SQLite/D1) dialect.
- Answer: **Not reopened.** The dev confirmed **SQLite is acceptable on both sides**, which removes the dialect split that was the only real justification for a query language. With D1 (server) and a browser SQLite store (client) sharing one dialect, the same `sqliteTable` Drizzle schema and the same Drizzle query code run on both surfaces — the "write once, share" goal is met by the existing locked decision (modules use Drizzle) plus a driver seam, with no new abstraction. A query language would be an abstraction *above* Drizzle — exactly what Q10/Q45 rejected — and would add nothing. Q10 and Q45 therefore remain **locked and unamended in their stance**; the additive client capability is recorded in Q70. Known cost accepted: CriticalSheets moves from PGLite (Postgres dialect) to a SQLite-dialect store to achieve shared schema; keeping PGLite would forfeit the shared-schema benefit.
[STATUS: ANSWERED]

### A2 — Does the browser-local store violate the D1-only / SQLite-dialect locks?

- Context: Q45 locks D1-only for the MVP server datastore and requires any future datastore engine to be SQLite-dialect-compatible. Q52 locks unit-of-work atomicity to one D1 database and one prepared-statement batch.
- Agent default: Treat a client-local store as a new server datastore engine and reopen Q45.
- Answer: **No reopening required.** The MVP lock is about the *server* datastore and named D1 bindings; a browser-local store is a client capability, not a server binding. Browser SQLite satisfies Q45's SQLite-dialect constraint. Local writes sit outside Q52's D1 batch by definition, so Q52 is unaffected. The capability is additive.
[STATUS: ANSWERED]

## B. New capability — Q70: local-first client datastore and sync

### Q70 — Local-first client datastore and sync capability (foundational spike)

- Context: The platform is server-first (Workers + D1). CriticalSheets (the pilot) is local-first (ADR-0001: data on-device, offline-first, no server in v1; backlog item 3 "remote linking server"). The dev wants a platform capability so a consuming app's frontend writes to a local/browser datastore that syncs with the remote, enabling offline capability and shared schema/query code across frontend and backend. Touches Q10/Q11/Q35/Q37/Q38/Q40/Q45/Q52/Q66/Q67 and the content lock-eligibility stance (Q54).
- Agent default: A core datastore capability that binds a Drizzle instance to the environment's SQLite driver (D1 server-side, browser SQLite client-side) plus a sync layer (op-log outbox, presence leases, field-level conflict surfacing).
- Answer: **New foundational capability; design is sketched below and is DEFERRED as a spike (one ADR plus a concrete design and verification evidence), coordinated with Q38/Q40 (capability seam and browser export), Q45/Q52 (dialect and unit-of-work), Q66 (idempotency/payload version) and Q67 (read-your-writes/propagation).** It is additive: it reopens no locked decision (see A1/A2). The confirmed shape:

  **1. Local store.** SQLite in a Web Worker over OPFS, exposed to the main thread as an async proxy and driven by Drizzle's SQLite proxy driver. Must survive reloads (OPFS is origin-partitioned persistent storage; the synchronous access handles are worker-only, Safari included — verify against the browser-support list). Same `sqliteTable` schema as the server; different driver. sql.js/in-memory is excluded (does not survive reload).

  **2. Datastore capability seam.** Core provides a framework-free, browser-safe capability that returns a Drizzle instance bound to the environment's SQLite driver. Module code imports the seam, writes Drizzle, and runs on both surfaces without naming a driver. The browser-side store is a new export boundary under Q40.

  **3. "Record" definition (aggregate root).** A *record* is the smallest unit that is independently locked, versioned, synced and conflicted: an aggregate root plus every row a single logical edit writes. Modules declare their aggregate roots and the child tables that ride under each. Locks, revisions, tombstones and conflict state attach to the root; child rows inherit the root's state and are never independently locked, versioned or synced. An edit spanning two roots is two records: two leases, two change-sets. (MVP lock granularity is per record; group locks are later if required.)

  **4. Sync unit — change-set.** One user action → one local SQLite transaction → one change-set → one server D1 batch. A change-set is a `group_id` plus an ordered op list (emitted in the client's FK-valid local application order). Push sends change-sets, not a flat op list; within a set, client order; across sets, `local_seq` order. Server applies each set as one D1 prepared-statement batch (Q52): any failure rolls the set back, authorization failure rejects the set (never a partial action), and `change_set_id` is the idempotency key (Q66) so re-push dedupes. Ordering is per-client sequential; no global order is needed (records are single-writer and you cannot reference an unseen id). Partial failure is fail-stop per push, per client. Server-derived writes (e.g. rules-engine recompute) fold into the same batch and emit their own change entries for pull.

  **5. Conflict detection.** Field-level, not record-level: store a per-field base (value + the rev it was read at); conflict only where the server's current value differs from your base AND you changed that field; non-overlapping field edits auto-merge. Surface conflicts with a three-way field diff (base / mine / theirs) and resolve per-field or bulk (mine / theirs / both-fork). Rejected/stale ops go to a visible bucket, never silently dropped.

  **6. Presence-lease locks.** A lock is a lease held while a record is *actively* edited, not a long checkout: acquire on open (lease only for records that exist on the remote; purely-local records never lock), heartbeat ~TTL/3, release on close, expire after TTL (server-clock-measured; never trust client clocks). Steal policy: expired lease → grant; live lease to a different user → no steal (read-only + "who is editing" + optional request-access); live lease to the same user on another device → reassign to the new device, old device drops to read-only. A lease is **advisory** — it reduces conflict frequency but is NOT a transaction/atomicity claim under Q52. Offline edits are unlocked-provisional (conflict-checked on reconnect). Lock eligibility is **decoupled from publish state** (dev decision, amending Q54's scope): a record locks once it is shared/remote, regardless of publish state.

  **7. Working-set scope and transport.** The local store holds the user's working set, not the whole remote: Class 1 authored/owned (bidirectional, permanent local), Class 2 referenced read-only (pull-cache, versioned pointer, evictable), Class 3 remote-only (auth/config/listings, never local). A record enters the working set when the user owns it, belongs to its scope, or adopts it. The working-set subscription is **server-authoritative** (a security boundary — a user may pull only what they are permitted to see; Q50/007). Transport for MVP is poll-on-focus/interval/reconnect (one round trip pushing dirty ops, pulling working-set changes, renewing the lease); no event bus or unsolicited push in MVP (Q41), WebSocket/SSE is a later upgrade. Alerting is narrow: silent apply for unedited records; escalate only on genuine conflict or explicitly-watched records; plus a global sync-status indicator.

  **8. Risk mitigations (the nine resolutions).**
  - Local data write and its change-row must be one local SQLite transaction (SQLite ACID); all mutations go through the single datastore-capability write path; WAL mode; optional reconcile safety net.
  - One user action = one change-set (per-action atomicity, not cross-action).
  - Tombstones for deletes with a retention window AND all-replicas-acknowledged, then a GC job (manifest-declared cron, Q56) hard-deletes; explicit user purge overrides.
  - OPFS may be evicted under storage pressure unless `navigator.storage.persist()` is granted; monitor `navigator.storage.estimate()`; physically separate Class 1 from Class 2; sync promptly; warn/gate destructive actions with unsynced changes. Wrapper surfaces (Tauri/Capacitor filesystem) carry no such eviction risk.
  - Schema/payload drift: version-tag sync payloads; accept current + N-1 majors (mirrors Q44/Q49); explicit "client too old → read-only + export" policy; tolerant readers; additive-only within a contract major; versioned one-way local migrations with a pre-migration snapshot; keep the local store rebuildable.
  - Lease-superseded detection after crash/takeover; offline revocation routes rejected ops to a visible stranded bucket.
  - Pause remote-apply for a record you hold an active lease on (not the whole loop).

- Owner/question: local-first client datastore + sync design in **spike plan 000**, coordinated with Q38/Q40/Q45/Q52/Q54/Q56/Q66/Q67. Outcome: **one ADR plus a concrete design and verification evidence** — an ADR alone is not closure.
- Block: blocks the local-first client store, the sync/lock/conflict layer and their affected implementation; does not block unrelated implementation whose own gates are met.
[STATUS: DEFERRED]

## C. Amendments to existing questions

Each entry below is the amendment bullet also inserted into `understanding.md`.

- **Q10 (canonical stored types / Drizzle / D1-only).** Amendment 001: not reopened. Adds a second execution surface for the same Drizzle SQLite schema — the browser-local SQLite store (Q70) — with modules still using Drizzle directly and no query-builder abstraction. "Future engine must be SQLite-dialect-compatible" is satisfied by browser SQLite; D1-only-for-server stands.
- **Q11 (identity conventions).** Amendment 001: the client-generated prefixed, sortable, TEXT id path now serves offline record creation (records created before any server contact), change-set `op_id`s and the sync idempotency key surface; uniqueness alone still does not define safe retry/ownership — Q66/Q70 own that.
- **Q35 (module contract / manifest).** Amendment 001: the manifest additionally declares each module's **aggregate roots** ("sync-and-lock units") and the child tables that ride under each root (Q70 §3), alongside the already-declared owned entities/schema and ID prefixes.
- **Q37 (data ownership).** Amendment 001: a module owns its aggregate-root definitions and declares which child tables ride under each root; the sync/lock/revision unit is the root (Q70 §3).
- **Q38 (core capability inventory).** Amendment 001: the inventory gains a **datastore capability seam** that binds a Drizzle instance to the environment's SQLite driver (D1 server-side, browser SQLite client-side); add it to the required-versus-optional capability policy.
- **Q40 (package/export/composition/lifecycle).** Amendment 001: the browser-side SQLite store is a new export boundary (a worker-hosted wasm-SQLite instance, opened per session — consistent with "no binding I/O at module initialization, no stale globally cached binding-derived client").
- **Q45 (datastore-declaration interface).** Amendment 001: **not reopened.** D1-only-for-server and "no query-builder abstraction" stand; a browser-local SQLite store is a client capability, not a server binding; the SQLite-dialect constraint is satisfied by browser SQLite (A1/A2).
- **Q52 (unit-of-work seam).** Amendment 001: the change-set maps 1:1 onto one D1 prepared-statement batch (Q70 §4). Presence leases are **advisory** and must never be presented as an atomicity/correctness guarantee under Q52.
- **Q54 (content model + publishing).** Amendment 001: lock eligibility is decoupled from publish state — a record locks once it is shared/remote, regardless of publish state (dev decision; Q70 §6).
- **Q66 (durable effects/retries/idempotency).** Amendment 001: `change_set_id` is the sync idempotency key (same id + same payload → dedupe; same id + different payload → client error, surfaced); the "D1 transactional outbox" evaluation candidate is concretized as the sync op-log; sync payloads carry the contract version with a current + N-1 acceptance window.
- **Q67 (author consistency/propagation).** Amendment 001: local-first read-your-writes is local-by-construction (Q70 §4/§7); the remote pull transport is poll-based for MVP, scoped to the server-authoritative working set; Q67's public-propagation/preview rules continue to govern the remote.

## D. Confirmed dev decisions recorded by this amendment

- D1/SQLite is acceptable on both surfaces; drop PGLite for CriticalSheets to share one dialect.
- No custom query language; the goal (write schema+queries once, share) is met by Drizzle + a driver seam.
- No realtime/multi-user document coordination; conflicts are surfaced to the user (field-level diff, mine/theirs/both) — no CRDT.
- Per-record locks for the MVP (with "record" = aggregate root); group locks later if required.
- Offline edits are unlocked-provisional, conflict-checked on reconnect.
- Lock eligibility is decoupled from publish state.
- Local store must survive reloads (OPFS-backed).
- This is a platform capability, not a CriticalSheets-only feature.

## E. Relationship to the gate inventory

This amendment adds **Q70** alongside the existing foundational spikes (Q38/Q40/Q47/Q54/Q63) and affected-work gates (Q65–Q68). It reopens nothing. Spike plan 000 already owns Q40/Q52/Q63/Q66/Q67 — everything this capability touches — so Q70 is owned there too; the Q38/Q40 capability-seam additions and the Q35/Q37 manifest additions fold into those existing designs rather than creating new gates.
