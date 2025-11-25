import { Secp256k1, Ed25519 } from '@cubist-labs/cubesigner-sdk';

import { KeySet, KeySetEntry } from '../types';
import { REQUIRED_KEY_TYPES } from './constants';
import { isValidKeySet } from './isValidKeySet';

describe('isValidKeySet', () => {
  // Mock test data
  const mockEvmKeyEntry: KeySetEntry = {
    type: Secp256k1.Evm,
    key: {
      type: 'address-pubkey',
      curve: 'secp256k1',
      derivationPath: "m/44'/60'/0'/0/0",
      key: '0x04a6534b16494d485de19de1fa3fb240329405ec0c225a545fbd9182b901bc0a32eb64766eb3db48b9f76366537e26f175e2497ae520d0856d49dd2911489d83dd',
    },
  };

  const mockAvaKeyEntry: KeySetEntry = {
    type: Secp256k1.Ava,
    key: {
      type: 'address-pubkey',
      curve: 'secp256k1',
      derivationPath: "m/44'/9000'/0'/0/0",
      key: '0x04a6534b16494d485de19de1fa3fb240329405ec0c225a545fbd9182b901bc0a32eb64766eb3db48b9f76366537e26f175e2497ae520d0856d49dd2911489d83dd',
    },
  };

  const mockSolanaKeyEntry: KeySetEntry = {
    type: Ed25519.Solana,
    key: {
      type: 'address-pubkey',
      curve: 'ed25519',
      derivationPath: "m/44'/501'/0'/0'",
      key: 'CKTNaNZ6Ca4KNeygjYXGGH8wpd9VZ1ETsWHcH1wqQJzT',
    },
  };

  describe('when key set contains all required key types', () => {
    it('returns true for a key set with only required keys', () => {
      const validKeySet: KeySet = [mockEvmKeyEntry];

      expect(isValidKeySet(validKeySet)).toBe(true);
    });

    it('returns true for a key set with required and optional keys', () => {
      const validKeySet: KeySet = [
        mockEvmKeyEntry,
        mockAvaKeyEntry,
        mockSolanaKeyEntry,
      ];

      expect(isValidKeySet(validKeySet)).toBe(true);
    });

    it('returns true for a key set with duplicate required key types', () => {
      const anotherEvmKey: KeySetEntry = {
        type: Secp256k1.Evm,
        key: {
          type: 'address-pubkey',
          curve: 'secp256k1',
          derivationPath: "m/44'/60'/0'/0/1",
          key: '0x04567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        },
      };

      const validKeySet: KeySet = [mockEvmKeyEntry, anotherEvmKey];

      expect(isValidKeySet(validKeySet)).toBe(true);
    });
  });

  describe('when key set is missing required key types', () => {
    it('returns false for an empty key set', () => {
      const emptyKeySet: KeySet = [];

      expect(isValidKeySet(emptyKeySet)).toBe(false);
    });

    it('returns false for a key set with only optional keys', () => {
      const invalidKeySet: KeySet = [mockAvaKeyEntry, mockSolanaKeyEntry];

      expect(isValidKeySet(invalidKeySet)).toBe(false);
    });

    it('returns false when required key type is missing but other types are present', () => {
      const invalidKeySet: KeySet = [mockAvaKeyEntry, mockSolanaKeyEntry];

      expect(isValidKeySet(invalidKeySet)).toBe(false);
    });

    it('returns false for a key set with malformed entries', () => {
      const malformedKeySet: KeySet = [
        { type: Secp256k1.Evm, key: null as any },
        { type: undefined as any, key: mockEvmKeyEntry.key },
      ];

      expect(isValidKeySet(malformedKeySet)).toBe(false);
    });
  });

  describe('constants validation', () => {
    it('validates that REQUIRED_KEY_TYPES contains expected types', () => {
      expect(REQUIRED_KEY_TYPES).toContain(Secp256k1.Evm);
      expect(REQUIRED_KEY_TYPES.length).toBeGreaterThan(0);
    });

    it('handles when key set contains all required types plus extras', () => {
      // Test that having more than required is still valid
      const extendedKeySet: KeySet = [
        mockEvmKeyEntry,
        mockAvaKeyEntry,
        mockSolanaKeyEntry,
        mockEvmKeyEntry, // Duplicate for good measure
      ];

      expect(isValidKeySet(extendedKeySet)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('works correctly when REQUIRED_KEY_TYPES array is empty', () => {
      // Mock the constants to test behavior with no requirements
      const originalRequiredTypes = [...REQUIRED_KEY_TYPES];
      (REQUIRED_KEY_TYPES as any).length = 0; // Clear the array

      try {
        // When no types are required, any key set should be valid
        expect(isValidKeySet([])).toBe(true);
        expect(isValidKeySet([mockAvaKeyEntry])).toBe(true);
      } finally {
        // Restore the original array
        REQUIRED_KEY_TYPES.length = 0;
        REQUIRED_KEY_TYPES.push(...originalRequiredTypes);
      }
    });

    it('returns false when keySet has entries with missing type property', () => {
      const keySetWithMalformedEntry = [
        mockEvmKeyEntry,
        { key: mockEvmKeyEntry.key } as any,
      ];

      expect(isValidKeySet(keySetWithMalformedEntry)).toBe(false);
    });
  });
});
