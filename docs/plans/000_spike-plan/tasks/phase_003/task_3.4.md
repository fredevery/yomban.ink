---
title: Design local-first datastore and sync mechanics
created_session: '20261006_210311_463e93'
sessions: []
approved: false
---

# Task 3.4 — Design local-first datastore and sync mechanics

> From: plan_000 phase_003 task 3.4 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_003.md

## Goal

Concretize Q70 confirmed shape without reopening Drizzle, identity or atomicity locks.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 3.3

## Blocked by

- 3.3

## Parallel

false

## Files

- Create: `docs/plans/000_spike-plan/designs/q70_local-first-sync.md`
- Create: `docs/plans/000_spike-plan/evidence/q70_local-first-sync.md`
- Create: `docs/decisions/0009-local-first-datastore-and-sync.md`

## Acceptance

Specify actual browser SQLite worker/OPFS driver and async Drizzle proxy seam, same
sqliteTable/query code, browser-safe exports, session lifecycle and class-1 vs class-2
physical separation. Aggregate root/children declarations and multi-root action boundaries;
local mutation+change-row transaction and WAL feasibility. Change-set envelope/order/group/
idempotency, single D1 batch with server-derived writes, fail-stop/rejected bucket,
per-field base/rev three-way conflict and merge/fork. Server-clock advisory leases,
renewal/expiry/live-user no-steal/same-user takeover/offline provisional; record
remote-status not publish state. Server-authoritative authored/cache/remote-only working
sets, poll-on-focus/interval/reconnect push/pull/renew transport, remote-apply pause per
actively leased record, watched/conflict-only alerts + global sync status. Current+N-1
payloads, too-old read-only/export, one-way local schema migration with snapshot, tombstone
retention+all-replica ACK/GC and explicit purge. Couple with Q65 erasure/recovery and
Q66/Q67 security/consistency inputs.

## Verification

Map all Amendment 001 §§1–8 risk resolutions and Amendment 002 privacy/MVP scope to proof
cases. Inspect actual SQLite driver/OPFS/Drizzle/proxy support including Safari/browser
matrix and WAL requirements; unsupported mandatory behavior is a blocker requiring dev
reconciliation, not a silent in-memory fallback.

## Execution notes

Lease TTLs/poll cadence/schema versioning/storage isolation decisions are spike-owned
explicit policies; no new query language, CRDT/event bus, native-wrapper MVP delivery or
whole-remote replica.

## Commits (draft)

`docs(spikes): design local-first datastore and sync mechanics (3.4)` — proposal only; dev-triggered.
