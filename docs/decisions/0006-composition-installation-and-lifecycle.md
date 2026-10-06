# ADR-0006 — Composition, installation and invocation lifecycle (Q40)

- **Status:** Proposed (2026-10-06) — authored at task 3.1 of spike plan 000 phase_003.
  The dev ACCEPTED the starred PROVISIONAL decisions in conversation 2026-10-06
  (session 20261006_212010_4c6797; recorded in the evidence report §3) — the install
  specifiers (§12) are accepted as provisional SHAPE only, their syntax remaining
  UNVERIFIED pending the phase-006 install probe. The record stays **Proposed** (not
  Accepted): full acceptance still follows the phase-006 proofs (tasks 6.1–6.2:
  composition/dependency/browser-export checks, cross-module single-batch rollback,
  install-mechanics probe) and the **joint Q40/Q47/Q46 closure (phase-007 task 7.8)** —
  an ADR alone is not closure (Q19/Q61).
- **Deciders:** authored by the task-3.1 design agent under the phase-003 contract
  (proposed designs/ADRs; no unrun evidence asserted; no candidate adopted without
  explicit dev input). Dev acceptance recorded 2026-10-06 per the evidence report §3.
- **References:** design `docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md`;
  evidence `docs/plans/000_spike-plan/evidence/q40_composition-lifecycle.md`;
  `docs/specs/000_index.md` canonical gate table (Q40 row);
  `docs/specs/002_module-platform-contract.md` (manifest, intermodule, conformance);
  `docs/specs/003_data-and-migrations.md` (identity seam, unit of work);
  `docs/specs/004_clients-and-presentation.md` (topology/cookie/CORS deferrals to Q40);
  `docs/specs/006_cli-and-distribution.md` (distribution, install-mechanics transfer);
  `docs/specs/007_security-and-identity.md` (identity, permissions, config/secrets);
  `docs/specs/008_operations-and-quality.md` (observability lifetimes, redaction);
  `docs/discovery/understanding.md` Q8, Q9, Q11, Q12, Q29, Q32, Q34, Q35–Q41, Q44, Q45,
  Q48, Q49, Q52–Q57, Q62, Q64, Q70; amendments 001/002; ADR-0003 (capability inventory),
  ADR-0004 (Q54 workflow input, accepted), ADR-0005 (Q63 persistence, provisional);
  `docs/decisions/0001-platform-foundations.md` (ceiling decisions).

## Context

