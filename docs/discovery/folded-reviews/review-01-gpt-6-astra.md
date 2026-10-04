PASS-with-findings. The document captures the direction well, but I would correct several technical claims and make the outstanding exploration work more explicit before using it to generate the baseline.

Reviewed directly and with independent reviewer sa-0-8c9aa434. The validator passes: 47 questions, 41 ANSWERED, six DEFERRED, zero OPEN. That confirms structural validity—not architectural completeness. No project files changed.

All references below are to docs/discovery/understanding.md.

Must fix before seeding the baseline

1. Correct the ID rationale and the idempotency claim.
   Q11, line 100; Q18, line 149

   Two statements came from my earlier advice and were too strong:
   - INTEGER keys “break the multi-datastore future.” They do not inherently do that; they require additional identity coordination or mapping.
   - “server accepts if unique → idempotent create.” A uniqueness constraint alone does not define safe retry behaviour, ownership checks, or handling of a repeated ID with different data.

   Keep your accepted prefixed TEXT-ID policy. Replace the rationale with “supports independently generated identities without coordinating database sequences.”

   Explicitly track the remaining mechanics: UUIDv7 versus ULID, prefix registration, whether client IDs are temporary or final, and duplicate-request handling. Time-sortable IDs should not be treated as guaranteed global event ordering.

2. Make every exploration spike a pre-implementation prerequisite.
   Q6, line 65; Q19, line 156; Q38–Q47

   Q6 still says “four exploration spikes”; there are now six. Its implementation gate therefore omits Q45 and Q47.

   Use Q19 as the authoritative inventory and make Q6 say:

   “All exploration spikes listed in Q19 are deferred only from onboarding. They must conclude before implementation begins.”

   Five deferred questions also have empty Answer fields. That is validator-valid, but weak as a handoff. Record the deferral decision, intended outcome, and what it blocks. Label plan 000 as planned—not yet authored.

   My previous proposed doc map was wrong to place these under backlog: you explicitly classified them as prerequisite project work.

3. Separate locked principles from unresolved mechanisms.
   Q9, line 86; Q18, line 149; Q46–Q47, lines 345–352

   Q9 says Shared Core packaging is an “open sub-question” without giving it a specific home. Assign it to Q40’s composition exploration.

   Q46 already locks a framework-agnostic client contract, but Q47 asks whether to support one. Reframe Q47 around how that contract works: headless behaviour, renderer interfaces, admin contributions, and framework-free exports.

   Completing that spike should produce a design—not automatically commit the MVP to shipping React/Vue/etc. renderers.

4. Clarify module ownership versus execution boundaries.
   Q8, line 79; Q20, line 163; Q28–Q40

   “Admin Dashboard UI Components” sit on the server side of the diagram. That may describe packaging or responsibility, but the document never distinguishes that from where the UI executes.

   Have Q40 explicitly resolve:
   - Server-only, framework-free client, and renderer-specific exports.
   - Which module facets are optional—for example, a service-only module.
   - Where admin components render and how they are composed.
   - The application composition root that imports both core and modules.

   This also reconciles “core wires modules” with “core never depends on a module”: the core can consume registered contracts without importing concrete feature packages.

Should improve before implementation planning

5. Turn “apply and log migrations” into a proper exploration topic.
   Q10, Q25, Q37, Q45

   Module-owned migrations are a reasonable choice, but iterating over modules is not yet a migration design. Expand Q45 to cover:
   - Shared D1 database versus separately bound databases.
   - Table and migration-name collisions.
   - Dependency ordering, persistent migration history, partial failures and retries.
   - Better Auth schema ownership and migration integration.
   - Safe module removal and retention of existing data.

   Clarify “no raw SQL outside Drizzle” too. Drizzle-generated SQL migrations still need an execution path; Better Auth’s Drizzle integration generates schema but leaves migration handling to the ORM/tooling.

6. Reconcile the core boundary instead of letting examples define it accidentally.
   Q25, line 198; Q37–Q39, lines 282–296

   Q37 puts media data in core, while Q39 says features are ordinary modules. Decide whether media is an intentional core exception or whether core provides storage infrastructure and a media module owns media records.

   Similarly, database, object storage, cache, queues and auth should not all be described as one “datastore interface.” Use “core service/capability interfaces,” with datastore access as one capability.

   Keep Q38’s inventory explicitly provisional. Its email/queues/component-kit examples should not silently become mandatory dependencies of every generated project.

7. Define what “installed platform” and “AI scaffolding” actually mean.
   Q31, line 240; Q44, line 331

   These are central to the reuse goal but remain underspecified:
   - Which files are generated and then project-owned?
   - Which parts remain installed, upgradeable platform packages?
   - How does a consuming project receive platform fixes without regenerating itself?
   - Does AI scaffolding mean AGENTS.md, architecture context, module-authoring guidance, skills, or agent configuration?

   Give this a dedicated exploration question. Also separate Yomban’s own Orca development workflow from what Yomban generates for consumers; they need not be identical.

8. Make the production-ready MVP testable.
   Q7, line 72; Q14–Q16; Q46

   “Robust enough” captures your intent but does not give an implementer a completion gate. Proposed acceptance areas:
   - A clean generated project installs, runs, tests and deploys.
   - Authentication and server-side permissions work.
   - An authorized user edits content and the deployed client reflects it.
   - Migrations work from both an empty database and an existing version.
   - Configuration, secrets, diagnostics and recovery are documented.

   Q40/Q47 should also distinguish a reusable web client from its deployment mode. SvelteKit server rendering and a Capacitor-packaged web bundle have different constraints. Clarify whether mobile is an MVP deliverable or a supported architectural direction.

9. State Workers-specific constraints without implying generic server capabilities.
   Q8/Q30 “filesystem”; Q14–Q16

   Workers do have filesystem APIs, but the writable temporary filesystem is request-local and non-persistent. Persistent files need an appropriate storage service such as R2.

   Also distinguish the local CLI runtime from the deployed Worker runtime. The scaffold command writes project files locally; that does not imply equivalent filesystem behaviour in production.

Document-quality improvements

10. Make this easier for a fresh session to use.
    Introduction; Q14–Q16; Q22; Q26

    - Add a short current-understanding summary: purpose, locked stack, module/core model, MVP goal, and prerequisite spikes.
    - Keep initial guesses as historical defaults, but state that Answer fields govern.
    - Label commands and capabilities as planned. “A seed path exists” is currently false: there is no implementation yet.
    - Qualify framework-source references. The cited questionnaire and validator are not present at those relative paths in this project.
    - Have Q22 cross-reference all invariants in Q11/Q25 rather than maintain an incomplete duplicate.
    - Clarify whether enums are shared within each module or collected platform-wide; the current wording permits both interpretations.
    - Restore the complete onboarding sequence in Q26: baseline write → review → approval → commit → board/state → spike plan.

Technical references checked

- ID generation: https://www.rfc-editor.org/rfc/rfc9562
- Idempotency: https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2
- D1 migrations: https://developers.cloudflare.com/d1/reference/migrations/
- Better Auth database integration: https://www.better-auth.com/docs/concepts/database
- Workers filesystem: https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/

Recommendation: preserve the agreed direction, correct the inaccurate rationale, and strengthen the spike questions. There is no need to solve the entire platform during onboarding—but every unresolved decision should have an explicit home rather than hide inside an ANSWERED paragraph.