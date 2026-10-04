# ADR-0002 — Orca onboarding baseline

- **Status:** accepted (2026-10-04) — the onboarding baseline commit.
- **Deciders:** the dev (owner).
- **References:** `docs/discovery/onboarding.md` (the durable run log), `AGENTS.md`,
  `docs/decisions/0001-platform-foundations.md`, `docs/reviews/001_spec-review.md` §9,
  `docs/status/yomban-status.md`.

## Context

Yomban.ink is greenfield and specification-stage: no code and, at run time, a single git commit
(`Initial understanding and specs`) with a clean tree. Orca's baseline gate applies — no
`AGENTS.md` → not onboarded — and the coding flow opens only after onboarding. This ADR records
the decisions the onboarding run itself made (the *project* foundations are ADR-0001).

## Decision

1. **Pre-seeded branch (`/onboard-existing`), mined from the docs corpus.** There is no code or
   useful git history to mine, so the pre-fill came from `docs/discovery/understanding.md`
   (Q1–Q71), the two amendments, the nine specs, and the spec review. Confirm-not-reask: the 71
   settled questions were confirmed, not re-asked.
2. **Three new baseline-structure questions were asked and settled** at the UNDERSTAND gate
   (recorded in the onboarding log): **N1** — author one consolidated `platform-foundations` ADR
   now, split per-topic later; **N2** — the review's housekeeping is disposed as below; **N3** —
   L7 ships as a skeletal `docs/quickstart.md` + `.dev.vars.example` (planned; no code).
3. **The understanding state-gate was honoured:** `docs/discovery/understanding.md` validated
   **zero-`OPEN`** (71 questions: 59 ANSWERED / 12 DEFERRED) before any layer was written.
4. **All seven MUST baseline layers are present.** L2 (architecture) was already fully covered by
   `docs/specs/000–008`, so it was **not** re-authored — AGENTS.md points at it. L1/L3–L7 were
   authored from the settled answers, in write order.
5. **The spec-review housekeeping was RESOLVED in the spec set, not merely recorded** (dev
   instruction): **YB-S3** — a canonical gate table was added to
   `docs/specs/000_index.md` and `002/003/005/006/007/008` now cite it instead of restating the
   gate boilerplate (locked-decision bullets preserved); **YB-D3** — `005` was aligned to the
   house doc format. `YB-D2` (prompt file populated) and `YB-D1` (AGENTS.md) were already
   resolved.
6. **One scoped `docs(onboarding):` commit** lands the whole baseline (layers + onboarding log +
   the spec-set edits); the baseline ADRs (`0001` foundations, `0002` this) ride it.

## Rationale

- Mining the docs corpus is the correct pre-seed when there is no code; a git mine would be empty.
- Confirm-not-reask respects the already-settled Q1–Q71 while keeping the loop's zero-`OPEN` gate
  a real gate (three genuine structure questions were still raised and answered).
- Not re-authoring L2 avoids duplicating a complete, reviewed spec set; the layer is *present* and
  discoverable, which is what the seven-layer requirement asks.
- Resolving the housekeeping at onboarding (rather than deferring to a later pass) keeps the spec
  set internally consistent as plan 000's primary input, per the dev's direction.

## Rejected alternatives

- **Re-running the full §5 questionnaire** — rejected (confirm-not-reask): the corpus already
  answers groups A–H.
- **Recording the housekeeping in the backlog only** — rejected by the dev's direction to resolve
  it; inconsistent gate boilerplate would otherwise persist into plan 000.
- **Authoring a full quickstart/env layer with real commands** — rejected: no implementation
  exists; L7 is explicitly a **planned** skeleton (Q16/Q40), so it must not claim working state.
- **Re-authoring L2 as a new architecture doc** — rejected: would duplicate the nine specs.

## Consequences

- Positive: a fresh session can orient from `AGENTS.md` alone; the spec set is de-duplicated with
  a single canonical gate table; the onboarding sign-off has a durable home.
- Negative/risks: the baseline's commands/quickstart are **planned** and will need refreshing when
  Q40/Q46 land the real dev wiring; AGENTS.md's "Current Phase:" pointer and the status doc must
  be refreshed at each plan/phase milestone (they go stale fastest).

## Follow-on decisions needed

- **`/new-plan` spike plan 000** (`docs/plans/000_...`) owns the foundational gates
  (Q38 first, then Q40/Q46/Q47/Q54/Q63/Q70) and the affected-work gates (Q65–Q68). See
  `docs/status/yomban-status.md` and `docs/specs/000_index.md` (canonical gate table).
