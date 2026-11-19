import { Avalanche } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { Account } from '@core/types';
import { omitUndefined } from './object';
import { address, networks } from 'bitcoinjs-lib';
import { isAddress } from 'ethers';

/**
 * Compares two addresses for equality. EVM addresses are hex and
 * case-insensitive, so they are compared without regard to case. All other
 * address types (Bitcoin, X/P-Chain, Solana) are case-sensitive and compared
 * exactly.
 */
export const isSameAddress = (a: string, b: string): boolean => {
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();

  // `isAddress` rejects mixed-case input with an invalid EIP-55 checksum, so
  // detection runs on the lowercased forms.
  if (isAddress(lowerA) && isAddress(lowerB)) {
    return lowerA === lowerB;
  }

  return a === b;
};

export const mapVMAddresses = (addresses: Record<NetworkVMType, string>) =>
  omitUndefined({
    addressC: addresses[NetworkVMType.EVM],
    addressBTC: addresses[NetworkVMType.BITCOIN] || undefined,
    addressAVM: addresses[NetworkVMType.AVM] || undefined,
    addressPVM: addresses[NetworkVMType.PVM] || undefined,
    addressCoreEth: addresses[NetworkVMType.CoreEth] || undefined,
    addressHVM: addresses[NetworkVMType.HVM] || undefined,
    addressSVM: addresses[NetworkVMType.SVM] || undefined,
  } as const);

export const mapAddressesToVMs = (
  account: Partial<Account>,
): Partial<Record<NetworkVMType, string>> =>
  omitUndefined({
    [NetworkVMType.EVM]: account.addressC,
    [NetworkVMType.BITCOIN]: account.addressBTC,
    [NetworkVMType.AVM]: account.addressAVM,
    [NetworkVMType.PVM]: account.addressPVM,
    [NetworkVMType.CoreEth]: account.addressCoreEth,
    [NetworkVMType.HVM]: account.addressHVM,
    [NetworkVMType.SVM]: account.addressSVM,
  } as const);

export const getAddressByVMType = (account: Account, vmType: NetworkVMType) =>
  mapAddressesToVMs(account)[vmType];

export function getAddressesInRange(
  xpubXP: string,
  providerXP: Avalanche.JsonRpcProvider,
  internal = false,
  start = 0,
  limit = 64,
) {
  const addresses: string[] = [];

  for (let i = start; i < start + limit; i++) {
    addresses.push(
      Avalanche.getAddressFromXpub(xpubXP, i, providerXP, 'P', internal).split(
        '-',
      )[1] as string,
    );
  }

  return addresses;
}

export function isBech32Address(btcAddress: string): boolean {
  try {
    // This function throws an exception if the address is not valid.
    address.fromBech32(btcAddress);
    return true;
  } catch {
    return false;
  }
}

/**
 * In addition to Bech32 validation, it makes sure that the address is from the correct network.
 */
export function isBech32AddressInNetwork(
  btcAddress: string,
  isMainnet: boolean,
) {
  if (isBech32Address(btcAddress)) {
    return btcAddress.toLowerCase().startsWith(isMainnet ? 'bc' : 'tb');
  }
  return false;
}

/**
 * Verify if its a valid base 58 encoded address
 */
export function isBase58Address(addr: string) {
  try {
    address.fromBase58Check(addr);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Verify if address is valid base58 and matches the network
 * @param addr P2PKH or P2SH address to verify
 * @param isMainnet If true will verify it's a valid mainnet address
 */
export function isBase58AddressInNetwork(addr: string, isMainnet: boolean) {
  if (!isBase58Address(addr)) return false;
  const network = isMainnet ? networks.bitcoin : networks.testnet;
  try {
    address.toOutputScript(addr, network);
    return true;
  } catch (_) {
    return false;
  }
}
