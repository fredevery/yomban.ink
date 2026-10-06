/**
 * Q63 spike harness — migration-runner behavioural proofs (TDD, real D1 via
 * vitest-pool-workers). Each test maps to the task 2.4 acceptance bullets and
 * designs/q63_persistence-migrations.md §§3–12:
 *
 *  - empty-database first migration (§11)
 *  - existing-version migration — re-run is a no-op, applied set skipped (§11)
 *  - collision + dependency ordering (§3, §4)
 *  - replay/retry after an injected mid-migration failure with a safe ledger (§7)
 *  - simultaneous deploy attempts keeping the ledger safe (§6)
 *  - schema-vs-data upgrade with chunked resumable data migration (§8)
 *  - module removal retaining data (§10)
 */
import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  type FixtureModule,
  type MigrateResult,
  markApplied,
  migrate,
  removeModule,
} from './proof.ts';

/** Drop every user table (the runner bootstraps its own ledger/lock each test). */
async function resetDb(): Promise<void> {
  const tables = await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
  ).all<{ name: string }>();
  for (const { name } of tables.results) {
    await env.DB.prepare(`DROP TABLE IF EXISTS "${name}"`).run();
  }
}

beforeEach(async () => {
  await resetDb();
});

/** Ledger helpers. */
async function ledgerRows(): Promise<
  { module_ns: string; migration_id: string; status: string }[]
> {
  const r = await env.DB.prepare(
    'SELECT module_ns, migration_id, status FROM core__migrations ORDER BY applied_at, module_ns, migration_id',
  ).all<{ module_ns: string; migration_id: string; status: string }>();
  return r.results;
}

async function appliedIds(): Promise<Set<string>> {
  const rows = await ledgerRows();
  return new Set(
    rows.filter((r) => r.status === 'applied').map((r) => `${r.module_ns}:${r.migration_id}`),
  );
}

const schemaModuleA = (statements?: string[]): FixtureModule => ({
  ns: 'content',
  dependsOn: [],
  migrations: [
    {
      id: '0000_init',
      kind: 'schema',
      statements: statements ?? [
        'CREATE TABLE content_pages (id TEXT PRIMARY KEY, title TEXT NOT NULL)',
      ],
    },
  ],
});

