---
title: Q54 — content workflow semantics (design input)
created_session: "20261005_204610_dde3e1"
sessions: ["20261005_204610_dde3e1"]
approved: false
---

# Q54 — Content workflow semantics (design)

> **Status: proposed design input for gate Q54 — a design input, NOT a closed gate.**
> This is the task 2.1 deliverable (`docs/plans/000_spike-plan/tasks/phase_002/in-progress/task_2.1.md`).
> It proposes the presentation-independent **workflow semantics** for the Yomban.ink built-in
> content capability: content type/field model, publishing state machine, revision history,
> optimistic revision checks, save semantics, preview permissions, DOM/host ownership and the
> Q70 lock interaction. The accompanying ADR is **proposed, not accepted**
> (`docs/decisions/0004-content-workflow-semantics.md`). Nothing here selects a UI,
> presentation mechanism, package layout or implementation — the dashboard/overlay-controller/
> panel choices remain **Q40/Q47's**, and this design's workflow INPUT requires **dev acceptance
> before Q40/Q47 design consumes it** (evidence: `evidence/q54_content-workflows.md`).
>
> **Evidence note:** per plan 000, the workflow/evidence TESTS named by §6.1 of
> `docs/specs/005_content-and-editing.md` are **NOT YET RUN** — no tests, no D1 execution and
> no harness exist yet (they are task 2.2's deliverable). Nothing in this document is claimed
> as executed or passing.

## 1. Scope and authority

Gate Q54 designs the **content/publishing/editing workflow semantics** of the built-in content
capability — an ordinary module set on the platform, never the product identity (Q1/Q39/Q43).
This design is **presentation-independent**: it constrains whichever mechanism Q40/Q47 later
choose and selects none. Grounding:

- **`docs/specs/005_content-and-editing.md`** §6 (what Q54 must design) and §8 (**R1–R11**,
  the testable acceptance) — primary authority for scope and requirements.
- **`docs/discovery/understanding.md`** — Q42 (pilot-audit publishing-lifecycle shape:
  visibility, soft-delete, sort_order), Q54 (content model + workflow, deferred), Q58
  (media module owns records; core R2 infrastructure), Q19 (gate sequencing).
- **`docs/discovery/understanding-amendments-001.md`** — Q70 (record = aggregate root,
  change-sets, presence-lease locks, lock eligibility **decoupled from publish state**,
  offline edits unlocked-provisional, field-level three-way conflict diff) and its
  Q54 amendment bullet (§C).
- **`docs/specs/003_data-and-migrations.md`** — locked data stance: module-owned Drizzle/D1
  schema, **stored types inferred from Drizzle** (never prose-duplicated), prefixed sortable
  TEXT ids via one core id-service seam, unit-of-work = one D1 batch (Q52), record =
  **aggregate root** (Q70 §3), Q70 additive.
- **`docs/specs/004_clients-and-presentation.md`** — Q54's workflow INPUT feeds Q40/Q47 design;
  frontend independence locked.
- Dev-accepted semantic defaults (settled with the dev, recorded here and in ADR-0004):
  (1) review is a distinct required gate; (2) history is append-only revision rows keyed to
  the aggregate root, a failed publish leaves the pre-attempt state with a failed-attempt
  **event**, not a revision row; (3) deliberate saves plus debounced autosave (~1–2 s
  quiescence), every save carries a revision number; (4) Q66/Q67 guarantees are **named as
  required**, never invented here.

The discovery arrow **draft → review → publish → schedule → revision** is a capability
description, not a literal complete state machine; §3 designs the real one. No UI is chosen
from it (task-card execution note).

## 2. Content type/field model

### 2.1 Field kinds

A content module defines content types whose fields use exactly these field kinds (R1; Q54):

| Kind | Shape |
|---|---|
| **text** | A single scalar string value (with the module-declared validation constraints). |
| **rich text** | A structured/untrusted rich content value; must be sanitized/escaped and never introduce executable UI behaviour per R9/Q59/Q68. Sanitization mechanics are Q59/Q68's, named here as a requirement. |
| **media** | A **reference to a media record owned by the media module** (Q58). It does not embed or duplicate media data; it resolves via the owning media module's contracts (signed URLs, transforms, signing are that module's pipeline details, exercised against content field requirements — R11). |
| **relation** | A **reference to another record** (of a declared target content type) — a content-to-content reference field of the shared content/collection engine (Q42). |
| **repeater** | An **ordered group of child field groups**: a repeated sub-structure whose entries each hold the same child field set (built from the other four kinds and/or nested scalar constraints) and whose order is part of the record's content value. Child rows of a repeater are **child rows of the aggregate root** (§2.3) — they inherit the root's workflow/revision/lock state and are never independently versioned or synced (Q70 §3). |

