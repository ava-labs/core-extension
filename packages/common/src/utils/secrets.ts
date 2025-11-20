import { NetworkVMType } from '@avalabs/vm-module-types';
import { EVM_BASE_DERIVATION_PATH, PrimaryWalletSecrets } from '@core/types';

export const getLegacyXPAddressIndexFromPath = (path: string) => {
  const unprefixed = path.replace('m/', '');
  const [, , , , addressIndex] = unprefixed.split('/');

  if (!addressIndex) {
    throw new Error('Invalid legacy X/P derivation path:' + path);
  }

  return parseInt(addressIndex);
};

export const getSolanaAccountIndexFromPath = (path: string) => {
  const unprefixed = path.replace('m/', '');
  const [, , accountIndex] = unprefixed.split('/');

  if (!accountIndex) {
    throw new Error('Invalid Solana derivation path:' + path);
  }

  return parseInt(accountIndex);
};

export const getXPAccountIndexFromPath = (path: string) => {
  const unprefixed = path.replace('m/', '');
  const [, , accountIndex] = unprefixed.split('/');

  if (!accountIndex) {
    throw new Error('Invalid X/P derivation path:' + path);
  }

  return parseInt(accountIndex);
};

export const getEvmAccountIndexFromPath = (path: string) => {
  const lastSegment = path.split('/').pop();

  if (!lastSegment) {
    throw new Error('Invalid EVM derivation path:' + path);
  }

  return parseInt(lastSegment);
};

export const getAddressIndexFromPath = (vm: NetworkVMType, path: string) => {
  switch (vm) {
    case NetworkVMType.AVM:
    case NetworkVMType.PVM:
      return getLegacyXPAddressIndexFromPath(path);
    case NetworkVMType.SVM:
      return getSolanaAccountIndexFromPath(path);
    default:
      return getEvmAccountIndexFromPath(path);
  }
};

export const getAvalancheXPub = (
  secrets: PrimaryWalletSecrets,
  accountIndex: number,
) => {
  if (!secrets || !('extendedPublicKeys' in secrets)) {
    return;
  }

  return secrets.extendedPublicKeys.find(
    (key) =>
      key.curve === 'secp256k1' &&
      key.derivationPath === getAvalancheExtendedKeyPath(accountIndex),
  );
};

export const getEvmExtendedKeyPath = () => EVM_BASE_DERIVATION_PATH;

export const getAvalancheExtendedKeyPath = (accountIndex: number) =>
  `m/44'/9000'/${accountIndex}'`;
