# migrations/ — Q63 spike harness Drizzle migrations

Generated artifacts from `npx drizzle-kit generate` (drizzle-kit 0.31.11) over
`src/schema.ts` (`dialect: 'sqlite'`, `out: './migrations'` per `drizzle.config.ts`).

- `0000_luxuriant_virginia_dare.sql` — initial schema for the Better Auth `core_`
  tables: `core_user`, `core_session`, `core_account`, `core_verification`.
  Every primary key and FK column is `text` (prefixed, sortable, URL-safe) —
  **no INTEGER primary keys** (AGENTS.md non-negotiable #7). Timestamps are
  unix-epoch INTEGER columns via Drizzle's `timestamp` mode.
- `meta/` — drizzle-kit journal + snapshots.

## PROVISIONAL ID scheme (pending Q40)

`<entity prefix>_<sortable material>`: `usr_`, `ses_`, `acct_`, `vrf_` +
base32 timestamp+random material (ULID-shaped). This is a temporary
core-seam candidate pinned by task 2.4; the final selected ID and the Q68
flows are re-run at plan reconciliation. The runner-ledger table
(`core__migrations`) used by `src/proof.ts` is a fixture stand-in, also
non-product.

## Never deployed

This harness is local-only evidence (`wrangler.jsonc` points at a local
Miniflare D1 binding). Do not run `wrangler deploy` from this directory.
