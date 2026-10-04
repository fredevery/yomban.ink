---
title: Understanding amendments 002 — Yomban.ink (privacy scope + Q70 MVP status)
created_session: "20261004_205142_9cffa1"
sessions: []
approved: false
amends: understanding.md
---

# Understanding amendments 002

> Amendment record for `docs/discovery/understanding.md`. Reconciles two gaps that
> surfaced when the spec-review fold (`docs/reviews/001_spec-review.md`, §9 decisions
> and finding YB-S2/D4) was reconciled against Amendment 001 (Q70, local-first client
> datastore + sync).
>
> It adds **Q71** (privacy / personal-data scope) and amends Q7/Q59/Q65/Q70.
> **No locked decision is reopened.** Where this amendment and the base file differ,
> this amendment governs for the amended scope; the base file remains authoritative
> for everything else.
>
> Status machine: OPEN / ANSWERED / DEFAULTED / DEFERRED, matching the base file.

## A. New question — Q71: privacy / personal-data scope

### Q71 — Privacy / personal-data handling: platform-level or per-project?

- Context: Surfaced when the spec-review fold (finding YB-S2 / decision D4) was reconciled against Amendment 001 (Q70), which places authored data on-device (browser OPFS). Neither the specs nor the base record previously stated whether personal-data handling is a platform responsibility or a per-project one, despite user auth, public forms (Turnstile), uploads and POPIA-relevant South African pilots.
- Agent default: Leave privacy to consuming projects (the Q59 security baseline alone).
- Answer: **Platform-guardrailed, per-project-policied — and the guardrails extend to client-local data.** **Platform-level guardrails (locked):** redaction-by-default in the observability seam (no PII, request bodies, tokens or full auth payloads in default logs/traces/diagnostics); a data-classification / PII-marking seam so modules flag PII-bearing fields; erasure/retention primitives so a project can fulfil a data-subject request — **explicitly reaching on-device replicas** (OPFS Class-1 authored data under Q70), so a DSR is **not** satisfied by server-side deletion alone; safe defaults on platform-shipped surfaces (auth minimalism, Turnstile, upload validation, no PII leakage through cache/history per Q67). **Per-project (consumer-owned, explicitly NOT a platform gate):** lawful basis; consent wording/capture; DSR fulfilment policy/timelines; data-specific retention periods; cross-border transfer; regulator registration (POPIA/GDPR); privacy notices. POPIA is in scope (owner and both pilots are South African). Owner: Q65 (erasure/retention primitives, extended to local data), Q70 (client-local store + tombstone/purge), Q59 (security baseline) and Q68 (surface profiles); concrete privacy/erasure mechanics fold into Q65/Q70 in spike plan 000.
[STATUS: ANSWERED]

## B. Q70 MVP status — amendment to Q7 (MVP) and Q70

### Q70 — MVP status

- Context: 001/000 listed Q70 as a foundational gate but did not state whether the MVP must ship local-first. Surfaced in the same reconciliation.
- Agent default: Design-only (foundational gate); MVP delivery unstated.
- Answer: **The dev confirmed Q70 is an MVP deliverable — the MVP must ship a working local-first client datastore + sync experience, not merely design it.** Q70's *design* still closes via the foundational gate in spike plan 000 (one ADR plus concrete design and verification evidence); its affected *implementation* ships as part of MVP. MVP client scope therefore includes the local-first store + sync alongside the scaffold, the bundled dashboard, the selected public-site starter (Q46) and the two acceptance fixtures (Q7). Q70's gate chains before MVP delivery of the sync experience, as Q65–Q68 do for their surfaces.
[STATUS: ANSWERED]

## C. Amendments to existing questions

Each entry below is the amendment bullet also inserted into `understanding.md`.

- **Q7 (MVP).** Amendment 002: the MVP additionally ships the Q70 local-first store + sync experience. MVP client scope = scaffold + bundled dashboard + selected public-site starter + local-first store/sync + the two acceptance fixtures. [Q7, Q46, Q70]
- **Q59 (security model & defaults).** Amendment 002: privacy guardrails are locked alongside the security baseline — redaction-by-default, a PII-classification seam and erasure/retention primitives reaching client-local replicas (Q70); lawful basis/consent/DSR policy remain per-project (new Q71). [Q59, Q65, Q70, Q71]
- **Q65 (backup, retention and coordinated restore).** Amendment 002: erasure/retention primitives extend to the client-local store (Q70); a data-subject request cannot be satisfied by server-side deletion alone. [Q65, Q70, Q71]
- **Q70 (local-first client datastore + sync).** Amendment 002: **MVP deliverable** — the MVP must ship a working local-first store + sync experience (its design still closes via this foundational gate, with implementation shipping in MVP). [Q7, Q70]

## D. Confirmed dev decisions recorded by this amendment

- Privacy is **platform-guardrailed, per-project-policied**.
- Platform privacy guardrails extend to **client-local / on-device data** (erasure and retention reach local replicas, not just D1/R2).
- **Q70 (local-first client datastore + sync) is an MVP deliverable** — the MVP ships it.

## E. Relationship to the gate inventory

- Adds **Q71** (privacy scope — a *decided* scope question, not a deferred gate). Amends Q7/Q59/Q65/Q70. Reopens no locked decision.
- Q71's erasure/retention mechanics fold into **Q65** and **Q70**, both already owned in spike plan 000; no new gate is created.
- The spec-review fold (`docs/reviews/001_spec-review.md` §9) remains the fold source; this amendment records the two reconciliation outcomes at the authoritative discovery layer, and the affected specs (007 §Privacy, 001 MVP requirements, 000/008 Q70 framing) fold from it.
