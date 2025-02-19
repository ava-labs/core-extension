import { NetworkVMType } from '@avalabs/vm-module-types';
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
