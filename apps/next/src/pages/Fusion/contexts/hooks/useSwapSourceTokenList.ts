import {
  useAccountsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useMemo } from 'react';
import { FungibleTokenBalance } from '@core/types';
import { GetSupportedChainsResult } from '@avalabs/fusion-sdk';
import {
  caipIdsMatchForFusion,
  isChainSupportedByWalletOrAccount,
  isHypercoreNetwork,
} from '@core/common';

import { isHypercoreUsdcToken } from '../../lib/isHypercoreUsdcToken';

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
        const network = getNetwork(token.chainCaipId);

        if (isHypercoreNetwork(network) && !isHypercoreUsdcToken(token)) {
          return false;
        }

        if (
          !sourceChains.some((caipId) =>
            caipIdsMatchForFusion(caipId, token.chainCaipId),
          )
        ) {
          return false;
        }

        // Hide chains the active wallet can't sign for (e.g. Solana on Keystone).
        return isChainSupportedByWalletOrAccount(
          network,
          walletDetails,
          active,
        );
      }),
    [tokens, sourceChains, getNetwork, walletDetails, active],
  );
};
