import { useMemo } from 'react';

import { DISALLOWED_SWAP_ASSETS } from '@core/ui';
import { useTokensWithBalances } from '@core/ui';
import { isSwappableToken } from '../utils';

export const useSwappableTokens = () => {
  const allTokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });
  const nonZeroBalanceTokens = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });

  const targetTokens = useMemo(
    () => allTokens.filter(isSwappableToken),
    [allTokens],
  );
  const sourceTokens = useMemo(
    () => nonZeroBalanceTokens.filter(isSwappableToken),
    [nonZeroBalanceTokens],
  );

  return {
    sourceTokens,
    targetTokens,
  };
};
