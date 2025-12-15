import { Ed25519, KeyTypeApi, Secp256k1 } from '@cubist-labs/cubesigner-sdk';

import { seedlessKeyTypeToCurve } from './seedlessKeyTypeToCurve';

describe('seedlessKeyTypeToCurve', () => {
  describe('secp256k1 key types', () => {
    it('returns secp256k1 for Secp256k1.Evm', () => {
      const result = seedlessKeyTypeToCurve(Secp256k1.Evm);
      expect(result).toBe('secp256k1');
    });

    it('returns secp256k1 for Secp256k1.Btc', () => {
      const result = seedlessKeyTypeToCurve(Secp256k1.Btc);
      expect(result).toBe('secp256k1');
    });

    it('returns secp256k1 for Secp256k1.BtcTest', () => {
      const result = seedlessKeyTypeToCurve(Secp256k1.BtcTest);
      expect(result).toBe('secp256k1');
    });

    it('returns secp256k1 for Secp256k1.Ava', () => {
      const result = seedlessKeyTypeToCurve(Secp256k1.Ava);
      expect(result).toBe('secp256k1');
    });

    it('returns secp256k1 for Secp256k1.AvaTest', () => {
      const result = seedlessKeyTypeToCurve(Secp256k1.AvaTest);
      expect(result).toBe('secp256k1');
    });
  });

  describe('ed25519 key types', () => {
    it('returns ed25519 for Ed25519.Solana', () => {
      const result = seedlessKeyTypeToCurve(Ed25519.Solana);
      expect(result).toBe('ed25519');
    });
  });

  describe('error handling for unsupported key types', () => {
    it('throws an error for unsupported key type', () => {
      const unsupportedKeyType = 'UnsupportedKeyType' as KeyTypeApi;

      expect(() => seedlessKeyTypeToCurve(unsupportedKeyType)).toThrow(
        'Unhandled key type:UnsupportedKeyType',
      );
    });

    it('throws an error with the key type in the message', () => {
      const unsupportedKeyType = 'AnotherUnsupportedType' as KeyTypeApi;

      expect(() => seedlessKeyTypeToCurve(unsupportedKeyType)).toThrow(
        'Unhandled key type:AnotherUnsupportedType',
      );
    });

    it('throws an error for null key type', () => {
      const nullKeyType = null as unknown as KeyTypeApi;

      expect(() => seedlessKeyTypeToCurve(nullKeyType)).toThrow(
        'Unhandled key type:null',
      );
    });

    it('throws an error for undefined key type', () => {
      const undefinedKeyType = undefined as unknown as KeyTypeApi;

      expect(() => seedlessKeyTypeToCurve(undefinedKeyType)).toThrow(
        'Unhandled key type:undefined',
      );
    });

    it('throws an Error instance with proper error type', () => {
      const unsupportedKeyType = 'InvalidKeyType' as KeyTypeApi;

      try {
        seedlessKeyTypeToCurve(unsupportedKeyType);
        fail('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Unhandled key type:');
      }
    });
  });
});
