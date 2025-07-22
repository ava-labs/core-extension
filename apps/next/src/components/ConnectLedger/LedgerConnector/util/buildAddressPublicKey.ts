import { hex } from '@scure/base';
import {
  DerivationPath,
  getAddressDerivationPath,
  getSolanaDerivationPath,
} from '@avalabs/core-wallets-sdk';
import { VM } from '@avalabs/avalanchejs';
import { AddressPublicKeyJson, Curve } from '@core/types';

export const buildAddressPublicKey = (
  key: Buffer,
  vm: VM | 'SVM',
  accountIndex: number,
  curve: Curve,
): AddressPublicKeyJson => ({
  curve,
  derivationPath:
    vm === 'SVM'
      ? getSolanaDerivationPath(accountIndex)
      : getAddressDerivationPath(accountIndex, DerivationPath.LedgerLive, vm),
  type: 'address-pubkey',
  key: hex.encode(Uint8Array.from(key)),
});