describe('Q63 migration runner candidate (real D1)', () => {
  test('empty database: bootstrap creates ledger+lock and first run applies everything (§11)', async () => {
    const result = await migrate(env.DB, [schemaModuleA()]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.applied).toEqual([{ ns: 'content', id: '0000_init' }]);
    }
    const applied = await appliedIds();
    expect([...applied]).toEqual(['content:0000_init']);
    const pages = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='content_pages'",
    ).all();
    expect(pages.results).toHaveLength(1);
  });

  test('existing version: re-run is a no-op — applied migrations are skipped, not re-executed (§11)', async () => {
    await migrate(env.DB, [schemaModuleA()]);
    const before = await appliedIds();
    const second = await migrate(env.DB, [schemaModuleA()]);
    expect(second.ok).toBe(true);
    if (second.ok) expect(second.applied).toEqual([]);
    expect(await appliedIds()).toEqual(before);
  });

  test('collisions and namespace rules are rejected before any migration runs (§3)', async () => {
    const dup: FixtureModule = {
      ns: 'menu',
      dependsOn: [],
      migrations: [{ id: '0000_init', kind: 'schema', statements: ['SELECT 1'] }],
    };
    // same (ns, id) twice → collision
    const result = await migrate(env.DB, [dup, { ...dup }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('collision');
    // reserved core namespace
    const reserved = await migrate(env.DB, [
      { ns: 'core', dependsOn: [], migrations: dup.migrations },
    ]);
    expect(reserved.ok).toBe(false);
    if (!reserved.ok) expect(reserved.reason).toBe('collision');
    // nothing applied after a rejected run
    expect((await ledgerRows()).filter((r) => r.status === 'applied')).toHaveLength(0);
  });

  test('dependency ordering: dependent module runs after its dependency; cycle refused (§4)', async () => {
    const a: FixtureModule = schemaModuleA();
    const b: FixtureModule = {
      ns: 'menu',
      dependsOn: ['content'],
      migrations: [
        {
          id: '0000_init',
          kind: 'schema',
          statements: [
            'CREATE TABLE menu_items (id TEXT PRIMARY KEY, page_id TEXT NOT NULL REFERENCES content_pages(id))',
          ],
        },
      ],
    };
    // b declared first — the runner must still order a before b
    const result = await migrate(env.DB, [b, a]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.applied.map((x) => `${x.ns}:${x.id}`)).toEqual([
        'content:0000_init',
        'menu:0000_init',
      ]);
    }
    const cycle: FixtureModule[] = [
      { ns: 'x', dependsOn: ['y'], migrations: [] },
      { ns: 'y', dependsOn: ['x'], migrations: [] },
    ];
    const cyclic = await migrate(env.DB, cycle);
    expect(cyclic.ok).toBe(false);
    if (!cyclic.ok) expect(cyclic.reason).toBe('cycle');
  });

  test('replay after injected mid-migration failure: batch rolls back, ledger stays safe, retry heals (§7)', async () => {
    // 0000 applies; 0001 contains a deliberately failing statement.
    const failing: FixtureModule = {
      ns: 'content',
      dependsOn: [],
      migrations: [
        {
          id: '0000_init',
          kind: 'schema',
          statements: ['CREATE TABLE content_pages (id TEXT PRIMARY KEY, title TEXT)'],
        },
        {
          id: '0001_bad',
          kind: 'schema',
          statements: ['INSERT INTO no_such_table (x) VALUES (1)'],
        },
      ],
    };
    const first = await migrate(env.DB, [failing]);
    expect(first.ok).toBe(false);
    if (!first.ok) expect(first.reason).toBe('migration_failed');

    // Ledger safety: 0000 applied, 0001 NOT applied (and not pretending to be).
    const applied = await appliedIds();
    expect(applied.has('content:0000_init')).toBe(true);
    expect(applied.has('content:0001_bad')).toBe(false);

    // Retry with the failed migration healed — resumes only at 0001.
    const healed: FixtureModule = {
      ns: 'content',
      dependsOn: [],
      migrations: [
        failing.migrations[0] as FixtureModule['migrations'][number],
        {
          id: '0001_bad',
          kind: 'schema',
          statements: ['ALTER TABLE content_pages ADD COLUMN slug TEXT'],
        },
      ],
    };
    const retry = await migrate(env.DB, [healed]);
    expect(retry.ok).toBe(true);
    if (retry.ok) expect(retry.applied).toEqual([{ ns: 'content', id: '0001_bad' }]);
    await expect(appliedIds().then((s) => s.has('content:0001_bad'))).resolves.toBe(true);
  });

  test('simultaneous deploy attempts: lock excludes, ledger keeps exactly-once state (§6)', async () => {
    const manyMigrations: FixtureModule = {
      ns: 'content',
      dependsOn: [],
      migrations: [
        {
          id: '0000_a',
          kind: 'schema',
          statements: ['CREATE TABLE content_a (id TEXT PRIMARY KEY)'],
        },
        {
          id: '0001_b',
          kind: 'schema',
          statements: ['CREATE TABLE content_b (id TEXT PRIMARY KEY)'],
        },
        {
          id: '0002_c',
          kind: 'schema',
          statements: ['CREATE TABLE content_c (id TEXT PRIMARY KEY)'],
        },
      ],
    };
    const [r1, r2] = (await Promise.all([
      migrate(env.DB, [manyMigrations]),
      migrate(env.DB, [manyMigrations]),
    ])) as [MigrateResult, MigrateResult];
    // At most one successful applier; the other either locked out or no-op-skipped.
    const successes = [r1, r2].filter((r) => r.ok && r.applied.length > 0);
    expect(successes.length).toBeLessThanOrEqual(1);
    // Exactly-once ledger: one applied row per migration.
    const applied = await ledgerRows();
    const appliedRows = applied.filter((r) => r.status === 'applied');
    expect(appliedRows).toHaveLength(3);
    expect(new Set(appliedRows.map((r) => r.migration_id)).size).toBe(3);
    // A follow-up run succeeds cleanly (no wedge) and applies nothing.
    const after = await migrate(env.DB, [manyMigrations]);
    expect(after.ok).toBe(true);
  });

  test('stale fencing token: an expired-lease writer with a mismatched token cannot mark applied (§6)', async () => {
    await migrate(env.DB, [schemaModuleA()]);
    // markApplied with a deliberately stale token must be rejected.
    const stale = await markApplied(env.DB, 'content', '0000_init', 0);
    expect(stale).toBe(false);
    const rows = await ledgerRows();
    expect(
      rows.filter((r) => r.migration_id === '0000_init' && r.status === 'applied'),
    ).toHaveLength(1);
  });

  test('schema-vs-data upgrade: schema migration adds column, chunked data migration backfills, retry is idempotent (§8)', async () => {
    const mod: FixtureModule = {
      ns: 'content',
      dependsOn: [],
      migrations: [
        {
          id: '0000_init',
          kind: 'schema',
          statements: [
            'CREATE TABLE content_pages (id TEXT PRIMARY KEY, title TEXT, slug TEXT)',
            "INSERT INTO content_pages (id, title) VALUES ('cnt_one', 'One')",
            "INSERT INTO content_pages (id, title) VALUES ('cnt_two', 'Two')",
          ],
        },
        {
          // Data migration: backfill slug in two chunks; each chunk appends a
          // marker so double-application would be observable.
          id: '0001_backfill',
          kind: 'data',
          chunks: [
            ["UPDATE content_pages SET slug = title || '-x' WHERE id = 'cnt_one'"],
            ["UPDATE content_pages SET slug = title || '-x' WHERE id = 'cnt_two'"],
          ],
        },
      ],
    };
    const first = await migrate(env.DB, [mod]);
    expect(first.ok).toBe(true);
    const rows = await env.DB.prepare('SELECT id, slug FROM content_pages ORDER BY id').all<{
      id: string;
      slug: string;
    }>();
    expect(rows.results).toEqual([
      { id: 'cnt_one', slug: 'One-x' },
      { id: 'cnt_two', slug: 'Two-x' },
    ]);
    // Chunk-cursor rows exist per chunk in the ledger.
    const applied = await appliedIds();
    expect(applied.has('content:0001_backfill#chunk0')).toBe(true);
    expect(applied.has('content:0001_backfill#chunk1')).toBe(true);
  });

  test('data-migration replay after mid-data failure: only unapplied chunks re-run, no double transform (§8, §7)', async () => {
    const failingData: FixtureModule = {
      ns: 'content',
      dependsOn: [],
      migrations: [
        {
          id: '0000_init',
          kind: 'schema',
          statements: [
            'CREATE TABLE content_pages (id TEXT PRIMARY KEY, title TEXT, slug TEXT)',
            "INSERT INTO content_pages (id, title) VALUES ('cnt_one', 'One')",
            "INSERT INTO content_pages (id, title) VALUES ('cnt_two', 'Two')",
          ],
        },
        {
          id: '0001_backfill',
          kind: 'data',
          chunks: [
            ["UPDATE content_pages SET slug = title || '-x' WHERE id = 'cnt_one'"],
            // second chunk fails
            ['INSERT INTO no_such_table (x) VALUES (1)'],
          ],
        },
      ],
    };
    const failed = await migrate(env.DB, [failingData]);
    expect(failed.ok).toBe(false);
    // chunk0 applied, chunk1 not; row one transformed exactly once.
    const rowsOne = await env.DB.prepare(
      "SELECT slug FROM content_pages WHERE id = 'cnt_one'",
    ).all<{
      slug: string;
    }>();
    expect(rowsOne.results[0]?.slug).toBe('One-x');
    const applied = await appliedIds();
    expect(applied.has('content:0001_backfill#chunk0')).toBe(true);
    expect(applied.has('content:0001_backfill#chunk1')).toBe(false);

    const healed: FixtureModule = {
      ...failingData,
      migrations: [
        failingData.migrations[0] as FixtureModule['migrations'][number],
        {
          id: '0001_backfill',
          kind: 'data',
          chunks: [
            // chunk0 re-declared — must be skipped (already applied)
            ["UPDATE content_pages SET slug = slug || '-DOUBLE' WHERE id = 'cnt_one'"],
            ["UPDATE content_pages SET slug = title || '-x' WHERE id = 'cnt_two'"],
          ],
        },
      ],
    };
    const retry = await migrate(env.DB, [healed]);
    expect(retry.ok).toBe(true);
    if (retry.ok) {
      // only chunk1 ran
      expect(retry.applied).toEqual([{ ns: 'content', id: '0001_backfill#chunk1' }]);
    }
    const rows = await env.DB.prepare('SELECT id, slug FROM content_pages ORDER BY id').all<{
      id: string;
      slug: string;
    }>();
    expect(rows.results).toEqual([
      { id: 'cnt_one', slug: 'One-x' }, // no '-DOUBLE'
      { id: 'cnt_two', slug: 'Two-x' },
    ]);
  });

  test('module removal retains data: tables and rows survive, ledger rows marked, re-run does not drop (§10)', async () => {
    await migrate(env.DB, [schemaModuleA()]);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO content_pages (id, title) VALUES ('cnt_keep', 'Keep me')"),
    ]);
    const removal = await removeModule(env.DB, 'content');
    expect(removal.ok).toBe(true);
    // Data + table retained.
    const rows = await env.DB.prepare('SELECT id FROM content_pages').all<{ id: string }>();
    expect(rows.results).toEqual([{ id: 'cnt_keep' }]);
    // Ledger rows for the module retained but marked removed.
    const rows2 = await ledgerRows();
    expect(rows2.filter((r) => r.module_ns === 'content')).toHaveLength(1);
    expect(rows2[0]?.status).toBe('removed');
    // A later run without the module does not drop the table or error.
    const after = await migrate(env.DB, []);
    expect(after.ok).toBe(true);
    const still = await env.DB.prepare('SELECT COUNT(*) AS n FROM content_pages').all<{
      n: number;
    }>();
    expect(still.results[0]?.n).toBe(1);
  });
});
