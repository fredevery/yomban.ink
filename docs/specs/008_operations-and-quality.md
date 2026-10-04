# Yomban.ink: operations and quality

Status: Specification baseline. Delivery and quality directions are locked; Q65–Q67 remain affected-work design gates, not selected solutions. Q68 security details are governed by [Security and identity](007_security-and-identity.md).

## Purpose

This specification covers operational quality, engineering practice, observability, jobs, caching, delivery and recovery. It records MVP-verifiable requirements and the owner/evidence/blocker for the deferred operational gates. It is not an implementation plan or an ADR. The Answer lines in [the historical discovery record](../discovery/understanding.md) remain authoritative over any conflict. [Q14–Q16, Q20–Q27, Q55–Q62, Q65–Q69]

## Locked decisions and non-negotiable constraints

- Product and repository/domain names are both Yomban.ink / `yomban.ink`; the name draws on Xhosa *yombane* (“electric”), framed as “digital tattoos for the internet / electric ink.” Sole owner/maintainer: Fred Every (`fred@fredevery.co.za`); the project is greenfield and solo. [Q2–Q4]
- TDD: tests first; exercise real code at the appropriate mock boundary, including real D1 through `@cloudflare/vitest-pool-workers`. Keep routes/handlers lean, separate schema/types from logic, enforce dependency direction (modules → core; module-to-module only through declared manifest dependencies), use explicit error handling, and do not use `any`. [Q20, Q36]
- Use conventional commits, one scoped commit per task, and direct-to-`main` for this solo repository. Branch naming is optional for larger plans. [Q21]
- Non-negotiables include docs-first work; build-time composition/no runtime plugins; module-owned Drizzle/D1 schema plus core migration runner; strict TypeScript; no `any` or `export *`; TDD; and module-owned PascalCase `Key = 'Key'` enums aggregated platform-wide. Frontend independence is locked; chosen backend stack/D1 are not a claim of universal portability. [Q22, Q25]
- Delegation follows the Orca flow: fresh subagent per task, serially; reviewers receive just-enough context. The platform's AI-scaffolding command is separate. [Q23, Q31]
- Planned guardrail documents are one per concern: TypeScript, Worker (Hono/Workers), persistence (D1/Drizzle), module authoring, auth (better-auth), testing (Vitest/pool-workers), IDs/enums, client, and bindings (R2/KV/queues). Public-starter/dashboard/panel guides are optional after their implementation choices; htmx guidance remains candidate-evaluation-only unless selected. [Q24, Q40, Q46, Q47]
- Prohibited: `any`, `export *`, raw SQL outside Drizzle, runtime plugins, INTEGER auto-increment IDs, and direct module access to Cloudflare bindings. Drizzle-generated SQL migrations still need an approved Q63 runner path. Core/headless/contracts must have no direct or transitive frontend/presentation dependencies. Trusted compiled modules are not sandboxed by these seams. [Q25, Q63]
- Nothing is in flight beyond the current spec fold. The recorded next-step sequence is: fold the spec-review resolutions into the specs → Orca `/onboard-existing` baseline write (AGENTS.md + the seven baseline layers) → review → approval → commit → board/state stand-up → spike plan 000 (planned, not yet authored) → run the spikes → MVP plan. This creates no plans. [Q26]
- Recurring project-state reviews feed `docs/reviews/` on cadence/milestones to catch drift. [Q27]

### Runtime and delivery seams

