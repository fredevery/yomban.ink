# ADR-0016 — Spike plan 000, phase 002 review and process sign-off

- **Status:** accepted (2026-10-06) — records PROCESS acceptance of spike plan 000
  phase 002 (Workflow and persistence inputs — Q54 / Q63). This is a phase review record,
  **not** a gate closure and **not** a design selection: the gate decisions of the phase
  remain [ADR-0004](0004-content-workflow-semantics.md) (Q54) and
  [ADR-0005](0005-database-placement-and-migrations.md) (Q63), both still **Proposed**.
- **Deciders:** the dev (owner). This ADR records the independent review's process
  acceptance; the dev's phase approval/close remains a separate Orca verb.
- **Numbering note:** the phase file allocated `docs/decisions/0015-spike-phase-002-review.md`,
  but 0015 was consumed mid-phase by [ADR-0015](0015-spike-harness-location.md) (harness
  location, task 2.2). Per the parent plan's artifact contract ("never overwrite or quietly
  renumber someone else's record"), this review takes the next free number, 0016. The drift
  is recorded as a SHOULD finding below.
- **References:** [ADR-0004](0004-content-workflow-semantics.md) (Q54 workflow semantics,
  Proposed); [ADR-0005](0005-database-placement-and-migrations.md) (Q63 placement/migrations,
  Proposed); [ADR-0015](0015-spike-harness-location.md) (harness location);
  [Q54 design](../plans/000_spike-plan/designs/q54_content-workflows.md) /
  [Q54 evidence](../plans/000_spike-plan/evidence/q54_content-workflows.md);
  [Q63 design](../plans/000_spike-plan/designs/q63_persistence-migrations.md) /
  [Q63 evidence](../plans/000_spike-plan/evidence/q63_persistence-migrations.md);
  harnesses `spikes/q54_content-workflows/` and `spikes/q63_persistence-migrations/`
  (repo root, per ADR-0015); prerequisite harness `spikes/q38_capability-inventory/`;
  [phase 002 spec](../plans/000_spike-plan/phases/phase_002.md); parent plan
  [closure matrix](../plans/000_spike-plan/000_spike-plan.md#gate-closure-matrix-all-outputs-planned-no-closure-yet);
  owning specs `docs/specs/005_content-and-editing.md` and
  `docs/specs/003_data-and-migrations.md` (the task brief's "003_data-and-persistence.md"
  is the wrong filename; the live spec is `003_data-and-migrations.md`). No locked decision
  is reopened and no new design selection is made here.

## Review scope and method

Independent review of phase 002's outputs (tasks 2.1–2.4): the Q54 accepted workflow input
and its real-D1 proof, the Q63 provisional placement/migration/auth design and its real-D1
proof, both harnesses' full verification gates, the phase-001 prerequisite harness, the
framework validators, and the sanitized evidence inspected against each task's acceptance
criteria and the owning specs (005 §§6/8 R1–R11; 003 §Q63).

## Observed verification (this review session, 2026-10-06)

All commands from repo root; every exit code observed, none assumed:

- **Q54 harness** (`pnpm --dir spikes/q54_content-workflows`): `install --frozen-lockfile`
  → exit 0 ("Lockfile is up to date", pnpm 12.6.0); `test` → exit 0, Vitest 3.1.4 +
  @cloudflare/vitest-pool-workers 0.8.19, `Test Files 1 passed (1)`, `Tests 21 passed (21)`;
  `typecheck` → exit 0 (tsc --noEmit clean); `lint` → exit 0 (Biome 2.1.4, "Checked 8
  files ... No fixes applied"); `build` → exit 0 (tsc emit clean).
- **Q63 harness** (`pnpm --dir spikes/q63_persistence-migrations`): `install
  --frozen-lockfile` → exit 0 ("Lockfile is up to date"); `test` → exit 0, `Test Files 2
  passed (2)`, `Tests 14 passed (14)` — `src/proof.test.ts` 10 migration-runner tests +
  `src/auth.test.ts` 4 Better Auth tests (sign-up/sign-in flows, stored-row and
  sqlite_master inspection: every `core_*` PK and FK column TEXT, no INTEGER keys);
  `typecheck` → exit 0; `lint` → exit 0 (Biome, "Checked 10 files"); `build` → exit 0.
  Pinned versions match evidence §6: better-auth 1.3.27, drizzle-orm 0.45.3,
  drizzle-kit 0.31.11, vitest 3.1.4, vpw 0.8.19, typescript 5.9.2, biome 2.1.4,
  wrangler 4.147.0.
- **Prerequisite re-run** (phase-001 harness; phase 002 depends on phase 001's approved
  state): `pnpm --dir spikes/q38_capability-inventory install --frozen-lockfile` / `test` /
  `typecheck` / `lint` / `build` — all exit 0, `Tests 7 passed (7)`.
- `git diff --check` → exit 0, no output. `validate-understanding.py
  docs/plans/000_spike-plan/understanding.md` → exit 0, "OPEN: 0, ANSWERED: 6";
  `validate-state.py .project/state.json` → exit 0, "state.json OK".

## Acceptance per review item

- **PASS — Q54 accepted workflow input (2.1/2.2).** Design traces to 005 §§6/8 (R1–R11),
  Q42/Q54/Q58 and Amendment 001 (evidence §2 matrix, including explicit non-ownership
  notes); dev workflow-INPUT acceptance is recorded (evidence §3, ACCEPTED 2026-10-05) and
  is separated from the unexecuted-checks list (evidence §4); task 2.2's harness exercises
  the accepted semantics against real D1 (21 tests, persisted-row inspection on success
  and rejection); ADR-0004 remains Proposed; no UI/presentation selection made.
- **PASS — Q63 provisional persistence/auth proof (2.3/2.4).** Shared-single-D1 placement
  is dev-accepted provisional input (evidence §2); §15 requirement matrix covers the 003
  §Q63 scope bullets; task 2.4's real-D1 harness proves ledger batch atomicity,
  lock/fencing, retry, ordering, upgrade and removal behaviours (10 tests) and Better Auth
  1.3.27 prefixed TEXT IDs via executed flows with stored-ID/sqlite_master inspection
  (4 tests); the provisional `usr_/ses_/acct_/vrf_` ID scheme is explicitly flagged
  pending Q40 reconciliation; evidence §4 item 9 (D1 batch-size calibration) is honestly
  left for phase-7 reconciliation; ADR-0005 remains Proposed; closure is 7.2.
- **PASS — gate-state preservation.** No input milestone is marked as gate closure
  anywhere: both designs carry "NOT a closed gate" banners; ADR-0004/0005 are Proposed;
  the parent closure matrix records Q54 "Gate NOT Closed" and Q63 "Gate NOT Closed";
  the phase file's exit state is preserved.

## Findings

- **No MUST findings.** Evidence is real and reproducible: this review re-ran every
  command and reproduced the recorded test counts, exit codes and versions exactly.
- **SHOULD — review-ADR number drift:** the task/phase Files allocated
  `0015-spike-phase-002-review.md`; 0015 was taken by the task-2.2 harness-location ADR.
  This review uses 0016; later references to the phase-002 review should cite 0016, and
  the phase file's task 2.5 Files list should be reconciled at phase close.
- **SHOULD — ADR-0004 status line cites stale evidence state:** its Status block still
  reads "evidence §3, PENDING", but evidence §3 now records the dev acceptance
  (ACCEPTED, 2026-10-05). Cosmetic provenance drift; ADR-0004's Proposed status is
  correct and untouched here (editing gate ADRs is not this task's scope).
- **SHOULD — parent closure matrix rows predate tasks 2.2/2.4:** the Q54 row cites the
  workflow/evidence tests as "task 2.2's" future work and the Q63 row as "Design
  DELIVERED … proof is task 2.4", while 2.2/2.4 have since run green (per the parent
  plan's own task-completion summaries). The rows remain honest — neither claims
  closure — but should be refreshed to "input accepted + proof run; gate still open,
  closure at 7.2/7.7" when the dev next touches the matrix.
- **DEFER — D1 batch-size calibration (Q63 evidence §4 item 9):** already assigned to
  phase-7 reconciliation by task 2.4; carried, not re-owned here.
- **DEFER — task-file Verification strings** still name the pre-ADR-0015 harness
  locations/paths in places (known pattern from phase 001's commit-tag/path drift);
  cosmetic, no effect on evidence.

## Blocked owner/browser/cloud checks

None applicable in this phase: tasks 2.1–2.5 include no owner browser checks, no cloud
resource/deployment gates, and no resource-using proofs (both harnesses run real D1 via
the local Miniflare Workers Vitest pool only; nothing was deployed). **Status: N/A.**

## Consequences

- Phase 002's process is accepted as reviewed; the dev's phase approval/close and any
  phase commit remain separate dev-triggered Orca steps. This review task leaves its
  close-out edits uncommitted.
- Q54 remains **input ACCEPTED, gate NOT Closed** (final closure waits for Q67
  guarantees, task 7.7); Q63 remains **provisional, gate NOT Closed** (proof done at
  2.4; final acceptance waits for Q65/Q40 reconciliation, task 7.2). Neither unblocks
  product implementation (parent plan: accepted inputs authorize nothing).
- Phase 003 may not start until phase 002 is approved/closed through the matching Orca
  verb. The SHOULD/DEFER findings above carry forward to later reconciliation.