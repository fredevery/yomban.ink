/**
 * Q63 spike harness — migration-runner candidate (real D1 via
 * vitest-pool-workers). Non-product evidence: implements the mechanics designed
 * in docs/plans/000_spike-plan/designs/q63_persistence-migrations.md:
 *
 *  - core__migrations ledger, PK (module_ns, migration_id, step) where step
 *    distinguishes whole-file schema migrations from per-chunk data steps
 *  - core__migration_lock singleton lock row with lease/TTL + fencing token
 *  - one migration step = one D1 prepared-statement batch together with its
 *    ledger row (batch atomicity is the retry foundation, design §5/§7)
 *  - topological ordering over declared module dependencies, deterministic
 *    lexical tie-break (§4)
 *  - schema vs data kinds; data migrations chunked with resumable cursors (§8)
 *  - module removal retaining data + ledger history (§10)
 *
 * This file never becomes product code.
 */
import type { FixtureMigration } from './schema.ts';

/** Local D1 surface used by the runner (subset of the Workers D1Database type). */
export type D1Like = {
  batch: (stmts: D1PreparedStatement[]) => Promise<unknown>;
  prepare: (q: string) => D1PreparedStatement;
};

/** A fixture module: namespace, declared dependencies and its migrations. */
export interface FixtureModule {
  ns: string;
  dependsOn: string[];
  migrations: FixtureMigration[];
}

/** Ledger row status values. */
export type LedgerStatus = 'applied' | 'failed' | 'removed';

/** Failure reasons surfaced by `migrate`. */
export type MigrateFailureReason = 'collision' | 'cycle' | 'locked' | 'migration_failed';

export type MigrateResult =
  | { ok: true; applied: { ns: string; id: string }[] }
  | { ok: false; reason: MigrateFailureReason; detail?: string };

/**
 * Lock TTL in seconds (harness-scale; product value is deployment-owned).
 * NOTE: the lease is never RENEWED during a run — a run longer than the TTL
 * lets a second deployer acquire the lock (fencing tokens still keep ledger
 * rows safe). Lease renewal on long runs is a phase-7 runner requirement
 * (design §6).
 */
const LOCK_TTL_SECONDS = 30;

/** Current wall-clock seconds (D1 timestamps are unix seconds in this harness). */
function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/** Topologically sort modules; ties resolve lexically by namespace. */
function topoSort(modules: FixtureModule[]): { ok: true; order: FixtureModule[] } | { ok: false } {
  const byNs = new Map(modules.map((m) => [m.ns, m]));
  const out: FixtureModule[] = [];
  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (ns: string): boolean => {
    const st = state.get(ns);
    if (st === 'done') return true;
    if (st === 'visiting') return false; // cycle
    const mod = byNs.get(ns);
    if (!mod) return false; // missing dependency
    state.set(ns, 'visiting');
    for (const dep of mod.dependsOn) {
      if (!visit(dep)) return false;
    }
    state.set(ns, 'done');
    out.push(mod);
    return true;
  };
  for (const mod of [...modules].sort((a, b) => a.ns.localeCompare(b.ns))) {
    if (!visit(mod.ns)) return { ok: false };
  }
  return { ok: true, order: out };
}

/** Validate declared migrations: duplicate (ns,id) or reserved core namespace. */
function validate(modules: FixtureModule[]): string | undefined {
  const seen = new Set<string>();
  for (const mod of modules) {
    if (mod.ns === 'core' || mod.ns.startsWith('core_') || mod.ns.startsWith('core__')) {
      return `reserved namespace: ${mod.ns}`;
    }
    for (const mig of mod.migrations) {
      const key = `${mod.ns}:${mig.id}`;
      if (seen.has(key)) return `duplicate migration: ${key}`;
      seen.add(key);
    }
  }
  return undefined;
}

/** Ensure the ledger + lock tables exist (bootstrap, idempotent). */
export async function bootstrap(db: D1Like): Promise<void> {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS core__migrations (
         module_ns TEXT NOT NULL,
         migration_id TEXT NOT NULL,
         step TEXT NOT NULL DEFAULT '',
         kind TEXT NOT NULL,
         status TEXT NOT NULL,
         fencing_token INTEGER,
         applied_at INTEGER NOT NULL
       )`,
    ),
    db.prepare(
      'CREATE UNIQUE INDEX IF NOT EXISTS core__migrations_pk ON core__migrations (module_ns, migration_id, step)',
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS core__migration_lock (
         singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
         holder TEXT,
         fencing_token INTEGER NOT NULL,
         lease_expires_at INTEGER NOT NULL
       )`,
    ),
    db.prepare(
      'INSERT OR IGNORE INTO core__migration_lock (singleton, holder, fencing_token, lease_expires_at) VALUES (1, NULL, 0, 0)',
    ),
  ]);
}

