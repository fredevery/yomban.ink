/**
 * Q54 spike harness — behavioural proofs (TDD, real D1 via vitest-pool-workers).
 *
 * Each test maps to the task 2.2 acceptance bullets and designs
 * q54_content-workflows.md §§3–9 / 005 §8 R1–R6 (workflow-input portion).
 */
import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MediaRegistryFixture, WorkflowEngine } from './proof.ts';
import type { ContentPayload } from './schema.ts';
import { fixtureId } from './schema.ts';

let tick = 0;
const clock = (): string => {
  tick += 1;
  return new Date(Date.UTC(2026, 0, 1, 0, 0, tick)).toISOString();
};

let engine: WorkflowEngine;
let mediaRegistry: MediaRegistryFixture;

beforeEach(async () => {
  tick = 0;
  mediaRegistry = new MediaRegistryFixture();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM history'),
    env.DB.prepare('DELETE FROM revisions'),
    env.DB.prepare('DELETE FROM records'),
    env.DB.prepare('DELETE FROM media'),
  ]);
  const now = clock();
  const mediaId = fixtureId('med', 'banner-001');
  await env.DB.batch([
    env.DB.prepare('INSERT INTO media (id, label, created_at) VALUES (?, ?, ?)').bind(
      mediaId,
      'Banner',
      now,
    ),
  ]);
  mediaRegistry.add(mediaId);
  // 'cnt_second' relation-target fixture record (never published; draft state).
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO records (id, state, revision, published_revision, payload, schedule_at, visible, deleted_at, sort_order, updated_at) VALUES ('cnt_second', 'draft', 0, 0, '{}', NULL, 1, NULL, 0, ?)",
    ).bind(now),
  ]);
  engine = new WorkflowEngine(env.DB, clock, mediaRegistry, async () => {
    const rows = await env.DB.prepare('SELECT id FROM records').all<{ id: string }>();
    return new Set(rows.results.map((r) => r.id));
  });
});

/** Full payload exercising every field kind (R1). */
const fullPayload: ContentPayload = {
  title: { kind: 'text', value: 'Coffee blends' },
  body: { kind: 'rich_text', html: '<p>Fresh roasted</p>' },
  hero: { kind: 'media', mediaId: 'med_banner-001' },
  related: { kind: 'relation', targetRecordId: 'cnt_second' },
  rows: {
    kind: 'repeater',
    entries: [
      { kind: 'text', value: 'row-1' },
      { kind: 'text', value: 'row-2' },
    ],
  },
};

async function createSecondRecord(): Promise<string> {
  const second = await engine.createRecord({ label: { kind: 'text', value: 'target' } });
  if (!second.ok) throw new Error('second record creation failed');
  return second.recordId;
}

/** Seed a published record; returns recordId. */
async function seedPublished(): Promise<string> {
  const target = await createSecondRecord();
  const payload: ContentPayload = {
    ...fullPayload,
    related: { kind: 'relation', targetRecordId: target },
  };
  const created = await engine.createRecord(payload);
  if (!created.ok) throw new Error(`create failed: ${JSON.stringify(created.failure)}`);
  const id = created.recordId;
  await engine.submitForReview(id);
  await engine.reviewApprove(id);
  return id;
}

describe('R1 — content model: field kinds', () => {
  test('persists and reads back a payload exercising every field kind', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
    };
    const created = await engine2.createRecord(payload);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const record = await engine2.getRecord(created.recordId);
    expect(record).toBeDefined();
    expect(record?.payload.title).toEqual({ kind: 'text', value: 'Coffee blends' });
    expect(record?.payload.body).toEqual({ kind: 'rich_text', html: '<p>Fresh roasted</p>' });
    expect(record?.payload.hero).toEqual({ kind: 'media', mediaId: 'med_banner-001' });
    expect(record?.payload.related).toEqual({ kind: 'relation', targetRecordId: target });
    expect(record?.payload.rows).toEqual({
      kind: 'repeater',
      entries: [
        { kind: 'text', value: 'row-1' },
        { kind: 'text', value: 'row-2' },
      ],
    });
  });

  test('media field referencing an unowned media record is denied (Q58 ownership)', async () => {
    const result = await engine.createRecord({
      hero: { kind: 'media', mediaId: 'med_ghost' },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failure).toEqual({ code: 'ownership_denied', kind: 'media', ref: 'med_ghost' });
  });

  test('relation field referencing a non-existent record is denied', async () => {
    const result = await engine.createRecord({
      related: { kind: 'relation', targetRecordId: 'cnt_missing' },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failure).toEqual({
      code: 'ownership_denied',
      kind: 'relation',
      ref: 'cnt_missing',
    });
  });

  test('media fixture records are owned and resolvable (media module owns, Q58)', async () => {
    const rows = await env.DB.prepare('SELECT * FROM media').all<{ id: string; label: string }>();
    expect(rows.results).toHaveLength(1);
    expect(rows.results[0]?.id).toBe('med_banner-001');
    expect(mediaRegistry.owns('med_banner-001')).toBe(true);
  });
});

