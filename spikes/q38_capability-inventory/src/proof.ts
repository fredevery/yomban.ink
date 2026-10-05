/**
 * Q38 capability-check harness — proof.
 *
 * A framework-free, presentation-free manifest/capability conformance checker that
 * exercises the accepted Q38 policy (design §2/§3):
 *  - Axis 1: every capability is a core-provided framework-free seam.
 *  - Axis 2: REQUIRED capabilities (C1, C5, C6, C8, C9, C10, C12) fail registration
 *    loudly when absent; OPTIONAL capabilities (C2, C3, C4, C7, C11) degrade or refuse
 *    EXPLICITLY, never silently.
 *  - Undeclared capability/dependency usage is a conformance failure (no implicit resolution).
 *  - Built-in and custom modules run the SAME checks (no privileged path).
 *
 * No Cloudflare bindings, no secrets, no network, no presentation imports.
 */

/** The 12 capability slots from the accepted Q38 inventory (doc-local keys). */
export type CapabilityId =
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'C7'
  | 'C8'
  | 'C9'
  | 'C10'
  | 'C11'
  | 'C12';

/** Capability slots classified REQUIRED by the accepted Axis-2 policy (design §3). */
export const REQUIRED_CAPABILITIES: readonly CapabilityId[] = [
  'C1',
  'C5',
  'C6',
  'C8',
  'C9',
  'C10',
  'C12',
] as const;

/** Capability slots classified OPTIONAL / CONDITIONAL by the accepted Axis-2 policy (design §3). */
export const OPTIONAL_CAPABILITIES: readonly CapabilityId[] = [
  'C2',
  'C3',
  'C4',
  'C7',
  'C11',
] as const;

/** Environment facets a capability surface can be offered on or required for. */
export type EnvFacet = 'server' | 'client' | 'cli';

/** A module manifest, as declared to the build-time registry. */
export interface Manifest {
  /** Unique module id. */
  id: string;
  /** Human-readable module name. */
  name: string;
  /** Built-in flag — grants NO bypass; parity is enforced (Q39). */
  builtIn: boolean;
  /** REQUIRED/OPTIONAL capabilities the module requires, with the facet each is needed on. */
  requires: Partial<Record<CapabilityId, readonly EnvFacet[]>>;
  /** Capabilities the module's implementation relies on beyond `requires` — must be declared. */
  uses: readonly CapabilityId[];
  /** Dependencies on other modules (must be provided by the platform registry). */
  deps: readonly string[];
  /** Entity-type ID prefixes this module registers into the single namespace (C9). */
  idPrefixes: readonly string[];
}

/** The platform as offered: capability seams with their environment surfaces, plus registered modules. */
export interface Platform {
  capabilities: Partial<Record<CapabilityId, readonly EnvFacet[]>>;
  modules: readonly string[];
}

/** Severity of a single finding. */
export type Severity = 'error' | 'degrade';

/** One structured diagnostic from the checker. */
export interface Finding {
  capability: CapabilityId | 'manifest';
  /** Subject of the finding: the capability, or the undeclared module dependency id. */
  subject: string;
  severity: Severity;
  /** Explicit, human-readable reason. Never silent. */
  reason: string;
}

/** Overall registration outcome. */
export type RegistrationStatus = 'registered' | 'degraded' | 'failed';

/** Structured result of validating one manifest against one platform. */
export interface ValidationResult {
  moduleId: string;
  builtIn: boolean;
  status: RegistrationStatus;
  findings: readonly Finding[];
}

function platformOffers(platform: Platform, cap: CapabilityId): boolean {
  return (platform.capabilities[cap]?.length ?? 0) > 0;
}

function offeredFacets(platform: Platform, cap: CapabilityId): readonly EnvFacet[] {
  return platform.capabilities[cap] ?? [];
}

function missingFacetReason(
  module: Manifest,
  cap: CapabilityId,
  needed: readonly EnvFacet[],
  offered: readonly EnvFacet[],
  required: boolean,
): Finding {
  const missing = needed.filter((f) => !offered.includes(f));
  return {
    capability: cap,
    subject: cap,
    severity: required ? 'error' : 'degrade',
    reason: required
      ? `Module "${module.id}" requires capability ${cap} on environment facet(s) [${needed.join(', ')}] ` +
        `but the platform offers only [${offered.join(', ') || 'nothing'}] — wrong environment facet ` +
        `for [${missing.join(', ')}] (missing REQUIRED facet(s) fail registration).`
      : `Module "${module.id}" optionally uses capability ${cap} on environment facet(s) [${needed.join(', ')}] ` +
        `but the platform offers only [${offered.join(', ') || 'nothing'}] — the dependent feature must ` +
        `degrade or refuse EXPLICITLY, never silently.`,
  };
}

