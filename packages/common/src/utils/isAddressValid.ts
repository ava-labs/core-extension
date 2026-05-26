import { isAddress } from 'ethers';
import { isAddress as isSvmAddress } from '@solana/kit';
import { stripAddressPrefix } from './stripAddressPrefix';
import { utils } from '@avalabs/avalanchejs';
import { isBase58Address, isBech32Address } from './address';

export const isValidAddress = (address: string) => {
  return !!address.length && isAddress(address);
};

export const isValidBtcAddress = (address: string) => {
  return (
    // We check for bech32 as well as base58 to cover PS2H + P2PKH addresses
    !!address.length && (isBech32Address(address) || isBase58Address(address))
  );
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
