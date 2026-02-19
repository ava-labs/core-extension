import { useMemo } from 'react';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

export const useTokenByUniqueId = (
  tokens: FungibleTokenBalance[],
  uniqueId: string,
) => {
  return useMemo(
    () => tokens.find((token) => getUniqueTokenId(token) === uniqueId),
    [tokens, uniqueId],
  );
};
