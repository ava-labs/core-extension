import { NetworkVMType } from '@avalabs/vm-module-types';

import { Account } from '@src/background/services/accounts/models';
import { NetworkWithCaipId } from '@src/background/services/network/models';

import { mapAddressesToVMs } from './address';

export function getAddressForChain(
  network?: NetworkWithCaipId,
  account?: Partial<Account>,
) {
  if (!network || !account) {
    return '';
  }

  return (
    mapAddressesToVMs(account)[network.vmName satisfies NetworkVMType] ?? ''
  );
}
