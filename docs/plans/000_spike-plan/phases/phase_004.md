---
title: "Yomban.ink — spike phase 004: Affected-work designs and evidence — Q66 / Q67 / Q68 / Q65"
created_session: "20261004_213034_2d1c21"
sessions: []
approved: false
status: Draft
---

# Phase 004 — Affected-work designs and evidence — Q66 / Q67 / Q68 / Q65

**Plan:** [Spike Plan 000](../000_spike-plan.md)
**Understanding:** [settled Q1–Q6](../understanding.md)
**Goal:** Design and exercise durable-effect, consistency, security and recovery mechanisms, feeding the final local-first/frontend proofs.
**Depends on:** Phase 003 approved and closed; inputs are accepted, not automatically closed gates.
**Exit state:** Affected-work design/evidence inputs are accepted, not finally Closed. Their classification does not become a blanket foundational implementation block.
**Source authority:** [canonical gate table](../../../specs/000_index.md#canonical-gate-table),
[project understanding Q19](../../../discovery/understanding.md), amendments 001/002,
and the owning focused specs listed in the parent plan. No locked decision is reopened.

## Task execution contract

Each Task below is a future scoped Orca task, not work authorized by drafting this
file. Read the parent plan, settled understanding and owning source sections at its
task gate. State exactly what is already done before implementing; do not repeat
existing proofs. Obtain the dev's gate, then one fresh serial subagent executes.

Design tasks may create proposed designs/ADRs but must not assert unrun evidence.
Candidate/mechanism/policy adoption requires explicit dev input. Executable tasks
use TDD with real code at the correct boundary; exact new dependencies/config and
any driver-generated artifact paths are recorded before dispatch. Each harness has
working `test`, `typecheck`, `lint`, `build` scripts and pinned lockfile; run all four
and record observed outputs. A plan's expected result is not a passing test log.

Files below are exact allocated outputs. Generated migrations, optional presentation
fixture sources and chosen-library configs cannot be named before their owning
selection; when the choice is accepted, extend the task Files with the actual exact
paths BEFORE claim. This does not permit arbitrary product files or silently growing
scope. Later tasks use Modify on prior outputs. No `any`, `export *`, direct module
bindings/secrets, raw SQL outside Drizzle, implicit UI coupling or non-D1 atomicity.

Cloud resources/deployment and owner browser checks are separate explicit human
gates within affected tasks. Missing access/support blocks the required claim.
Secrets/production data never enter harnesses/evidence. Task Agent/Manual Review,
retro and scoped commit occur only through the matching dev-triggered Orca steps;
execution stops at deliverable-ready, never auto-review/commit/next-task.

## Task 4.1 — Design durable effects and idempotency

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 3.5
**Blocked by:** 3.5
**Parallel:** false
**Objective:** Specify Q66 post-commit durability and reusable retry/idempotency contracts.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q66_durable-effects.md
- Create: docs/plans/000_spike-plan/evidence/q66_durable-effects.md
- Create: docs/decisions/0010-durable-effects-and-idempotency.md

**Acceptance:** Compare/select a mechanism with dev approval; D1 transactional outbox is candidate only (Q70 op-log is not a general outbox selection). Define business-vs-telemetry classification, at-least-once assumptions, idempotency keys/ownership and same-ID/same-payload dedupe vs different-payload error, commit/enqueue gap recovery, acknowledgement/backoff/dead-letter/replay, payload current+N-1 compatibility and sanitized diagnostics. Registry contributions remain one D1 batch; R2/cross-DB/queues/cache effects have separate recovery/compensation. No exactly-once/event-bus or unawaited-request durability claims. Sync change_set_id conventions feed Q70.

**Verification:** Map 008 §Q66 / Q52/Q56/Q57 and Amendment 001 to fault cases; record selected mechanism and limits rather than silently adopting the Agent default. Q40 lifecycle/UOW interfaces remain explicitly provisional until reconciled.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): design durable effects and idempotency (4.1) — proposal only; dev-triggered.

