# Q54 spike harness — workflow transitions & optimistic saves (real D1)

Non-product evidence for plan_000 phase_002 task 2.2: proves the content-workflow
semantics designed in `docs/plans/000_spike-plan/designs/q54_content-workflows.md`
against **real D1** via `@cloudflare/vitest-pool-workers` (Miniflare-backed local D1).

This is a fixture harness only — nothing here is promoted into the platform: no product
migration runner, no media pipeline, no UI, no product code.

## What it proves (design §§2–9 / 005 §8 R1–R6, workflow-input portion)

- **R1 — field kinds:** text, rich_text, media reference, relation reference and
  repeater (ordered child groups riding the aggregate root) persist and read back.
- **R2 — transitions & history:** draft→review→published (revision 1), review rejection
  back to draft, illegal transitions rejected (draft→published skip, publish-in-place,
  scheduled without a future time), scheduled future publish via a revision and firing at
  schedule time, post-publish revision appending revision 2 while revision 1 stays intact.
- **§4 — immutable history:** failed publish retains pre-attempt state and records a
  failed-attempt EVENT (not a revision row); revision rows are append-only and queryable.
- **R3 — optimistic revision checks:** stale base revision and concurrent overwrites are
  rejected server-side (atomic conditional UPDATE — exactly one writer per base wins),
  newer data is preserved, and a rejection is never reported as success.
- **R4 — save semantics:** a late/failed save leaves the server record untouched, the
  draft is never discarded and never claims publish success.
- **R6 (workflow-input portion):** preview is permission-gated — public role denied on
  draft/review, expired session denied, author sees own draft, public sees only the
  published revision.
- **Ownership:** media references must resolve to a media-module-owned record (Q58);
  relations must reference an existing record of the target type.

## Layout

- `src/schema.ts` — Drizzle fixture schema (records = aggregate root with prefixed
  TEXT ids `cnt_/rev_/evt_/med_`; revisions; history; media fixture records).
- `src/proof.ts` — the `WorkflowEngine` proof engine (transition guards, save/publish
  services, optimistic checks, preview gate).
- `src/proof.test.ts` — the behavioural proofs (TDD; persisted-row inspection).
- `migrations/` — Drizzle-generated fixture migrations (see `migrations/README.md`).

## Verify

From the repo root (each must exit 0):

```bash
pnpm --dir spikes/q54_content-workflows install --frozen-lockfile
pnpm --dir spikes/q54_content-workflows test       # vitest + vitest-pool-workers (real D1)
pnpm --dir spikes/q54_content-workflows typecheck  # tsc --noEmit
pnpm --dir spikes/q54_content-workflows lint       # biome check .
pnpm --dir spikes/q54_content-workflows build      # tsc
```

Regenerate migrations after a schema change: `pnpm --dir spikes/q54_content-workflows generate`
(drizzle-kit), then re-run the suite.

## Out of scope (owned elsewhere)

Cache isolation / propagation / read-your-writes (Q67), durable publish effects & retries
(Q66), rich-text sanitization mechanics (Q59/Q68), product migration runner & placement
(Q63/task 2.3/2.4), media pipeline (Q58 implementation), locks/sync mechanics (Q70).
