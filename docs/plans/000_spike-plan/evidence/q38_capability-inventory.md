---
title: "Q38 — Core capability inventory and required-vs-optional policy (evidence: requirement → capability/check-case map)"
created_session: "20261004_224013_192e84"
sessions: ["20261004_224013_192e84"]
approved: false
---

# Q38 — Evidence report (task 1.1) — capability inventory: requirement → capability / check-case map

> This is the **Q38 evidence report for task 1.1** (`docs/plans/000_spike-plan/tasks/phase_001/task_1.1.md`).
> It is a **requirements → capability / check-case MAP**: it records, for every requirement drawn from the
> settled discovery and the module-platform contract, which inventory capability (C1–C12) it maps to and the
> **concrete capability/check case** that would verify it.
>
> **Every execution result below is labelled `NOT YET RUN (task 1.2)`.** Per the phase execution contract and
> the design's evidence note, the framework-free manifest/capability-check harness is **built and run in
> task 1.2** (`docs/plans/000_spike-plan/phases/phase_001.md`). **No check in this report has been executed and
> none is claimed to pass.** No observed output, exit code, dependency version or test count is asserted here;
> those are captured in task 1.2's execution of the harness. This report establishes the *mapping* and the
> *accepted inventory policy* only. It is constrained to the doc-only task 1.1 deliverable — no other file is
> created or modified, no code is written, and no harness/test is run.

## 1. Sources read (requirements grounded here)

- **Design** — `docs/plans/000_spike-plan/designs/q38_capability-inventory.md` (12 capabilities C1–C12; Axis 1
  core-as-framework-free-seam; Axis 2 required-vs-optional; Q42 shared implications; Q70 additions; design tokens).
- **Discovery** — `docs/discovery/understanding.md` Q30 (core-vs-module), Q35 (manifest contract), Q37 (data
  ownership), Q38 (inventory), Q39 (core-vs-module rule / non-privileged built-ins), Q42 (pilot audit shared
  implications), Q45 (D1-only datastore declaration), Q50 (RBAC), Q51 (shared contracts), Q52 (unit of work),
  Q53 (config & secrets), Q54 (content capability), Q55 (observability), Q56 (jobs), Q57 (cache), Q58 (media),
  Q59 (security baseline), Q70 (local-first datastore/sync), Q71 (privacy guardrails).
- **Specification** — `docs/specs/002_module-platform-contract.md` §"What the core provides vs what a module
  provides", §"The module manifest contract", §"Conformance and boundary enforcement", §"Workflow and unit of
  work"; `docs/specs/000_index.md` §Canonical gate table (Q38 gate).
- **Plan/phase/task** — `docs/plans/000_spike-plan/phases/phase_001.md` (task 1.1 definition + task 1.2
  acceptance behavioural cases and the task-1.2 verification commands), `task_1.1.md`.

## 2. Requirements → capability / check-case matrix

The matrix rows draw on the requirements in the discovery questions and spec 002 §Core/§Manifest named above,
and on the exact behavioural cases task 1.2's acceptance in `phase_001.md` requires the harness to cover
(a valid service-only module; an absent OPTIONAL capability; a rejected MISSING REQUIRED capability; a wrong
environment; an undeclared dependency/capability; ordinary built-in/custom parity). Each row names the
requirement with its source, the capability entry it maps to (C1–C12 / global), and the concrete capability/
check case that would verify it. Rows are grouped: capability classification (per C), cross-cutting invariant
checks, and task-1.2 behavioral fixtures.

### 2.1 Capability classification (Axis 1 + Axis 2) — C1–C12