describe('R2 — workflow transitions and history', () => {
  test('draft → review → published creates revision 1 and a queryable history', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;

    const submit = await engine2.submitForReview(id);
    expect(submit).toEqual({ ok: true, state: 'review' });

    const approve = await engine2.reviewApprove(id);
    expect(approve).toEqual({ ok: true, state: 'published' });

    const record = await engine2.getRecord(id);
    expect(record?.state).toBe('published');
    expect(record?.publishedRevision).toBe(1);

    const revisions = await engine2.getRevisions(id);
    expect(revisions).toHaveLength(1);
    expect(revisions[0]?.revision).toBe(1);
    expect(revisions[0]?.payload).toEqual(payload);

    const names = (await engine2.getHistory(id)).map((h) => h.name);
    expect(names).toEqual(['submitted_for_review', 'published']);
  });

  test('review rejection returns the record to draft with feedback (§3.2)', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    await engine2.submitForReview(created.recordId);
    const rejected = await engine2.reviewReject(created.recordId, 'needs copy edit');
    expect(rejected).toEqual({ ok: true, state: 'draft' });
    const history = await engine2.getHistory(created.recordId);
    const rejection = history.find((h) => h.name === 'review_rejected');
    expect(rejection?.detail).toBe('needs copy edit');
    const revisions = await engine2.getRevisions(created.recordId);
    expect(revisions).toHaveLength(0); // drafts have no revisions (§3.3)
  });

  test('illegal transitions are rejected: draft→published skip, republish without revision', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const created = await engine2.createRecord({
      title: { kind: 'text', value: 'x' },
      related: { kind: 'relation', targetRecordId: target },
    });
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;

    // draft → published directly: review is a required gate (§3.3).
    const skip = await engine2.transition(id, 'published', 'submitted_for_review');
    expect(skip).toEqual({
      ok: false,
      failure: { code: 'illegal_transition', from: 'draft', to: 'published' },
    });

    // get to published, then attempt publish-in-place (§3.3).
    await engine2.submitForReview(id);
    await engine2.reviewApprove(id);
    const republish = await engine2.reviewApprove(id);
    expect(republish.ok).toBe(false);
    if (republish.ok) return;
    expect(republish.failure).toEqual({ code: 'republish_requires_revision' });
  });

  test('scheduled future publish: review → scheduled → published at schedule time (R2)', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;
    await engine2.submitForReview(id);
    // First publish so publishedRevision > 0 (scheduled requires a prior publish).
    await engine2.reviewApprove(id);

    // Open a post-publish revision and re-submit to reach review again.
    await engine2.openRevision(id);
    await engine2.saveDraft({ recordId: id, baseRevision: 1, payload, actorRole: 'author' });
    await engine2.submitForReview(id);

    const future = new Date(Date.UTC(2026, 0, 1, 3, 0, 0)).toISOString();
    const scheduled = await engine2.schedulePublish(id, future);
    expect(scheduled).toEqual({ ok: true, state: 'scheduled' });

    // Firing before schedule time is denied.
    const early = await engine2.fireScheduledPublish(id);
    expect(early.ok).toBe(false);

    // Advance the clock past schedule time (scheduleAt = 03:00 → tick ≥ 10801 s).
    tick = 11000;
    const fired = await engine2.fireScheduledPublish(id);
    expect(fired).toEqual({ ok: true, state: 'published' });
    const record = await engine2.getRecord(id);
    expect(record?.publishedRevision).toBe(2);
    const revisions = await engine2.getRevisions(id);
    expect(revisions.map((r) => r.revision)).toEqual([1, 2]);
    const names = (await engine2.getHistory(id)).map((h) => h.name);
    expect(names).toContain('scheduled_publish_set');
    expect(names).toContain('scheduled_publish_fired');
  });

  test('scheduled state requires a future time (§3.3)', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;
    await engine2.submitForReview(id);
    await engine2.reviewApprove(id);
    await engine2.openRevision(id);
    await engine2.saveDraft({ recordId: id, baseRevision: 1, payload, actorRole: 'author' });
    await engine2.submitForReview(id);
    const past = new Date(Date.UTC(2025, 0, 1)).toISOString();
    const result = await engine2.schedulePublish(id, past);
    expect(result).toEqual({ ok: false, failure: { code: 'schedule_requires_future_time' } });
  });

  test('failed publish retains pre-attempt state and records an EVENT, not a revision row (§4)', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
      body: { kind: 'rich_text', html: 'invalid-rich-text' },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;
    await engine2.submitForReview(id);
    const approve = await engine2.reviewApprove(id);
    expect(approve.ok).toBe(false);
    if (approve.ok) return;
    expect(approve.failure.code).toBe('publish_failed');

    const record = await engine2.getRecord(id);
    expect(record?.state).toBe('review'); // pre-attempt state retained
    const revisions = await engine2.getRevisions(id);
    expect(revisions).toHaveLength(0); // NO revision row for a failed publish
    const failedEvent = (await engine2.getHistory(id)).find((h) => h.name === 'publish_failed');
    expect(failedEvent?.kind).toBe('event');
    expect(failedEvent?.revision).toBeNull();
  });

  test('post-publish revision: draft → review → published appends revision 2 (R2)', async () => {
    const id = await seedPublished();
    const opened = await engine.openRevision(id);
    expect(opened).toEqual({ ok: true, state: 'draft' });
    const edited: ContentPayload = {
      ...fullPayload,
      title: { kind: 'text', value: 'Edited title' },
    };
    const saved = await engine.saveDraft({
      recordId: id,
      baseRevision: 1,
      payload: edited,
      actorRole: 'author',
    });
    expect(saved.ok).toBe(true);
    await engine.submitForReview(id);
    const approved = await engine.reviewApprove(id);
    expect(approved).toEqual({ ok: true, state: 'published' });
    const revisions = await engine.getRevisions(id);
    expect(revisions.map((r) => r.revision)).toEqual([1, 2]);
    expect(revisions[1]?.payload.title).toEqual({ kind: 'text', value: 'Edited title' });
    // The published line is never silently overwritten: revision 1 is intact.
    expect(revisions[0]?.payload.title).toEqual({ kind: 'text', value: 'Coffee blends' });
  });
});

