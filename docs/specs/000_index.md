# Yomban.ink specifications

Yomban.ink is a modular, composable application platform—not a CMS—that supplies framework-free infrastructure and capability contracts for project-owned applications. The MVP targets a deployed, end-to-end scaffold with a functional content/admin/editing experience; core frontend independence is locked, while the public starter and dashboard/controller/panel implementations remain unselected.

## Specification map

Read in numeric order for the platform narrative, or open the focused domain spec directly. “Locked” describes the settled direction; it does not approve any candidate implementations or close named deferred design gates.

| File | Domain | Decision status |
|---|---|---|
| [001_product-and-mvp.md](001_product-and-mvp.md) | Product scope, MVP, pilots and non-goals | Product category and MVP outcome locked; representative proving modules selected later; no UI starter selected |
| [002_module-platform-contract.md](002_module-platform-contract.md) | Platform architecture, core/module boundary and module contracts | Build-time composition, module principles and registry services locked; Q38/Q40 mechanics pending |
| [003_data-and-migrations.md](003_data-and-migrations.md) | Data ownership, identifiers, D1/Drizzle and unit of work | D1/Drizzle, module-owned schema, prefixed TEXT IDs, media-module record ownership and single-D1-batch atomicity locked; Q63 migration mechanics pending; Q70 client datastore/sync additive |
| [004_clients-and-presentation.md](004_clients-and-presentation.md) | Framework-free client contracts, public/admin presentation and host editing seam | Frontend independence locked; Q40/Q46/Q47 choices remain open, with Q54 workflow input; candidates are not selections; Q70 local-first client datastore/sync additive |
| [005_content-and-editing.md](005_content-and-editing.md) | Content model, publishing, dashboard and in-situ editing | Content/admin/editing are MVP capabilities; Q54 workflow design pending; search is post-MVP |
| [006_cli-and-distribution.md](006_cli-and-distribution.md) | CLI, repo distribution, package and contract upgrades | Repo install, package scope and release/versioning direction locked; Q40 install/generation mechanics pending |
| [007_security-and-identity.md](007_security-and-identity.md) | Authorization, auth boundary, secrets and security profiles | Baseline protections and role/scope model locked; Q63 compatibility evidence and Q68 affected-work mechanics pending |
| [008_operations-and-quality.md](008_operations-and-quality.md) | Quality, delivery, observability, jobs, caching and recovery | Operational direction locked; Q65–Q67 affected-work designs remain gates before their affected work and MVP deployment |

## Unresolved design gates

The discovery record’s Q19 is authoritative for sequencing and scope. A deferred item is not an approved mechanism, and a planned ADR is not a design approval. Foundational spikes produce one ADR plus a concrete design and verification evidence. The index and focused specifications do not replace project-level engineering conventions or workflow documents; Q20–Q27 are summarized where relevant in [Operations and quality](008_operations-and-quality.md), while Q23/Q26/Q27 process details remain handoff/meta context rather than platform design. Q53 config/secrets mechanics are owned by [Security and identity](007_security-and-identity.md), with module manifest declaration in [Module platform contract](002_module-platform-contract.md). Q67 gate authority is [Operations and quality](008_operations-and-quality.md); [Content and editing](005_content-and-editing.md) consumes its guarantees and supplies workflow needs.

1. Q38 first: inventory core/server/headless-client capabilities and required-versus-optional policy. This blocks capability verification and foundational implementation; it does not decide packaging or execution.
2. Q40, Q47, Q54 and Q63 are foundational design work. Q40 owns package/export/composition/deployment/installation/lifecycle mechanics; Q47 defines framework-free client/wire/host/presentation mechanics and explicit dashboard/controller/panel choices; Q54 defines the content/publishing/editing semantics they need; Q63 specifies database placement/migration mechanics and proves Better Auth compatibility with prefixed TEXT IDs. Q70 is the additive local-first client datastore + sync gate (browser-local SQLite store and the sync/lock/conflict layer; reopens no locked decision) and is an **MVP deliverable** — its affected implementation ships in the MVP. Final Q40/Q47 designs close together after Q54 supplies workflow input. These gates precede foundational implementation as specified in the linked specs. Q46 is the separate reopened public-site starter choice: it blocks starter scaffolding and MVP public-client implementation, not all foundational platform work. MVP completion requires the starter to be selected, so **Q46 closes alongside Q40/Q47 after Q54 supplies workflow input**; MVP public-client implementation waits on that joint closure.
3. Q65–Q68 are different: each is an affected-work gate, closing before its own affected implementation and before MVP deployment, not a blanket prohibition on unrelated work. Q65 is backup/restore; Q66 durable side effects/retries/idempotency; Q67 author read-your-writes, public propagation and preview isolation; Q68 security surface profiles, rate limiting and first-admin/auth bootstrap.
4. Q69 is explicitly post-MVP; it decides the purpose of the `yomban.ink` site and does not block platform/scaffold work. Search, mobile delivery and additional complete production UI implementations are also post-MVP.

