import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalancePVM,
  TokenWithBalanceSPL,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';
import { AvalancheBalanceItem } from '@core/service-worker/src/api-clients/balance-api';

import { EnsureDefined } from './util-types';

export const BALANCES_CACHE_KEY = 'balances-service-cache';

export enum BalanceServiceEvents {
  UPDATED = 'BalanceServiceEvents:updated',
}

export type RawTokenAttribute = {
  value: string;
} & (
  | {
      name: string;
      trait_type: never;
    }
  | {
      name: never;
      trait_type: string;
    }
);

export interface NftMetadata {
  attributes?: string;
  name?: string;
  image?: string;
  description?: string;
}

export interface TokenAttribute {
  name: string;
  value: string;
}

// store balances in the structure of network ID -> address -> tokens
export interface Balances<TokenTypes = TokenWithBalance> {
  [networkId: string | number]: {
    [accountAddress: string]: {
      [tokenAddressOrSymbol: string]: TokenTypes;
    };
  };
}

export interface PvmCategories {
  unlockedStaked: string;
  unlockedUnstaked: string;
  lockedStaked: string;
  lockedPlatform: string;
  lockedStakeable: string;
  atomicMemoryLocked: {
    [avalancheChainId: string]: string;
  };
  atomicMemoryUnlocked: {
    [avalancheChainId: string]: string;
  };
}

export interface CoreEthCategories {
  atomicMemoryUnlocked: {
    [avalancheChainId: string]: AvalancheBalanceItem[];
  };
  atomicMemoryLocked: {
    [avalancheChainId: string]: AvalancheBalanceItem[];
  };
}

export interface AvmCategories extends CoreEthCategories {
  unlocked: AvalancheBalanceItem[];
  locked: AvalancheBalanceItem[];
}

export interface AtomicBalances {
  [networkId: string | number]: {
    [accountAddress: string]: PvmCategories | CoreEthCategories | AvmCategories;
  };
}
export interface BalancesInfo {
  balances: {
    tokens: Balances;
    nfts: Balances<NftTokenWithBalance>;
    atomic: AtomicBalances;
  };
  isBalancesCached: boolean;
}

export interface CachedBalancesInfo {
  totalBalance?: TotalBalance;
  balances?: Balances;
  atomicBalances?: AtomicBalances;
  lastUpdated?: number;
}

export type TotalBalance = {
  [address: string | number]: {
    sum: number | null;
    priceChange: TotalPriceChange;
  };
};

export interface TotalPriceChange {
  value: number;
  percentage: number[];
}

export class GlacierUnhealthyError extends Error {
  message = 'Glacier is unhealthy. Try again later.';
}

export const hasUnconfirmedBTCBalance = (
  token?: TokenWithBalance,
): token is EnsureDefined<TokenWithBalanceBTC, 'unconfirmedBalance'> =>
  Boolean(token && 'unconfirmedBalance' in token);

export const isAvaxWithUnavailableBalance = (
  token?: TokenWithBalance,
): token is TokenWithBalanceAVM | TokenWithBalancePVM =>
  Boolean(
    token &&
      'balancePerType' in token &&
      token.available &&
      token.available !== token.balance,
  );

export const getUnconfirmedBalanceInCurrency = (token?: TokenWithBalance) => {
  if (!token || !hasUnconfirmedBTCBalance(token)) {
    return undefined;
  }

  return token.unconfirmedBalanceInCurrency;
};

export type TotalBalanceForWallet = {
  totalBalanceInCurrency?: number;
  hasBalanceOnUnderivedAccounts: boolean;
  balanceChange?: number;
  percentageChange?: number;
};

export type TotalAtomicBalanceForAccount = {
  balanceDisplayValue: number;
  balanceInCurrency: number;
};

export type NonFungibleAssetType = 'evm_erc721' | 'evm_erc1155';

export type FungibleAssetType =
  | 'evm_native'
  | 'evm_erc20'
  | 'btc_native'
  | 'pvm_native'
  | 'avm_native'
  | 'svm_native'
  | 'svm_spl'
  | 'unknown';

export type FungibleTokenBalance = Exclude<
  TokenWithBalance,
  NftTokenWithBalance
> & {
  coreChainId: number;
  assetType: FungibleAssetType;
};