- Core logger/tracer/metrics interfaces with project-configurable, pluggable sinks; modules use the seam, not raw `console` or Cloudflare bindings. Invocation-scoped trace/user/service lifetimes and sink completion mechanics belong to Q40; **redaction-by-default is a locked platform guardrail** (no PII, request bodies, tokens or full auth payloads in default logs/traces/diagnostics), while specific sink-failure handling remains implementation design. OpenTelemetry alignment is an opportunity, not an MVP constraint. [Q25, Q40, Q55, Q65]
- Manifests declare queue consumers and cron schedules; core wires them at build time through a jobs seam. Consumers do not author wrangler queue/cron entries directly. Wiring is not exactly-once delivery; do not rely on unawaited promises or short-lived request background work for durable business work. No MVP event bus is introduced. [Q41, Q56]
- A typed core cache capability and purge/invalidation hooks are locked. Content writes trigger post-commit invalidation fan-out through core; direct KV/manual invalidation is rejected. Hooks do not guarantee visibility: KV is eventually consistent and Cache API deletion is local to its invoking data centre, not a global purge. [Q25, Q57]
- Delivery direction: GitHub Actions → wrangler deploy; staging and production; per-project custom domains; preview deployments; local reset/reseed and per-module fixtures/teardown. A preview deployment does not itself guarantee isolated data resources. [Q60]
- D1 export is the chosen database-backup direction. Native R2 bucket versioning is unavailable and is not a backup mechanism; application object revisions alone are not a recoverable backup. Coordinated R2/data recovery remains Q65. [Q60, Q65]
- Secrets never enter committed examples. Binding declarations belong in wrangler config; `.dev.vars.example` contains non-secret development values. [Q15, Q60]
- Boundary lint and a contract/conformance harness ship at MVP. Execute conformance in CLI/build/CI before build-time registration—not during deployed request initialization. Lint checks dependency direction, `export *`, direct binding access, declared module dependencies/contract compatibility and browser-safe exports. It is not a sandbox for trusted compiled modules. [Q25, Q61]

## MVP operational and quality requirements

Planned tooling is not a working quickstart: `pnpm dev` runs the Worker under `wrangler dev` with local D1/R2/KV/queues through Miniflare, plus only the presentation dev server required by the selected topology. Tests use Vitest with `@cloudflare/vitest-pool-workers` and real D1 at the appropriate boundary; lint/format use Biome; typecheck uses `tsc`. Ports are project-configurable, not hardcoded. Q40/Q46 settle actual app/dev-server wiring. [Q14]

MVP operational acceptance:

- A clean generated project installs, runs, tests, builds and deploys through the golden path: scaffold → create module → migrate → dev → deploy. The MVP must be deployed end-to-end, not only a local scaffold. [Q7, Q14, Q31, Q44]
- The documented D1 migration path is exercised from empty and existing databases; local fixtures/reset/reseed have per-module setup/teardown. Migration mechanics are gated by Q63. [Q16, Q37, Q60, Q63]
- Environment/binding examples contain no secrets; diagnostics, configuration and recovery are documented. [Q7, Q15, Q53, Q60]
- CI delivers through wrangler across staging/production and preview environments with per-project domains. [Q60]
- TDD, real-D1 coverage, typecheck/lint and conformance checks pass before registration/build. [Q20, Q61]
- The Q7 deployed proof is a representative pilot-derived scenario with zero core edits; it does not require a full rebuild of either pilot. Q42's audit supplies candidates, not a commitment to implement every audited module. Full pilot rebuilds follow MVP. [Q7, Q33, Q42]
- The public reference frontend alone has LCP < 2.5s and INP < 200ms targets. WCAG 2.2 AA applies to bundled admin/editing and rendered public content; SEO/structured data applies to public content. Dashboard/overlay targets must be set in Q40/Q47 using Q54 workflow input before those implementations. Browser support is evergreen plus the last two Safari/Firefox/Edge; uptime is best-effort per project. [Q62]

## Deferred affected-work design gates

