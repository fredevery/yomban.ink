import { beforeAll } from 'vitest';

// Q63 harness: NO setup-time migration application. Each test drives the
// migration-runner candidate (src/proof.ts) against a real Miniflare D1
// binding so that empty-DB bootstrap, ledger writes, retries and lock
// behaviour are exercised by the code under test — never bypassed by
// applyD1Migrations.
beforeAll(async () => {
  // intentional no-op: see file comment
});
