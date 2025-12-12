import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { isPChainToken, isXChainToken } from '@core/types';
import { isAvaxToken } from '@/hooks/useTokensForAccount';
import { TokenSelectProps } from './types';

/**
 * Sorts tokens by balance in descending order, with AVAX tokens always first
 */
export const sortTokensByBalance = (
  tokens: FungibleTokenBalance[],
): FungibleTokenBalance[] => {
  return [...tokens].sort((a, b) => {
    const isAvaxA = isAvaxToken(a);
    const isAvaxB = isAvaxToken(b);

    // AVAX tokens always come first
    if (isAvaxA && !isAvaxB) return -1;
    if (!isAvaxA && isAvaxB) return 1;

    // Get balance using the same logic as getAvailableBalance
    const balanceA =
      isPChainToken(a) || isXChainToken(a)
        ? (a.available ?? a.balance)
        : a.balance;
    const balanceB =
      isPChainToken(b) || isXChainToken(b)
        ? (b.available ?? b.balance)
        : b.balance;

    // Sort in descending order (highest balance first)
    if (balanceA > balanceB) return -1;
    if (balanceA < balanceB) return 1;
    return 0;
  });
};

/**
 * Custom comparison function to prevent rerenders when tokenList reference changes
 * but the actual tokens (by ID) remain the same
 */
export const areTokenListsEqual = (
  prevProps: TokenSelectProps,
  nextProps: TokenSelectProps,
): boolean => {
  // Compare all props except tokenList
  if (
    prevProps.id !== nextProps.id ||
    prevProps.tokenId !== nextProps.tokenId ||
    prevProps.query !== nextProps.query ||
    prevProps.hint !== nextProps.hint ||
    prevProps.disabled !== nextProps.disabled
  ) {
    return false;
  }

  // Compare tokenList by token IDs rather than reference
  if (prevProps.tokenList.length !== nextProps.tokenList.length) {
    return false;
  }

  const prevTokenIds = new Set(
    prevProps.tokenList.map((token) => getUniqueTokenId(token)),
  );
  const nextTokenIds = new Set(
    nextProps.tokenList.map((token) => getUniqueTokenId(token)),
  );

  if (prevTokenIds.size !== nextTokenIds.size) {
    return false;
  }

  for (const id of prevTokenIds) {
    if (!nextTokenIds.has(id)) {
      return false;
    }
  }

  return true;
};