describe('R3 — optimistic revision checks (server-side)', () => {
  test('stale base revision is rejected; the server copy (newer data) is preserved', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;

    // Writer A saves first (revision 0 → 1).
    const a = await engine2.saveDraft({
      recordId: id,
      baseRevision: 0,
      payload,
      actorRole: 'author',
    });
    expect(a).toEqual({ ok: true, revision: 1, state: 'draft' });

    // Writer B submits against the same stale base 0 → rejected.
    const bPayload: ContentPayload = { ...payload, title: { kind: 'text', value: 'Writer B' } };
    const b = await engine2.saveDraft({
      recordId: id,
      baseRevision: 0,
      payload: bPayload,
      actorRole: 'author',
    });
    expect(b.ok).toBe(false);
    if (b.ok) return;
    expect(b.failure).toEqual({ code: 'stale_revision', expectedRevision: 1 });

    // Newer data (Writer A) is NOT discarded:
    const record = await engine2.getRecord(id);
    expect(record?.payload.title).toEqual({ kind: 'text', value: 'Coffee blends' });
    expect(record?.revision).toBe(1);
  });

  test('concurrent overwrite (two writers on the same base) yields exactly one winner', async () => {
    const created = await engine.createRecord({ title: { kind: 'text', value: 'start' } });
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;
    const w1: ContentPayload = { title: { kind: 'text', value: 'writer-1' } };
    const w2: ContentPayload = { title: { kind: 'text', value: 'writer-2' } };
    const [r1, r2] = await Promise.all([
      engine.saveDraft({ recordId: id, baseRevision: 0, payload: w1, actorRole: 'author' }),
      engine.saveDraft({ recordId: id, baseRevision: 0, payload: w2, actorRole: 'author' }),
    ]);
    const winners = [r1, r2].filter((r) => r.ok);
    expect(winners).toHaveLength(1); // exactly one succeeds
    const record = await engine.getRecord(id);
    expect(record?.revision).toBe(1); // no double-apply
    const winnerPayload = winners[0]?.ok ? winners[0].revision : 0;
    expect(winnerPayload).toBe(1);
  });

  test('a rejected save is never reported as a successful save (R3)', async () => {
    const created = await engine.createRecord({ title: { kind: 'text', value: 'v0' } });
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;
    await engine.saveDraft({
      recordId: id,
      baseRevision: 0,
      payload: { title: { kind: 'text', value: 'v1' } },
      actorRole: 'author',
    });
    const late = await engine.saveDraft({
      recordId: id,
      baseRevision: 0,
      payload: { title: { kind: 'text', value: 'late' } },
      actorRole: 'author',
    });
    expect(late.ok).toBe(false); // no false success
  });
});

