import {
  Account,
  Balances,
  NetworkWithCaipId,
  TotalPriceChange,
} from '@core/types';
import { hasAccountBalances } from './hasAccountBalances';
import { getAddressForChain } from './getAddressForChain';
import {
  NetworkVMType,
  TokenType,
  TokenWithBalance,
  TokenWithBalanceAVM,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';

export function calculateTotalBalance(
  account?: Partial<Account>,
  networks?: NetworkWithCaipId[],
  balances?: Balances,
  isUsedForWalletBalance?: boolean,
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
      const network = networkDict[chainId];
      const address = getAddressForChain(network, account);

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

          const balanceInCurrency =
            getBalanceInCurrency(token, isUsedForWalletBalance, network) ?? 0;

          return {
            sum: sumTotal.sum + balanceInCurrency,
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

const getBalanceInCurrency = (
  token: TokenWithBalance,
  isUsedForWalletBalance?: boolean,
  network?: NetworkWithCaipId,
) => {
  if (
    isUsedForWalletBalance &&
    token.type === TokenType.NATIVE &&
    token.symbol === 'AVAX' &&
    isXPToken(token, network)
  ) {
    return getBalanceForWalletBalance(token);
  }
  return token.balanceInCurrency ?? 0;
};

const getBalanceForWalletBalance = (
  token: TokenWithBalancePVM | TokenWithBalanceAVM,
) => {
  let totalUtxoBalance = 0;

  if (token.priceInCurrency === undefined) {
    return undefined;
  }

  if (token.utxos) {
    // Sum all UTXO values from the utxos object
    Object.entries(token.utxos).forEach(([key, utxoGroup]) => {
      if (Array.isArray(utxoGroup) && shouldIncludeUtxoGroup(key)) {
        utxoGroup.forEach((utxo) => {
          if (Number(utxo.amount) > 0) {
            totalUtxoBalance += Number(utxo.amount);
          }
        });
      }
    });
  }

  const tokenUnit = new TokenUnit(
    totalUtxoBalance,
    token.decimals,
    token.symbol,
  );

  return (
    tokenUnit.toDisplay({ fixedDp: 2, asNumber: true }) * token.priceInCurrency
  );
};

const isXPToken = (
  token: TokenWithBalance,
  network?: NetworkWithCaipId,
): token is TokenWithBalancePVM | TokenWithBalanceAVM => {
  return (
    token.type === TokenType.NATIVE &&
    'utxos' in token &&
    (network?.vmName === NetworkVMType.AVM ||
      network?.vmName === NetworkVMType.PVM)
  );
};

const shouldIncludeUtxoGroup = (key: string) => {
  return key !== 'pendingStaked';
};
