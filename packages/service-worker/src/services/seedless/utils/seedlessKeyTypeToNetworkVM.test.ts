import { NetworkVMType } from '@avalabs/vm-module-types';
import { Ed25519, KeyTypeApi, Secp256k1 } from '@cubist-labs/cubesigner-sdk';

import { seedlessKeyTypeToNetworkVM } from './seedlessKeyTypeToNetworkVM';

describe('seedlessKeyTypeToNetworkVM', () => {
  describe('EVM key type mapping', () => {
    it('returns NetworkVMType.EVM for Secp256k1.Evm', () => {
      const result = seedlessKeyTypeToNetworkVM(Secp256k1.Evm);
      expect(result).toBe(NetworkVMType.EVM);
    });
  });

  describe('Bitcoin key type mappings', () => {
    it('returns NetworkVMType.BITCOIN for Secp256k1.Btc', () => {
      const result = seedlessKeyTypeToNetworkVM(Secp256k1.Btc);
      expect(result).toBe(NetworkVMType.BITCOIN);
    });

    it('returns NetworkVMType.BITCOIN for Secp256k1.BtcTest', () => {
      const result = seedlessKeyTypeToNetworkVM(Secp256k1.BtcTest);
      expect(result).toBe(NetworkVMType.BITCOIN);
    });

    it('maps both Bitcoin key types to the same NetworkVM', () => {
      const btcResult = seedlessKeyTypeToNetworkVM(Secp256k1.Btc);
      const btcTestResult = seedlessKeyTypeToNetworkVM(Secp256k1.BtcTest);

      expect(btcResult).toBe(btcTestResult);
      expect(btcResult).toBe(NetworkVMType.BITCOIN);
    });
  });

  describe('Avalanche key type mappings', () => {
    it('returns NetworkVMType.AVM for Secp256k1.Ava', () => {
      const result = seedlessKeyTypeToNetworkVM(Secp256k1.Ava);
      expect(result).toBe(NetworkVMType.AVM);
    });

    it('returns NetworkVMType.AVM for Secp256k1.AvaTest', () => {
      const result = seedlessKeyTypeToNetworkVM(Secp256k1.AvaTest);
      expect(result).toBe(NetworkVMType.AVM);
    });

    it('maps both Avalanche key types to the same NetworkVM', () => {
      const avaResult = seedlessKeyTypeToNetworkVM(Secp256k1.Ava);
      const avaTestResult = seedlessKeyTypeToNetworkVM(Secp256k1.AvaTest);

      expect(avaResult).toBe(avaTestResult);
      expect(avaResult).toBe(NetworkVMType.AVM);
    });
  });

  describe('Solana key type mapping', () => {
    it('returns NetworkVMType.SVM for Ed25519.Solana', () => {
      const result = seedlessKeyTypeToNetworkVM(Ed25519.Solana);
      expect(result).toBe(NetworkVMType.SVM);
    });
  });

  describe('error handling for unsupported key types', () => {
    it('throws an error for unsupported key type', () => {
      const unsupportedKeyType = 'AnotherUnsupportedType' as KeyTypeApi;

      expect(() => seedlessKeyTypeToNetworkVM(unsupportedKeyType)).toThrow(
        'Unhandled key type:AnotherUnsupportedType',
      );
    });
  });
});
