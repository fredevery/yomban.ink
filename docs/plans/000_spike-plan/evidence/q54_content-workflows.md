---
title: "Q54 — Content workflow semantics (evidence: design → 005 §§6/8 R1–R11, Q42/Q54/Q58, Amendment 001 traceability)"
created_session: "20261005_204610_dde3e1"
sessions: ["20261005_204610_dde3e1"]
approved: false
---

# Q54 — Evidence report (task 2.1) — content workflow semantics traceability

> This is the **Q54 evidence report for task 2.1**
> (`docs/plans/000_spike-plan/tasks/phase_002/in-progress/task_2.1.md`). It records (a) what
> the task produced, (b) the traceability of every design element in
> `designs/q54_content-workflows.md` to `docs/specs/005_content-and-editing.md` §6 and §8
> (R1–R11), Q42/Q54/Q58 and Amendment 001 (Q70) items, (c) the **dev workflow-input
> acceptance** status, and (d) the **checks not executed** in this task.
>
> **Nothing in this report asserts an unexecuted check as run.** No tests, no D1 execution and
> no harness were exercised in this task; those are task 2.2's deliverable. Dev acceptance of
> the workflow INPUT is PENDING and is recorded as such.

## 1. What was produced

Exactly three documentation files, matching the task card's Files list — no other file was
created or modified, no code was written:

1. **`docs/plans/000_spike-plan/designs/q54_content-workflows.md`** — the concrete,
   presentation-independent workflow-semantics design: content type/field model (text,
   rich text, media, relation, repeater; stored types inferred from module Drizzle schema),
   the workflow state machine with legal/illegal transition tables, immutable append-only
   revision history and failed-publish behaviour, the Q42 publishing-lifecycle shape
   (visibility/soft-delete/sort_order), server-side optimistic revision checks, save/autosave
   semantics, authorized preview, DOM entity/field references and host ownership, the Q70
   lock interaction, the named Q66/Q67 required guarantees, and the one-line search future
   home.
2. **`docs/decisions/0004-content-workflow-semantics.md`** — ADR-0004, status **Proposed**
   (not Accepted/closed), recording the settled workflow semantics with no implementation
   selection and no UI choice. Format matches ADR-0001/0002/0003.
3. **This evidence report** — `docs/plans/000_spike-plan/evidence/q54_content-workflows.md`.

