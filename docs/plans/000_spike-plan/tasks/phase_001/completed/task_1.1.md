---
title: Inventory server/core/headless capabilities
created_session: '20261004_222104_e4336c'
sessions: ['20261004_222804_5a2e0d']
approved: true
---

# Task 1.1 — Inventory server/core/headless capabilities

> From: plan_000 phase_001 task 1.1 · spec: docs/plans/000_spike-plan/000_spike-plan.md

## Goal

Define the complete capability inventory and required-versus-optional policy from the settled
sources. No dependencies — Q38 runs FIRST. Compare feature-vs-infrastructure classification,
resolve genuine inventory choices with the dev and record them; the design/evidence report
initially labels execution results as not yet run.

## Files

- Create: `docs/plans/000_spike-plan/designs/q38_capability-inventory.md`
- Create: `docs/plans/000_spike-plan/evidence/q38_capability-inventory.md`

## Acceptance

Inventory datastore (D1 plus client-local driver seam), storage/R2, filesystem/CLI-vs-Worker persistence, cache/invalidation, auth/authorization, routing/config/secrets, jobs, observability/redaction, identifiers, registry/UOW, headless/host seams and PII classification/erasure hooks. Each entry specifies owner, environments, consumers, optionality, missing-capability behavior and locked source. Include Q42 shared implications and Q70 additions. Built-in features remain ordinary modules; dashboard/component kit/panel/design-token presentation is not mandatory core. Do not select package paths/execution topology here.

## Verification

Inspect every inventory row against project Q30/Q35/Q37/Q38/Q39/Q42/Q45/Q50–Q59/Q70/Q71 and 002 §§Core/Manifest; map each requirement to a concrete capability/check case in evidence. Obtain dev input acceptance before building checks.

## Commits (draft)

`docs(spikes): inventory server/core/headless capabilities (plan_000/task_1.1)` — proposal only; dev-triggered.