Gate Q40 is the foundational composition/installation/lifecycle spike (`002` §"Deferred
design"; canonical gate table). The locked decisions it operates within: build-time
composition, no runtime plugins (Q29); registry-provided typed services with direct
imports allowed only for typed shared code (Q36/Q41); one deployment per consuming
project, never multi-tenant (Q32); unit-of-work atomicity = one D1 database + one
prepared-statement batch, registry services contributing deferred operations rather than
independently committing (Q41/Q52); prefixed sortable URL-safe TEXT ids via one core
id-service seam, never INTEGER (Q11); frontend independence including no direct or
transitive presentation dependency in core/contracts/headless (Q22/Q25/Q46/Q47/Q51);
`@yomban-ink/*` scope with repo installation and no npm publish (Q48); git-tagged
`package.json` semver releases via changesets, lockstep and tag-pinning rejected (Q64);
contract semver current+N-1 (Q49). Installation scope, generated-vs-installed ownership,
AI-orientation artifacts and the AI-fill/conformance boundary were explicitly transferred
from Q48 to Q40. Q54's workflow input is ACCEPTED (consumed for §17 targets); Q63's
design is provisional (consumed for migration/ID/auth inputs). This record reopens no
locked decision; final exports/topology wait on the joint Q40/Q47/Q46 closure (7.8).

## Decisions (settled direction; starred items are PROVISIONAL pending dev acceptance)

1. **Export classes.** Module and core surfaces publish as explicit export classes —
   **server-only** (routes, services, Drizzle schema, manifest, jobs, permissions,
   config), **headless/server-safe** (public DTOs/runtime schemas, typed-client base),
   **browser-safe** (framework-free browser surface incl. the Q70 store consumer seam),
   **DOM** (host-notification/DOM-mapping integration), **presentation** (optional facet).
   Facets are manifest-declared, never implied; a service-only module needs none.
   Headless/server-safe and browser-safe classes carry no direct or transitive
   presentation dependency — boundary lint (Q61) runs in CLI/build/CI before
   registration. Browser exports never expose server-only dependencies or private fields.

2. **Per-side core layout.*** Separate framework-free workspace packages
   (`@yomban-ink/core-server`, `@yomban-ink/contracts`, `@yomban-ink/clients`), resolving
   Q9's deferred open sub-question. PROVISIONAL: Q47's contract design and the phase-006
   boundary proof may re-slice.

3. **Packaging vs execution.*** **Packaging: static pnpm-workspace packages** consumed at
   build time — no runtime plugin loading, no dynamic discovery; trusted compiled modules
   are not sandboxed. **Execution: one Cloudflare Worker per consuming project hosting
   all server roles** (API, optional HTML/admin/dashboard routes, module routes,
   better-auth handler, Q70 sync endpoint). A separate presentation dev server exists
   only where the selected topology needs one (starter-independent, Q46). The
   split-per-role Worker alternative is rejected provisionally (multiplied
   cookie/origin/CSRF surfaces; split unit-of-work story; no MVP payoff). This is the
   Q40-owned packaging-vs-execution choice — made PROVISIONALLY here, flagged for dev
   acceptance.

4. **Composition roots.** A project-owned, scaffold-generated composition root imports
   core + the project's chosen module packages and passes their manifests to core
   build-time registration; core knows manifest shapes, never feature implementations
   (no core→module import); runtime interaction is registry-mediated; the dependency
   direction and registration-time conformance (graph, contract majors, capability
   policy, namespace collisions, aggregate roots) are lint-enforced before wiring.

5. **Route/SSR/auth-handler ownership.** Modules declare route bases; core mounts them on
   the consumer's Hono app at build-time wiring. Core owns the single better-auth handler
   mount; modules never register auth endpoints. Domain operations stay outside frontend
   server-action/router conventions. Public/HTML/SSR execution shares the one Worker;
   starter SSR technology is Q46's unselected choice.

6. **Cookies/session propagation; credentialed CORS/trusted origins/CSRF.** Browser
   clients carry the better-auth session cookie; SSR/HTML paths resolve the session
   in-process per invocation; machine/token paths use the task-2.4-proven `bearer()`
   behaviour; the Q70 sync transport propagates the same session. Core owns one
   trusted-origin registry across local/deployed/preview environments with explicit
   credential handling; CSRF/origin enforcement applies on every cookie-authenticated
   mutation path before module handlers (presentation headers are never authorization).
   Concrete profiles/rate limits are Q68's.

7. **Lifecycle: immutable build metadata vs invocation context.** Build/registration
   metadata (module set, graph, route table, enum/permission aggregates, prefix registry,
   config schema shape) is immutable per build. Effective config values, binding-derived
   clients, user/session subject, trace context and the unit of work are
   **invocation-scoped**: **no binding I/O at module initialization**; **no stale
   globally cached binding-derived client** (clients are derived per invocation through
   core seams; modules never see bindings); config/secret values are validated per
   effective runtime configuration so changed secrets take effect next invocation, with
   invalid config failing safely (Q53). Warm-isolate reuse cannot leak invocation state
   through globals.

8. **Observability invocation context; sink completion/failure redaction.** Core creates
   per-invocation trace context (trace id, service identity, subject reference, UOW
   identity), never stored on globals; sinks complete within the invocation or via
   `ctx.waitUntil` from the core seam; **redaction-by-default applies on success AND
   failure paths** — failure diagnostics/flushed buffers never leak PII/tokens/bodies
   (Q55/Q71 guardrail). Sink-failure policy is implementation design on the seam.

9. **Unit-of-work participation contract.*** Registry services receive a unit-of-work
   handle whose write operation is `contribute(op)` — appending to the invocation's ONE
   D1 prepared-statement batch; no independent commit on the handle; a service needing a
   separate write opens its own explicit UOW (a separate batch). Cross-module atomicity
   is possible only because ADR-0005's dev-accepted placement is one shared D1 database.
   No atomicity is claimed across databases/R2/queues/cache purges; post-commit
   invalidation (Q57) and durable effects (Q66) run after the batch commits. The
   **cross-module single-batch rollback proof is task 6.1/6.2's required evidence** —
   designed, NOT YET RUN.

10. **ID mechanics.*** **Algorithm (PROVISIONAL):** `<prefix>_<monotonic Crockford-base32
    ULID-style material>` — the base32 monotonic scheme task 2.4 PROVED end-to-end
    through better-auth's `advanced.database.generateId` on real D1 (`usr_/ses_/acct_/
    vrf_`); UUIDv7 recorded as the alternative. **Client finality (PROVISIONAL):**
    client-generated ids (offline records, change-set `op_id`s, sync idempotency keys)
    are **final at creation** — no temporary→final rekeying; safe retry/ownership rides
    on server-side dedupe/rejection semantics (Q66). **Namespace collisions:**
    conformance-time rejection of duplicate entity-type prefixes; the manifest's
    ID-prefix registration is the single namespace authority (reused by permission-key
    namespaces per `007` §Permissions); reserved prefixes (`core_`/auth entities) are
    unavailable to modules. The prefix set is a build artifact, not a runtime registry.

11. **Enum/permission build-time aggregation.** A build-time step aggregates each
    module-owned enum and permission key (PascalCase `Key = 'Key'`; grammar
    `<ModuleNamespace>:<Member>`) from source + manifest into a derived platform-wide
    artifact; no central hand-maintained registry and no runtime registry lookup;
    collisions validated before registration (Q61/D3).

12. **Installation, update and generated-vs-installed ownership.*** Distribution:
    `@yomban-ink/*` workspace packages from a repository, no npm publish (Q48);
    git-tagged semver releases via changesets (Q64). **Install specifiers (PROVISIONAL
    and UNVERIFIED):** workspace-protocol (`workspace:^`) for in-workspace consumers;
    git-URL + semver-range dependency for out-of-repo consumers — **every specifier
    syntax/resolution claim awaits the phase-006 install probe; nothing here is verified
    pnpm behaviour**, with a tagged-pin fallback flagged as a dev decision if git-semver
    resolution proves unsupported. **Ownership:** installed/upgradeable = platform
    packages; generated-then-project-owned = composition root, package.json scripts,
    wrangler config, `.dev.vars.example`, project config, AI artifacts — scaffold re-runs
    never regenerate them destructively, and consumers receive package updates **without
    regeneration**; generated-platform-managed = the enum/permission aggregate, rebuilt
    every build. `upgrade` (Q49 codemods) is distinct from DB `migrate`.

13. **AI-orientation artifacts and AI-fill boundary.*** A deterministic, minimal scaffold
    artifact set (consumer `AGENTS.md` stub, platform-capabilities summary, seam/boundary
    orientation doc, module-skeleton templates) — proposed list, dev-amendable. AI-filled
    (or human-filled) module code passes the same conformance/registration checks as any
    module; artifacts never substitute for conformance; consumer AI orientation is
    separate from Yomban.ink's own Orca workflow (Q48).

14. **Q70 browser-store session lifetime.** The browser-local SQLite store is a
    browser-safe export; the worker-hosted wasm-SQLite instance is **opened per session**
    and never at module initialization nor cached as a module-scope global; OPFS
    persistence/eviction rules per Q70. The store sits outside the server UOW by
    definition; leases are advisory (Q52). Detailed mechanics are task 3.4's (Q70).

15. **Contract current+N-1 upgrade vs DB migration.** Contract majors move via the
    `upgrade` CLI + codemods (Q49); modules targeting unsupported majors fail closed.
    DB schema/data changes move only through the Q63 ledger-driven runner; **provisional
    orchestration:** `migrate` is an explicit golden-path step and deploy does not
    silently migrate — the Q63 lock/fencing primitive makes CI-invoked migration safe
    against concurrent deploys; phase-006 evidence exercises this ordering.

16. **Provisional effect/security/consistency interfaces.** Q40 guarantees only: UOW
    commit is the atomic boundary; post-commit effects are Q66's with per-effect
    idempotency keys and current+N-1 payload windows; invalidation fan-out (Q57) is
    post-commit through core; Q67 owns read-your-writes/staleness/preview isolation;
    Q68 owns surface profiles/bootstrap/rate limits over the §6 seams. No mechanism is
    selected here.

17. **Dashboard/overlay performance-target PROPOSALS.*** With Q62's public budgets
    unchanged (LCP < 2.5s / INP < 200ms, public reference frontend only), the PROPOSALS
    for Q47 (task 3.2) to finalize with the dev: dashboard LCP ≤ 3.0s / INP ≤ 200ms on a
    representative list view; overlay first-edit readiness ≤ 1.0s from activation; save
    acknowledgement feedback ≤ 100ms after the Q54 debounced save fires, honouring Q54's
    truthful-acknowledgement rule. Not adopted by this task; measured later on the two
    acceptance fixtures.

## Rejected alternatives

- **Runtime plugin loading / dynamic module discovery** — rejected (locked, Q29/Q22):
  build-time composition only; trusted compiled modules are not sandboxed.
- **Split-per-role Worker deployments (public/admin/sync as separate Workers)** —
  rejected provisionally: multiplies cookie/origin/CSRF authorities, splits the
  single-D1 unit-of-work story across deployments (Q52), and buys nothing at MVP scale;
  revisit only if a later proof demonstrates a concrete need.
- **Core importing feature implementations for convenience** — rejected (Q36/Q39):
  core knows manifests, never features; built-ins are ordinary modules with no
  privileged access.
- **A central hand-maintained enum/permission registry (runtime lookup)** — rejected
  (Q11/Q61): aggregation is a derived build artifact validated before registration.
- **Temporary client ids rekeyed to final ids on sync** — rejected provisionally: a
  rename/migration class with no payoff over final-at-creation ids plus Q66's
  dedupe/rejection semantics; Q66 owns safe retry/ownership.
- **Lockstep versioning or tag-pinned installs** — rejected (locked, Q64): per-package
  semver via changesets; contract majors are the compatibility axis (Q49).
- **Regenerate-on-update scaffold output** — rejected (`006` deferred-boundary criterion;
  Q48): consumer-owned generated files are never destructively regenerated; package
  updates must reach consumers without regeneration.
- **npm publishing for MVP** — rejected (locked, Q48): repo distribution only.
- **Binding-derived clients cached at module scope / binding I/O at init** — rejected
  (Q53/Amendment 001 Q40): invocation-scoped derivation only; stale credentials and
  init-time I/O are conformance failures.
- **Claiming atomicity across databases/R2/queues/cache purges** — rejected (locked,
  Q52): one database + one batch, nothing more; effects/invalidation are post-commit.
- **Copying public LCP/INP budgets onto dashboard/overlay** — rejected (Q62): targets
  are set with Q54 workflow input before implementation, not silently copied.
- **Selecting a public starter, dashboard, controller or panel here** — rejected: those
  are Q46/Q47's explicit choices; candidates remain candidates (Q40/Q46/Q47).

## Non-decisions

This record selects **no** public starter, dashboard, overlay controller or panel (Q46/
Q47); no Q47 wire mechanics (route shapes, validation, serialization, errors); no Q70
driver/sync mechanics beyond the export boundary and per-session lifetime; no Q66/Q67/Q68
mechanisms (only named seams/requirements); **no verified install-specifier behaviour**
(the §12 table is provisional; the phase-006 probe observes actual pnpm mechanics); no
root product package layout (shape only, per the task execution note); no performance
target is adopted (§17 are proposals). It reopens no locked decision
(Q10/Q11/Q25/Q29/Q32/Q36/Q41/Q45/Q48/Q49/Q52/Q53/Q55/Q64).

## Consequences

- Consumers compose by editing a project-owned composition root; platform updates flow
  through package updates without regeneration; the frontend-independence boundary is
  package-separable and lint-checkable.
- The one-Worker topology gives cookie/CSRF/origin enforcement a single authority point
  and makes Q68's no-opt-out profile rule enforceable at one mount.
- The UOW participation contract makes cross-module atomicity expressible within Q52's
  single-batch limit — its rollback proof is required phase-006 evidence.
- Install-mechanics work (scaffold/upgrade implementation) must wait for both dev
  acceptance of §12/§13 and the phase-006 observed specifier evidence; unverified syntax
  never becomes implementation input by default.
- Q40 gate closure requires: phase-006 proofs (composition/dependency/browser-export
  checks, cross-module rollback, install probe), the dev's acceptance of the PROVISIONAL
  decisions, and the joint Q40/Q47/Q46 closure (7.8). None is granted by this record.

## Follow-on decisions needed

- **Dev:** accept/reject the starred PROVISIONAL decisions (§3 layout, §4
  packaging/execution, §10 ID algorithm + finality, §12 specifiers + ownership,
  §13 AI artifacts, §17 target proposals, §15 orchestration).
- **Task 3.2 (Q47):** finalize the §17 dashboard/overlay targets with the dev; own wire
  mechanics; re-slice §3 if the contract design requires.
- **Task 3.3 (Q46):** select the public starter; confirm the §4/§5 topology hosts it.
- **Task 3.4 (Q70):** design the driver/OPFS/sync mechanics behind §14's boundary.
- **Phase-006 (tasks 6.1–6.3):** run the composition/rollback/install/browser-export
  proofs and the two-host fixture; record observed results in the evidence report.
- **Phase-007 (task 7.8):** reconcile and jointly close Q40/Q47/Q46; then this ADR may
  move Proposed → Accepted → Closed per the canonical gate table.
