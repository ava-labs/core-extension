import {
  Account,
  Balances,
  NetworkWithCaipId,
  TotalPriceChange,
} from '@core/types';
import { hasAccountBalances } from './hasAccountBalances';
import { getAddressForChain } from './getAddressForChain';
import {
  NetworkTokenWithBalance,
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
    token.symbol === 'AVAX'
  ) {
    if (isXPToken(token, network)) {
      return getBalanceInCurrencyForXP(token);
    } else {
      return getBalanceInCurrencyForC(token);
    }
  }

  return token.balanceInCurrency ?? 0;
};

const convertBalanceToDisplayValue = (
  value: bigint | number,
  maxDecimals: number,
  symbol: string,
  priceInCurrency: number,
) => {
  const tokenUnit = new TokenUnit(value, maxDecimals, symbol);
  return tokenUnit.toDisplay({ fixedDp: 2, asNumber: true }) * priceInCurrency;
};

const getBalanceInCurrencyForC = (token: NetworkTokenWithBalance) => {
  const priceInCurrency = getPriceInCurrency(token);

  return convertBalanceToDisplayValue(
    token.balance,
    token.decimals,
    token.symbol,
    priceInCurrency,
  );
};

const getBalanceInCurrencyForXP = (
  token: TokenWithBalancePVM | TokenWithBalanceAVM,
) => {
  if (token.priceInCurrency === undefined) {
    return undefined;
  }
  let totalUtxoBalance = 0;

  if (token.utxos) {
    // Sum all UTXO values from the utxos object
    Object.entries(token.utxos).forEach(([key, utxoGroup]) => {
      if (Array.isArray(utxoGroup) && shouldIncludeUtxoGroup(key)) {
        utxoGroup.forEach((utxo) => {
          if (utxo.symbol === 'AVAX') {
            totalUtxoBalance += Number(utxo.amount);
          }
        });
      }
    });
  }
  const priceInCurrency = getPriceInCurrency(token);

  return convertBalanceToDisplayValue(
    totalUtxoBalance,
    token.decimals,
    token.symbol,
    priceInCurrency,
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

const getPriceInCurrency = (token: TokenWithBalance) => {
  const defaultPrice = token.priceInCurrency ?? 0;
  if (token.type === TokenType.NATIVE && token.symbol === 'AVAX') {
    return token.priceChanges?.currentPrice ?? defaultPrice;
  }
  return defaultPrice;
};