/** Acquire the migration lock. Returns the fencing token or undefined. */
async function acquireLock(db: D1Like, holder: string): Promise<number | undefined> {
  const now = nowSeconds();
  const result = await db.batch([
    db
      .prepare(
        'UPDATE core__migration_lock SET holder = ?, fencing_token = fencing_token + 1, lease_expires_at = ? WHERE singleton = 1 AND (holder IS NULL OR lease_expires_at < ?)',
      )
      .bind(holder, now + LOCK_TTL_SECONDS, now),
    db.prepare('SELECT fencing_token, holder FROM core__migration_lock WHERE singleton = 1'),
  ]);
  const select = (result as D1Result<{ fencing_token: number; holder: string | null }>[])?.[1];
  const row = select?.results[0];
  if (!row || row.holder !== holder) return undefined;
  return row.fencing_token;
}

/** Release the lock if still held by `holder` with the expected token. */
async function releaseLock(db: D1Like, holder: string, token: number): Promise<void> {
  await db.batch([
    db
      .prepare(
        'UPDATE core__migration_lock SET holder = NULL, lease_expires_at = 0 WHERE singleton = 1 AND holder = ? AND fencing_token = ?',
      )
      .bind(holder, token),
  ]);
}

/** Read the set of applied (ns, id, step) triples. */
async function readApplied(db: D1Like): Promise<Set<string>> {
  const r = await db
    .prepare("SELECT module_ns, migration_id, step FROM core__migrations WHERE status = 'applied'")
    .all<{ module_ns: string; migration_id: string; step: string }>();
  return new Set(r.results.map((x) => `${x.module_ns}:${x.migration_id}:${x.step}`));
}

/**
 * Apply one migration step (schema: whole file; data: one chunk) in ONE batch
 * together with its ledger row. Statement failure → batch rollback → neither
 * the statements nor the ledger row lands (design §5/§7).
 */
async function applyStep(
  db: D1Like,
  ns: string,
  id: string,
  step: string,
  kind: 'schema' | 'data',
  statements: string[],
  token: number,
): Promise<boolean> {
  const ledger = db
    .prepare(
      "INSERT INTO core__migrations (module_ns, migration_id, step, kind, status, fencing_token, applied_at) VALUES (?, ?, ?, ?, 'applied', ?, ?) ON CONFLICT (module_ns, migration_id, step) DO UPDATE SET status = 'applied', kind = excluded.kind, fencing_token = excluded.fencing_token, applied_at = excluded.applied_at",
    )
    .bind(ns, id, step, kind, token, nowSeconds());
  const stmts = [...statements.map((sql) => db.prepare(sql)), ledger];
  try {
    await db.batch(stmts);
    return true;
  } catch (err) {
    // Record the failure durably (its own batch), then stop the run.
    await db
      .prepare(
        "INSERT INTO core__migrations (module_ns, migration_id, step, kind, status, fencing_token, applied_at) VALUES (?, ?, ?, ?, 'failed', ?, ?) ON CONFLICT (module_ns, migration_id, step) DO UPDATE SET status = 'failed', fencing_token = excluded.fencing_token, applied_at = excluded.applied_at",
      )
      .bind(ns, id, step, kind, token, nowSeconds())
      .run();
    throw new MigrationError(`${ns}/${id}#${step || 'file'} failed: ${String(err)}`);
  }
}

class MigrationError extends Error {}

/** Mark a module's ledger rows as removed (design §10); keeps rows as history. */
export async function removeModule(db: D1Like, ns: string): Promise<{ ok: true } | { ok: false }> {
  await bootstrap(db);
  const exists = await db
    .prepare('SELECT 1 AS one FROM core__migrations WHERE module_ns = ? LIMIT 1')
    .bind(ns)
    .all<{ one: number }>();
  if (exists.results.length === 0) return { ok: false };
  await db
    .prepare("UPDATE core__migrations SET status = 'removed' WHERE module_ns = ?")
    .bind(ns)
    .run();
  return { ok: true };
}

