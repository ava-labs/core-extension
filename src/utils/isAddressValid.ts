import { isBech32Address } from '@avalabs/bridge-sdk';
import { isAddress } from 'ethers';
import { isNil, isString } from 'lodash';
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

function isValidXPAddressWithPrefix(value: unknown, forcedPrefix?: string) {
  if (
    isNil(value) ||
    !isString(value) ||
    (forcedPrefix && !value.startsWith(forcedPrefix))
  ) {
    return false;
  }
  const addressBody = stripAddressPrefix(value);
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
