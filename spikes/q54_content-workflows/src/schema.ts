/**
 * Q54 spike harness fixture schema — Drizzle/D1 fixture ONLY.
 *
 * Mirrors the workflow semantics designed in
 * docs/plans/000_spike-plan/designs/q54_content-workflows.md:
 *  - record = aggregate root (Amendment 001, Q70 §3) with prefixed sortable TEXT id
 *  - workflow states draft | review | published | scheduled (§3.1)
 *  - append-only revision rows + history events keyed to the root (§4)
 *  - publishing-lifecycle shape: visibility, soft-delete, sort_order (§5, Q42)
 *  - optimistic revision check on every save (§6, R3)
 *  - field kinds carried as typed JSON payloads (§2.1): text, richText, media,
 *    relation, repeater
 *
 * The field-kind payloads are fixture-local; stored types in product are inferred
 * from the module Drizzle schema (design §2.2) — this file never becomes product code.
 */
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** Core id-service seam fixture: prefixed, sortable, URL-safe TEXT ids (Q11). */
export const idPrefixes = ['cnt', 'rev', 'evt', 'med', 'sch'] as const;
export type IdPrefix = (typeof idPrefixes)[number];

export function fixtureId(prefix: IdPrefix, seed: string): string {
  return `${prefix}_${seed}`;
}

/** Workflow states (design §3.1). */
export const workflowStates = ['draft', 'review', 'published', 'scheduled'] as const;
export type WorkflowState = (typeof workflowStates)[number];

/** History kinds (design §4): publish effects are revisions; failures are events. */
export const historyKinds = ['revision', 'event'] as const;
export type HistoryKind = (typeof historyKinds)[number];

/** Lifecycle event names (design §§3–4). */
export const eventNames = [
  'submitted_for_review',
  'review_rejected',
  'review_approved',
  'scheduled_publish_set',
  'scheduled_publish_fired',
  'publish_failed',
  'archived',
  'soft_deleted',
  'restored',
] as const;
export type EventName = (typeof eventNames)[number];

/** Field-kind discriminator (design §2.1). */
export const fieldKinds = ['text', 'rich_text', 'media', 'relation', 'repeater'] as const;
export type FieldKind = (typeof fieldKinds)[number];

/** A single field value in the record's content payload. */
export type FieldValue =
  | { kind: 'text'; value: string }
  | { kind: 'rich_text'; html: string } // sanitized upstream; sanitization is Q59/Q68's
  | { kind: 'media'; mediaId: string } // reference to a media record owned by the media module (Q58)
  | { kind: 'relation'; targetRecordId: string } // reference to another content record
  | { kind: 'repeater'; entries: FieldValue[] }; // ordered child groups, riding the root

export type ContentPayload = Record<string, FieldValue>;

/** The content record — the aggregate root (design §2.3). */
export const records = sqliteTable(
  'records',
  {
    id: text('id').primaryKey(), // cnt_<sortable> — no INTEGER PKs (Q11)
    state: text('state', { enum: workflowStates }).notNull().default('draft'),
    /** Revision number for optimistic checks; server-authoritative (design §6). */
    revision: integer('revision').notNull().default(0),
    /** Highest live revision number for this record (0 while never published). */
    publishedRevision: integer('published_revision').notNull().default(0),
    payload: text('payload', { mode: 'json' }).$type<ContentPayload>().notNull(),
    scheduleAt: text('schedule_at'), // ISO 8601; set only for scheduled state
    /** Publishing-lifecycle shape (design §5, Q42). */
    visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
    deletedAt: text('deleted_at'), // tombstone; retention/GC is Q70 §8/Q65's
    sortOrder: integer('sort_order').notNull().default(0),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('records_state_idx').on(t.state), index('records_sort_idx').on(t.sortOrder)],
);

/** Append-only revision rows — one per publish that took effect (design §4). */
export const revisions = sqliteTable(
  'revisions',
  {
    id: text('id').primaryKey(), // rev_<sortable>
    recordId: text('record_id')
      .notNull()
      .references(() => records.id),
    revision: integer('revision').notNull(),
    payload: text('payload', { mode: 'json' }).$type<ContentPayload>().notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('revisions_record_idx').on(t.recordId, t.revision)],
);

/** Append-only history: revision rows (publish effects) + events (attempts/lifecycle). */
export const history = sqliteTable(
  'history',
  {
    id: text('id').primaryKey(), // evt_<sortable>
    recordId: text('record_id')
      .notNull()
      .references(() => records.id),
    kind: text('kind', { enum: historyKinds }).notNull(),
    name: text('name').notNull(), // EventName, or 'published' for revision rows
    revision: integer('revision'), // set for revision rows / publish effects
    detail: text('detail'), // free-form reason (e.g. review feedback, failure cause)
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('history_record_idx').on(t.recordId, t.createdAt)],
);

/** Media module fixture records (Q58 ownership: content references, media owns). */
export const media = sqliteTable('media', {
  id: text('id').primaryKey(), // med_<sortable>
  label: text('label').notNull(),
  createdAt: text('created_at').notNull(),
});
