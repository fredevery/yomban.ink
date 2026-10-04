# Best Practices — Module Authoring

Do/Don’t guardrails. Source: onboarding answers Q28, Q30, Q34–Q39, Q41, Q45, Q49, Q50, Q61.

## DO
- **A module is a vertical capability slice** declared via a **manifest** the core reads to wire
  it at build time.
- **Declare in the manifest:** identity/version + **target contract major**; declared module
  dependencies + exposed services; required core capabilities + **named D1** requirements; owned
  entities/schema/migrations + **aggregate roots** + child tables; **ID prefix**; module-prefixed
  **permission keys**; config schema; queue/cron/job contributions; and **optional, explicitly
  labelled** presentation contributions.
- **Expose typed services** for dependents; receive dependents’ services from the
  **core-resolved registry** (Q41). Direct imports are for typed shared code only.
- **Keep UI facets optional** — a service-only module must register and operate with no UI.
- **Respect the namespace authority:** register the ID prefix + permission namespace at the same
  point (one namespace authority, not two).
- **Declare contract major** and stay within current + N-1; moves go through the upgrade CLI +
  codemods.

## DON’T
- **DON’T monkey-patch** another module, or import its implementation for runtime interaction.
- **DON’T** access Cloudflare bindings/secrets directly — use core capability seams.
- **DON’T** make UI/HTML fragments the mandatory module contract.
- **DON’T** make built-ins privileged — custom modules compete on the same contract.
- **DON’T** exceed declared dependency/export boundaries; conformance runs in CLI/build/CI
  **before** build-time registration.
