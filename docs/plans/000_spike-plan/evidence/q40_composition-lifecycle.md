---
title: "Q40 — composition, installation and invocation lifecycle (evidence: traceability, dev inputs, unverified items)"
created_session: "20261006_212010_4c6797"
sessions: ["20261006_212010_4c6797"]
approved: false
---

# Q40 — Evidence report (task 3.1) — design traceability, dev inputs, unverified items

> This is the **Q40 evidence report for task 3.1**
> (`docs/plans/000_spike-plan/tasks/phase_003/in-progress/task_3.1.md`). It records
> (a) what the task produced, (b) the design choices and their sources, (c) the **dev
> acceptance that is still pending**, and (d) the **checks NOT run** — enumerated and
> assigned to their later proof tasks. It maintains the two SEPARATE sections required
> of a doc-only design task's evidence report: pending dev acceptance first, then the
> not-run checks — neither reads as executed.
>
> **Nothing in this report asserts an unexecuted check as run.** No harness, no package
> install probe, no composition/dependency check and no cross-module rollback test exists;
> none is claimed to pass. Any observed output in this report would be a fabrication —
> there is none, deliberately. ADR-0006 is **Proposed, not accepted**; Q40 final
> acceptance waits for the phase-006 proofs (tasks 6.1–6.2) and the joint Q40/Q47/Q46
> closure (phase-007 task 7.8; task files fan out later).

## 1. What was produced

Exactly three documentation files, matching the task card's Files list — no other file was
created or modified, no code was written, no packages installed, no commands executed:

1. **`docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md`** — the provisional
   composition/installation/lifecycle design: export classes + optional facets (§2),
   per-side core layout (§3), packaging-vs-execution selection flagged PROVISIONAL (§4),
   composition roots (§5), route/SSR/auth-handler ownership (§6), cookies/session +
   credentialed CORS/trusted origins/CSRF (§7), build-metadata vs invocation-lifetime rules
   (§8), observability invocation context + sink completion/failure redaction (§9),
   unit-of-work participation contract (§10), ID algorithm/finality/collisions (§11),
   enum/permission aggregation (§12), install/update + generated-vs-installed + AI
   artifacts (§13), Q70 browser-store session lifetime (§14), contract-upgrade vs DB
   migrate (§15), provisional effect/security/consistency interfaces (§16),
   dashboard/overlay performance-target PROPOSALS (§17), non-decisions (§18) and the
   requirement matrix (§19).
2. **`docs/decisions/0006-composition-installation-and-lifecycle.md`** — ADR-0006, status
   **Proposed** (not accepted), recording settled + provisional decisions with rejected
   alternatives and pending-acceptance notes. Allocation 0006 verified free before writing
   (`docs/decisions/` held 0001–0005, 0014–0016 — no collision).
3. **This evidence report.**

## 2. Design choices and sources

