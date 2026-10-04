# Best Practices — Client (framework-free contracts, headless clients, host integration)

Do/Don’t guardrails. Source: onboarding answers Q8, Q22, Q25, Q46, Q47, Q51, Q70.

## DO
- **Keep core, shared contracts and headless clients framework-free** — no direct or transitive
  dependency on any presentation framework/library (incl. Svelte/SvelteKit and htmx).
- **Ship a shared contract package per module**: public types + runtime schemas + a typed client
  derived from the module’s own source; server handlers and clients share appropriate contracts.
- **Derive/map public DTOs** from stored types — narrow shapes, not private DB rows.
- **Separate DOM-integration code from headless/server-safe code**; browser-safe exports must not
  expose server-only deps or private fields.
- **The host owns its content DOM**; updates arrive through **documented host notifications /
  host-owned swaps**. Panel-driven mutations stay on panel-owned surfaces.
- **Keep the local-first store browser-safe and framework-free** (Q70) — it is a core export, not
  a presentation dependency; don’t weaken frontend independence by adopting it.

## DON’T
- **DON’T** let a UI library leak into core/contracts/headless code.
- **DON’T** replace (foreign) host DOM, hijack the host’s existing config, or force the host to
  adopt the panel/editing library.
- **DON’T** make tRPC inference, OpenAPI generation, or codegen the primary contract mechanism
  (shared runtime schemas + typed client from module source are).
- **DON’T** let public framework routing / server actions define module registration or domain
  operations; public API and optional HTML admin paths invoke the **same** domain/authorization
  operations.
- **DON’T** assume HTTP cache directives alone protect drafts/secrets — JS history caches need an
  explicit policy (Q67).
