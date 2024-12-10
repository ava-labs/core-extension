import { isString } from 'lodash';

import type { Account } from '@src/background/services/accounts/models';
import getAllAddressesForAccount from '@src/utils/getAllAddressesForAccount';

export function getAllAddressesForAccounts(accounts: Account[]): string[] {
  return accounts.flatMap(getAllAddressesForAccount).filter(isString);
}