Design decisions not traceable to a single source line (the four dev-accepted semantic
defaults settled for this task, per the task card's execution note "Resolve state semantics
with the dev") are labelled in the design §1: review as a distinct required gate; append-only
revision rows keyed to the aggregate root with failed publishes as events, not revision rows;
deliberate saves + debounced autosave (~1–2 s quiescence) with revision-number-carrying
saves; Q66/Q67 named as required without inventing mechanism/window.

## 2. Traceability matrix

Each design element maps to its sources: `005` §6 bullets (6.1 items), §8 requirements
R1–R11, discovery Q42/Q54/Q58, and Amendment 001 (Q70 / Q54 amendment).

| Design element (design §) | 005 §6 | 005 §8 (R1–R11) | Discovery Q42/Q54/Q58 | Amendment 001 (Q70/Q54) |
|---|---|---|---|---|
| Field kinds text / rich text / media / relation / repeater (§2.1) | §6.1 bullet 1 (content type/field definitions) | R1 (create a type exercising every field kind); R9 (rich text sanitized, no executable UI) | Q54 (the five kinds named) | — |
| Stored types inferred from module Drizzle schema; no parallel type system (§2.2) | §6.1 bullet 1 (field/type definition lives in module schema; stored types inferred from Drizzle) | — | Q54 (schema-based definitions) | — (data stance: `003` Q10/Q37/Q63) |
| Media fields resolve via the owning media module (§2.1, §13) | §6.1 bullet 1; §3 (Q58 neighbour lock) | R11 (media in content exercised against the media module) | Q58 (media module owns records; core R2 infrastructure + upload/transform contracts) | — |
| Relation fields reference another record (§2.1) | §6.1 bullet 1 | R1 (relation fields resolve through their owning module) | Q42 (shared content/collection engine, reference fields) | — |
| Repeater = ordered child field groups; children ride the aggregate root (§2.1, §2.3) | §6.1 bullet 1 | R1 | Q54 (repeater kind) | Q70 §3 (record = aggregate root; child rows inherit root state, never independently locked/versioned/synced) |
| Record = aggregate root; prefixed TEXT ids (§2.3) | — | — | — | Q70 §3 (record definition); Amendment 001 §C Q35/Q37 (manifest-declared aggregate roots) |
| States draft / review / published / scheduled + revision history (§3.1) | §6.1 bullet 2 (publishing workflow states) | R2 (records traverse draft → review → publish → schedule → revision) | Q54 (workflow states named; arrow NOT taken as a literal machine) | — |
| Legal transitions incl. review as required gate; scheduled edit via revision; scheduled→published at schedule time; post-publish revision → new draft revision (§3.2) | §6.1 bullet 2 | R2 (scheduled future publish; post-publish revision; coherent queryable history) | Q54; **dev-accepted default 1 & settled semantics** | — |
| Illegal transitions: no draft→published without review; no scheduled without future time; no republish without revision; drafts have no revisions (§3.3) | §6.1 bullet 2 | R2 | Q54; dev-accepted defaults 1–2 | — |
| Immutable append-only revision rows keyed to the aggregate root (§4) | §6.1 bullet 2 | R2 (coherent, queryable history; failed-publish recovery paired with Q66) | Q54; dev-accepted default 2 | Q70 §3 (revisions attach to the root) |
| Failed publish → pre-attempt state + failed-attempt EVENT, not a revision row (§4) | §6.1 bullet 2; §7 (Q66 owns durable publish effects) | R2 (recovery of a failed publish is exercised, paired with Q66) | dev-accepted default 2 | — |
| Visibility flag, soft-delete/tombstone, manual sort_order on every content record (§5) | §6.1 bullet 2 (publishing-lifecycle semantics shared by modules) | — | Q42 (identical publishing-lifecycle mixins across both pilots) | Q70 §8 (tombstone delete; retention/GC owned there + Q65) |
| Server-side optimistic revision checks; stale submissions & concurrent overwrites rejected without discarding newer data or false success (§6) | §6.1 bullet 3 | R3 (stale revision + concurrent overwrite rejected; Q7/Q47/Q61 acceptance evidence) | Q54 (optimistic concurrency/revision checks) | Q70 §5 (complementary field-level mechanism) |
| Q54 revision checks vs Q70 field-level three-way diff — complementary, not the same mechanism (§6, §11) | §6.1 bullet 7 (complementary, not the same mechanism) | R3 (offline/local-first conflict uses Q70's three-way diff) | — | Q70 §5 (field-level conflict detection; three-way diff; visible rejected-op bucket) |
| Deliberate saves + debounced autosave (~1–2 s quiescence, never per keystroke); unsaved/draft state client-tracked; interrupted/late/failed save never discards the draft nor reports successful publish (§7) | §6.1 bullet 6 (draft/unsaved state, deliberate or appropriately debounced saves) | R4 (interrupted/late/failed save) | Q54 (draft/unsaved state, debounced saves) | — |
| Authorized preview: permission-gated (roles + module-prefixed scopes), server-enforced for API and HTML; bypass shared public caches / provably isolated keys — guarantee REQUIRED, mechanism/window Q67's (§9) | §6.1 bullet 4 (preview permissions); §6.4/§7 (Q67 owns the guarantees) | R6 (denied unauthorized/expired preview; drafts never in shared/public contexts; **gated by Q67**) | Q54 (preview permissions); Q50 via `005` (roles + module-prefixed scopes) | Q67 amendment (§C): public-propagation/preview rules continue to govern the remote |
| DOM entity/field references; host retains content DOM ownership; panel mutates only panel-owned surfaces and notifies the host (§10) | §6.1 bullet 5 (DOM-to-entity/field host integration); §5 (overlay responsibility split) | R5 (overlay maps DOM → entity/field; host-owned DOM; proven by both fixtures) | Q54 (DOM-to-entity/field mapping) | — |
| Lock eligibility decoupled from publish state; lock once shared/remote; offline edits unlocked-provisional (§11) | §6.1 bullet 7 (lock eligibility decoupled from publish state) | — | Q54 amendment bullet (§C) | Q70 §6 (presence-lease locks; lock-once-shared/remote; unlocked-provisional offline edits) |
| Q66 named as required: durable publish effects, retries, idempotency — no mechanism invented (§8, §3.2, §4) | §6.4 (Q54 does not invent Q66/Q67); §7 | R2, R7 (paired with Q66; **gated by Q67/Q66**) | Q54 (Q66 owns durable publish/invalidation effects) | Q70 §4 (change_set_id idempotency — Q66's surface) |
| Q67 named as required: cache isolation, preview, public propagation, read-your-writes — no mechanism/window invented (§8, §9) | §6.4/§7 (Q67 owns author read-your-writes, public staleness, preview isolation) | R6, R7 (both gated by Q67) | Q54 (supplies publishing freshness/preview needs) | Q67 amendment (§C): local-first read-your-writes local-by-construction; remote governed by Q67 |
| Search future home: post-MVP; indexes ride on published revisions — one line, no design (§12) | §6.1 (scope); `005` §10 | — (no search in MVP acceptance) | Q54/Q19 (search explicitly post-MVP; decide home, don't build) | — |
| No presentation/UI selection anywhere (§1, §13) | §5 (presentation deliberately unselected; workflows constrain, not choose) | R10 (frontend independence preserved; no selection made) | Q54 (implementation choices remain Q40/Q47) | — |

**Matrix completeness note:** §6.1 bullets 1–7 map to design §§2, 3–4, 6, 9, 10, 7 and 11
respectively — with one explicit non-ownership inside bullet 6: its **"lifecycle/input/focus/
keyboard/error handling" sub-scope is NOT owned by this design** (design §7 covers only the
save/unsaved/debounce/failed-save semantics the task card's acceptance lists). Input/focus/
keyboard handling is presentation-mechanics territory and belongs to Q47's client/wire/host
design; recorded here as Q47 input, not silently dropped. R8 (WCAG 2.2 AA accessibility),
R9 (security beyond rich text sanitization), R10 (boundary proof) and R11 are **adjacent
requirements the design names but does not own**: R8/R9/R10 mechanics belong to the
presentation/Q47, Q68 and conformance-harness designs; R11's pipeline details are the media
implementation's (Q58). The design claims only what the task card's acceptance lists — no
accessibility, security or boundary evidence is asserted here.

## 3. Dev workflow-input acceptance

**Status: ACCEPTED (2026-10-05, session 20261005_204610_dde3e1).**

The task card's Verification states: *"Dev accepts workflow INPUT before Q40/Q47 design;
evidence report records that acceptance and unexecuted checks separately."* This section
records the acceptance: **the dev accepted the workflow INPUT produced by this task**
(approved with `/approve-task`, 2026-10-05, Manual Review green).

- The workflow INPUT (design §§2–12: field kinds, state machine, history, revision checks,
  save semantics, preview/authorization needs, DOM/host ownership, lock stance, named
  Q66/Q67 guarantees, search home) **must be accepted by the dev before the Q40/Q47 designs
  consume it** (Q19: final Q40/Q47 designs close together *after* Q54 supplies its workflow
  semantics).
- Acceptance is a dev-gated action, not an agent-assertable one; it is recorded here
  (status → accepted, with session/date) once given — it was given on 2026-10-05
  (see the status line above). The Q40/Q47 designs may now consume this INPUT.
- The ADR (`0004-content-workflow-semantics.md`) is correspondingly **Proposed**, not
  Accepted; it moves to Accepted only via the dev's gate decision (Q54 closure additionally
  requires the workflow/evidence tests of task 2.2 — an ADR alone is not closure, Q19/Q61).

## 4. Unexecuted checks

The following checks were **NOT run in this task**. None is asserted as executed or passing
anywhere in the design, ADR or this report. They belong to **task 2.2** (the workflow/evidence
test deliverable) unless another owner is named:

- **No tests run.** No Vitest test suite, no unit or behavioural tests of any workflow
  transition, revision check, save path or history behaviour was executed.
- **No D1 execution.** No D1 database was created, migrated or queried; no
  `@cloudflare/vitest-pool-workers` run against real D1 occurred.
- **No harness built or run.** No spike harness directory, no checker script, no fixture
  manifests, no lint/typecheck/build invocation of any harness exists.
- **No workflow/evidence tests for the `005` §8 acceptance cases** — e.g. the R2
  draft→review→publish / scheduled-future-publish / post-publish-revision histories, the R3
  stale-revision and concurrent-overwrite rejections, the R4 interrupted/failed-save
  behaviour, the R5 two-host overlay boundary fixtures, the R6 preview-denial cases. All are
  task 2.2's.
- **No implementation exists.** No product code, schema, migration or service was written or
  compiled (docs-first; specification stage).
- **Not verified by execution:** every "acceptance shape" sentence in the design (§6, §7, §9,
  §10) describes intended, testable behaviour — none has been demonstrated by a run in this
  task.

Executed in this task: document reading (the sources in §1), design authoring, ADR authoring
and this report — nothing else. No tool ran tests, migrations or harness commands.

## 5. Task 2.2 — harness execution evidence (observed outputs)

**Harness:** `spikes/q54_content-workflows/` — a standalone non-product fixture harness.
**Location note:** the task card's Files list named
`docs/plans/000_spike-plan/spikes/q54_content-workflows/`; the dev directed the harness to
live at repo-root `spikes/q54_content-workflows/` instead, matching the committed task-1.2
harness convention (`spikes/q38_capability-inventory/`). All other Files honoured.

**TDD:** tests were authored first (RED: 21 failing), then the engine implemented to GREEN.

**Stack (pinned in `package.json`, `pnpm-lock.yaml` committed):** typescript 5.9.2,
drizzle-orm 0.45.3 + drizzle-kit 0.31.11 (D1/SQLite dialect), wrangler 4.147.0,
vitest 3.1.4 + @cloudflare/vitest-pool-workers 0.8.19 (real D1 via Miniflare; 0.8.19's
supported vitest range is 2.0.x–3.1.x — 3.1.4 pinned to stay inside it),
@biomejs/biome 2.1.4, @cloudflare/workers-types 4.20250505.0. Runtime: node v26.8.1,
pnpm 12.6.0.

**Fixture migrations (Drizzle-generated, exact paths):**
- `spikes/q54_content-workflows/migrations/0000_wise_unicorn.sql`
- `spikes/q54_content-workflows/migrations/meta/_journal.json`
- `spikes/q54_content-workflows/migrations/meta/0000_snapshot.json`

Generated with `pnpm --dir spikes/q54_content-workflows generate` (drizzle-kit) from
`src/schema.ts`; applied at test setup via `readD1Migrations` + `applyD1Migrations`
against the local Miniflare D1 binding (`DB` in `wrangler.jsonc`, never deployed).

**Verification commands (from repo root, all exit 0, observed 2026-10-05):**

| Command | Exit | Observed result |
|---|---|---|
| `pnpm --dir spikes/q54_content-workflows install --frozen-lockfile` | 0 | "Lockfile is up to date" |
| `pnpm --dir spikes/q54_content-workflows test` | 0 | `Test Files 1 passed (1)` / `Tests 21 passed (21)` |
| `pnpm --dir spikes/q54_content-workflows typecheck` | 0 | `tsc --noEmit` clean |
| `pnpm --dir spikes/q54_content-workflows lint` | 0 | `biome check .` clean |
| `pnpm --dir spikes/q54_content-workflows build` | 0 | `tsc` clean |

**Behavioural cases asserted against real D1 (persisted-row inspection on success and
rejection):** every field kind round-trips (text/rich_text/media/relation/repeater);
legal transitions draft→review→published (revision 1), review rejection → draft with
feedback, published→scheduled via a revision, scheduled→published at schedule time;
illegal transitions rejected (draft→published review-gate skip, schedule without future
time, publish-in-place, draft revision rows); append-only revision history with a
post-publish revision appending revision 2 while revision 1 stays intact; failed publish
retains pre-attempt state + records an EVENT (not a revision row); stale-base and
concurrent saves rejected server-side (atomic conditional UPDATE, exactly one winner,
newer data preserved, rejection never reported as success); late/failed saves leave the
server record untouched and never claim publish success; preview denied for public role
and expired sessions; media/relation ownership denials.

**Scope limits honoured:** no product migration runner, no media pipeline, no UI, no
external propagation/purge/security claims. Q66/Q67/Q68 guarantees remain named-not-
proven; the fixture migration path is provisional evidence, **not** Q63 closure (task
2.3/2.4 own that).

**Note on vitest-pool-workers version:** 0.22.x prerelease replaced the pool with a new
plugin API; the harness pins the last stable 0.8.x line (0.8.19) paired with vitest 3.1.4 —
inside vpw 0.8.19's officially supported vitest range (2.0.x–3.1.x; the initial 3.2.4 pin
sat outside it and was corrected during review). Per the platform stack's
`@cloudflare/vitest-pool-workers` lock. `wrangler.jsonc`'s compatibility_date was
pinned to 2025-04-17 (the installed Workers runtime's supported date) during review —
the earlier 2025-05-05 date triggered a Miniflare fallback warning.
