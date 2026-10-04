# Yomban.ink: security and identity

Status: Specification baseline derived from answered discovery. The safe-by-default protections, ownership, identity, permission, config/secrets and constraint decisions below are **locked**; the concrete Q68 mechanics (surface profiles, first-admin bootstrap, permitted auth methods, rate-limit design) remain explicitly **deferred to spike plan 000** and are marked as such — nothing beyond the locked decisions is promoted here. No implementation is selected.

## Purpose

This spec pins the security and identity model of the platform: who owns and administers it, how every entity is identified, the module RBAC model, the config/secrets seam, and the locked safe-by-default security protections. It deliberately separates what is **locked** from what Q68 must still resolve. The owner is Fred Every; the platform itself is a single-owner, no-roles-permission-split project, while the *product* ships a module RBAC model for consuming applications. Identity is locked to prefixed, sortable, URL-safe TEXT identifiers with no INTEGER primary keys. Every registered route surface is protected by server-side authorization and an applicable security profile — there are no exempt or opt-out routes. [Q3, Q11, Q50, Q59]

## Locked decisions and constraints

### Ownership and maintainership [Q3]

- Sole owner and maintainer is **Fred Every, fred@fredevery.co.za**. Solo project — **no role/permission split** applies to the platform's own maintenance. [Q3]
- The platform nevertheless exposes a **module RBAC model** to consuming applications; this is a product capability delivered by the platform, not a reflection of a multi-role team operating Yomban.ink itself. (See Permissions.) [Q3, Q50]

### Identity conventions [Q11]

- **Locked:** every entity uses a **globally-unique, sortable, URL-safe TEXT id with an entity-type prefix** (e.g. `pg_<ulid|uuidv7>`), generated via one core id-service seam. Modules declare their prefixes in the manifest (Q35/Q39). **No INTEGER auto-increment primary keys.** [Q11]
- Human **slugs are secondary unique keys** for externally routable content; identity is not addressability. [Q11]
- **Remaining ID mechanics are Q40's to settle**, not relocked here: UUIDv7 vs ULID choice; prefix collision/registration rules; temporary vs final client-generated ids; and repeated-ID/different-payload duplicate-request behaviour (with Q66 supplying reusable idempotency semantics). Time-sortable IDs do not guarantee global event ordering. [Q11, Q40, Q66]
- **Better Auth compatibility is a required Q63 evidence check:** the selected Drizzle/D1 adapter must support prefixed TEXT ids for core auth entities (including auth flows/required entities) before auth/pilot implementation begins. A failed check blocks auth work and is **surfaced to the dev**, never silently resolved by falling back to integer IDs or changing the identity policy. [Q11, Q63]
- Enums are module-owned, aggregated platform-wide into a **derived build-time artifact** (not a central registry): the build collects each module's own enums/permission keys from source plus its manifest declaration, forms the platform-wide aggregate, and conformance validates names/prefixes/collisions before build-time registration — there is no runtime registry lookup. PascalCase `Key = 'Key'`; this convention underpins the permission-key scheme. [Q11, Q22, Q50]

### Non-negotiable constraints [Q22, Q25]

- TypeScript strict; **no `any`; no `export *`**; docs-first; TDD; build-time composition (no runtime plugins); module-owned Drizzle/D1 schema with a core migration runner. [Q22]
- **Modules never directly access Cloudflare bindings/secrets** — only through core service/capability interfaces; datastore is one capability, not a uniform abstraction for everything. [Q25, Q53]
- **Trusted compiled modules are not sandboxed** by these seams or by lint/contract enforcement; the boundaries are enforcement of declared dependencies and capability contracts, not a security sandbox. [Q25, Q61]
- Browser contract exports must not expose server-only dependencies/private fields; DOM integration is separate from headless/server-safe code. [Q25, Q47, Q51]
- Core services, shared contracts and headless clients have **no direct or transitive frontend/presentation dependency** (including Svelte/SvelteKit and htmx); chosen presentation dependencies live in optional presentation packages and must **never weaken CSP or other safety protections**. [Q22, Q25, Q46, Q59]

### Permissions / RBAC [Q50]

