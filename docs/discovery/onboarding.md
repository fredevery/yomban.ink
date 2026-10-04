---
title: Yomban.ink — onboarding log
created_session: "20261004_205956_bcec0f"
sessions: ["20261004_205956_bcec0f"]
approved: true
---

# Yomban.ink — Onboarding Log

**Provenance:** created 2026-10-04 · Repo: yomban.ink (`main`) · Session:
`20261004_205956_bcec0f` · Intent: **`/onboard-existing`** (pre-seeded branch — mine the doc
corpus, confirm-not-reask).

This is the durable per-project onboarding log (ADR-0009): the provenance + sign-off record of
the onboarding run — which §5 questionnaire groups were answered, how far each of the seven
baseline layers is settled, and from what source. It is created at the onboarding WRITE step,
stamped `approved: true` by `/approve-onboard` (never by an executing task), and read back by
`/commit-onboard`. It is **not** one of the seven MUST layers it tracks; it is the non-transient
home for the run's state + sign-off.

## Source of the pre-fill (pre-seeded branch)

This is a **greenfield, spec-stage** repo: no code and, at run time, a single git commit
(`Initial understanding and specs`) and a clean working tree — nothing to mine from history. The
pre-fill was mined from the **docs corpus** instead:

- `docs/discovery/understanding.md` — authoritative discovery record, Q1–Q71 (validator-clean:
  **OPEN 0**, 59 ANSWERED, 12 DEFERRED).
- `docs/discovery/understanding-amendments-001.md` (Q70: local-first client datastore + sync) and
  `…-002.md` (Q71: privacy scope; confirms Q70 is an MVP deliverable).
- `docs/specs/000_index.md` … `008_operations-and-quality.md` — the nine specs.
- `docs/reviews/001_spec-review.md` — independent pre-implementation review; **§9** holds the
  resolved decisions (D1–D5, Q-A) + deferred/housekeeping. **§9 is settled and folded; §1–§8 are
  the dated record.**

**Drift surfaced at ORIENT:** the task brief said “no commits + uncommitted changes”, but the
tree is **committed and clean** — no reconciliation needed. **YB-D2** (empty
`docs/prompts/spec-review-prompt.md`) is **already resolved**: the file is 6756 bytes (populated),
as is `review-prompt-3.md` (5936 bytes).

## Discovery §5 questionnaire — answers

The §5 questionnaire (`project-onboarding-discovery.md` §5, groups A–H; group I is
migration-specific and **skipped** — greenfield) maps 1:1 to the seven baseline layers. All
groups were **already settled** in `docs/discovery/understanding.md` (Q1–Q71). Per the
confirm-not-reask path, the loop was a **confirmation pass** — the pre-filled understanding was
confirmed by the dev, plus three new baseline-structure questions (below). The loop reached
**zero `[STATUS: OPEN]`** before WRITE.

| Group | Category (→ baseline layers) | Answered in | Source |
| --- | --- | --- | --- |
| A | Identity & purpose (→ L1, L2) | Yes | Q1–Q4 |
| B | Scope (→ L1, L6) | Yes | Q5–Q7 |
| C | Architecture & layout (→ L2) | Yes | Q8–Q12 |
| D | Tech stack & environment (→ L1, L7) | Yes | Q13–Q16 |
| E | Decisions (→ L3) | Yes | Q17–Q19 |
| F | Conventions (→ L4) | Yes | Q20–Q23 |
| G | Best practices (→ L5) | Yes | Q24, Q25 |
| H | Status & state (→ L6) | Yes | Q26, Q27 |
| I | Migration-specific | n/a | greenfield — skipped |

## New baseline-structure questions settled this run

Three questions the corpus did not settle surfaced while drafting the baseline; each was answered
by the dev at the UNDERSTAND gate (confirm-not-reask):

- **N1 — ADR granularity (L3).** *Answer:* author **one consolidated** `platform-foundations`
  ADR now (`docs/decisions/0001-platform-foundations.md`); **split per-topic later** without
  changing content.
- **N2 — Housekeeping disposition.** *Answer:* record **YB-S3** (gate-table dedup) and **YB-D3**
  (005 format divergence) in `docs/backlog/yomban-backlog.md`; note **YB-D2** as
  **already-resolved** (the prompt file is populated).
- **N3 — Layer 7 depth at spec stage.** *Answer:* a **skeletal `docs/quickstart.md`** (planned
  commands/ports, no secrets) + a committed **`.dev.vars.example` stub**.

## Seven baseline layers — present vs written this run

| Layer | Baseline doc(s) | Status |
| --- | --- | --- |
| 1 — Entry point | `AGENTS.md` | **authored** this run |
| 2 — Architecture / spec | `docs/specs/000_index.md` … `008_operations-and-quality.md` | **pre-existing** (pointed to by AGENTS.md) |
| 3 — Decisions | `docs/decisions/0001-platform-foundations.md` (consolidated foundations) + `0002-onboarding-baseline.md` (this run) | **authored** this run |
| 4 — Conventions | `docs/conventions/` (engineering-principles, git-workflow, subagent-conventions, architectural-patterns) | **authored** this run |
| 5 — Best practices | `docs/best-practices/` (typescript, worker, persistence, module-authoring, auth, testing, ids-and-enums, client, bindings) | **authored** this run |
| 6 — Status & state | `docs/status/yomban-status.md` + `docs/backlog/yomban-backlog.md` | **authored** this run |
| 7 — Quickstart & environment | `docs/quickstart.md` + `.dev.vars.example` | **authored** this run (planned — no code) |

All seven MUST layers are present. The architecture layer (L2) was already fully covered by the
nine specs, so it was **not** re-authored — AGENTS.md points to it.

## Gate state at write time

- `scripts/validate-understanding.py docs/discovery/understanding.md` → **OK** (OPEN 0). The WRITE
  state-gate was green before any layer was persisted.
- No plan is active; `docs/plans/` is empty. Onboarding is a **plan-shaped lifecycle** (one
  baseline doc set, one commit; no execute/iterate layer).

## Housekeeping resolved by this run (spec-set edits)

Beyond the baseline layers, the onboarding REVIEW closed the carry-over housekeeping by editing
the **spec set** (Layer 2) rather than only recording it (dev instruction: resolve all findings,
including deferred ones):

- **YB-S3 — gate-boilerplate dedup.** Added a **canonical gate table** (gate / kind /
  owner-deliverable / block) to `docs/specs/000_index.md`, and reduced `002/003/005/006/007/008`
  to **cite** it instead of restating the Q38/Q40/Q46/Q47/Q54/Q63/Q70/Q65–Q68 boilerplate. The
  specs' locked-decision bullets and intended-design-scope lists were preserved.
- **YB-D3 — 005 house-format.** Removed 005's YAML frontmatter; retitled to
  `# Yomban.ink: content and editing`; one-line Status (internal §-numbering retained — it is
  referenced internally).
- **YB-D2** and **YB-D1** — already resolved (prompt file populated; AGENTS.md now exists).

These edits are part of the same `docs(onboarding):` baseline commit.

## Next after onboarding

Stand up the Trello board (7 workflow lists) + `.project/state.json`; then **`/new-plan`** for
**spike plan 000** at `docs/plans/000_...`, which owns the foundational gates (Q38 first, then
Q40/Q46/Q47/Q54/Q63/Q70) and the affected-work gates (Q65–Q68). See
`docs/status/yomban-status.md`.
