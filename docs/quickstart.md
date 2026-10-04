# Yomban.ink — Quickstart

> **Status: PLANNED — no implementation exists yet.** This project is at specification stage
> (greenfield). Every command, port and binding below is the *intended* design from Q14–Q16,
> not a working quickstart. The actual app/dev-server wiring is a **Q40/Q46 outcome**; nothing
> here should be treated as already designed. Sources: onboarding answers Q13–Q16, Q31, Q44, Q60.

## Prerequisites

- **Node.js** + **pnpm** (package manager; one lockfile at the repo root).
- **Cloudflare account** with **Wrangler** authenticated (`wrangler login`) for deploy.
- Local dev needs **no** cloud account beyond Wrangler: local D1/R2/KV/queues run via
  **Miniflare** under `wrangler dev`.

## Stack (Q13)

Cloudflare Workers (runtime/hosting) · Hono (base server engine) · better-auth (auth) ·
TypeScript (strict) · pnpm (package manager) · D1 + Drizzle (server datastore) · Vitest +
`@cloudflare/vitest-pool-workers` (tests) · Biome (lint/format) · tsc (typecheck).

## One-time setup (planned)

```bash
pnpm install                 # workspace install (one lockfile at the repo root)
cp .dev.vars.example .dev.vars   # then fill in the secret values locally (never committed)
# Bindings (D1/R2/KV/queues) are declared in wrangler.toml/.jsonc, not in .dev.vars.
```

## Run (planned)

```bash
pnpm dev        # wrangler dev: the Worker + local D1/R2/KV/queues via Miniflare.
                # Also runs a presentation dev server ONLY when the selected topology
                # needs one (the public-starter/admin wiring is a Q40/Q46 outcome).
```

**Ports** are declarable in project config, **not hardcoded** (Q14). The concrete dev-server
wiring (and whether a presentation dev server is needed at all) is decided by Q40/Q46.

## Quality gates (planned)

```bash
pnpm test        # Vitest + @cloudflare/vitest-pool-workers — real D1 at the boundary
pnpm lint        # Biome: format + lint + import-sort
pnpm typecheck   # tsc --noEmit
pnpm build       # build
```

## Database (planned, Q16/Q37/Q63)

```bash
pnpm migrate     # the core DB migration runner over module-owned migrations.
                 # Ordering/ledger/namespace/lock/SQL-execution mechanics are Q63's.
```

- **`migrate`** is the primary DB procedure. **`upgrade`** is **separate** platform
  package/code/contract work (Q49) — **not** the migration command.
- Local fixtures / reset / reseed use **per-module setup/teardown** (Q60).
- Backup/restore is documented and exercised under **Q65** (D1 export is the chosen DB backup
  direction; native R2 bucket versioning is unavailable).

## Deploy (planned, Q60)

GitHub Actions → `wrangler deploy`, across **staging / production** with per-project custom
domains and **preview deployments**. `pnpm deploy` deploys via Wrangler.

## Environment (Q15)

- Bindings (D1, R2, KV, queues) are declared in **`wrangler.toml`/`.jsonc`**.
- A committed **`.dev.vars.example`** carries the **non-secret** dev values only.
- **Secrets** (e.g. the better-auth signing key) are **never committed** — set them locally in
  `.dev.vars` (gitignored) and in the cloud via `wrangler secret put`.

## The golden path (Q7)

`scaffold → create module → migrate → dev → deploy` — from a clean environment to a deployed,
tested project, with **zero core edits**.
