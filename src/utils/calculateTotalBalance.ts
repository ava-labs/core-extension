import { Network } from '@avalabs/chains-sdk';
import { Account } from '@src/background/services/accounts/models';
import { Balances } from '@src/background/services/balances/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';

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

  const sum = Array.from(chainIdsToSum).reduce((total, network) => {
    const address = getAddressForChain(network, account);
    return (
      total +
      (Object.values(balances?.[network]?.[address] ?? {})?.reduce(
        (sum, token) => sum + (token.balanceUSD ?? 0),
        0
      ) || 0)
    );
  }, 0);

  return sum;
}
