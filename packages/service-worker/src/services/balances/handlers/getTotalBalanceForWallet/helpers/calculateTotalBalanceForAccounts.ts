import {
  Account,
  Balances,
  NetworkWithCaipId,
  TokensPriceShortData,
} from '@core/types';
import { calculateTotalBalance } from '@core/common';

export function calculateTotalBalanceForAccounts(
  balances: Balances,
  accounts: Partial<Account>[],
  networks: NetworkWithCaipId[],
  priceChangesData?: TokensPriceShortData,
): number {
  return accounts.reduce((sum: number, account: Partial<Account>) => {
    const accountBalance = calculateTotalBalance(
      account,
      networks,
      balances,
      true,
      priceChangesData,
    );
    return sum + (accountBalance.sum ?? 0);
  }, 0);
}