describe('R4 — save semantics: failed/late saves preserve the draft', () => {
  test('a late save against a moved revision leaves the server record untouched', async () => {
    const created = await engine.createRecord({ title: { kind: 'text', value: 'live draft' } });
    if (!created.ok) throw new Error('create failed');
    const id = created.recordId;
    await engine.saveDraft({
      recordId: id,
      baseRevision: 0,
      payload: { title: { kind: 'text', value: 'autosaved v1' } },
      actorRole: 'author',
    });
    // Late arrival from a stale client:
    const late = await engine.saveDraft({
      recordId: id,
      baseRevision: 0,
      payload: { title: { kind: 'text', value: 'stale' } },
      actorRole: 'author',
    });
    expect(late.ok).toBe(false);
    const record = await engine.getRecord(id);
    expect(record?.payload.title).toEqual({ kind: 'text', value: 'autosaved v1' });
    expect(record?.state).toBe('draft'); // draft retained, never coerced to published
  });

  test('a failed save never claims publish success', async () => {
    const target = await createSecondRecord();
    const engine2 = engine;
    const payload: ContentPayload = {
      ...fullPayload,
      related: { kind: 'relation', targetRecordId: target },
      body: { kind: 'rich_text', html: 'invalid-rich-text' },
    };
    const created = await engine2.createRecord(payload);
    if (!created.ok) throw new Error('create failed');
    await engine2.submitForReview(created.recordId);
    const result = await engine2.reviewApprove(created.recordId);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failure.code).toBe('publish_failed');
    // Truthfulness: no publish happened — record was never 'published'.
    const record = await engine2.getRecord(created.recordId);
    expect(record?.state).not.toBe('published');
    expect(record?.publishedRevision).toBe(0);
  });
});

describe('R6 — preview permission gate (workflow-input portion)', () => {
  test('public role is denied preview of draft/review records', async () => {
    const created = await engine.createRecord({ title: { kind: 'text', value: 'secret draft' } });
    if (!created.ok) throw new Error('create failed');
    const denied = await engine.preview(created.recordId, 'public', true);
    expect(denied.ok).toBe(false);
    if (denied.ok) return;
    expect(denied.failure).toEqual({ code: 'preview_denied', reason: 'no_permission' });
  });

  test('expired session is denied preview regardless of role', async () => {
    const created = await engine.createRecord({ title: { kind: 'text', value: 'draft' } });
    if (!created.ok) throw new Error('create failed');
    const denied = await engine.preview(created.recordId, 'author', false);
    expect(denied.ok).toBe(false);
    if (denied.ok) return;
    expect(denied.failure).toEqual({ code: 'preview_denied', reason: 'session_expired' });
  });

  test('author sees own draft via preview; public sees only the published revision', async () => {
    const id = await seedPublished();
    const author = await engine.preview(id, 'author', true);
    expect(author.ok).toBe(true);
    const pub = await engine.preview(id, 'public', true);
    expect(pub.ok).toBe(true);
    if (pub.ok) {
      expect(pub.state).toBe('published');
      expect(pub.payload.title).toEqual({ kind: 'text', value: 'Coffee blends' });
    }
  });
});

describe('lifecycle shape (§5, Q42)', () => {
  test('records carry visibility, soft-delete tombstone and sort_order', async () => {
    const created = await engine.createRecord({ title: { kind: 'text', value: 'x' } });
    if (!created.ok) throw new Error('create failed');
    const row = await engine.getRecord(created.recordId);
    expect(row?.visible).toBe(true);
    expect(row?.deletedAt).toBeNull();
    expect(row?.sortOrder).toBe(0);
    const mediaRows = await env.DB.prepare('SELECT COUNT(*) AS n FROM media').first<{
      n: number;
    }>();
    expect(mediaRows?.n).toBe(1);
  });
});

describe('harness plumbing', () => {
  test('engine is wired to the real D1 binding', async () => {
    expect(env.DB).toBeDefined();
    expect(typeof env.DB.batch).toBe('function');
    expect(vi.isMockFunction(env.DB.prepare)).toBe(false);
  });
});
