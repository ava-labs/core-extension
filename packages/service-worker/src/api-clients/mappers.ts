import {
  AvmGetBalancesResponse,
  Erc20TokenBalance,
  NativeTokenBalance,
  PvmGetBalancesResponse,
} from '~/api-clients/balance-api';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
  TokenWithBalanceSPL,
} from '@avalabs/vm-module-types/dist/balance';
import {
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';
import { SplTokenBalance } from '~/api-clients/types';
import { Erc20TokenBalance as GlacierSdkErc20TokenBalance } from '@avalabs/glacier-sdk';
import tokenReputation = GlacierSdkErc20TokenBalance.tokenReputation;
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { isNil } from 'lodash';

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

const isTokenEnabled = (
  tokenBalance: Erc20TokenBalance | SplTokenBalance,
): boolean => {
  return (
    isNil(tokenBalance.scanResult) ||
    ['Benign', 'Warning'].includes(tokenBalance.scanResult)
  );
};

const getBaseTokenBalance = (tokenBalance: TokenBalance): BaseTokenBalance => {
  return {
    balance: BigInt(tokenBalance.balance),
    balanceCurrencyDisplayValue: tokenBalance.balanceInCurrency
      ?.toFixed(3)
      .slice(0, -1),
    balanceDisplayValue: new TokenUnit(
      tokenBalance.balance,
      tokenBalance.decimals,
      tokenBalance.symbol,
    ).toString(),
    balanceInCurrency: tokenBalance.balanceInCurrency ?? 0,
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

export const mapPvmTokenBalance = (
  balanceResponse: PvmGetBalancesResponse,
): TokenWithBalancePVM => {
  const {
    lockedStaked,
    lockedStakeable,
    lockedPlatform,
    atomicMemoryLocked,
    atomicMemoryUnlocked,
    unlockedUnstaked,
    unlockedStaked,
    unlockedUnstakedMultiSig,
  } = balanceResponse.balances.categories;

  const atomicMemoryLockedValues = Object.values(atomicMemoryLocked);
  const atomicMemoryUnlockedValues = Object.values(atomicMemoryUnlocked);

  return {
    ...mapNativeTokenBalance(balanceResponse.balances.nativeTokenBalance),
    balancePerType: {
      lockedStaked: lockedStaked ? BigInt(lockedStaked) : undefined,
      lockedStakeable: lockedStakeable ? BigInt(lockedStakeable) : undefined,
      lockedPlatform: lockedPlatform ? BigInt(lockedPlatform) : undefined,
      atomicMemoryLocked:
        atomicMemoryLockedValues.length > 0
          ? atomicMemoryLockedValues.reduce(
              (acc, value) => acc + BigInt(value),
              0n,
            )
          : undefined,
      atomicMemoryUnlocked:
        atomicMemoryUnlockedValues.length > 0
          ? atomicMemoryUnlockedValues.reduce(
              (acc, value) => acc + BigInt(value),
              0n,
            )
          : undefined,
      unlockedUnstaked:
        unlockedUnstaked || unlockedUnstakedMultiSig
          ? BigInt(unlockedUnstaked ?? 0) +
            BigInt(unlockedUnstakedMultiSig ?? 0)
          : undefined,
      unlockedStaked: unlockedStaked ? BigInt(unlockedStaked) : undefined,
    },
  };
};

export const mapAvmTokenBalance = (
  balanceResponse: AvmGetBalancesResponse,
): TokenWithBalanceAVM => {
  const { atomicMemoryLocked, atomicMemoryUnlocked, unlocked, locked } =
    balanceResponse.balances.categories;

  const atomicMemoryLockedValues = Object.values(atomicMemoryLocked).flat();
  const atomicMemoryUnlockedValues = Object.values(atomicMemoryUnlocked).flat();

  return {
    ...mapNativeTokenBalance(balanceResponse.balances.nativeTokenBalance),
    balancePerType: {
      atomicMemoryLocked:
        atomicMemoryLockedValues.length > 0
          ? atomicMemoryLockedValues.reduce(
              (acc, item) => acc + BigInt(item.balance),
              0n,
            )
          : undefined,
      atomicMemoryUnlocked:
        atomicMemoryUnlockedValues.length > 0
          ? atomicMemoryUnlockedValues.reduce(
              (acc, item) => acc + BigInt(item.balance),
              0n,
            )
          : undefined,
      locked:
        locked.length > 0
          ? locked.reduce((acc, item) => acc + BigInt(item.balance), 0n)
          : undefined,
      unlocked:
        unlocked.length > 0
          ? unlocked.reduce((acc, item) => acc + BigInt(item.balance), 0n)
          : undefined,
    },
  };
};

export const mapErc20TokenBalance =
  (chainId: number) =>
  (tokenBalance: Erc20TokenBalance): TokenWithBalanceERC20 | undefined => {
    if (!isTokenEnabled(tokenBalance)) {
      return undefined;
    }

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
): TokenWithBalanceSPL | undefined => {
  if (!isTokenEnabled(tokenBalance)) {
    return undefined;
  }

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

// const addressMapper =
//   tokenBalance.type === 'erc20'
//     ? (address: string) => address.toLowerCase()
//     : (address: string) => address;
//
// if (
//   enabledTokens?.[addressMapper(tokenBalance.address)] !== undefined &&
//   !enabledTokens[addressMapper(tokenBalance.address)]
// ) {
//   return false;
// }
