import { NetworkVMType } from '@avalabs/vm-module-types';

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
