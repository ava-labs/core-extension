import { hex } from '@scure/base';
import { getAddressDerivationPath } from '@avalabs/core-wallets-sdk';
import { VM } from '@avalabs/avalanchejs';
import { AddressPublicKeyJson, Curve } from '@core/types';

export function buildAddressPublicKey(
  key: Buffer,
  vm: VM | 'SVM',
  accountIndex: number,
  curve: Curve,
): AddressPublicKeyJson {
  return {
    curve,
    derivationPath: getAddressDerivationPath(accountIndex, vm),
    type: 'address-pubkey',
    key: hex.encode(Uint8Array.from(key)),
  };
}