| # | Requirement (source) | Capability | Capability / check case to verify (task 1.2) | Result |
|---|---|---|---|---|
| R1.1 | A core **datastore capability seam** binds a Drizzle instance to the environment's SQLite driver so module code names no driver and never touches a binding; D1 server-side, browser-local SQLite client-side under Q70 (design C1; Q10/Q45/Q70; 002 §"No direct binding or datastore access"). Classified **REQUIRED**: a module declaring a datastore requirement must fail registration if the seam is absent. | C1 | **Check C1-REQ:** a manifest declaring a datastore requirement resolves against a fixture where the datastore seam is present → registers. **Check C1-MISSING:** the same manifest against a fixture with the datastore seam absent → registration/conformance **FAILS** (non-omittable). **Check C1-NAMES-NO-DRIVER:** module datastore usage declares the D1 binding/requirement only via the manifest, with no raw binding/driver naming in module code. | NOT YET RUN (task 1.2) |
| R1.2 | Core provides **R2 storage *infrastructure*** and upload/transform **contracts**; media *records* and per-module asset ownership stay an ordinary module (design C2; Q30/Q37/Q58). Classified **OPTIONAL / CONDITIONAL**: absent storage → dependent consumers degrade or refuse EXPLICITLY, never silently. | C2 | **Check C2-OPT-ABSENT:** a module that opts into storage, run against a fixture with no storage seam → upload/transform path fails **explicitly** with a clear error (no silent fallthrough), and features that declare no storage requirement remain operable. **Check C2-RECORDS-ORDINARY:** media *records* ownership is not asserted as core schema (ordinary module owns records), checked in the manifest/classification fixture. | NOT YET RUN (task 1.2) |
| R1.3 | Core provides a **filesystem** entry with two disjoint environments: CLI/scaffold local generation and Worker **request-local, non-persistent** `/tmp`; no persistent Worker filesystem; persistent objects go through R2 (design C3; Q30). Classified **OPTIONAL / CONDITIONAL**. A persistent-storage consumer must never be silently redirected to a non-persistent temp path. | C3 | **Check C3-ENV-SPLIT:** the filesystem capability is declared as two disjoint environment facets (CLI-scaffold vs Worker request-local temp), never a persistent worker filesystem. **Check C3-NO-SILENT-REDIRECT:** a manifest declaring persistent storage against a fixture with only the temp facet → explicit refusal (degrade/refuse, never silent redirection to `/tmp`). | NOT YET RUN (task 1.2) |
| R1.4 | Core provides a **typed cache** capability with purge/invalidation hooks; content writes trigger post-commit invalidation through core, not ad-hoc direct KV access (design C4; Q57). Classified **OPTIONAL / CONDITIONAL**: absent cache → uncached-but-correct reads or explicit refusal, never a silent stale-read hazard. | C4 | **Check C4-OPT-ABSENT:** a module declaring caching against a fixture with the cache seam absent → explicit behaviour (honest uncached read or explicit refusal), never a silent stale-read hazard. **Check C4-NO-DIRECT-KV:** cache reads/writes route through the core seam; no direct KV binding access appears in module cache usage. | NOT YET RUN (task 1.2) |
| R1.5 | Core provides **auth/authorization** via better-auth plus the roles + permission-scope model (Q50); safe-by-default baseline protections (Q59). Classified **REQUIRED**: missing auth seam → registration/conformance FAILS for a module declaring an auth dependency. (Q68 owns concrete security surface profiles/rate-limit/first-admin — separate gate, not this inventory.) | C5 | **Check C5-REQ-PRESENT:** a manifest declaring an auth dependency resolves against a fixture with the auth seam present. **Check C5-MISSING:** same manifest against a fixture with the auth seam absent → registration/conformance **FAILS** (non-omittable). **Check C5-NO-PRIMITIVES:** module code does not implement auth primitives itself; permission keys are module-prefixed `Key = 'Key'` enums (Q50 grammar) declared in the manifest. | NOT YET RUN (task 1.2) |
| R1.6 | Core provides a **routing seam** (Hono), validated **config** seam and a **secrets** seam as the only path by which secrets reach modules; invalid config fails safely with diagnostics; secrets absence is a hard registration failure (design C6; Q12/Q13/Q53/Q59). Classified **REQUIRED**. | C6 | **Check C6-REQ-MISSING:** a manifest declaring routes/config/secrets against a fixture with the routing/config/secrets seam absent → **FAILS to register**. **Check C6-CONFIG-INVALID:** invalid config values → safe failure with diagnostics (not a one-time-cold-start-only check). **Check C6-SECRETS-SEAM-ONLY:** secrets are reached only through the core seam; no direct binding access. | NOT YET RUN (task 1.2) |
| R1.7 | Core provides **manifest-declared queue consumers + cron schedules** wired at build via a core jobs seam; consumers do not author wrangler queue/cron entries directly (design C7; Q56/Q35). Classified **OPTIONAL / CONDITIONAL**: a declared job dependency that cannot run must degrade or refuse EXPLICITLY, never silently drop work. Delivery never exactly-once (Q66 owns idempotency later). | C7 | **Check C7-OPT-DROP-REFUSES:** a manifest declaring a job dependency against a fixture with the jobs seam absent → reports the gap explicitly (degrade/refuse), never silently drops scheduled/queued work. **Check C7-NO-WRANGLER:** queue/cron contributions are declared in the manifest and wired by the core seam; no wrangler entry authored by a consumer. | NOT YET RUN (task 1.2) |
| R1.8 | Core provides **logger/tracer/metrics** seams with pluggable project-configurable sinks and **redaction-by-default** (no PII, request bodies, tokens or full auth payloads) (design C8; Q55/Q59/Q71). Classified **REQUIRED** as the observability seam; modules log via the seam, not raw console/bindings. | C8 | **Check C8-REQ-MISSING:** a module relying on the observability seam against a fixture with the seam absent → registration **FAILS** (non-omittable seam). **Check C8-NO-RAW-CONSOLE:** module logging routes through the seam; no raw `console`/binding logging. **Check C8-REDACTION:** default diagnostics redact PII/request bodies/tokens/full auth payloads (no silent PII leakage). | NOT YET RUN (task 1.2) |
| R1.9 | Core provides a **prefixed, sortable, URL-safe TEXT id-service** with entity-type prefix; **no INTEGER auto-increment PKs**; ID-prefix registration in the manifest is the single namespace authority (reused by permission keys) (design C9; Q11/Q25/Q35/Q63). Classified **REQUIRED**: a module declaring an ID prefix with no id-service, or a prefix collision, **FAILS** registration. | C9 | **Check C9-REQ-MISSING:** a manifest declaring an ID prefix against a fixture with no id-service → registration **FAILS**. **Check C9-COLLISION:** two manifests registering the same ID prefix → conformance **FAILS** (single namespace authority). **Check C9-NO-INTEGER:** no INTEGER auto-increment PK pattern in module schemas. | NOT YET RUN (task 1.2) |
| R1.10 | Core provides the **module registry/wiring** resolving manifest-declared dependencies at build-time (registry-provided typed services, Q41) **and** the core **unit-of-work** seam over one D1 prepared-statement batch (Q52); registry services contribute deferred ops to the same single-D1 unit of work — atomicity is one D1 database + one batch, never across databases/R2/queues/caches (design C10; Q29/Q41/Q36/Q37/Q52). Classified **REQUIRED**. | C10 | **Check C10-REQ-MISSING:** any module manifest against a fixture with the registry/unit-of-work seam absent → registration/conformance **FAILS**. **Check C10-DEP-GRAPH:** declared module dependency graph resolves (valid service-only module needs no further components — task-1.2 parity fixture). **Check C10-UOW-ONE-BATCH:** a data-writing module uses one D1 batch via the core seam; no claim of atomicity across databases/R2/queues/cache purges. | NOT YET RUN (task 1.2) |
| R1.11 | Core provides framework-free **headless/host seams**: shared per-module contract packages (Q51), headless/server-safe browser edge (Q47), host-integration and overlay-controller seam responsibilities; **no presentation implementation is selected** and core/contracts/headless packages carry no direct/transitive presentation dependency incl. Svelte/SvelteKit/htmx (design C11; Q1/Q8/Q22/Q46/Q47/Q51). Classified **OPTIONAL / CONDITIONAL** — conditionally-required contracts, never a mandatory component framework. | C11 | **Check C11-OPT-ABSENT:** a module that registers headless/host-facing exports against a fixture with no supporting seam → fails conformance for browser-safe exports; a project that opts out of host integration has no overlay while its non-UI capabilities remain operable (degrade/refuse explicitly, never silently). **Check C11-NO-PRESENTATION-DEP:** core/headless/shared-contract package graphs contain no direct/transitive presentation dependency (see also R13.1). | NOT YET RUN (task 1.2) |
| R1.12 | Core provides three **REQUIRED privacy-guardrail seams**: redaction-by-default (C8), a **data-classification / PII-marking seam**, and **erasure/retention primitives** that reach on-device (OPFS CC1) replicas so a DSR is not satisfied by server-side deletion alone (design C12; Q71/Q59/Q65/Q70). Classified **REQUIRED** (platform guardrails); lawful-basis/consent/DSR policy stays per-project (Q71). | C12 | **Check C12-REQ-MISSING:** a manifest that flags PII-bearing fields against a fixture with the classification/redaction seam absent → registration **FAILS**. **Check C12-ERASURE-REACHES-CLIENT:** the erasure/retention check asserts erasure primitives extend to client-local replicas (a DSR is not satisfied by server-side deletion alone) — explicit refusal, never silent, where retention/erasure cannot be fulfilled. | NOT YET RUN (task 1.2) |

