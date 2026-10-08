---
title: Design coordinated backup/restore, retention and replica erasure
created_session: '20261008_165607_7dd859'
sessions: []
approved: false
---

# Task 4.7 — Design coordinated backup/restore, retention and replica erasure

> From: plan_000 phase_004 task 4.7 · spec: docs/plans/000_spike-plan/000_spike-plan.md
> Phase file: docs/plans/000_spike-plan/phases/phase_004.md

## Goal

Specify Q65 recovery and erasure primitives reaching server/assets/client-local replicas.

## Package

None — design/evidence or isolated non-product spike harness.

## Depends on

- 4.6

## Blocked by

- 4.6

## Parallel

false

## Files

- Create: docs/plans/000_spike-plan/designs/q65_recovery-erasure.md
- Create: docs/plans/000_spike-plan/evidence/q65_recovery-erasure.md
- Create: docs/decisions/0013-backup-restore-and-replica-erasure.md

## Acceptance

D1 export direction stays locked; compare/select separately protected recoverable R2 copies, never unavailable native bucket versioning or revisions-alone backup. Define consistent record/object reference cut, credentials/isolation and protection from deletion of primary copies, retention/deletion/recovery expectations with explicit RPO/RTO/design assumptions, media keys/ownership and migration/removal recovery. Define classification/erase hooks, tombstones and purge across D1/R2/cache/OPFS replicas, offline/revoked/reconnecting replicas, pending-ACK/expiration/rebuild policies and no resurrection after restore/replay. Consumer retention/legal policy is not selected. Q70 snapshots/export and replica wipe limits explicit; cannot guarantee wiping an unreachable device.

## Verification

Map 008 §Q65, 007 privacy, Q63 failure/removal and amendments 001/002 to concrete recovery/erasure steps plus owner-verifiable assertions. Resolve restore-vs-erasure conflict and replica horizon with dev acceptance; no vendor silently chosen.

## Execution notes

Read the actual selected dependencies and owning specs; record choices/assumptions at the dev gate before changes. Keep outputs scoped and evidence honest.

## Commits (draft)

docs(spikes): design coordinated backup/restore, retention and replica erasure (4.7) — proposal only; dev-triggered.
