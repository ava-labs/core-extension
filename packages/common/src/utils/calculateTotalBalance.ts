import {
  Account,
  Balances,
  getUnconfirmedBalanceInCurrency,
  NetworkWithCaipId,
  TokensPriceShortData,
  TotalPriceChange,
} from '@core/types';
import { getAddressForChain } from './getAddressForChain';
import { hasAccountBalances } from './hasAccountBalances';
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
  priceChangesData?: TokensPriceShortData,
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
          const confirmedBalance =
            (token.type === TokenType.NATIVE && token.symbol === 'AVAX'
              ? getBalanceInCurrencyForAVAX(
                  token,
                  isUsedForWalletBalance,
                  network,
                  priceChangesData,
                )
              : token.balanceInCurrency) ?? 0;

          const unconfirmedBalance =
            getUnconfirmedBalanceInCurrency(token) ?? 0;

          sumTotal.sum += confirmedBalance + unconfirmedBalance;

          if (token.priceChanges?.value) {
            sumTotal.priceChange.value += token.priceChanges.value;
          }

          if (token.priceChanges?.percentage) {
            sumTotal.priceChange.percentage.push(token.priceChanges.percentage);
          }

          return {
            sum: sumTotal.sum,
            priceChange: {
              value:
                sumTotal.priceChange.value + (token.priceChanges?.value ?? 0),
              percentage: sumTotal.priceChange.percentage,
            },
          };
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

const getBalanceInCurrencyForAVAX = (
  token: TokenWithBalance,
  isUsedForWalletBalance?: boolean,
  network?: NetworkWithCaipId,
  priceChangesData?: TokensPriceShortData,
) => {
  if (
    isUsedForWalletBalance &&
    token.type === TokenType.NATIVE &&
    token.symbol === 'AVAX'
  ) {
    if (isXPToken(token, network)) {
      return getBalanceInCurrencyForXP(token, priceChangesData);
    } else {
      return getBalanceInCurrencyForC(token, priceChangesData);
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

const getBalanceInCurrencyForC = (
  token: NetworkTokenWithBalance,
  priceChangesData?: TokensPriceShortData,
) => {
  const priceInCurrency = getPriceInCurrency(token, priceChangesData);

  return convertBalanceToDisplayValue(
    token.balance,
    token.decimals,
    token.symbol,
    priceInCurrency,
  );
};

const getBalanceInCurrencyForXP = (
  token: TokenWithBalancePVM | TokenWithBalanceAVM,
  priceChangesData?: TokensPriceShortData,
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
  const priceInCurrency = getPriceInCurrency(token, priceChangesData);

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

const getPriceInCurrency = (
  token: TokenWithBalance,
  priceChangesData?: TokensPriceShortData,
) => {
  const defaultPrice = token.priceInCurrency ?? 0;
  if (token.type === TokenType.NATIVE && token.symbol === 'AVAX') {
    const currentPrice = priceChangesData?.[token.symbol]?.currentPrice;
    return currentPrice ?? defaultPrice;
  }

  return defaultPrice;
};