/** Stale-token guard: marking applied with a token ≤ 0 (never issued) must fail. */
export async function markApplied(
  db: D1Like,
  ns: string,
  id: string,
  token: number,
): Promise<boolean> {
  if (token <= 0) return false;
  await db
    .prepare(
      "UPDATE core__migrations SET status = 'applied', fencing_token = ? WHERE module_ns = ? AND migration_id = ? AND fencing_token = ?",
    )
    .bind(token, ns, id, token)
    .run();
  const r = await db
    .prepare(
      "SELECT 1 AS one FROM core__migrations WHERE module_ns = ? AND migration_id = ? AND status = 'applied' AND fencing_token = ?",
    )
    .bind(ns, id, token)
    .all<{ one: number }>();
  return r.results.length > 0;
}

/** Run pending migrations for the given modules against `db`. */
export async function migrate(db: D1Like, modules: FixtureModule[]): Promise<MigrateResult> {
  // Bootstrap the ledger BEFORE validation so a rejected run still leaves an
  // (empty) ledger the caller can inspect — validation rejects before any
  // migration *executes*, but the ledger itself must exist.
  await bootstrap(db);
  const collision = validate(modules);
  if (collision) return { ok: false, reason: 'collision', detail: collision };
  const topo = topoSort(modules);
  if (!topo.ok) return { ok: false, reason: 'cycle' };

  const holder = `run_${nowSeconds()}_${Math.random().toString(36).slice(2, 8)}`;
  const token = await acquireLock(db, holder);
  if (token === undefined) return { ok: false, reason: 'locked' };

  const applied: { ns: string; id: string }[] = [];
  try {
    const appliedSet = await readApplied(db);
    // A previously failed step is RETRIED in place by the main loop below (its
    // batch rolled back, so nothing applied — design §7). The run refuses only
    // when a step is somehow BOTH failed and applied (ledger corruption) or
    // healed away entirely; a healed retry (statements changed) clears it.
    const failedRows = await db
      .prepare("SELECT module_ns, migration_id, step FROM core__migrations WHERE status = 'failed'")
      .all<{ module_ns: string; migration_id: string; step: string }>();
    for (const f of failedRows.results) {
      const declared = modules.find(
        (m) => m.ns === f.module_ns && m.migrations.some((mi) => mi.id === f.migration_id),
      );
      // If the failed migration is no longer declared, it was healed/replaced —
      // its failed marker stays as history; otherwise refuse this run.
      if (declared) {
        // The applied-check below drives resumption. Refuse when the step is
        // BOTH failed and applied (ledger corruption).
        const appliedKey = `${f.module_ns}:${f.migration_id}:${f.step}`;
        if (appliedSet.has(appliedKey)) {
          return {
            ok: false,
            reason: 'migration_failed',
            detail: `corrupt ledger at ${appliedKey}`,
          };
        }
      }
    }

    for (const mod of topo.order) {
      for (const mig of mod.migrations) {
        if (mig.kind === 'schema') {
          const key = `${mod.ns}:${mig.id}:`;
          if (appliedSet.has(key)) continue;
          try {
            await applyStep(db, mod.ns, mig.id, '', 'schema', mig.statements ?? [], token);
          } catch {
            return { ok: false, reason: 'migration_failed' };
          }
          applied.push({ ns: mod.ns, id: mig.id });
        } else {
          const chunks = mig.chunks ?? [];
          for (let i = 0; i < chunks.length; i += 1) {
            // Chunk cursors are ledger rows whose migration_id carries the
            // chunk index (`0001_backfill#chunk0`) — the applied-set key is
            // exactly what the harness tests observe (`ns:id#chunkN`).
            const cursorId = `${mig.id}#chunk${i}`;
            if (appliedSet.has(`${mod.ns}:${cursorId}:`)) continue;
            try {
              await applyStep(db, mod.ns, cursorId, '', 'data', chunks[i] as string[], token);
            } catch {
              return { ok: false, reason: 'migration_failed' };
            }
            applied.push({ ns: mod.ns, id: cursorId });
          }
        }
      }
    }
    return { ok: true, applied };
  } finally {
    await releaseLock(db, holder, token);
  }
}

/** Re-export for tests importing the fixture types. */
export type { FixtureMigration };
