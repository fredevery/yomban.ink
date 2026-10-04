# Best Practices — Auth (better-auth)

Do/Don’t guardrails. Source: onboarding answers Q11, Q50, Q53, Q59, Q63, Q68.

## DO
- **better-auth maps onto the roles + permission-scopes model** — modules declare permission
  keys as enum-defined, module-prefixed keys (`<ModuleNamespace>:<Member>`); roles map to
  permission sets; resource-level checks where a module needs them.
- **Enforce server-side authorization on every registered surface** — API, HTML fragment, and
  mutation alike. Presentation affordances (nav gating) are **not** an authorization boundary.
- **Apply the applicable locked profile to every route** — cookie-authenticated,
  machine-authenticated, or public-form. There is **no unprotected opt-in/opt-out**.
- **Use the core secrets seam** — modules never touch bindings/secrets directly; core validates
  config before serving.
- **Prove Better Auth prefixed-TEXT-ID compatibility** under the selected Drizzle/D1 adapter as
  **required Q63 evidence** (auth flows + required entities) before auth/pilot work.

## DON’T
- **DON’T** treat a presentation header (e.g. `HX-Request`) as authentication.
- **DON’T** assume better-auth automatically covers custom module routes/mutations — it does not.
- **DON’T** rely on better-auth’s default isolate-memory rate limiter as distributed/serverless
  wide (Q68 designs rate-limit storage).
- **DON’T** silently fall back to INTEGER ids if the prefixed-ID compatibility check fails —
  **surface it to the dev**.
- **DON’T** weaken CSP/security headers, or skip Zod boundary validation / upload validation /
  server-validated Turnstile.