These gates are separate from the foundational prerequisites Q38/Q40/Q46/Q47/Q54/Q63/Q70 (see [index](000_index.md) and [product/MVP](001_product-and-mvp.md)). Q65–Q68 close before their own affected implementation and before MVP deployment, but do not block unrelated work whose own prerequisites are met. **Owner/design deliverable and block for every gate is the canonical gate table in the [Specification index](000_index.md#canonical-gate-table)** — each requires one ADR plus concrete design and evidence; candidates are not adopted by being documented. [Q19]

The operational concerns this spec owns (the design scope itself is the canonical table's):

- **Q65 — backup/retention/restore.** D1 export is the chosen DB direction (not proof of coordinated recovery); do **not** prescribe the unavailable native R2 bucket versioning; evaluate separately protected recoverable copies without silently choosing a vendor/mechanism. Evidence: restore DB records **and** referenced assets, plus recovery for relevant migration/media failure cases. [Q60, Q65]
- **Q66 — durable side effects/retries/idempotency.** Distinguish critical durable business work from best-effort telemetry; a D1 transactional outbox is an evaluation candidate only; no MVP event bus. Effects across databases/R2/queues/cache need separate recovery, never claimed atomic under Q52. Evidence: inject commit/enqueue/purge failures; duplicate delivery, poison/replay and payload upgrades. [Q52, Q56, Q66]
- **Q67 — author consistency + preview isolation.** Drafts/authenticated previews bypass shared public caches or use provably isolated keys/access; no concrete staleness duration or global synchronous visibility is selected; HTTP cache directives alone do not govern JavaScript history caches. Evidence: author/public and multiple-cache-location reads, publish/schedule, purge failure/retry and unauthorized previews. [Q54, Q57, Q67]
- **Q68** is owned by [Security and identity](007_security-and-identity.md) — surface-profile applicability, permitted auth/registration, first-admin provisioning/recovery, session/credential/origin/CSRF rules and rate-limit policy/storage. Q59's protections and Q50's role/scope vocabulary remain locked. [Q19, Q50, Q59, Q68]

### Q70 — Client datastore capability and sync (foundational; operational aspects)

Q70 is a **foundational** gate owned in spike plan 000 (not an affected-work gate); its discovery home is Q70 / [Amendment 001](../discovery/understanding-amendments-001.md). Operational concerns this spec owns:

- **Client persistence risk.** OPFS-backed local storage can be evicted under quota pressure; `navigator.storage.persist()` is requested and usage monitored via `navigator.storage.estimate()`, with authored data (Class 1) separated from cache (Class 2). Tauri/Capacitor filesystem surfaces carry no such eviction risk. [Q70]
- **Tombstone GC.** Delete tombstones are retained (retention window AND all-replicas-acknowledged), then hard-deleted by a manifest-declared cron job (Q56); explicit user purge overrides. [Q56, Q70]
- **Sync idempotency and versioning.** `change_set_id` is the sync idempotency key and sync payloads carry the contract version with a current + N-1 acceptance window — these concretize Q66's durable-effect/idempotency and payload-compatibility requirements for the client-sync path. [Q44, Q49, Q66, Q70]
- **MVP delivery:** Q70 is an **MVP deliverable** — the MVP must ship a working local-first store + sync experience, not design only; the gate closes its design before that implementation.
- **Blocks:** the client-local store and sync/lock/conflict implementation; not unrelated work whose own gates are met. [Q70]

## Post-MVP and explicit non-goals

- The purpose/dogfooding of the `yomban.ink` site is Q69, explicitly post-MVP; it does not block platform/scaffold implementation or MVP deployment and must not influence core/module contracts, starter choice or release/versioning. [Q19, Q48, Q64, Q69]
- Search, mobile/Capacitor delivery and additional complete production UI implementations are post-MVP. [Q6, Q46, Q54]
- No cache freshness/staleness duration, global synchronous visibility, backup vendor/mechanism, transactional outbox, or exactly-once job guarantee is selected in this spec. The Q70 client-sync op-log is that capability's mechanism, not a general server-side transactional outbox selection — Q66 remains the owner there. [Q56, Q60, Q65–Q67, Q70]

## Related specifications

- [Specification index](000_index.md)
- [Product and MVP](001_product-and-mvp.md)
- [Module platform contract](002_module-platform-contract.md)
- [Data and migrations](003_data-and-migrations.md)
- [Clients and presentation](004_clients-and-presentation.md)
- [Content and editing](005_content-and-editing.md)
- [CLI and distribution](006_cli-and-distribution.md)
- [Security and identity](007_security-and-identity.md)
- Historical source: [understanding.md](../discovery/understanding.md); amendment record: [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)