The public-site starter, bundled dashboard, overlay controller and editing panel are separate choices and none is selected. Hono-rendered HTML/htmx and plain-TypeScript-controller/htmx-panel are evaluation candidates only. Q42’s completed pilot audit supplies candidate modules and shared-platform implications; it does not commit the platform to implement every audited module. The MVP plan will select a representative pilot-derived proof set; complete pilot rebuilds follow MVP.

## Canonical gate table

This is the **single source of truth** for every unresolved design gate — its kind, owner/design
deliverable and what it blocks. The focused specifications (002/003/005/006/007/008) **cite this
table** rather than restating the gate boilerplate (Q19 remains authoritative for sequencing;
this table adds no decision). Every foundational and affected-work gate produces **one ADR plus a
concrete design and verification evidence** — an ADR alone is not closure. Recording a candidate
(e.g. htmx) is not adopting it.

| Gate | Kind | Owner / design deliverable (spike plan 000 unless noted) | Blocks |
|---|---|---|---|
| **Q38** | Foundational (run **first**) | Core capability inventory — server/core/headless-client capabilities + required-vs-optional policy, using Q42's shared-platform implications as input. Inventories capabilities; does **not** decide packaging-vs-execution. | capability verification; finalized Q25/Q30 boundaries; Q37 auth/base infrastructure inventory; foundational implementation start |
| **Q40** | Foundational | Package/export/composition/deployment/installation/lifecycle design: server-only vs headless/server-safe vs browser/DOM vs presentation export boundaries; composition roots importing core + modules without core importing features; per-side core package layout; **packaging-vs-execution** for public app/starter/admin/controller/panel; route/SSR/hosting topology + auth-handler owner, cookies/session propagation, credentialed CORS/trusted-origins/CSRF; install/generated-ownership mechanics + deterministic AI-orientation artifact list + AI-fill/conformance boundary; immutable build metadata vs invocation-scoped context/service lifetime (no binding I/O at init); ID mechanics/prefix collisions + build-time enum/permission aggregation artifact; registry services contributing deferred ops to the same single-D1 unit of work. Exports/topology provisional until Q46/Q47 close. | composition/installation/lifecycle; scaffold ownership/update/AI artifacts; package exports/apps wiring/auth topology; foundational implementation start |
| **Q46** | Foundational (reopened) | Public-site starter selection + bounded support commitment, compatible with the locked framework-free contract. **No starter is selected**; Hono/htmx and plain-TS-controller/htmx-panel are evaluation candidates only. Closes **alongside** Q40/Q47 after Q54 supplies workflow input. | starter scaffolding; MVP public-client implementation |
| **Q47** | Foundational | Framework-free client/wire/host/presentation interfaces: browser-safe exports; public DTOs derived from stored types; shared runtime schemas, route input/output validation, serialization/API/error conventions; DOM-integration separated from headless code; **explicit dashboard/controller/panel implementation choice** (no candidate approved by implication); owns the reactive-framework host **fixture definition**. Closes jointly with final Q40 exports after Q54. | module client/wire/host interfaces; dashboard/controller/panel selection; final Q40 exports |
| **Q54** | Foundational | Content model + publishing/draft/review/schedule/revision semantics; optimistic revision checks; preview permissions; DOM-to-entity/field host integration; lock/conflict interaction with Q70. Supplies workflow needs to Q67. | built-in content/workflow implementation; in-situ editing; pilot content requirements |
| **Q63** | Foundational | Database placement (shared vs separately bound D1), table/migration namespace/collision rules, dependency ordering, persistent ledger, concurrent-deploy lock, failure/retry, data-vs-schema migrations, Better Auth base-schema generation/integration and safe module removal/retention; **required evidence** = Better Auth with the selected Drizzle/D1 adapter using core-generated **prefixed TEXT ids**. | schema/migration/Better Auth persistence implementation; foundational implementation start |
| **Q70** | Foundational (additive; **MVP deliverable**) | Local-first client datastore + sync: browser-local SQLite over OPFS (same `sqliteTable` schema, driven through the core datastore capability seam) + op-log change-sets, presence leases, field-level conflict surfacing, server-authoritative working-set scope. Reopens no locked decision; adds no query-builder abstraction. | client-local store; sync/lock/conflict layer and their affected implementation |
| **Q65** | Affected-work | Backup/retention/coordinated restore + erasure/DSR primitives (reaching client-local replicas); D1 export is the chosen DB direction; native R2 bucket versioning unavailable. | affected ops/data-safety/media-retention implementation, privacy erasure/DSR primitives, MVP deployment |
| **Q66** | Affected-work | Durable side effects/retries/idempotency: post-commit effect contracts, at-least-once assumptions, idempotency keys, enqueue-gap recovery, retry/backoff/dead-letter/replay, payload compatibility. D1 transactional outbox = evaluation candidate only; no MVP event bus. | affected write/job/publishing/effect implementation; MVP deployment |
| **Q67** | Affected-work | Author read-your-writes, publication acknowledgement, tolerated public propagation/staleness window, authoritative version/pointer source, local/global purge, cache-key/permission policy; drafts/previews isolated from shared caches. | affected cache/content-preview/editing-consistency implementation; MVP deployment |
| **Q68** | Affected-work | Security surface profiles (cookie/machine-token/public-form, no exempt route), permitted auth/sign-in/registration methods, first-admin bootstrap/provisioning/recovery, session/credential/origin/CSRF rules, rate-limit limits + Workers-appropriate storage. | affected auth/security/public-surface implementation; MVP deployment |
| **Q69** | Post-MVP | Purpose/dogfooding of the `yomban.ink` site itself (not a spike-plan-000 gate — owned by a future post-MVP website plan). | nothing — does not block platform/scaffold work or MVP deployment |