| Design choice | Source/authority | Notes |
|---|---|---|
| Export classes server-only/headless-server-safe/browser/DOM/presentation; optional declared facets (design §2) | Q40 Answer ("owns server-only, headless/server-safe, browser/DOM and optional presentation export boundaries"); Q35 (manifest facet declaration); Q51 (browser-safe exports, no private fields); Q61 (boundary lint); Q38 C11 | Facet declarations reuse the manifest; a service-only module needs none. |
| Per-side core as separate workspace packages `core-server`/`contracts`/`clients` (§3) | Q9 Answer's open sub-question explicitly assigned to this spike; Q38 §3 policy (which seams per side) | PROVISIONAL; Q47 may re-slice. |
| Packaging = static workspace packages; execution = one Worker per consumer hosting all roles (§4) | Q29 (build-time composition, no runtime plugins); Q32 (one deployment per project); Q38/Q8 ("Q40 alone owns packaging-vs-execution") | **PROVISIONAL — flagged for dev acceptance.** |
| Composition root imports core+modules; core imports no features; registry-mediated runtime interaction (§5) | Q29/Q36/Q41; Q39 (no privileged built-ins); Q61 (conformance before registration) | Root is project-owned generated code (Q44/Q48). |
| Auth-handler owned by core; session cookie in-process on SSR/HTML; bearer() for token reads; same session cookie on sync transport (§7) | Q59 (better-auth does not cover custom routes; HX-Request not auth); Q63 §9/task-2.4 (bearer() plugin PROVEN); Q70 (sync pushes under the permission boundary) | Q68 owns profile mechanics. |
| Trusted-origin registry per environment (local/deployed/preview); CSRF on all cookie-authenticated mutations (§7) | Q40 Answer; Q60 (staging/prod/domains/preview); Q59 (CSRF/origin rules on every path) | Preview ≠ isolated data (Q60). |
| Immutable build metadata vs per-invocation env/user/session/UOW/trace context; no binding I/O at init; no stale cached binding clients (§8) | Q53 (boot = per-invocation validation boundary; no stale credential caching); Q55 (context cannot leak between invocations); Amendment 001 Q40 (client twin) | Conformance lint forbids module-scope env capture (Q61). |
| Invocation-scoped trace context; sinks complete via waitUntil; redaction on success AND failure paths (§9) | Q55; Q71/Q59 (redaction-by-default locked); Q66 (telemetry vs durable effects) | Sink-failure policy is implementation design (Q55). |
| UOW participation: services get `contribute(op)` on one batch; no independent commit; separate explicit UOW otherwise (§10) | Q52 (locked); Q41 (registry services); ADR-0005 Decision 1 (dev-accepted shared-D1 placement makes cross-module single-batch possible; acceptance recorded in q63 evidence §2) | Cross-module rollback proof = task 6.1/6.2 evidence (NOT YET RUN). |
| ID algorithm = `prefix_` + monotonic base32 ULID-style; client ids final at creation; conformance-time prefix collisions (§11) | Q11; task-2.4 PROVEN base32 monotonic scheme through better-auth `generateId` (ADR-0005 §9); Q66 (idempotency semantics); `007` §Permissions (one namespace authority) | Algorithm + finality **PROVISIONAL** (dev acceptance required). |
| Enum/permission build-time aggregation into a derived artifact; no runtime registry (§12) | Q11/Q61; `007` §Identity conventions; D3 (`<ModuleNamespace>:<Member>` grammar) | Artifact is generated/platform-managed (§13). |
| Workspace-protocol and git-tag-semver install specifiers; generated-vs-installed table; non-destructive updates (§13) | Q48/Q64 (transfers; rejects lockstep/tag-pinning); Q49 (contract current+N-1); `006` deferred-boundary criteria | **Specifier syntax/s semantics UNVERIFIED** — see §4 below. |
| Deterministic AI artifact list; AI-fill must pass conformance; separate from Orca workflow (§13) | Q48 (AI scaffolding required; consumer scaffolding need not mirror Orca); Q61 (conformance accepts/rejects) | List is proposed, dev-amendable. |
| Browser store exported browser-safe; opened per session; outside server UOW (§14) | Amendment 001 Q40 (per-session wasm-SQLite; no binding I/O at init); Q70/Q52 Amendment 001 (leases advisory) | Mechanics = task 3.4 (Q70). |
| `upgrade` (contract majors + codemods) distinct from `migrate` (ledger-driven, explicit golden-path step) (§15) | Q49/Q44 (locked split); Q63 §6 (release-vs-migrate orchestration = Q40) | Orchestration provisional; phase-006 exercises ordering. |
| Effect/security/consistency seams named for Q66/Q67/Q68 (§16) | Q66/Q67/Q68 Answers; Q52/Q57 boundaries | No mechanism selected. |
| Dashboard LCP ≤ 3.0s/INP ≤ 200ms; overlay first-edit ≤ 1.0s, save-ack ≤ 100ms — PROPOSALS (§17) | Q62 (dashboard/overlay targets set in Q40/Q47 with Q54 input; public unchanged); Q54 input (debounced saves, truthful acknowledgement) | **PROPOSALS for Q47 task 3.2 to finalize; not adopted.** |

## 3. Dev acceptance (recorded 2026-10-06, session 20261006_212010_4c6797)

Per the phase-003 contract ("design tasks may create proposed designs/ADRs but must not
assert unrun evidence"; "Candidate/mechanism/policy adoption requires explicit dev input"),
the following required **explicit dev acceptance**. The dev accepted all items 1–7 in
conversation on 2026-10-06 ("provisional decisions accepted"). Acceptance of item 4 (install
specifiers) is **conditional**, as §3 itself stated: the table is accepted as the provisional
SHAPE, but its syntax remains UNVERIFIED until the §4 item-1 phase-006 probe — accepted
shape ≠ settled syntax, and the fallback decision stays flagged.

1. **Packaging-vs-execution selection** (design §4): static workspace packages + one
   Worker-per-consumer hosting all server roles; the split-Worker alternative rejected
   provisionally. *(This is the Q40-owned choice Q38 explicitly deferred here.)* **ACCEPTED.**
2. **Per-side core package layout** (design §3): separate `core-server`/`contracts`/
   `clients` workspace packages resolving Q9's open sub-question. **ACCEPTED** (Q47 may
   still re-slice).
3. **ID algorithm + client-finality** (design §11): base32 monotonic ULID-style material;
   client-generated ids final at creation (no temporary→final rekeying). **ACCEPTED.**
