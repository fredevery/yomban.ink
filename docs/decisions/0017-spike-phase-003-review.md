# ADR-0017 — Spike plan 000, phase 003 review and process sign-off

- **Status:** accepted (2026-10-07) — records PROCESS acceptance of spike plan 000
  phase 003 (Coupled design inputs — Q40 / Q47 / Q46 / Q70). This is a phase review
  record, **not** a gate closure and **not** a design selection: the gate decisions of
  the phase remain [ADR-0006](0006-composition-installation-and-lifecycle.md) (Q40),
  [ADR-0007](0007-client-wire-host-and-presentation.md) (Q47),
  [ADR-0008](0008-public-site-starter.md) (Q46) and
  [ADR-0009](0009-local-first-datastore-and-sync.md) (Q70), all still **Proposed**.
- **Deciders:** the dev (owner). This ADR records the independent review's process
  acceptance; the dev's phase approval/close remains a separate Orca verb.
- **References:** [ADR-0006](0006-composition-installation-and-lifecycle.md) /
  [ADR-0007](0007-client-wire-host-and-presentation.md) /
  [ADR-0008](0008-public-site-starter.md) /
  [ADR-0009](0009-local-first-datastore-and-sync.md) (all Proposed);
  [Q40 design](../plans/000_spike-plan/designs/q40_composition-lifecycle.md) /
  [evidence](../plans/000_spike-plan/evidence/q40_composition-lifecycle.md);
  [Q47 design](../plans/000_spike-plan/designs/q47_client-host-contracts.md) /
  [evidence](../plans/000_spike-plan/evidence/q47_client-host-contracts.md);
  [Q46 design](../plans/000_spike-plan/designs/q46_public-starter.md) /
  [evidence](../plans/000_spike-plan/evidence/q46_public-starter.md);
  [Q70 design](../plans/000_spike-plan/designs/q70_local-first-sync.md) /
  [evidence](../plans/000_spike-plan/evidence/q70_local-first-sync.md);
  prerequisite harnesses `spikes/q38_capability-inventory/`, `spikes/q54_content-workflows/`,
  `spikes/q63_persistence-migrations/` (repo root, per ADR-0015);
  [phase 003 spec](../plans/000_spike-plan/phases/phase_003.md); parent plan
  [closure matrix](../plans/000_spike-plan/000_spike-plan.md#gate-closure-matrix-all-outputs-planned-no-closure-yet);
  plan-understanding [amendment 001](../plans/000_spike-plan/understanding-amendments-001.md)
  (in-situ capability flagging, born at the task-3.2 acceptance). No locked decision is
  reopened and no new design selection is made here.

## Review scope and method

Independent review of phase 003's outputs (tasks 3.1–3.4): the four provisional design
trios (design + evidence + ADR each) and their recorded dev acceptances; the phase's
prerequisite proof harnesses (whose accepted inputs the designs consume); the framework
validators; and the evidence inspected against each task's acceptance criteria and the
owning focused specs. Phase 003 is a **design/evidence-only phase** — no harness was
built in this phase, so "execute every harness script actually created in this phase"
is vacuously satisfied; the review instead executed the phase's real verification
commands (below), re-ran the affected prerequisite proofs, and mechanically swept the
artifacts (own-§-reference resolution, gate-state banners, tally arithmetic, file
hygiene).

## Observed verification (this review session, 2026-10-07)

All commands from repo root; every exit code observed, none assumed:

- **Prerequisite harness re-runs** (each: `pnpm --dir <harness> install --frozen-lockfile`
  / `test` / `typecheck` / `lint` / `build`):
  - `spikes/q38_capability-inventory` — all exit 0, `Tests 7 passed (7)`.
  - `spikes/q54_content-workflows` — all exit 0, `Tests 21 passed (21)`.
  - `spikes/q63_persistence-migrations` — all exit 0, `Tests 14 passed (14)`
    (matches ADR-0016's recorded counts exactly).
- `git diff --check` → exit 0, no output.
- `validate-understanding.py docs/plans/000_spike-plan/understanding.md` → exit 0
  ("OPEN: 0, ANSWERED: 6"; amendment 001's Q7 lives in the sibling amendment file per
  the plan-scope amendment pattern, with the pointer bullet in the base file).
- `validate-state.py .project/state.json` → exit 0, "state.json OK".
- New-file hygiene: terminal newline + no trailing whitespace confirmed on all eight
  design/evidence files and the four ADRs (`git diff --check` does not cover untracked
  files; checked by hand).

## Acceptance per review item

- **PASS — Q40 composition/installation/lifecycle (3.1).** All 19 design sections map
  to the evidence §2 traceability rows and §4's seven NOT-RUN checks name their
  phase-006 owners; no dangling own-§ reference in the design (mechanical sweep); the
  dev's 2026-10-06 acceptance is recorded with its condition intact (install specifiers
  accepted as provisional SHAPE, syntax explicitly UNVERIFIED pending the phase-006
  probe — evidence §3 item 4). ADR-0006 stays Proposed with the acceptance annotation
  and the joint-7.8 closure pointer. Performance-target proposals correctly forwarded
  to Q47 rather than adopted.
- **PASS — Q47 client/wire/host/presentation contracts (3.2).** Design §17 matrix
  covers the 004 acceptance items; the seven 2026-10-07 acceptance items are recorded
  with their conditions (error-code vocabulary must be a module-owned PascalCase enum;
  host notifications additive-only) and the dashboard/overlay directional input correctly
  routed to plan-understanding amendment 001 (a genuinely new capability) instead of
  being settled inside the design. Conditional htmx checks (§13) are designed without
  adopting htmx. One dangling § ref found and fixed by this review (see findings).
- **PASS — Q46 public-site starter (3.3).** The candidate matrix is source-backed: 14
  distinct primary-source endpoints, re-counted mechanically by this review (8 npm
  registry + 3 GitHub API + 2 official doc pages + 1 LICENSE file) — the evidence's
  own tally line matches its itemized rows exactly. Dev acceptance (2026-10-07,
  "I approve Astro as the starter framework") is recorded with its five conditions —
  thin-`apps/web`, SolidStart evaluated-conversational-not-added, htmx non-adoption,
  dashboard-Astro-independence, and the generality deferral — all five routed correctly
  (generality tension → backlog item 8, not silently absorbed). The unverified SEO row
  and NOT-RUN list stay honest (owners: task 6.4).
- **PASS — Q70 local-first datastore and sync (3.4).** The design's §19 requirement
  matrix covers Amendment 001 §§1–8 (topic-quoted, not invented sub-numbering) and
  amendment 002; the executed source verification (§2) is per-claim sourced — npm
  registry JSON, published tarballs read directly, sqlite.org wasm docs and MDN quoted.
  The Safari <17 / sahpool 16.4+ floor, the pre-3.54 same-thread locking bug and the
  COOP/COEP-vs-CSP interaction are recorded as phase-005 conditional risks requiring
  dev reconciliation — never a silent in-memory fallback. Dev acceptance (2026-10-07,
  §6) covers all 16 policy rows with the NOT-RUN checks preserved. `sessions: []` on
  the evidence file is correct: the file was authored in the task-claim session, whose
  claim provenance lives on the task file (per the skill's design-trio provenance rule).
- **PASS — gate-state preservation.** No input milestone is marked as gate closure
  anywhere: all four designs carry the NOT-a-closed-gate banner; ADR-0006/0007/0008/0009
  are all Proposed with acceptance-not-adoption annotations; the parent closure matrix
  still reads Planned for Q40/Q47/Q46/Q70 (refresh is a SHOULD finding below, not a
  closure claim); the phase file's exit state ("All four designs are accepted inputs
  only. Candidates remain proposed until bounded proof and explicit final acceptance.")
  is preserved.

## Findings

- **No MUST findings.** Evidence is honest and traceable; the review re-ran every
  prerequisite proof and reproduced the recorded counts exactly; the mechanical sweeps
  (own-§ refs, source tallies, gate banners) surfaced only the items below.
- **SHOULD — Q47 design §17 cites a non-existent §13.4–5:** the requirement-matrix row
  "Session-expiry/422 handling; private history isolation" cites `§13.4–5`, but design
  §13 is a flat 5-item list with no sub-numbering — the cited content is items 4–5 of
  §13. Fixed by this review: row re-cited as "§13 items 4–5". (Same device-class as the
  phase-001/002 invented-sub-numbering lessons; caught by the mechanical sweep.)
- **SHOULD — parent closure matrix rows predate tasks 3.1–3.4:** the Q40/Q47/Q46/Q70
  rows still read `Planned`, while the phase's own task log records all four design
  trios shipped and dev-accepted. The rows remain honest (neither claims closure) but
  should be refreshed to the "Design DELIVERED / input accepted + dev-accepted
  provisional decisions; gate NOT Closed, closure at 6.x/joint 7.8 / 5.1 / 7.6" row
  contract (matching the Q54/Q63 rows) when the dev next touches the matrix. Suggested
  owners per row: Q40/Q47/Q46 → joint 7.8 (6.1–6.4 proofs pending); Q70 → 5.1–5.3
  browser/round-trip proofs, reconciliation 7.6.
- **SHOULD — status doc (L6) one phase behind:** `docs/status/yomban-status.md` still
  carries the phase-002 state in "Current phase" (phase-003 execution happened after
  the phase-002 close-out commit and no interim refresh landed). Refreshed by this
  review to the phase-003 reviewed state; AGENTS.md's Current-Phase pointer is a
  protected-file edit left for the dev's phase approval/close step (per its own rule).
- **DEFER — Q40 install-specifier syntax (evidence §4 item 1):** remains UNVERIFIED
  pending the phase-006 probe; already owned by tasks 6.1–6.2, carried not re-owned.
- **DEFER — Q46 SEO/structured-data primary-source verification (evidence §2.2 gap +
  §4 item 5):** capability-known only; owned by task 6.4.
- **DEFER — Q70 real-browser matrix, worker/proxy bridge, local transaction atomicity,
  sync round trip vs real D1, local migrations/snapshot, tombstone/GC (evidence §4
  items 1–6):** owned by phase-005 task 5.1 (+ Q65/Q56 server side), per the plan's
  real-browser prerequisite rule; carried.

## Blocked owner/browser/cloud checks

None blocking in this phase: tasks 3.1–3.5 are design/evidence/doc-only; no harness,
deploy, cloud resource or owner-browser step exists yet. Real-browser evidence is
explicitly assigned to phase-005 (task 5.1) and starter/budget measurements to phase-006
(task 6.4) — recorded as DEFERs above, not silent gaps. **Status: N/A for phase 003;
carried forward with named owners.**

## Consequences

- Phase 003's process is accepted as reviewed; the dev's phase approval/close and any
  phase commit remain separate dev-triggered Orca steps. This review task leaves its
  close-out edits uncommitted.
- Q40/Q47/Q46 remain **design DELIVERED + dev-accepted provisional inputs, gates NOT
  Closed** (proofs at 6.1–6.4; joint closure 7.8); Q70 remains **design + executed
  source verification, gate NOT Closed** (browser/round-trip proofs at 5.1–5.3;
  reconciliation 7.6). No gate closure is recorded here; accepted inputs authorize
  nothing (parent plan rule).
- The four gate ADRs stay Proposed; the pending proof tasks own their final acceptance.
- Phase 004 (Q65/Q66/Q67/Q68 designs) may not start until phase 003 is approved/closed
  through the matching Orca verb. The SHOULD/DEFER findings above carry forward.