Affected-work gates (Q65–Q68) close before **their own** affected implementation and before MVP
deployment, but do not block unrelated work whose own prerequisites are met. Foundational gates
(Q38, Q40, Q46, Q47, Q54, Q63, Q70) precede foundational implementation as specified in the
linked specs. Q69 is post-MVP.

## Planned decision records (Q17)

The discovery Answer calls for rationale and rejected alternatives to be recorded for these locked topics: platform/module contract; Workers/Hono/better-auth/TypeScript/pnpm stack; build-time composition/no runtime plugins; module-owned Drizzle/D1 schema with a core migration runner; ID conventions; one deployment per project; built-in content as ordinary modules rather than a CMS identity; and the frontend-independent capability/presentation boundary. This is a planned record set, not existing ADRs and not an additional approval of any open implementation choice. The deferred Q19 spikes produce their own designs/evidence/ADRs; none may silently select the reopened public starter or unresolved dashboard/controller/panel implementations. See [Product and MVP](001_product-and-mvp.md), [Module platform contract](002_module-platform-contract.md), [Data and migrations](003_data-and-migrations.md), [Clients and presentation](004_clients-and-presentation.md), and [Content and editing](005_content-and-editing.md). [Q17, Q19]

## Source and authority

The historical discovery record remains intact at [docs/discovery/understanding.md](../discovery/understanding.md). Its Answer lines are authoritative over historical Agent defaults. Every specification cites source-question numbers so decisions and deferrals can be traced without copying the questionnaire format.

## Reading paths

- Product to implementation boundary: [Product and MVP](001_product-and-mvp.md) → [Module platform contract](002_module-platform-contract.md) → [CLI and distribution](006_cli-and-distribution.md).
- Data, trust and recovery boundary: [Data and migrations](003_data-and-migrations.md) → [Security and identity](007_security-and-identity.md) → [Operations and quality](008_operations-and-quality.md).
- Consumer and editing flow: [Clients and presentation](004_clients-and-presentation.md) ↔ [Content and editing](005_content-and-editing.md).
- Cross-cutting runtime obligations and work gates: [Operations and quality](008_operations-and-quality.md).
