import {
  Account,
  Balances,
  NetworkWithCaipId,
  TotalPriceChange,
} from '@core/types';
import { hasAccountBalances } from './hasAccountBalances';
import { getAddressForChain } from './getAddressForChain';

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
    (dict, network) => ({
      ...dict,
      [network.chainId]: network,
    }),
    {},
  );
  const chainIdsToSum = new Set(Object.keys(networkDict).map(Number));

  const hasBalances = hasAccountBalances(
    balances,
    account,
    Array.from(chainIdsToSum),
  );

  if (!hasBalances) {
    return {
      sum: null,
      priceChange: {
        value: 0,
        percentage: [],
      },
    };
  }

  const sum = Array.from(chainIdsToSum).reduce(
    (
      total: {
        sum: number;
        priceChange: TotalPriceChange;
      },
      chainId,
    ) => {
      const address = getAddressForChain(networkDict[chainId], account);

      if (!address) {
        return total;
      }

      const sumValues = Object.values(
        balances?.[chainId]?.[address] ?? {},
      )?.reduce(
        (
          sumTotal: {
            sum: number;
            priceChange: TotalPriceChange;
          },
          token,
        ) => {
          const percentage = token.priceChanges?.percentage
            ? [
                ...sumTotal.priceChange.percentage,
                token.priceChanges?.percentage,
              ]
            : [...sumTotal.priceChange.percentage];

          return {
            sum: sumTotal.sum + (token.balanceInCurrency ?? 0),
            priceChange: {
              value:
                sumTotal.priceChange.value + (token.priceChanges?.value ?? 0),
              percentage,
            },
          };
        },
        { sum: 0, priceChange: { value: 0, percentage: [] } },
      ) || { sum: 0, priceChange: { value: 0, percentage: [] } };

      return {
        ...total,
        sum: total.sum + sumValues.sum,
        priceChange: {
          value: sumValues.priceChange.value + total.priceChange.value,
          percentage: [
            ...sumValues.priceChange.percentage,
            ...total.priceChange.percentage,
          ],
        },
      };
    },
    { sum: 0, priceChange: { value: 0, percentage: [] } },
  );

  return sum;
}
