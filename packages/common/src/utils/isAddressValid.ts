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
    // We check for bech32 as well as base58 to cover P2SH + P2PKH addresses
    !!address.length && (isBech32Address(address) || isBase58Address(address))
  );
};

const MAINNET_HRP = 'avax';

export const isValidPvmAddress = (address: string, isTestnet: boolean) => {
  return isValidXPAddressWithPrefix(address, 'P-', isTestnet);
};

export const isValidAvmAddress = (address: string, isTestnet: boolean) => {
  return isValidXPAddressWithPrefix(address, 'X-', isTestnet);
};

export const isValidSvmAddress = (address: string) => {
  return isSvmAddress(address);
};

function isValidXPAddressWithPrefix(
  value: string,
  forcedPrefix: string | undefined,
  isTestnet: boolean,
) {
  const address =
    forcedPrefix && !value.startsWith(forcedPrefix)
      ? `${forcedPrefix}${value}`
      : value;

  const addressBody = stripAddressPrefix(address);
  return isValidXPAddressForNetwork(addressBody, isTestnet);
}

export const isValidXPAddressForNetwork = (
  address: string,
  isTestnet: boolean,
) => {
  const hrp = parseXPAddressHrp(address);

  if (hrp === undefined) {
    return false;
  }

  return isTestnet ? hrp !== MAINNET_HRP : hrp === MAINNET_HRP;
};

export const isValidXPAddress = (address: string) => {
  return parseXPAddressHrp(address) !== undefined;
};

const parseXPAddressHrp = (address: string): string | undefined => {
  try {
    const [hrp] = utils.parseBech32(address);

    return hrp;
  } catch {
    return undefined;
  }
};
