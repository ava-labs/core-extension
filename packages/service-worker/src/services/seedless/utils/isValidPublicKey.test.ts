import { KeyInfo, Secp256k1, Ed25519 } from '@cubist-labs/cubesigner-sdk';

import { ValidPublicKey } from '../types';
import { isValidPublicKey } from './isValidPublicKey';
import { SUPPORTED_KEY_TYPES } from './constants';

describe('isValidPublicKey', () => {
  // Mock valid KeyInfo object
  const createMockKeyInfo = (overrides: Partial<KeyInfo> = {}): KeyInfo => ({
    id: 'test-key-id',
    type: Secp256k1.Evm,
    key_type: Secp256k1.Evm,
    materialId: 'test-material-id',
    material_id: 'test-material-id',
    owner: 'test-owner',
    policy: [],
    purpose: 'test-purpose',
    publicKey: 'test-public-key',
    public_key: 'test-public-key',
    key_id: 'test-key-id',

    enabled: true,
    derivation_info: {
      mnemonic_id: 'test-mnemonic-id',
      derivation_path: "m/44'/60'/0'/0/0",
    },
    ...overrides,
  });

  describe('when all conditions are met', () => {
    it('returns true for a valid EVM key', () => {
      const validKey = createMockKeyInfo({
        key_type: Secp256k1.Evm,
        enabled: true,
        derivation_info: {
          mnemonic_id: 'test-mnemonic-id',
          derivation_path: "m/44'/60'/0'/0/0",
        },
      });

      expect(isValidPublicKey(validKey)).toBe(true);
    });

    it('returns true for a valid Avalanche key', () => {
      const validKey = createMockKeyInfo({
        key_type: Secp256k1.Ava,
        enabled: true,
        derivation_info: {
          mnemonic_id: 'test-mnemonic-id',
          derivation_path: "m/44'/9000'/0'/0/0",
        },
      });

      expect(isValidPublicKey(validKey)).toBe(true);
    });

    it('returns true for a valid Solana key', () => {
      const validKey = createMockKeyInfo({
        key_type: Ed25519.Solana,
        enabled: true,
        derivation_info: {
          mnemonic_id: 'test-mnemonic-id',
          derivation_path: "m/44'/501'/0'/0'",
        },
      });

      expect(isValidPublicKey(validKey)).toBe(true);
    });

    it('acts as a type guard narrowing to ValidPublicKey', () => {
      const keyInfo = createMockKeyInfo();

      if (isValidPublicKey(keyInfo)) {
        // TypeScript should recognize this as ValidPublicKey
        const validKey: ValidPublicKey = keyInfo;
        expect(validKey.derivation_info.derivation_path).toBeDefined();
        expect(validKey.enabled).toBe(true);
      }
    });
  });

  describe('when enabled is false', () => {
    it('returns false when key is disabled', () => {
      const disabledKey = createMockKeyInfo({
        enabled: false,
      });

      expect(isValidPublicKey(disabledKey)).toBe(false);
    });
  });

  describe('when derivation_info is invalid', () => {
    it('returns true when derivation_info is null', () => {
      const keyWithNullDerivation = createMockKeyInfo({
        derivation_info: null,
      });

      expect(isValidPublicKey(keyWithNullDerivation)).toBe(true);
    });

    it('returns true when derivation_info is undefined ', () => {
      const keyWithUndefinedDerivation = createMockKeyInfo({
        derivation_info: undefined,
      });

      expect(isValidPublicKey(keyWithUndefinedDerivation)).toBe(true);
    });
  });

  describe('when key_type is not supported', () => {
    it('returns false for unsupported key type', () => {
      const unsupportedKey = createMockKeyInfo({
        key_type: 'UnsupportedKeyType' as any,
      });

      expect(isValidPublicKey(unsupportedKey)).toBe(false);
    });

    it('returns false when key_type is null', () => {
      const keyWithNullType = createMockKeyInfo({
        key_type: null as any,
      });

      expect(isValidPublicKey(keyWithNullType)).toBe(false);
    });

    it('returns false when key_type is undefined', () => {
      const keyWithUndefinedType = createMockKeyInfo({
        key_type: undefined as any,
      });

      expect(isValidPublicKey(keyWithUndefinedType)).toBe(false);
    });
  });

  describe('constants validation', () => {
    it('validates that all supported key types return true when other conditions are met', () => {
      SUPPORTED_KEY_TYPES.forEach((keyType) => {
        const validKey = createMockKeyInfo({
          key_type: keyType,
          enabled: true,
          derivation_info: {
            mnemonic_id: 'test-mnemonic-id',
            derivation_path: "m/44'/0'/0'/0/0",
          },
        });

        expect(isValidPublicKey(validKey)).toBe(true);
      });
    });
  });
});
