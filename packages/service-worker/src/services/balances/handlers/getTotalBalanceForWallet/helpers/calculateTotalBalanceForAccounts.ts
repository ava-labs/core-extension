import { Account, Balances, NetworkWithCaipId } from '@core/types';
import { calculateTotalBalance } from '@core/common';

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
