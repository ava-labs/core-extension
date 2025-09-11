import {
  ExtensionRequest,
  TrendingToken,
  TrendingTokensNetwork,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback, useState } from 'react';
import { GetTrendingTokensHandler } from '~/services/trendingTokens/handlers/getTrendingTokens';

type TrendingTokensState = {
  avalanche: TrendingToken[];
  solana: TrendingToken[];
};

export const useTrendingTokens = () => {
  const [trendingTokens, setTrendingTokens] = useState<TrendingTokensState>({
    avalanche: [],
    solana: [],
  });
  const { request } = useConnectionContext();

  const fetchTrendingTokens = useCallback(
    async (nwk: TrendingTokensNetwork) => {
      const response = await request<GetTrendingTokensHandler>({
        method: ExtensionRequest.GET_TRENDING_TOKENS,
        params: [nwk],
      });
      setTrendingTokens({
        ...trendingTokens,
        [nwk]: response.tokens,
      });
    },
    [request, trendingTokens],
  );

  const getTrendingTokens = useCallback(
    async (nwk: TrendingTokensNetwork) => {
      await fetchTrendingTokens(nwk);
      return trendingTokens;
    },
    [trendingTokens, fetchTrendingTokens],
  );

  const updateTrendingTokens = useCallback(
    (nwk: TrendingTokensNetwork) => {
      getTrendingTokens(nwk);
    },
    [getTrendingTokens],
  );

  return {
    trendingTokens,
    updateTrendingTokens,
  };
};
