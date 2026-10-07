---
title: Design client/wire/host/presentation contracts
created_session: '20261006_210311_463e93'
sessions:
  - '20261006_212010_4c6797'
approved: true
---

# Task 3.2 — Design client/wire/host/presentation contracts

> From: plan_000 phase_003 task 3.2 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_003.md

## Goal

Specify exact Q47 framework-free contracts and independently evaluate dashboard/controller/
panel choices.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 3.1

## Blocked by

- 3.1

## Parallel

false

## Files

- Create: `docs/plans/000_spike-plan/designs/q47_client-host-contracts.md`
- Create: `docs/plans/000_spike-plan/evidence/q47_client-host-contracts.md`
- Create: `docs/decisions/0007-client-wire-host-and-presentation.md`

## Acceptance

Define mapped public DTO/runtime schemas, validation in/out, serialization/route/error
conventions, typed module-source client, headless vs DOM exports and host
notification/lifecycle contracts. Shared runtime schemas and a typed client from module
source are primary: no primary codegen/tRPC inference/OpenAPI generation. Public API and
optional HTML paths invoke the same domain/authorization operations; HTML may call them
in-process and is not required to loop back over HTTP. Renderer-neutral standard-admin
descriptions vs explicitly implementation-specific custom views. Host owns content
DOM/config; panel mutates only its own DOM. Explicit separate candidate comparisons and
dev-proposed dashboard/controller/panel choices (Hono/htmx and TS-controller/htmx-panel are
candidates, not defaults). Include focused rich-editor/drag-drop/crop/repeater/media/
progress lifecycle needs, unsaved state, local sync/conflict surfacing, performance targets,
WCAG/CSP and browser support. If htmx is selected for a presentation role, design the
conditional checks explicitly: HX-Request is never authorization; sanitize untrusted
content and use hx-disable as applicable; disable unnecessary evaluation/script processing;
explicit 422/session-expiry handling; private history-cache isolation. These checks do not
adopt htmx. Define reactive fixture within locked one-page/list+edit-one/publish-action/
no routing/SSR/server-action/server-runtime bounds; both hosts use unchanged services/
contracts.

## Verification

Trace 004 acceptance and review §9 D2 mandatory checks to fixture cases and Q54 needs.
Dependency/export design must reject direct/transitive presentation dependencies in
core/contracts/headless and leaked private/server fields. Candidate selection requires
later executed proof and final dev decision.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the
dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

`docs(spikes): design client/wire/host/presentation contracts (3.2)` — proposal only; dev-triggered.
