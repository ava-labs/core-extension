import { useAccountsContext } from '@core/ui';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useMemo } from 'react';
import { FungibleTokenBalance } from '@core/types';
import { GetSupportedChainsResult } from '@avalabs/unified-asset-transfer';

export const useSwapSourceTokenList = (
  supportedChainsMap: GetSupportedChainsResult,
): FungibleTokenBalance[] => {
  const {
    accounts: { active },
  } = useAccountsContext();

  const tokens = useTokensForAccount(active);

  const sourceChains = useMemo(
    () => supportedChainsMap.keys().toArray(),
    [supportedChainsMap],
  );

  return useMemo(
    () =>
      tokens.filter((token) =>
        sourceChains.some((caipId) => caipId === token.chainCaipId),
      ),
    [tokens, sourceChains],
  );
};
