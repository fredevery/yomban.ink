# ADR-0015 — Spike harnesses live at repo-root `spikes/`

- **Status:** Accepted
- **Date:** 2026-10-06
- **Deciders:** Fred Every
- **Context:** plan_000 phase_002, task 2.2 claim gate

## Context

Task cards under `docs/plans/000_spike-plan/` initially named harness output paths
inside the plan tree (`docs/plans/000_spike-plan/spikes/<slug>/`). The first committed
spike harness (task 1.2, Q38 capability inventory) instead lives at repo-root
`spikes/q38_capability-inventory/`. Task 2.2 (Q54 content workflows) hit the same
conflict at its claim gate.

## Decision

**Spike harnesses live at repo-root `spikes/<slug>/`.** Task-card Files lists that
name `docs/plans/.../spikes/...` are reconciled to `spikes/<slug>/` at the task's
claim gate — the deviation is recorded in the task's evidence report rather than
silently repairing either side. `docs/plans/**` remains documentation-only.

## Consequences

- Harness trees (`package.json`, migrations, node_modules, build output) never sit
  under `docs/`; the docs tree stays clean for the durable record.
- The root `.gitignore` (`node_modules/`, `dist/`) covers all harnesses uniformly.
- Phase-planning Files lists keep their authored paths; reconciliation happens
  per-task at claim (this ADR is the standing reference), and the phase review may
  sweep the phase doc's paths as part of its planning-doc edit budget.

## References

- Task 1.2 commit f604e37 (`spikes/q38_capability-inventory/`) — first instance.
- `docs/plans/000_spike-plan/evidence/q54_content-workflows.md` §5 — location note
  recording the task 2.2 deviation and the dev's decision.