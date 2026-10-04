# Subagent Conventions — Yomban.ink

Source: onboarding answers Q23 (confirmed) + the Orca flow.

## When to delegate

- **Fresh subagent per task, serial only.** No parallelism for now (defer until the dev opts in).
- Delegate **one implementation task per subagent** — each Orca task is self-contained (files,
  acceptance, verification). Never bundle “tasks X.Y through X.Z” into one subagent.
- The orchestrating session sequences work and owns the gates; subagents receive a
  self-contained goal and return a self-contained result.

## What a subagent prompt carries

A subagent knows **nothing** about the parent conversation — every fact it needs must be in the
prompt (subagents cannot use `clarify`):

- The exact task block (Objective / Files / Acceptance / Verification) — verbatim, not paraphrased.
- The relevant spec / best-practice / convention sections pasted in (not “refer to the spec”).
- The blocking dependencies and the shape of anything it consumes (e.g. a service that must exist).
- The non-negotiables that apply (see `AGENTS.md`).

## Toolset

- Use the **minimum sufficient toolset** (`terminal` + `file` covers the whole workflow).
- No nested delegation (max spawn depth 1 — subagents are leaves). Don’t give a subagent the
  `delegation` capability.

## Verification

- Require **concrete output**: commands run + results (test/lint/typecheck/build), and the exact
  list of files created/modified. A self-reported “done” without output is not verification.
- **Every implementation gets a separate review** — no agent verifies its own work. Reviews are
  artifact-only (diff + task definition + just enough context), never conversation history.

## Platform note

The platform’s own **AI-scaffolding command** (Q31) is a *product* capability for consumers of
Yomban.ink — separate from this repo’s Orca development workflow. Consumer AI orientation need
not mirror Yomban.ink’s own Orca process.
