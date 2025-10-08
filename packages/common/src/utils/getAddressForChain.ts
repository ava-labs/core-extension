import { Account, NetworkWithCaipId } from '@core/types';

import { mapAddressesToVMs } from './address';

export function getAddressForChain(
  network?: NetworkWithCaipId,
  account?: Partial<Account>,
) {
  if (!network || !account) {
    return '';
  }

  return mapAddressesToVMs(account)[network.vmName] ?? '';
}
