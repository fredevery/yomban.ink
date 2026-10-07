---
title: "Q70 — local-first datastore and sync (evidence: executed source verification, unverified items, blockers)"
created_session: "20261007_183604_4c9d75"
sessions: []
approved: false
---

# Q70 — Evidence report (task 3.4) — executed source verification for the local-first design

> This is the **Q70 evidence report for task 3.4**
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.4.md`). It records what was
> **actually inspected and executed** this session (read-only source verification against
> live registries, official package artifacts and official documentation pages) and the
> checks **NOT run** (assigned to later tasks). Every verified claim carries its own
> "how this was verified" line. Nothing here asserts a browser run, an installed harness, or
> a passing test — **no harness was built, no package was installed locally, no browser was
> launched**; those are phase-005 task 5.1's deliverables.

## 1. What was produced

Exactly three documentation files, matching the task card's Files list — no code, no
installs, no builds:

1. `designs/q70_local-first-sync.md` — the provisional mechanics design (driver/VFS selection,
   proxy seam, session/storage lifecycle, aggregates, change-sets, leases, conflicts,
   transport, versions, migrations, tombstones/GC, couplings, explicit policies).
2. `docs/decisions/0009-local-first-datastore-and-sync.md` — ADR-0009, **Proposed**.
3. This evidence report.

**Verification method (2026-10-07):** read-only HTTP fetches (curl-equivalent user agent)
against the **npm registry JSON API** (`registry.npmjs.org`), the **published npm package
tarballs** (inspected in-memory, files extracted and read), and **official documentation
pages** (`sqlite.org/wasm/doc/trunk/*`, `orm.drizzle.team/docs/*`,
`developer.mozilla.org`, `raw.githubusercontent.com/mdn/content`). Shell execution was
**denied by the session approval gate** — every verification below ran through the approved
code-kernel HTTP path instead; no command output beyond these fetches is claimed.

## 2. Executed verification — per-claim table

### 2.1 `@sqlite.org/sqlite-wasm` — package, versions, artifacts

| Claim | Observed value | How this was verified |
|---|---|---|
| Package identity & latest version | `@sqlite.org/sqlite-wasm` latest dist-tag = **3.53.4-build2** (SQLite 3.53.4 + build suffix) | `GET https://registry.npmjs.org/@sqlite.org/sqlite-wasm/latest` → `version: "3.53.4-build2"` (2026-10-07) |
| Version history & cadence | **86 published versions**; first publish 2023-04-17 (`0.0.1`); recent: `3.53.0-build1` 2026-04-21, `3.53.4-build1`/`build2` 2026-10-02 — majors track SQLite releases, ~2–3 tracks/year, build suffixes within days | `GET https://registry.npmjs.org/@sqlite.org/sqlite-wasm` → `time` map + `versions` keys (2026-10-07) |
| Package entry points | `main: ./dist/index.mjs`, `types: ./dist/index.d.mts`, exports `.`/`./package.json`/`./sqlite3.wasm` | Tarball `@sqlite.org/sqlite-wasm-3.53.4-build2.tgz` fetched and `package/package.json` read (2026-10-07) |
| Dist contents | `dist/index.mjs`, `dist/node.mjs`, `dist/sqlite3-worker1.mjs`, `dist/sqlite3-opfs-async-proxy.js`, `dist/sqlite3.wasm`, `dist/index.d.mts` | Same tarball file listing (2026-10-07) |
| OPFS requires a Worker; main thread excludes OPFS | README §Usage: "Only the worker versions allow you to use the origin private file system (OPFS) storage back-end." | Tarball `package/README.md` read directly (2026-10-07) |
| COOP/COEP requirement (for the `opfs` VFS path) | README: worker-with-OPFS requires `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` response headers | Tarball `package/README.md` (2026-10-07) |
| Node.js support is in-memory only | README §Node.js support: "Node.js is currently only supported for in-memory databases without persistence." | Tarball `package/README.md` (2026-10-07) |
| Worker1/Promiser APIs deprecated | README §Deprecations: "The Worker1 and Promiser1 APIs are, as of 2026-04-15, deprecated… their use is actively discouraged." | Tarball `package/README.md` (2026-10-07) |
| Upstream docs are authoritative for VFS behaviour | README: package wraps `sqlite.org/wasm` "with no changes" — VFS claims cited from sqlite.org docs (§2.3) | Tarball `package/README.md` (2026-10-07) |

### 2.2 Browser matrix for OPFS persistence (official SQLite wasm docs)

All rows verified against `https://sqlite.org/wasm/doc/trunk/persistence.md` (fetched
2026-10-07; section text quoted):

| Claim | Observed statement | How this was verified |
|---|---|---|
| OPFS availability floor | "OPFS is only available in Worker-thread contexts, not the main UI thread." Browsers with the necessary APIs: "Chromium-derived browsers released since approximately mid-2022… Firefox v111 (March 2023) and later Safari 16.4 (March 2023) and later" | persistence.md, OPFS intro section (2026-10-07) |
| `opfs` VFS is worker-only and auto-activating | "This support is only available when sqlite3.js is loaded from a Worker thread… activated automatically if the browser appears to have the necessary APIs" | persistence.md, "OPFS VFS" section (2026-10-07) |
| Safari < 17 incompatible with `opfs` VFS | "Safari versions less than version 17 are incompatible with the current OPFS VFS implementation because of a bug in the browser's storage handling from sub-workers for which there is no workaround. Both the SharedAccessHandle pool VFS and the WASMFS support offer alternatives which should work with Safari versions 16.4 or higher." | persistence.md, "Achtung: Safari versions < 17" (2026-10-07) |
| COOP/COEP required for `opfs` VFS (SharedArrayBuffer) | "JavaScript's SharedArrayBuffer type is required for the OPFS VFS… only available if the web server includes the so-called COOP and COEP response headers… Without these headers… the OPFS VFS will not load." (COEP `credentialless` noted as possibly viable) | persistence.md, "Achtung: COOP and COEP HTTP Headers" (2026-10-07) |
| `opfs-sahpool` VFS properties | "Should work on all major browsers released since March 2023. Does not require COOP/COEP HTTP headers… Easily the highest OPFS performance"; disadvantages: "Does not support multiple simultaneous connections to the same database except: Within the same thread… (latent locking bug in versions prior to 3.54 can lead to corruption in that case)… No filesystem transparency"; paths must be absolute; multiple instances under different names are sandboxed from one another; second+ init from another tab fails unless explicitly enabled via `installOpfsSAHPoolVfs()` | persistence.md, "SyncAccessHandle Pool VFS" section (2026-10-07) |
| sahpool concurrency & pause capability | "The opfs-sahpool VFS cannot offer any client-transparent concurrency support"; as of 3.50 `PoolUtil.pauseVfs()/unpauseVfs()` adds cooperative pause/unpause (throws if open handles exist) | persistence.md, "SAHPool Concurrency" (2026-10-07) |
| `opfs` VFS multi-tab locking | "no two database handles can have the same OPFS-hosted database open at one time… second tab will hit a locking error… sqlite3 only acquires a write-mode handle when the database API requires a lock… retry"; `opfs-unlock-asap=1` URI flag trades performance for earlier lock release | persistence.md, "Concurrency and File Locking" + "Unlock-ASAP Mode" (2026-10-07) |
| `opfs-wl` VFS (new in 3.53.0) | "uses Web Locks for locking… requires `Atomics.waitAsync()`, which has only been in widespread browser circulation since 2025, so it is not as portable" | persistence.md, "OPFS with Web Locks" (2026-10-07) |
| WAL on OPFS | "As of version 3.47, it is possible to activate WAL mode for OPFS-hosted databases with the following caveats: …activating WAL requires that a client specifically activate exclusive-locking mode… immediately after opening it, before doing anything else: `pragma locking_mode=exclusive`. WAL mode does not provide any concurrency benefits in this environment… The 'opfs-sahpool' VFS may, depending on the host environment, gain a slight performance boost when using WAL." | persistence.md, "WAL Mode with OPFS" (2026-10-07) |
| Incognito/guest degradation | "storage capabilities might be adversely affected, e.g. with lower quotas or a complete lack of persistence… browser makers intentionally make it difficult to detect such modes" | persistence.md, opening Achtung (2026-10-07) |
| Storage limits | "OPFS storage limits are generous but differ per environment… If the limits are exceeded, SQLite will respond with generic I/O errors" | persistence.md, "Storage Limits" (2026-10-07) |
| Sync access handles are worker-only (cross-check) | MDN `FileSystemSyncAccessHandle`: "This class is only accessible inside dedicated Web Workers… for files within the origin private file system" — `{{AvailableInWorkers("dedicated")}}` | `https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/filesystemsyncaccesshandle/index.md` (2026-10-07) |
| Eviction / persistence guardrails | MDN Storage quotas & eviction: default is "best-effort" storage; `navigator.storage.persist()` requests persistent storage; "In Firefox… the user is notified"; "Safari and most Chromium-based browsers… automatically approve or deny the request based on the user's history of interaction" | `https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria` (2026-10-07) |

**Browser-matrix caveat recorded:** per-version × per-VFS coverage above comes from the
SQLite wasm docs' own compatibility statements (a primary but version-anchored source). A
**real-browser matrix run (Chrome/Edge/Firefox/Safari current + last-2) is NOT executed in
this task** — it is phase-005 task 5.1's explicit owner-browser evidence (per the spike-plan
rule: real-browser evidence is an explicit prerequisite, never emulated silently).

### 2.3 Drizzle ORM proxy/driver support

| Claim | Observed value | How this was verified |
|---|---|---|
| drizzle-orm current version | **0.45.3** (published 2026-09-21) | `GET https://registry.npmjs.org/drizzle-orm/latest` + `/drizzle-orm` `time` map (2026-10-07) |
| `drizzle-orm/sqlite-proxy` subpath exists | package.json `exports["./sqlite-proxy"]` → `./sqlite-proxy/index.js` (+ `.d.ts`) | `GET https://registry.npmjs.org/drizzle-orm/0.45.3` exports map (2026-10-07) |
| Exported API surface | `drizzle(callback)` / `drizzle(callback, batchCallback?, config?)`; `RemoteCallback = AsyncRemoteCallback = (sql, params: any[], method: 'run'|'all'|'values'|'get') => Promise<{rows: any[]}>`; `AsyncBatchRemoteCallback` for batched `{sql, params, method}[]`; `SqliteRemoteDatabase extends BaseSQLiteDatabase<'async', …>` with typed `.batch()`; `SQLiteRemoteSession.transaction()`; `SQLiteProxyTransaction` nested transactions | Tarball `drizzle-orm-0.45.3.tgz` → `package/sqlite-proxy/driver.d.ts` + `session.d.ts` read directly (2026-10-07). NOTE: the published `.d.ts` uses `any[]` internally — the platform bridge wraps it with strict external types; the upstream signature is recorded verbatim, not adopted as project style |
| Transactions emit real SQL through the callback | session.js `transaction()`: `begin[ behavior]` → callback body → `commit`; on error `rollback`; nested = `savepoint sp<n>` / `release savepoint` / `rollback to savepoint` — all via the same remote callback, so the proxy executes genuine SQLite transaction control | Tarball `package/sqlite-proxy/session.js` read directly (2026-10-07) |
| Batch API support through the proxy | Official docs: "Sqlite Proxy supports batch requests… You will need to specify a specific callback for batch queries" | `https://orm.drizzle.team/docs/sqlite/connect-drizzle-proxy` (fetched 2026-10-07) |
| Same `sqliteTable` schema binds on both drivers | `SqliteRemoteDatabase` is a `BaseSQLiteDatabase` (sqlite-core), same schema/config type as the D1 driver's database; documented proxy usage takes the standard `DrizzleConfig` with schema | driver.d.ts + connect-drizzle-proxy docs (2026-10-07) |

**Not verified (recorded, not asserted):** the sqlite-proxy **`migrator`** entry
(`package/sqlite-proxy/migrator.js` exists in the tarball) was NOT inspected — the design
excludes the proxy migrator anyway (local migrations run through the core-owned local runner,
design §13), so no claim about it is made.

### 2.4 Drizzle "browser over OPFS" path — honest status

The Drizzle docs site documents a **"Drizzle over wasm / SQLite in the browser over OPFS"**
connect page conceptually (referenced from the connect overview's driver list), but the
exact page slug was **not retrievable in this session** (the sitemap lists
`connect-drizzle-proxy` for SQLite, and direct slugs for the wasm/OPFS page returned 404;
the firecrawl-backed web-search/extract backends were disabled in this session, so
site search was unavailable). **The design therefore does NOT claim Drizzle's own
wasm/OPFS driver as verified** — it uses the verified generic `sqlite-proxy` seam
(§2.3), which needs no Drizzle-side browser package. If phase-005 finds Drizzle's
dedicated wasm driver preferable, that is a swap within the same seam, not a redesign.
*(Blocked-source note, not a blocker: the selected mechanism is verified.)*

## 3. Design-policy traceability (choice → verified evidence)

| Design decision | Backing verified evidence |
|---|---|
| sahpool VFS selected as default (no COOP/COEP; Safari 16.4+) | §2.2 sahpool row |
| Single connection per DB per worker; no multi-connection reliance | §2.2 sahpool disadvantages (incl. pre-3.54 same-thread locking bug — current release is 3.53.4, §2.1) |
| Multi-tab = Web Locks ownership + read-only Class 2 fallback | §2.2 sahpool second-init + concurrency rows; `opfs` VFS multi-tab locking row (alternative) |
| WAL + exclusive locking, atomicity not dependent on WAL | §2.2 WAL row |
| persist()/estimate()/incognito guardrails | §2.2 eviction + incognito rows |
| Worker-only OPFS, per-session worker lifetime | §2.1 README worker row; §2.2 OPFS-floor row |
| sqlite-proxy as the Drizzle seam; real BEGIN/COMMIT transactions; batch callback | §2.3 all rows |
| Class 1/Class 2 = two sandboxed sahpool instances | §2.2 sahpool multiple-instances row |
| Node in-memory caveat recorded (no Node-OPFS harness attempt) | §2.1 README Node row |

## 4. Checks NOT run (assigned to later tasks; none executed in task 3.4)

1. **Real-browser OPFS persistence proof** — reload/reopen, persist() grant/denial paths,
   quota/estimate behaviour, incognito degradation, multi-tab handoff: **no browser was
   launched. Owner: phase-005 task 5.1** (plus owner-browser evidence per plan 000's
   real-browser prerequisite rule).
2. **Worker/proxy bridge execution** — the postMessage bridge and the sqlite-proxy callback
   wiring are designed, not exercised; the SQLite worker's sahpool install
   (`installOpfsSAHPoolVfs()`) was not run. **Owner: 5.1.**
3. **Local transaction atomicity** (data + change-row, forced failure leaves neither half):
   designed; **not run. Owner: 5.1.**
4. **Sync round trip against real D1** — change-set apply, idempotent re-push, batch
   rollback, rejection-to-bucket, lease expiry/steal/takeover, remote-apply pause:
   designed; **not run. Owner: 5.1 (+ phase-004 Q66/Q67 designs for the server contracts).**
5. **Local schema migration with snapshot** — the drizzle-kit generate path was not
   exercised for the local store; snapshot mechanics not run. **Owner: 5.1.**
6. **Tombstone/GC + erasure-directive behaviour** — designed; the server side is
   Q65/Q56-owned and unrun. **Owner: Q65 design (phase 4) + 5.1 (local side).**
7. **Drizzle's dedicated browser-wasm driver page** — not retrieved (§2.4); no claim made.
   **Owner: 5.1 may re-check before harness authoring.**
8. **`drizzle-orm/sqlite-proxy` `migrator` entry** — not inspected (design excludes it,
   §2.3 note). No action assigned unless the design's local-migration exclusion is
   challenged at review.

**Not blockers for this task:** items 1–6, 8 are later tasks' deliverables; this report's
only claim is that they have not run. Item 7 is a recorded verification gap with the design
deliberately independent of it (§2.4).

## 5. Blockers requiring dev reconciliation (none currently; conditions listed)

**No hard blocker exists at design time** — every mandatory behaviour has verified
tooling support for at least one selectable configuration (sahpool + sqlite-proxy).
The task's rule ("unsupported mandatory behavior is a blocker… not a silent in-memory
fallback") is satisfied by the verified matrix; the conditional risk register for
phase-005:

1. **Safari 16.x support floor** — verified supported only via sahpool (16.4+); if the
   browser matrix in 5.1 finds sahpool behaviour on a target browser diverging from the
   docs (e.g. quota or locking), that is a **blocker requiring dev reconciliation**
   (browser-support policy Q62 vs VFS swap), never an in-memory fallback.
2. **Multi-tab editing demand** — sahpool gives no transparent concurrency; the design's
   Web-Locks tab-ownership policy (design §2.2) must hold in 5.1's multi-tab case. If the
   dev requires true multi-tab editing, the `opfs` VFS + COOP/COEP swap is a **policy
   decision** (embedding headers vs Safari floor), surfaced for dev reconciliation.
3. **COOP/COEP interaction with Q68 CSP/origin policy** — not applicable under sahpool
   (no headers required, verified §2.2); if the VFS swap is ever taken, header policy
   must pass Q68 review.
4. **Worker size/asset constraints** — `sqlite3.wasm` asset delivery and Workers-side
   serving of COI-free assets was **not measured** (no build run). Any deployment-size
   friction surfaces at 5.1/6.x, not silently.

## 6. Dev acceptance (recorded 2026-10-07, session 20261007_191409_68fc38)

The dev reviewed the design/evidence/ADR trio in conversation (2026-10-07, session
`20261007_191409_68fc38`) and stated approval: "everything makes sense to me. please record
that I approve." Per-item verdicts, keyed to the design's §-numbers:

| Accepted item | Design ref | Verdict |
|---|---|---|
| Driver: `@sqlite.org/sqlite-wasm` worker + `opfs-sahpool` VFS; single-connection discipline; Web-Locks tab ownership; Worker1/Promiser exclusion | §2.1–2.2 | ACCEPTED |
| Drizzle `sqlite-proxy` seam; same schema on both surfaces; real transactions through the callback; strict-typed bridge | §2.3 | ACCEPTED |
| Session lifecycle; Class 1 / Class 2 sahpool instances; eviction/incognito guardrails | §3 | ACCEPTED |
| Aggregate-root records; multi-root action boundary; purely-local record ids | §4 | ACCEPTED |
| One local transaction (data + change-row); WAL + exclusive locking (atomicity not dependent on it); reconcile safety net | §5 | ACCEPTED |
| Change-set envelope, ordering, grouping, `change_set_id` idempotency | §6 | ACCEPTED |
| Server application: one D1 batch, fail-stop, rejected bucket | §7 | ACCEPTED |
| Per-field base/rev three-way conflict resolution; mine/theirs/both-fork | §8 | ACCEPTED |
| Advisory server-clock leases (TTL 120 s, heartbeat 40 s); steal/takeover policy; offline-provisional | §9 | ACCEPTED |
| Server-authoritative working sets (Class 1/2/3) | §10 | ACCEPTED |
| Poll transport (focus / 30 s visible / reconnect); per-leased-record remote-apply pause; narrow alerts | §11 | ACCEPTED |
| Payload versions current + N-1; too-old → read-only/export | §12 | ACCEPTED |
| One-way local migrations with pre-migration snapshot | §13 | ACCEPTED |
| Tombstone retention (30 days) + all-replica-ACK GC + explicit purge | §14 | ACCEPTED |
| Q65/Q66/Q67 couplings consumed by reference | §15 | ACCEPTED |
| §16 spike-owned policy table (all rows: lease TTL, poll cadence, schema versioning, storage isolation, tombstone retention, WAL) | §16 | ACCEPTED |

**Conditions preserved:** acceptance is of the DESIGN and its proposed policy values — it is
NOT adoption of executed behaviour. All §4 NOT-RUN checks (real-browser OPFS persistence,
worker/proxy bridge, local transaction atomicity, sync round trip vs real D1, local
migrations/snapshot, tombstone/GC/erasure-directive) remain unexecuted and stay owned by
phase-005 task 5.1 (and Q65/Q56 designs for the server side). The ADR remains **Proposed**
pending those proofs and phase-007 reconciliation; the §16 policy values remain revisitable
at 5.1 with observed round-trip data per their stated rationale rows. No new capability,
deferred decision, or out-of-shortlist candidate arose in this acceptance — nothing routes to
a plan-understanding amendment or the backlog.
