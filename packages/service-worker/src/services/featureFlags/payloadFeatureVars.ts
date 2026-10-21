import { z } from 'zod';
import { FeatureFlags, FeatureVars } from '@core/types';

/**
 * FeatureVars delivered as boolean PostHog flags whose value lives in the
 * flag payload rather than in a variant key. PostHog variant keys only allow
 * `[a-zA-Z0-9_-]`, so values such as semver strings must come via payloads.
 */
export const PAYLOAD_FEATURE_VARS = {
  [FeatureVars.LEDGER_AVALANCHE_APP_RECOMMENDED_VERSION]: z
    .object({ recommendedVersion: z.string() })
    .transform(({ recommendedVersion }) => recommendedVersion.trim()),
} satisfies Partial<Record<FeatureVars, z.ZodType<string, unknown>>>;

type PayloadFeatureVar = keyof typeof PAYLOAD_FEATURE_VARS;

const payloadFeatureVarNames = Object.keys(
  PAYLOAD_FEATURE_VARS,
) as PayloadFeatureVar[];

export const isPayloadFeatureVar = (
  flagName: string,
): flagName is PayloadFeatureVar =>
  payloadFeatureVarNames.includes(flagName as PayloadFeatureVar);

export type RawFeatureFlags = Omit<FeatureFlags, PayloadFeatureVar> &
  Partial<Record<PayloadFeatureVar, string | boolean>>;

const parsePayload = (
  varName: PayloadFeatureVar,
  payload: string | undefined,
): string => {
  if (payload === undefined) {
    return '';
  }

  try {
    const result = PAYLOAD_FEATURE_VARS[varName].safeParse(JSON.parse(payload));
    return result.success ? result.data : '';
  } catch {
    return '';
  }
};

/**
 * Converts payload-backed vars from `true` + JSON payload into their string
 * value (or `''` when disabled/malformed) and strips their payloads, so the
 * Core version-range evaluation never treats them as range-gated flags.
 */
export function resolvePayloadFeatureVars(
  rawFlags: RawFeatureFlags,
  payloads: Record<string, string>,
): { flags: FeatureFlags; flagPayloads: Record<string, string> } {
  const flags = { ...rawFlags } as FeatureFlags;
  const flagPayloads = { ...payloads };

  for (const varName of payloadFeatureVarNames) {
    flags[varName] =
      rawFlags[varName] === true
        ? parsePayload(varName, flagPayloads[varName])
        : '';
    delete flagPayloads[varName];
  }

  return { flags, flagPayloads };
}
