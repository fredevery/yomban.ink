# Q38 capability-inventory spike harness (task 1.2)

A framework-free manifest/capability conformance checker that **proves** the accepted Q38
policy (`../../designs/q38_capability-inventory.md` §2/§3):

- **Axis 1** — every capability C1–C12 is a core-provided framework-free seam; the checker
  imports no presentation dependency and touches no bindings/secrets/network.
- **Axis 2** — REQUIRED capabilities (C1, C5, C6, C8, C9, C10, C12) **fail registration
  loudly** when absent; OPTIONAL capabilities (C2, C3, C4, C7, C11) produce an **explicit
  degrade/refuse diagnostic**, never silent.
- Wrong environment facet → explicit mismatch failure. Undeclared capability usage or
  undeclared module dependency → conformance failure (no implicit resolution).
- Built-in and custom modules run the **SAME checks** — the `builtIn` flag grants no bypass.

## Public entry

`src/proof.ts` exports `validateModule(manifest, platform): ValidationResult` plus
`REQUIRED_CAPABILITIES` / `OPTIONAL_CAPABILITIES` (the accepted policy constants) and the
`Manifest` / `Platform` / `Finding` / `ValidationResult` types. Tests invoke the checker
through real manifest fixtures — they assert on diagnostics content (capability names,
reasons), never on equality against a duplicated expected inventory.

## Run (from repo root)

```bash
pnpm --dir spikes/q38_capability-inventory install --frozen-lockfile
pnpm --dir spikes/q38_capability-inventory test
pnpm --dir spikes/q38_capability-inventory typecheck
pnpm --dir spikes/q38_capability-inventory lint
pnpm --dir spikes/q38_capability-inventory build
```

All five must exit 0. `pnpm-workspace.yaml` sets `allowBuilds: esbuild: true` so the
`--frozen-lockfile` install does not fail on the esbuild postinstall (pnpm 12 ignored-builds
policy).

## Pinned tool versions (resolved, see pnpm-lock.yaml)

| Tool | Version |
|---|---|
| Node | v26.8.1 |
| pnpm | 12.6.0 |
| TypeScript | 5.9.2 |
| Vitest | 3.2.4 |
| @biomejs/biome | 2.1.4 |
| esbuild (transitive, vitest) | 0.28.2 |

## Fixture map (behavioral case → test)

| Evidence case | Fixture (in `src/proof.test.ts`) | Test |
|---|---|---|
| R14.1 valid service-only module registers | `SERVICE_ONLY` + `FULL_PLATFORM` | R14.1 test |
| R14.3 absent OPTIONAL (C2) → explicit degrade | `OPTS_INTO_STORAGE` + `PLATFORM_WITHOUT_C2` | R14.3 test |
| R14.4 missing REQUIRED (C1) → registration fails | `SERVICE_ONLY` + `PLATFORM_WITHOUT_C1` | R14.4 test |
| R14.5 wrong environment facet (server C1 vs client-only offer) | `SERVICE_ONLY` + `PLATFORM_C1_CLIENT_ONLY` | R14.5 test |
| R14.6 undeclared capability (C4) / undeclared dependency | `UNDECLARED_CAPABILITY`, `UNDECLARED_DEPENDENCY` | R14.6 test |
| R14.2 built-in vs custom parity (no privileged path) | `SAME_FAILURE_BOTH_KINDS`, `SERVICE_ONLY` with `builtIn: true/false` | R14.2 test |

## TDD

Tests were written first and confirmed RED (`proof.ts` absent → import failure, "1 failed"),
then `proof.ts` was implemented to GREEN (6 passed). RED/GREEN outputs are summarized in
evidence/q38_capability-inventory.md §4a

## Limitations

- This harness proves the **policy mechanics** (required/optional/environment/undeclared/parity)
  against in-memory platform fixtures. It does **not** exercise real D1, OPFS/browser surfaces,
  Workers runtime, or `@cloudflare/vitest-pool-workers` — those are deferred to the gates that
  own them (Q45/Q70/Q63).
