import { isBech32Address } from '@avalabs/core-bridge-sdk';
import { isAddress } from 'ethers';
import { isAddress as isSvmAddress } from '@solana/kit';
import { stripAddressPrefix } from './stripAddressPrefix';
import { utils } from '@avalabs/avalanchejs';

export const isValidAddress = (address: string) => {
  return !!address.length && isAddress(address);
};

export const isValidBtcAddress = (address: string) => {
  return !!address.length && isBech32Address(address);
};

export const isValidPvmAddress = (address: string) => {
  return isValidXPAddressWithPrefix(address, 'P-');
};

export const isValidAvmAddress = (address: string) => {
  return isValidXPAddressWithPrefix(address, 'X-');
};

export const isValidSvmAddress = (address: string) => {
  return isSvmAddress(address);
};

function isValidXPAddressWithPrefix(value: string, forcedPrefix?: string) {
  const address =
    forcedPrefix && !value.startsWith(forcedPrefix)
      ? `${forcedPrefix}${value}`
      : value;

  const addressBody = stripAddressPrefix(address);
  return isValidXPAddress(addressBody);
}

export const isValidXPAddress = (address: string) => {
  try {
    utils.parseBech32(address);

    return true;
  } catch {
    return false;
  }
};
