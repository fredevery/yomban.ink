/**
 * Q63 spike harness — fixture schema definitions (Drizzle/D1 fixture ONLY).
 *
 * Two halves:
 *  1. The migration-fixture module type (`FixtureMigration`) used by
 *     src/proof.ts — the runner candidate consumes Drizzle-style statements as
 *     its "generated artifacts" stand-in.
 *  2. The Better Auth core_ base schema (core_user, core_session, core_account,
 *     core_verification) — Drizzle tables with prefixed sortable TEXT ids via
 *     the core-seam-style generateId in src/auth.ts. Property names are
 *     camelCase (better-auth field names); DB columns are snake_case.
 *
 * This file never becomes product code.
 */
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** A migration artifact fixture: Drizzle-generated statements + declared kind. */
export interface FixtureMigration {
  id: string;
  kind: 'schema' | 'data';
  /** For `schema` migrations: the statements of the whole file. */
  statements?: string[];
  /** For `data` migrations: ordered chunk groups, each a batch of statements. */
  chunks?: string[][];
}

/** Core-seam-style ID prefixes for Better Auth entities (Q11, PROVISIONAL pending Q40). */
export const idPrefixes = {
  user: 'usr',
  session: 'ses',
  account: 'acct',
  verification: 'vrf',
} as const;
export type AuthModel = keyof typeof idPrefixes;

/** Sortable id material: monotonic timestamp + random tail (ULID-shaped stand-in). */
export function idMaterial(now: number = Date.now()): string {
  // Crockford-ish base32 of ms timestamp, zero-padded to 10 chars (sortable),
  // followed by 12 random base32 chars.
  const alphabet = '0123456789abcdefghjkmnpqrstvwxyz';
  let ts = now;
  let tsPart = '';
  for (let i = 0; i < 10; i += 1) {
    tsPart = alphabet[ts % 32] + tsPart;
    ts = Math.floor(ts / 32);
  }
  tsPart = tsPart.padStart(10, '0');
  let rand = '';
  for (let i = 0; i < 12; i += 1) {
    rand += alphabet[Math.floor(Math.random() * 32)];
  }
  return tsPart + rand;
}

/** The Better Auth base schema, `core_`-prefixed, TEXT PKs — no INTEGER anywhere. */
export const coreUser = sqliteTable('core_user', {
  id: text('id').primaryKey(), // usr_<sortable>
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const coreSession = sqliteTable('core_session', {
  id: text('id').primaryKey(), // ses_<sortable>
  userId: text('user_id')
    .notNull()
    .references(() => coreUser.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const coreAccount = sqliteTable('core_account', {
  id: text('id').primaryKey(), // acct_<sortable>
  userId: text('user_id')
    .notNull()
    .references(() => coreUser.id),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  password: text('password'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const coreVerification = sqliteTable('core_verification', {
  id: text('id').primaryKey(), // vrf_<sortable>
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
