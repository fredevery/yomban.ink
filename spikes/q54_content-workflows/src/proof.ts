/**
 * Q54 spike harness — non-UI workflow proof engine.
 *
 * Implements the workflow semantics designed in
 * docs/plans/000_spike-plan/designs/q54_content-workflows.md against real D1
 * (via @cloudflare/vitest-pool-workers). Non-product evidence: nothing here is
 * promoted into the platform.
 *
 * Proven surfaces (map to designs §3–§9 / 005 §8):
 *  - R1: field kinds text/rich_text/media/relation/repeater persisted & read back
 *  - R2: legal transitions draft→review→published, scheduled future publish,
 *        post-publish revision; append-only queryable history; failed publish
 *        leaves pre-attempt state + failed-attempt EVENT (not a revision row)
 *  - R3: server-side optimistic revision checks — stale submissions and
 *        concurrent overwrites rejected, newer data preserved, no false success
 *  - R4: failed/late save does not discard the draft nor report publish success
 *  - R6 (workflow-input portion): permission-gated preview denies unauthorized access
 *  - media/relation ownership: media/relation references resolve to owning records
 */
import type { ContentPayload, EventName, FieldValue, WorkflowState } from './schema.ts';
import { fixtureId, type history, media, records, revisions, workflowStates } from './schema.ts';

/** Harness clock — injectable so the scheduled-publish proof is deterministic. */
export type Clock = () => string;

export type D1Database = {
  batch: (stmts: D1PreparedStatement[]) => Promise<unknown>;
  prepare: (q: string) => D1PreparedStatement;
};

export interface SaveInput {
  recordId: string;
  /** Caller's base revision for the optimistic check (design §6). */
  baseRevision: number;
  payload: ContentPayload;
  /**
   * Fixture-scope only: this harness proves the preview permission gate (design §9),
   * not draft-save role enforcement — a save-authorizing permission check is Q50/Q68
   * surface outside this spike's acceptance. Never relied on by the engine.
   */
  actorRole: 'author' | 'reviewer' | 'public';
}

export type WorkflowFailure =
  | { code: 'stale_revision'; expectedRevision: number }
  | { code: 'illegal_transition'; from: WorkflowState; to: WorkflowState }
  | { code: 'schedule_requires_future_time' }
  | { code: 'republish_requires_revision' }
  | { code: 'publish_failed'; cause: string }
  | { code: 'preview_denied'; reason: 'no_permission' | 'session_expired' }
  | { code: 'ownership_denied'; kind: 'media' | 'relation'; ref: string }
  | { code: 'not_found' };

export type SaveResult =
  | { ok: true; revision: number; state: WorkflowState }
  | { ok: false; failure: WorkflowFailure };

export type TransitionResult =
  | { ok: true; state: WorkflowState }
  | { ok: false; failure: WorkflowFailure };

/** A publish is refused when the payload carries this sentinel (failure injection). */
const PUBLISH_FAIL_SENTINEL = 'invalid-rich-text';

/** Map a raw snake_case D1 row to the Drizzle-inferred select shape. */
function mapRecordRow(r: Record<string, unknown>): typeof records.$inferSelect {
  return {
    id: r.id as string,
    state: r.state as (typeof records.$inferSelect)['state'],
    revision: r.revision as number,
    publishedRevision: r.published_revision as number,
    payload: (typeof r.payload === 'string'
      ? (JSON.parse(r.payload as string) as ContentPayload)
      : r.payload) as ContentPayload,
    scheduleAt: (r.schedule_at as string | null) ?? null,
    visible: (r.visible as number) === 1,
    deletedAt: (r.deleted_at as string | null) ?? null,
    sortOrder: r.sort_order as number,
    updatedAt: r.updated_at as string,
  };
}

/** Map a raw revision/history row's snake_case fields to camelCase (+ JSON payload). */
function mapJoinedRow<T>(r: Record<string, unknown>): T {
  const raw = r.payload;
  const payload = typeof raw === 'string' ? (JSON.parse(raw) as ContentPayload) : raw;
  return {
    ...r,
    recordId: r.record_id,
    createdAt: r.created_at,
    payload,
  } as T;
}

