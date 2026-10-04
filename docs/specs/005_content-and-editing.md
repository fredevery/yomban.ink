# Yomban.ink: content and editing

Status: Locked scope / design-deferred — the content/admin/editing capability is an MVP deliverable; Q54's workflow design remains a foundational gate (canonical gate table in the [spec index](000_index.md#canonical-gate-table)). No presentation implementation is selected.

## 1. Purpose and authority

This spec locks the **scope and semantics** of Yomban.ink's built-in **content
capability** — the content model, publishing workflow, and in-situ editing surface —
and of the deferred design that must precede its implementation (**Q54**). It also
records the exact relationship between three things the discovery often blurs:

- **content as a built-in ordinary module capability** (locked semantics),
- **a functional dashboard + editing experience in the MVP** (deliverable, but
  replaceable/omittable by consumers), and
- **presentation mechanisms** (deliberately **unselected** — candidates only).

This spec is **standalone and authority-bearing at the scope/requirements level**:
it records what is locked, what is deferred, and what is testable. It is **not** an
implementation plan, an ADR, or code. Where this spec and the discovery
`docs/discovery/understanding.md` disagree, understanding.md's Answers govern and this
spec is stale — raise the discrepancy rather than silently choosing either side.

Product references always read **Yomban.ink** (never bare "Yomban").

## 2. Scope map — three distinct layers

| Layer | What it is | Status |
|---|---|---|
| **Content as a capability** | Built-in module set on the platform (content, media, publishing lifecycle), no privileged access | **Locked** (§3) |
| **Functional dashboard/editing MVP** | A working content/admin/editing experience ships in the MVP; consumers may replace or omit its presentation | **Locked deliverable** (§4) |
| **Presentation mechanism** | Dashboard/controller/panel technology; Hono/htmx and plain-TS-controller/htmx-panel are **candidates only** | **Deferred, unselected** (§5) |

## 3. Content is a built-in ordinary module — not the product identity

Locked from Q1/Q43/Q39:

- Yomban.ink is a **modular, composable application platform — not a CMS**. A full
  CMS is an application category a consuming developer can **build on top of** the
  platform by composing modules. "CMS" describes one capability, never the product.
- The content/admin/editing capability is a **built-in module set on equal footing**
  (Q39): no privileged access, custom modules compete on the same manifest/contract.
- The capability scope is **content/admin/editing** (Q1): content types, the
  draft→review→publish→schedule→revision workflow, and in-situ editing.
- **Media ownership (Q58) is settled as a locked neighbour, not reopened here:** a
  media module owns media records; core provides R2 storage infrastructure plus
  upload/transform contracts. Core base schema does **not** own media (Q37). Signed
  URLs, Images transforms and per-module asset ownership remain named pipeline
  contract details for the media implementation, **exercised against content field
  requirements in this spec (Q54)** — they are not a separate open spike and not a
  privileged-module exception.
- The outstanding design for the capability itself is **deferred to Q54** (§6), a
  foundational prerequisite spike, not a blank resumption.

## 4. Functional dashboard/editing MVP — locked deliverable, replaceable presentation

Locked from Q1/Q7:

- The MVP **ships** a deployed, working bundled content dashboard and in-situ editing
  experience. "Optional for consumers" does **not** mean absent from the MVP
  deliverable.
- It is an optional first-party consumer: consuming projects can **replace or omit**
  its presentation **without disabling** non-UI content capabilities. Replacement or
  omission is not a core edit.
- **Frontend independence is locked (Q1/Q8/Q22/Q25/Q46/Q47):** core services, shared
  contracts and headless clients have no direct or transitive presentation
  framework/library dependency, including Hono-HTML/htmx and Svelte/SvelteKit. The
  bundled dashboard is a consumer of the same capability contracts other clients
  use.
- **MVP frontend-independence proof (Q7/Q61):** a plain HTML/server-rendered host
  fixture and a bounded reactive-framework host fixture read/edit the **same** content
  through **unchanged** module services/contracts, exercising authorization,
  validation, CSP, lifecycle/unsaved-state/focus/keyboard/error handling and
  stale-revision conflict checks. Host updates flow through each host's own
  integration. These are **acceptance fixtures, not additional production renderers** (minimal scope defined in [Clients and presentation](004_clients-and-presentation.md) §Acceptance criteria).
- The MVP completion gate (Q7) is a representative pilot-derived scenario running
  from scaffold to deployed with **zero core edits**; a full pilot rebuild is **not**
  an MVP gate (see §9).

## 5. Presentation mechanisms are deliberately unselected

