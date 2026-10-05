# ADR-0004 — Content workflow semantics (Q54)

- **Status:** Proposed (2026-10-05) — authored at task 2.1 of spike plan 000 phase_002; **not
  accepted**. The workflow/evidence tests of task 2.2 and the dev's acceptance of the
  workflow INPUT (`docs/plans/000_spike-plan/evidence/q54_content-workflows.md` §3, PENDING)
  precede any closure — an ADR alone is not closure (Q19/Q61).
- **Deciders:** semantics settled with the dev (owner) as recorded dev-accepted defaults;
  authored by the task-2.1 design agent. Not yet dev-ratified.
- **References:** design `docs/plans/000_spike-plan/designs/q54_content-workflows.md`;
  evidence `docs/plans/000_spike-plan/evidence/q54_content-workflows.md`;
  `docs/specs/005_content-and-editing.md` §§3, 6, 8 (R1–R11), 10;
  `docs/specs/003_data-and-migrations.md` (locked data stance; Q70 §3);
  `docs/discovery/understanding.md` Q42, Q54, Q58;
  `docs/discovery/understanding-amendments-001.md` (Q70; Q54 amendment in §C);
  `docs/decisions/0001-platform-foundations.md` (D4/D5/D10/D11/D14 ceiling this record).

## Context

Gate Q54 (`docs/specs/000_index.md` §Canonical gate table) is the foundational
content/publishing/editing design spike. The discovery arrow **draft → review → publish →
schedule → revision** describes the capability (Q54) but is not a complete literal state
machine; this record sets the real semantics, presentation-independently. Four semantic
defaults were settled with the dev for this task and are recorded below. Q54's workflow INPUT
feeds the Q40/Q47 designs (which close together only after Q54 supplies it — Q19); this
record selects no implementation and no UI.

## Decision (settled workflow semantics)

1. **Content model — five field kinds, stored types inferred from Drizzle.** A content module
   defines content types whose fields use the kinds **text, rich text, media, relation,
   repeater**: media fields hold a reference resolving through the owning media module (Q58);
   relation fields reference another record; repeater fields hold ordered child field groups
   whose entries ride the record's aggregate root. Field/type definitions live in the
   **module-owned Drizzle schema** (Q37/Q63); **canonical stored types are inferred from that
   schema** — never authored as prose and never duplicated in a parallel type system (Q10).
   Public DTOs are mapped/derived from the inferred stored types. Every record carries a
   prefixed, sortable, URL-safe TEXT id via the core id-service seam (Q11/D5); the record is
   the **aggregate root** (Amendment 001, Q70 §3).

2. **Workflow states: draft, review, published, scheduled — plus append-only revision
   history.** Archived/soft-deleted are lifecycle flags, not workflow states.

3. **Review is a distinct required gate** (dev-settled): draft → review → published; a
   rejected review returns the record to draft. **draft → published without review is
   illegal** and is rejected, never silently coerced.

4. **Legal transitions:** draft→review (submit); review→draft (rejection); review→published
   (approve — creates revision 1 on first publish); published→scheduled (a scheduled edit
   **via a revision**; the current published revision stays live until schedule time);
   scheduled→published (at schedule time); a **derived action — open revision** (a post-publish
   edit creates a new revision in draft state attached to the same record; this is NOT a
   published→draft record-state transition — the published line stays live and published
   content is never edited in place); any live state → archived/soft-deleted (tombstone).
   Revisions of published content pass through the same gates — review remains required.

5. **Illegal transitions:** draft→published without review (review is a required gate);
   creating a scheduled state without a future time; publishing an already-published record
   without a revision; a revision of an unpublished draft creating a revision row — **drafts
   have no revisions; the first publish creates revision 1**.

6. **Immutable history, keyed to the aggregate root.** Revision rows are append-only and
   never mutated or deleted. A **failed publish leaves the record in its pre-attempt state
   and records a failed-attempt EVENT in the history — it does not create a revision row**
   (dev-settled). Failed-publish recovery pairs with Q66's durable-effects guarantees (R2).

7. **Publishing-lifecycle shape on every content record** (Q42's identical pilot-observed
   shape): a **visibility flag**, **soft-delete/tombstone**, and **manual sort_order**.

8. **Server-side optimistic revision checks.** Every save carries a revision number consumed
   by the server-side check (client response ordering is never the mechanism). Stale
   submissions and concurrent overwrites are **rejected server-side without discarding newer
   data and without reporting false success** (R3). These checks and Q70's field-level
   three-way conflict diff (base/mine/theirs, surfaced for resolution, never silent
   last-write-wins) are **complementary, not the same mechanism** — the revision check gates
   connected saves; the field diff resolves offline/reconnect conflicts.