/** One-shot per-record in-memory "media module" registry fixture (Q58 ownership). */
export class MediaRegistryFixture {
  private readonly known = new Set<string>();
  add(id: string): void {
    this.known.add(id);
  }
  owns(id: string): boolean {
    return this.known.has(id);
  }
}

export class WorkflowEngine {
  private seq = 0;

  constructor(
    private readonly db: D1Database,
    private readonly clock: Clock,
    private readonly mediaRegistry: MediaRegistryFixture,
    private readonly existingRecordIds: () => Promise<ReadonlySet<string>>,
  ) {}

  private now(): string {
    return this.clock();
  }

  /** Validate field-kind payload ownership (media/relation resolve to owning records). */
  private async checkOwnership(payload: ContentPayload): Promise<WorkflowFailure | undefined> {
    for (const value of Object.values(payload)) {
      if (value.kind === 'media' && !this.mediaRegistry.owns(value.mediaId)) {
        return { code: 'ownership_denied', kind: 'media', ref: value.mediaId };
      }
      if (value.kind === 'relation') {
        const ids = await this.existingRecordIds();
        if (!ids.has(value.targetRecordId)) {
          return { code: 'ownership_denied', kind: 'relation', ref: value.targetRecordId };
        }
      }
      if (value.kind === 'repeater') {
        const nested: WorkflowFailure | undefined = await this.checkOwnership(
          Object.fromEntries(value.entries.map((e, i): [string, FieldValue] => [String(i), e])),
        );
        if (nested) return nested;
      }
    }
    return undefined;
  }

  /** Publish-time validity check (§4): malformed content refuses the publish. */
  private checkPublishability(payload: ContentPayload): WorkflowFailure | undefined {
    for (const value of Object.values(payload)) {
      if (value.kind === 'rich_text' && value.html.includes(PUBLISH_FAIL_SENTINEL)) {
        // Fixture: malformed/failed rich text; sanitization itself is Q59/Q68's.
        return { code: 'publish_failed', cause: 'malformed rich text rejected' };
      }
      if (value.kind === 'repeater') {
        const nested = this.checkPublishability(
          Object.fromEntries(value.entries.map((e, i): [string, FieldValue] => [String(i), e])),
        );
        if (nested) return nested;
      }
    }
    return undefined;
  }

  async createRecord(
    payload: ContentPayload,
  ): Promise<{ ok: true; recordId: string } | { ok: false; failure: WorkflowFailure }> {
    const ownership = await this.checkOwnership(payload);
    if (ownership) return { ok: false, failure: ownership };
    const id = fixtureId('cnt', `record-${++this.seq}-${this.now()}`);
    const row = {
      id,
      state: 'draft' as WorkflowState,
      revision: 0,
      publishedRevision: 0,
      payload,
      scheduleAt: null,
      visible: true,
      deletedAt: null,
      sortOrder: 0,
      updatedAt: this.now(),
    };
    await this.db.batch([this.prepareInsertRecord(row)]);
    return { ok: true, recordId: id };
  }

  private prepareInsertRecord(row: typeof records.$inferInsert): D1PreparedStatement {
    return (this.db as RealDb)
      .prepare(
        'INSERT INTO records (id, state, revision, published_revision, payload, schedule_at, visible, deleted_at, sort_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(
        row.id,
        row.state,
        row.revision,
        row.publishedRevision,
        JSON.stringify(row.payload),
        row.scheduleAt,
        row.visible,
        row.deletedAt,
        row.sortOrder,
        row.updatedAt,
      );
  }

  async getRecord(recordId: string): Promise<typeof records.$inferSelect | undefined> {
    const stmt = (this.db as RealDb).prepare('SELECT * FROM records WHERE id = ?');
    const raw = (await stmt.bind(recordId).first()) as Record<string, unknown> | undefined;
    return raw ? mapRecordRow(raw) : undefined;
  }

