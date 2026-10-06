import type { D1Migration } from 'cloudflare:test';
import { applyD1Migrations, env } from 'cloudflare:test';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  const { TEST_MIGRATIONS } = env as unknown as { TEST_MIGRATIONS: D1Migration[] };
  await applyD1Migrations(env.DB, TEST_MIGRATIONS);
});
