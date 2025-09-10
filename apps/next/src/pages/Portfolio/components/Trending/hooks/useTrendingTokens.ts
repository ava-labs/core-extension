import { ExtensionRequest, TrendingToken } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback, useState } from 'react';
import { GetTrendingTokensHandler } from '~/services/trendingTokens/handlers/getTrendingTokens';

export const useTrendingTokens = () => {
  const [fetching, setIsFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date>();
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const { request } = useConnectionContext();

  const fetchTrendingTokens = useCallback(async () => {
    const response = await request<GetTrendingTokensHandler>({
      method: ExtensionRequest.GET_TRENDING_TOKENS,
    });
    setTrendingTokens(response.tokens);
  }, [request]);

  const getTrendingTokens = useCallback(async () => {
    if (
      fetching ||
      (lastFetched &&
        new Date().getTime() - lastFetched.getTime() < 1000 * 60 * 5) // less than 5 minutes
    ) {
      return trendingTokens;
    }
    setIsFetching(true);
    setLastFetched(new Date());
    await fetchTrendingTokens();
    setIsFetching(false);
    return trendingTokens;
  }, [fetching, trendingTokens, fetchTrendingTokens, lastFetched]);

  return {
    trendingTokens,
    getTrendingTokens,
  };
};
