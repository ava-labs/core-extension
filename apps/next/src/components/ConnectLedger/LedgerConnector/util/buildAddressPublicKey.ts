import { hex } from '@scure/base';
import {
  DerivationPath,
  getAddressDerivationPath,
  getSolanaDerivationPath,
} from '@avalabs/core-wallets-sdk';
import { VM } from '@avalabs/avalanchejs';
import { AddressPublicKeyJson, Curve } from '@core/types';

export function buildAddressPublicKey(
  key: Buffer,
  vm: 'SVM',
  accountIndex: number,
  curve: Curve,
): AddressPublicKeyJson;
export function buildAddressPublicKey(
  key: Buffer,
  vm: VM,
  accountIndex: number,
  curve: Curve,
  pathSpec: DerivationPath,
): AddressPublicKeyJson;
export function buildAddressPublicKey(
  key: Buffer,
  vm: VM | 'SVM',
  accountIndex: number,
  curve: Curve,
  pathSpec?: DerivationPath,
): AddressPublicKeyJson {
  if (vm === 'SVM') {
    return {
      curve,
      derivationPath: getSolanaDerivationPath(accountIndex),
      type: 'address-pubkey',
      key: hex.encode(Uint8Array.from(key)),
    };
  }

  if (!pathSpec) {
    throw new Error('Path spec is required for non-Solana addresses');
  }

  return {
    curve,
    derivationPath: getAddressDerivationPath(accountIndex, pathSpec, vm),
    type: 'address-pubkey',
    key: hex.encode(Uint8Array.from(key)),
  };
}
