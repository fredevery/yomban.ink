# Best Practices — IDs & Enums

Do/Don’t guardrails. Source: onboarding answers Q11, Q22, Q25, Q40, Q50; review §9 D3/Q-A.

## IDs — DO
- **Prefixed, sortable, URL-safe TEXT ids** with an entity-type prefix, e.g. `pg_<ulid|uuidv7>`.
- **One core id-service seam** mints ids; modules declare their prefixes in the manifest.
- **Human slugs are secondary unique keys** for externally routable content — identity ≠
  addressability.
- **Client-generated ids** support optimistic UI/offline (provisional; authorization happens at
  sync acceptance, Q70).

## IDs — DON’T
- **DON’T use INTEGER auto-increment primary keys** anywhere.
- **DON’T** route identity through addressability, or add an alternative identity scheme.
- **DON’T** assume time-sortable ids guarantee global event ordering.
- **DON’T** treat uniqueness alone as safe retry/ownership (Q66/Q70 own idempotency semantics).

## Enums — DO
- **Module-owned enums**, PascalCase **`Key = 'Key'`**.
- **Aggregate platform-wide at build** into a **derived artifact** consumed by the RBAC resolver
  and conformance harness — the build collects each module’s enums/permission keys from source +
  manifest, forms the aggregate, and conformance validates names/prefixes/collisions before
  registration.
- **Permission keys:** aggregated form `<ModuleNamespace>:<Member>` (e.g. `Media:Read`);
  entity-scoped form `<ModuleNamespace>:<Entity>.<Member>` where needed. The **composite is the
  key** — `Media:Read` and `Content:Read` coexist without collision.

## Enums — DON’T
- **DON’T** introduce a central runtime enum/permission registry (no runtime registry lookup).
- **DON’T** store fixed-option domain values as bare strings — use an enum.
- **DON’T** implicitly satisfy another module’s permission by a bare member name — cross-module
  composition is **explicit** (direct grant or declared alias).
- **DON’T** hand-maintain a master enum file — the aggregate is derived.
