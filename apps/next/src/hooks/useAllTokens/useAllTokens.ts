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
import { uniqWith } from 'lodash';
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

  return useMemo<FungibleTokenBalance[]>(() => {
    const allTokens = [
      ...tokensForAccount,
      ...placeholderTokens,
      // User-added custom tokens (as zero-balance placeholders).
      ...networks.flatMap(({ chainId, caipId }) =>
        Object.values(customTokens[chainId] ?? {}).map(
          getTokenMapper(chainId, caipId),
        ),
      ),
    ];

    // Dedupe by unique token id, keeping the first occurrence. `tokensForAccount` comes first,
    // so a held token keeps its fetched balance over the zero-balance placeholder/custom entry.
    return uniqWith(
      allTokens,
      (a, b) => getUniqueTokenId(a) === getUniqueTokenId(b),
    );
  }, [customTokens, networks, placeholderTokens, tokensForAccount]);
};
