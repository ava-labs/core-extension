import { NetworkVMType } from '@avalabs/vm-module-types';
import { Ed25519, KeyTypeApi, Secp256k1 } from '@cubist-labs/cubesigner-sdk';

export const seedlessKeyTypeToNetworkVM = (keyType: KeyTypeApi) => {
  switch (keyType) {
    case Secp256k1.Evm:
      return NetworkVMType.EVM;
    case Secp256k1.Btc:
    case Secp256k1.BtcTest:
      return NetworkVMType.BITCOIN;
    case Secp256k1.Ava:
    case Secp256k1.AvaTest:
      return NetworkVMType.AVM;
    case Ed25519.Solana:
      return NetworkVMType.SVM;
    default:
      throw new Error('Unhandled key type:' + keyType);
  }
};
