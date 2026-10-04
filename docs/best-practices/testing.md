# Best Practices — Testing (Vitest / `@cloudflare/vitest-pool-workers`)

Do/Don’t guardrails. Source: onboarding answers Q14, Q20, Q61.

## DO
- **TDD first**: write a failing test, watch it go red, then implement to green.
- **Exercise real code at the right mock boundary** — run **real D1** through
  `@cloudflare/vitest-pool-workers` rather than mocking the datastore.
- **Back every “done” claim with real output**: test, lint (Biome), typecheck (`tsc`), build.
- **Run executable conformance in CLI/build/CI before build-time registration** — not during
  deployed request initialization (that is not a test runner).
- **Derive expected values from a canonical constant**, never from the data being validated —
  one canonical source of truth keeps the check and the expectation from drifting.
- **Prove the boundary, not a label**: frontend independence is proven by the two-host acceptance
  fixture (plain HTML/server-rendered + bounded reactive-framework host, same content through
  unchanged services/contracts), and boundary lint checks no core/headless → presentation import.

## DON’T
- **DON’T** write self-referential assertions that only mirror the implementation.
- **DON’T** submit a task with remaining must/should findings.
- **DON’T** rely on a reviewer’s or executor’s self-report as verification.
- **DON’T** mock away the very boundary under test (e.g. mock D1 when the test is about D1/demo).
