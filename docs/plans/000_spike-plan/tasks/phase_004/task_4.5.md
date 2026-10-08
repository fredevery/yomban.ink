---
title: Design security profiles, auth bootstrap and rate policy
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.5 — Design security profiles, auth bootstrap and rate policy

> From: plan_000 phase_004 task 4.5 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Specify Q68 concrete security/auth/rate-limit rules for every registered surface.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.4

## Blocked by

- 4.4

## Parallel

false

## Files

- Create: docs/plans/000_spike-plan/designs/q68_security-bootstrap.md
- Create: docs/plans/000_spike-plan/evidence/q68_security-bootstrap.md
- Create: docs/decisions/0012-security-profiles-and-auth-bootstrap.md

## Acceptance

Choose permitted sign-in/registration/auth methods, first-admin bootstrap/provisioning/recovery, token issuance/scopes/revocation and role/resource checks. Define mandatory cookie/machine-token/public-form applicability with no exempt surface, including how public reads receive applicable baseline protection without inventing an unprotected tier. Specify credentials/cookies/session/origin/CSRF for Q40 topology, trusted client/proxy identity, exact limit/burst policies and Workers-appropriate storage/atomicity. Better Auth isolate-memory limiter and Turnstile alone are insufficient. Preserve CSP/headers/Zod/upload validation/sanitization, no HX-Request auth. Sync pull scope server-authoritative and push wholly denied on auth failure; minimal auth/PII/redaction/privacy safeguards remain locked.

## Verification

Surface inventory includes auth, API/HTML mutations, reads/previews, upload, jobs/admin and sync; every path maps to a profile/authorization/limit rule. Check actual selected limiter/auth dependencies and Q63 prefixed-ID schema before selecting. Dev approves concrete security policy inputs.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

docs(spikes): design security profiles, auth bootstrap and rate policy (4.5) — proposal only; dev-triggered.
