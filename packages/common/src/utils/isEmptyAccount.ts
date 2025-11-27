import { Account, Balances, Network } from '@core/types';
import { getAllAddressesForAccount } from './account';
import { isNotNullish } from './typeUtils';

type NetworkLike = Pick<Network, 'chainId'>;

export function isEmptyAccount(
  balances: Balances | undefined,
  account: Partial<Account> | undefined,
  networks: NetworkLike[],
) {
  if (!balances || !account) {
    return true;
  }

  const allAccountAddresses = getAllAddressesForAccount(account);
  const networkBalances = networks
    .map(({ chainId }) => balances[chainId])
    .filter(isNotNullish);

  return networkBalances.every((networkBalance) => {
    const accountAddresses = allAccountAddresses.filter(
      (address) => address in networkBalance,
    );

    return accountAddresses.every((address) => {
      const accountBalance = networkBalance[address];
      return (
        !accountBalance ||
        Object.values(accountBalance).every(({ balance }) => balance === 0n)
      );
    });
  });
}