/**
 * Public capability-validation entry. Runs the SAME checks for built-in and custom
 * modules — the builtIn flag grants no bypass.
 */
export function validateModule(module: Manifest, platform: Platform): ValidationResult {
  const findings: Finding[] = [];

  // C9 identifier-prefix namespace: a module registering prefixes needs the id-service seam (REQUIRED).
  if (module.idPrefixes.length > 0) {
    if (!module.requires.C9) {
      findings.push({
        capability: 'C9',
        subject: 'C9',
        severity: 'error',
        reason:
          `Module "${module.id}" registers ID prefixes [${module.idPrefixes.join(', ')}] but does not ` +
          `declare the REQUIRED id-service capability C9 in its manifest — ID-prefix registration is the ` +
          `single namespace authority and requires the C9 seam.`,
      });
    }
  }

  // Declared `requires` — each entry is checked against what the platform offers.
  for (const [capRaw, facets] of Object.entries(module.requires) as [
    CapabilityId,
    readonly EnvFacet[],
  ][]) {
    const required = REQUIRED_CAPABILITIES.includes(capRaw);
    const optional = OPTIONAL_CAPABILITIES.includes(capRaw);
    if (!required && !optional) {
      findings.push({
        capability: capRaw,
        subject: capRaw,
        severity: 'error',
        reason: `Module "${module.id}" requires unknown capability "${capRaw}" — not in the Q38 inventory (C1–C12).`,
      });
      continue;
    }
    if (!platformOffers(platform, capRaw)) {
      if (required) {
        findings.push({
          capability: capRaw,
          subject: capRaw,
          severity: 'error',
          reason:
            `Module "${module.id}" requires REQUIRED capability ${capRaw} but the platform does not ` +
            `provide that seam — registration FAILS (non-omittable).`,
        });
      } else {
        findings.push({
          capability: capRaw,
          subject: capRaw,
          severity: 'degrade',
          reason:
            `Module "${module.id}" requires OPTIONAL capability ${capRaw} which the platform does not ` +
            `provide — the dependent feature must degrade or refuse EXPLICITLY, never silently.`,
        });
      }
      continue;
    }
    const offered = offeredFacets(platform, capRaw);
    const missing = facets.filter((f) => !offered.includes(f));
    if (facets.length === 0) {
      findings.push({
        capability: capRaw,
        subject: capRaw,
        severity: 'error',
        reason:
          `Module "${module.id}" declares requires["${capRaw}"] with an EMPTY facet list — ` +
          `a capability requirement must name at least one environment facet; empty declaration is ` +
          `malformed, conformance FAILS (silence must not read as validity).`,
      });
    } else if (missing.length > 0) {
      findings.push(missingFacetReason(module, capRaw, facets, offered, required));
    }
  }

  // Undeclared usage (R14.6): a capability used beyond `requires` is an undeclared usage —
  // conformance FAILS (no implicit resolution), whether or not the platform offers it.
  for (const cap of module.uses) {
    const declared = Object.hasOwn(module.requires, cap);
    if (!declared) {
      findings.push({
        capability: cap,
        subject: cap,
        severity: 'error',
        reason:
          `Module "${module.id}" uses capability ${cap} that it does not declare in its manifest — ` +
          `undeclared capability usage, conformance FAILS (no implicit resolution).`,
      });
    }
  }

  // Declared module dependencies must be provided by the registry (no implicit resolution).
  for (const dep of module.deps) {
    if (!platform.modules.includes(dep)) {
      findings.push({
        capability: 'manifest',
        subject: dep,
        severity: 'error',
        reason:
          `Module "${module.id}" declares dependency on module "${dep}" but the platform registry does ` +
          `not provide it — undeclared/unresolvable dependency, conformance FAILS (no implicit resolution).`,
      });
    }
  }

  const hasError = findings.some((f) => f.severity === 'error');
  const status: RegistrationStatus = hasError
    ? 'failed'
    : findings.length > 0
      ? 'degraded'
      : 'registered';
  return { moduleId: module.id, builtIn: module.builtIn, status, findings };
}
