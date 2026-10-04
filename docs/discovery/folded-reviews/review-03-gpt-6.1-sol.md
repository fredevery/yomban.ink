PASS-with-findings — the locked direction is coherent, but contradictory Answer text, incomplete deferral tracking, an unsupported R2 backup mechanism and insufficiently enforced frontend independence make this unsafe to use unchanged as the baseline source.

Read all 64 questions and both prior reviews, found under docs/discovery/folded-reviews/. Mechanically confirmed 59 ANSWERED, five DEFERRED, zero OPEN, and no missing or duplicate Q-numbers. Zero OPEN does not mean every decision is settled. The original review modified no project files; this report subsequently incorporates the dev-requested frontend-framework-agnostic recommendations and htmx dashboard/overlay assessment, with role/status distinctions clarified by a fold-safety pass. These edits update the review report only; understanding.md has not been changed.

Line references below are to docs/discovery/understanding.md.

UI roles, decision status and fold guide

This report separates the platform architecture from the public-site starter, bundled admin dashboard and overlay implementation. Mentioning a technology is not selecting it. Severity tiers indicate priority, not approval; a request to add or edit recommendations in this report is not approval to adopt their stack. This guide governs the UI recommendations in findings 3, 5, 7 and 17.

  Core services / shared contracts / headless clients
    Existing decision: framework-free module client contract and shared contract packages (Q46/Q47/Q51).
    Explicit user direction: the platform should be frontend-framework-agnostic, not merely its API types.
    Proposed architecture: finding 7 extends independence to the package graph, optional module UI, dashboard consumption and overlay host contract. Record accepted principles in Answers only after their disposition is explicit; record remaining mechanics and blockers in Q40/Q47. Neither Svelte/SvelteKit nor htmx belongs in the mandatory core/headless dependency graph.

  Consuming public frontend / public-site starter
    Existing decision: Q46 selects SvelteKit for the MVP apps/web reference client. Preserve that technology choice unless explicitly superseded by the dev. Distinguish the reference public-site starter from the framework-free platform; consuming applications need not adopt it under the proposed independence architecture.
    This does not select a dashboard or overlay implementation. Do not copy Q46 unchanged: correct its mobile-scope contradiction and overloaded UI wording while preserving the existing public-reference technology decision. Whether to replace that public starter is a separate decision, not a consequence of evaluating htmx for admin surfaces.

  Bundled admin dashboard
    Existing scope: a working content/admin dashboard ships in the MVP (Q5/Q7).
    Proposed packaging: an optional first-party application for consumers, replaceable or omittable without disabling the platform's non-UI capabilities. Optional for consumers does not mean absent from the MVP deliverable.
    Implementation not separately settled: the current Q46 apps/web choice is not evidence that the dashboard must use Svelte. Hono-rendered HTML + htmx is an evaluation candidate, not an adopted alternative and not a second dashboard the MVP must also ship. Record the implementation decision and closure gate explicitly within deferred Q40/Q47; Q54 supplies workflow requirements.

  Overlay integration controller / overlay editing panel
    Existing scope: in-situ editing ships as part of the content capability.
    Proposed separation: host integration/controller responsibilities and editing-panel presentation are distinct. The host retains ownership of its content DOM and need not adopt the panel's UI library.
    Candidate only: a plain TypeScript controller with an htmx-powered panel is the prototype in finding 17. Neither this controller/panel implementation nor a Svelte overlay has been approved by adding this report. Track the implementation choice explicitly within Q40/Q47/Q54.

  Acceptance fixtures
    Proposed shared proof: one plain HTML/server-rendered host and one bounded reactive-framework host exercise the same capabilities without core changes, regardless of the selected dashboard/panel technology. These are test fixtures, not additional supported production renderers. Incorporate into Q7/Q61 after acceptance; reuse this proof in the candidate spike.

