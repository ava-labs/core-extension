import { Account, Balances, NetworkWithCaipId } from '@core/types';
import { calculateTotalBalance } from '@core/common';

export function calculateTotalBalanceForAccounts(
  balances: Balances,
  accounts: Partial<Account>[],
  networks: NetworkWithCaipId[],
): { balance: number; priceChangeValue: number } {
  return accounts.reduce(
    (
      acc: { balance: number; priceChangeValue: number },
      account: Partial<Account>,
    ) => {
      const accountBalance = calculateTotalBalance(account, networks, balances);
      return {
        balance: acc.balance + (accountBalance.sum ?? 0),
        priceChangeValue:
          acc.priceChangeValue + (accountBalance.priceChange?.value ?? 0),
      };
    },
    { balance: 0, priceChangeValue: 0 },
  );
}
