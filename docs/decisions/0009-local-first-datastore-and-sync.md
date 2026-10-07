# ADR-0009 — Local-first datastore and sync (Q70)

- **Status:** Proposed (2026-10-07) — authored at task 3.4 of spike plan 000 phase_003; **not
  accepted** (closure-wise). **Dev acceptance of the provisional decisions and §16 spike-owned
  policies recorded 2026-10-07 (session `20261007_191409_68fc38`) — see evidence report §6
  (dev acceptance table, conditions preserved); acceptance is NOT adoption and does not flip
  this record's status.** Full acceptance/closure still follows the phase-005 browser/proof
  evidence (task 5.1: real-browser
  OPFS persistence, worker/proxy bridge, local transaction atomicity, sync round trip against
  real D1, owner-browser matrix) and **phase-007 reconciliation (task 7.x, per the plan's
  closure schedule)** — an ADR alone is not closure (Q19/Q61). Per the phase contract, Q70's
  input design is accepted-input material only; the MVP still ships the implemented
  capability (Amendment 002).
- **Deciders:** authored by the task-3.4 design agent under the phase-003 contract (proposed
  designs/ADRs; no unrun evidence asserted; no policy adopted without explicit dev input).
  The spike-owned policies (lease TTL, poll cadence, schema versioning, storage isolation,
  tombstone retention) are **dev-accepted 2026-10-07** (session `20261007_191409_68fc38`,
  evidence §6) as PROPOSED design values — still gated on phase-005 proofs and revisitable
  at 5.1 per their stated rationale rows.
- **References:** design
  `docs/plans/000_spike-plan/designs/q70_local-first-sync.md`; evidence
  `docs/plans/000_spike-plan/evidence/q70_local-first-sync.md`;
  `docs/specs/003_data-and-migrations.md` §Q70; `docs/specs/004_clients-and-presentation.md`
  (browser-safe export, surfacing boundary);
  `docs/specs/000_index.md` canonical gate table (Q70 row);
  `docs/discovery/understanding-amendments-001.md` (Q70 confirmed shape §§1–8; Q10/Q45 not
  reopened) and `docs/discovery/understanding-amendments-002.md` (Q71 privacy reaching
  on-device replicas; Q70 = MVP deliverable);
  `docs/decisions/0001-platform-foundations.md` (ceiling decisions);
  ADR-0005 (shared D1 + Q63 runner), ADR-0006 (§14 browser-store boundary/lifetime; §10
  client-final ids), ADR-0007 (surfacing contracts), ADR-0008 (starter consumes the seam).

## Context

Gate Q70 is the foundational local-first client datastore + sync spike, **additive** — it
reopens no locked decision (Amendment 001 §A: the query-language deliberation was settled as
NOT reopened; the dev confirmed SQLite is acceptable on both surfaces, which removes the
dialect split). The locked constraints it operates within: Drizzle is the only schema/query
language, no query-builder abstraction (Q10/Q45); D1-only for the **server** datastore with
the browser store as a client capability (Q45); unit-of-work atomicity = one D1 database +
one prepared-statement batch, with the change-set mapping 1:1 onto one batch and presence
leases strictly advisory (Q52); prefixed sortable URL-safe TEXT ids, final at creation
(Q11/ADR-0006 §10); frontend independence — the store is a browser-safe framework-free export
(Q22/Q25/ADR-0006 §2); contract current + N-1 (Q44/Q49). ADR-0006 §14 fixed the export
boundary (worker-hosted wasm-SQLite opened per session; never at module init; never a
module-scope global) and delegated the mechanics to this record. Amendment 002 makes Q70 an
**MVP deliverable** and extends privacy guardrails to on-device replicas (erasure reaches
Class 1 local data — a DSR is not satisfied by server-side deletion alone). Executed source
verification (evidence §2, 2026-10-07) confirmed the tooling basis: `@sqlite.org/sqlite-wasm`
3.53.4-build2 (worker-only OPFS; sahpool VFS needs no COOP/COEP and covers Safari 16.4+; WAL
requires exclusive locking and buys no concurrency), and drizzle-orm 0.45.3's
`sqlite-proxy` seam (generic async callback, real `BEGIN`/`COMMIT`/`savepoint` transactions
through the callback, batch callback support).

## Decisions (provisional, proposed; awaiting dev acceptance and phase-005 proof)

1. **Driver: `@sqlite.org/sqlite-wasm` in a dedicated module Web Worker on the
   `opfs-sahpool` VFS.** sahpool is selected over the `opfs` VFS (no COOP/COEP headers
   required; Safari 16.4+ floor vs the `opfs` VFS's Safari ≥ 17; verified highest OPFS
   performance) — trading away transparent multi-connection concurrency, which the design
   replaces with a single-connection-per-DB worker and Web-Locks tab ownership. The
   deprecated Worker1/Promiser APIs are not used; the platform owns a small typed
   postMessage bridge. sql.js/in-memory is excluded (does not survive reload — locked).

