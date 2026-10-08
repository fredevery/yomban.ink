---
title: Design author/public consistency and preview isolation
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.3 — Design author/public consistency and preview isolation

> From: plan_000 phase_004 task 4.3 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Specify Q67 truthful acknowledgements, propagation windows and secure cache policies.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.2

## Blocked by

- 4.2

## Parallel

false

## Files

- Create: docs/plans/000_spike-plan/designs/q67_consistency-preview.md
- Create: docs/plans/000_spike-plan/evidence/q67_consistency-preview.md
- Create: docs/decisions/0011-content-consistency-and-preview-isolation.md

## Acceptance

Set explicit author read-your-writes, publish acknowledgement and tolerated public staleness/propagation window with dev acceptance and rationale; define authoritative version/pointer source, key/permission policy, local/global invalidation, retries and degraded modes. KV eventual consistency and local Cache API deletion cannot become global guarantees. Q54 supplies schedule/revision/preview needs, Q66 durable effects, Q70 local reads are local-by-construction and remote pull stays scoped/poll-based. Draft/auth previews bypass shared caches or prove isolated authorization/keys. Cover API+HTML and JS library/history snapshots, browser back/forward, logout/user switching and local replica privacy; no-store alone is insufficient.

## Verification

Trace all 005 R6/R7 and 008 §Q67 cases to chosen mechanisms and quantitative assertions. Record candidate evaluation and dev policy acceptance; multi-location evidence remains mandatory before closure.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

docs(spikes): design author/public consistency and preview isolation (4.3) — proposal only; dev-triggered.
