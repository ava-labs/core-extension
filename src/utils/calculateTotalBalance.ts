import type { Account } from '@src/background/services/accounts/models';
import type {
  Balances,
  TotalPriceChange,
} from '@src/background/services/balances/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';
import { hasAccountBalances } from './hasAccountBalances';

export function calculateTotalBalance(
  account?: Partial<Account>,
  networkIds?: number[],
  balances?: Balances,
) {
  if (!account || !balances || !networkIds?.length) {
    return {
      sum: null,
      priceChange: {
        value: 0,
        percentage: [],
      },
    };
  }

  const chainIdsToSum = new Set(networkIds);

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
      networkItem,
    ) => {
      const address = getAddressForChain(networkItem, account);

      if (!address) {
        return total;
      }

      const sumValues = Object.values(
        balances?.[networkItem]?.[address] ?? {},
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
