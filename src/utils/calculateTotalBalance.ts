import { Network } from '@avalabs/chains-sdk';
import { Account } from '@src/background/services/accounts/models';
import { Balances } from '@src/background/services/balances/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';
import { hasAccountBalances } from './hasAccountBalances';

export function calculateTotalBalance(
  network?: Network,
  account?: Account,
  networkIds?: number[],
  balances?: Balances
) {
  if (!account || !balances || !network) {
    return null;
  }

  const chainIdsToSum = new Set([network.chainId, ...(networkIds ?? [])]);

  const hasBalances = hasAccountBalances(balances, account);

  if (!hasBalances) {
    return null;
  }

  const sum = Array.from(chainIdsToSum).reduce((total, networkItem) => {
    const address = getAddressForChain(networkItem, account);
    return (
      total +
      (Object.values(balances?.[networkItem]?.[address] ?? {})?.reduce(
        (sumTotal, token) => sumTotal + (token.balanceUSD ?? 0),
        0
      ) || 0)
    );
  }, 0);

  return sum;
}
