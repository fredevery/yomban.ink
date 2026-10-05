---
title: Q38 — core capability inventory and required-vs-optional policy (design input)
created_session: "20261004_223134_6aded7"
sessions: ["20261004_223134_6aded7"]
approved: false
---

# Q38 — Core capability inventory and required-vs-optional policy

> **Status: proposed design input for gate Q38 — a design input, NOT a closed gate.**
> This is the task 1.1 deliverable (`docs/plans/000_spike-plan/tasks/phase_001/task_1.1.md`):
> it proposes the **complete capability inventory** and the **required-versus-optional policy**
> for the Yomban.ink core. Q38 remains OPEN until the dev approves it and the Q38 gate closes
> (`docs/specs/000_index.md` §Canonical gate table). Nothing here selects package paths, package
> names, file layouts, component versions, or execution topology — **Q40 alone owns
> packaging-versus-execution** — and nothing here chooses which concrete capability-check
> implementations the conformance harness (task 1.2) will run.
>
> **Evidence note:** per plan 000, execution results for any proposed capability-conformance
> check are **NOT YET RUN**. This design inputs the harness that task 1.2 will build; no check in
> this document has been executed and none is claimed to pass.

## 1. Scope and authority

Gate Q38 inventories server/core/headless-client capabilities and the required-vs-optional
policy, using Q42's shared-platform implications as audited input. It is the first foundational
spike; it blocks the Q35 capability verification, the finalized Q25/Q30 boundaries, the Q37 auth/base
infrastructure inventory and foundational implementation start. **It does not decide
packaging-vs-execution** — that is Q40 alone. [Q19, Q38; `000_index.md` §Canonical gate table]

The inventory is grounded in:

- **`docs/discovery/understanding.md`** — Q30 (core-provides vs module-provides), Q35 (manifest
  contract), Q37 (data ownership), Q38 (inventory), Q39 (core-vs-module rule), Q42 (pilot audit
  shared implications), Q45 (D1-only datastore declaration), Q50–Q59 (permissions, contracts,
  unit-of-work, config/secrets, content, observability, jobs, cache, media, security),
  Q70 (local-first datastore + sync), Q71 (privacy guardrails).
