import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { DEFAULT_SOURCE_TOKENS } from '../../fusion-config';
import { sortDefaultTokensByPriority } from '../../lib/sortDefaultTokensByPriority';

export const useSwapSourceToken = (
  sourceTokens: FungibleTokenBalance[],
  sourceTokenId?: string,
): FungibleTokenBalance | undefined => {
  const potentialSourceTokens = sourceTokens.filter(
    (token) =>
      token.type === TokenType.NATIVE &&
      (DEFAULT_SOURCE_TOKENS as string[]).includes(token.symbol),
  );
  const defaultSourceToken = potentialSourceTokens.toSorted(
    sortDefaultTokensByPriority,
  )[0];

  return (
    sourceTokens.find((token) => getUniqueTokenId(token) === sourceTokenId) ??
    defaultSourceToken
  );
};