export type NonNativeFungibleTokenBalance = Exclude<
  FungibleTokenBalance,
  { type: TokenType.NATIVE }
>;

export type NativeTokenBalance = Extract<
  FungibleTokenBalance,
  { type: TokenType.NATIVE }
>;

export type EvmNativeTokenBalance = NativeTokenBalance & {
  assetType: 'evm_native';
};

export type Erc20TokenBalance = Extract<
  FungibleTokenBalance,
  { type: TokenType.ERC20 }
> & {
  assetType: 'evm_erc20';
};

export type BtcTokenBalance = Extract<
  FungibleTokenBalance,
  // TODO: fix this reliance on "unconfirmedBalance" to recognize BTC token
  { unconfirmedBalance?: bigint }
> & {
  assetType: 'btc_native';
};

export type XChainTokenBalance = Extract<
  FungibleTokenBalance,
  TokenWithBalanceAVM
> & {
  assetType: 'avm_native';
};

export type PChainTokenBalance = Extract<
  FungibleTokenBalance,
  TokenWithBalancePVM
> & {
  assetType: 'pvm_native';
};

export type SolanaNativeTokenBalance = Extract<
  FungibleTokenBalance,
  TokenWithBalanceSVM
> & {
  assetType: 'svm_native';
};

export type SolanaSplTokenBalance = Extract<
  FungibleTokenBalance,
  TokenWithBalanceSPL
> & {
  assetType: 'svm_spl';
};

export type NonFungibleTokenBalance = NftTokenWithBalance & {
  coreChainId: number;
  assetType: NonFungibleAssetType;
};

export const getUniqueTokenId = <T extends FungibleTokenBalance>(token: T) => {
  const normalizedSymbol = isEvmFungibleToken(token)
    ? token.symbol.toLowerCase()
    : token.symbol;
  const normalizedAddress = isNativeToken(token)
    ? undefined
    : isEvmFungibleToken(token)
      ? token.address.toLowerCase()
      : token.address;

  return getUniqueTokenIdGeneric({
    type: token.type,
    symbol: normalizedSymbol,
    address: normalizedAddress,
    coreChainId: token.coreChainId,
  });
};

export const getUniqueTokenIdGeneric = ({
  type,
  symbol,
  address,
  coreChainId,
}: {
  type: TokenType;
  symbol: string;
  address?: string;
  coreChainId: number;
}) => {
  return `${type}:${symbol}:${address ?? '-'}:${coreChainId}`;
};

export const isNativeToken = (
  token: FungibleTokenBalance,
): token is NativeTokenBalance => token.type === TokenType.NATIVE;

export const isEvmFungibleToken = (
  token: FungibleTokenBalance,
): token is Erc20TokenBalance | EvmNativeTokenBalance =>
  token.assetType === 'evm_erc20' || token.assetType === 'evm_native';

export const isEvmNativeToken = (
  token: FungibleTokenBalance,
): token is EvmNativeTokenBalance => token.assetType === 'evm_native';

export const isErc20Token = (
  token: FungibleTokenBalance,
): token is Erc20TokenBalance => token.type === TokenType.ERC20;

export const isBtcToken = (
  token: FungibleTokenBalance,
): token is BtcTokenBalance =>
  token.type === TokenType.NATIVE && token.assetType === 'btc_native';

export const isXChainToken = (
  token: FungibleTokenBalance,
): token is XChainTokenBalance =>
  token.type === TokenType.NATIVE && token.assetType === 'avm_native';

export const isPChainToken = (
  token: FungibleTokenBalance,
): token is PChainTokenBalance =>
  token.type === TokenType.NATIVE && token.assetType === 'pvm_native';

export const isSolanaNativeToken = (
  token: FungibleTokenBalance,
): token is SolanaNativeTokenBalance =>
  token.type === TokenType.NATIVE && token.assetType === 'svm_native';

export const isSolanaSplToken = (
  token: FungibleTokenBalance,
): token is SolanaSplTokenBalance =>
  token.type === TokenType.SPL && token.assetType === 'svm_spl';

export const isSolanaFungibleToken = (
  token: FungibleTokenBalance,
): token is SolanaSplTokenBalance | SolanaNativeTokenBalance =>
  token.assetType === 'svm_spl' || token.assetType === 'svm_native';