2. **Drizzle seam: `drizzle-orm/sqlite-proxy`.** The main thread binds the ONE
   `sqliteTable` schema via `drizzle(callback[, batchCallback])`; the callback bridges to the
   worker, which executes on the OO1 connection. Transactions run as real SQLite
   `BEGIN`/`COMMIT`/`ROLLBACK` (nested via savepoints) through the same callback — verified
   in the published session code. Same schema, same query code on D1 (server) and browser;
   no schema fork, no module names a driver (datastore capability seam, Q38 C1). No new
   query language is introduced at any layer.

3. **Storage isolation (spike policy): two sandboxed sahpool instances** —
   `class1_authored.sqlite3` (Class 1: owned/authored data, op-log, leases, tombstones;
   `navigator.storage.persist()` requested, estimate() monitored, eviction warnings gate
   destructive actions with unsynced sets) and `class2_cache.sqlite3` (Class 2: evictable
   read-only pull cache). Class 3 (auth/config/listings) never persists locally. The store
   is opened per session (ADR-0006 §14) and degrades visibly in incognito/guest modes —
   never a silent in-memory fallback.

4. **Record and action boundaries.** Record = manifest-declared aggregate root + child rows
   (children inherit lock/revision/tombstone state, never independently synced). A user
   action spanning two roots is two records: two leases, two change-sets, with no cross-root
   or cross-set atomicity claim (Q52); rejected second sets land in the visible rejected
   bucket. Purely-local records use final-at-creation client ids and never lease.

