---
title: "Plan 000 understanding — amendment 001: in-situ/overlay capability flagging (new plan-scope question)"
amends: "understanding.md"
created_session: "20261007_104930_b7edfe"
sessions: ["20261007_104930_b7edfe"]
---

# Amendment 001 — New plan-scope question: in-situ/overlay capability flagging

## Context

While recording dev acceptance of the Q47 evidence report's pending items (task 3.2,
2026-10-07), the dev stated a directional requirement for the presentation roles
(ADR-0007 decision 12): the bundled dashboard is the devops/sysadmin/dev interface, and
a separate in-situ editing overlay serves content creators/editors/non-devs with
in-place editing plus a subset of dashboard features loaded in modals/panels. The dev
requires a mechanism by which **a module or the core can flag which capabilities are
available in-situ/overlay**. No existing gate (Q35 manifest declarations, Q47 §5 host
notifications, Q47 §7 standard-admin descriptions) currently defines such a flag.

## New question

### Q7 — How should modules (or core) declare which capabilities are exposed via the in-situ/overlay editing surface?

- Context: The Q47 contract set defines renderer-neutral standard-admin descriptions
  (§7) and host-notification/lifecycle contracts (§5), but nothing marks a capability
  (a domain action, a standard-admin screen, or a focused feature) as available to the
  in-situ overlay surface vs the bundled dashboard only. The dev wants this declared
  from within a module or the core, not hardcoded in any presentation implementation.
- Agent default: extend the manifest-level declaration vocabulary (Q35/q47 §7) with an
  explicit **surface-availability flag** on declarable capabilities — e.g. a
  `surfaces` classification per standard-admin description and per action
  (`dashboard` / `in-situ` / both), defaulting to dashboard-only, aggregated at build
  like the enums; the overlay surface renders exactly what is flagged, and the
  subset-of-dashboard-features question is answered per-module by these flags rather
  than by a core-curated allowlist. Ownership and exact shape to be settled by the
  gated design tasks that own the presentation contracts (Q47 §12 follow-ons), not
  selected while recording this amendment.
- Answer: The dev confirmed the NEED (2026-10-07, session `20261007_104930_b7edfe`)
  and elected to record it as a plan-understanding amendment question. The MECHANISM
  (flag shape, where it lives, defaults) is NOT settled by this record — it is a
  design obligation for the presentation-role design tasks (design §12 follow-ons /
  phase-006 candidates), to be answered before the in-situ overlay role is selected.
[STATUS: ANSWERED]

## Gate-inventory relationship

- Additive: reopens no locked decision (Q8/Q22/Q25/Q35/Q46/Q47/Q54 locks untouched).
- The flag mechanism interacts with ADR-0007 decisions 5 (host notifications), 7
  (standard-admin descriptions) and 12 (dashboard/overlay role split); its design home
  is the Q47 presentation-contract follow-on work, and the phase-006 candidate proofs
  must evaluate it before the in-situ overlay role is selected.
- The design doc (`designs/q47_client-host-contracts.md`) and ADR-0007 record this
  acceptance as directional input only; neither settles the mechanism.
