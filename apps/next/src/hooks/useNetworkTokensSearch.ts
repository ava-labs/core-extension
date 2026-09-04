import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useCallback, useMemo, useRef } from 'react';
import {
  ExtensionRequest,
  FungibleTokenBalance,
  getUniqueTokenId,
} from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui';
import { isTokenMalicious } from '@core/common';

import { getTokenMapper } from '@/hooks/useAllTokens/lib/getTokenMapper';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import type {
  SearchedToken,
  SearchNetworkTokensHandler,
} from '@core/service-worker';

const PAGE_LIMIT = 100;
const MIN_KEYWORD_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

const EVM_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const isAddressLike = (value: string) =>
  EVM_ADDRESS.test(value) || SOLANA_ADDRESS.test(value);

// `/v2/tokens` filters on `address` (exact) and `keyword` (name/symbol, min 2
// chars) separately; route the search box value to whichever the API accepts.
const toServerSearch = (
  value: string,
): { keyword?: string; address?: string } => {
  if (isAddressLike(value)) {
    return { address: value };
  }
  return value.length >= MIN_KEYWORD_LENGTH ? { keyword: value } : {};
};

const matchesKeyword = (token: FungibleTokenBalance, keyword: string) => {
  if (!keyword) {
    return true;
  }
  const normalized = keyword.toLowerCase();
  return (
    token.name.toLowerCase().includes(normalized) ||
    token.symbol.toLowerCase().includes(normalized) ||
    // Case-insensitive address matching to make it easier for users typing in
    // partial address.
    ('address' in token && token.address.toLowerCase().includes(normalized))
  );
};

export const useNetworkTokensSearch = ({
  includeSpamTokens,
  keyword,
}: {
  includeSpamTokens: boolean;
  keyword: string;
}) => {
  const { request } = useConnectionContext();
  const { enabledNetworks } = useNetworkContext();
  const { customTokens } = useSettingsContext();
  const {
    accounts: { active },
  } = useAccountsContext();

  const heldTokens = useTokensForAccount(active, {
    networks: enabledNetworks,
    forceShowAllTokens: true,
  });

  const caip2Ids = useMemo(
    () => enabledNetworks.map((network) => network.caipId),
    [enabledNetworks],
  );

  const [debouncedKeyword] = useDebouncedValue(keyword.trim(), {
    wait: SEARCH_DEBOUNCE_MS,
    trailing: true,
  });

  const { keyword: serverKeyword, address: serverAddress } =
    toServerSearch(debouncedKeyword);

  // A non-address query shorter than the API minimum would otherwise fetch the
  // unfiltered catalog; skip the request and narrow held/custom client-side.
  const isBelowSearchMinimum =
    debouncedKeyword.length > 0 &&
    debouncedKeyword.length < MIN_KEYWORD_LENGTH &&
    !isAddressLike(debouncedKeyword);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      'manageTokensSearch',
      caip2Ids.join(','),
      serverKeyword ?? '',
      serverAddress ?? '',
      includeSpamTokens,
    ],
    initialPageParam: 1,
    enabled: caip2Ids.length > 0 && !isBelowSearchMinimum,
    queryFn: ({ pageParam }) =>
      request<SearchNetworkTokensHandler>({
        method: ExtensionRequest.SEARCH_NETWORK_TOKENS,
        params: [
          caip2Ids,
          pageParam as number,
          PAGE_LIMIT,
          serverKeyword,
          includeSpamTokens,
          serverAddress,
        ],
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });

  const tokens = useMemo(() => {
    // Below the search minimum the query is disabled but its key collides with
    // the unfiltered browse, so ignore any cached catalog pages and narrow the
    // held/custom set client-side instead.
    const searchedTokens = isBelowSearchMinimum
      ? []
      : (data?.pages ?? []).flatMap((page) =>
          page.tokens.map((token: SearchedToken) =>
            getTokenMapper(
              token.chainId,
              token.caip2Id,
            )({
              address: token.address,
              name: token.name,
              symbol: token.symbol,
              decimals: token.decimals,
              contractType: token.contractType,
              logoUri: token.logoUri,
              isVerified: token.isVerified,
            }),
          ),
        );

    // User-added custom tokens, kept manageable even when the aggregator does
    // not list them.
    const customTokenPlaceholders = enabledNetworks.flatMap(
      ({ chainId, caipId }) =>
        Object.values(customTokens[chainId] ?? {}).map(
          getTokenMapper(chainId, caipId),
        ),
    );

    // Held tokens come first so a held asset keeps its balance, price and
    // reputation (and natives, which the catalog omits) over the zero-balance
    // catalog/custom placeholder for the same asset.
    const byUniqueId = new Map<string, FungibleTokenBalance>();
    for (const token of [
      ...heldTokens,
      ...customTokenPlaceholders,
      ...searchedTokens,
    ]) {
      const id = getUniqueTokenId(token);
      if (!byUniqueId.has(id)) {
        byUniqueId.set(id, token);
      }
    }

    return Array.from(byUniqueId.values()).filter(
      (token) =>
        matchesKeyword(token, debouncedKeyword) &&
        (includeSpamTokens || !isTokenMalicious(token)),
    );
  }, [
    data,
    heldTokens,
    customTokens,
    enabledNetworks,
    debouncedKeyword,
    includeSpamTokens,
    isBelowSearchMinimum,
  ]);

  // Stop rapid onEndReached callbacks from firing multiple page requests.
  const isLoadingMoreRef = useRef(false);
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetching || isLoadingMoreRef.current) {
      return;
    }
    isLoadingMoreRef.current = true;
    fetchNextPage().finally(() => {
      isLoadingMoreRef.current = false;
    });
  }, [hasNextPage, isFetching, fetchNextPage]);

  return {
    tokens,
    loadMore,
    hasNextPage: hasNextPage ?? false,
    isLoading: isFetching && !isFetchingNextPage && !data,
    isFetchingNextPage,
    isError,
    refetch,
  };
};
