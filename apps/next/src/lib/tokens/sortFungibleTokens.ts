import type { FungibleTokenBalance } from '@core/types';
import { isNativeToken } from '@core/types';
import { orderBy } from 'lodash';
import { isAvaxToken } from './isAvaxToken';

const hasCurrencyValue = (
  token: FungibleTokenBalance,
): token is FungibleTokenBalance & { balanceInCurrency: number } =>
  typeof token.balanceInCurrency === 'number';

/**
 * Native tokens first, then by currency balance, raw balance, then name.
 */
export const sortFungibleTokens = (
  tokens: FungibleTokenBalance[],
): FungibleTokenBalance[] =>
  orderBy(
    tokens,
    [
      isAvaxToken,
      isNativeToken,
      hasCurrencyValue,
      (t) => t.balanceInCurrency ?? 0,
      (t) => t.balance ?? 0n,
      (t) => t.name ?? '',
    ],
    ['desc', 'desc', 'desc', 'desc', 'desc', 'asc'],
  );