9. **Save semantics.** Deliberate saves plus **debounced autosave after ~1–2 s quiescence —
   never per keystroke** (dev-settled); unsaved/draft state is tracked client-side. An
   interrupted, late or failed save **does not discard the draft** and **never reports a
   successful publish** (R4); acknowledgement is truthful.

10. **Authorized preview.** Draft/preview access is permission-gated (roles +
    module-prefixed scopes per Q50/D11, resource-level checks where required), enforced
    **server-side for API and HTML alike**. Preview **must bypass shared public caches or use
    provably isolated keys** (R6) — the guarantee is **required**; its mechanism and window
    are **Q67's**, not designed here.

11. **DOM entity/field references and host ownership.** The overlay maps editable DOM to
    content entity/field references; **the host retains ownership of its content DOM**; the
    panel mutates only panel-owned surfaces and **notifies the host**, which updates through
    its own integration (R5).

12. **Lock eligibility is decoupled from publish state** (dev decision, Amendment 001 §C Q54
    amendment; Q70 §6): a record **locks once it is shared/remote, regardless of draft/publish
    state**; purely local records never lock. Locks are advisory presence leases, never an
    atomicity claim under Q52. **Offline edits are unlocked-provisional**, conflict-checked on
    reconnect.

13. **Required Q66/Q67 guarantees — named, not invented.** Q54 depends on **Q66** (durable
    publish effects, retries, idempotency — a committed publish cannot be followed by a lost
    cache purge or duplicate effect) and **Q67** (cache isolation, preview caching, public
    propagation, author read-your-writes). No mechanism or time window for either is selected
    by this record.

14. **Search is post-MVP.** Its only recorded future home: search indexes will ride on the
    **published revisions** of content records. No search API, index or UI is designed here.

## Rejected alternatives

- **Treating the discovery arrow as a literal complete state machine** — rejected: it omits
  rejection/return paths, revision-mediated post-publish edits and failed-publish handling;
  the dev-directed execution note forbids interpreting it as complete or selecting a UI from
  it.
- **Making review optional or a stateless flag** — rejected (dev-settled): review is a
  distinct required gate; skipping it would make draft→published legal.
- **In-place mutation of published content / overwriting the live revision** — rejected:
  post-publish edits go through a new revision in draft state, preserving an immutable,
  queryable history (R2).
- **A revision row for a failed publish** — rejected (dev-settled): a failed publish leaves
  the pre-attempt state; only a failed-attempt event is recorded, keeping revision rows
  meaning "publish effects".
- **Revisions (or version numbers) on unpublished drafts** — rejected (dev-settled): drafts
  have no revisions; the first publish creates revision 1.
- **A parallel hand-authored stored-type system next to the Drizzle schema** — rejected
  (Q10/D4): stored types are inferred from module Drizzle schema; duplication drifts.
- **Lock eligibility tied to publish state** — rejected (Amendment 001): eligibility follows
  shared/remote aggregate roots, not draft/publish state.
- **Conflating Q54's optimistic revision checks with Q70's field-level conflict diff** —
  rejected: they are complementary mechanisms (connected-save gate vs offline/reconnect
  per-field resolution).
- **Inventing Q66/Q67 mechanisms or a public-staleness window here** — rejected (Q54/Q66/Q67;
  `005` §7): Q54 names the required guarantees; the owning gates design the mechanisms.

## Non-decisions

This record selects **no** presentation mechanism (dashboard, overlay controller, panel,
public-site starter, htmx/Svelte — all unselected candidates owned by Q40/Q46/Q47), no
notification-mechanism implementation, no package layout, and no Q66/Q67/Q68/Q65 mechanics
(durable effects, cache/preview implementation, sanitization, rate limits, backup/restore).
It reopens no locked decision (Q10/Q11/Q37/Q45/Q50/Q52/Q58; Amendment 001's additive stance).

## Consequences

- Q40/Q47 may design against this workflow INPUT **only after the dev accepts it** (evidence
  §3, PENDING) and after task 2.2's workflow/evidence tests exercise it; Q54 gate closure
  requires both plus this ADR's acceptance.
- The state machine, history and revision-check semantics here are the contract the task-2.2
  tests and later content implementation must satisfy (R1–R4, R6 shapes).
- The Q42 lifecycle shape (visibility/soft-delete/sort_order) becomes the shared baseline
  every content record carries, converging the pilot-audit implication into one semantic.

## Follow-on decisions needed

- **Task 2.2:** the workflow/evidence tests (the `005` §8 acceptance cases for R1–R4/R5/R6
  shapes) — an ADR alone is not closure.
- **Dev acceptance** of the workflow INPUT and this ADR (Proposed → Accepted), then Q54 gate
  closure per the canonical gate table.
- **Q40/Q47:** consume the accepted workflow INPUT; select the presentation mechanisms.
- **Q66/Q67:** design the durable publish-effects and cache/preview/propagation mechanisms
  Q54 depends on.