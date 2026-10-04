# Best Practices — Bindings (R2 / KV / queues)

Do/Don’t guardrails. Source: onboarding answers Q15, Q25, Q30, Q45, Q53, Q56, Q57, Q58, Q60.

## DO
- **Declare bindings in `wrangler.toml`/`.jsonc`** (D1, R2, KV, queues); a committed
  `.dev.vars.example` carries **non-secret** dev values.
- **Reach bindings only through core capability seams** — datastore, storage (R2), cache (KV),
  jobs (queues/cron), auth, observability. Datastore is **one** capability among several, not a
  uniform abstraction for database/storage/cache/queues/auth.
- **Cache writes trigger post-commit invalidation fan-out through core** — not ad-hoc direct KV
  access in modules.
- **Persist durable objects in R2** (Workers writable `/tmp` is request-local / non-persistent).
- **Manifest-declared queue consumers/cron** are wired by core at build.

## DON’T
- **DON’T** access Cloudflare bindings directly from module code.
- **DON’T** commit secrets — better-auth signing keys etc. go through the core secrets seam /
  `wrangler secret put`; `.dev.vars` is gitignored.
- **DON’T** assume KV visibility is immediate — KV is **eventually consistent**, and Cache API
  deletion is **local to its invoking data centre** (not a global purge). Hooks alone do not
  guarantee freshness (Q67 designs the guarantees).
- **DON’T** treat queue/`cron` wiring as exactly-once execution, or rely on unawaited request
  background work for durable business effects (Q66 owns retries/idempotency).
- **DON’T** author `wrangler` queue/cron entries by hand in module code.