## Task 4.2 — Inject effect delivery failures and duplicates

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.1
**Blocked by:** 4.1
**Parallel:** false
**Objective:** Prove the selected Q66 mechanism against actual D1 and appropriate queue/cache boundaries.
**Files:**
- Create: spikes/q66_durable-effects/package.json
- Create: spikes/q66_durable-effects/pnpm-lock.yaml
- Create: spikes/q66_durable-effects/tsconfig.json
- Create: spikes/q66_durable-effects/biome.json
- Create: spikes/q66_durable-effects/README.md
- Create: spikes/q66_durable-effects/src/proof.ts
- Create: spikes/q66_durable-effects/src/proof.test.ts
- Create: spikes/q66_durable-effects/vitest.config.ts
- Create: spikes/q66_durable-effects/wrangler.jsonc
- Create: spikes/q66_durable-effects/src/schema.ts
- Create: spikes/q66_durable-effects/src/worker.ts
- Modify: docs/plans/000_spike-plan/designs/q66_durable-effects.md
- Modify: docs/plans/000_spike-plan/evidence/q66_durable-effects.md

**Acceptance:** TDD commit failure, commit-success/enqueue-failure, consumer-crash before/after acknowledgement, duplicate delivery, same-key different payload, purge failure/retry, poison/dead-letter/manual replay, payload N/N-1/rejected-old transitions and external recovery. Verify business rows/effect state and retry/recovery traces; successful business effects are not duplicated, failures stay visible. Mock only intentional external fault seams; actual D1 persistence and real Workers job lifecycle are exercised. Deployed broker/storage semantics needing cloud proof use separately gated synthetic resources, not production.

**Verification:** Execute fault suite and inspect persisted effect/ledger state plus delivery traces. From repo root: `pnpm --dir spikes/q66_durable-effects install --frozen-lockfile`, then `pnpm --dir spikes/q66_durable-effects test`, `pnpm --dir spikes/q66_durable-effects typecheck`, `pnpm --dir spikes/q66_durable-effects lint`, `pnpm --dir spikes/q66_durable-effects build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Capture remote job evidence where the selected durability claim exceeds local emulation; unavailable resources block that claim.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): inject effect delivery failures and duplicates (4.2) — proposal only; dev-triggered.

## Task 4.3 — Design author/public consistency and preview isolation

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.2
**Blocked by:** 4.2
**Parallel:** false
**Objective:** Specify Q67 truthful acknowledgements, propagation windows and secure cache policies.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q67_consistency-preview.md
- Create: docs/plans/000_spike-plan/evidence/q67_consistency-preview.md
- Create: docs/decisions/0011-content-consistency-and-preview-isolation.md

**Acceptance:** Set explicit author read-your-writes, publish acknowledgement and tolerated public staleness/propagation window with dev acceptance and rationale; define authoritative version/pointer source, key/permission policy, local/global invalidation, retries and degraded modes. KV eventual consistency and local Cache API deletion cannot become global guarantees. Q54 supplies schedule/revision/preview needs, Q66 durable effects, Q70 local reads are local-by-construction and remote pull stays scoped/poll-based. Draft/auth previews bypass shared caches or prove isolated authorization/keys. Cover API+HTML and JS library/history snapshots, browser back/forward, logout/user switching and local replica privacy; no-store alone is insufficient.

**Verification:** Trace all 005 R6/R7 and 008 §Q67 cases to chosen mechanisms and quantitative assertions. Record candidate evaluation and dev policy acceptance; multi-location evidence remains mandatory before closure.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): design author/public consistency and preview isolation (4.3) — proposal only; dev-triggered.

## Task 4.4 — Prove cache freshness, acknowledgements and private isolation

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.3
**Blocked by:** 4.3
**Parallel:** false
**Objective:** Exercise selected consistency policies locally and with separately gated multi-location deployment evidence.
**Files:**
- Create: spikes/q67_consistency-preview/package.json
- Create: spikes/q67_consistency-preview/pnpm-lock.yaml
- Create: spikes/q67_consistency-preview/tsconfig.json
- Create: spikes/q67_consistency-preview/biome.json
- Create: spikes/q67_consistency-preview/README.md
- Create: spikes/q67_consistency-preview/src/proof.ts
- Create: spikes/q67_consistency-preview/src/proof.test.ts
- Create: spikes/q67_consistency-preview/vitest.config.ts
- Create: spikes/q67_consistency-preview/wrangler.jsonc
- Create: spikes/q67_consistency-preview/src/worker.ts
- Create: spikes/q67_consistency-preview/browser-cases.md
- Create: spikes/q67_consistency-preview/remote-cases.md
- Modify: docs/plans/000_spike-plan/designs/q67_consistency-preview.md
- Modify: docs/plans/000_spike-plan/evidence/q67_consistency-preview.md

**Acceptance:** TDD author/public read paths, stale KV pointer, publish/schedule, lost/failed purge with recovery and truthful acknowledgement. Remote synthetic deployment collects actual multiple Cloudflare colo identifiers/time/version reads, proving the selected public bound and distinguishing local/global purge. Browser checks cover unauthorized/session-expired preview, public/shared cache leakage, history restoration after logout/user switch and no private data in wrong contexts. Preliminary provisional presentation is labelled; final selected-library history behavior reruns in Phase 006. Simulated multi-colo cache maps do not alone close Q67.

**Verification:** Run harness gates and fault tests, then record owner-approved remote probe commands, colo/version/timing results and browser versions/screenshots or sanitized traces for every policy case. From repo root: `pnpm --dir spikes/q67_consistency-preview install --frozen-lockfile`, then `pnpm --dir spikes/q67_consistency-preview test`, `pnpm --dir spikes/q67_consistency-preview typecheck`, `pnpm --dir spikes/q67_consistency-preview lint`, `pnpm --dir spikes/q67_consistency-preview build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Missing actual multi-location evidence keeps final closure blocked.

