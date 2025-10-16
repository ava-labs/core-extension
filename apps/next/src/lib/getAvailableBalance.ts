import { TokenUnit } from '@avalabs/core-utils-sdk';
import {
  FungibleTokenBalance,
  isPChainToken,
  isXChainToken,
} from '@core/types';

export function getAvailableBalance(
  token: FungibleTokenBalance,
  formatted: false,
): bigint;
export function getAvailableBalance(
  token: FungibleTokenBalance,
  formatted: true,
): string;
export function getAvailableBalance(
  token: FungibleTokenBalance,
  formatted: boolean,
): bigint | string;
export function getAvailableBalance(
  token: FungibleTokenBalance,
  formatted = false,
) {
  const balance =
    isPChainToken(token) || isXChainToken(token)
      ? (token.available ?? token.balance)
      : token.balance;

  return formatted
    ? new TokenUnit(balance, token.decimals, token.symbol).toDisplay()
    : balance;
}
