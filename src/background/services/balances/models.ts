import {
  TokenWithBalance,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';
import { EnsureDefined } from '@src/background/models';

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
  token?: TokenWithBalance
): token is EnsureDefined<TokenWithBalanceBTC, 'unconfirmedBalance'> =>
  Boolean(token && 'unconfirmedBalance' in token);

export const isAvaxWithUnavailableBalance = (
  token?: TokenWithBalance
): token is TokenWithBalanceAVM | TokenWithBalancePVM =>
  Boolean(
    token &&
      'balancePerType' in token &&
      token.available &&
      token.available !== token.balance
  );

export const getUnconfirmedBalanceInCurrency = (token?: TokenWithBalance) => {
  if (!token || !hasUnconfirmedBTCBalance(token)) {
    return undefined;
  }

  return token.unconfirmedBalanceInCurrency;
};
