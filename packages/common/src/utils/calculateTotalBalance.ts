import {
  Account,
  Balances,
  getUnconfirmedBalanceInCurrency,
  NetworkWithCaipId,
  TotalPriceChange,
} from '@core/types';
import { getAddressForChain } from './getAddressForChain';
import { hasAccountBalances } from './hasAccountBalances';

export const watchlistTokens = ['avax', 'btc', 'sol'];

export function calculateTotalBalance(
  account?: Partial<Account>,
  networks?: NetworkWithCaipId[],
  balances?: Balances,
) {
  if (!account || !balances || !networks?.length) {
    return {
      sum: null,
      priceChange: {
        value: 0,
        percentage: [],
      },
    };
  }

  const networkDict: Record<number, NetworkWithCaipId> = networks.reduce(
    (dict, network) => {
      dict[network.chainId] = network;
      return dict;
    },
    {},
  );

  const chainIdsToSum = Array.from(
    new Set(Object.keys(networkDict).map(Number)),
  );

  const hasBalances = hasAccountBalances(balances, account, chainIdsToSum);

  if (!hasBalances) {
    return {
      sum: null,
      priceChange: {
        value: 0,
        percentage: [],
      },
    };
  }

  const sum = chainIdsToSum.reduce(
    (
      total: {
        sum: number;
        priceChange: TotalPriceChange;
      },
      chainId,
    ) => {
      const network = networkDict[chainId];
      const address = getAddressForChain(network, account);

      if (!address) {
        return total;
      }

      const tokens = balances?.[chainId]?.[address];
      if (!tokens) {
        return total;
      }

      const sumValues = Object.values(tokens).reduce<BalanceAccumulator>(
        (sumTotal, token) => {
          const confirmedBalance = token.balanceInCurrency ?? 0;

          const unconfirmedBalance =
            getUnconfirmedBalanceInCurrency(token) ?? 0;

          sumTotal.sum += confirmedBalance + unconfirmedBalance;

          if (token.priceChanges?.value) {
            sumTotal.priceChange.value += token.priceChanges.value;
          }

          if (token.priceChanges?.percentage) {
            sumTotal.priceChange.percentage.push(token.priceChanges.percentage);
          }

          return sumTotal;
        },
        { sum: 0, priceChange: { value: 0, percentage: [] } },
      );

      total.sum += sumValues.sum;
      total.priceChange.value += sumValues.priceChange.value;
      total.priceChange.percentage.unshift(...sumValues.priceChange.percentage);
      return total;
    },
    { sum: 0, priceChange: { value: 0, percentage: [] } },
  );

  return sum;
}

type BalanceAccumulator = {
  sum: number;
  priceChange: TotalPriceChange;
};
