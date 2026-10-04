Independent Pre‑Implementation Review — Yomban.ink specification set

Review scope: every document under docs/specs/ (000–008, read in full), the authoritative discovery record docs/discovery/understanding.md, the three folded reviews, and the two prompt files. No files were modified. External technical claims were grounded against Cloudflare and Better Auth documentation.



## 1. Assessment: implementation readiness

Verdict: PASS-with-findings. The spec set is internally consistent, well-sourced, and technically grounded — but it is a decision/scope register, not a buildable system yet.

Readiness is effectively zero for implementation, by design. Every foundational decision — Q38 (core capability inventory), Q40 (packaging/composition/deployment/install/lifecycle), Q46 (public-site starter), Q47 (framework-free client/wire/host interfaces), Q54 (content/publishing/editing workflow), Q63 (migration mechanics) — plus the affected-work gates Q65–Q68, is deferred to a single artifact, "spike plan 000," which does not exist (008_operations-and-quality.md:18, and every gate section). No docs/plans/, no decision/ADR store, no backlog, no AGENTS.md exists in the repo. So the honest headline is: the specifications correctly describe what the platform is and what remains undecided, and the immediate next deliverable is spike plan 000 — nothing here is implementable until it is authored and its gates close.

The most important risks are not contradictions in the writing (there are almost none) but:

1. The MVP's client-facing deliverables are under-specified relative to the gates that are supposed to decide them (§3, YB-M1).
2. A mandatory MVP acceptance fixture rests on an undefined term ("bounded"), so a core gate is not verifiable (§3, YB-M1b).
3. Two load-bearing conventions (module-owned enum aggregation; permission-key prefixing) have no defined collision semantics (§3, YB-S1).

Strengths worth recording so they are not re-litigated: naming is clean (no stray bare "Yomban" in specs), all relative links resolve, every cited Q-number is in range (Q1–Q69), the "current + N‑1" contract rule is stated identically in 002 and 006, SvelteKit is consistently marked superseded (never a current default), and every load-bearing external technical claim I checked is accurate (see §8).

## 2. Coverage inventory

Read in full:
- docs/specs/000_index.md (44 lines)
- docs/specs/001_product-and-mvp.md (61)
- docs/specs/002_module-platform-contract.md (124)
- docs/specs/003_data-and-migrations.md (104)
- docs/specs/004_clients-and-presentation.md (83)
- docs/specs/005_content-and-editing.md (303)
- docs/specs/006_cli-and-distribution.md (84)
- docs/specs/007_security-and-identity.md (123)
- docs/specs/008_operations-and-quality.md (91)
- docs/discovery/understanding.md (527) — authoritative source
- docs/discovery/folded-reviews/review-01-gpt-6-astra.md, review-02-gpt-6.1-sol-pro.md, review-03-gpt-6.1-sol.md
- docs/prompts/review-prompt-3.md (90)

Not read / not applicable:
- docs/prompts/spec-review-prompt.md — 0 bytes (empty committed file). Flagged as YB-D2.
- docs/discovery/highlevel-overview-diagram.svg / .png — conceptual evidence only; not rendered/inspected. All specs explicitly demote it to non-normative (002:30).
- .vscode/settings.json — not a spec.

