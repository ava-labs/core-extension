import { NetworkVMType } from '@avalabs/vm-module-types';

import { Account } from '@core/service-worker';
import { NetworkWithCaipId } from '@core/service-worker';

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
