# Engineering Principles — Yomban.ink

How we write software here. Source: onboarding answers Q20, Q22, Q23, Q25.

- **Docs-first.** No implementation before the spec/plan says so. The doc stack
  (`docs/discovery` → `docs/specs` → `docs/decisions` → `docs/plans` → `docs/conventions` →
  `docs/best-practices`) is the source of truth; code implements the docs, not the reverse.
- **One task per session, one scoped commit per task.** Conventional commits; direct-to-`main`
  (solo repo — no PR ceremony; branch naming optional for larger plans). Commits are
  **dev-triggered only**.
- **Plan-first always.** Every piece of real work gets a plan (probed → drafted → discussed →
  reviewed) before code; even on the small dial it is a 3-line plan.
- **TDD: tests before code.** Tests **exercise real code at the right mock boundary** — real D1
  through `@cloudflare/vitest-pool-workers`. Never a self-referential assertion that only
  mirrors the implementation. Back every “done” claim with real test/lint/typecheck/build output.
- **Types in a schema layer, logic separate; routes/handlers stay lean.** Logic lives in the
  module/core, not the route. Canonical **stored** types are **inferred from module Drizzle
  schema** (never prose); public DTOs are deliberately **derived/mapped** from stored types in
  the framework-free module contracts — never unfiltered DB rows or private-field exports.
- **Strict dependency direction.** Modules → core (never core → module); module → module only
  through **declared manifest dependencies**. No monkey-patching; runtime interaction goes
  through **registry-provided typed services** (Q41).
- **No `any`, no `export *`; explicit error handling.** TypeScript strict throughout.
- **Never fail silently.** Any blocked/skipped/failed operation (a protected `AGENTS.md` write,
  a timed-out approval, a tool error) is surfaced to the dev explicitly — no operation drops
  without a report.
- **Thoroughness is a floor.** Speed is recovered by reducing *plan footprint* only — never by
  cutting review depth, tracking, or verification.
- **Deferred decisions → the backlog**, never silently dropped. The backlog is a board column,
  triaged by hand — no numbered-file ceremony, no grooming ritual.

## Non-negotiables (invariant ceiling)

Docs-first · build-time composition (no runtime plugins) · module-owned Drizzle/D1 schema + core
migration runner · TS strict, no `any`/`export *` · TDD · module-owned PascalCase `Key = 'Key'`
enums aggregated platform-wide at build · **frontend independence locked** (no core/contract/
headless dependency on any presentation framework/library) · modules never touch bindings/secrets
directly · single-D1 prepared-statement-batch atomicity. See `AGENTS.md`.

## Review standards (non-negotiable)

- **Doc / planning reviews** (plan, phase, task-decomposition) converge, **cap at 2 passes**,
  then **report back** to the dev with a recommendation — never auto-commit.
- **Task-output reviews** go **to zero**, capped at **3 passes** before the dev is called in
  (spec-compliance pass to zero, then code-quality pass to zero; fixes are re-reviewed).
- Reviews always get **only the artifact + just enough context to do the job** — never
  conversation history.
