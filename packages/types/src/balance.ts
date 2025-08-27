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
export interface BalancesInfo {
  balances: {
    tokens: Balances;
    nfts: Balances<NftTokenWithBalance>;
  };
  isBalancesCached: boolean;
}

export interface CachedBalancesInfo {
  totalBalance?: TotalBalance;
  balances?: Balances;
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
  return `${token.type}:${token.symbol}:${token.type === TokenType.NATIVE ? '-' : token.address}:${token.coreChainId}`;
};

export const isNativeToken = (
  token: FungibleTokenBalance,
): token is NativeTokenBalance | Erc20TokenBalance =>
  token.type === TokenType.NATIVE;

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