Fold disposition:
  - Preserve existing decisions by their named role. Record the dev's frontend-independence direction separately from the review's proposed architecture details; a presentation-library ban across the whole project is not implied.
  - Fold accepted technology-independent principles from finding 7 into the mapped Answers/invariants. Assign unresolved mechanics and dashboard/panel implementation choices explicitly to Q40/Q47/Q54, with deferral outcome and blockers. Do not declare the choices ANSWERED merely because a candidate exists.
  - Fold finding 17 as “candidate to evaluate” and its evaluation/acceptance scope only. Selection requires a recorded spike outcome and the dev's explicit decision. Do not fold its conditional prototype instructions as authoritative implementation Answers.
  - Keep backend choices locked: Workers, Hono, better-auth, TypeScript, pnpm, D1/Drizzle and registry-provided module services. “Framework-agnostic” here means frontend independence, not backend portability.
  - Use role-specific names instead of bare “reference UI” or “reference renderer.” A public-site starter, dashboard and panel can use different technologies without requiring multiple platform-wide frontend stacks.
  - Q42's pilot use of Hono SSR and htmx-style progressive enhancement supports investigating the candidate; it is not proof of htmx library usage in both pilots or prior approval for the platform.
  - This guide and the review's prior-fold/locked-check summaries are process metadata. Transfer their concrete dispositions to the appropriate questions, not the review narrative itself. Reconcile the introduction and related entrypoint/dev/acceptance questions using finding 7's fold map; do not append contradictory addenda to existing Answers.

Must fix

1. Q60: “backups via D1 export + R2 versioning” names an unavailable mechanism.
   Lines 477–478.

   Cloudflare’s current R2 compatibility table lists GetBucketVersioning, PutBucketVersioning and ListObjectVersions as unimplemented. Native bucket versioning cannot be the specified recovery mechanism.

   Resolution: preserve the locked requirement for standardized backups, but replace this mechanism with an explicit R2 backup/retention design to resolve before delivery implementation. Distinguish application-level immutable object revisions from a recoverable backup: revisions alone do not protect against deletion of the bucket or all copies. Require a restore test covering both D1 records and referenced objects.

   Source: https://developers.cloudflare.com/r2/api/s3/api/

