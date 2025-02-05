import type { Account } from '@src/background/services/accounts/models';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';

import type { Balances } from '../../../models';

export function calculateTotalBalanceForAccounts(
  balances: Balances,
  accounts: Partial<Account>[],
  chainIds: number[],
): number {
  return accounts.reduce((sum: number, account: Partial<Account>) => {
    const accountBalance = calculateTotalBalance(account, chainIds, balances);
    return sum + (accountBalance.sum ?? 0);
  }, 0);
}
