# Yomban.ink: CLI and distribution

Status: Specification baseline for the CLI surface, repo-based distribution and release/versioning. Decision-level direction is locked below; the installation/generation-ownership mechanics, migration specifics and public-starter selection remain open prerequisite design and are called out explicitly rather than assumed solved.

## Purpose

Define how a consuming project adopts Yomban.ink from a repository and works with it through the CLI: the command surface (scaffold/init, module lifecycle, migrate, upgrade, dev/build/deploy), how the platform is distributed (repo install under `@yomban-ink/*`, no npm publishing), and how contracts and releases are versioned (contract semver, git-tagged releases, `n-1` core compatibility). This spec owns the locked command and distribution decisions and states what is deliberately **not** yet decided (Q40 installation/generation-ownership mechanics, Q63 migrate mechanics, Q46 starter selection) so that implementation never treats unspecified artifact mechanics as already designed. [Q13–Q16, Q31, Q44, Q48, Q49, Q64]

## Locked decisions and constraints

### Stack, tooling and execution [Q13–Q16]

- Backend stack is locked: **Cloudflare Workers** runtime/hosting, **Hono** base server engine, **better-auth** for auth handling, **TypeScript** throughout, **pnpm** as package manager. Frontend independence is a separate invariant (hosts/consumers choose their own presentation); these backend choices are not reopened. [Q13]
- Planned pnpm workspace scripts: `pnpm dev` runs the Worker under `wrangler dev` with local D1/R2/KV/queues via Miniflare, and runs any selected public-starter/admin development server only when the presentation topology needs one. Tests use Vitest + `@cloudflare/vitest-pool-workers` with real D1 at the appropriate boundary; lint/format via Biome; typecheck via `tsc`. Ports are declarable in project config, not hardcoded. These are planned commands — no implementation exists yet, and the actual app/dev-server wiring is a Q40/Q46 outcome. [Q14]
- `wrangler.toml`/`.jsonc` declares bindings (D1, R2, KV, queues); a committed `.dev.vars.example` carries non-secret dev values; secrets (better-auth signing keys, etc.) are **never committed**. [Q15]
- The core **migrate** command (Q37/Q44) is the primary database procedure; **upgrade** is separate platform package/code/contract work (Q49) and is not the migration command. Ordering/ledger/SQL-execution mechanics remain Q63. Local fixtures/reset/reseed use per-module setup/teardown (Q60); build/deploy use wrangler via standardized delivery tooling; backup/restore is documented and exercised under Q65. No implementation exists yet. [Q16, Q37, Q44, Q49, Q60, Q63, Q65]

### Consumption and distribution model [Q31, Q48]

- Yomban.ink installs **from a repository** for MVP: package scope is **`@yomban-ink/*` unconditionally**; there is **no npm publishing** for MVP. [Q48]
- The scaffold/init command generates **project-owned** files including `package.json`, scripts and base wiring, plus commands to create/manage modules. [Q31, Q44]
- **AI scaffolding remains required**; consumer AI orientation need not mirror Yomban.ink's own Orca workflow. The deterministic artifact list, generated-versus-installed ownership, AI-fill/conformance boundary and consumer update mechanics are **Q40 outputs**, not assumed. [Q31, Q48]
- No scaffold-into-existing-project support for MVP; pilot rebuilds are handled in their repos after the platform MVP. [Q31, Q18]
- Command inventory direction is locked: `init`/scaffold (project file tree, dependencies/scripts/wiring + AI orientation artifacts), `create` module, add/remove module, list modules, `migrate` (Q37/Q63), `upgrade` (Q49, distinct from DB migrate), and dev/build/deploy. Scaffold backend/module wiring is independent of public-starter selection (Q46). [Q44]

### Contract versioning and upgrade path [Q49]

- The module contract (manifest shape + registry interfaces) carries its **own major version**. Modules declare which contract major they target; the core accepts **current and n-1** majors. [Q49]
- An **upgrade CLI plus codemods** handle contract moves. **Lockstep and feature-detection are rejected.** [Q49]

### Release and versioning [Q64]

- Releases are **git-tagged** with `package.json` semver against the repo source; **changesets + conventional commits** drive versions. **Lockstep and tag-pinning remain rejected.** [Q64]
- Q40 designs actual subpackage/repo/tag-semver install/update mechanics and the generated-versus-installed boundary before scaffold/upgrade implementation; this locked direction does not invent a working package specifier. [Q64]

## MVP requirements

The MVP CLI and distribution surface must let a fresh consumer get from an empty environment to a running, tested, deployable project and then manage modules and upgrades — without requiring platform-core edits:

- **Scaffold/init:** generates project-owned `package.json`, scripts and base wiring, plus the AI orientation artifacts enumerated by Q40. Output must be a clean generated project that installs, runs tests/typecheck, builds and deploys.
- **Create module; add/remove/list modules:** scaffold new module skeletons; add/remove honours declared dependencies, contract conformance and Q63 data-retention safety (removal cannot silently discard existing data). [Q44, Q37]
- **Migrate:** the core DB migration runner over module-owned migrations, exercised from empty and existing database states; ordering/ledger/namespace/lock mechanics are Q63.
- **Upgrade:** the CLI + codemods that move modules/consumers between accepted contract majors, distinct from DB migrate. [Q49]
- **dev/build/deploy:** workspace scripts behind the documented golden path — scaffold → create module → migrate → dev → deploy. [Q7, Q44]
- Release/versioning tooling (changesets + conventional commits → git tags with `package.json` semver) is ready so scaffold/upgrade work has a real source of record. [Q64]

