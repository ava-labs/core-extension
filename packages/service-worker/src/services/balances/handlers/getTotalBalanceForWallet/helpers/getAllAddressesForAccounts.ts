import { isString } from 'lodash';

import type { Account } from '../../../../../services/accounts/models';
import getAllAddressesForAccount from '@src/utils/getAllAddressesForAccount';

export function getAllAddressesForAccounts(accounts: Account[]): string[] {
  return accounts.flatMap(getAllAddressesForAccount).filter(isString);
}
