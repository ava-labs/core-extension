import {
  Curve as KeystoneCurve,
  DerivationAlgorithm,
} from '@keystonehq/bc-ur-registry';
import { fromPublicKey } from 'bip32';
import KeystoneUSBAvalancheSDK from '@keystonehq/hw-app-avalanche';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';

import { ExtendedPublicKey } from '@core/types';
import { getAvalancheExtendedKeyPath } from '@core/common';

export const getAvalancheExtendedPublicKeyFromKeystoneUsb = async (
  accountIndex: number,
): Promise<ExtendedPublicKey> => {
  const app = new KeystoneUSBAvalancheSDK(await createKeystoneTransport());
  const { publicKey, chainCode } = await app.getPubkey(
    getAvalancheExtendedKeyPath(accountIndex),
    KeystoneCurve.secp256k1,
    DerivationAlgorithm.slip10,
  );

  return {
    type: 'extended-pubkey',
    curve: 'secp256k1',
    derivationPath: getAvalancheExtendedKeyPath(accountIndex),
    key: fromPublicKey(Buffer.from(publicKey, 'hex'), chainCode).toBase58(),
  };
};
