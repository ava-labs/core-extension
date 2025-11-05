import { FeatureGates, FeatureVars } from '@core/types';
import { featureFlagsSchema, posthogResponseSchema } from './types';

describe('featureFlagsSchema', () => {
  describe('empty object validation', () => {
    it('should reject empty object', () => {
      const result = featureFlagsSchema.safeParse({});

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe(
          'Feature flags object cannot be empty',
        );
      }
    });
  });

  describe('all flags disabled validation', () => {
    it('should reject when all FeatureGates are false', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.BRIDGE]: false,
        [FeatureGates.SWAP]: false,
        [FeatureGates.EVENTS]: false,
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe(
          'All feature flags are disabled. Unlikely, so ignoring this response.',
        );
      }
    });

    it('should reject when all FeatureGates are undefined', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.BRIDGE]: undefined,
        [FeatureGates.SWAP]: undefined,
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe(
          'All feature flags are disabled. Unlikely, so ignoring this response.',
        );
      }
    });

    it('should reject when only FeatureVars are present (no enabled gates)', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureVars.MARKR_SWAP_GAS_BUFFER]: '120',
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe(
          'All feature flags are disabled. Unlikely, so ignoring this response.',
        );
      }
    });
  });

  describe('valid cases', () => {
    it('should accept when at least one FeatureGate is true', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureGates.BRIDGE]: false,
        [FeatureGates.SWAP]: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[FeatureGates.EVERYTHING]).toBe(true);
        expect(result.data[FeatureGates.BRIDGE]).toBe(false);
      }
    });

    it('should accept FeatureVars as strings', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureVars.MARKR_SWAP_GAS_BUFFER]: '120',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[FeatureGates.EVERYTHING]).toBe(true);
        expect(result.data[FeatureVars.MARKR_SWAP_GAS_BUFFER]).toBe('120');
      }
    });

    it('should accept mix of enabled and disabled flags', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureGates.BRIDGE]: true,
        [FeatureGates.SWAP]: false,
        [FeatureGates.EVENTS]: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[FeatureGates.EVERYTHING]).toBe(true);
        expect(result.data[FeatureGates.BRIDGE]).toBe(true);
        expect(result.data[FeatureGates.SWAP]).toBe(false);
      }
    });

    it('should accept partial flags (missing optional flags)', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        // Other flags are optional and can be missing
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[FeatureGates.EVERYTHING]).toBe(true);
      }
    });
  });

  describe('type validation', () => {
    it('should reject FeatureGate with invalid type (string instead of boolean)', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: 'true', // Should be boolean
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toContain('Expected boolean');
      }
    });

    it('should reject FeatureGate with invalid type (number instead of boolean)', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: 1, // Should be boolean
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toContain('Expected boolean');
      }
    });

    it('should reject FeatureVar with invalid type (number instead of string)', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureVars.MARKR_SWAP_GAS_BUFFER]: 120, // Should be string
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toContain('Expected string');
      }
    });

    it('should reject FeatureVar with invalid type (boolean instead of string)', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureVars.MARKR_SWAP_GAS_BUFFER]: true, // Should be string
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toContain('Expected string');
      }
    });
  });

  describe('optional flag behavior', () => {
    it('should accept undefined FeatureGate values', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureGates.BRIDGE]: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('should accept undefined FeatureVar values', () => {
      const result = featureFlagsSchema.safeParse({
        [FeatureGates.EVERYTHING]: true,
        [FeatureVars.MARKR_SWAP_GAS_BUFFER]: undefined,
      });

      expect(result.success).toBe(true);
    });
  });
});

describe('posthogResponseSchema', () => {
  describe('valid responses', () => {
    it('should accept valid PostHog response structure', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlags: {
          [FeatureGates.EVERYTHING]: true,
          [FeatureGates.BRIDGE]: false,
        },
        featureFlagPayloads: {
          [FeatureGates.DEFI]: '>=1.60.0',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featureFlags[FeatureGates.EVERYTHING]).toBe(true);
        expect(result.data.featureFlagPayloads).toEqual({
          [FeatureGates.DEFI]: '>=1.60.0',
        });
      }
    });

    it('should accept response without featureFlagPayloads', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlags: {
          [FeatureGates.EVERYTHING]: true,
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featureFlagPayloads).toBeUndefined();
      }
    });

    it('should accept empty featureFlagPayloads', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlags: {
          [FeatureGates.EVERYTHING]: true,
        },
        featureFlagPayloads: {},
      });

      expect(result.success).toBe(true);
    });
  });

  describe('invalid responses', () => {
    it('should reject missing featureFlags', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlagPayloads: {},
      });

      expect(result.success).toBe(false);
    });

    it('should reject invalid featureFlagPayloads type', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlags: {
          [FeatureGates.EVERYTHING]: true,
        },
        featureFlagPayloads: {
          [FeatureGates.DEFI]: 123, // Should be string
        },
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toContain('Expected string');
      }
    });

    it('should reject empty featureFlags', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlags: {},
        featureFlagPayloads: {},
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe(
          'Feature flags object cannot be empty',
        );
      }
    });

    it('should reject all flags disabled in featureFlags', () => {
      const result = posthogResponseSchema.safeParse({
        featureFlags: {
          [FeatureGates.BRIDGE]: false,
          [FeatureGates.SWAP]: false,
        },
        featureFlagPayloads: {},
      });

      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe(
          'All feature flags are disabled. Unlikely, so ignoring this response.',
        );
      }
    });
  });
});
