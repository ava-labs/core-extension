import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useSettingsContext,
} from '@core/ui';
import { useEffect, useMemo, useState } from 'react';
import { getNetworkTokens } from './lib/getNetworkTokens';
import { getTokenMapper } from './lib/getTokenMapper';

export const useAllTokens = (
  networks: NetworkWithCaipId[],
  forceShowAllTokens?: boolean,
) => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { request } = useConnectionContext();

  const [placeholderTokens, setPlaceholderTokens] = useState<
    FungibleTokenBalance[]
  >([]);

  const { customTokens } = useSettingsContext();

  useEffect(() => {
    Promise.allSettled(
      networks.map((network) => getNetworkTokens({ request, network })),
    ).then((settledResults) => {
      setPlaceholderTokens(
        settledResults
          .filter((res) => res.status === 'fulfilled')
          .flatMap((res) => res.value),
      );
    });
  }, [networks, request]);

  const tokensForAccount = useTokensForAccount(active, {
    networks,
    forceShowAllTokens,
  });

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
      ...networks.flatMap(({ chainId, caipId }) =>
        Object.values(customTokens[chainId] ?? {}).map(
          getTokenMapper(chainId, caipId),
        ),
      ),
    ],
    [customTokens, networks, placeholderTokens, tokensForAccount],
  );
};
