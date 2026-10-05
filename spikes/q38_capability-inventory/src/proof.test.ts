import { describe, expect, it } from 'vitest';
import { type Manifest, type Platform, REQUIRED_CAPABILITIES, validateModule } from './proof.ts';

// ---------------------------------------------------------------------------
// Platform fixtures (offered capability surfaces)
// ---------------------------------------------------------------------------

const FULL_PLATFORM: Platform = {
  capabilities: {
    C1: ['server', 'client'],
    C2: ['server'],
    C3: ['cli', 'server'],
    C4: ['server'],
    C5: ['server'],
    C6: ['server'],
    C7: ['server'],
    C8: ['server'],
    C9: ['server', 'client'],
    C10: ['server'],
    C11: ['client'],
    C12: ['server', 'client'],
  },
  modules: ['media-builtin', 'sync-core'],
};

const PLATFORM_WITHOUT_C1: Platform = {
  capabilities: { ...FULL_PLATFORM.capabilities, C1: [] },
  modules: FULL_PLATFORM.modules,
};

const PLATFORM_WITHOUT_C2: Platform = {
  capabilities: { ...FULL_PLATFORM.capabilities, C2: [] },
  modules: FULL_PLATFORM.modules,
};

const PLATFORM_C1_CLIENT_ONLY: Platform = {
  capabilities: { ...FULL_PLATFORM.capabilities, C1: ['client'] },
  modules: FULL_PLATFORM.modules,
};

// ---------------------------------------------------------------------------
// Manifest fixtures
// ---------------------------------------------------------------------------

const SERVICE_ONLY: Manifest = {
  id: 'notes',
  name: 'Notes service module',
  builtIn: false,
  requires: {
    C1: ['server'],
    C5: ['server'],
    C6: ['server'],
    C8: ['server'],
    C9: ['server'],
    C10: ['server'],
    C12: ['server'],
  },
  uses: [],
  deps: [],
  idPrefixes: ['nt_'],
};

const OPTS_INTO_STORAGE: Manifest = {
  id: 'media',
  name: 'Media module',
  builtIn: false,
  requires: { ...SERVICE_ONLY.requires, C2: ['server'] },
  uses: [],
  deps: [],
  idPrefixes: ['md_'],
};

// A module that DECLARES only C1 but ALSO relies on C4 (cache) without declaring it.
const UNDECLARED_CAPABILITY: Manifest = {
  ...SERVICE_ONLY,
  id: 'crook',
  name: 'Undeclared-usage module',
  uses: ['C4'],
};

// A module that declares a dependency on a module the platform does not provide.
const UNDECLARED_DEPENDENCY: Manifest = {
  ...SERVICE_ONLY,
  id: 'linked',
  name: 'Undeclared-dependency module',
  deps: ['nonexistent-module'],
};

const SAME_FAILURE_BOTH_KINDS: Manifest = {
  ...SERVICE_ONLY,
  id: 'shared-shape',
  name: 'Parity module',
  idPrefixes: [],
  requires: { ...SERVICE_ONLY.requires, C2: ['server'] },
};

describe('validateModule (Q38 capability policy harness)', () => {
  it('R14.1 — a valid service-only module registers (no UI, minimal required seams fulfilled)', () => {
    const result = validateModule(SERVICE_ONLY, FULL_PLATFORM);
    expect(result.status).toBe('registered');
    expect(result.findings).toHaveLength(0);
    expect(result.moduleId).toBe('notes');
  });

  it('R14.3 — absent OPTIONAL capability (C2 storage) → explicit degrade, never silent', () => {
    const result = validateModule(OPTS_INTO_STORAGE, PLATFORM_WITHOUT_C2);
    expect(result.status).toBe('degraded');
    const c2 = result.findings.filter((f) => f.capability === 'C2');
    expect(c2.length).toBeGreaterThan(0);
    for (const f of c2) {
      expect(f.reason).toMatch(/optional/i);
      expect(f.reason).toMatch(/degrad|refus/i);
    }
    // The required seams are still satisfied — the module itself registers.
    expect(
      result.findings.some(
        (f) =>
          f.capability !== 'manifest' &&
          REQUIRED_CAPABILITIES.includes(f.capability) &&
          f.severity === 'error',
      ),
    ).toBe(false);
  });

  it('R14.4 — missing REQUIRED capability (C1 datastore) → registration FAILS, naming C1', () => {
    const result = validateModule(SERVICE_ONLY, PLATFORM_WITHOUT_C1);
    expect(result.status).toBe('failed');
    const c1 = result.findings.find((f) => f.capability === 'C1');
    expect(c1).toBeDefined();
    expect(c1?.severity).toBe('error');
    expect(c1?.reason).toMatch(/required|datastore|C1/i);
  });

  it('malformed manifest — requires[C1] with an EMPTY facet list → conformance failure, never silent validity', () => {
    const malformed = { ...SERVICE_ONLY, requires: { ...SERVICE_ONLY.requires, C1: [] } };
    const result = validateModule(malformed, FULL_PLATFORM);
    expect(result.status).toBe('failed');
    const c1 = result.findings.find((f) => f.capability === 'C1');
    expect(c1).toBeDefined();
    expect(c1?.reason).toMatch(/empty facet list|malformed/i);
  });

  it('R14.5 — wrong environment facet (server C1 offered only client-local) → explicit mismatch failure', () => {
    const result = validateModule(SERVICE_ONLY, PLATFORM_C1_CLIENT_ONLY);
    expect(result.status).toBe('failed');
    const c1 = result.findings.find((f) => f.capability === 'C1');
    expect(c1).toBeDefined();
    expect(c1?.reason).toMatch(/environment|facet|client|server/i);
  });

  it('R14.6 — undeclared capability usage AND undeclared module dependency → conformance failure', () => {
    const capResult = validateModule(UNDECLARED_CAPABILITY, FULL_PLATFORM);
    expect(capResult.status).toBe('failed');
    const undeclared = capResult.findings.find((f) => f.capability === 'C4');
    expect(undeclared).toBeDefined();
    expect(undeclared?.reason).toMatch(/undeclared|not declared/i);

    const depResult = validateModule(UNDECLARED_DEPENDENCY, FULL_PLATFORM);
    expect(depResult.status).toBe('failed');
    const dep = depResult.findings.find((f) => f.subject === 'nonexistent-module');
    expect(dep).toBeDefined();
    expect(dep?.reason).toMatch(/undeclared|not provided|not declared/i);
  });

  it('R14.2 — built-in vs custom parity: identical outcomes and diagnostics, no privileged path', () => {
    const builtIn = validateModule(
      { ...SAME_FAILURE_BOTH_KINDS, builtIn: true },
      PLATFORM_WITHOUT_C2,
    );
    const custom = validateModule(
      { ...SAME_FAILURE_BOTH_KINDS, builtIn: false },
      PLATFORM_WITHOUT_C2,
    );
    expect(builtIn.status).toBe(custom.status);
    expect(builtIn.findings).toEqual(custom.findings);

    const builtInFail = validateModule({ ...SERVICE_ONLY, builtIn: true }, PLATFORM_WITHOUT_C1);
    const customFail = validateModule({ ...SERVICE_ONLY, builtIn: false }, PLATFORM_WITHOUT_C1);
    expect(builtInFail.status).toBe(customFail.status);
    expect(builtInFail.findings).toEqual(customFail.findings);
  });
});