### 2.2 Stored types are inferred from the module Drizzle schema

Field/type **definitions live in the module-owned Drizzle schema** (Q37/Q63: each module owns
its tables and migrations). **Canonical stored types are INFERRED from those Drizzle schema
definitions** — never authored as prose, never duplicated in a parallel type system
(Q10; `003` "Locked decisions"). This design defines **no parallel type system**: the field
kinds above are the *semantic vocabulary* a module's schema expresses; the module's
`sqliteTable` definitions remain the single source of truth, and public DTOs are
mapped/derived from the inferred stored types (Q10/Q47/Q51), not raw rows.

### 2.3 Record = aggregate root

A **content record** is the aggregate root (Amendment 001, Q70 §3): the smallest unit that is
independently locked, versioned, synced and conflicted. Child rows a single logical edit
writes — repeater child groups, revision rows, history events — ride under the root, inherit
its state, and are never independently locked, versioned or synced. Modules declare their
aggregate roots in the manifest (Q35/Q37). Every record carries a **prefixed, sortable,
URL-safe TEXT id** from the core id-service seam (Q11; ADR-0001 D5) — no INTEGER primary keys.

## 3. Workflow state machine

### 3.1 States

- **draft** — the live working state; unpublished, editable.
- **review** — submitted for review; a distinct, required gate between draft and published.
- **published** — live to the public; a published record has revision history.
- **scheduled** — a scheduled future publish exists for the record (reached only via a
  revision of a published record, §3.2).

Plus the **revision history**: append-only revision rows keyed to the record (§4). Archived /
soft-deleted are lifecycle flags (§5), not workflow states.

### 3.2 Legal transitions

| From → To | Condition | Notes |
|---|---|---|
| draft → review | author submits | the required review gate opens (R2). |
| review → draft | **rejection** | reviewer returns the record to draft with review feedback. |
| review → published | reviewer approves | the record becomes live; **this publish creates revision 1** (§4). |
| published → scheduled | scheduled edit **via a revision** | a post-publish edit may set a future scheduled publish; the current published revision remains live until schedule time (R2). |
| scheduled → published | **at schedule time** | the scheduled revision takes effect (R2); behaviour of the scheduling trigger pairs with Q66's durable-effects guarantees (§8). |
| any live state → archived / soft-deleted | author/editor action | tombstone per §5; leaves the workflow, recoverable per §5. |

**Derived action — open revision (not a transition).** A published record is not edited in
place and **published → draft is NOT a record-state transition**: the published line never
leaves the published state. A post-publish edit creates a **new revision row in draft state**
attached to the same record; on that revision's publish, it becomes the live one. The
published line is never silently overwritten.

A post-publish revision passes through the same gates as new content: its draft → review →
published sequence is the same machine — review remains a required gate for revisions of
published content.

### 3.3 Illegal transitions (rejected, never silently coerced)

| Transition | Why illegal |
|---|---|
| draft → published | **Review is a required gate** — a record cannot skip review (dev-settled default 1). |
| creating a scheduled state without a future time | A scheduled state must carry a future schedule time; "scheduled now/never" is not a schedule. |
| publishing an already-published record without a revision | Publishing in place is not an operation; every change to published content goes through a new revision (§3.2, §4). |
| a revision of an unpublished draft creating a revision row | **Drafts have no revisions** — the first publish creates revision 1; a draft is saved, not revised. |

## 4. Immutable history

- Revision rows are **append-only** and keyed to the record (aggregate root). A revision row
  is created when a publish takes effect: the first publish creates **revision 1**; each
  subsequent publish of a post-publish revision appends the next revision. Published revisions
  are never mutated or deleted in place.
- A **failed publish** leaves the record in its **pre-attempt state** and records a
  **failed-attempt EVENT** in the history — it does **not** create a revision row (dev-settled
  default 2). Recovery of a failed publish is exercised with Q66's durable-effects design
  (R2; `005` §7). The history therefore distinguishes: revision rows (publish effects) from
  events (attempted-but-failed transitions and other lifecycle events).
