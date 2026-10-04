# AGENTS.md — Yomban.ink

> Entry point. A fresh session should be able to orient from this file alone.
> Sources: onboarding answers (project-scope understanding file) + the spec set under
> `docs/specs/`. Orchestration via the Orca flow (see `docs/conventions/`).

## What this is

**Yomban.ink** is a **modular, composable application platform — not a CMS**. It provides
framework-free cross-cutting infrastructure and capability contracts for project-owned
applications; built-in content, administration and editing are ordinary modules. A consumer
can build a full CMS *on top of* the platform by composing modules. The name draws on Xhosa
*yombane* (“electric”), framed as “digital tattoos for the internet / electric ink.”

- Product & repository/domain name: **Yomban.ink** / `yomban.ink` (never bare “Yomban”).
- Owner / sole maintainer: **Fred Every** (`fred@fredevery.co.za`) — solo project.
- Status: **greenfield, specification stage** — no code yet. Onboarding baseline authored;
  the immediate next deliverable is **spike plan 000**.
- **Current Phase:** Onboarding (baseline) **complete** — seven baseline layers authored +
  approved (`docs/discovery/onboarding.md` `approved: true`). Next deliverable: **spike plan 000**
  via `/new-plan` at `docs/plans/000_...`. No plan is active yet.

## Doc map (read before coding)

| Doc | Layer | What it covers |
|---|---|---|
| `AGENTS.md` | L1 entry | This file — doc map, stack, commands, non-negotiables, status pointer |
| `docs/specs/000_index.md` … `008_operations-and-quality.md` | L2 architecture | The nine-spec platform narrative: product/MVP, module contract, data/migrations, clients/presentation, content/editing, CLI/distribution, security/identity, operations/quality |
| `docs/decisions/0001-platform-foundations.md`, `0002-onboarding-baseline.md` | L3 decisions | ADRs: consolidated locked-foundation decisions (with rejected alternatives) + the onboarding-run decisions |
| `docs/status/yomban-status.md` | L6 status | Current phase, open gates, immediate next step, milestone sequence |
| `docs/backlog/yomban-backlog.md` | L6 backlog | Deferred features + recorded housekeeping, value-ranked |
| `docs/conventions/` | L4 conventions | engineering-principles, git-workflow, subagent-conventions, architectural-patterns |
| `docs/best-practices/` | L5 best-practices | One guardrail doc per stack concern (typescript, worker, persistence, module-authoring, auth, testing, ids-and-enums, client, bindings) |
| `docs/quickstart.md` + `.dev.vars.example` | L7 quickstart | How to run it — **planned** (no implementation exists yet); the example carries non-secret dev values only |
| `docs/discovery/understanding.md` | source | Authoritative discovery record Q1–Q71 (+ amendments 001/002) |
| `docs/discovery/onboarding.md` | provenance | Durable onboarding log (ADR-0009): §5 groups, layers written, sign-off |
| `docs/reviews/001_spec-review.md` | review | Independent pre-implementation review (§9 = resolved decisions D1–D5/Q-A, folded) |
| `docs/plans/` | — | Implementation plans (per-plan dirs `NNN_<name>/`) — **not yet created; spike plan 000 is first** |

## Stack

- **Cloudflare Workers** runtime/hosting; **Hono** base server engine; **better-auth** for auth.
- **TypeScript** throughout (strict), **pnpm** package manager, **monorepo** (one deployment
  per consuming project — not multi-tenant).
- **D1 + Drizzle** for the server datastore (D1-only for MVP); a **browser-local SQLite store**
  (Q70 local-first capability) shares the same SQLite dialect and Drizzle schema.
- **Build-time composition** — modules are packages wired by the core at build; no runtime
  plugin loader. Package scope `@yomban-ink/*`; installation is **from a repo** (no npm publish).
- **Frontend independence is a locked invariant** — core services, shared contracts and headless
  clients carry no direct/transitive presentation-framework dependency. No public-site starter,
  dashboard, overlay controller or panel implementation is selected yet.
- Tests: **Vitest + `@cloudflare/vitest-pool-workers`** (real D1 at the boundary); lint/format:
  **Biome**; typecheck: **tsc**.

## Commands

> **Planned — no implementation exists yet** (Q14). These are the intended pnpm workspace
> scripts; the actual app/dev-server wiring is a Q40/Q46 outcome. See `docs/quickstart.md`.

```bash
pnpm install            # workspace install (one lockfile at the repo root)
pnpm dev                # wrangler dev (Worker + local D1/R2/KV/queues via Miniflare),
                        # plus a presentation dev server only when the topology needs one
pnpm test               # vitest + @cloudflare/vitest-pool-workers (real D1)
pnpm lint               # biome check (format + lint + import-sort)
pnpm typecheck          # tsc --noEmit
pnpm migrate            # core DB migration runner over module-owned migrations (Q37/Q63)
pnpm build              # build
pnpm deploy             # wrangler deploy (GitHub Actions → wrangler in CI)
```

## Non-negotiables (invariant; ceiling before the conventions layer)

1. **Docs-first** — no implementation before the spec/plan says so.
2. **Build-time composition only** — no runtime plugin loading.
3. **Module-owned Drizzle/D1 schema + a core migration runner.** Modules never access
   Cloudflare bindings or secrets directly — only through core service/capability seams.
4. **TypeScript strict — no `any`, no `export *`.** Explicit error handling.
5. **TDD** — tests before code; exercise real code at the right mock boundary (real D1 via
   `vitest-pool-workers`).
6. **Enums are module-owned, PascalCase `Key = 'Key'`, aggregated platform-wide at build** into
   a derived artifact (no central registry). Permission keys are `<ModuleNamespace>:<Member>`.
7. **Prefixed, sortable, URL-safe TEXT ids with an entity-type prefix** (e.g. `pg_<ulid|uuidv7>`)
   via one core id-service seam — **no INTEGER auto-increment primary keys**.
8. **Frontend independence is locked** — core/contracts/headless clients have no direct or
   transitive presentation dependency (incl. Svelte/SvelteKit and htmx); UI facets are optional.
9. **Unit-of-work atomicity = one D1 database + one prepared-statement batch** — never claimed
   across databases, R2, queues or cache purges.
10. **One task → one scoped commit; conventional commits; direct-to-`main`.** Commits are
    dev-triggered only — the agent stages and proposes, the dev commits.
11. **Product references always read “Yomban.ink”** (never bare “Yomban”).

## How to work here

- **Human-in-the-middle.** No changes without approval; a gate before each task.
- **Plan-first always** — the Orca flow: plan → phase → task, tracked on the board **and** in
  `docs/plans/`. Review is target-specific (plan/phase docs cap at 2 passes; task output to zero).
- **Fresh subagent per task, serial only.** See `docs/conventions/subagent-conventions.md`.
- **Deferred decisions → the backlog**, never silently dropped. The backlog is a board column.
