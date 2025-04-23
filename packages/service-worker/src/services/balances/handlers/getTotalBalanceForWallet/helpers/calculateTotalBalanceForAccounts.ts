import { Account } from '../../../../../services/accounts/models';
import { NetworkWithCaipId } from '../../../../../services/network/models';
import { calculateTotalBalance } from '@core/utils';

import { Balances } from '../../../models';

export function calculateTotalBalanceForAccounts(
  balances: Balances,
  accounts: Partial<Account>[],
  networks: NetworkWithCaipId[],
): number {
  return accounts.reduce((sum: number, account: Partial<Account>) => {
    const accountBalance = calculateTotalBalance(account, networks, balances);
    return sum + (accountBalance.sum ?? 0);
  }, 0);
}