- Because the record is the aggregate root, revisions and history attach to the root;
  repeater children and other child rows ride the root's revision state (Q70 §3).

## 5. Visibility, soft-delete, sort_order

Every content record carries the **publishing-lifecycle shape observed identically across both
pilot audits** (Q42; `005` §9):

- **visibility flag** — an explicit on/off visibility control on the record;
- **soft-delete / tombstone** — deletion tombstones the record (retention + GC behaviour is
  Q70 §8/Q65's, not designed here); soft-delete is available from any live state and is not a
  workflow state (§3.1);
- **manual sort_order** — manual ordering, part of the record's lifecycle shape.

This shape is carried on every content record regardless of module, so consuming modules get
identical lifecycle semantics (the Q42 convergence is the platform-implication input, not a
commitment to ship every audited feature — `005` §9).

## 6. Optimistic revision checks (R3)

- **Every save carries a revision number** (dev-settled default 3); the server holds the
  authoritative current revision for the aggregate root.
- Checks are **server-side** (Q54): client response ordering alone is never the mechanism.
- A **stale submission** (saved against an older revision number than the server's current)
  is **rejected server-side**. A **concurrent overwrite** (two writers racing on the same
  revision base) is likewise rejected — the newer data is **not silently discarded**, and a
  rejection is **never reported as a successful save** (R3).
- Rejection is explicit and surfaced; it does not discard the client's draft (§7).
- **Complementary, not the same mechanism as Q70's conflict diff:** Q54's optimistic revision
  checks are the server-side record-level gate for connected saves; Q70's field-level
  three-way conflict diff (base/mine/theirs, surfaced for resolution, never silent
  last-write-wins) is the local-first conflict mechanism for offline/reconnected edits (R3;
  Amendment 001 Q70 §5). Neither substitutes for the other.

## 7. Save semantics (R4)

- Saves are **deliberate**, plus an **appropriately debounced autosave**: autosave fires after
  ~1–2 s of quiescence and **never per keystroke** (dev-settled default 3).
- **Unsaved/draft state is tracked client-side**: the editing client knows which edits are
  unsaved and which are saved draft state, independently of the server.
- An **interrupted, late or failed save does not discard the draft** and **never reports a
  successful publish** (R4): the client retains its draft state and the failure is surfaced;
  a stale-rejected save (§6) leaves the draft intact for re-resolution.
- Save/publish acknowledgement is truthful — a client never sees "published" unless the
  publish took effect; freshness/read-your-writes behaviour is Q67's (§8).

## 8. Required guarantees named to Q66/Q67 (not designed here)

Q54 **supplies needs and names required guarantees; it does not invent their mechanism or
time window** (Q54/Q67/Q66; `005` §6.4/§7; dev-settled default 4):

- **Q66 — durable publish effects, retries, idempotency.** A committed publish must not be
  followed by a lost cache purge or duplicate effect; Q66 owns durable/external-effect
  recovery. Required by: scheduled→published at schedule time (§3.2), failed-publish recovery
  (§4), R2/R7 acceptance.
- **Q67 — cache isolation, preview, public propagation, read-your-writes.** Drafts and
  authenticated previews must bypass shared public caches or use provably isolated keys;
  author read-your-writes, truthful publish acknowledgement and the tolerated public
  staleness window are Q67's. Required by: authorized preview (§9), R6/R7.
- Freshness limits are **not invented here**: no public-staleness time or global
  synchronous-visibility window is selected (`005` §7).

## 9. Authorized preview (R6)

- Draft/preview access is **permission-gated**: roles + module-prefixed permission-scopes
  (Q50; ADR-0001 D11 — keys `<ModuleNamespace>:<Member>`), with resource-level checks where
  required.
- Enforcement is **server-side for API and HTML presentation alike** (Q51/Q59) — a presentation
  header is never an authorization boundary (Q59).
- Preview **must bypass shared public caches or use provably isolated cache keys/access**
  (R6). The guarantee is **REQUIRED by this design; its mechanism and any window are
  Q67's**, not designed here (§8). Drafts/secrets must never leak into shared or
  browser-history public contexts (Q59/Q67).
- Acceptance shape (R6): unauthorized or session-expired preview access is denied; drafts
  never appear in shared or browser-history public contexts.

## 10. DOM entity/field references and host ownership (R5)

- The editing overlay **maps editable DOM to content entity/field references**: each editable
  surface in a host page corresponds to a record + field (or repeater entry + child field)
  reference in the content model (§2).
- **The host retains ownership of its content DOM** (Q8/Q30/Q47): the panel/overlay mutates
  **only panel-owned surfaces** and **notifies the host**; the host updates its own content
  through its own integration (dev-settled defaults; `005` §5).
- Editing from the overlay never directly mutates host-owned DOM; this boundary is proven by
  both the plain and reactive host fixtures (Q7/Q47 — fixtures are task 2.2's, §Evidence).
- No notification mechanism or panel implementation is selected here — that is Q47's, using
  this workflow INPUT.

## 11. Locks — the Q70 interaction (Amendment 001)

- **Lock eligibility is decoupled from publish state** (dev decision, Amendment 001 §C Q54
  bullet): a record **locks once it is shared/remote, regardless of draft/publish state**. A
  draft that exists on the remote is lock-eligible exactly like a published one; a purely
  local record never locks (Q70 §6).
- Locks are **presence-lease locks** (advisory; Q70 §6): acquire on open, heartbeat, release
  on close, expire after TTL; a lease reduces conflict frequency but is **not** an
  atomicity/correctness claim under Q52.
- **Offline edits are unlocked-provisional**: made without a lease and conflict-checked on
  reconnect (Amendment 001 §D).
- **Q54's optimistic revision checks and Q70's field-level three-way conflict diff are
  complementary, not the same mechanism** (§6): the revision check gates connected saves
  server-side; the field diff resolves offline/reconnect conflicts per-field
  (mine/theirs/both), never silent last-write-wins. Rejected/stale ops go to a visible
  bucket, never silently dropped (Q70 §5).

## 12. Search future home (one line, post-MVP)

**Search is explicitly post-MVP** (Q6/Q54/Q19): when search later lands as a platform
capability, its indexes will ride on the **published revisions** of content records — no
search API, index or UI is designed or committed here.

## 13. What this design does not decide

- No presentation mechanism: dashboard, overlay controller, panel implementation, public-site
  starter, htmx/Svelte — all unselected candidates owned by **Q40/Q46/Q47**, consuming this
  workflow INPUT only after dev acceptance.
- No Q66 mechanism/window (durable effects, retries, idempotency) and no Q67 mechanism/window
  (cache isolation, preview caching, propagation, read-your-writes staleness).
- No sanitization mechanics (Q59/Q68), no rate-limit/bootstrap mechanics (Q68), no
  media pipeline contract details beyond Q58's ownership stance (R11), no backup/restore
  mechanics (Q65), no ID mechanics beyond the locked prefix scheme (Q40 owns UUIDv7-vs-ULID
  etc.).
- **Deferred follow-ons (recorded, not dropped):**
  - Content-record tombstone/GC **retention shape** (how long soft-deleted content records
    persist before hard-delete) is Q70 §8/Q65's — this design only carries the tombstone
    flag itself (§5). Its retention shape surfaces as Q54 input when Q70/Q65 design.
  - **Schedule cancel/edit transitions and a review→scheduled path** are not defined in §3;
    if task 2.2's harness or task 2.3's design needs them, they are defined there with dev
    input — absent here, scheduled→published at schedule time is the only scheduled exit.
  - **Record-level state while a scheduled publish is pending AND a draft revision is
    open** is under-specified: the published line stays live until schedule time (§3.2)
    while the open revision is in draft. Task 2.2/2.3 define the record-level presentation
    of that combination with dev input; this design only fixes that the published line is
    live and the open revision never auto-publishes.
- No workflow/evidence tests: the harness/tests that exercise R1–R4 etc. are **task 2.2's**
  deliverable and are **NOT YET RUN**.

## 14. Harness conformance note (task 2.2)

The task 2.2 harness (`spikes/q54_content-workflows/`, per the dev's location decision —
repo-root `spikes/` convention, matching the committed 1.2 harness) implements **exactly
the semantics specified above** with no amendment: the §3.2/§3.3 transition tables, §4
append-only revision/event history and failed-publish event behaviour, §6 server-side
optimistic revision checks (stale/concurrent rejection preserving newer data), §7 truthful
save/publish acknowledgement, §9 permission-gated preview and the Q58 media/relation
ownership stance all pass as real-D1 behavioural tests (see the evidence report §5). No
design element was changed to make the proofs pass; nothing here selects a presentation
mechanism or invents Q66/Q67 mechanics.
