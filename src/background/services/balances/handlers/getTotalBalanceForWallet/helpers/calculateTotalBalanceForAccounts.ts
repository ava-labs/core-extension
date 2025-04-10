import { Account } from '@src/background/services/accounts/models';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';

import { Balances } from '../../../models';

export function calculateTotalBalanceForAccounts(
  balances: Balances,
  accounts: Partial<Account>[],
  networks: NetworkWithCaipId[],
): number {
  console.log('DEBUG', accounts, networks, balances);
  return accounts.reduce((sum: number, account: Partial<Account>) => {
    const accountBalance = calculateTotalBalance(account, networks, balances);
    return sum + (accountBalance.sum ?? 0);
  }, 0);
}
