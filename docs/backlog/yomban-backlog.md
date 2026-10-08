# Yomban.ink — Backlog

> Deferred features + recorded housekeeping, value-ranked. On the Orca board this is a
> **column**, triaged by hand; this file is the durable mirror. Each item carries
> *why deferred / what's needed*. Sources: Q6, Q19, Q69 + the spec-review §9
> “Deferred/housekeeping” list.

## Platform features (deferred, not MVP)

1. **Search** — post-MVP (Q6/Q54/Q19). *Why deferred:* not on the MVP critical path; Q54 records
   *where* search later lives (a future built-in module/capability) without designing it now.
   *What's needed:* a future plan once the platform ships.
2. **Mobile / Capacitor delivery** — post-MVP (Q7/Q12/Q46). *Why deferred:* architectural
   direction only, not an MVP deliverable. *What's needed:* an `apps/mobile` decision after MVP.
3. **Additional complete production UI implementations / public-site starters** — post-MVP
   (Q6/Q46/Q47). *Why deferred:* the MVP ships **one** selected starter + the dashboard + two
   acceptance fixtures; multiple renderers are explicitly out of MVP scope. *What's needed:*
   the Q46 selection first, then later starters.
4. **Event bus / pub-sub** — post-MVP (Q41/Q54). *Why deferred:* registry-provided typed
   services are the MVP inter-module mechanism; the webhook/integration payoff is real but not
   MVP. *What's needed:* a future design; no MVP event bus.
5. **Q69 — purpose/dogfooding of the `yomban.ink` site itself** — explicitly post-MVP (Q19/Q48/
   Q64/Q69). *Why deferred:* deciding whether the domain hosts marketing/docs, a product home
   and/or a dogfooding consumer must not influence core/module contracts or release/versioning.
   *What's needed:* a separate post-MVP website plan/decision.
6. **Full pilot rebuilds** (Kasteel-website, FreeAgents/new) — after MVP (Q7/Q33/Q42). *Why
   deferred:* the MVP gate is a representative pilot-derived scenario with zero core edits; the
   Q42 audit lists candidates, not a commitment. *What's needed:* the MVP platform first, then
   rebuilds handled in the pilots' own repos.
7. **Module conformance score / authoring lint report; OpenTelemetry alignment** — post-MVP
   opportunities (Q61/Q55; review §5 OPP-2/OPP-3). *Why deferred:* opportunities, not MVP
   constraints.
8. **Pure-app platform consumption (minimal public surface)** — post-MVP (Q7/Q46; raised at
   the 2026-10-07 Q46 dev acceptance). *Why deferred:* the MVP ships one SSR-first public
   starter (Q7); a project whose product is almost entirely interactive (e.g. Critical
   Sheets) has a minimal public face, where the starter can feel like ceremony — but
   one-starter is an MVP scope rule, not an architectural claim. *What's needed:* evaluate
   whether the public starter is optional per-project or whether a minimal-shell starter
   variant is needed; only after MVP. Named future consumers confirmed by the dev: Spahn
   App, Band Together, Critical Sheets.

## Housekeeping — RESOLVED at onboarding (2026-10-04)

All findings from `docs/reviews/001_spec-review.md` are now resolved (not merely recorded).
The review's §9 “deferred/housekeeping” list and the onboarding REVIEW sweep are both closed:

- **YB-S3 — canonical gate table (gate-boilerplate dedup).** **RESOLVED.** A canonical
  gate table (gate / kind / owner-deliverable / block) was added to
  `docs/specs/000_index.md` §Canonical gate table, and the focused specs
  (`002/003/005/006/007/008`) now **cite** it instead of restating the Q38/Q40/Q46/Q47/Q54/Q63/
  Q70/Q65–Q68 boilerplate. The specs' locked-decision bullets were preserved (load-bearing);
  only the repeated gate boilerplate was deduped.
- **YB-D3 — `005_content-and-editing.md` diverged from the house doc format.** **RESOLVED.**
  The YAML frontmatter was removed; the title is now `# Yomban.ink: content and editing`; the
  Status is a one-line paragraph — matching the other eight specs. (The internal §-numbering and
  R1–R11 IDs are retained: they are referenced internally, so de-numbering them would break
  links for no gain.)
- **YB-D2 — empty `docs/prompts/spec-review-prompt.md`.** **RESOLVED by observation:** the file
  is populated (6756 bytes), as is `review-prompt-3.md` (5936 bytes). No action.
- **YB-D1 — invariants home (AGENTS.md).** **RESOLVED** by this onboarding run (AGENTS.md exists
  with the non-negotiables block).

