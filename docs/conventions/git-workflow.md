# Git Workflow — Yomban.ink

Source: onboarding answer Q21 (confirmed).

## Branches

- **Direct-to-`main`.** Solo repository — no PR ceremony. The default branch is `main`.
- Branch naming is **optional**, for larger plans if/when wanted. If used, prefer a
  conventional prefix (`feat/`, `fix/`, `docs/`, `test/`, `refactor/`, `chore/`, `ci/`) +
  kebab-case description.

## Commits

- **Conventional Commits:** `<type>(<scope>): <description>`. Types: `feat`, `fix`, `docs`,
  `test`, `refactor`, `chore`, `ci`. Imperative mood (“Add module”, not “Added module”).
- **One task → one scoped commit.** A task’s deliverable (files + its test + the plan marker)
  lands as ONE commit; there is no separate close/landing commit — the file move + pointer
  clear + ADR ride the same commit.
- **Commits are dev-triggered only.** The agent stages and proposes; commits happen only when
  the dev invokes the flow’s commit verb (or otherwise explicitly gates that commit). Prior
  approval for one commit never carries over to the next.
- **No red.** Don’t commit if typecheck/lint/tests fail — fix first.
- **Commit as the owner** (Fred Every — `git config user.name` / `user.email`).

## What NOT to commit

- Secrets (better-auth signing keys, tokens, binding IDs) — use `wrangler secret put` /
  `.dev.vars` (gitignored). `wrangler.toml`/`.jsonc` declares bindings; a committed
  `.dev.vars.example` carries **non-secret** dev values only.
- Build artifacts / generated bundles that can be rebuilt, `node_modules/`, `.wrangler/`,
  `dist/`, logs, `.DS_Store`.
- Real `.env` / `.dev.vars`.

## Solo-project note

There is **no PR/branch process in force today** (documented reality, not aspiration — a
multi-developer/collaborative PR workflow is a residual open question, deferred until a second
developer joins).
