import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui/src/contexts';
import { useEffect, useMemo, useState } from 'react';
import { getNetworkTokens } from './lib/getNetworkTokens';
import { getTokenMapper } from './lib/getTokenMapper';

// TODO: Currently the hook is using favoriteNetwork. It should be changed to enabledNetworks once added.
export const useAllTokensFromEnabledNetworks = () => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { favoriteNetworks } = useNetworkContext();
  const { request } = useConnectionContext();

  const [placeholderTokens, setPlaceholderTokens] = useState<
    FungibleTokenBalance[]
  >([]);

  const { customTokens } = useSettingsContext();

  useEffect(() => {
    Promise.allSettled(
      Object.values(favoriteNetworks).map((network) =>
        getNetworkTokens({ request, network }),
      ),
    ).then((settledResults) => {
      setPlaceholderTokens(
        settledResults
          .filter((res) => res.status === 'fulfilled')
          .flatMap((res) => res.value),
      );
    });
  }, [favoriteNetworks, request]);

  const tokensForAccount = useTokensForAccount(active, false);

  return useMemo<FungibleTokenBalance[]>(
    () => [
      ...tokensForAccount,
      ...placeholderTokens.filter(
        (token) =>
          !tokensForAccount.find(
            (balanceToken) =>
              getUniqueTokenId(balanceToken) === getUniqueTokenId(token),
          ),
      ),
      ...Object.entries(customTokens).flatMap(([chainId, tokens]) =>
        Object.values(tokens).map(getTokenMapper(Number(chainId))),
      ),
    ],
    [customTokens, placeholderTokens, tokensForAccount],
  );
};
