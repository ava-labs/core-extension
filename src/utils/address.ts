import { NetworkVMType } from '@avalabs/vm-module-types';

import { Account } from '@src/background/services/accounts/models';
import { omitUndefined } from '@src/utils/object';

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
  account: Account,
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
