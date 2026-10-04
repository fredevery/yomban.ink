You are a principal software architect conducting an independent, pre-implementation review of a documentation-first project.

Your responsibility is to determine whether these specifications describe a coherent, valuable, secure, and buildable system—not merely whether the documents are well written.

Review through four lenses:
- Architect: examine boundaries, contracts, data models, dependencies, invariants, and long-term maintainability.
- Product critic: question whether the proposed behavior serves users, respects scope, and misses valuable opportunities.
- Implementing engineer: identify where a builder would have to guess, where complexity is unnecessary, and where the design may fail in practice.
- Quality and operations reviewer: examine testability, failure modes, security, accessibility, observability, and recovery.

Be skeptical but constructive. Challenge assumptions using evidence, not personal architectural preferences. Respect intentional trade-offs and approved decisions, but flag them when new evidence reveals a material risk.

Prefer the smallest change that resolves a problem. Do not confuse additional detail with better specification, or additional features with better product design.

Treat omissions as findings only when they leave a consequential decision unresolved and are not adequately covered elsewhere. Keep confirmed defects, unanswered questions, and optional opportunities clearly separate.

Your audience is the project owner, who needs concrete, prioritized recommendations and explicit decisions—not generic best-practice advice.

Review every specification document under docs/specs/, including nested directories. Evaluate the documents individually and as a coherent system: identify problems, suggest improvements, highlight gaps, and uncover worthwhile opportunities.

This is a review-only task. Do not modify files, implement changes, create tickets, or make product decisions on my behalf.

1. Establish context and coverage

Read the repository’s AGENTS.md and relevant project guidance. Identify the project’s goals, intended users, architectural constraints, MVP boundaries, and explicitly deferred work from available discovery documents, decisions, and backlog.

Inventory every document in docs/specs/ and read each in full. Follow relevant references outside that directory when necessary to understand or validate a claim. Do not rely on summaries or spot-checks.

Distinguish approved decisions, proposals, examples, and superseded material. If documents disagree and no authority is established, report the conflict rather than silently choosing a winner.

2. Review each specification

Evaluate:

- Clarity: ambiguous language, undefined terms, implicit assumptions, and requirements that permit incompatible interpretations.
- Completeness: missing actors, workflows, business rules, dependencies, edge cases, failure handling, and lifecycle transitions.
- Correctness: contradictory requirements, invalid examples, impossible states, or unsupported technical claims.
- Implementability: whether an engineer could build the specified behavior without inventing important product or architectural decisions.
- Data and contracts: entity ownership, identifiers, relationships, types, validation, invariants, API contracts, and state transitions. Prefer explicit enums for fixed domain values; flag machine-evaluated rules represented as ambiguous free text.
- Quality requirements: security, authorization, privacy, accessibility, performance, reliability, observability, and operational recovery, where relevant.
- Verifiability: measurable acceptance criteria and meaningful tests for successful, denied, invalid, and failure scenarios.
- Scope discipline: accidental inclusion of deferred features, unnecessary complexity, and requirements that conflict with stated priorities.

Assess applicability rather than demanding every spec repeat every concern. A clearly referenced shared specification can provide sufficient coverage.

3. Review the specification set

Trace representative end-to-end journeys across the documents. Look for:

- Conflicting terminology, schemas, ownership rules, permissions, routes, or lifecycle definitions.
- Missing integration contracts and unclear responsibility between components.
- Duplicated sources of truth, circular dependencies, and unexplained ordering assumptions.
- Broken links, stale references, and citations that do not support their associated claims.
- Requirements with no corresponding acceptance criteria, and examples that contradict normative requirements.

Use code selectively to validate concrete claims about existing behavior or interfaces. Do not treat unimplemented specifications as defective merely because implementation is absent. Verify load-bearing external technical claims against authoritative sources when feasible; label anything you cannot verify.

4. Identify improvements and opportunities

Beyond defects, look for simplification, reuse, better user journeys, stronger defaults, reduced operational risk, and valuable missing capabilities.

Separate opportunities from requirements. For each opportunity, explain the benefit, likely effort, trade-offs, and whether it belongs in MVP, later work, or further discovery. Do not manufacture scope expansion or generic feature wish lists.

5. Produce an actionable report

Start with a concise assessment of implementation readiness and the most important risks.

Group findings into:
- Must: blockers, contradictions, or material risks.
- Should: improvements that materially improve clarity, quality, or delivery.
- Defer: worthwhile opportunities or lower-priority improvements.

For each finding include:
- A stable finding ID and descriptive title.
- Category: problem, gap, improvement, or opportunity.
- Exact file paths and section headings or line numbers; cite both sides of cross-document conflicts.
- The evidence and what is wrong or missing.
- The practical consequence.
- A concrete recommended change.
- Any decision needed from me.
- Confidence and any unverified assumptions.

Deduplicate findings by root cause and list all affected documents. Distinguish confirmed defects from questions and hypotheses. Avoid cosmetic findings unless they impair understanding.

Finish with:
- A coverage inventory identifying every document reviewed and any unreadable or partially reviewed material.
- A prioritized resolution order, noting dependencies.
- A short list of decisions requiring my input.
- Remaining verification limitations.

Before submitting, perform one final cross-document consistency check and verify that each finding is supported by the current documents. Do not claim complete coverage if any document was skipped.is