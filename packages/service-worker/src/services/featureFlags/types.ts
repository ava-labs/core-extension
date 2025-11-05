import { z } from 'zod';
import { FeatureGates, FeatureVars } from '@core/types';

/**
 * Zod schema for FeatureFlags
 * Validates that all FeatureGates are booleans and all FeatureVars are strings
 * When the flag is not present, it is considered disabled
 */
export const featureFlagsSchema = z
  .object({
    ...Object.values(FeatureGates).reduce(
      (acc, value) => ({ ...acc, [value]: z.boolean().optional() }),
      {} as Record<string, z.ZodOptional<z.ZodBoolean>>,
    ),
    ...Object.values(FeatureVars).reduce(
      (acc, value) => ({ ...acc, [value]: z.string().optional() }),
      {} as Record<string, z.ZodOptional<z.ZodString>>,
    ),
  })
  .refine((data) => Object.keys(data).length > 0, {
    //If there is no key value pair, throw an error. Because when the flag is not present, it is considered disabled.
    message: 'Feature flags object cannot be empty',
  })
  .refine(
    (data) => {
      // Expect some features flags to be enabled. Otherwise, throw an error.
      const featureGateValues = Object.values(FeatureGates);
      return featureGateValues.some((gate) => data[gate] === true);
    },
    {
      message: `All feature flags are disabled. Unlikely, so ignoring this response.`,
    },
  );

/**
 * Zod schema for PostHog response structure
 * Validates the full response from PostHog's /decide endpoint
 */
export const posthogResponseSchema = z.object({
  featureFlags: featureFlagsSchema,
  featureFlagPayloads: z.record(z.string()).optional(),
});
