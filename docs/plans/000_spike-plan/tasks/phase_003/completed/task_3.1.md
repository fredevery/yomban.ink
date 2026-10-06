---
title: Design composition, installation and invocation lifecycle
created_session: '20261006_210311_463e93'
sessions:
  - '20261006_212010_4c6797'
approved: true
---

# Task 3.1 — Design composition, installation and invocation lifecycle

> From: plan_000 phase_003 task 3.1 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_003.md

## Goal

Specify the full Q40 composition/export/deployment/install/lifecycle contract.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 2.5

## Blocked by

- 2.5

## Parallel

false

## Files

- Create: `docs/plans/000_spike-plan/designs/q40_composition-lifecycle.md`
- Create: `docs/plans/000_spike-plan/evidence/q40_composition-lifecycle.md`
- Create: `docs/decisions/0006-composition-installation-and-lifecycle.md`

## Acceptance

Using Q38/Q54/Q63 inputs, define server-only/headless/server-safe/browser/DOM/presentation
exports, optional facets, per-side core layout and composition roots importing core+modules
without core importing features. Choose packaging-vs-execution provisionally, one-deployment
topology, route/SSR/auth-handler ownership, cookies/session propagation, credentialed
CORS/trusted origins/CSRF for local/deployed/preview, no stale globals/binding I/O at init.
Define immutable build metadata vs invocation user/env/UOW/trace/service/config/secret
lifetime and sink completion/failure redaction. Specify exact repo/subpackage/tag-semver
install/update and generated-vs-installed consumer ownership, non-destructive updates,
deterministic AI artifacts/AI-fill+conformance boundary, contract current+N-1 upgrade vs
DB migrate, ID algorithm/client-finality/namespace collisions and enum/permission
aggregation. Registry services contribute operations to one D1 batch; no independent
commit. Include Q70 browser-store session lifetime and provisional effect/security/
consistency interfaces.

## Verification

Full Q40 canonical-table and 002/003/004/006/007/008 scope maps to a design section/proof.
Verify install specifiers/semver assumptions against actual pnpm/repo-package mechanics
through evidence tasks, not invented syntax. Obtain dev acceptance of provisional inputs;
final exports wait on joint closure.

## Execution notes

Set dashboard/overlay performance target proposals with Q47 using Q54 workflow input;
public targets unchanged. No root product package layout is authored.

## Commits (draft)

`docs(spikes): design composition, installation and invocation lifecycle (3.1)` — proposal only; dev-triggered.