- **Locked:** roles + permission-scopes. Modules declare **permission keys as enum-defined, module-prefixed** keys (PascalCase `Key = 'Key'`, per the enums convention); **roles map to permission sets**; **resource-level checks** where a module needs them. **better-auth maps onto this** model. [Q50]
- **Permission-key grammar (locked, adopted):** the aggregated permission key is `<ModuleNamespace>:<Member>` — PascalCase namespace + `:` + PascalCase member (e.g. `Media:Read`, `Media:Manage`); an entity-scoped form `<ModuleNamespace>:<Entity>.<Member>` is available where a module needs it. The namespace token is registered once in the manifest at the **same registration point as ID prefixes** (see [Module platform contract](002_module-platform-contract.md), ID-prefix registration), so there is **one namespace authority**, not two. Members remain PascalCase `Key = 'Key'`. [Q11, Q22, Q50]
- **Collision rule:** the composite *is* the key — two modules may both declare `Read` (`Media:Read`, `Content:Read`) without collision. A real collision is two modules claiming the same namespace (Q40's ID-prefix collision/registration rule, 003:28) or a duplicate member within one module (a build/conformance error). [Q40, Q50, Q61]
- **Cross-module composition (explicit satisfaction):** a role granted in module A satisfies module B's check only if B's composite key is granted directly or via a declared alias — never by implicit match on a bare member name. [Q50]
- **Ownership:** **Q50** owns the permission vocabulary and this grammar's semantics; **Q61** enforces it in the CLI/build/CI conformance harness; **Q40** owns namespace registration (it already owns ID-prefix collision/registration). [Q19, Q40, Q50, Q61]
- **Q68 owns the concrete auth mechanics** — registration/sign-in methods, first-admin bootstrap, token issuance, and rate-limit surface profiles — **not Q50's permission vocabulary.** This spec does not pre-decide them. [Q50, Q68]

### Local-first sync scope [Q70, Q50, Q59]

- **The working-set subscription is server-authoritative and is a security boundary.** A client may pull only records it is permitted to see; the scope is resolved server-side from ownership/membership/permissions and is never trusted from the client. [Q50, Q59, Q70]
- **Pushed change-sets use the same module-prefixed permission boundary** as interactive requests (Q50/Q59); a change-set that fails authorization is rejected whole and surfaced, never partially applied. Offline edits are provisional — a local write is not an authorization decision; authorization happens only at sync acceptance. [Q50, Q59, Q70]

### Configuration and secrets [Q53]

- **Locked:** manifest config schemas and a **core secrets seam**. Per-environment non-secret values live in project config; **modules never directly access bindings/secrets.** [Q53]
- **Core validates configuration before serving each effective runtime configuration** ('boot' is an initialization/validation boundary, not a long-lived process startup); invalid configuration fails safely with diagnostics. [Q53]
- Q40 owns invocation-scoped env context and config/secret refresh: **no binding I/O at module initialization**, no stale globally cached binding-derived clients, and CLI/scaffold-time vs runtime validation/secret-delivery mechanics. This preserves boot validation under Workers isolate/binding lifetime. [Q40, Q53]

### Safe-by-default security model [Q59]

- **Locked baseline protections:** CSP/security headers, **CSRF handling**, **Zod boundary validation**, **upload validation**, **server-validated Turnstile for public forms**, and **machine-client token auth**. [Q59]
- **Rate-limit/abuse policy is an explicit core responsibility**, distinct from Turnstile. [Q59, Q68]
- **Baseline protections apply to every registered surface.** Module declarations select an applicable **cookie-authenticated, machine-authenticated or public-form profile** — there is no unprotected opt-in or opt-out; no route is exempt. [Q59, Q68]
- **Every API/HTML-fragment/mutation path enforces server-side authorization and applicable CSRF/origin rules.** better-auth does not automatically cover custom module routes, and a presentation header such as `HX-Request` is **not an authentication boundary**. [Q51, Q59]
- **Untrusted content is escaped/sanitized** and must not introduce executable UI behaviours; **do not weaken CSP** for a presentation library. UI-specific controls remain conditional on the selected presentation implementation. [Q59]
- Private responses and presentation-library history snapshots obey Q67's private/preview data-isolation requirements. [Q59, Q67]

The **concrete** parts of the above that Q59 leaves open — exact per-surface profiles, credential/origin/session rules, rate-limit storage, permitted auth/registration methods, and first-admin bootstrap — are **Q68's**, enumerated below; none are decided here. [Q59, Q68]

### Privacy / personal data [Q22, Q59, Q65]

- **Scope decision (locked): platform-guardrailed, per-project-policied.** The platform ships safe-by-default data-protection guardrails; the consuming project owns its policy. This mirrors the safe-by-default security model above (no opt-in, no opt-out).
- **Platform-level guardrails (locked):**
  - **redaction by default in the observability seam** — no PII, request bodies, tokens or full auth payloads in default logs/traces/diagnostics (see [Operations and quality](008_operations-and-quality.md), observability seam);
  - a **data-classification / PII-marking seam** so modules flag PII-bearing fields, making redaction and retention mechanical;
  - **erasure/retention primitives** (delete/erase hooks) so a project can fulfil a data-subject request — the retention/deletion machinery is owned by Q65, and **erasure/retention extend to the client-local store** (on-device OPFS replicas under Q70), so a data-subject request is not satisfied by server-side deletion alone;
  - safe defaults on platform-shipped surfaces: auth (minimal session/cookie data), public forms (Turnstile), upload validation (Q59), and no PII leakage through cache/history (Q67 private/preview isolation).
- **Per-project (consumer-owned, explicitly NOT a platform gate):** lawful basis; consent wording and capture; data-subject-request fulfilment policy/timelines; data-specific retention periods; cross-border transfer; regulator registration (POPIA/GDPR); privacy notices.
- **POPIA** is in scope for the owner and both pilots (South African). [Q3, Q59, Q65, Q70, Q71]

## Deferred design and affected-work gate: Q68

Q68 is **deferred from onboarding by explicit dev decision** and is an **affected-work gate**, not a blanket pre-implementation gate. This spec records its scope, owner, evidence and blockers without resolving the design (no decision promotion).

- **Owner/question:** core security/auth design in **spike plan 000**, coordinated with Q40 (deployment/session/SSR topology, cookies/origins/CSRF, credentials), Q50 (permission model), Q53 (secrets seam/refresh), Q59 (locked protections) and Q67 (private preview/cache isolation). Outcome: **one ADR plus a concrete design and verification evidence.** [Q68]
- **Intended design scope (unresolved here):**
  - mandatory baseline and per-surface profile applicability (cookie / machine-token / public-form) with no exempt routes;
  - permitted auth methods and permitted **sign-in/registration** methods;
  - **first-admin bootstrap, provisioning and recovery**;
  - server-side role/scope/resource authorization on every path;
  - session/credential/origin/CSRF rules for cookie-authenticated, machine-authenticated and public-form surfaces;
  - token issuance/scopes/revocation using the **same permission boundary** — no permissive profile and no frontend nav gating substitute for server authorization;
  - **rate-limit/abuse limits, trusted client identity/proxy handling, and rate-limit storage/atomicity appropriate to Workers**; Turnstile remains server-validated public-form protection, **not** a substitute for all auth/API/upload limits;
  - better-auth's default isolate-memory limiter must **not** be assumed distributed/serverless-wide; its own auth protection does not automatically cover custom mutations;
  - preserve CSP/headers/Zod/upload validation and sanitization **without weakening policy** for a UI library (including the `HX-Request`-as-auth non-boundary). [Q50, Q53, Q59, Q68]
- **Required evidence:** denied undeclared/unprotected surfaces; expired sessions; forbidden origins/CSRF; token/resource permission denials; rate-limit concurrency/storage; first-admin bootstrap; and untrusted upload/content cases. [Q68]
- **Blockers:** completes before affected auth/security/public-surface implementation **and** before MVP deployment; it does **not** block unrelated implementation whose own gates are satisfied. [Q19, Q60, Q68]
- **No decision promotion:** this spec does not select any auth method, first-admin mechanism, profile shape, or rate-limit storage/limits. Those are Q68 outcomes only. [Q59, Q68]

## Adjacent spike links (not owned here)

- **Q63 — Better Auth prefixed-TEXT-ID compatibility:** required evidence that the selected Drizzle/D1 adapter supports the platform's prefixed TEXT ids for core auth entities, including auth flows/required entities; failure blocks auth/pilot implementation and is surfaced. [Q11, Q63] → [Data and migrations](003_data-and-migrations.md)
- **Q40 — cookies/session/origin topology:** browser/SSR cookies/session propagation, auth-handler ownership, credentialed CORS/trusted origins/CSRF in local/deployed/preview environments, and config/secret refresh; Q68 consumes these outcomes. [Q40] → [Module platform contract](002_module-platform-contract.md)
- **Q67 — author consistency / preview isolation:** private and no-store responses and presentation-library history snapshots must not expose drafts/secrets between users or preview/public contexts; Q68's private-surface rules respect this. [Q67] → [Content and editing](005_content-and-editing.md), [Operations and quality](008_operations-and-quality.md)
- **Q70 — local-first client datastore and sync:** the working-set subscription is a server-authoritative security boundary and pushed change-sets use the Q50/Q59 permission boundary; Q68's auth/session rules and Q67's private-surface rules apply to the sync surface. [Q50, Q59, Q70] → [Data and migrations](003_data-and-migrations.md), [Clients and presentation](004_clients-and-presentation.md)

## MVP requirements

The MVP must provide **authentication and server-side permissions**, with authorized content editing and publication reflected in the consuming client. [Q7] Specifically, the baseline ships:

- A functioning auth login/logout and server-side authorization path over better-auth mapped onto the module-prefixed RBAC model, protecting module operations on every registered route. [Q7, Q50, Q59]
- Safe-by-default protections active on all registered surfaces: CSP/security headers, CSRF, Zod boundary validation, upload validation, server-validated Turnstile on public forms, and machine-client token auth. [Q59]
- A core rate-limit/abuse responsibility that is enforced once Q68 closes; the MVP's public surfaces are not exposed without applicable limits before deployment. [Q59, Q68]
- A **first-admin bootstrap** in place so an initially authorized administrator exists, per the Q68 design (Q68 must close before this is implemented and before MVP deployment). [Q59, Q68]
- Server-side role/scope/resource checks govern the public API **and** the bundled admin/editing presentation alike; frontend affordances are not an authorization boundary. [Q50, Q51, Q59]
- Untrusted content and uploads are validated and sanitized, and CSP/security protections are not weakened by any presentation choice. [Q59]
- Operations documented: configuration, secrets (never committed), diagnostics and recovery, consistent with [Operations and quality](008_operations-and-quality.md). [Q7, Q15, Q53, Q60]

MVP completion and its zero-core-edit, dual-host acceptance fixtures are defined in [Product scope and MVP](001_product-and-mvp.md); security/identity criteria feed those acceptance checks. [Q7, Q61]

## Verifiable acceptance criteria

- Better Auth runs against the locked prefixed-TEXT-ID identities for core auth entities under the selected Drizzle/D1 adapter (Q63 evidence); failure is surfaced, not worked around with integer IDs. [Q11, Q63]
- Every registered route surface — API, HTML fragment, and mutation — enforces server-side authorization and applicable CSRF/origin rules; there is **no exempt or unprotected profile**, and `HX-Request` or similar presentation headers are rejected as auth. [Q59, Q68]
- Denied, undeclared/unprotected surfaces return denial evidence; expired sessions and forbidden origins/CSRF are rejected per Q68's closed design. [Q68]
- Token issuance/scopes/revocation respect the same role-to-permission-set boundary as interactive sessions (Q68 design). [Q50, Q68]
- Public forms are protected by server-validated Turnstile and by the core rate-limit/abuse limits chosen in Q68; rate-limit concurrency/storage is demonstrated under Workers (Q68 evidence). [Q59, Q68]
- Untrusted upload/content cases are validated and sanitized; CSP/security headers remain intact and are not weakened by the selected presentation implementation. [Q59]
- First-admin bootstrap/recovery is exercised (Q68 evidence), and Q68 has closed before affected auth/security/public-surface implementation and MVP deployment. [Q59, Q60, Q68]
- The locked security protections compose with the module RBAC and the Q40/Q47 contract boundaries without violating frontend independence. [Q22, Q25, Q50, Q59]
- Local-first sync is server-authorized: a client pulls only its permitted working set, a pushed change-set failing authorization is rejected whole and surfaced, and offline edits are authorized at sync — never trusted from the local store. [Q50, Q59, Q70]

## Post-MVP scope and explicit non-goals

- **No role/permission split for Yomban.ink's own maintenance:** single owner, no team-roles gap to solve; the module RBAC is a product capability for consuming apps. [Q3]
- **No permissive or opt-out security profiles:** every surface carries an applicable locked profile; the MVP does not ship an "unprotected" route tier. [Q59, Q68]
- The concrete Q68 design (auth methods, first-admin mechanism, rate-limit storage/limits, surface profile shapes) is **not** decided by this spec and is not an MVP shortcut; it closes in spike plan 000. [Q59, Q68]
- No alternative identity scheme (e.g. INTEGER PKs, or routing identity through addressability) in remainder scope. [Q11, Q18]
- rate-limit/abuse strictures on Turnstile alone are insufficient; Turnstile is not a substitute for auth/API/upload limits. [Q59]
- No weakening of CSP or other protections to accommodate a frontend/presentation library. [Q22, Q59]

## Related specifications

- [Product scope and MVP](001_product-and-mvp.md)
- [Module platform contract](002_module-platform-contract.md)
- [Data and migrations](003_data-and-migrations.md)
- [Clients and presentation](004_clients-and-presentation.md)
- [Content and editing](005_content-and-editing.md)
- [CLI and distribution](006_cli-and-distribution.md)
- [Operations and quality](008_operations-and-quality.md)
- Spec index: [000_index.md](000_index.md)
- Historical discovery: [understanding.md](../discovery/understanding.md); amendment record: [understanding-amendments-001.md](../discovery/understanding-amendments-001.md)