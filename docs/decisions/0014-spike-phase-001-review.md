# ADR-0014 — Spike plan 000, phase 001 review and process sign-off

- **Status:** accepted (2026-10-05) — records PROCESS acceptance of spike plan 000
  phase 001 (Core capability inventory — Q38 FIRST). This is a phase review record,
  **not** a gate closure and **not** a design selection: the only gate decision of the
  phase remains [ADR-0003](0003-core-capability-inventory.md) (Q38).
- **Deciders:** the dev (owner). This ADR records the independent review's process
  acceptance; the dev's phase approval/close remains a separate Orca verb.
- **References:** [ADR-0003](0003-core-capability-inventory.md) (Q38 closure);
  [design](../plans/000_spike-plan/designs/q38_capability-inventory.md);
  [evidence](../plans/000_spike-plan/evidence/q38_capability-inventory.md) (§4a task-1.2 run, §4b task-1.3
  acceptance re-run); harness `spikes/q38_capability-inventory/` (repo root);
  [phase 001 spec](../plans/000_spike-plan/phases/phase_001.md); parent plan
  [closure matrix](../plans/000_spike-plan/000_spike-plan.md#gate-closure-matrix-all-outputs-planned-no-closure-yet).
  No other gate ADR exists yet in this phase; no locked decision is reopened and no new
  design selection is made here.

## Review scope and method

Independent review of phase 001's outputs (tasks 1.1–1.3): Q38 capability inventory,
checker evidence, and the FIRST-closure claim. All five harness verification commands
were re-run from repo root in the review session; validators and `git diff --check`
were run; sanitized evidence was inspected against its acceptance criteria and the
parent closure matrix.

## Observed verification (this review session)

- `pnpm --dir spikes/q38_capability-inventory install --frozen-lockfile` → exit 0
  (pnpm 12.6.0, "Lockfile is up to date").
- `pnpm --dir spikes/q38_capability-inventory test` → exit 0; Vitest 3.2.4,
  `Test Files 1 passed (1)`, `Tests 7 passed (7)` (six R14.x behavioral cases plus the
  empty-facet malformed-manifest hardening test).
- `pnpm --dir spikes/q38_capability-inventory typecheck` → exit 0 (tsc --noEmit).
- `pnpm --dir spikes/q38_capability-inventory lint` → exit 0 (Biome 2.1.4,
  "Checked 5 files ... No fixes applied").
- `pnpm --dir spikes/q38_capability-inventory build` → exit 0 (tsc declaration emit).
- `validate-understanding.py` → OPEN 0 / ANSWERED 6; `validate-state.py` → valid;
  `git diff --check` → clean.

## Findings

- **No MUST findings.** The evidence supports the closure claim: sanitized evidence
  §4a/§4b matches the acceptance criteria; the closure matrix records **Q38 Closed as
  the first and only Closed gate**, all other gates Planned; dev acceptance is explicit
  (task-1.1 dev gate for inventory/policy; task-1.3 claim gate "confirmed…please
  continue"); failed-check blocking did not apply (all commands exit 0).
- **SHOULD — harness-path drift (flagged, not repaired mid-phase):** the phase/task
  spec's Verification strings name
  `spikes/q38_capability-inventory/`, but the harness was
  created at the repo-root `spikes/q38_capability-inventory/` (dev relocation during
  task 1.2; recorded in evidence §4b and the parent plan's 1.2 summary). Later task
  files citing this harness should use the live repo-root path.
- **SHOULD — scope limits carried honestly (no action in this phase):** the harness
  does not prove cross-module C9 ID-prefix collision handling, dependency-cycle
  detection, real D1/`@cloudflare/vitest-pool-workers`/OPFS surfaces, or the repo-wide
  R13.1–R13.3 dependency-graph/lint sweeps. ADR-0003 assigns these to Q35/Q45/Q63/Q70;
  consumers must not cite the spike harness for them.
- **DEFER — Q42 classification fixtures (R15.1/R15.2)** were not exercised as bespoke
  fixtures; their mechanics are indirectly covered by the registry/parity checks. No
  gate depends on bespoke R15 fixtures before its own tasks run.
- **DEFER — commit-tag drift** in task Files/commit drafts vs actuals (noted in the
  1.3 summary); cosmetic, no effect on evidence.

## Blocked owner/browser/cloud checks

None applicable in this phase: tasks 1.1–1.4 include no owner browser checks, cloud
resource/deployment gates, or resource-using proofs (the harness is pure TypeScript
with in-memory fixtures). **Status: N/A.**

## Consequences

- Phase 001's process is accepted as reviewed; the dev's phase approval/close and any
  phase commit remain separate dev-triggered Orca steps. This review task leaves its
  close-out edits uncommitted.
- Q38 remains the only Closed gate. Phase 002 may not start until phase 001 is
  approved/closed through the matching Orca verb.
- The SHOULD path-drift finding is recorded for reconciliation in later phase/task
  documents; the DEFER items carry forward unchanged.
