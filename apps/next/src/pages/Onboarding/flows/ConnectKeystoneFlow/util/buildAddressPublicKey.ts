import { hex } from '@scure/base';
import {
  DerivationPath,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import { VM } from '@avalabs/avalanchejs';

import { AddressPublicKeyJson } from '@core/types';

export const buildAddressPublicKey = (
  key: Buffer,
  accountIndex: number,
  vm: VM,
): AddressPublicKeyJson => ({
  curve: 'secp256k1',
  derivationPath: getAddressDerivationPath(accountIndex, vm, {
    pathSpec: DerivationPath.BIP44,
  }),
  type: 'address-pubkey',
  key: hex.encode(Uint8Array.from(key)),
});
