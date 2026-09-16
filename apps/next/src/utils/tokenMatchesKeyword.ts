import { FungibleTokenBalance } from '@core/types';

export const tokenMatchesKeyword = (
  token: FungibleTokenBalance,
  keyword: string,
): boolean => {
  if (!keyword) {
    return true;
  }
  const normalized = keyword.toLowerCase();
  return (
    token.name.toLowerCase().includes(normalized) ||
    token.symbol.toLowerCase().includes(normalized) ||
    // Match partial addresses case-insensitively for both EVM and SPL tokens.
    ('address' in token && token.address.toLowerCase().includes(normalized))
  );
};
