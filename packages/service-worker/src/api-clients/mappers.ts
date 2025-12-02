import {
  Erc20TokenBalance,
  NativeTokenBalance,
} from '~/api-clients/balance-api';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
  TokenWithBalanceSPL,
} from '@avalabs/vm-module-types/dist/balance';
import { TokenType } from '@avalabs/vm-module-types';
import { SplTokenBalance } from '~/api-clients/types';
import { Erc20TokenBalance as GlacierSdkErc20TokenBalance } from '@avalabs/glacier-sdk';
import tokenReputation = GlacierSdkErc20TokenBalance.tokenReputation;
import { balanceToDecimal } from '@core/common';

interface TokenBalance {
  internalId?: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUri?: string;
  balance: string;
  balanceInCurrency?: number;
  price?: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
}

interface BaseTokenBalance {
  balance: bigint;
  balanceCurrencyDisplayValue?: string;
  balanceDisplayValue: string;
  balanceInCurrency: number;
  priceChanges: {
    percentage?: number;
    value: number;
  };
  priceInCurrency?: number;
}

const getBaseTokenBalance = (tokenBalance: TokenBalance): BaseTokenBalance => {
  return {
    balance: BigInt(tokenBalance.balance),
    balanceCurrencyDisplayValue: tokenBalance.balanceInCurrency
      ?.toFixed(3)
      .slice(0, -1),
    balanceDisplayValue: balanceToDecimal(
      tokenBalance.balance,
      tokenBalance.decimals,
    )
      .toFixed(5)
      .slice(0, -1),
    balanceInCurrency: Number(
      tokenBalance.balanceInCurrency?.toFixed(3).slice(0, -1) ?? '0',
    ),
    priceChanges: {
      percentage: tokenBalance.priceChangePercentage24h,
      value:
        ((tokenBalance.balanceInCurrency ?? 0) *
          (tokenBalance.priceChangePercentage24h ?? 0)) /
        100,
    },
    priceInCurrency: tokenBalance.price,
  };
};

export const mapNativeTokenBalance = (
  nativeTokenBalance: NativeTokenBalance,
): NetworkTokenWithBalance => {
  return {
    change24: nativeTokenBalance.priceChangePercentage24h,
    coingeckoId: '',
    decimals: nativeTokenBalance.decimals,
    logoUri: nativeTokenBalance.logoUri,
    name: nativeTokenBalance.name,
    symbol: nativeTokenBalance.symbol,
    type: TokenType.NATIVE,
    ...getBaseTokenBalance(nativeTokenBalance),
  };
};

export const mapErc20TokenBalance =
  (chainId: number) =>
  (tokenBalance: Erc20TokenBalance): TokenWithBalanceERC20 => {
    return {
      address: tokenBalance.address,
      chainId,
      decimals: tokenBalance.decimals,
      logoUri: tokenBalance.logoUri,
      name: tokenBalance.name,
      reputation: (tokenBalance.scanResult as tokenReputation) ?? null,
      symbol: tokenBalance.symbol,
      type: TokenType.ERC20,
      ...getBaseTokenBalance(tokenBalance),
    };
  };

export const mapSplTokenBalance = (
  tokenBalance: SplTokenBalance,
): TokenWithBalanceSPL => {
  return {
    address: tokenBalance.address,
    decimals: tokenBalance.decimals,
    logoUri: tokenBalance.logoUri,
    name: tokenBalance.name,
    reputation: null,
    symbol: tokenBalance.symbol,
    type: TokenType.SPL,
    ...getBaseTokenBalance(tokenBalance),
  };
};
