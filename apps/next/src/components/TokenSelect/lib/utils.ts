import { TokenType } from '@avalabs/vm-module-types';

import { getUniqueTokenId, FungibleTokenBalance } from '@core/types';

export const compareTokens = (
  a: FungibleTokenBalance,
  b: FungibleTokenBalance,
) => {
  return getUniqueTokenId(a) === getUniqueTokenId(b);
};

export const searchTokens = <T extends FungibleTokenBalance>(
  token: T,
  query?: string,
) => {
  const normalizedSymbol = token.symbol.toLowerCase();
  const normalizedName = token.name?.toLowerCase();
  const normalizedAddress =
    token.type !== TokenType.NATIVE ? token.address.toLowerCase() : '';
  const normalizedQuery = query?.toLowerCase() ?? '';

  return (
    normalizedName?.includes(normalizedQuery) ||
    normalizedSymbol.includes(normalizedQuery) ||
    normalizedAddress.includes(normalizedQuery)
  );
};
