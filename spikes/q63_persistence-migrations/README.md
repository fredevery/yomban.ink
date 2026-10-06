# Q63 spike harness — migrations + Better Auth prefixed TEXT IDs

Non-product spike harness for **plan 000 / phase 002 / task 2.4** — proves, on
real local D1 (Miniflare via `@cloudflare/vitest-pool-workers`), that:

1. **The migration-runner candidate works under actual D1 behavior**
   (`src/proof.ts` + `src/proof.test.ts`): empty-database bootstrap, re-run of
   an applied version (no-op), collision + dependency ordering, replay/retry
   after an injected mid-migration failure with safe ledger state, concurrent
   runner invocations (safe ledger, no double-apply), schema-vs-data upgrade
   sequencing, and module removal retaining data.
2. **Better Auth executes real flows through its Drizzle/D1 adapter with
   core-seam-generated entity-prefixed sortable TEXT IDs** (`src/auth.ts` +
   `src/auth.test.ts`): sign-up / sign-in / session read run through
   `better-auth`'s `drizzleAdapter` (better-auth **1.3.27**, drizzle-orm
   **0.45.3**), and the tests inspect **actual stored rows and sqlite_master
   DDL** — not just a `generateId` unit test — asserting every auth entity id
   and FK column is prefixed TEXT with no INTEGER primary key anywhere.

## Scope + provenance

- Design: `docs/plans/000_spike-plan/designs/q63_persistence-migrations.md`
- Evidence: `docs/plans/000_spike-plan/evidence/q63_persistence-migrations.md`
- Harness lives at repo-root `spikes/` (sibling of the committed q38/q54
  harnesses), NOT under `docs/plans/` — the task file's Files list names the
  `docs/plans/.../spikes/` path, which is stale relative to the established
  layout; reconciled here.
- This directory is a standalone package outside the repo pnpm workspace
  (own `package.json` + `pnpm-lock.yaml`). It is never product code.

## PROVISIONAL ID scheme (pending Q40)

`<entity prefix>_<sortable material>` — `usr_` / `ses_` / `acct_` / `vrf_` +
base32 monotonic-timestamp + random tail (ULID-shaped, `src/schema.ts`
`idMaterial()`). Pinned by task 2.4 as a temporary core-seam candidate; the
final selected ID scheme and the Q68 flows are re-run at plan reconciliation.

## Run

```bash
pnpm --dir spikes/q63_persistence-migrations install
pnpm --dir spikes/q63_persistence-migrations test      # vitest (real D1)
pnpm --dir spikes/q63_persistence-migrations typecheck # tsc --noEmit
pnpm --dir spikes/q63_persistence-migrations lint      # biome check
pnpm --dir spikes/q63_persistence-migrations build     # tsc
```

All five gates must exit 0 for task 2.4 verification. Observed outputs are
recorded in the evidence doc, never assumed.

## Notes

- Timestamps: better-auth passes `Date` objects; D1 rejects object binds, so
  the schema declares them `integer(..., { mode: 'timestamp' })` (unix epoch).
- Server-side session reads over a raw token use better-auth's `bearer()`
  plugin (`Authorization: Bearer <token>` → signed session cookie).
- The runner's ledger table (`core__migrations`) is a harness fixture — the
  real runner design is a Q63 Phase 7 outcome.