Locked from Q1/Q40/Q46/Q47/Q54:

- **No** public-site starter, dashboard, overlay integration controller, or overlay
  editing panel implementation is selected. Their choice is prerequisite design work
  owned by **Q40** (composition/deployment/packaging) and **Q47** (headless/host/
  presentation interfaces), with Q54 supplying workflow semantics. The public
  exports/topology are provisional until Q40/Q46/Q47 close — and the final Q40/Q47
  designs close **together**, after Q54 supplies its workflow semantics (Q19).
- **Hono-rendered HTML + htmx** (dashboard) and a **plain-TypeScript controller +
  htmx** (editing panel) are **evaluation candidates only** (Q40/Q46/Q47). They are
  **not approved**, can be rejected without dropping any independence requirement,
  and **do not** select the public-site starter. Selecting one requires recorded
  evidence and the dev's explicit decision.
- This spec does **not** assign workflows to a presentation; workflows constrain the
  mechanism that is eventually chosen, they do not choose it. Content services and
  tests are shared so a conditional htmx candidate can prove workflow behaviour
  against **the same content services/tests** without thereby adopting its UI library
  (Q54).
- Overlay responsibility split (Q8/Q30/Q47): the **host retains ownership of its
  content DOM**. Panel-driven DOM mutations are confined to panel-owned surfaces; the
  host updates its own content through documented notifications. htmx (if adopted)
  must not take control of unrelated host markup, alter an existing host htmx
  configuration, or require the public page to adopt htmx.
- Dashboard/overlay-specific performance targets are set in **Q40/Q47 using Q54
  workflow input** before implementation (Q62 leaves the public LCP/INP budgets
  unchanged); this spec does not invent dashboard budgets.

## 6. Q54 — foundational content/publishing/editing gate

**Status: DEFERRED from onboarding; foundational prerequisite spike (Q19/Q54).**

### 6.1 What Q54 must design (intended outcome)

One ADR plus a concrete design **and** workflow/evidence tests (an ADR alone is not
closure, Q19/Q61). Covers:

- **Content type/field definitions:** a module defines content types/fields using
  field kinds **text, rich text, media, relation, repeater** (Q54). Field/type
  definition lives in module schema per the module-owned schema rule (Q37/Q63), with
  stored types inferred from Drizzle (Q10/Q51).
- **Publishing workflow states:** **draft → review → publish → schedule → revision**
  (Q54), including publishing-lifecycle semantics shared by modules (visibility,
  soft-delete, sort_order — the identical shape observed across both pilots, Q42).
- **Optimistic concurrency / revision checks:** server-side revision/concurrency
  checks, **not** client response ordering alone, reject stale submissions and
  concurrent overwrites (Q54; Q7/Q47/Q61 acceptance evidence).
- **Preview permissions:** permission-gated edit affordances and preview access; the
  permission model is roles + module-prefixed scopes (Q50), resource-level checks
  where required, enforced server-side for API and optional HTML presentation alike
  (Q51/Q59).
- **DOM-to-entity/field host integration:** mapping editable DOM to content
  entity/field references while preserving **host-owned DOM** (Q8/Q30/Q54).
- **Draft/unsaved state, deliberate or appropriately debounced saves, and
  lifecycle/input/focus/keyboard/error handling.**
- **Local-first lock/conflict interaction (Q70):** lock eligibility is **decoupled
  from publish state** — a record locks once it is shared/remote, regardless of
  draft/publish state; offline edits are unlocked-provisional and conflicts surface as
  a three-way field diff (mine/theirs/both), never silent last-write-wins. Q54's
  optimistic revision checks (above) and Q70's field-level conflict detection are
  complementary, not the same mechanism. [Q54, Q70]

### 6.2 Owner and closure