## Verifiable acceptance criteria

These are the testable tests for the MVP CLI/distribution surface; where a criterion depends on an open design (Q40/Q63/Q46), it is written as a contract the unimplemented design must satisfy, not as an already-passing check.

- **Scaffold:** from a clean environment, the scaffold command generates a project whose install/typecheck/build/deploy succeed without edits to platform core.
- **Module lifecycle:** `create` produces a conformant module skeleton; `add`/`remove`/`list` enforce declared dependencies and contract conformance, and `remove` prompts/requires Q63-safe data handling rather than silently dropping data.
- **Golden path:** scaffold → create module → migrate → dev → deploy is executable end-to-end with real D1 tested via Vitest pool-workers and a deployed Worker.
- **Upgrade:** the upgrade CLI + codemods move a module/consumer across an accepted contract transition (e.g. major n → n+1) with no hand wiring and no feature-detection; n-1 modules still run on the current core, and a module targeting an unsupported major fails closed with a clear diagnostic.
- **Distribution identity:** all scaffolded packages are under the `@yomban-ink/*` scope; no npm publish step exists in MVP tooling.
- **Release/versioning:** a release produced by changesets + conventional commits yields a git tag and `package.json` semver resolvable from the repo; lockstep and tag-pinning are absent.
- **Deferred-boundary criteria (design-level, not yet implemented):** once Q40 closes, scaffold re-runs must not regenerate consumer-owned files destructively or require regeneration for consumers to receive package updates; once Q63 closes, migrate must pass empty/existing-version runs, failure/retry and concurrent-deploy safety; once Q46 closes, scaffold backend/module wiring must remain starter-independent. These become hard acceptance tests only after their owning designs close.

## Deferred design and gates

- **Q40 — installation/generation-ownership mechanics (foundational gate).** Owns: exact repo/subpackage/tag-semver install and update mechanics; the generated/project-owned versus installed/upgradeable boundary; consumer updates without regeneration; the deterministic AI-orientation artifact list and AI-fill/conformance boundary; scaffold command file-tree/scripts/wiring specifics; and packaging-vs-execution for public app, starter, bundled admin, overlay controller and panel. **Blocks scaffold and upgrade implementation and foundational implementation start.** It is not fully closed until it produces one ADR plus a concrete design and verification evidence (ADR creation alone is not closure). [Q40, Q48, Q64, Q19] Related prerequisite design: Q47 (framework-free/wire/host/presentation interfaces) and Q46 (public starter) close coupled choices together, and Q38 (core capability inventory) precedes foundational implementation. Also foundational, affecting this command surface: [Q63 — data and migrations](003_data-and-migrations.md) for migrate mechanics.
- **Q63 — migrate specifics (foundational gate).** Owns database placement (shared vs separately bound D1), table/migration namespacing/collisions, dependency ordering, persistent ledger/history, concurrent-deploy locking, partial-failure/retry, data-vs-schema migrations, Better Auth base-schema generation/integration and safe module removal/retention. **Blocks schema/migration/Better Auth persistence implementation and foundational implementation start.** Module ownership of migrations and the core runner remain locked. [Q63, Q37, Q45, Q19]
- **Q46 — public starter selection (explicitly reopened).** The former SvelteKit public starter is superseded; **no starter is selected**. Scaffold backend/module wiring is generated independent of starter choice; the dashboard/overlay controller/panel implementations and their htmx candidacy are separate Q40/Q47 decisions. **Blocks starter scaffolding and MVP public-client implementation.** MVP completion requires the starter selection, so Q46 closes alongside Q40/Q47 after Q54 supplies workflow input. [Q46, Q40, Q47, Q31, Q54]
- These gates block their affected implementation, not unrelated work whose own prerequisites are satisfied. The authoritative inventory of all gates is [Q19 in the spec index](000_index.md); Q65–Q68 are affected-work gates closing before their affected ops/security/data-safety implementation and MVP deployment. [Q19]

## Post-MVP scope and explicit non-goals

- **No npm publishing** in MVP; distribution is repo-based under `@yomban-ink/*`. Wider package-registry distribution is not an MVP goal. [Q48]
- **No scaffold-into-existing-project** support in MVP. [Q31, Q18]
- **No runtime plugin loading or third-party module marketplace.** [Q5, Q32]
- **No lockstep or tag-pinned releases**, and no feature-detection as the upgrade mechanism. [Q49, Q64]
- Search, mobile/Capacitor delivery, additional complete production UI implementations, and the purpose/dogfooding of the `yomban.ink` site itself are post-MVP (Q69 does not block platform/scaffold work). [Q6, Q46, Q48, Q64, Q69]
- Pilot rebuilds are handled in their own repos after the platform MVP, with full pilot audits feeding the future MVP plan rather than this distribution spec. [Q7, Q33, Q42]

## Related specifications

- [Spec index](000_index.md)
- [Product scope and MVP](001_product-and-mvp.md)
- [Module platform contract](002_module-platform-contract.md)
- [Data and migrations](003_data-and-migrations.md) (migrate mechanics, Q63)
- [Clients and presentation](004_clients-and-presentation.md) (starter/panel selection, Q46/Q47)
- [Content and editing](005_content-and-editing.md)
- [Security and identity](007_security-and-identity.md)
- [Operations and quality](008_operations-and-quality.md)
- Historical discovery: [understanding.md](../discovery/understanding.md)