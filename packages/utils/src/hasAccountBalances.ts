import { Account } from '@core/service-worker';
import { Balances } from '@core/service-worker';
import getAllAddressesForAccount from './getAllAddressesForAccount';

export function hasAccountBalances(
  balances: Balances,
  account: Partial<Account>,
  networkIds: number[],
) {
  const accountAddresses = getAllAddressesForAccount(account);

  return Object.entries(balances)
    .filter(([networkId]) => networkIds.includes(Number(networkId)))
    .some(([, item]) => {
      if (!item) {
        return false;
      }
      const balanceAddresses = Object.keys(item);

      return balanceAddresses.some((address) => {
        return accountAddresses.includes(address);
      });
    });
}