- **Owner, evidence and block: canonical gate table in the [spec index](000_index.md#canonical-gate-table)**
  (spike plan 000). Closure = one ADR + concrete design + workflow/evidence tests satisfying the
  testable acceptance in §8, with Q67 (§7) supplying the publishing-freshness/preview-cache
  guarantees it needs. [Q19, Q54]

### 6.3 What Q54 blocks

Q54 is a **foundational gate**: it blocks **built-in content/workflow implementation, in-situ
editing, and pilot content requirements** — work whose own gate is met may proceed; this is not a
blanket pre-implementation block (Q19). See the canonical gate table for the full block list.

### 6.4 What feeds and depends on Q54

- **Feeds:** the Q42 pilot audit's shared content/collection-engine and
  publishing-lifecycle implications (§9); media field requirements from Q58.
- **Dependencies:** Q54 supplies publishing/draft/review/schedule/preview **needs**
  to Q67, which owns the actual cache/preview guarantees (§7); final Q40/Q47 close
  **after** Q54's workflow semantics land (Q19). Q54 does **not** invent the
  Q67/Q66 guarantees itself.
- **Public headless content API:** any headless public content API flowing through
  Q51 contracts needs explicit DTO/access design rather than being "free"; rich-text
  sanitization and untrusted-content handling follow Q59/Q68 (drafts/secrets must not
  leak into shared or browser-history caches — Q59/Q67).

## 7. Q67 — affected-work gate the editing/preview work depends on

**Status: DEFERRED; affected-work gate, not a blanket pre-implementation gate (Q67). Owner, required outcome and block: canonical gate table in the [spec index](000_index.md#canonical-gate-table)** — coordinated with **Q54** (which supplies draft/publish/schedule/preview needs), **Q57** (the core typed cache capability with purge hooks — locked) and **Q66** (durable/reliable effect and retry handling). [Q67]

Editing/preview-specific consequences this spec owns:

- **Drafts and authenticated previews** must bypass shared public caches or use **provably
  isolated** cache keys/access; private/no-store responses and presentation-library history
  snapshots must not expose drafts/secrets between users or preview/public contexts. HTTP cache
  directives alone are not a policy for JavaScript history caches.
- **Freshness limits are not invented here:** no concrete public-staleness time or global
  synchronous visibility is selected; a stale KV version pointer is **not** assumed to solve
  freshness (Q57/Q67).
- **Q66 (adjacent affected-work gate)** owns durable publish/invalidation effects,
  retries and idempotency so a committed publish cannot be followed by a lost cache
  purge or duplicate effect; it also must close before affected writing/publishing
  and MVP deployment.
- **Q65 (restore/retention)** governs backup/recovery of D1 records plus referenced
  content/media objects; application object revisions alone are not a recoverable
  backup (Q60/Q65).

## 8. Requirements and testable acceptance (content editing scope)

The following record **what a working content/admin/editing MVP must demonstrably
do**. They are requirement/acceptance statements, **not** implementation plans; each
is testable and each item that concerns cache/preview/consistency is gated by §7.

- **R1 — Content model.** A built-in content module supports module-defined content
  types with field kinds **text, rich text, media, relation, repeater**.
  *Acceptance:* create a content type exercising every field kind; persist, read back,
  and display values; media/relation fields resolve through their owning module
  (media per Q58).
- **R2 — Workflow.** Records traverse **draft → review → publish → schedule →
  revision**; scheduled publishes and revisions behave as defined by Q54's design.
  *Acceptance:* a draft → review → publish sequence, a scheduled future publish, and a
  post-publish revision each produce a coherent, queryable history. Recovery of a
  failed publish is exercised (paired with Q66).
- **R3 — Concurrency.** Edits use optimistic server-side revision/concurrency checks.
  *Acceptance:* a stale revision submission and a concurrent overwrite are **rejected
  without silently discarding** newer data or reporting a false successful save
  (Q54; Q7/Q47/Q61 acceptance evidence). Offline/local-first conflict uses Q70's
  field-level three-way diff and surfaces for resolution rather than rejecting
  wholesale.
- **R4 — Save semantics.** Saves are deliberate or appropriately debounced, never
  fire on every keystroke, and preserve draft/unsaved state. *Acceptance:* an
  interrupted/late/failed save does **not** discard the draft and does **not** report
  a successful publish (Q54).
- **R5 — In-situ editing & host ownership.** The overlay maps DOM → content
  entity/field; the **host retains ownership of its content DOM**; the panel confines
  its mutations to panel-owned surfaces and notifies the host, which updates through
  its own integration. *Acceptance:* editing from the overlay never directly mutates
  host-owned DOM; host integration boundary proven by both plain and reactive fixtures
  (Q7/Q47).
- **R6 — Preview & authorization.** Draft/preview is permission-gated and bypasses
  shared public caches or uses provably isolated keys/access. *Acceptance:*
  unauthorized/session-expired preview access is denied; drafts never appear in shared
  or browser-history public contexts. **Gated by Q67.**
- **R7 — Read-your-writes / public propagation.** Author read-your-writes, published
  acknowledgement, and the tolerated public staleness window behave per Q67's design.
  *Acceptance:* author sees own edits, publish acknowledgement is truthful, and public
  staleness stays within the defined window. **Gated by Q67/Q66.**
- **R8 — Accessibility.** Bundled admin/editing and rendered public content meet
  **WCAG 2.2 AA** (Q62); edits/swaps preserve keyboard/focus/announcements/input state.
  *Acceptance:* keyboard-only editing and announced status changes pass the defined
  checks; library defaults do not substitute for proof (Q62).
- **R9 — Security.** Every API/fragment/mutation path enforces server-side
  authorization and applicable CSRF/origin rules (Q50/Q59/Q68); rich-text content is
  sanitized/escaped and never introduces executable UI behaviour; CSP is not weakened
  for a presentation library (Q59). *Acceptance:* denied undeclared surfaces,
  forbidden origins/CSRF, unauthorized mutations, and sanitized untrusted content
  cases. Rate limiting, first-admin bootstrap and profile enforcement are **Q68**.
- **R10 — Frontend independence preservation.** Content services, shared contracts and
  headless clients carry no presentation dependency. *Acceptance:* the two-host fixture
  proof of §4 passes and boundary lint (Q61) reports no core/headless → presentation
  dependency, including htmx/Svelte.
- **R11 — Media in content.** Content media/relation fields are exercised against the
  media module (Q58) — upload, referencing, and transform/signing contract details as
  designed. *Acceptance:* content referencing media renders and validates per Q58's
  pipeline contracts (backup/restore coverage via Q65).

## 9. Candidate pilot scope — not every audited module

Locked from Q42/Q33/Q7:

- The **Q42 pilot audit is complete** and is the evidence/input for core and content
  spikes — **not** a pending audit and **not** a commitment to ship every listed
  feature. It yields **candidates only**.
- Both pilots are CMS-backed (Q42) and converge on a shared **content/collection
  engine** (draft/publish lifecycle, reference fields) and identical
  **publishing-lifecycle mixins** (visibility, soft-delete, sort_order); this
  convergence is the platform-implication input to content design, not proof of the
  htmx library or of a chosen module set.
- Audited modules are two tiers (**Kasteel-website** candidates: menu, coffee-blends,
  news, hours, content/site_text, site-config, reviews, gallery; **FreeAgents**
  candidates: media-library, feed, studio-profiles, taxonomy, press, site-identity),
  plus custom per-project candidates and shared platform-tier implications (content/
  collection engine, media/R2/Images, KV versioned-cache + write-invalidation, SSR
  shell/chrome, SEO/OpenGraph, registry + build-time wiring, job orchestration, data
  export/backup).
- The **MVP plan selects a representative pilot-derived proving module set** under
  Q7's zero-core-edit scaffold-to-deployment gate — it does **not** commit to every
  candidate. **Full pilot rebuilds follow MVP** (Q7/Q33). Content-bearing modules'
  requirements are exercised through the content capability (§8), not as bespoke
  per-project CMS logic.

## 10. Search is post-MVP

- **Search is explicitly post-MVP** (Q6/Q54/Q19). It is **not** added to MVP scope and
  does **not** block content/workflow implementation, editing, or MVP deployment.
- Q54 records the decision about **where search later lives** as a home on the
  platform (a future built-in module/capability) without designing or committing it
  now. No search API, index, or UI appears in §8's MVP acceptance.

## 11. Adjacent specs

Numbered sibling specs and entry point:

- [Specification index](000_index.md) — navigation and gate map
- [Product and MVP](001_product-and-mvp.md) — product identity, platform-vs-CMS (Q1/Q43), MVP definition and zero-core-edit gate (Q7)
- [Module platform contract](002_module-platform-contract.md) — module manifest/registry, ordinary built-ins (Q39), interactions (Q41)
- [Data and migrations](003_data-and-migrations.md) — schema/migrations, D1/Drizzle, media ownership, client datastore/sync (Q37/Q45/Q58/Q63/Q70)
- [Clients and presentation](004_clients-and-presentation.md) — frontend independence, wire/host/presentation interfaces (Q46/Q47/Q51)
- **This specification** — content capability, editing and gates (Q54)
- [CLI and distribution](006_cli-and-distribution.md) — CLI commands (Q44), install/upgrade (Q40/Q48/Q49/Q64)
- [Security and identity](007_security-and-identity.md) — auth, permissions, security defaults, first-admin/rate limits (Q50/Q59/Q68)
- [Operations and quality](008_operations-and-quality.md) — delivery, backup/restore, durable effects, cache consistency and quality (Q55–Q57, Q60–Q62, Q65–Q67)

Authoritative source of the locked decisions here: `docs/discovery/understanding.md`
(Q1, Q7, Q19, Q39, Q42, Q43, Q47, Q54, Q57, Q58, Q66, Q67, Q70 and adjacents);
amendment record: `docs/discovery/understanding-amendments-001.md`.