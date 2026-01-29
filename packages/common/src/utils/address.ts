import { Avalanche } from '@avalabs/core-wallets-sdk';
import { utils } from '@avalabs/avalanchejs';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { Account } from '@core/types';
import { omitUndefined } from './object';

/**
 * Derives the correct CoreEth address from an EVM address.
 *
 * CoreEth should be the bech32 encoding of the EVM address bytes (20 bytes from keccak256).
 * The avalanche-module incorrectly derives CoreEth using ripemd160+sha256, so we fix it here.
 *
 * @param evmAddress - The EVM address (0x-prefixed hex string)
 * @param isTestnet - Whether to use testnet prefix (fuji vs avax)
 * @returns The correct CoreEth address (e.g., "C-avax1...")
 */
export const deriveCoreEthFromEvmAddress = (
  evmAddress: string,
  isTestnet = false,
): string => {
  if (!evmAddress || !evmAddress.startsWith('0x')) {
    return '';
  }

  try {
    // Remove 0x prefix and convert to bytes
    const evmHex = evmAddress.slice(2).toLowerCase();
    const evmBytes = utils.hexToBuffer(evmHex);

    // Encode as bech32 with avax/fuji prefix
    const hrp = isTestnet ? 'fuji' : 'avax';
    const bech32Address = utils.formatBech32(hrp, evmBytes);

    return `C-${bech32Address}`;
  } catch {
    return '';
  }
};

export const mapVMAddresses = (addresses: Record<NetworkVMType, string>) => {
  const evmAddress = addresses[NetworkVMType.EVM];

  // Workaround: Derive correct CoreEth from EVM address if available.
  // The avalanche-module incorrectly uses ripemd160+sha256 for CoreEth derivation,
  // but it should be the bech32 encoding of the EVM address bytes (keccak256).
  const correctCoreEth = evmAddress
    ? deriveCoreEthFromEvmAddress(evmAddress)
    : addresses[NetworkVMType.CoreEth] || undefined;

  return omitUndefined({
    addressC: evmAddress,
    addressBTC: addresses[NetworkVMType.BITCOIN] || undefined,
    addressAVM: addresses[NetworkVMType.AVM] || undefined,
    addressPVM: addresses[NetworkVMType.PVM] || undefined,
    addressCoreEth: correctCoreEth,
    addressHVM: addresses[NetworkVMType.HVM] || undefined,
    addressSVM: addresses[NetworkVMType.SVM] || undefined,
  } as const);
};

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
