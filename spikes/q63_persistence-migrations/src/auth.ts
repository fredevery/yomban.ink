/**
 * Q63 spike harness — Better Auth over real D1 (better-auth drizzleAdapter).
 * Non-product evidence: proves the PROVISIONAL core-seam-style ID scheme
 * (per-entity prefixes: usr_/ses_/acct_/vrf_) works end-to-end through real
 * sign-up / sign-in / session flows, with stored D1 rows carrying prefixed,
 * sortable TEXT ids and no INTEGER primary keys anywhere.
 *
 * The D1 binding comes from the vitest-pool-workers `cloudflare:test` env —
 * the same real Miniflare D1 the tests assert against.
 *
 * This file never becomes product code.
 */
import { env } from 'cloudflare:test';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/d1';
import {
  type AuthModel,
  coreAccount,
  coreSession,
  coreUser,
  coreVerification,
  idMaterial,
  idPrefixes,
} from './schema.ts';

/**
 * PROVISIONAL (pending Q40): core-seam-style generateId.
 * Emits `<modelPrefix>_<sortable material>` — e.g. `usr_<base32 ts+rand>`,
 * `ses_...`, `acct_...`, `vrf_...`.
 * Prefix map lives in src/schema.ts (single source for tests + auth).
 */
export function generateId({ model }: { model: string }): string {
  const prefix = idPrefixes[model as AuthModel] ?? 'gen';
  return `${prefix}_${idMaterial()}`;
}

export const auth = betterAuth({
  appName: 'q63-persistence-migrations-spike',
  secret: 'q63-spike-secret-not-a-real-credential',
  basePath: '/api/auth',
  plugins: [
    // bearer: converts `Authorization: Bearer <session token>` into the
    // signed session cookie so server-side getSession() works over the token.
    bearer(),
  ],
  database: drizzleAdapter(drizzle(env.DB), {
    provider: 'sqlite',
    usePlural: false,
    schema: {
      user: coreUser,
      session: coreSession,
      account: coreAccount,
      verification: coreVerification,
    },
  }),
  session: {
    storeSessionInDatabase: true,
  },
  advanced: {
    database: {
      // PROVISIONAL ID scheme (pending Q40): per-entity prefixed, sortable,
      // URL-safe TEXT ids via the core id-service seam shape.
      generateId,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
