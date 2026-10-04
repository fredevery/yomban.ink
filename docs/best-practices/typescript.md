# Best Practices — TypeScript

Do/Don’t guardrails. Source: onboarding answers Q13, Q20, Q22, Q25.

## DO
- **TypeScript strict, throughout** (server, client, contracts, CLI).
- **Infer canonical stored types from module Drizzle schema** — the schema is the single source
  of truth; never hand-author duplicate interfaces.
- **Map public DTOs deliberately** from stored types in the framework-free module contracts
  (Q10/Q51) — narrow, explicit shapes.
- **Declare enums** module-owned, PascalCase `Key = 'Key'`, aggregated platform-wide at build
  (Q11). Prefer enums over string unions for fixed domain values.
- **Keep routes/handlers lean**; put logic in the module/core, not the route.
- **Explicit error handling**; validate at boundaries with **Zod** (Q59).

## DON’T
- **DON’T use `any`** — use `unknown` + narrowing.
- **DON’T use `export *`** — export explicitly (dependency direction must stay checkable).
- **DON’T** duplicate stored types as prose or as a parallel interface that can drift.
- **DON’T** export raw DB rows / private fields across the contract boundary.
- **DON’T** reach for a query-builder abstraction above Drizzle.
