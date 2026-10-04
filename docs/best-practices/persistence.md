# Best Practices — Persistence (D1 / Drizzle)

Do/Don’t guardrails. Source: onboarding answers Q10, Q11, Q37, Q45, Q52, Q63, Q70.

## DO
- **Drizzle is the schema + query language**; each module owns its tables and migrations.
- **Declare entities in TypeScript**; infer stored types from the schema.
- **D1-only for MVP**; manifests **name** the required D1 database/binding requirements they
  consume (named, not a datastore-agnostic schema).
- **Use prefixed, sortable, URL-safe TEXT ids** (`pg_<ulid|uuidv7>`) via the core id-service
  seam — no INTEGER PKs.
- **Route all writes through the core unit-of-work seam** over D1 batch; modules declare
  transactional boundaries.
- **Execute Drizzle-generated migration SQL through the Q63-approved runner path** (the raw-SQL
  prohibition is not a reason to omit migrations).
- **Declare aggregate roots** (the Q70 sync/lock unit) and the child tables riding under each —
  locks/revisions/conflicts attach to the root; children inherit.
- **The client-local store** uses the **same `sqliteTable` schema** through the core datastore
  capability seam (browser SQLite over OPFS) — same dialect, one schema.

## DON’T
- **DON’T write raw SQL outside Drizzle.**
- **DON’T** assume atomicity beyond **one D1 database + one prepared-statement batch** — never
  across databases, R2, queues or cache purges.
- **DON’T** use a pre-read value as if it were atomic with a later write; use conditional
  SQL/constraints for read-dependent invariants.
- **DON’T** add a query-builder abstraction above Drizzle, or a datastore-agnostic schema.
- **DON’T** put media records in the core base schema — an ordinary media module owns them (core
  provides R2 infrastructure + upload/transform contracts).
- **DON’T** let `remove` silently discard existing data (Q63 data-retention safety).