  /** Draft save with server-side optimistic revision check (design §6, R3). */
  async saveDraft(input: SaveInput): Promise<SaveResult> {
    const record = await this.getRecord(input.recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    const nextRevision = record.revision + 1;
    const ownership = await this.checkOwnership(input.payload);
    if (ownership) return { ok: false, failure: ownership };
    // Atomic conditional UPDATE: exactly one writer per base revision wins (R3/Q52).
    const stmt = (this.db as RealDb)
      .prepare(
        'UPDATE records SET payload = ?, revision = ?, updated_at = ? WHERE id = ? AND revision = ?',
      )
      .bind(
        JSON.stringify(input.payload),
        nextRevision,
        this.now(),
        input.recordId,
        input.baseRevision,
      );
    const results = (await this.db.batch([stmt])) as { meta?: { changes?: number } }[];
    const changes = results[0]?.meta?.changes ?? 0;
    if (changes !== 1) {
      // Stale submission or concurrent overwrite: rejected server-side, newer
      // data NOT discarded, never reported as success (R3).
      return { ok: false, failure: { code: 'stale_revision', expectedRevision: record.revision } };
    }
    return { ok: true, revision: nextRevision, state: record.state };
  }

  /** Submit draft for review (design §3.2, R2). */
  async submitForReview(recordId: string): Promise<TransitionResult> {
    return await this.transition(recordId, 'review', 'submitted_for_review');
  }

  /** Reviewer decision: approve → publish creates the next revision row (§3.2/§4). */
  async reviewApprove(recordId: string): Promise<TransitionResult> {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    if (record.state === 'published') {
      // publish-in-place is not an operation (§3.3); every change goes through a revision.
      return { ok: false, failure: { code: 'republish_requires_revision' } };
    }
    if (record.state !== 'review') {
      return {
        ok: false,
        failure: { code: 'illegal_transition', from: record.state, to: 'published' },
      };
    }
    const ownership = await this.checkOwnership(record.payload);
    if (ownership) {
      const cause = 'ownership check failed';
      return await this.recordPublishFailure(recordId, record, cause);
    }
    const publishability = this.checkPublishability(record.payload);
    if (publishability && publishability.code === 'publish_failed') {
      return await this.recordPublishFailure(recordId, record, publishability.cause);
    }
    const nextRevision = record.publishedRevision + 1;
    const at = this.now();
    // One batch = the unit of work (Q52): publish row + history + record state.
    await this.db.batch([
      this.prepareInsertRevision(recordId, nextRevision, record.payload, at),
      this.prepareInsertHistory(recordId, 'revision', 'published', nextRevision, null, at),
      this.prepareUpdateState(recordId, 'published', nextRevision, nextRevision, null),
    ]);
    return { ok: true, state: 'published' };
  }

  /** Reviewer decision: reject → back to draft (§3.2). */
  async reviewReject(recordId: string, feedback: string): Promise<TransitionResult> {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    if (record.state !== 'review') {
      return {
        ok: false,
        failure: { code: 'illegal_transition', from: record.state, to: 'draft' },
      };
    }
    await this.db.batch([
      this.prepareInsertHistory(recordId, 'event', 'review_rejected', null, feedback, this.now()),
      this.prepareUpdateState(
        recordId,
        'draft',
        record.revision,
        record.publishedRevision,
        record.scheduleAt,
      ),
    ]);
    return { ok: true, state: 'draft' };
  }

  /** Open a post-publish revision: new draft revision row state on the same record (§3.2). */
  async openRevision(recordId: string): Promise<TransitionResult> {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    if (record.state !== 'published') {
      return {
        ok: false,
        failure: { code: 'illegal_transition', from: record.state, to: 'draft' },
      };
    }
    await this.db.batch([
      this.prepareInsertHistory(recordId, 'event', 'restored', null, 'open revision', this.now()),
      this.prepareUpdateState(
        recordId,
        'draft',
        record.revision,
        record.publishedRevision,
        record.scheduleAt,
      ),
    ]);
    return { ok: true, state: 'draft' };
  }

  /** Schedule a future publish via a revision of a published record (§3.2, R2). */
  async schedulePublish(recordId: string, scheduleAt: string): Promise<TransitionResult> {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    if (record.state !== 'review') {
      return {
        ok: false,
        failure: { code: 'illegal_transition', from: record.state, to: 'scheduled' },
      };
    }
    if (
      record.publishedRevision === 0 ||
      new Date(scheduleAt).getTime() <= Date.parse(this.now())
    ) {
      return { ok: false, failure: { code: 'schedule_requires_future_time' } };
    }
    await this.db.batch([
      this.prepareInsertHistory(
        recordId,
        'event',
        'scheduled_publish_set',
        null,
        scheduleAt,
        this.now(),
      ),
      this.prepareUpdateState(
        recordId,
        'scheduled',
        record.revision,
        record.publishedRevision,
        scheduleAt,
      ),
    ]);
    return { ok: true, state: 'scheduled' };
  }

  /** At schedule time: the scheduled revision takes effect (§3.2). */
  async fireScheduledPublish(recordId: string): Promise<TransitionResult> {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    if (record.state !== 'scheduled' || !record.scheduleAt) {
      return {
        ok: false,
        failure: { code: 'illegal_transition', from: record.state, to: 'published' },
      };
    }
    if (Date.parse(this.now()) < Date.parse(record.scheduleAt)) {
      return {
        ok: false,
        failure: { code: 'illegal_transition', from: record.state, to: 'published' },
      };
    }
    const nextRevision = record.publishedRevision + 1;
    const at = this.now();
    await this.db.batch([
      this.prepareInsertRevision(recordId, nextRevision, record.payload, at),
      this.prepareInsertHistory(recordId, 'revision', 'published', nextRevision, null, at),
      this.prepareInsertHistory(
        recordId,
        'event',
        'scheduled_publish_fired',
        nextRevision,
        null,
        at,
      ),
      this.prepareUpdateState(recordId, 'published', record.revision, nextRevision, null),
    ]);
    return { ok: true, state: 'published' };
  }

  /** Failed publish: pre-attempt state retained + failed-attempt EVENT, no revision row (§4). */
  private async recordPublishFailure(
    recordId: string,
    record: typeof records.$inferSelect,
    cause: string,
  ): Promise<TransitionResult> {
    await this.db.batch([
      this.prepareInsertHistory(recordId, 'event', 'publish_failed', null, cause, this.now()),
      this.prepareUpdateState(
        recordId,
        record.state,
        record.revision,
        record.publishedRevision,
        record.scheduleAt,
      ),
    ]);
    return { ok: false, failure: { code: 'publish_failed', cause } };
  }

  /** Direct transition entry for the illegal-path table (§3.3). */
  async transition(
    recordId: string,
    to: WorkflowState,
    event: EventName,
  ): Promise<TransitionResult> {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    const from = record.state;
    if (from === 'published') {
      // published → draft is NOT a transition (§3.2); publish-in-place is not an op (§3.3).
      return { ok: false, failure: { code: 'republish_requires_revision' } };
    }
    if (to === 'published' && from === 'draft') {
      // Review is a required gate — draft → published is illegal (§3.3).
      return { ok: false, failure: { code: 'illegal_transition', from, to } };
    }
    if (from !== 'draft' || to !== 'review') {
      return { ok: false, failure: { code: 'illegal_transition', from, to } };
    }
    await this.db.batch([
      this.prepareInsertHistory(recordId, 'event', event, null, null, this.now()),
      this.prepareUpdateState(
        recordId,
        to,
        record.revision,
        record.publishedRevision,
        record.scheduleAt,
      ),
    ]);
    return { ok: true, state: to };
  }

  /** R6 (workflow-input portion): preview gate — public role never sees drafts. */
  async preview(
    recordId: string,
    role: 'author' | 'reviewer' | 'public',
    sessionValid: boolean,
  ): Promise<
    | { ok: true; payload: ContentPayload; state: WorkflowState }
    | { ok: false; failure: WorkflowFailure }
  > {
    const record = await this.getRecord(recordId);
    if (!record) return { ok: false, failure: { code: 'not_found' } };
    if (!sessionValid) {
      return { ok: false, failure: { code: 'preview_denied', reason: 'session_expired' } };
    }
    if (role === 'public') {
      // Permission-gated: unauthorized preview of draft/review is denied (R6).
      if (record.state !== 'published') {
        return { ok: false, failure: { code: 'preview_denied', reason: 'no_permission' } };
      }
      const latest = await this.getRevision(recordId, record.publishedRevision);
      return latest
        ? { ok: true, payload: latest.payload, state: 'published' }
        : { ok: false, failure: { code: 'not_found' } };
    }
    return { ok: true, payload: record.payload, state: record.state };
  }

  async getRevision(
    recordId: string,
    revision: number,
  ): Promise<typeof revisions.$inferSelect | undefined> {
    const stmt = (this.db as RealDb).prepare(
      'SELECT * FROM revisions WHERE record_id = ? AND revision = ?',
    );
    const raw = (await stmt.bind(recordId, revision).first()) as
      | Record<string, unknown>
      | undefined;
    return raw ? mapJoinedRow(raw) : undefined;
  }

  /** Queryable history (R2): revision rows + events, ordered append-only. */
  async getHistory(recordId: string): Promise<(typeof history.$inferSelect)[]> {
    const stmt = (this.db as RealDb).prepare('SELECT * FROM history WHERE record_id = ?');
    const rows = (await stmt.bind(recordId).all()) as { results: Record<string, unknown>[] };
    return rows.results
      .map(mapJoinedRow<typeof history.$inferSelect>)
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }

  /** Revisions list — assert-append-only via count check (§4). */
  async getRevisions(recordId: string): Promise<(typeof revisions.$inferSelect)[]> {
    const stmt = (this.db as RealDb).prepare('SELECT * FROM revisions WHERE record_id = ?');
    const rows = (await stmt.bind(recordId).all()) as { results: Record<string, unknown>[] };
    return rows.results
      .map(mapJoinedRow<typeof revisions.$inferSelect>)
      .sort((a, b) => a.revision - b.revision);
  }

  private prepareInsertRevision(
    recordId: string,
    revision: number,
    payload: ContentPayload,
    at: string,
  ): D1PreparedStatement {
    return (this.db as RealDb)
      .prepare(
        'INSERT INTO revisions (id, record_id, revision, payload, created_at) VALUES (?, ?, ?, ?, ?)',
      )
      .bind(
        fixtureId('rev', `${recordId}-${revision}`),
        recordId,
        revision,
        JSON.stringify(payload),
        at,
      );
  }

  private prepareInsertHistory(
    recordId: string,
    kind: 'revision' | 'event',
    name: string,
    revision: number | null,
    detail: string | null,
    at: string,
  ): D1PreparedStatement {
    return (this.db as RealDb)
      .prepare(
        'INSERT INTO history (id, record_id, kind, name, revision, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(
        fixtureId('evt', `${recordId}-${name}-${at}`),
        recordId,
        kind,
        name,
        revision,
        detail,
        at,
      );
  }

  private prepareUpdateState(
    recordId: string,
    state: WorkflowState,
    revision: number,
    publishedRevision: number,
    scheduleAt: string | null,
  ): D1PreparedStatement {
    return (this.db as RealDb)
      .prepare(
        'UPDATE records SET state = ?, revision = ?, published_revision = ?, schedule_at = ?, updated_at = ? WHERE id = ?',
      )
      .bind(state, revision, publishedRevision, scheduleAt, this.now(), recordId);
  }
}

type RealDb = {
  prepare: (q: string) => D1PreparedStatement;
};
export { media, records, revisions, workflowStates };