### 2.2 Required-vs-optional classification roll-up (Axis 2)

The two-axis policy is verified per capability above; the roll-up is the classification **policy** this evidence
report asserts (not a harness run), confirmed against the design §3:

- **REQUIRED (non-omittable):** datastore (C1), auth/authorization (C5), routing/config/secrets (C6),
  registry/unit-of-work (C10), identifiers (C9), observability/redaction (C8), PII classification/erasure
  guardrails (C12). Missing a REQUIRED capability → registration/conformance **FAILS**.
- **OPTIONAL / CONDITIONAL:** storage/R2 (C2), filesystem (C3), cache+invalidation (C4), jobs/queues/cron (C7),
  headless/host seams (C11). Missing an OPTIONAL capability → the dependent feature **degrades or refuses
  EXPLICITLY**, never silently.

### 2.3 Cross-cutting invariant checks

| # | Requirement (source) | Capability | Capability / check case to verify (task 1.2) | Result |
|---|---|---|---|---|
| R13.1 | **Frontend independence locked.** Core services, shared contracts and headless clients have **no direct or transitive presentation dependency** (incl. Svelte/SvelteKit and htmx); UI facets are optional and not prerequisites for registration (AGENTS.md #8; Q22/Q25/Q46/Q47/Q51; 002 §"Conformance and boundary enforcement"). Optional presentation packages are checked separately. | Global (C11 re: host seams; C1–C10 core/headless) | **Check FR-INDEP:** static dependency-graph scan of core/headless/shared-contract packages finds no direct/transitive dependency on any presentation framework/library; the valid **service-only module** fixture (no client UI, no presentation) registers and operates — ordinary built-in/custom parity (R14.2). | NOT YET RUN (task 1.2) |
| R13.2 | **No direct binding or datastore access.** Modules never directly access Cloudflare bindings, raw SQL outside Drizzle, or secrets; they use core service/capability seams (AGENTS.md #3; Q22/Q25/Q30/Q45/Q53/Q70; 002 §"No direct binding or datastore access"). | Global (C1–C12 seams) | **Check NO-BINDING:** boundary scan of module/core-headless usage finds no direct module binding access (D1/R2/KV/queue binding, raw SQL outside Drizzle, or secret) in core/headless code; all capability access goes through C1–C12 seams. | NOT YET RUN (task 1.2) |
| R13.3 | **No `any`, no `export *`, strict dependency direction.** TS strict; explicit error handling; modules depend on core (never core on module); shared typed-code imports obey declared boundaries (AGENTS.md #4; Q20/Q22/Q25/Q36/Q41/Q61; 002 "No `any`, no `export *`"). | Global (C1–C12 + module boundary) | **Check TS-STRICT:** project-wide lint/tsc check finds no `any` and no `export *`; dependency direction enforced (modules → core, never core → module). | NOT YET RUN (task 1.2) |
| R13.4 | **Boundary-lint + contract/conformance harness runs executable checks in CLI/build/CI before build-time registration** — deployed request initialization is not a test runner; it validates dependency graph, contract compatibility, names/prefixes and required capabilities without importing a specific presentation (design §2 C10, Missing-capability behavior; Q61; 002 §"Conformance and boundary enforcement"). | Global (C10 + manifest) | **Check HARNESS-BOUNDARY:** the checker exposes a public capability-validation entry invoked through both positive and negative manifest fixtures (task 1.2 execution note) and reports diagnostics; conformance runs as a CLI/build/CI-time check, not at request initialization. | NOT YET RUN (task 1.2) |
| R13.5 | **Non-decisions hold.** This inventory does **not** select package paths/names/file layouts/component versions/execution topology (Q40 alone owns packaging-vs-execution) and does **not** choose the concrete capability-check implementations (task 1.2's work). Dashboard/component-kit/panel/design-token presentation is **not mandatory core**; built-in features remain **ordinary modules** (design §3/§6/§7; Q30/Q39/Q47). | Global (policy) | **Check NO-TOPOLOGY-DECISION:** the inventory/manifest fixture asserts no package path, component version, or execution/deployment topology decision; design tokens are represented as a presentation-consistency consideration for optional presentation (C11), not a core runtime capability. | NOT YET RUN (task 1.2) |

### 2.4 Task-1.2 behavioral acceptance fixtures (from `phase_001.md` task 1.2 acceptance)

These are the exact behavioural cases task 1.2 must cover with real manifest inputs, exercising the checker's
actual behaviour (not equality against a duplicated expected inventory).

| # | Requirement (source) | Capability | Capability / check case to verify (task 1.2) | Result |
|---|---|---|---|---|
| R14.1 | **A valid service-only module** registers and operates — no client UI, no presentation; core/headless seams fulfilled (Q7/Q28/Q39/Q43; 002 MVP criteria §service-only). | C1–C12 (minimal set) | **Check FIXTURE-SERVICE-ONLY:** a service-only module manifest (declares datastore, config/secrets, registry/UOW, identifiers, observability; no UI facets) passes conformance and registers. | NOT YET RUN (task 1.2) |
| R14.2 | **Ordinary built-in/custom parity** — built-in features are ordinary modules on equal footing with custom modules, competing on the same contract with no privileged access (Q39; 002 §Product framing). | Global (C1–C12) | **Check FIXTURE-PARITY:** a built-in module (e.g. the content/media representative) and a custom module declaring equivalent required capabilities pass/fail the SAME checks with no privileged path; no built-in bypasses a capability check that a custom module must satisfy. | NOT YET RUN (task 1.2) |
| R14.3 | **An absent OPTIONAL capability** — the dependent feature degrades or refuses EXPLICITLY, never silently (design §3/missing-optional; C2/C3/C4/C7/C11). | C2/C3/C4/C7/C11 | **Check FIXTURE-OPT-ABSENT:** a manifest declaring an OPTIONAL capability against a fixture omitting that seam → explicit degrade/refuse (clear error), never silent; unaffected features still operate. | NOT YET RUN (task 1.2) |
| R14.4 | **A rejected MISSING REQUIRED capability** — module registration/conformance FAILS when a declared REQUIRED seam is absent (design §3; C1/C5/C6/C8/C9/C10/C12). | C1/C5/C6/C8/C9/C10/C12 | **Check FIXTURE-REQ-MISSING:** a manifest declaring a REQUIRED capability against a fixture omitting that seam → registration/conformance **FAILS** (loudly, non-omittable). | NOT YET RUN (task 1.2) |
| R14.5 | **Wrong environment** — capabilities are delivery/environment-facet aware (e.g. Worker vs browser/local-first vs CLI; C1/C3/C11; Q30/Q70; manifest declares D1/binding + server vs client-local requirements). | C1/C3/C11 (+C6) | **Check FIXTURE-WRONG-ENV:** a fixture whose manifest environment declarations do not match the capability/environment surface offered (e.g. D1 requirement served only a client-local store, or a browser-facing export lacking the headless seam) → the checker reports the mismatch explicitly (conformance failure or explicit refusal), never silently serving the wrong surface. | NOT YET RUN (task 1.2) |
| R14.6 | **Undeclared dependency/capability** — manifest resolution validates the declared dependency graph and required capabilities; undeclared usages fail (Q35/Q36/Q41; 002 §"Intermodule relationships" / §"The module manifest contract"). | C10 (+ manifest deps) | **Check FIXTURE-UNDECLARED:** a manifest that uses a capability or module dependency it does not declare → conformance **FAILS** (no implicit/undeclared resolution). | NOT YET RUN (task 1.2) |

### 2.5 Q42 shared-platform implications → classification check

Task 1.1's Verification requires every requirement — including **Q42's completed pilot-audit shared
implications** — to map to a concrete capability/check case. Q42 is a completed input, not an MVP
commitment (Q6/Q33); the check verifies the classification policy: each shared-platform implication
is either a **core capability** (C1–C12) or an **ordinary module** (Q39, non-privileged).

| # | Requirement (source) | Capability | Capability / check case to verify (task 1.2) | Result |
|---|---|---|---|---|
| R15.1 | **Q42 core-capability implications** — KV caching with versioned keys + write-invalidation; module registry + build-time wiring; job orchestration (the FreeAgents DO/Queues pattern) map to **core capabilities**, not modules (design §4; Q42, Q57/Q41/Q56). | C4; C10; C7 | **Check Q42-CORE-IMPL:** the classification fixture asserts each of these is a **core capability** seam (C4 cache, C10 registry/wiring, C7 jobs), not an ordinary module — a consuming manifest declares the capability, not a module dependency to install. | NOT YET RUN (task 1.2) |
| R15.2 | **Q42 feature / ordinary-module implications** — content/collection engine, publishing-lifecycle mixins, media/R2/Images pipeline, SEO/OpenGraph/meta, data export/backup map to **ordinary modules** on core seams, while SSR shell/routing/chrome is a **core routing seam (C6) + optional presentation** (not an ordinary module) (design §4). | C1–C12 + ordinary modules | **Check Q42-FEATURE-ORDINARY:** the classification fixture asserts each ordinary-module implication is a **non-privileged module** (Q39) — carried by the built-in/custom **parity** fixture (R14.2); the module composes core seams (media pipeline → C2; export/backup → C1/C2/C8/C12) with no privileged access. | NOT YET RUN (task 1.2) |

## 3. Results

**No capability/check case has been executed.** Every result column above and every verification in this report
reads the same because the harness is task 1.2's work:

> **NOT YET RUN (task 1.2)**

No check is claimed to pass. There are no observed outputs, exit codes, dependency versions, or test counts to
report — fabricating any would be dishonest. This evidence report therefore contains **no passing result**.
Task 1.2 must populate these result cells with actual observed output/exit codes from the harness.

## 4. Planned reproduction and environment (to be captured in task 1.2 — not captured here)

The following fields are to be recorded in task 1.2's gate evidence when the harness is built and run. **None are
captured by this document** (task 1.1 is doc-only; nothing has been executed). Per `phase_001.md` task 1.2
**Verification**, the harness lives at
`docs/plans/000_spike-plan/spikes/q38_capability-inventory/` and is run **from repo root** via the four listed
`pnpm --dir ... install --frozen-lockfile`, `test`, `typecheck`, `lint`, `build` commands, each asserting the §2
behavioral cases and each required to exit 0 with observed outputs recorded — not assumed.

To-be-captured fields (task 1.2):
- **Repo-root commands and cwd:** the exact command strings run and the working directory (repo root) from which
  they were invoked.
- **Pinned package/runtime versions:** the actual version strings resolved from the harness's `pnpm-lock.yaml`
  (e.g. TypeScript, biome, vitest/`@cloudflare/vitest-pool-workers`, node/pnpm runtimes, and any checker
  dependencies) — recorded, not assumed.
- **Fixture identity:** the exact real manifest fixture files/inputs used for each behavioural case
  (service-only, absent-OPTIONAL, missing-REQUIRED, wrong-environment, undeclared-dependency, built-in/custom
  parity) and where they live.
- **Environment / versions:** workers/runtime and, for any client-local (C1/C3/C11) surface checks, the
  browser/runtime environment and versions exercised.
- **Observed outputs/exit codes:** the actual stdout/stderr and exit code of each of the five commands
  (install/test/typecheck/lint/build), tied to the §2 check cases they assert.
- **Failure cases:** which of the §2 behavioural fixtures genuinely failed under the harness (missing-REQUIRED,
  wrong-environment, undeclared, OPTIONAL-degrade) and the diagnostics emitted.
- **Resource prerequisites and limitations:** e.g. real-D1 `vitest-pool-workers` availability, OPFS/browser
  fixture prerequisites, any network/install constraints, and what the harness could NOT exercise.

This "Planned reproduction and environment" section is a **to-be-captured** checklist — no field is populated
from an actual run.

## 5. Limitations / not-yet-established

- This report **establishes the requirement → capability/check-case mapping** and the **accepted inventory policy**
  (Axis 1 core-as-seam; Axis 2 required-vs-optional roll-up in §2.2) only.
- It does **not** establish that any capability check **passes** — every result is `NOT YET RUN (task 1.2)`, and the
  harness that would run them is task 1.2's scope, not 1.1's.
- Q38 **stays OPEN** until the dev accepts this design/evidence and the Q38 gate closes (`000_index.md` §Canonical
  gate table — task 1.3 records the accepted ADR and closes the gate with verified evidence; a failed check blocks
  closure). Recording this report is not an approval and not a gate closure.
- Packaging-vs-execution (package paths, names, file layouts, component versions, execution/deployment topology)
  is **not decided here** — Q40 alone owns that (design §7; 000_index gate table).
