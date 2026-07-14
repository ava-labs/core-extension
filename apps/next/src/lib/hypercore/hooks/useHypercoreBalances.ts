import {
  queryOptions,
  skipToken,
  useQueries,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  buildHypercoreTokens,
  type HypercoreSpotToken,
  type HypercoreTokenBalance,
} from '@avalabs/hypercore-module';
import { isHypercoreNetwork } from '@core/common';
import {
  useIsHyperliquidEnabled,
  useIsMainnet,
  useNetworkContext,
} from '@core/ui';
import { useMemo } from 'react';
import { getHypercoreInfoClient } from '../getHypercoreInfoClient';
import { useHypercoreSpotTokens } from './useHypercoreSpotTokens';

export const HYPERCORE_BALANCES_QUERY_KEY = 'hypercoreBalances';
const BALANCES_STALE_TIME_MS = 60 * 1000;

const fetchHypercorePortfolio = async (
  evmAddress: string,
  spotTokens: HypercoreSpotToken[],
) => {
  const client = getHypercoreInfoClient();
  const [spotState, perpState, abstractionMode] = await Promise.all([
    client.getSpotClearinghouseState(evmAddress).catch(() => undefined),
    client.getClearinghouseState(evmAddress).catch(() => undefined),
    client.getUserAbstraction(evmAddress).catch(() => undefined),
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
      `${token.index}:${token.decimals}:${token.symbol}:${token.name}:${token.evmContract ?? ''}`,
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

const useIsHypercoreNetworkEnabled = () => {
  const { enabledNetworks } = useNetworkContext();
  return enabledNetworks.some(isHypercoreNetwork);
};

type UseHypercoreBalancesParams = {
  evmAddress?: string;
};

export const useHypercoreBalances = ({
  evmAddress,
}: UseHypercoreBalancesParams) => {
  const isHyperliquidEnabled = useIsHyperliquidEnabled();
  const isMainnet = useIsMainnet();
  const isHypercoreNetworkEnabled = useIsHypercoreNetworkEnabled();
  const enabled =
    Boolean(evmAddress) &&
    isHyperliquidEnabled &&
    isMainnet &&
    isHypercoreNetworkEnabled;

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
  const isHypercoreNetworkEnabled = useIsHypercoreNetworkEnabled();
  const enabled =
    isHyperliquidEnabled &&
    isMainnet &&
    isHypercoreNetworkEnabled &&
    evmAddresses.length > 0;

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
