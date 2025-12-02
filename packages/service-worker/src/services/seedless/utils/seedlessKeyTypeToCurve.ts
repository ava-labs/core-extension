import { Ed25519, KeyTypeApi, Secp256k1 } from '@cubist-labs/cubesigner-sdk';

import { Curve } from '@core/types';

export const seedlessKeyTypeToCurve = (keyType: KeyTypeApi): Curve => {
  switch (keyType) {
    case Secp256k1.Evm:
    case Secp256k1.Btc:
    case Secp256k1.BtcTest:
    case Secp256k1.Ava:
    case Secp256k1.AvaTest:
      return 'secp256k1';

    case Ed25519.Solana:
      return 'ed25519';

    default:
      throw new Error('Unhandled key type:' + keyType);
  }
};
