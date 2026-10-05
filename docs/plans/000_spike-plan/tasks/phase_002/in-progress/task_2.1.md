---
title: Design content workflow semantics
created_session: '20261005_203953_63d2f4'
sessions: []
approved: false
---

# Task 2.1 — Design content workflow semantics

> From: plan_000 phase_002 task 2.1 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_002.md

## Goal

Specify Q54 content fields, state transitions and editing requirements as
presentation-independent workflow input. ADR proposed, not closed.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 1.4 (completed — phase_001 closed)

## Files

- Create: `docs/plans/000_spike-plan/designs/q54_content-workflows.md`
- Create: `docs/plans/000_spike-plan/evidence/q54_content-workflows.md`
- Create: `docs/decisions/0004-content-workflow-semantics.md`

## Acceptance

Concrete type/field model includes text/rich-text/media/relation/repeater; stored types
will be inferred from module Drizzle schema. Define legal/illegal
draft/review/publish/schedule/revision transitions, immutable history and failed publish
behavior, visibility/soft-delete/sort_order. Pin server revision checks, authorized
preview needs, save/unsaved/debounce semantics, DOM entity/field references and host
ownership. Locks follow shared/remote aggregate roots, not publish state; offline edits
remain provisional. Describe required Q66/Q67 guarantees without inventing their
mechanism/window. Record search future home only. ADR proposed, not closed.

## Verification

Trace design to 005 §§6/8 (R1–R11), Q42/Q54/Q58 and Amendment 001. Dev accepts workflow
INPUT before Q40/Q47 design; evidence report records that acceptance and unexecuted
checks separately.

## Execution notes

Resolve state semantics with the dev; do not interpret the discovery workflow arrow as a
complete state machine or select a UI from it.

## Commits (draft)

`docs(spikes): design content workflow semantics (2.1)` — proposal only; dev-triggered.
