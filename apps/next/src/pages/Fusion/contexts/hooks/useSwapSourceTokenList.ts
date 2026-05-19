import {
  useAccountsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useMemo } from 'react';
import { FungibleTokenBalance } from '@core/types';
import { GetSupportedChainsResult } from '@avalabs/fusion-sdk';
import { isChainSupportedByWalletOrAccount } from '@core/common';

export const useSwapSourceTokenList = (
  supportedChainsMap: GetSupportedChainsResult,
): FungibleTokenBalance[] => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { walletDetails } = useWalletContext();
  const { getNetwork } = useNetworkContext();

  const tokens = useTokensForAccount(active);

  const sourceChains = useMemo(
    () => supportedChainsMap.keys().toArray(),
    [supportedChainsMap],
  );

  return useMemo(
    () =>
      tokens.filter((token) => {
        if (!sourceChains.some((caipId) => caipId === token.chainCaipId)) {
          return false;
        }
        // Hide chains the active wallet can't sign for (e.g. Solana on Keystone).
        return isChainSupportedByWalletOrAccount(
          getNetwork(token.chainCaipId),
          walletDetails,
          active,
        );
      }),
    [tokens, sourceChains, getNetwork, walletDetails, active],
  );
};
