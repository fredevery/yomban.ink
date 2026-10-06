declare module 'cloudflare:test' {
  interface ProvidedEnv extends D1DatabaseMeta {
    DB: D1Database;
    TEST_MIGRATIONS: import('cloudflare:test').D1Migration[];
  }
}
