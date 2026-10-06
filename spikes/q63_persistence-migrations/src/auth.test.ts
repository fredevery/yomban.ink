/**
 * Q63 spike harness — Better Auth over real D1 (vitest-pool-workers), TDD.
 *
 * Proves the provisional ID scheme from the task 2.4 acceptance bullets:
 * Better Auth configured via its drizzleAdapter over the `core_`-prefixed
 * schema (src/schema.ts) with a core-seam-style `generateId` that emits
 * per-entity prefixed, sortable, URL-safe TEXT ids
 * (`<prefix>_<sortable>` e.g. `usr_...`, `ses_...`). PROVISIONAL pending Q40.
 *
 * Every flow runs the REAL better-auth sign-up / sign-in / session path —
 * no adapter mocks — then asserts against actual D1 rows and sqlite_master
 * that no auth column holds an integer PK or an unprefixed id.
 */
import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, test } from 'vitest';
import { auth } from './auth.ts';

/** ID prefix scheme under test — imported single-source (PROVISIONAL pending Q40). */
import { idPrefixes } from './schema.ts';

const EXPECTED_PREFIXES = idPrefixes;

/** A prefixed id looks like `<prefix>_<sortable material>` (regex on the whole string). */
function expectPrefixed(value: unknown, prefix: string): void {
  expect(typeof value).toBe('string');
  const id = value as string;
  expect(id.startsWith(`${prefix}_`)).toBe(true);
  // no INTEGER anywhere: at least the underscore separator present, rest alnum
  expect(id).toMatch(new RegExp(`^${prefix}_[0-9a-z]+$`));
}

/** Re-run the Q63 migration fixture so the auth tables exist for this test file. */
async function ensureAuthSchema(): Promise<void> {
  await env.DB.batch([
    env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS core_user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    ),
    env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS core_session (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES core_user(id),
        token TEXT NOT NULL UNIQUE,
        expires_at INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    ),
    env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS core_account (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES core_user(id),
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        password TEXT,
        access_token_expires_at INTEGER,
        refresh_token_expires_at INTEGER,
        scope TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    ),
    env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS core_verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER,
        updated_at INTEGER
      )`,
    ),
  ]);
}

beforeEach(async () => {
  await ensureAuthSchema();
});

describe('Q63 Better Auth prefixed TEXT ids over real D1 (PROVISIONAL scheme)', () => {
  test('sign-up → user + account rows with prefixed TEXT ids and no integer PK', async () => {
    const res = await auth.api.signUpEmail({
      body: {
        name: 'Fred Every',
        email: 'fred+q63@yomban.ink',
        password: 'correct horse battery staple 42',
      },
    });
    expect(res.user).toBeDefined();
    expectPrefixed(res.user.id, EXPECTED_PREFIXES.user);

    // D1 row: id is the prefixed TEXT id the API returned.
    const userRows = await env.DB.prepare('SELECT id, email FROM core_user WHERE id = ?')
      .bind(res.user.id)
      .all<{ id: string; email: string }>();
    expect(userRows.results).toHaveLength(1);
    expect(userRows.results[0]?.id).toBe(res.user.id);
    expect(userRows.results[0]?.email).toBe('fred+q63@yomban.ink');

    // credential account row: prefixed id, prefixed userId FK
    const accounts = await env.DB.prepare(
      'SELECT id, user_id, provider_id, password FROM core_account WHERE user_id = ?',
    )
      .bind(res.user.id)
      .all<{ id: string; user_id: string; provider_id: string; password: string | null }>();
    expect(accounts.results).toHaveLength(1);
    expectPrefixed(accounts.results[0]?.id, EXPECTED_PREFIXES.account);
    expect(accounts.results[0]?.user_id).toBe(res.user.id);
    expectPrefixed(accounts.results[0]?.user_id, EXPECTED_PREFIXES.user);
    expect(accounts.results[0]?.provider_id).toBe('credential');
    expect(accounts.results[0]?.password).toBeDefined(); // hashed, never plaintext
  });

  test('sign-in → session row with prefixed id and prefixed userId FK; session read resolves', async () => {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: 'Session Tester',
        email: 'session+q63@yomban.ink',
        password: 'another long password 123',
      },
    });
    const res = await auth.api.signInEmail({
      body: { email: 'session+q63@yomban.ink', password: 'another long password 123' },
    });
    expect(res.token).toBeDefined();
    expectPrefixed(res.user.id, EXPECTED_PREFIXES.user);
    expect(res.user.id).toBe(user.id);

    // session row in D1: prefixed id + prefixed userId FK
    const sessions = await env.DB.prepare(
      'SELECT id, user_id, token FROM core_session WHERE user_id = ?',
    )
      .bind(user.id)
      .all<{ id: string; user_id: string; token: string }>();
    expect(sessions.results.length).toBeGreaterThanOrEqual(1);
    const row = sessions.results[sessions.results.length - 1] as (typeof sessions.results)[number];
    expectPrefixed(row.id, EXPECTED_PREFIXES.session);
    expectPrefixed(row.user_id, EXPECTED_PREFIXES.user);
    expect(row.token).toBe(res.token);

    // session read through better-auth resolves the same user
    const read = await auth.api.getSession({
      headers: new Headers({ authorization: `Bearer ${res.token}` }),
    });
    expect(read?.user?.id).toBe(user.id);
  });

  test('sqlite_master: every auth table PK and FK column is TEXT — no INTEGER keys', async () => {
    await auth.api.signUpEmail({
      body: {
        name: 'Schema Probe',
        email: 'schema+q63@yomban.ink',
        password: 'probe password 456',
      },
    });
    for (const table of ['core_user', 'core_session', 'core_account', 'core_verification']) {
      const ddl = await env.DB.prepare(
        'SELECT sql FROM sqlite_master WHERE type = "table" AND name = ?',
      )
        .bind(table)
        .all<{ sql: string }>();
      expect(ddl.results).toHaveLength(1);
      const sql = ddl.results[0]?.sql ?? '';
      // No INTEGER PRIMARY KEY anywhere in any auth table.
      expect(sql.toUpperCase()).not.toContain('INTEGER PRIMARY KEY');
      // id is a TEXT primary key.
      expect(sql).toMatch(/id TEXT PRIMARY KEY/i);
    }
  });

  test('verification-style ids: generateId emits the pinned prefix per entity (incl. vrf_)', async () => {
    const { generateId } = await import('./auth.ts');
    expectPrefixed(generateId({ model: 'user' }), EXPECTED_PREFIXES.user);
    expectPrefixed(generateId({ model: 'session' }), EXPECTED_PREFIXES.session);
    expectPrefixed(generateId({ model: 'account' }), EXPECTED_PREFIXES.account);
    expectPrefixed(generateId({ model: 'verification' }), EXPECTED_PREFIXES.verification);
    // sortable material present
    const material = generateId({ model: 'user' }).slice('usr_'.length);
    expect(material.length).toBeGreaterThanOrEqual(16);
  });
});
