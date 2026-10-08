---
title: Prove cache freshness, acknowledgements and private isolation
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.4 — Prove cache freshness, acknowledgements and private isolation

> From: plan_000 phase_004 task 4.4 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Exercise selected consistency policies locally and with separately gated multi-location deployment evidence.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.3

## Blocked by

- 4.3

## Parallel

false

## Files

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

## Acceptance

TDD author/public read paths, stale KV pointer, publish/schedule, lost/failed purge with recovery and truthful acknowledgement. Remote synthetic deployment collects actual multiple Cloudflare colo identifiers/time/version reads, proving the selected public bound and distinguishing local/global purge. Browser checks cover unauthorized/session-expired preview, public/shared cache leakage, history restoration after logout/user switch and no private data in wrong contexts. Preliminary provisional presentation is labelled; final selected-library history behavior reruns in Phase 006. Simulated multi-colo cache maps do not alone close Q67.

## Verification

Run harness gates and fault tests, then record owner-approved remote probe commands, colo/version/timing results and browser versions/screenshots or sanitized traces for every policy case. From repo root: `pnpm --dir spikes/q67_consistency-preview install --frozen-lockfile`, then `pnpm --dir spikes/q67_consistency-preview test`, `pnpm --dir spikes/q67_consistency-preview typecheck`, `pnpm --dir spikes/q67_consistency-preview lint`, `pnpm --dir spikes/q67_consistency-preview build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Missing actual multi-location evidence keeps final closure blocked.

## Execution notes

Present cloud resources/budget/access/teardown before any provisioning/deployment. If no geographic probe access, request explicit owner-run probes rather than claiming simulation proves global behavior.

## Commits (draft)

docs(spikes): prove cache freshness, acknowledgements and private isolation (4.4) — proposal only; dev-triggered.
