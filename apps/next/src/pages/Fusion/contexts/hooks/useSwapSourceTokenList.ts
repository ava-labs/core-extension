import { useAccountsContext } from '@core/ui';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useMemo } from 'react';
import { FungibleTokenBalance } from '@core/types';

export const useSwapSourceTokenList = (
  supportedChainsIds: string | string[],
): FungibleTokenBalance[] => {
  const {
    accounts: { active },
  } = useAccountsContext();

  const tokens = useTokensForAccount(active);

  return useMemo(
    () =>
      tokens.filter((token) => supportedChainsIds.includes(token.chainCaipId)),
    [tokens, supportedChainsIds],
  );
};
