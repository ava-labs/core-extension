import { NetworkVMType } from '@avalabs/vm-module-types';

import { Account } from 'packages/service-worker/src/services/accounts/models';
import { NetworkWithCaipId } from 'packages/service-worker/src/services/network/models';

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
