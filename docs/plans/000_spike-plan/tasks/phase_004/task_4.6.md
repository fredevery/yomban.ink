---
title: Prove denied surfaces, distributed limiting and bootstrap
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.6 — Prove denied surfaces, distributed limiting and bootstrap

> From: plan_000 phase_004 task 4.6 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Exercise selected Q68 security controls through real request/auth/storage paths.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.5

## Blocked by

- 4.5

## Parallel

false

## Files

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

## Acceptance

TDD undeclared/unprotected surface rejection, expired session, forbidden origin/CSRF, machine token issuance/revocation/resource denial, malformed requests/untrusted content/uploads and server-validated Turnstile rejection. Real Better Auth/Drizzle/D1 candidate with prefixed IDs; race first-admin bootstrap so no unintended second admin, then provisioning/recovery. Limiter concurrency/shared-storage behavior under actual Workers-safe selected mechanism; remote multiple-isolate proof when distributed claims require it. Q70 push permission failures reject whole sets and pull cannot broaden working set. Evidence covers API and HTML, not navigation gating alone.

## Verification

Run negative/positive auth/security suite with actual request entrypoints and inspect DB/storage/permission outcomes. From repo root: `pnpm --dir spikes/q68_security-bootstrap install --frozen-lockfile`, then `pnpm --dir spikes/q68_security-bootstrap test`, `pnpm --dir spikes/q68_security-bootstrap typecheck`, `pnpm --dir spikes/q68_security-bootstrap lint`, `pnpm --dir spikes/q68_security-bootstrap build`; each must exit 0 and assert the listed behavioral cases. Record observed outputs/versions in the gate evidence report, not assumed test counts. Record owner-gated distributed limiter and public-form verification evidence; mocked Turnstile HTTP alone is preliminary, not successful live verification.

## Execution notes

Never read existing credential files. Owner provisioned disposable credentials are environment-only; logs/results are sanitized before retaining evidence.

## Commits (draft)

docs(spikes): prove denied surfaces, distributed limiting and bootstrap (4.6) — proposal only; dev-triggered.