2. Q48/Q64/Q19: partially answered questions are being advertised as fully settled.
   Lines 165, 385–388, 394–395.

   Q48’s Answer begins “Deferred from onboarding” and still promises, rather than supplies:
     - The generated/project-owned versus installed/upgradeable boundary.
     - How consumers receive fixes.
     - The concrete AI-scaffolding artifact list.

   Its final sentence assigns “scaffold/init install mechanics” to Q40, but Q40’s enumerated scope does not explicitly take ownership of those remaining outcomes.

   Q64 explicitly says the website’s purpose “remains open within this question,” yet is ANSWERED. Neither residual appears in Q19’s authoritative unresolved inventory.

   Q48 also retains “@yomban.ink/* intended” and calls @yomban-ink/* merely “likely,” whereas Q19 and the supplied locked decision make @yomban-ink/* definite.

   Resolution: leave the identity, distribution and release decisions locked. Explicitly transfer the unresolved installation/ownership/AI-artifact outcomes into Q40’s Answer and exit criteria. Give the website-purpose question a separately tracked decision or an explicit post-MVP deferral. Update Q19 accordingly and state @yomban-ink/* unconditionally. Do not leave an open sub-question concealed inside ANSWERED.

3. Q37/Q46: authoritative Answers contradict locked ownership and MVP scope.
   Lines 291, 373; compare lines 81 and 464.

   Q37 first includes media in the core base schema, then says that schema “drops media.” This is a contradiction within one Answer, not merely a stale Agent default.

   Q46 begins “For the MVP” and includes a Capacitor apps/mobile shell. Q7 expressly excludes mobile from the MVP. Q46 also calls “full multi-framework renderer support” something parked in Q47, while Q47 expressly says its spike does not commit the MVP to additional renderers.

   Resolution:
     - Q37 should state the current core schema without media; retain the superseded position only as history if needed.
     - Q46 should name SvelteKit only as the existing MVP public-site reference starter, separate from the later Capacitor architectural direction. Preserve that technology choice unless explicitly superseded; clarify consumer optionality under finding 7 without assigning SvelteKit to the dashboard or overlay panel. Follow the UI fold guide rather than copying Q46 unchanged.
     - Describe Q47 as client-contract design, not deferred delivery of multiple renderers.

4. Q45/Q52/Q41: the unit-of-work promise needs an explicit atomicity boundary.
   Lines 319, 359, 422; Q63 line 364.

   Q45 permits multiple D1 databases/bindings. Q52 says “cross-module writes compose through the registry,” without limiting that composition to one database or explaining whether services execute writes immediately.

   D1 batch takes an already prepared statement list on one database. It does not make arbitrary registry service calls transactional, provide an interactive JavaScript read/branch/write callback, or atomically include another D1 database, R2, queue delivery or cache invalidation.

   Resolution: retain the core batch seam, but state:
     - Atomicity is within one D1 database and one batch.
     - Participating services must contribute operations to the same unit of work rather than independently commit.
     - Read-dependent invariants need suitable conditional SQL/constraints or another explicitly designed approach.
     - Cross-database and external side effects require separate consistency/recovery semantics.

   Assign the service-composition mechanics to Q40 and database-placement constraints to Q63. Otherwise those spikes can independently produce incompatible designs.

   Source: https://developers.cloudflare.com/d1/worker-api/d1-database/

5. Q40/Q46/Q60: deployment and authentication topology has no explicit design owner.
   Lines 312, 373, 478; related Q12/Q59.

   The document identifies apps/api and a SvelteKit renderer, but never says where SvelteKit’s server execution lives relative to Hono. “One deployment per project” does not decide whether these share one Worker, use multiple Workers in one project release, or use a static client with a separate API.

   This is load-bearing for SSR, routing, session propagation, cookies, CSRF, trusted origins and preview deployment configuration. The first prior review specifically requested separation of reusable client code from deployment mode; that point is still incomplete.

   Resolution: explicitly add topology to Q40’s required output. Locate the Hono API, consuming public frontend and its hosting/SSR integration, bundled admin dashboard, overlay integration controller and overlay editing panel as distinct roles. Identify the auth-handler owner and describe browser/SSR session propagation for local, deployed and preview environments. Define platform boundaries independently of a frontend implementation; document the existing SvelteKit public-site starter against those boundaries without assigning it to admin surfaces. Dashboard/panel implementation remains a separate deferred choice; finding 17 is its candidate evaluation, not a deployment decision. This preserves the backend stack and tenancy model rather than making SSR or auth ownership depend on the selected public frontend.

   Better Auth’s Hono integration requires explicit credentialed CORS/trusted-origin handling when origins differ:
   https://www.better-auth.com/docs/integrations/hono

6. Q2/Q31/Q32/Q39: four product references violate the exact naming requirement.
   Lines 45, 248, 255, 304.

   These contain bare “Yomban” or “Yomban-shipped.” They are historical defaults, so they do not override Answers, but the stated requirement applies to every product reference.

   Resolution: use “Yomban.ink” and “Yomban.ink-shipped,” preserving the defaults’ historical/provisional status. Repository paths and the literal lowercase domain remain distinct identifiers.

7. Q8/Q24–Q25/Q28/Q30/Q34–Q35/Q38/Q40/Q46–Q47/Q51: frontend independence must be architectural, not limited to API types.
   Lines 88, 200–207, 228, 242, 270–277, 297–298, 312, 373–380, 415.

   Explicit user direction: the dev prefers a frontend-framework-agnostic platform. The architecture below is the proposed resolution of that direction, not a selection of a dashboard or overlay implementation. Follow the UI fold guide above when recording decisions; authorizing this report's cleanup does not approve every proposed architecture detail.

   Q46/Q47 promise a framework-agnostic client contract, and Q51 provides shared contracts. But Q28 requires server + client halves, Q30 treats admin/client UI as module responsibilities, Q35 declares UI entries without distinguishing optional contributions, and Q38 places a component kit/admin-overlay host in the client-core sketch. These can make the chosen UI implementation a practical platform prerequisite even when API types are framework-free. Presentation responsibilities should not determine the core architecture, package graph or consuming project's frontend.

   Recommended invariant: “Yomban.ink does not require a consuming application to use any frontend framework or presentation library. Core services, module contracts and headless client capabilities are independent of presentation implementations. First-party UI applications and public-site starters are optional consumers of those contracts; presentation-specific contributions are explicitly identified and replaceable.” Frontend independence does not reopen the chosen Workers/Hono/better-auth/TypeScript/pnpm backend stack, D1/Drizzle persistence or registry-service mechanism.

   Proposed architecture and technology-independent requirements:
     - Separate capabilities from presentation. Platform/module services contain business logic, persistence, permissions, configuration and jobs. Headless client capabilities contain typed HTTP clients, validation, editing operations and reusable state/behaviour in plain TypeScript. Presentation packages adapt these capabilities to a consuming application's chosen UI. Neither core nor headless packages import presentation-specific stores, hooks, components, routing, server-action APIs or HTML-swap libraries. Separate browser/DOM-dependent editing code from headless code so server consumers remain viable.
     - Make UI an optional module facet (Q28/Q34/Q35/Q40). A module need not ship both server and client UI halves. A vertical feature slice owns a capability, not every presentation of it. For example, media services, API and a headless upload client can work without a bundled picker component. Dashboard views, public components and editing controls are optional, explicitly presentation-specific contributions; absence of them must not prevent registration or use of the module's non-UI capabilities.
     - Treat the bundled admin dashboard as an optional first-party application, not an inseparable core dependency (Q30/Q38/Q40). It consumes the same capability contracts as other clients; projects can replace or omit it. Preserve the MVP's built-in content dashboard/editing deliverable: optional for consumers does not mean omitted from the shipped MVP. Its implementation remains a separate decision. Standard admin screens can use renderer-neutral field/action/navigation/permission descriptions; complex screens may supply explicitly presentation-specific custom views. A custom view is not automatically portable to another UI implementation. Do not invent a universal component language to hide this limitation.
     - Separate the overlay integration controller from the overlay editing panel (Q40/Q47/Q54). The host-facing integration maps editable DOM elements to content entity/field references, exposes permission-aware editing operations, and reports changes through a documented callback/event interface. The panel provides editing controls using a separately selected presentation implementation. Its host must not have to adopt that implementation. Keep DOM mutations inside explicitly owned editing surfaces; the consuming application owns updates to its content DOM through its host integration. Host-framework independence does not promise that the optional panel has no runtime dependencies. Web Components are an optional packaging technique, not a platform-wide requirement. DOM change notifications here do not introduce a module-to-module event bus.
     - Separate platform scaffolding from public-site starter selection (Q31/Q40/Q44/Q46). Generate backend/module wiring independently of the chosen public frontend template. Preserve the existing public-site starter decision with its explicit role and status in the UI fold guide; it does not select the bundled dashboard or overlay panel implementation. No public starter may determine module structure, contract exports, auth ownership, business-logic execution or the platform deployment model. Do not put reusable module business operations in a frontend framework's server actions or require its route conventions for registration. Use small explicit integration seams rather than a universal router/SSR abstraction. A consumer choosing another frontend does not oblige the MVP to ship a fully maintained starter or dashboard implementation for it.
     - Prove independence during MVP acceptance (Q7/Q61). Use a plain HTML/server-rendered host and a bounded reactive-framework host fixture, regardless of which dashboard/panel implementation is selected. Both must read the same content and exercise authorized editing through unchanged module services/contracts, with page updates performed through the host's own integration. The fixtures are not additional production renderers. Enforce that core, shared-contract and headless-client packages have no direct or transitive dependencies on frontend frameworks or presentation libraries (including Svelte/SvelteKit and htmx), and no server-only dependencies leak into browser contract exports. Selected presentation dependencies belong only to their presentation packages and must not become prerequisites for the host or headless client.

   Fold map after architecture acceptance:
     - Introduction and Q18/Q22/Q24–Q25: state frontend independence once as a platform invariant; distinguish it from the public starter choice and from presentation-specific guardrails. The introduction must not present a starter framework as part of mandatory platform consumption.
     - Q8/Q12/Q28/Q30/Q34–Q35/Q38: distinguish module capabilities, optional presentation facets, public app entrypoints, bundled dashboard, overlay controller and overlay panel. Do not require a client UI entry for every module.
     - Q14/Q31/Q40/Q44/Q46: development commands and scaffolding follow the selected public starter/admin topology. A separate frontend development server is conditional on that topology, not a universal platform requirement. Q46 preserves the existing public starter choice while correcting mobile scope and avoiding any inferred dashboard/panel choice.
     - Q40/Q47/Q54: Q40 owns package/composition/deployment boundaries; Q47 owns headless and host/presentation interfaces; Q54 supplies content/editing workflow semantics. Explicitly track the dashboard and panel implementation choices as unresolved within these existing deferred spikes; a fold records the candidate evaluation and blockers, not a winner. Resolve the coupled designs before treating independence as verified.
     - Q7/Q61/Q62: add the shared two-host acceptance proof and dependency checks. Keep WCAG/performance targets, but identify whether the LCP/INP budgets apply to the public reference frontend, bundled dashboard, overlay experience or multiple surfaces; do not silently broaden or drop them under the overloaded phrase “reference renderer.”

   Q51 already supports this boundary. Finding 17 is a candidate-evaluation brief for the bundled dashboard and overlay editing panel, not a public frontend requirement or a new platform dependency.

Should improve

8. Q35/Q44: the canonical contract and command inventories were not fully updated after later decisions.
   Lines 277, 352; compare Q11/Q36/Q41/Q45/Q49/Q56.

   Q35 omits declarations now required elsewhere: dependencies, exposed services, contract major, ID prefixes, D1 requirements and queue/cron contributions. Q44 claims to enumerate the CLI surface but omits the upgrade command locked in Q49.

   Resolution: make Q35 a complete summary or explicitly call it a partial inventory with references to those questions. Add upgrade to Q44, with an explicit scope distinction between package/code upgrades and database migrate. Keep conformance, ID-prefix and namespace validation in the same canonical manifest design.

9. Q40/Q53/Q55/Q61: service lifecycle is a genuinely missing platform question.
   Lines 312, 429, 443, 485.

   “Registry-provided services,” “validated at boot,” observability sinks and “before a module is registered” leave lifecycle unspecified:
     - What is constructed at build time, isolate initialization and request/job invocation?
     - Where do user/session, transaction and trace context live?
     - Can a cached service retain outdated configuration or secrets?
     - Does the conformance harness run in CLI/CI or deployed Worker initialization?

   Workers can reuse isolates after binding-only changes; Cloudflare specifically warns that globally cached clients derived from bindings can retain old secrets. Workers also prohibit binding I/O outside an invocation context.

   Resolution: add a service-lifecycle question, or explicitly extend Q40 with this scope. Separate immutable registration metadata from invocation-scoped context; define validation before serving each effective configuration; and place executable conformance tests in the build/CLI/CI path rather than leaving runtime registration ambiguous. State that module code is trusted compiled code, not sandboxed by these seams.

   Source: https://developers.cloudflare.com/workers/runtime-apis/bindings/

10. Q51/Q10/Q47/Q59: type-sharing is settled; the wire contract is not.
   Lines 102, 380, 415, 471.

   Q51 answers where shared types live, but its question also promises an API style. It does not distinguish stored entity types from public DTOs or establish serialization, error and runtime-validation conventions.

   A shared TypeScript package does not itself make HTTP responses conformant or prevent server-only dependencies and private fields from reaching client exports.

   Resolution: assign these mechanics explicitly to Q47/Q40: browser-safe contract exports, public DTOs derived or mapped from stored types, shared runtime schemas for the relevant route boundaries, serialization and a common error contract. Include client-only import/build checks in Q61. Keep the locked no-codegen/shared-package approach.

11. Q52/Q56/Q57: durable side-effect and retry semantics are absent.
    Lines 422, 450, 457.

    A successful D1 write followed by a failed enqueue or purge leaves committed data with missing downstream work. Queue retries can repeat effects. Registry services alone do not solve either problem.

    Resolution: add a focused question on post-commit effects and failure recovery. Define at-least-once assumptions, idempotency responsibility, retry/dead-letter/replay behavior and job-payload compatibility across deploys. Decide how important effects survive the commit/enqueue gap—an outbox is a candidate, not a decision to silently impose.

    This does not require adopting the rejected MVP event-bus mechanism. Internal invalidation hooks and durable jobs can remain separate.

    Source: https://developers.cloudflare.com/queues/reference/delivery-guarantees/

12. Q57/Q54/Q7: purge hooks do not specify editing consistency or preview isolation.
    Lines 81, 436, 457.

    Q7 requires edits to appear in the deployed client. Q57 supplies hooks but no visibility guarantee. KV is eventually consistent; even same-location immediate visibility is not guaranteed. Cache API deletion is local to the invoking data center.

    Nothing currently promises immediate global visibility, so this is an underspecified requirement—not proof that the chosen seam is infeasible.

    Resolution: define immediate author read-your-writes versus public propagation expectations, the tolerated public staleness window, and purge-failure recovery. Require drafts/authenticated previews to bypass public caches or use provably isolated keys. If versioned keys are used, specify where the authoritative version is read; a stale KV version pointer does not eliminate staleness.

    Sources:
    https://developers.cloudflare.com/kv/concepts/how-kv-works/
    https://developers.cloudflare.com/workers/runtime-apis/cache/

13. Q59: rate limiting was dropped, and “opt in” weakens “never opt out.”
    Lines 469–471; prior second review line 40.

    The Context asks about “Rate limiting / abuse protection,” but the Answer retains only Turnstile. Turnstile does not define limits for authentication, machine clients, uploads or public API traffic.

    “Modules opt in per surface, never opt out of the defaults” also leaves it unclear whether an undeclared route receives protections or none.

    Resolution: state mandatory baseline protections and explicit surface profiles for cookie-authenticated, machine-authenticated and public-form routes. Preserve Turnstile, require server-side validation, and assign rate-limit policy/storage to the core security design. Include bootstrap of the first authorized administrator and permitted registration/auth methods; Q50’s role model cannot establish these by itself.

    Better Auth’s default in-memory rate-limit storage is specifically identified as unsuitable for many serverless uses:
    https://www.better-auth.com/docs/concepts/rate-limit

14. Q6/Q7/Q33/Q42: prerequisite work, MVP proof and later pilot work are still blurred.
    Lines 74, 81, 263, 326–338.

    Q6 says “Nothing else deferred yet,” although Q54 explicitly defers search and Q46/Q47 exclude mobile/additional renderers from MVP delivery.

    Q33 says the pilot audit “will” produce the module set even though Q42 is complete. Q42 mixes reusable module candidates, project-specific candidates and infrastructure implications; it does not identify a selected MVP build set.

    Q7 puts rebuilding the pilots after MVP, but also calls rebuilding a pilot the measurable definition of done. “Target bar” does not decide whether that is the MVP gate or subsequent validation.

    Resolution: update Q6’s deferral summary and Q33’s completed-audit reference. Label Q42 as the audited input, not a commitment to ship every listed feature. In Q7, distinguish a representative pilot-derived scaffold acceptance scenario from the later full pilot rebuild—or explicitly make a full rebuild the gate. Let the MVP plan select the proving module set without redoing the audit.

Consider

15. Q19/Q38/Q40/Q47/Q63: make spike closure evidential and dependencies explicit.
    Lines 165, 298, 312, 380, 364–367.

    “One ADR” specifies an artifact, not evidence that a risky design works. Q47 says it blocks Q40’s export boundaries, although Q19 schedules Q40 first. Q38 and Q40 both claim the packaging/execution decision. Q63 alone has an empty Answer.

    Resolution: give each spike an owner/output/blocker statement. Make Q40’s export design provisional until Q47 closes, or arrange a joint closure. Assign packaging/execution to one spike. Fill Q63’s Answer with the agreed deferral, intended migration design and implementation blockers.

    For the risky seams, require evidence alongside the ADR: a cross-module batch rollback case, browser-only contract import, and Better Auth’s prefixed-ID path against D1. Better Auth documents custom model-aware ID generation, so the ID policy is plausible; the exact adapter/schema path still needs the test already requested in Q11.

16. Q18/Q28/Q36/Q47/Q58: remove remaining live-wording drift.
    Lines 158, 228, 284, 378, 462.

    Q18 calls framework independence “still under review”; Q28/Q36 still describe Q41 as a future exploration; Q47’s Context still asks “whether”; Q58 calls itself a spike despite its ANSWERED decision and implementation-detail treatment.

    Resolution: describe the settled principles in the present tense and point only unresolved mechanics to their actual owner. Historical Agent defaults can remain historical.

17. Q38/Q40/Q47/Q54: evaluate Hono-rendered HTML + htmx for the bundled admin dashboard and overlay editing panel.
    Lines 297–298, 312, 380, 434–436; related Q7/Q25/Q35/Q46/Q51/Q59/Q61/Q62.

    Candidate to evaluate — not an adopted implementation. The recommendation is to investigate Hono-rendered HTML + htmx for the dashboard and an htmx editing panel with a plain TypeScript overlay controller. The dashboard, controller and panel choices are separate from Q46's existing public-site starter. Follow the UI fold guide: preserve the starter decision unless explicitly superseded; record this candidate and closure gate within Q40/Q47/Q54, not as an ANSWERED stack change. The MVP need not ship parallel dashboard/panel implementations.

    Candidate fit and limitations:
      - Collection lists, filtering, pagination, create/edit forms, validation messages, publish/unpublish actions, permission-aware navigation, media selection/upload forms and settings suit server-rendered HTML with targeted updates.
      - Hono can render full pages and HTML fragments; htmx requests and swaps fragments. Hono's server-side JSX is a template implementation choice, not React and not a requirement for a browser component runtime. If selected, this candidate would not require Svelte/SvelteKit for the bundled dashboard, but would not remove or select a public frontend starter.
      - The candidate HTML presentation routes could call typed module services in-process; they need not make loopback HTTP requests. An htmx publish form and a JSON API client would reach the same business operation, validation and authorization. Q51's shared contracts remain available to JSON/headless clients rather than being replaced by HTML fragments.
      - htmx does not replace all browser behaviour. For the prototype, evaluate focused TypeScript or specialist editor libraries for rich-text editing, drag/drop ordering, image cropping, upload progress, complex nested/repeater fields, unsaved-change tracking and highly interactive previews. Test initialization and cleanup across fragment swaps so editor instances, listeners and unsaved state are not leaked or discarded. Do not assume every interaction belongs in htmx attributes.
      - Q42's pilot Hono SSR/htmx-style progressive-enhancement observations are supporting context for this evaluation, not a platform technology decision or a claim that both pilots use the htmx library.

    Conditional overlay prototype:
      - For the htmx prototype, test a small plain TypeScript integration controller and an htmx-powered editing panel. The controller would locate editable elements, map them to content references, track selection/positioning/navigation and coordinate host updates. The panel would load forms, submit edits/publishing actions, display validation errors and update save status. The separation implements finding 7's proposed host/panel boundary; this particular implementation remains a candidate.
      - In that prototype, confine htmx processing, targets and swaps to the overlay-owned panel. A successful save would produce a documented content-change notification; the consuming host would update its content through its own integration. A plain server-rendered host could refresh a declared fragment or reload; a reactive host could invalidate/refetch and rerender. htmx must not directly mutate framework-owned content DOM.
      - Test that loading htmx for the panel does not take control of unrelated host markup, change a host's existing htmx configuration or require the public page to adopt htmx. Coexistence/isolation is an acceptance condition, not an assumed library guarantee.
      - Candidate custom HTML/htmx dashboard views would be explicitly presentation-specific contributions, not automatically portable components. Renderer-neutral field/action/navigation/permission descriptions could cover standard screens, while custom views remain implementation-specific.

    Technology-independent requirements to preserve whichever implementation is selected:
      - Keep dashboard and editing presentation routes thin; domain operations, validation and server-side authorization belong to shared module services/core capabilities. Consumer replacement or omission of the dashboard must not disable those capabilities. Optional installation is compatible with shipping one functional MVP dashboard.
      - Keep UI attributes, templates, components and HTML-swap machinery outside mandatory module contracts. In this candidate, that excludes hx-* attributes, HTML fragments and Hono JSX components from the required contract. Core, shared-contract and headless packages remain independent of any presentation library, including htmx; this does not prohibit Hono as the chosen backend engine.
      - Preserve host DOM ownership and explicit integration notifications. Confine panel-driven mutations to panel-owned surfaces; the host decides how content changes appear on its page. Define initialization/cleanup for interactive controls and do not lose unsaved state across navigation or presentation updates.
      - Authenticate and authorize every fragment and mutation endpoint. Apply CSRF protection to custom editing routes; Better Auth integration does not automatically protect every module mutation. Define credentials, origins and CSRF handling when host and admin endpoints differ in origin; do not broadly relax request-origin restrictions. A presentation-mode header is not an authorization boundary.
      - Escape/sanitize authored content, preserve the core CSP and keep application-controlled behaviour separate from untrusted markup. Define private/no-store handling for authenticated responses and handling of sensitive client-side history caches rather than allowing drafts/secrets into shared or browser-history caches (pairs with finding 12).
      - Define input validation and session-expiry/authorization errors, preserve input state and manage focus, error announcements, keyboard access and semantic form behaviour. No chosen presentation library alone establishes WCAG conformance.
      - Keep cursor-level interaction local. Save deliberately, or debounce appropriate changes rather than round-trip every keystroke. Use server-side revision/concurrency checks, not client response ordering alone, to reject stale submissions and concurrent overwrites. Failed/late responses must not silently discard a draft or report a successful publish.

    Additional checks specific to the htmx candidate:
      - HX-Request distinguishes presentation mode, not a security boundary. In the prototype, verify authorization/CSRF handling on every fragment and mutation path.
      - Evaluate hx-disable for untrusted regions, alongside sanitization, and disable unnecessary eval-dependent features and script processing from returned fragments. Use external JavaScript event handlers rather than weakening CSP for inline scripting. Treat library controls as defence in depth, not substitutes for sanitization.
      - Configure and test validation responses such as 422: htmx does not swap 4xx responses by default. Verify that expired-session or authorization responses do not become misleading form content. Test focus/announcements and editor lifecycle across swaps.
      - Test the actual history-cache policy; HTTP private/no-store directives must not be assumed to disable a presentation library's own client-side snapshot cache.

    Evaluation ownership, gate and acceptance proof:
      - Q40 owns composition/deployment integration for the candidate; Q47 owns its headless/host/presentation boundary; Q54 supplies content/editing workflow semantics. Evaluation should record evidence, limitations and a recommendation. Adoption of any dashboard/controller/panel implementation requires a recorded outcome and the dev's explicit decision. Do not treat prototype instructions as settled implementation Answers or automatically reopen the public-site starter decision.
      - Reuse finding 7's two-host proof: edit and publish one content item from the candidate dashboard, then edit that item through the candidate overlay on both a plain HTML/server-rendered host and a bounded reactive-framework host fixture. Use unchanged module services/contracts; verify host-owned DOM is never mutated by the panel. These are acceptance fixtures, not additional supported production renderers.
      - Include invalid input, unauthorized/expired sessions, CSP-compatible operation, swap lifecycle cleanup, keyboard/focus behaviour and a stale-revision save conflict. Assess against frontend independence and the surface-specific MVP budgets defined in Q62, not only a reduced dependency list. Keep the shared host/dependency checks even if this candidate is rejected; only htmx-specific checks depend on the candidate.

    References checked during the follow-up assessment:
      https://htmx.org/docs/
      https://htmx.org/attributes/hx-swap/
      https://htmx.org/attributes/hx-swap-oob/
      https://hono.dev/docs/guides/jsx

Prior-review fold verification

The principal additions landed: prerequisite spikes, Q38-first ordering, composition boundaries, D1/Drizzle narrowing, contract versioning, permissions, shared contracts, runtime seams, content exploration, security, delivery and non-functional targets.

The material half-applied or dropped points are:
  - Generated-versus-installed ownership and concrete AI scaffolding: finding 2.
  - Deployment mode and mobile scope separation: findings 3 and 5.
  - Media removal: appended to Q37 without removing its contradictory claim.
  - Rate limiting: finding 13.
  - Deferred-question handoff completeness: Q63 still has an empty Answer.
  - Canonical contract/command inventories: finding 8.

Optional event bus, conformance score and additional renderers were not treated as obligations. Historical counts in the folded review files are not current-state defects.

Already locked — respected

Checked: platform-not-CMS identity; build-time composition; one deployment per project; TEXT prefixed IDs/no INTEGER PKs; per-module enums aggregated platform-wide; Q41 registry services; Q45 D1-only/Drizzle and Q63 migration split; Q48 repo installation/no npm/@yomban-ink scope; Q49 current-plus-N−1 contract majors; Q50 roles/scopes; Q51 framework-free shared contracts; Q52 batch seam; Q53 config/secrets; Q55 observability; Q56 jobs; Q57 caching; Q58 media ownership; Q59 security/Turnstile; Q60 delivery/backups; Q61 enforcement; Q62 accessibility/performance; Q64 tags/changesets; mobile excluded from MVP. Findings constrain or reconcile these decisions rather than propose replacing them. The UI fold guide distinguishes the existing SvelteKit public-site starter decision from frontend independence and the unresolved dashboard/controller/panel implementations. Finding 7 is a technology-neutral proposed architecture; finding 17 is a conditional Hono/htmx dashboard and TypeScript-controller/htmx-panel evaluation brief. Neither selects additional production renderers, changes the public starter by inference, nor puts a presentation dependency in the mandatory module contract.