4. **Install specifier policy** (design §13): the workspace-protocol / git-tag-semver /
   generated-vs-installed table accepted **as provisional shape only** — **syntax remains
   UNVERIFIED** pending the §4 item-1 phase-006 probe; not settled syntax before that
   observed evidence. **ACCEPTED (conditional).**
5. **AI-orientation artifact list** (design §13): the proposed deterministic artifact set.
   **ACCEPTED.**
6. **Dashboard/overlay performance-target proposals** (design §17): passed to Q47
   (task 3.2) for finalization with the dev; not adopted by this task. **ACCEPTED as
   proposals forwarded to Q47** (task 3.2 still finalizes with the dev).
7. **Migration invocation orchestration** (design §15): `migrate` as an explicit golden-path
   step; deploy does not silently migrate. **ACCEPTED.**

Workflow-input sequencing note: Q54's workflow input is ACCEPTED (2026-10-05, task 2.1) and
consumed here for §17 — but the Q54 GATE is not Closed (closure at 7.7); likewise Q63's
design is provisional pending 7.2. Q40 consumes them as provisional inputs, per the
accepted-input ≠ closed-gate rule (plan 000 "Evidence and closure rules").

## 4. Checks NOT run (assigned to later tasks; none executed in task 3.1)

Per the plan's evidence rules, the following are **NOT YET RUN** — enumerated so no later
task or reviewer mistakes design prose for proof:

1. **pnpm workspace-protocol + git-tag-semver specifier probe** (design §13): the exact
   syntax and resolution behaviour (`workspace:^`, git URL + `#semver:` + per-package
   subdirectory) was **NOT verified in this session** — web-access backends were
   unavailable (search/extract backends firecrawl-configured but the plugin is disabled)
   and live install probes were out of a docs-only task's scope. Every specifier claim in
   design §13 carries an explicit UNVERIFIED marker. **Owner: phase-006 install evidence
   task (6.1/6.2 per the canonical gate table)** — build a disposable consumer fixture,
   install platform packages both ways, and record observed resolution (including the
   fallback path if git-semver proves unsupported; that fallback is a flagged dev
   decision).
2. **Composition/dependency/browser-export conformance checks** (design §§2, 5): boundary
   lint over a real composition (core imports no features; headless/contracts packages
   carry no direct/transitive presentation dependency; browser exports expose no
   server-only/private surfaces). **Owner: phase-006 (6.1–6.2).**
3. **Cross-module single-batch rollback proof** (design §10): two modules' registry
   services contributing to one D1 prepared-statement batch, rollback on injected
   statement failure. **Owner: phase-006 (6.1–6.2), real D1.**
4. **No-stale-globals / no-binding-I/O-at-init checks** (design §8): lint/runtime proof
   that module init performs no binding I/O and that no env-derived client survives
   invocations. **Owner: phase-006 (6.1–6.2).**
5. **The shared two-host editing proof** (canonical gate table Q40 evidence): plain
   server-rendered + bounded reactive fixture hosts reading/editing/publishing through
   unchanged services/contracts. **Owner: Q47's executable boundary proof (task 3.2 design;
   Q61 executes; Q7 discharges).**
6. **Install/update non-destructive regeneration check** (design §13): scaffold re-run
   does not overwrite consumer-owned files; package updates flow without regeneration.
   **Owner: phase-006 install evidence task.**
7. **Cookie/session/CORS/CSRF topology behaviour** (design §7): exercised denial of
   untrusted origins/expired sessions belongs to Q68's evidence; the topology itself is
   exercised with the phase-006 deployment proofs. **Owners: Q68 (task 4.5–4.6) and
   phase-006.**

**Not blockers for this task:** items 1–7 are the later tasks' deliverables; this report's
only claim is that they have not run. Any observed output, exit code or version appearing
in a future revision of this report must come from those tasks' sessions.

## 5. Spec conflicts / deviations

- **ADR number:** task 3.1 names `docs/decisions/0006-composition-installation-and-lifecycle.md`
  as Create. Verified free (`ls docs/decisions/`: 0001–0005, 0014–0016 present; 0006
  unoccupied) — **no deviation; allocation honoured.**
- **No root product package layout authored** (task execution note): design §§3–4 select
  shape and roles only; no `apps/`/`packages/` tree is proposed. Confirmed.
- **Web-verification limitation** (§4 item 1): recorded honestly as an environment
  limitation with its remediation owner, not silently dropped.
- No conflict found between this design and `002`/`003`/`004`/`006`/`007`/`008` locked
  sections; where a spec defers an item to Q40, the design supplies it and flags
  provisional status.