**Execution notes:** Present cloud resources/budget/access/teardown before any provisioning/deployment. If no geographic probe access, request explicit owner-run probes rather than claiming simulation proves global behavior.

**Commits:** docs(spikes): prove cache freshness, acknowledgements and private isolation (4.4) — proposal only; dev-triggered.

## Task 4.5 — Design security profiles, auth bootstrap and rate policy

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.4
**Blocked by:** 4.4
**Parallel:** false
**Objective:** Specify Q68 concrete security/auth/rate-limit rules for every registered surface.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q68_security-bootstrap.md
- Create: docs/plans/000_spike-plan/evidence/q68_security-bootstrap.md
- Create: docs/decisions/0012-security-profiles-and-auth-bootstrap.md

**Acceptance:** Choose permitted sign-in/registration/auth methods, first-admin bootstrap/provisioning/recovery, token issuance/scopes/revocation and role/resource checks. Define mandatory cookie/machine-token/public-form applicability with no exempt surface, including how public reads receive applicable baseline protection without inventing an unprotected tier. Specify credentials/cookies/session/origin/CSRF for Q40 topology, trusted client/proxy identity, exact limit/burst policies and Workers-appropriate storage/atomicity. Better Auth isolate-memory limiter and Turnstile alone are insufficient. Preserve CSP/headers/Zod/upload validation/sanitization, no HX-Request auth. Sync pull scope server-authoritative and push wholly denied on auth failure; minimal auth/PII/redaction/privacy safeguards remain locked.

**Verification:** Surface inventory includes auth, API/HTML mutations, reads/previews, upload, jobs/admin and sync; every path maps to a profile/authorization/limit rule. Check actual selected limiter/auth dependencies and Q63 prefixed-ID schema before selecting. Dev approves concrete security policy inputs.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): design security profiles, auth bootstrap and rate policy (4.5) — proposal only; dev-triggered.

