import {
  queryOptions,
  skipToken,
  useQueries,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useIsHyperliquidEnabled, useIsMainnet } from '@core/ui';
import { useMemo } from 'react';
import {
  buildHypercoreTokens,
  type HypercoreTokenBalance,
} from '../buildHypercoreTokens';
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

const spotTokensQueryKey = (spotTokens: HypercoreSpotToken[] | undefined) =>
  spotTokens?.map(
    (token) =>
      `${token.index}:${token.decimals}:${token.symbol}:${token.name}:${token.address ?? ''}`,
  );

export const getHypercoreBalancesQueryOptions = ({
  evmAddress,
  spotTokens,
  enabled,
}: {
  evmAddress: string;
  spotTokens: HypercoreSpotToken[] | undefined;
  enabled: boolean;
}) =>
  queryOptions({
    staleTime: BALANCES_STALE_TIME_MS,
    queryKey: [
      HYPERCORE_BALANCES_QUERY_KEY,
      evmAddress,
      spotTokensQueryKey(spotTokens),
    ],
    queryFn:
      enabled && spotTokens
        ? () => fetchHypercorePortfolio(evmAddress, spotTokens)
        : skipToken,
  });

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

  const options = useMemo(
    () =>
      getHypercoreBalancesQueryOptions({
        evmAddress: evmAddress ?? '',
        spotTokens,
        enabled,
      }),
    [enabled, evmAddress, spotTokens],
  );

  const query = useQuery(options);

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

type UseHypercoreTokensForAddressesParams = {
  evmAddresses: readonly string[];
};

export const useHypercoreTokensForAddresses = ({
  evmAddresses,
}: UseHypercoreTokensForAddressesParams) => {
  const isHyperliquidEnabled = useIsHyperliquidEnabled();
  const isMainnet = useIsMainnet();
  const enabled = isHyperliquidEnabled && isMainnet && evmAddresses.length > 0;

  const { data: spotTokens, isLoading: isLoadingSpotTokens } =
    useHypercoreSpotTokens({ enabled });

  const combine = useMemo(
    () => (results: UseQueryResult<HypercoreTokenBalance[]>[]) => ({
      tokens: results.flatMap((result) => result.data ?? []),
      isLoading:
        enabled &&
        (isLoadingSpotTokens || results.some((result) => result.isLoading)),
      isFetching: results.some((result) => result.isFetching),
    }),
    [enabled, isLoadingSpotTokens],
  );

  return useQueries({
    queries: enabled
      ? evmAddresses.map((evmAddress) =>
          getHypercoreBalancesQueryOptions({
            evmAddress,
            spotTokens,
            enabled: Boolean(spotTokens),
          }),
        )
      : [],
    combine,
  });
};
