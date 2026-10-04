# Best Practices — Worker (Hono / Cloudflare Workers)

Do/Don’t guardrails. Source: onboarding answers Q8, Q12, Q13, Q25, Q30, Q40, Q53, Q55, Q56.

## DO
- **Hono is the base server engine**; `apps/api` hosts Hono and mounts each installed module’s
  declared routes at its declared base path.
- **Lean route files** — handlers delegate to module/core services; domain operations live
  outside any frontend server-action/router convention.
- **Validate configuration before serving each effective runtime configuration** — “boot” is an
  initialization/validation boundary (not a long-lived process start); invalid config fails
  safely with diagnostics.
- **No binding I/O at module initialization**; do **not** globally cache a binding-derived client
  (Workers can retain stale secrets across isolates). Keep env/session/transaction/trace context
  **invocation-scoped**.
- **Log via the core logger/tracer/metrics seam** (pluggable sinks) — never raw `console` or
  direct Cloudflare bindings.
- **Manifest-declared queues/cron** are wired by core at build; consumers do not author
  `wrangler` queue/cron entries directly.
- **Writable `/tmp` is request-local / non-persistent** — persistent objects go through R2.

## DON’T
- **DON’T** do binding I/O or secret reads at module scope/init.
- **DON’T** rely on an unawaited promise or short-lived request background work for **durable**
  business work (use the jobs/queue seam).
- **DON’T** let request context leak through globals between invocations.
- **DON’T** weaken CSP/security headers for a presentation library.
