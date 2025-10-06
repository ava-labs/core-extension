import { Avalanche } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { Account } from '@core/types';
import { omitUndefined } from './object';

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