- **`docs/discovery/understanding-amendments-001.md`** — Q70 full shape (datastore capability
  seam binding Drizzle to the environment's SQLite driver; aggregate-root declarations) and the
  Q38 amendment that adds the datastore capability seam to this inventory.
- **`docs/discovery/understanding-amendments-002.md`** — Q71 privacy scope; three locked
  platform guardrail seams; Q70 confirmed as an **MVP deliverable**.
- **`docs/specs/002_module-platform-contract.md`** — §§"What the core provides vs what a module
  provides" and "The module manifest contract" are the spec authority for the core/module seam.
- **`AGENTS.md`** — the non-negotiables (bound w/ this inventory): docs-first, build-time
  composition only, module-owned schema + core migration runner, TS strict (no `any`, no
  `export *`), TDD, PascalCase module-owned enums, prefixed sortable TEXT ids, frontend
  independence locked, one-D1-batch unit-of-work atomicity, one-task-one-commit, "Yomban.ink".

## 2. Capability inventory

Every capability below is **provided by the core as a framework-free seam** (the two-axis
policy's Axis 1 — §3). "Owner: core" means the core owns the cross-cutting seam and its
contract; feature semantics stay in ordinary modules. Each entry also gives the axis-2
optionality and the missing-capability behavior. Row count: **12 capabilities**.

A two-letter slot key (C1…C12) is assigned for stable reference from the evidence/manifest and
from the task‑1.2 harness; the keys are doc‑local, not package identifiers.

### C1 — Datastore (D1 server-side + client-local SQLite driver seam)

- **Owner:** core — the datastore *capability seam* binds a Drizzle instance to the
  environment's SQLite driver, so module code names no driver and never touches a binding.
- **Environments:** Worker/server (D1 binding) **and** browser (client-local SQLite in a Web
  Worker over OPFS under Q70) — one seam, two driver surfaces, same `sqliteTable` schema and
  same Drizzle query code.
- **Consumers:** every server module (reads/writes through Drizzle), modules that opt into
  local-first client storage, the core migration runner, the core unit-of-work seam (C10),
  registry services contributing deferred operations.
- **Optionality:** **REQUIRED.**
- **Missing-capability behavior:** module registration/conformance **FAILS** — a module that
  declares a datastore requirement cannot register if the seam is absent, and the platform cannot
  serve data-backed features. Failing loudly is correct; a missing datastore is non-omittable.
- **Locked source:** Q10/Q45 (D1-only server datastore, Drizzle schema/query, no query-builder
  abstraction); Q70 §2 (datastore capability seam, browser-side store); Amendment 001 Q38
  (capability seam added to this inventory); Amendment 002 Q70 (MVP deliverable);
  `002_module-platform-contract.md` §"No direct binding or datastore access".

### C2 — Storage (R2 + upload/transform contracts)

- **Owner:** core provides R2 storage *infrastructure* and the upload/transform **contracts**;
  media *records* and per-module asset ownership remain an ordinary module (Q37/Q58).
- **Environments:** Worker/server (R2 binding via the core seam, never direct module access);
  headless client contracts for upload/signing where Q47/Q54 define them.
- **Consumers:** media/asset modules, content modules referencing media, optional host/panel
  upload surfaces, backup/retention tooling (Q65).
- **Optionality:** **OPTIONAL / CONDITIONAL.**
- **Missing-capability behavior:** a module that opts into storage **degrades or refuses
  EXPLICITLY** — upload/transform consumers fail on a declared storage capability being absent
  (clear error, never silent), and features that do not declare storage requirements operate
  unaffected. R2 is only MV-conditional, not mandatory core.
- **Locked source:** Q30 (storage seam); Q37 (media records not core schema); Q58 (media module
  owns records; core provides R2 infrastructure + upload/transform contracts); Q65 (R2
  backup/retention mechanics owned by Q65).

### C3 — Filesystem (CLI/scaffold vs Worker non-persistent temp)

- **Owner:** core — a single filesystem-capability entry with **two disjoint environments**:
  (a) **CLI/scaffold**: local filesystem writes generated by the `init`/`create-module`
  dev tooling (project-owned files), and (b) **Worker request-local**: the Workers writable
  `/tmp`, which is **request-local and non-persistent**. Persistent objects go through R2
  (C2). There is **no persistent Worker filesystem.**
- **Environments:** CLI (dev-time local generation) and Worker request-local temp only.
- **Consumers:** CLI scaffold/`create-module` file generation; request-scoped Worker temp use
  within the Workers execution model.
- **Optionality:** **OPTIONAL / CONDITIONAL** (the CLI generation facet is used by the CLI
  surface; the Worker request-local facet exists only where a module handles request-scoped
  temp files. Neither is a runtime-required server capability for a headless-deployable
  service-only module).
- **Missing-capability behavior:** where absent → dependent scaffold/temp features **degrade or
  refuse EXPLICITLY**; a feature that relies on persistent storage is never silently redirected
  to a non-persistent temp path (that would corrupt expectations).
- **Locked source:** Q30 ("Workers writable `/tmp` is request-local/non-persistent; persistent
  objects use R2"); Q30 ("scaffold filesystem writes are local CLI generation, not
  production Worker filesystem semantics"); Q44 (CLI command inventory).

### C4 — Cache + invalidation

- **Owner:** core — a **typed cache capability with purge/invalidation hooks**; content writes
  trigger post-commit invalidation fan-out through core, not ad-hoc direct module KV access.
- **Environments:** Worker/server (KV via the core seam; Cache API semantics documented),
  headless client read contracts where applicable.
- **Consumers:** content/publishing modules, reads, optional public/SSR surfaces, and the
  Q67 author read-your-writes / propagation design it consumes.
- **Optionality:** **OPTIONAL / CONDITIONAL.**
- **Missing-capability behavior:** a module that declares caching gets **explicit** behaviour —
  uncached reads (correct, just slower) or an explicit refusal where the module requires a
  cache guarantee it cannot get. A missing cache must never deploy a silent stale-read hazard.
- **Locked source:** Q57 (core typed cache + purge hooks locked; KV eventual-consistency and
  Cache-API local-purge limits stated); Q67 (author consistency/propagation/preview isolation
  is a separate affected-work gate that defines actual guarantees); Q66 (durable invalidation
  effects owned by Q66).

### C5 — Auth / authorization

- **Owner:** core — auth handling via better-auth plus the roles+permission-scope model
  (Q50), with a core auth/authorization seam; baseline safe-by-default protections
  (Q59); modules never implement auth primitives themselves.
- **Environments:** Worker/server (session/cookie + machine-token + public-form surface
  profiles), headless client auth contracts; first-admin bootstrap and rate limiting are Q68.
- **Consumers:** every authenticated/machine-authenticated surface (API and optional HTML
  admin/editing paths — same domain/authorization operations, Q51); all module permission
  checks.
- **Optionality:** **REQUIRED.**
- **Missing-capability behavior:** module registration/conformance that declares an auth
  dependency **FAILS**; the platform cannot safely serve authenticated surfaces without the
  auth seam. Failing loudly is non-negotiable (Q59 baseline protections apply to every
  registered surface, no unprotected opt-in/opt-out).
- **Locked source:** Q50 (roles + permission-scopes, module-prefixed `Key = 'Key'` keys);
  Q51 (API + HTML admin paths share authorization); Q59 (safe-by-default baseline, every
  surface authorized); Q68 (security profiles/rate-limit/first-admin are a separate gate);
  `002_module-platform-contract.md` §"No direct binding or datastore access".

### C6 — Routing / config / secrets

- **Owner:** core — a Hono routing seam through which modules mount declared routes, a
  validated project-config seam and a **secrets seam** that is the only path by which
  secrets reach modules (never direct binding access). Q53 patterns govern config.
- **Environments:** Worker/server; headless/server-safe module contracts; config effective
  per invocation/effective runtime configuration, validated by core before serving.
- **Consumers:** every module that registers routes, declares a config schema, or needs a
  secret; the CLI/dev surfaces read the same validated config direction.
- **Optionality:** **REQUIRED.**
- **Missing-capability behavior:** a module declaring routes/config/secrets **FAILS to
  register** when the seam is absent; invalid configuration must fail safely with diagnostics
  rather than rely on a one-time cold start (Q53). Secrets absence is a hard registration
  failure — never silent.
- **Locked source:** Q12/Q13 (Hono entrypoints, Workers); Q53 (manifest config schemas + core
  secrets seam, validated before serving; no direct binding access); Q59 (baseline protections
  on every surface); `002_module-platform-contract.md` §"The module manifest contract".

### C7 — Jobs (queues / cron)

- **Owner:** core — manifest-declared queue consumers + cron schedules wired at build, via a
  core jobs seam; consumers do not author wrangler queue/cron entries directly.
- **Environments:** Worker/server (Workers queues + cron via the core wiring; built at
  build-time, never a runtime loader).
- **Consumers:** modules that declare queue consumers or cron contributions (Q35/Q56), e.g.
  media transforms, GC purges (Q70 §8), data export/backup jobs (Q42 shared implications).
- **Optionality:** **OPTIONAL / CONDITIONAL.**
- **Missing-capability behavior:** a module that declares a job dependency **degrades or
  refuses EXPLICITLY** — scheduled/queued work that cannot run reports the gap rather than
  silently dropping work. Delivery is never exactly-once; Q66 owns at-least-once/idempotency
  semantics before affected async work.
- **Locked source:** Q56 (manifest-declared queues/cron + core jobs seam locked; Q66 owns
  delivery/idempotency/retry); Q35 (manifest declares queue/cron contributions);
  `002_module-platform-contract.md` §"The module manifest contract".

### C8 — Observability / redaction

- **Owner:** core — logger/tracer/metrics seams with pluggable project-configurable sinks,
  ships **redaction-by-default** (no PII, request bodies, tokens or full auth payloads in
  default logs/traces/diagnostics).
- **Environments:** Worker/server invocation-scoped (Q40 owns trace/user/service lifetime);
  CLI diagnostics; no raw `console`/binding logging from modules.
- **Consumers:** every module (logs via the seam), operators (sink config), the Q65/Q71
  privacy guardrails, Q66 (best-effort telemetry vs durable business effects).
- **Optionality:** **REQUIRED** as the observability *seam* (and its redaction-by-default
  rule is a locked platform guardrail, Q71).
- **Missing-capability behavior:** a module can operate without deep telemetry, but the core
  observability seam (with redaction-by-default) is **REQUIRED**; absence → module registration
  relying on the seam fails, and default diagnostics must never leak PII silently. Features
  degrade only where the seam guarantee is absent — never silently.
- **Locked source:** Q55 (core logger/tracer/metrics seams + pluggable sinks locked; request
  context cannot leak between invocations); Q59/Q71 (redaction-by-default locked);
  `002_module-platform-contract.md` §"What the core provides vs what a module provides".

### C9 — Identifiers (prefixed sortable TEXT ids)

- **Owner:** core — one id-service seam generating globally-unique, sortable, URL-safe TEXT
  ids with an entity-type prefix (e.g. `pg_<ulid|uuidv7>`); **no INTEGER auto-increment PKs**.
  ID-prefix registration in the manifest is the single namespace authority (reused by
  permission keys). Client-generated ids also serve offline record creation, change-set `op_id`s
  and the sync idempotency-key surface (Q11 Amendment 001 / Q70).
- **Environments:** Worker/server and browser/clients (client-generated id path under Q70);
  shared by all modules; core base schema (better-auth entities) must also use prefixed TEXT ids
  (verified under Q63).
- **Consumers:** every module declaring IDs; the Q70 change-set/idempotency surface; identity is
  addressability-agnostic (slugs are separate secondary unique keys).
- **Optionality:** **REQUIRED.**
- **Missing-capability behavior:** a module declaring an ID prefix with no id-service **FAILS**
  registration (prefix collision/conformance failure). An absent id-service means the platform
  cannot provide stable independent identities — non-omittable.
- **Locked source:** Q11 (prefixed sortable URL-safe TEXT ids via one core id-service; no
  INTEGER PKs); Q25 (no INTEGER ids enforced by lint); Q35 (manifest ID-prefix registration) +
  `002` §"The module manifest contract" (single namespace authority); Q63 (Better Auth
  prefixed-TEXT-id evidence gate).

### C10 — Module registry + unit-of-work

- **Owner:** core — the module registry/wiring that resolves manifest-declared dependencies at
  build-time (registry-provided typed services, Q41) **and** the core unit-of-work seam over one
  D1 prepared-statement batch (Q52). Grouped as one cross-cutting slice: wiring + the single
  correctness seam over it.
- **Environments:** Worker/server (build-time registry composition; runtime invocation-scoped
  wiring), registry services contributing deferred operations to the same single-D1 unit of
  work. The client-local store is a separate execution surface under Q52 (local writes sit
  outside the D1 batch by definition, Q70 A2).
- **Consumers:** every module (registration, dependency resolution, runtime services); every
  data-writing operation (unit-of-work atomicity); the conformance harness (task 1.2).
- **Optionality:** **REQUIRED.**
- **Missing-capability behavior:** without the registry, modules cannot register or resolve
  services — registration/conformance **FAILS** for any module. Without the unit-of-work seam,
  modules must not claim cross-feature atomicity; absence fails any module that declares
  transactional boundaries.
- **Locked source:** Q29/Q41 (build-time composition; registry-provided typed services);
  Q37 (module-owned schema + core migration runner); Q52 (one D1 database + one batch;
  registry services contribute to the same UOW); Q61 (conformance harness runs in CLI/build/CI
  before registration); `002_module-platform-contract.md` §"Intermodule relationships", §"Workflow
  and unit of work".

### C11 — Headless / host seams (framework-free client contracts, host integration, overlay controller)

- **Owner:** core — framework-free client contracts (shared per-module contract packages,
  Q51), the headless/server-safe browser edge (Q47), host-integration and overlay-controller
  responsibilities. These are **seams/contracts**, not a selected presentation implementation;
  no public starter/dashboard/controller/panel is selected.
- **Environments:** browser/headless (frontend-independent, no direct/transitive presentation
  dependency including Svelte/SvelteKit and htmx); server-safe contracts shared across surfaces;
  host integration on the consuming application's DOM.
- **Consumers:** consuming applications/hosts, headless client readers, optional presentation
  facets; the two acceptance fixtures (plain HTML + bounded reactive host) prove independence.
- **Optionality:** **OPTIONAL / CONDITIONAL** — headless/host contracts are a **required core
  seam for any module/client that needs them**, but an individual consuming project may use
  none (a service-only deployment needs no host seam). These are conditionally-required
  contracts, never a mandatory component framework.
- **Missing-capability behavior:** a module that registers headless/host-facing exports with
  no supporting seam **fails conformance** for browser-safe exports; a project that opts out of
  host integration simply has no overlay (its non-UI capabilities remain fully operable).
  Absence degrades/refuses explicitly, never silently.
- **Locked source:** Q1/Q8/Q22/Q46/Q47 (frontend independence locked; distinct roles, none
  selected); Q51 (shared contract per module, browser-safe exports); Q47 (headless/host
  interfaces + explicit dashboard/controller/panel choice); `002_module-platform-contract.md`
  §"Architectural roles", §"What the core provides vs what a module provides".

### C12 — PII classification / erasure hooks (privacy guardrails)

- **Owner:** core — three **REQUIRED platform-guardrail seams**: (1) redaction-by-default in
  the observability seam (C8 — see §2), (2) a **data-classification / PII-marking seam**
  so modules flag PII-bearing fields, and (3) **erasure/retention primitives** that reach
  on-device replicas so a data-subject request is not satisfied by server-side deletion alone.
- **Environments:** Worker/server and browser/client-local (erasure/retention must reach
  OPFS Class-1 authored data under Q70).
- **Consumers:** every module that stores PII-bearing data, the Q65 erasure/retention design,
  the Q70 client-local tombstone/purge path, Q68 surface profiles, operators fulfilling DSRs.
- **Optionality:** **REQUIRED** (platform guardrail seams). Concrete mechanics are **deferred**
  to Q65/Q70/Q59/Q68 — this inventory enumerates the seams; it does not implement them.
- **Missing-capability behavior:** these are non-omittable guardrails — absence **FAILS
  registration** for any module that flags PII-bearing fields (redaction/PII-seam absent), and
  erasure/retention absent means a DSR cannot be fulfilled → explicit refusal, never silent. The
  lawful-basis/consent/DSR *policy* stays per-project (Q71) and is not a platform gate.
- **Locked source:** Q71 (platform-guardrailed, per-project-policied; extend to client-local
  data); Q59 Amendment 002 (three guardrails locked); Q65 Amendment 002 (erasure/retention
  extends to client-local store); Q70 §8 (tombstones/retention/GC in the local store);
  `docs/specs/007_security-and-identity.md` §Privacy.

## 3. Required-vs-optional policy

The policy is **two-axis**, applied per capability:

**Axis 1 — core provision (applies to every capability, C1–C12).**
Every capability is *provided by the core as a framework-free seam*: modules reach it through a
core service/capability interface — **never** by touching Cloudflare bindings, raw SQL outside
Drizzle, secrets, or any presentation framework/library. Datastore is one capability, not one
uniform abstraction for database/storage/cache/queues/auth. This axis is unconditional.

**Axis 2 — omittability (classifies each capability).**
- **REQUIRED (non-omittable):** **datastore** (C1), **config/secrets + routing** (C6),
  **auth/authorization** (C5), **module registry/wiring + unit-of-work** (C10),
  **identifiers** (C9), **observability/redaction seam** (C8), and the **PII
  classification/erasure guardrail seams** (C12).
- **OPTIONAL / CONDITIONAL:** storage/R2 (C2), filesystem (C3), cache+invalidation (C4),
  jobs/queues/cron (C7), headless/host seams (C11).

**PII guardrail seams are REQUIRED (C12).** The gate shorthand grouped "PII hooks" loosely with
the conditional set; the settled classification is **REQUIRED** per the dev's decision #3 and
Q71 — PII classification and erasure/retention are non-omittable platform guardrails, not
optional capabilities. This resolves the shorthand in favour of the explicit decision.

**Behavior on a missing capability:**
- **Missing a REQUIRED capability → module registration/conformance FAILS.** A module whose
  manifest declares a dependency on a required core seam cannot register if that seam is
  absent; the platform fails loudly rather than serving a silently-unsafe surface.
- **Missing an OPTIONAL capability → the dependent feature degrades or refuses EXPLICITLY,
  never silently.** An optional seam's absence never presents a silent hazard: reads fall back
  honestly (e.g. uncached), or the feature refuses with a clear error where it genuinely needs
  the capability (e.g. a persistent-storage consumer never silently redirects to a
  non-persistent temp path; a PII-bearing operation never skips erasure).

**Built-in features and presentation are ordinary modules (not privileged).** The bundled
dashboard/component-kit/panel are not mandatory core; **design tokens are not a core runtime
capability** (§6). A consumer can omit all presentation and still deploy a service-only module
end-to-end.

**What this policy does NOT decide.** It does **not** select package paths, package names, file
layouts, or execution topology (Q40 alone owns packaging-versus-execution), and it does **not**
choose which concrete capability-check implementations the task-1.2 harness runs. Those are
separate, later design outcomes.

## 4. Q42 shared-platform implications — core capability vs ordinary module

Q42's completed pilot audit listed **shared platform-tier implications**. Each maps either to a
core capability in §2 or to an ordinary (built-in, non-privileged) module per Q39:

| Q42 shared implication | Classification | Maps to |
|---|---|---|
| Content/collection engine (draft/publish lifecycle, reference fields) | **Ordinary module** (feature capability; Q39) | content module set (Q54) |
| Publishing-lifecycle mixins (visibility, soft-delete, `sort_order`) | **Ordinary module** semantics on core seams | content module (Q54) over C1/C10 |
| Media / R2 / Images pipeline | **Ordinary module feature** built on the core C2 storage seam | media module (Q37/Q58) |
| KV caching with versioned keys + write-invalidation | **Core capability** | C4 (+ Q57/Q67 guarantees) |
| SSR shell / routing / chrome | **Core seam + ordinary presentation** | C6 routing; presentation is optional (C11, Q47) |
| SEO / OpenGraph / meta | **Ordinary module** | content/presentation modules (Q62) |
| Module registry + build-time wiring | **Core capability** | C10 (Q41) |
| Job orchestration | **Core capability** | C7 / Q56 (pairs with the Q56 contract) |
| Data export / backup | **Ordinary module** on core priming + Q65 design | backup/retention (Q65) over C1/C2/C8/C12 |

The rule (Q39): a **core capability** is cross-cutting infrastructure *any* module may need —
its seam must exist for a module to operate on it. A **feature capability** (content, media,
SEO, export) is an ordinary module on equal footing with custom modules — it composes the same
core seams with no privileged access. Q42 is audited *input*, not a commitment to ship every
candidate (Q6/Q33/Q19).

## 5. Q70 additions to the inventory

- **Datastore capability seam (C1).** Per Amendment 001 Q38, the inventory adds the seam that
  binds a **Drizzle instance to the environment's SQLite driver** — D1 server-side, browser
  SQLite client-side — so modules write Drizzle and run on both surfaces without naming a
  driver. The browser-side store is a new export boundary under Q40. Same `sqliteTable` schema,
  different driver; no query-builder abstraction (Q10/Q45 not reopened; Q70 A1/A2). Q70 is an
  **MVP deliverable** (Amendment 002 Q70).
- **Aggregate-root declarations.** Modules declare their **aggregate roots** (the Q70
  sync-and-lock / revision / conflict units) and the child tables that ride under each root in the manifest
  (Q35/Q37 Amendment 001). The datastore capability (C1), unit-of-work (C10) and PII erasure
  (C12) seams all act at the root granularity; the change-set maps 1:1 onto one D1 batch
  (Q52 Amendment 001); `change_set_id` is the sync idempotency key (Q66 Amendment 001); presence
  leases are **advisory**, never an atomicity claim (Q52).

These additions are **additive** — they reopen no locked decision and introduce no new gate
(Q70 gate is owned in spike plan 000 and chains before the MVP local-first experience).

## 6. Design tokens — cross-cutting consideration, not core runtime capability

**Design tokens are a presentation-consistency CONSIDERATION referenced from the optional
admin/panel row (C11)** — a first-class consistency concern for optional presentation, **not a
core runtime capability** and not a permission to import UI into headless core (Q38). Tokens use
core/headless seams through the standards, but their **packaging is owned by Q40**, and they are
not part of the §2 inventory's runtime-required seam set. The bundled dashboard/component-kit/
panel presentation — including design tokens — is **not mandatory core**; a consumer may replace
or omit it without disabling any non-UI capability (Q30/Q39/Q47).

## 7. Explicit non-decisions (this document)

- Does **not** select package paths, package names, file layouts, component versions, or
  execution/deployment topology — **packaging-versus-execution is Q40 alone** (Q19/Q38;
  `000_index.md`).
- Does **not** select which concrete capability-check implementations the task-1.2 conformance
  harness runs — it enumerates capabilities and the policy; the harness design is task 1.2's
  work, and no check here has been executed (NOT YET RUN).
- Does **not** reopen any locked decision (Q45 D1-only-for-server, Q52 single-batch atomicity,
  no-query-builder abstraction, frontend independence) — Q70/Q71 additions are additive.
- The dashboard/component-kit/panel/design-token **presentation is not mandatory core**, and
  built-in features are **ordinary modules** on equal footing with custom modules (Q39).
