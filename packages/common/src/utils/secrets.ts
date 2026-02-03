import { NetworkVMType } from '@avalabs/vm-module-types';

import { ExtendedPublicKey, PrimaryWalletSecrets } from '@core/types';

export const getLegacyXPAddressIndexFromPath = (path: string): number => {
  const unprefixed = path.replace('m/', '');
  const [, , , , addressIndex] = unprefixed.split('/');

  if (!addressIndex) {
    throw new Error('Invalid legacy X/P derivation path:' + path);
  }

  return parseInt(addressIndex);
};

export const getSolanaAccountIndexFromPath = (path: string): number => {
  const unprefixed = path.replace('m/', '');
  const [, , accountIndex] = unprefixed.split('/');

  if (!accountIndex) {
    throw new Error('Invalid Solana derivation path:' + path);
  }

  return parseInt(accountIndex);
};

export const getXPAccountIndexFromPath = (path: string): number => {
  const unprefixed = path.replace('m/', '');
  const [, , accountIndex] = unprefixed.split('/');

  if (!accountIndex) {
    throw new Error('Invalid X/P derivation path:' + path);
  }

  return parseInt(accountIndex);
};

export const getEvmAccountIndexFromPath = (path: string): number => {
  const lastSegment = path.split('/').pop();

  if (!lastSegment) {
    throw new Error('Invalid EVM derivation path:' + path);
  }

  return parseInt(lastSegment);
};

export const getAddressIndexFromPath = (
  vm: NetworkVMType,
  path: string,
): number => {
  switch (vm) {
    case NetworkVMType.AVM:
    case NetworkVMType.PVM:
      return getXPAccountIndexFromPath(path);
    case NetworkVMType.SVM:
      return getSolanaAccountIndexFromPath(path);
    default:
      return getEvmAccountIndexFromPath(path);
  }
};

export const getAvalancheXPub = (
  secrets: PrimaryWalletSecrets,
  accountIndex: number,
): ExtendedPublicKey | undefined => {
  if (!secrets || !('extendedPublicKeys' in secrets)) {
    return;
  }

  return secrets.extendedPublicKeys.find(
    (key) =>
      key.curve === 'secp256k1' &&
      key.derivationPath === getAvalancheExtendedKeyPath(accountIndex),
  );
};
export const getEvmBasePath = (): string => `m/44'/60'/`;

export const getEvmExtendedKeyPath = (index: number): string =>
  `${getEvmBasePath()}${index}'`;

export const getAvalancheXpBasePath = (): string => `m/44'/9000'/`;

export const getAvalancheExtendedKeyPath = (accountIndex: number): string =>
  `${getAvalancheXpBasePath()}${accountIndex}'`;

export const getLegacyXPDerivationPath = (
  addressIndex: number,
  isChange = false,
): string =>
  `${getAvalancheExtendedKeyPath(0)}/${isChange ? '1' : '0'}/${addressIndex}`;

export const isAvalancheExtendedKey = ({
  derivationPath,
  curve,
}: ExtendedPublicKey): boolean =>
  derivationPath.startsWith(getAvalancheXpBasePath()) && curve === 'secp256k1';

// Keystone QR codes return paths without the 'm/' prefix (e.g., "44'/60'/0'")
// while internal paths use the full form (e.g., "m/44'/60'/0'")
const normalizeDerivationPath = (path: string): string =>
  path.startsWith('m/') ? path : `m/${path}`;

export const isEvmDerivationPath = (path: string): boolean =>
  normalizeDerivationPath(path).startsWith(getEvmBasePath());

export const isAvalancheDerivationPath = (path: string): boolean =>
  normalizeDerivationPath(path).startsWith(getAvalancheXpBasePath());
