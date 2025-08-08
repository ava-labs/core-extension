import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { Contact } from '@avalabs/types';
import { omitUndefined } from './object';

export function getContactAddressForChain(
  network?: NetworkWithCaipId,
  account?: Partial<Contact>,
) {
  if (!network || !account) {
    return '';
  }

  return (
    mapAddressesToVMs(account)[network.vmName satisfies NetworkVMType] ?? ''
  );
}

const mapAddressesToVMs = (
  contact: Partial<Contact>,
): Partial<Record<NetworkVMType, string>> =>
  omitUndefined({
    [NetworkVMType.EVM]: contact.address,
    [NetworkVMType.BITCOIN]: contact.addressBTC,
    [NetworkVMType.AVM]: contact.addressXP,
    [NetworkVMType.PVM]: contact.addressXP,
    [NetworkVMType.SVM]: contact.addressSVM,
  } as const);
