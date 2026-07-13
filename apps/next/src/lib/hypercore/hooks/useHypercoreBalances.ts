import { skipToken, useQuery } from '@tanstack/react-query';
import { useIsHyperliquidEnabled, useIsMainnet } from '@core/ui';
import { useMemo } from 'react';
import { buildHypercoreTokens } from '../buildHypercoreTokens';
import {
  getClearinghouseState,
  getSpotClearinghouseState,
  getUserAbstraction,
} from '../infoClient';
import type { HypercoreSpotToken } from '../spotTokens';
import { useHypercoreSpotTokens } from './useHypercoreSpotTokens';

export const HYPERCORE_BALANCES_QUERY_KEY = 'hypercoreBalances';
const BALANCES_STALE_TIME_MS = 60 * 1000;

const fetchHypercorePortfolio = async (
  evmAddress: string,
  spotTokens: HypercoreSpotToken[],
) => {
  const [spotState, perpState, abstractionMode] = await Promise.all([
    getSpotClearinghouseState(evmAddress).catch(() => undefined),
    getClearinghouseState(evmAddress).catch(() => undefined),
    getUserAbstraction(evmAddress).catch(() => undefined),
  ]);

  return buildHypercoreTokens({
    spotBalances: spotState?.balances ?? [],
    perpState,
    abstractionMode,
    spotTokens,
  });
};

type UseHypercoreBalancesParams = {
  evmAddress?: string;
};

export const useHypercoreBalances = ({
  evmAddress,
}: UseHypercoreBalancesParams) => {
  const isHyperliquidEnabled = useIsHyperliquidEnabled();
  const isMainnet = useIsMainnet();
  const enabled = Boolean(evmAddress) && isHyperliquidEnabled && isMainnet;

  const { data: spotTokens, isLoading: isLoadingSpotTokens } =
    useHypercoreSpotTokens({ enabled });

  const query = useQuery({
    staleTime: BALANCES_STALE_TIME_MS,
    queryKey: [
      HYPERCORE_BALANCES_QUERY_KEY,
      evmAddress,
      spotTokens?.map(
        (token) =>
          `${token.index}:${token.decimals}:${token.symbol}:${token.name}:${token.address ?? ''}`,
      ),
    ],
    queryFn:
      enabled && evmAddress && spotTokens
        ? () => fetchHypercorePortfolio(evmAddress, spotTokens)
        : skipToken,
  });

  return useMemo(
    () => ({
      data: query.data,
      isLoading: enabled && (isLoadingSpotTokens || query.isLoading),
      isFetching: query.isFetching,
      refetch: query.refetch,
      error: query.error,
    }),
    [
      enabled,
      isLoadingSpotTokens,
      query.data,
      query.error,
      query.isFetching,
      query.isLoading,
      query.refetch,
    ],
  );
};