Context documents the task assumed, which do not exist: no AGENTS.md, no CLAUDE.md, no docs/decisions/, no docs/backlog/, no docs/reviews/, no docs/plans/. This is a coverage limitation (I could not run the skill's "spec vs questionnaire vs backlog" scope-leak trace because there is no backlog), and it is also the substance of the readiness assessment.

No unreadable spec material. One empty prompt file.

Status of material (per the task's "approved vs proposal vs example vs superseded"):
- Approved/locked: the decisions marked locked in each spec, traceable to Answer lines in understanding.md.
- Superseded (retained as history): the former SvelteKit public-site starter (004:16, 006:63).
- Proposals / candidates (not approvals): Hono-HTML+htmx dashboard and plain-TS controller + htmx panel (004:17, 005:94), D1 transactional outbox (008:59), event bus (002:111).
- Historical defaults (non-authoritative): understanding.md "Agent default" lines — explicitly subordinated to Answers (understanding.md:41-42).

## 3. Confirmed findings

**YB-M1** — MVP client deliverables are under-specified relative to the gates that decide them (Must, gap)
Category: gap. Confidence: high.

Evidence:
- 001_product-and-mvp.md:14 — "The MVP includes a functional bundled content dashboard and in-situ editing experience, but no public-site starter, dashboard, overlay-controller or panel implementation has been selected."
- 001_product-and-mvp.md:20 — MVP must ship "a working bundled content/admin/editing experience"; :28 — "Authorized content edits and publication appear through the consuming client."
- 004_clients-and-presentation.md:40 and 006_cli-and-distribution.md:63 — Q46 "Blocks starter scaffolding and MVP public-client implementation."
- 004:65 and 008:43 — "the public reference frontend" carries the LCP/INP budgets, implying a public frontend is in MVP.
- 006:14 — the public/admin dev server runs "only when that presentation topology needs one," implying it may be optional.

What is wrong: three documents imply an MVP public client exists and is gated by Q46, one implies the presentation dev server is optional, and 001 never states unambiguously whether the MVP's "deployed client" is the bundled dashboard, a real public frontend (requiring a Q46 starter selection), or the two acceptance fixtures. The same 001:14 bullet reads self-contradictory on first pass ("MVP includes a bundled dashboard" vs "no dashboard … selected") because 001 does not carry the deliverable-vs-implementation distinction that 004:13/005:34 do.

Practical consequence: the single MVP completion gate ("authorized edits reflected in the deployed client") cannot be scoped or verified; the MVP plan cannot decide whether Q46 is on its critical path.

Recommended change: one sentence in 001 (MVP requirements) pinning the answer to the decision below, and one clarifying clause at 001:14 ("the dashboard role is a locked deliverable; its implementation is unselected"). Smallest resolution.

Decision needed: is a selected public-site starter / consumer frontend part of MVP acceptance, or do the two host fixtures plus the bundled dashboard satisfy "the deployed client"? (This is the single highest-leverage decision in the set.) 

**Answer**: 
a public-site start is indeed part of the MVP. So the frontends that we will need for MVP are:
1. The admin dashboard
2. The public-site (web)
3. The public-site with in-situ editing + admin overlay

**End of answer**

**YB-M1b** — The mandatory "bounded reactive-framework host fixture" is undefined (Must, gap)
Category: gap. Confidence: high.

Evidence: the term is a required MVP acceptance artifact in 001:22, 002:105, 004:54, 004:59, and 005:75; "bounded" appears nowhere with a definition, in the specs or in understanding.md (Q7/Q42/Q61 context).

What is wrong: the frontend-independence proof is a hard MVP gate, but the fixture's scope is unspecified — how many screens, whether it uses routing/SSR, how much framework surface it may exercise, and what "bounded" bounds. An implementer must invent the acceptance test.

Practical consequence: a core MVP gate is not verifiable, and two implementers would build different fixtures, so the gate is non-repeatable.

Recommended change: define the fixture minimally in 004 (Acceptance criteria), e.g. "a single reactive-framework page that lists and edits one content entity through shared contracts only — no routing, SSR, or framework server actions." Alternatively assign the definition explicitly to Q47 and say so in 004.

Decision needed: does Q47 (or Q46) own the fixture definition, and what is its minimal scope?

**YB-S1** — Module-owned enum aggregation and permission-key prefixing have no collision semantics (Should, gap)
Category: gap. Confidence: high.

Evidence: 007:22 — "Enums are module-owned, aggregated platform-wide, PascalCase Key = 'Key'; this convention underpins the permission-key scheme." 007:34 and 002:47 — permission keys are "enum-defined, module-prefixed." 008:14 repeats the convention. 002:60 says conformance "validate[s] … names/prefixes," but no grammar for the permission-key prefix and no rule for cross-module key collisions are given. 007:20/003:28 assign only ID prefix collision/registration to Q40; permission-key collisions are assigned to nobody.

What is wrong: with shared enum member names (Key = 'Key', e.g. Read, Manage) across optional, removable modules, "aggregated platform-wide" is undefined and collisions are unhandled. This is precisely the class of ambiguity the project's enums convention exists to prevent.

Practical consequence: RBAC role→permission-set resolution and the Q61 conformance check ("names/prefixes") cannot be implemented deterministically; a module removal could orphan or collide permission keys.

Recommended change: pin the prefix grammar (e.g. Media:Read, Media:Manage) and a collision-ownership rule, and name the owner (Q50 vocabulary + Q38/Q61 enforcement). One or two sentences in 007 §Permissions, cross-referenced from 002:47.

Decision needed: adopt a concrete prefix grammar now, or assign it explicitly to Q50/Q61 with an owner named in 007.

YB-S2 — Privacy / personal-data handling is unowned (Should, gap)
Category: gap. Confidence: medium.

Evidence: 007 covers security (CSP, CSRF, auth, rate limiting) exhaustively; 008 Q65 covers retention/backup of records and objects — but neither covers lawful basis, consent, erasure/right-to-be-forgotten, or PII in logs/traces/diagnostics, despite the platform shipping user auth, public forms (Turnstile), and uploads, and despite the owner/pilots being South African (POPIA-relevant).

What is wrong: no spec states whether personal-data handling is a platform responsibility or a per-consuming-project responsibility.

Practical consequence: consuming projects get safe security defaults but no default data-protection posture; personal data may flow into observability sinks (008:23) with no redaction policy (which 008:23 itself defers as "implementation design").

Recommended change: one sentence in 007 (or 008) stating the scope decision — platform-level guardrails (e.g. log redaction) vs explicitly per-project — and, if platform-level, add erasure/retention to Q65's coverage.

Decision needed: is privacy platform-level or per-project?

YB-S3 — The gate inventory is duplicated near-verbatim across six specs (Should, improvement)
Category: improvement. Confidence: high.

Evidence: near-identical Q38/Q40/Q46/Q47/Q54/Q63/Q65–Q68 deferral text appears in 001:35-44, 002:66-97, 003:41-67, 005:113-197, 006:59-64, 007:55-72, 008:45-73. The frontend-independence invariant sentence is restated in 001:12, 002:18, 004:11, 007:30, 008:14.

What is wrong: six copies of the same gate definitions create drift risk with no single source to reconcile against (000:22 designates authority per gate, but not a canonical table).

Practical consequence: any future gate change must be edited in six places; a partial edit silently produces incoherence — the exact failure the user's own review skill warns about.

Recommended change: smallest version — add one canonical gate table to 000_index.md (owner/deliverable/block) and have the focused specs cite it rather than restate. Do not strip the specs' locked-decision bullets (those are load-bearing); dedupe only the repeated gate boilerplate. This can be Defer if the user prefers robustness over length, but it is the highest-value simplification available.

YB-D1 — No canonical home exists for invariants the specs assume (Defer, process)
Evidence: understanding.md Q22 states the non-negotiables "land in AGENTS.md"; 008:19 references docs/reviews/; every gate references spike plan 000. None exist. This is acknowledged as "planned, not yet authored" (008:18) and is the readiness topic of §1 — recorded here so it is not lost. Recommend creating AGENTS.md (invariants) and the spike plan before any implementation task.

YB-D2 — Empty committed file (Defer, housekeeping)
docs/prompts/spec-review-prompt.md is 0 bytes. Either populate or remove so the prompts directory does not mislead a future session.

YB-D3 — 005 diverges from the house doc format (Defer, cosmetic — noted only)
005 alone carries YAML frontmatter (title/status/date/source-discovery, 005:1-6), a distinct title convention ("005 — Content and editing"), and numbered §1–§11 with R1–R11. The other eight specs use "# Yomban.ink: <domain>" + a one-line Status. This does not impair understanding but is the only structural inconsistency in the set. Not worth a dedicated pass; align opportunistically.

## 4. Questions / hypotheses (not confirmed defects)

- Q-A: Does "aggregated platform-wide" (YB-S1) imply a central enum/permission registry, or aggregate-by-manifest at build? The text permits both; the answer decides the conformance implementation. — **RESOLVED (see §9): aggregate-by-manifest at build, emitting a derived artifact; no central registry. Pairs with D3.**
- Q-B: Does the MVP require any public-facing production frontend at all (YB-M1)? If yes, Q46 moves onto the MVP critical path ahead of Q40/Q47 finalization, contradicting the "close together after Q54" sequencing (000:25) — worth confirming the order. — **RESOLVED (see §9, D1): yes on both counts; the 000:25 sequencing text must be reconciled.**
- Q-C: Is 004:65's "public reference frontend" the same artifact as the Q46 starter, or a distinct reference client? The two readings change the MVP scope. — **RESOLVED (see §9, D1): same artifact — the Q46-selected starter carries the budgets; no distinct reference client (001:15 bars multiple production renderers).**

## 5. Opportunities (separate from requirements)

- OPP-1 — Headless content delivery as a named first-class output. Already half-present (005:163-166 "any headless public content API … needs explicit DTO/access design"). Benefit: mobile/external consumers and the deferred apps/mobile direction get a typed public surface "for free." Effort: small-to-medium (folds into Q47/Q51). Belongs: further discovery; not MVP-blocking.
- OPP-2 — Conformance score / module-authoring lint report. 008:24/Q61 already flags "a conformance score remains a later opportunity." Belongs: post-MVP.
- OPP-3 — OpenTelemetry alignment. 008:23 flags it as an opportunity, not an MVP constraint. Belongs: post-MVP.

I am deliberately not proposing feature additions beyond these; the spec set is already scope-heavy and the user's stated discipline is smallest-change.



##  6. Prioritized resolution order (with dependencies)

1. Author spike plan 000, Q38 first (000:24) — unblocks everything; do before any implementation task. No dependencies.
2. Decide YB-M1 (public-client scope) — feeds YB-M1b and the panel ordering. Needs Q46/Q54 input.
3. Define YB-M1b (fixture) — inside Q47 (or Q46), after YB-M1.
4. Resolve YB-S1 (permission-key/enum prefix grammar) — inside Q50/Q38, referenced by Q61. Independent of 1–3.
5. Decide YB-S2 (privacy scope) — independent; can be a one-line spec addition.
6. YB-S3 (gate-table dedup) — after the above, so the canonical table reflects the resolved decisions.
7. Housekeeping YB-D1/D2/D3 — anytime.

## 7. Decisions requiring your input

- D1 (YB-M1): Is a selected public-site starter / consumer frontend part of MVP acceptance, or do the bundled dashboard + two fixtures satisfy "the deployed client"? (Highest leverage.) — **RESOLVED (see §9): yes, MVP includes a selected public-site starter; starter + dashboard + two fixtures. Q46 moves onto the critical path.**
- D2 (YB-M1b): Does Q47 own the "bounded reactive-framework host fixture" definition, and what is its minimal scope? — **RESOLVED (see §9): Q47 owns it; Q61 executes; Q7 gates.**
- D3 (YB-S1): Adopt a concrete permission-key prefix grammar + collision rule now, or assign it to Q50/Q61 with that ownership named? — **RESOLVED (see §9): adopt the grammar now; Q50 owns semantics, Q61 enforces, Q40 owns namespace registration.**
- D4 (YB-S2): Is personal-data/privacy handling platform-level or explicitly per-project? — **RESOLVED (see §9): split it — platform-guardrailed (redaction/classification/erasure primitives + safe defaults), per-project-policied (lawful basis/consent/DSR).**
- D5: Confirm spike plan 000 as the immediate next deliverable and its location (e.g. docs/plans/000_...). — **RESOLVED (see §9): re-sequenced — Orca `/onboard-existing` first, then plan 000 via `/new-plan` at docs/plans/000_....**

## 8. Verification performed and remaining limitations

Verified against authoritative sources (via direct curl of the docs .md endpoints, because web_search/web_extract are disabled — backend firecrawl is off):
- D1 batch is a SQL transaction that "aborts or rolls back the entire sequence" — matches 003:17,83. VERIFIED.
- R2 GetBucketVersioning/PutBucketVersioning marked "Feature Not Implemented" — matches 008:27,52. VERIFIED.
- Cache API contents "do not replicate outside … the originating data center" and cache.delete "only purges … in the data center that the Worker was invoked" — matches 002:64, 008:25. VERIFIED.
- KV is "eventually-consistent," same-location visibility "not guaranteed," others "up to 60 seconds or more" — matches 005:187, 008:25. VERIFIED.
- Workers "do not allow I/O from outside a request context" and warn global-scope binding-derived clients can retain stale secrets — matches 007:42, 002:79. VERIFIED.
- Better Auth exposes advanced.database.generateId (custom ID generation) — the prefixed-TEXT-ID policy is plausible; matches 007:21. VERIFIED as plausible.
- Better Auth default rate-limit storage is in-memory, "not suitable … particularly in serverless environments" — matches 007:68. VERIFIED.

Internal checks run: all spec-relative links resolve; all cited Q-numbers ∈ [1,69]; no bare "Yomban" violations (the single hit at 005:28 is the naming rule itself); "current + N‑1" identical in 002:21 and 006:28; SvelteKit never presented as a current default; no scope leak found (no spec promotes a deferred/backlog item into MVP — noting no backlog exists to compare against).

Remaining limitations:
- No code exists in the repo, so no behavioral/interfaces claim could be validated by execution; all "planned" commands and seams are unverified by construction.
- Better Auth compatibility with prefixed TEXT ids for the specific core auth entities/auth flows under the selected Drizzle/D1 adapter was not independently verified — the specs correctly treat this as required Q63 evidence, so it is an open gate, not a defect.
- The high-level overview diagram was not rendered/inspected (demoted to non-normative by 002:30).
- Breadth-style web fact-checking was not possible (search backend disabled); verification was targeted at the specific load-bearing claims above.
- I did not cross-check the specs against a backlog or decision log because neither exists; YB-S3/§1 partly compensate by treating the index as the de-facto inventory.

Final cross-document consistency pass: completed against the current on-disk text; every finding above cites the current line content, and the two cross-document tensions (MVP public-client scope; fixture definition) are cited on both sides rather than resolved silently.



## 9. Recorded resolutions (inputs for the spec fold)

Developer answers to the §7 decisions, recorded here so the follow-up fold has a fixed source. Findings above are unchanged; this section only resolves the open inputs.

### D2 (YB-M1b) — fixture ownership and minimal scope

Decided 2026-10-04.

**Owner: Q47 owns the fixture definition.**
- 004:42 already assigns Q47 "one ADR plus exact headless/host/presentation interfaces and executable boundary proof"; the fixture is that proof. 000:25 and 005:88–93 assign Q47 the framework-free client/wire/host/presentation mechanics and the explicit host integration choice — precisely the seam the fixture exercises.
- Q61 consumes the definition to run it in the CLI/build/CI conformance harness (004:60; understanding.md:480–484) — it executes, it does not author.
- Q7 is the MVP gate the fixture discharges ("same content through unchanged services/contracts", 001:22).
- Q46 is **not** the owner. It is the separate reopened public-site starter with its own "bounded support commitment" (004:40). The fixtures are explicitly "acceptance fixtures, not additional production renderers" (001:22, 002:105, 004:57) and "no candidate is adopted by implication" (004:71). Assigning the fixture to Q46 would make the acceptance proof a de-facto starter selection — the drift the spec guards against.

**Minimal scope (for Q47 to record in 004 §Acceptance criteria):**
- **Surface:** a single page — list the content entities and edit one entity (list + single-entity edit). No multi-step workflow; "publish" is one action invoked through the contract.
- **Content:** one entity type drawn from the pilot-derived proving set; the plain HTML/server-rendered fixture reads/edits/publishes the *same* content.
- **Interfaces:** interactions only through the framework-free shared contracts (typed browser-safe client + documented host notifications). No in-process service calls, no server-only/private-field access, no raw DB rows.
- **Excluded framework surface:** no routing, no SSR/server actions, no framework data-loading conventions, no framework server runtime. Client-side rendering of the single page is permitted; anything beyond it is out of bounds.
- **Host seam:** host owns its DOM; updates arrive via host-owned swaps; no foreign DOM replacement; host config never hijacked (004:55).
- **Mandatory checks exercised** (004:54, 005:74–79): authorization incl. unauthorized/expired session; input validation on invalid data; CSP-compatible operation; keyboard/focus/announcement/input-state preservation across swaps; stale-revision save conflict; unsaved-state/lifecycle preservation.
- **Status:** fixture only — not shipped, not a production renderer; the reactive framework used is illustrative and adopts neither the public starter nor any dashboard/controller/panel implementation.
- **Bounding rule:** the fixture may use only enough framework surface to render that single page reactively. Both fixtures must differ *only* in presentation mechanism, never in capability coverage — otherwise the proof is not comparing like with like.

**Fold target:** one definition bullet under 004 §Acceptance criteria, cross-referenced from 001:22, 002:105, 004:54/59, 005:75, with the ownership clause "defined by Q47; executed by Q61; gated by Q7."

### D3 (YB-S1) — permission-key prefix grammar (adopted now)

Decided 2026-10-04. **Resolution: adopt the concrete grammar now** (the review's option 1) — do not leave the grammar itself to Q50 as an open "implementation detail."

Rationale: it is a closed-form naming convention, not an implementation; two already-locked decisions depend on it (Q50 role→permission-set resolution, 007:34; Q61 conformance "names/prefixes", 002:52, 002:60); and the enums convention exists precisely to prevent this ambiguity class (007:22). Cost of change scales with module count, so pinning it before the first module declares a key is the smallest-change move. It needs no Q46/Q54/Q40 input, so it does not wait on the spike — unlike D1/D2.

**Grammar (fold into 007 §Permissions, cross-referenced from 002:47):**
- **Member:** unchanged — PascalCase `Key = 'Key'`, module-owned (007:22).
- **Namespace:** the module's namespace token, registered once in the manifest at the same registration point used for ID prefixes (002:46) — one namespace authority, not two.
- **Aggregated permission key = `<ModuleNamespace>:<Member>`** — e.g. `Media:Read`, `Media:Manage`. Entity-scoped form `<ModuleNamespace>:<Entity>.<Member>` where a module needs it.
- **Delimiter/case chosen:** PascalCase namespace + `:` + PascalCase member (the review's own example, consistent with the enums convention that governs the vocabulary). *Rejected alternative:* mirroring the ID-prefix style (lowercase `_`, e.g. `media_read`) — the ID prefix is a storage-identity token (`pg_<ulid|uuidv7>`, 007:18) while the permission key is a vocabulary token under the enums convention; they are separate namespaces and need not share spelling. (One-line swap if tighter harmonisation is preferred later.)
- **Collision rule:** the composite *is* the key — two modules may both declare `Read` (`Media:Read`, `Content:Read`) without collision. A real collision is (a) two modules claiming the same namespace → Q40's existing ID-prefix collision/registration rule (007:20, 003:28); or (b) a duplicate member within one module → build/conformance error.
- **Cross-module composition:** default to *explicit* satisfaction — a role granted in module A satisfies module B only if B's composite key is granted directly or via a declared alias. No implicit satisfaction by bare member name. This replaces 007:35's open "implementation detail."

**Ownership (named in 007 §Permissions):**
- **Q50** owns the permission vocabulary and the grammar's semantics.
- **Q61** enforces it in the CLI/build/CI conformance harness (002:60).
- **Q40** owns namespace registration (already owns ID prefix collision/registration, 007:20, 003:28) — the namespace half of the grammar is therefore already Q40's.

**Fold target:** two sentences in 007 §Permissions (grammar + collision rule + cross-module default) plus an owner line, cross-referenced from 002:47, with namespace registration cited alongside 002:46. Independent of D1/D2.

### D4 (YB-S2) — privacy scope (platform-level vs per-project)

Decided 2026-10-04. **Resolution: neither horn — split it by layer: "platform-guardrailed, per-project-policied."**

Rationale: pure per-project contradicts the platform's own security precedent — 007:46–48 lock "safe-by-default" baseline protections on every registered surface with "no unprotected opt-in or opt-out," so shipping consumers safe security defaults but no data-protection posture is the exact inconsistency flagged in YB-S2 (review:105), and it lets PII reach shared observability sinks by default before any project acts. Pure platform-level is unachievable — the platform cannot know a project's lawful basis, consent wording or retention obligations, and claiming to own them would be false assurance. 007 already establishes the shape for security (platform = baseline protections + per-surface profile declaration; consumer = selection/config); privacy follows the same pattern so the two specs read consistently.

**Platform-level (lock as safe-by-default guardrails):**
- **Redaction-by-default in the observability seam** — no PII, request bodies, tokens or full auth payloads in default logs/traces/diagnostics. Closes 008:23's current punt that "sink failure/redaction details are implementation design."
- **Data-classification / PII-marking seam** — modules flag PII-bearing fields so redaction and retention are mechanical, not ad hoc (ties to the Q38 capability inventory and the manifest).
- **Erasure/retention primitives** (delete/erase hooks) so a project can fulfil a DSR — the natural extension of Q65's existing "retention/deletion and recovery expectations" (008:52).
- **Safe defaults on the surfaces the platform ships:** auth (minimal session/cookie data), public forms (Turnstile), uploads (validation/sanitisation, already Q59), and no PII leakage through cache/history (Q67 already covers private/preview isolation).

**Per-project (consumer-owned policy; the platform does not decide):**
- Lawful basis; consent wording/capture; DSR fulfilment policy and timelines; data-specific retention periods; cross-border transfer; regulator registration (POPIA/GDPR); privacy notices.
- This is explicitly **not a platform gate** — state it so no one looks for one.

**Ownership (name it):**
- **Q65** owns retention/deletion/recovery — extend its scope to erasure/DSR primitives (the review's own "add erasure/retention to Q65").
- The **observability redaction guardrail** is owed by 008's runtime seam (008:23), coordinated with Q40 service lifetimes: promote "redaction-by-default is locked" as policy while the sink mechanics stay in design.
- The **PII-classification seam** sits with the manifest / Q38 capability inventory and Q50's model.
- POPIA is in scope because the owner and both pilots are South African.

**Fold target:** one short "Privacy" statement in 007 (the trust/identity domain) naming the split; one line in 008:23 promoting redaction-by-default from "implementation design" to a locked guardrail; two lines extending Q65's scope to erasure/DSR. Needs no spike input to state — like D3, the posture locks now; only the concrete consent/DSR UI is later work.

### Q-A (YB-S1 hypothesis) — "aggregated platform-wide": central registry vs build-time aggregation

Decided 2026-10-04. **Resolution: aggregate-by-manifest at build** — a derived build-time aggregate, not a central enum/permission registry that modules write into or query.

Rationale (all already locked):
- Build-time composition is a non-negotiable (Q22, understanding.md:197; 001:13; 002:40) — a runtime/authoritative central registry would reintroduce the runtime-registration dynamism the model forbids.
- Enums are **module-owned** (Q11:120, 007:22) — no central owner of the members.
- Conformance runs "in CLI/build/CI before build-time registration" (002:60, 004:60) — aggregation-at-build lands exactly on that seam.
- Modules have no privileged core status (002:102/Q29) — a central store every module registers into is itself the privileged coordination point the architecture avoids.

**Definition:** module source (owns its enums/keys) + manifest declaration → build aggregation → platform-wide aggregate set → conformance validates names/prefixes/collisions → build-time registration. "Aggregated" = a derived output; "central registry" = an authority. The model is the former.

**Sub-choice settled:** the build emits a **generated, derived artifact** (platform-wide aggregate of permission keys + enum members) consumed by the RBAC resolver and the conformance harness — not a hand-maintained master file, and no runtime registry lookup (if runtime needs the set it is a static import baked at build). Keeps a single source of truth derivable from module source (Q10/Q37) and deterministic (consistent with Q40's deterministic-artifact direction).

**Conformance implication:** input is the build-produced aggregate; checks — (i) namespace token grammar/uniqueness (D3); (ii) no duplicate member within a module; (iii) composite-key distinctness across modules (two `Read` members → `Media:Read` / `Content:Read`); (iv) declared module dependencies vs permissions used; timing CLI/build/CI before registration (002:60).

**Ownership:** Q40 owns build composition and the generated artifact; Q61 owns the conformance check; Q50 owns vocabulary semantics.

**Pairs with D3:** the composite `Module:Member` key is formed *during* build aggregation — aggregation is precisely the step that namespaces otherwise-colliding shared member names, so D3 and Q-A are two halves of one mechanism and should fold together.

**Fold target:** 007:22 enums line (add "aggregated by build, derived artifact") + 002:47/60 + the Q40/Q61 sections.

### D1 (YB-M1) — MVP public-client scope (highest leverage)

Decided 2026-10-04. **Resolution: MVP acceptance includes a selected public-site starter — a public-facing consumer frontend is in MVP.**

The MVP "deployed client" is therefore: the Q46-selected public-site starter **+** the bundled dashboard **+** the two host fixtures (acceptance proof). All three are in scope; the question in §7 asked whether the starter was needed at all — it is.

**Consequences:**
- **Q46 moves onto the MVP critical path.** 004:40 and 006:63 already state Q46 "blocks starter scaffolding and MVP public-client implementation"; with this decision that block binds MVP itself, not merely the starter choice. Q46 must close before the MVP public-client implementation.
- **YB-M1 resolves.** The MVP's client deliverables are no longer ambiguous: a selected starter is required. 001:14's "no … starter … has been selected" stays true as a *state* but must be joined by "selecting one is required for MVP" — otherwise the same sentence still reads as if the starter were optional.
- **Sequencing reconciliation required (the one place the docs now contradict the decision).** 000:25 says "Final Q40/Q47 designs close together after Q54 supplies workflow input" and lists Q46 as blocking "starter scaffolding and MVP public-client implementation, **not all foundational platform work**." With Q46 now MVP-critical, that text must state Q46's close point relative to Q40/Q47/Q54 — either Q46 closes alongside Q40/Q47 after Q54, or it is explicitly ordered ahead of the MVP public-client implementation.
- **Q-C resolves (same artifact).** 004:65's "public reference frontend" carrying LCP<2.5s / INP<200ms **is** the Q46-selected starter — 004:65 already ties the budget frontend to "unselected under reopened Q46." A *distinct* reference client is not adopted: it would breach 001:15's "no … multiple complete production frontend renderers in MVP."
- **Q-B resolves (yes).** The MVP does require a public-facing production frontend; and yes, Q46 consequently moves onto the MVP critical path ahead of Q40/Q47 finalization (see the sequencing item above).

**Minimal spec changes (scoped from the review's own recommendation, review:68):**
- 001 (MVP requirements): one sentence pinning "MVP includes a selected public-site starter."
- 001:14: keep "no starter selected" as state and add the clarifying clause "the dashboard role is a locked deliverable; its implementation is unselected," plus the "starter required for MVP" statement.
- 000:25 + 004:40 + 006:63: reconcile Q46's close point on the critical path.
- 004:65: state the reference frontend is the selected starter (Q-C).
- **No change** to 001:15 — a *single* starter, not multiple renderers, is what is required.

**Boundary note:** this does **not** change the frontend-independence invariant, and does not merge the starter with the two acceptance fixtures — the starter is a production renderer the platform scaffolds; the HTML/server-rendered and reactive hosts remain acceptance fixtures only (see D2).

**Fold target:** 001 MVP requirements + :14; 000:25; 004:40 + :65; 006:63.

### D5 — immediate next deliverable and location

Decided 2026-10-04. **Resolution: re-sequenced — Orca onboarding (`/onboard-existing`) runs first; plan 000 is authored after it.**

- The immediate next deliverable is **not** plan 000 directly. Orca's baseline gate applies: this repo has no `AGENTS.md` → not onboarded (review:11, 42), and the coding flow — which `/new-plan` belongs to — opens only after onboarding. Onboarding also stands up the board + `.project/state.json` that plan 000 will run on.
- Run **`/onboard-existing`** via the confirm-not-reask path, seeded from the existing doc corpus (`docs/discovery/understanding.md` + `docs/specs/`) rather than from git history (no code to mine). The 69 discovery questions are already settled, so the UNDERSTAND loop is largely a confirmation pass — but it must still reach zero `[STATUS: OPEN]` before WRITE (the state gate).
- Onboarding lands `AGENTS.md` (the invariants home, Q22), which discharges the review's **YB-D1** ("no canonical home for invariants the specs assume") in part.
- Plan 000 then follows via `/new-plan` at **`docs/plans/000_...`** — location unchanged from the review's example. Review §6 item 1's "author spike plan 000 first" is a *design* dependency and is unaffected; onboarding is a *process* bootstrap inserted ahead of it and closes no Q-gate.
- Independent of this ordering: the D1–D4 / Q-A/B/C resolutions still fold into the specs, and the folded specs become primary input to both the onboarding WRITE layers and plan 000.

**Fold target:** none in the specs — this is a process/sequencing decision. It reflects in 008:18's "recorded next-step sequence" if/when that doc is next updated, and in `AGENTS.md`'s "Current Phase:" pointer at onboarding.

### Deferred / housekeeping (recorded so they are not lost)

Decided 2026-10-04.

- **YB-S3 — gate-table dedup: DEFERRED to its own pass.** Add one canonical gate table to `000_index.md` (owner / deliverable / block) and have 002/003/005/006/007/008 cite it instead of restating the Q38/Q40/Q46/Q47/Q54/Q63/Q65–Q68 boilerplate. Do **not** strip the specs' locked-decision bullets (load-bearing); dedupe only the repeated gate boilerplate. Deferred because it is a Should/improvement, independent of the Must/Should design findings, and folding it in the same pass would muddy review of the substantive changes. Fold target: `000_index.md` canonical table + the six specs' gate sections.
- **YB-D1 — invariants home (AGENTS.md):** owned by the upcoming Orca `/onboard-existing` run (see D5), not the spec fold.
- **YB-D2 — empty `docs/prompts/spec-review-prompt.md` (0 bytes):** left in place pending the dev's call (populate or remove).
- **YB-D3 — 005 frontmatter/format divergence:** align opportunistically; no dedicated pass.