## Task 4.6 — Prove denied surfaces, distributed limiting and bootstrap

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.5
**Blocked by:** 4.5
**Parallel:** false
**Objective:** Exercise selected Q68 security controls through real request/auth/storage paths.
**Files:**
- Create: spikes/q68_security-bootstrap/package.json
- Create: spikes/q68_security-bootstrap/pnpm-lock.yaml
- Create: spikes/q68_security-bootstrap/tsconfig.json
- Create: spikes/q68_security-bootstrap/biome.json
- Create: spikes/q68_security-bootstrap/README.md
- Create: spikes/q68_security-bootstrap/src/proof.ts
- Create: spikes/q68_security-bootstrap/src/proof.test.ts
- Create: spikes/q68_security-bootstrap/vitest.config.ts
- Create: spikes/q68_security-bootstrap/wrangler.jsonc
- Create: spikes/q68_security-bootstrap/src/worker.ts
- Create: spikes/q68_security-bootstrap/src/auth.ts
- Create: spikes/q68_security-bootstrap/remote-cases.md
- Modify: docs/plans/000_spike-plan/designs/q68_security-bootstrap.md
- Modify: docs/plans/000_spike-plan/evidence/q68_security-bootstrap.md

**Acceptance:** TDD undeclared/unprotected surface rejection, expired session, forbidden origin/CSRF, machine token issuance/revocation/resource denial, malformed requests/untrusted content/uploads and server-validated Turnstile rejection. Real Better Auth/Drizzle/D1 candidate with prefixed IDs; race first-admin bootstrap so no unintended second admin, then provisioning/recovery. Limiter concurrency/shared-storage behavior under actual Workers-safe selected mechanism; remote multiple-isolate proof when distributed claims require it. Q70 push permission failures reject whole sets and pull cannot broaden working set. Evidence covers API and HTML, not navigation gating alone.

**Verification:** Run negative/positive auth/security suite with actual request entrypoints and inspect DB/storage/permission outcomes. From repo root: `pnpm --dir spikes/q68_security-bootstrap install --frozen-lockfile`, then `pnpm --dir spikes/q68_security-bootstrap test`, `pnpm --dir spikes/q68_security-bootstrap typecheck`, `pnpm --dir spikes/q68_security-bootstrap lint`, `pnpm --dir spikes/q68_security-bootstrap build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Record owner-gated distributed limiter and public-form verification evidence; mocked Turnstile HTTP alone is preliminary, not successful live verification.

**Execution notes:** Never read existing credential files. Owner provisioned disposable credentials are environment-only; logs/results are sanitized before retaining evidence.

**Commits:** docs(spikes): prove denied surfaces, distributed limiting and bootstrap (4.6) — proposal only; dev-triggered.

## Task 4.7 — Design coordinated backup/restore, retention and replica erasure

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.6
**Blocked by:** 4.6
**Parallel:** false
**Objective:** Specify Q65 recovery and erasure primitives reaching server/assets/client-local replicas.
**Files:**
- Create: docs/plans/000_spike-plan/designs/q65_recovery-erasure.md
- Create: docs/plans/000_spike-plan/evidence/q65_recovery-erasure.md
- Create: docs/decisions/0013-backup-restore-and-replica-erasure.md

**Acceptance:** D1 export direction stays locked; compare/select separately protected recoverable R2 copies, never unavailable native bucket versioning or revisions-alone backup. Define consistent record/object reference cut, credentials/isolation and protection from deletion of primary copies, retention/deletion/recovery expectations with explicit RPO/RTO/design assumptions, media keys/ownership and migration/removal recovery. Define classification/erase hooks, tombstones and purge across D1/R2/cache/OPFS replicas, offline/revoked/reconnecting replicas, pending-ACK/expiration/rebuild policies and no resurrection after restore/replay. Consumer retention/legal policy is not selected. Q70 snapshots/export and replica wipe limits explicit; cannot guarantee wiping an unreachable device.

**Verification:** Map 008 §Q65, 007 privacy, Q63 failure/removal and amendments 001/002 to concrete recovery/erasure steps plus owner-verifiable assertions. Resolve restore-vs-erasure conflict and replica horizon with dev acceptance; no vendor silently chosen.

**Execution notes:** Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

**Commits:** docs(spikes): design coordinated backup/restore, retention and replica erasure (4.7) — proposal only; dev-triggered.

## Task 4.8 — Exercise coordinated restore and no-resurrection erasure

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.7
**Blocked by:** 4.7
**Parallel:** false
**Objective:** Prove Q65 recovery of actual D1 records and referenced assets, including replica safety scenarios.
**Files:**
- Create: spikes/q65_recovery-erasure/package.json
- Create: spikes/q65_recovery-erasure/pnpm-lock.yaml
- Create: spikes/q65_recovery-erasure/tsconfig.json
- Create: spikes/q65_recovery-erasure/biome.json
- Create: spikes/q65_recovery-erasure/README.md
- Create: spikes/q65_recovery-erasure/src/proof.ts
- Create: spikes/q65_recovery-erasure/src/proof.test.ts
- Create: spikes/q65_recovery-erasure/vitest.config.ts
- Create: spikes/q65_recovery-erasure/wrangler.jsonc
- Create: spikes/q65_recovery-erasure/src/worker.ts
- Create: spikes/q65_recovery-erasure/restore-runbook.md
- Create: spikes/q65_recovery-erasure/erasure-cases.md
- Modify: docs/plans/000_spike-plan/designs/q65_recovery-erasure.md
- Modify: docs/plans/000_spike-plan/evidence/q65_recovery-erasure.md

**Acceptance:** Use synthetic populated Q63 migration/schema fixture with referenced media objects. Export D1 and protected copies, remove/corrupt primary records/assets in disposable gated resources, restore both into clean targets and verify identity/reference/content digests with tool-calculated hashes. Exercise relevant migration/media failure recovery, retained removal, primary-copy loss and access isolation. Test erasure before/after backup restore and replay, online/reconnecting/offline/revoked replica policies, retained tombstone ACK/GC and explicit purge; no silent record resurrection. Browser-local cases are provisional until Phase 005 real OPFS rerun.

**Verification:** Run actual chosen export/copy/restore commands, record timings/count/digest/reference checks and failure recovery. From repo root: `pnpm --dir spikes/q65_recovery-erasure install --frozen-lockfile`, then `pnpm --dir spikes/q65_recovery-erasure test`, `pnpm --dir spikes/q65_recovery-erasure typecheck`, `pnpm --dir spikes/q65_recovery-erasure lint`, `pnpm --dir spikes/q65_recovery-erasure build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Remote protected-copy/isolation properties require separately gated real resource evidence; local R2/D1 simulations are labelled, not proof of disaster recovery access isolation.

