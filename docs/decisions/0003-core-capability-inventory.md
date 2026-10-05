# ADR-0003 — Core capability inventory and required-vs-optional policy (Q38)

- **Status:** accepted (2026-10-05) — closes foundational gate Q38, the first gate closed under
  spike plan 000 (`docs/plans/000_spike-plan/000_spike-plan.md` gate-closure matrix).
- **Deciders:** the dev (owner). The inventory and policy were dev-gated in task 1.1; the dev
  confirmed proceeding at the task 1.3 claim gate ("confirmed…please continue").
- **References:** design `docs/plans/000_spike-plan/designs/q38_capability-inventory.md`;
  evidence `docs/plans/000_spike-plan/evidence/q38_capability-inventory.md` (§4a task-1.2 run,
  §4b task-1.3 acceptance re-run); harness `spikes/q38_capability-inventory/` (repo root:
  `src/proof.ts` checker + `src/proof.test.ts` fixtures + `README.md`);
  `docs/discovery/understanding.md` (Q30, Q35, Q37–Q39, Q42, Q45, Q50–Q59, Q70, Q71) +
  `docs/discovery/understanding-amendments-001.md`/`-002.md`;
  `docs/specs/002_module-platform-contract.md`;
  `docs/decisions/0001-platform-foundations.md` (D1–D14 ceiling this record).

## Context

Foundational gate Q38 (`docs/specs/000_index.md` §Canonical gate table) requires a complete
inventory of server/core/headless-client capabilities and the required-vs-optional policy
before any later spike or foundational implementation. It blocks the Q35 capability
verification, the finalized Q25/Q30 boundaries and the Q37 auth/base infrastructure
inventory. Tasks 1.1 (design/evidence map) and 1.2 (framework-free manifest-check harness,
TDD RED→GREEN) produced the artifacts; task 1.3 re-ran the harness in the acceptance session
and records this decision.

## Decision

1. **The capability inventory C1–C12 is accepted** (design §2): C1 datastore (D1 server-side +
   client-local SQLite driver seam), C2 storage (R2 + upload/transform contracts), C3
   filesystem (CLI/scaffold vs Worker request-local non-persistent temp), C4 cache +
   invalidation, C5 auth/authorization, C6 routing/config/secrets, C7 jobs (queues/cron),
   C8 observability/redaction, C9 identifiers (prefixed sortable TEXT ids), C10 module
   registry + unit-of-work, C11 headless/host seams, C12 PII classification/erasure guardrail
   seams. Every capability is provided by the core as a **framework-free seam** (Axis 1);
   modules never touch Cloudflare bindings, raw SQL outside Drizzle, secrets or presentation
   dependencies directly.
2. **The required-vs-optional policy is accepted** (design §3):
   - **REQUIRED (non-omittable):** C1, C5, C6, C8, C9, C10, C12. A module manifest declaring
     a REQUIRED capability against a platform missing that seam **fails
     registration/conformance** — loud, non-omittable.
   - **OPTIONAL / CONDITIONAL:** C2, C3, C4, C7, C11. A missing OPTIONAL capability makes the
     dependent feature **degrade or refuse EXPLICITLY**, never silently.
   - PII guardrail seams (C12) are REQUIRED (the gate shorthand's looser grouping is resolved
     in favour of the explicit decision and Q71).
   - Built-in features (content, media, SEO, export) and presentation
     (dashboard/component-kit/panel/design tokens) are **ordinary modules / optional
     presentation**, not mandatory core — built-in/custom parity holds (Q39).
3. **Acceptance is verified, not asserted.** The acceptance session re-ran the five harness
   commands from repo root — `pnpm --dir spikes/q38_capability-inventory install
   --frozen-lockfile` / `test` / `typecheck` / `lint` / `build` — each exit 0, Vitest
   `Tests 7 passed (7)` covering the six R14.x behavioral cases (valid service-only
   registration; absent-OPTIONAL explicit degrade; missing-REQUIRED loud failure;
   wrong-environment facet mismatch; undeclared capability/dependency conformance failure;
   built-in/custom parity) plus the malformed empty-facet-list hardening test. Observed
   versions: Node v26.8.1, pnpm 12.6.0, TypeScript 5.9.2, Vitest 3.2.4, @biomejs/biome 2.1.4.
   Full observed outputs: evidence §4b.

## Rejected alternatives

- **Reconciling the inventory against a duplicated hand-maintained expected list** — rejected:
  the harness exercises the checker's actual behaviour through real manifest fixtures, not
  equality against a copied inventory literal.
- **Classifying PII classification/erasure (C12) as optional** — rejected: Q71 locks the three
  privacy guardrail seams as platform-guardrailed (redaction-by-default, PII classification,
  erasure/retention reaching client-local replicas); lawful-basis/consent/DSR *policy* stays
  per-project, but the seams are non-omittable.
- **A persistent Worker filesystem surface (C3)** — rejected: Workers `/tmp` is request-local
  and non-persistent; persistent objects go through R2 (C2) and a consumer relying on
  persistent storage must be refused explicitly, never silently redirected to a temp path.
- **Design tokens or the bundled dashboard/component-kit/panel as mandatory core capabilities**
  — rejected (Q30/Q39/Q47): presentation is optional; design tokens are a
  presentation-consistency consideration referenced from C11, not a core runtime capability.
- **Selecting concrete capability-check implementations at gate closure beyond the
  framework-free manifest/check harness** — rejected: the harness (task 1.2) is the accepted
  verification instrument for the policy's mechanics; no additional check implementation is
  selected by this ADR.

## Scope limits (recorded honestly, from the evidence report)

The acceptance harness validates one module manifest at a time against a simulated platform
surface. It does **not** establish: cross-module C9 ID-prefix collision detection, dependency
cycle/self-dependency detection, real D1 / `@cloudflare/vitest-pool-workers` / OPFS browser
surface exercise (owned by Q45/Q70/Q63; Q35 is the first consumer of the C9/cycle limits), or
the repo-wide dependency-graph/lint sweeps named
by the cross-cutting rows R13.1–R13.3. These remain open for their owning gates; this closure
claims only what §4a/§4b observed.

## Non-decisions

This ADR records the inventory/policy acceptance only. It selects **no** package paths,
package names, file layouts, component versions or execution/deployment topology — packaging-
versus-execution is Q40 alone — and reopens no locked decision (Q45 D1-only-for-server, Q52
single-batch atomicity, no query-builder abstraction, frontend independence). Q70/Q71
additions to the inventory are additive.

## Consequences

- Q38 is CLOSED in the parent plan's gate-closure matrix (first Closed gate); the Q35
  capability verification, Q25/Q30 boundary finalization and Q37 auth/base infrastructure
  inventory are unblocked per `000_index.md` §Canonical gate table.
- The scope limits above are carried forward: consumers of this gate must not cite the spike
  harness as proof of cross-module collision handling, runtime D1/OPFS behaviour, or
  repo-wide scans.
- The consolidated ADR-0001 remains the foundation ceiling; this record stays split-ready and
  additive to it.
