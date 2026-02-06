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

const emptyTrendingTokens: TrendingTokensState = {
  avalanche: [],
  solana: [],
};

export const useTrendingTokens = () => {
  const [trendingTokens, setTrendingTokens] =
    useState<TrendingTokensState>(emptyTrendingTokens);
  const [isLoading, setIsLoading] = useState(false);
  const { request } = useConnectionContext();

  const fetchTrendingTokens = useCallback(
    async (nwk: TrendingTokensNetwork) => {
      setIsLoading(true);
      try {
        const response = await request<GetTrendingTokensHandler>({
          method: ExtensionRequest.GET_TRENDING_TOKENS,
          params: [nwk],
        });
        let newTrendingTokens = emptyTrendingTokens;

        setTrendingTokens((prev) => {
          newTrendingTokens = {
            ...prev,
            [nwk]: response.tokens,
          };
          return newTrendingTokens;
        });

        return newTrendingTokens;
      } finally {
        setIsLoading(false);
      }
    },
    [request],
  );

  const getTrendingTokens = useCallback(
    async (nwk: TrendingTokensNetwork) => {
      const newTrendingTokens = await fetchTrendingTokens(nwk);
      return newTrendingTokens;
    },
    [fetchTrendingTokens],
  );
  return {
    trendingTokens,
    isLoading,
    updateTrendingTokens: getTrendingTokens,
  };
};