5. **Change-set sync unit.** One user action → one local SQLite transaction (data writes +
   change rows together, atomic; WAL with `locking_mode=exclusive` adopted for potential
   sahpool performance, with atomicity explicitly NOT dependent on WAL) → one change-set
   (envelope: `change_set_id` idempotency key (Amendment 001 §B §4's `group_id`), `installation_id`, `local_seq`, payload
   `schema_version`, `root_id`, `base_rev`, ordered FK-valid ops) → **one D1
   prepared-statement batch** including server-derived writes (which emit their own change
   entries for pull). Authorization failure rejects the whole set; partial failure is
   fail-stop per push; re-push dedupes by id; same-id-different-payload is a surfaced
   client error.

6. **Field-level three-way conflict resolution.** Per-field base (value + rev-at-read);
   conflict iff server current ≠ client base AND the client changed that field;
   non-overlapping edits auto-merge; conflicts surface as base/mine/theirs with per-field or
   bulk resolution (mine / theirs / both-fork). No CRDT, no silent merge. Rejected/stale ops
   go to a visible bucket, never dropped.

7. **Server-clock advisory leases (spike policy: TTL 120 s, heartbeat 40 s).** Acquire on
   actively editing a remote-existing record (eligibility rides **remote-status, never
   publish state** — Amendment 001's Q54 amendment); renew piggybacked on the sync round
   trip; expired → grant; live lease to a different user → no steal (read-only + who-is-
   editing + request-access); same user on another device → takeover reassigns with a
   takeover epoch the old device detects; offline edits are unlocked-provisional and
   conflict-checked on reconnect. Leases are advisory and never an atomicity claim (Q52);
   lease state is enforced inside the change-set application batch.

8. **Server-authoritative working sets and poll transport.** Class 1/2/3 with the
   subscription filtered server-side by permission (Q50/007) — never whole-remote
   replication. MVP transport is poll-based (Q41: no event bus/unsolicited push): one round
   trip pushing pending sets (`local_seq` order), pulling working-set changes since the
   watermark, renewing leases — on focus regain, every 30 s while visible (spike policy),
   and on reconnect; hidden tabs do not poll. Remote-apply pauses **per actively-leased
   record only**; the loop continues for everything else. Alerts stay narrow (conflicts,
   watched records, global sync-status indicator).

9. **Versioning and migration (spike policy).** Sync payloads carry `schema_version`; the
   server accepts current + N-1 majors (Q44/Q49 mirror); a too-old client goes read-only
   with export, never a silent loss path. Local schema migrations are one-way, generated by
   `drizzle-kit generate` from the same schema (server artifact source, Q63), shipped in the
   app bundle, executed by a core-owned local runner with a **pre-migration snapshot** per
   affected database (latest retained; store rebuildable); migration failure leaves the
   previous version intact, read-only + export.

10. **Tombstones and GC (spike policy: 30-day retention).** Deletes write root tombstones
    (children inherit). Hard-delete requires BOTH the retention window AND all-replica
    acknowledgement (per-installation pull watermarks); the GC is a manifest-declared cron
    job (Q56). Explicit purge overrides the window and propagates as a directive until
    acknowledged — this is also the local-side mechanic for Q65 erasure, which must reach
    offline Class 1 replicas (Amendment 002: a DSR is not server-side-only).

11. **Couplings consumed, not redesigned.** Q65 owns erasure/retention policy and the
    coordinated restore that consumes the local snapshot/export; Q66 owns post-commit effect
    recovery (the sync op-log concretizes its outbox evaluation candidate); Q67 owns public
    propagation/preview staleness — local read-your-writes is local-by-construction here.
    Q47 owns all conflict/lease/sync-status **surfacing**; this record supplies the typed
    state only.

## Rejected alternatives

- **The `opfs` VFS as default** — rejected provisionally: requires COOP/COEP headers
  (SharedArrayBuffer) and drops Safari < 17 (verified); recorded as the multi-tab
  alternative if tab-handoff policy proves insufficient (a dev decision, not a default).
- **`opfs-wl` VFS / WASMFS / kvvfs** — rejected: `opfs-wl` needs `Atomics.waitAsync()`
  (2025-era portability); WASMFS is unsupported/custom-build; kvvfs is main-thread-only and
  single-database.
- **sql.js / in-memory store** — rejected (locked, Amendment 001 §1): does not survive
  reload. Any unsupported mandatory behaviour is a blocker for dev reconciliation, never a
  silent in-memory fallback.
- **A custom query language / dialect-neutral query layer** — rejected (locked, Amendment
  001 §A1): SQLite on both surfaces meets the shared-schema goal through Drizzle + the
  driver seam; an abstraction above Drizzle is exactly what Q10/Q45 rejected.
- **CRDT / event-bus / realtime coordination** — rejected (locked, Q41/Amendment 001 §7):
  conflicts surface to users; WebSocket/SSE is a later upgrade.
- **Whole-remote replication on the client** — rejected: the working set is bounded and
  server-authoritative (security boundary); Class 2 is evictable cache only.
- **Leases as correctness/atomicity gates** — rejected (Q52): leases are advisory;
  authorization-shaped, never transactional.
- **Lock eligibility coupled to publish state** — rejected (Amendment 001 Q54 amendment):
  eligibility rides remote-status; a record locks once shared/remote.
- **Client-clock lease measurement** — rejected (Amendment 001 §6): server clock only.
- **Downgrade migrations or in-place schema rewrites of the local store** — rejected:
  one-way forward-only with snapshot; a downgrade is wipe + re-pull/export.
- **Server-side-only deletion as DSR fulfilment** — rejected (Amendment 002/Q71): erasure
  directives must reach and purge on-device replicas.
- **Temporary→final id rekeying on sync** — rejected (ADR-0006 §10): ids are final at
  creation; retry safety rides change-set idempotency.

## Non-decisions

This record selects **no** Q40 composition/package/install mechanics (consumed via §2's
export boundary), no Q47 surfacing/presentation mechanism, no Q65 backup format/retention
policy or restore procedure, no Q66/Q67 mechanisms beyond the named couplings, no group
locks (per-record MVP), no WebSocket/SSE transport, and no product code (the worker, bridge,
sync client and lease logic are designed; task 5.1 exercises them in an isolated harness
with real browser + real D1). It reopens no locked decision (Q10/Q11/Q22/Q25/Q29/Q41/Q44/
Q45/Q49/Q52/Q54-as-amended/Q61).

## Consequences

- Module code writes Drizzle once and runs on both surfaces; offline capability and
  reload-surviving local persistence exist without a schema fork or driver naming.
- The MVP gains a working local-first store + sync experience only after this gate's
  phase-005 proofs; nothing here authorizes product implementation.
- The single-connection/tab-ownership policy is a real UX constraint (one editing tab per
  record set per origin); revisit requires a dev decision (opfs VFS + COOP/COEP swap).
- Erasure/retention work in Q65 must consume the tombstone/purge/directive mechanics here;
  a Q65 design that stops at server-side deletion is non-conformant with Amendment 002.
- Q70 gate closure requires: task 5.1's real-browser/D1 evidence (persistence, atomicity,
  sync, leases, conflicts, migration, GC), the dev's acceptance of the spike-owned policies,
  and phase-007 reconciliation. None is granted by this record.

## Follow-on decisions needed

- **Dev:** provisional decisions and §16 policies ACCEPTED 2026-10-07 (session
  `20261007_191409_68fc38`, evidence §6) — no open dev acceptance items remain from this
  record. Remaining dev touchpoints: any multi-tab/VFS-swap policy decision surfaced by 5.1,
  and closure-phase reconciliation (phase-007).
- **Task 5.1 (phase-005):** build the harness; execute evidence §4's checks; record observed
  outputs; Modify design/evidence with findings; run the real-browser matrix incl. Safari.
- **Q65 (phase-004):** design erasure/retention consuming §10's local mechanics; design
  coordinated restore consuming the snapshot/export path.
- **Q56 (cron manifest):** register the tombstone-GC job.
- **Phase-007 reconciliation:** close Q70 per the canonical gate table after proofs;
  then this ADR may move Proposed → Accepted → Closed.