**Execution notes:** Cloud restore never uses production data/resources. Owner verifies resource names, costs and teardown. Record evidence blockers and privacy limits instead of marking missing device checks complete.

**Commits:** docs(spikes): exercise coordinated restore and no-resurrection erasure (4.8) — proposal only; dev-triggered.

## Task 4.9 — Phase review and input/closure sign-off

**Package:** None — design/evidence or isolated non-product spike harness.
**Depends on:** 4.8
**Blocked by:** 4.8
**Parallel:** false
**Objective:** Independently verify this phase's outputs, preserve the stated gate state and obtain the dev's phase sign-off.
**Files:**
- Create: docs/decisions/0017-spike-phase-004-review.md
- Modify: docs/plans/000_spike-plan/phases/phase_004.md
- Modify: docs/plans/000_spike-plan/000_spike-plan.md
- Modify: docs/status/yomban-status.md

**Acceptance:** Review affected-work designs and fault evidence, with browser/cloud limitations explicitly pending where needed; execute every harness script actually created in this phase, rerun affected prerequisite proofs, and inspect sanitized evidence against its acceptance. Document PASS/FAIL plus blocked owner/browser/cloud checks; never mark an input milestone as gate closure. Phase ADR records process acceptance and references gate ADRs, not another design selection. No commit from this review task; phase approval/close and any phase commit are separate dev-triggered verbs. Do not edit AGENTS.md without explicit approval.

**Verification:** Run `git diff --check` and the framework understanding/state validators from the parent plan; execute the phase's real harness test/typecheck/lint/build commands and inspect required manual logs. An independent review plus dev sign-off is required; missing/failed required evidence blocks the claimed milestone.

**Execution notes:** Delegate review serially with the phase outputs and minimal owning-spec context. Report must/should/defer findings. Task-output review follows its own zero-findings/three-pass intervention rule; subsequent planning-document edits retain the two-pass cap. The review card is later mirrored and verified through Orca; this drafting task does not create cards.

**Commits:** (none) — phase review/sign-off task; leave close-out edits uncommitted for the dev's phase gate.

