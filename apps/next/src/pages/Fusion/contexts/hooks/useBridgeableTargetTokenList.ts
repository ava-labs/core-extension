import {
  type BridgeableUiAsset,
  type GetSupportedChainsResult,
  type TransferManager,
  sortDestinationChains,
  TokenType as FusionTokenType,
} from '@avalabs/fusion-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { skipToken, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';

import {
  useAccountsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import {
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
  isChainSupportedByWalletOrAccount,
} from '@core/common';
import {
  type FungibleAssetType,
  type FungibleTokenBalance,
  type NetworkWithCaipId,
  getUniqueTokenId,
} from '@core/types';

import { getNativeAssetType } from '@/hooks/useAllTokens/lib/getNativeAssetType';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { type ChainOption } from '@/components/TokenSelect/components/ChainFilterChips';
import { getChainFilterName } from '@/components/TokenSelect/utils';
import { buildAsset } from './useAssetAndChain/lib/buildAsset';
import { ChainId } from '@avalabs/core-chains-sdk';

type BridgeableAssetsResult = Awaited<
  ReturnType<TransferManager['getBridgeableAssets']>
>;

const LIMIT = 100;
const MIN_SEARCH_LENGTH = 2;

// Adapted from core-web: stop paginating when page has no verified tokens on C-Chain.
// When search is active, always paginate until the API says done.
const getHasMore = (
  result: BridgeableAssetsResult,
  targetChainId: string,
  search: { type: 'address' | 'keyword'; value: string } | undefined,
  getNetwork: (id: string) => NetworkWithCaipId | undefined,
): boolean => {
  if (!result.meta.hasMore) return false;
  if (search && search.value.length >= MIN_SEARCH_LENGTH) return true;

  const network = getNetwork(targetChainId);
  const isAvaxCChain = network
    ? isAvalancheChainId(network.chainId as number)
    : false;

  if (isAvaxCChain) {
    return result.assets.some((asset) => asset.extras?.isVerified !== false);
  }
  return true;
};

const mapBridgeableAsset = (
  asset: BridgeableUiAsset,
  network: NetworkWithCaipId,
  cChainAvaxLogoUri: string | undefined,
): FungibleTokenBalance | undefined => {
  const isVerified =
    (asset.extras?.isVerified as boolean | null | undefined) ?? null;
  const logoUri =
    isPchainNetworkId(network.chainId) ||
    isXchainNetworkId(network.chainId) ||
    isAvalancheChainId(network.chainId)
      ? cChainAvaxLogoUri
      : (asset.logoUri ?? undefined);
  const base = {
    name: asset.name,
    symbol: asset.symbol,
    decimals: asset.decimals,
    logoUri,
    balance: 0n,
    balanceDisplayValue: '0',
    reputation: null,
    coreChainId: network.chainId as number,
    chainCaipId: network.caipId,
    isVerified,
  };

  if (asset.type === FusionTokenType.NATIVE) {
    return {
      ...base,
      type: TokenType.NATIVE,
      assetType: getNativeAssetType(network),
    } as unknown as FungibleTokenBalance;
  }

  if (asset.type === FusionTokenType.ERC20 && asset.address) {
    return {
      ...base,
      type: TokenType.ERC20,
      address: asset.address as `0x${string}`,
      assetType: 'evm_erc20' as FungibleAssetType,
    } as unknown as FungibleTokenBalance;
  }

  if (asset.type === FusionTokenType.SPL && asset.address) {
    return {
      ...base,
      type: TokenType.SPL,
      address: String(asset.address),
      assetType: 'svm_spl' as FungibleAssetType,
    } as unknown as FungibleTokenBalance;
  }

  return undefined;
};

const sortTokensByBalance = (
  tokenA: FungibleTokenBalance,
  tokenB: FungibleTokenBalance,
) =>
  Number(tokenB.balance > 0n) - Number(tokenA.balance > 0n) ||
  (tokenB.balanceInCurrency ?? 0) - (tokenA.balanceInCurrency ?? 0) ||
  (tokenA.balance === tokenB.balance
    ? 0
    : tokenA.balance > tokenB.balance
      ? -1
      : 1) ||
  tokenA.name.localeCompare(tokenB.name);

const toEffectiveSearch = (
  search: string | undefined,
): { type: 'address' | 'keyword'; value: string } | undefined => {
  if (!search || search.length < MIN_SEARCH_LENGTH) {
    return undefined;
  }
  const isAddress =
    search.startsWith('0x') || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(search);
  return isAddress
    ? { type: 'address', value: search }
    : { type: 'keyword', value: search };
};

type PageResult = {
  assets: readonly BridgeableUiAsset[];
  hasMore: boolean;
};

export type BridgeableTargetTokenListResult = {
  tokens: FungibleTokenBalance[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
  targetChainOptions: ChainOption[];
};

export const useBridgeableTargetTokenList = (
  manager: TransferManager | undefined,
  supportedChainsMap: GetSupportedChainsResult,
  sourceToken: FungibleTokenBalance | undefined,
  search: string | undefined,
  selectedTargetChainId: number | 'avalanche' | null,
): BridgeableTargetTokenListResult => {
  const { getNetwork } = useNetworkContext();
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active },
  } = useAccountsContext();

  const userTokens = useTokensForAccount(active);

  const userBalanceMap = useMemo(() => {
    const map = new Map<string, FungibleTokenBalance>();
    for (const token of userTokens) {
      let key: string;
      if (token.type === TokenType.NATIVE) {
        key = `${token.chainCaipId}:native`;
      } else if (token.assetType === 'svm_spl') {
        key = `${token.chainCaipId}:${(token as unknown as { address: string }).address}`;
      } else {
        key = `${token.chainCaipId}:${(token as unknown as { address: string }).address.toLowerCase()}`;
      }
      map.set(key, token);
    }
    return map;
  }, [userTokens]);

  const effectiveSearch = useMemo(() => toEffectiveSearch(search), [search]);

  const sourceAsset = useMemo(() => {
    if (!sourceToken) return undefined;
    try {
      const tokenAddress =
        sourceToken.type === TokenType.NATIVE ? undefined : sourceToken.address;
      return buildAsset(
        sourceToken.assetType,
        sourceToken.name,
        sourceToken.symbol,
        sourceToken.decimals,
        tokenAddress,
      );
    } catch {
      return undefined;
    }
  }, [sourceToken]);

  const sourceChainId = sourceToken?.chainCaipId;
  // The bridgeable set depends on the specific source token, not just its
  // chain — key on the token id so switching tokens within one chain refetches.
  const sourceTokenId = sourceToken ? getUniqueTokenId(sourceToken) : undefined;

  // All chains this source token can bridge to — no allowlist, derived from supportedChainsMap
  const allTargetCaipIds = useMemo(() => {
    if (!sourceToken) return [];

    const chainIds = supportedChainsMap.get(
      sourceToken.chainCaipId as `${string}:${string}`,
    );

    return (chainIds?.values().toArray() ?? []).filter((caipId) => {
      const network = getNetwork(caipId);
      return (
        network &&
        isChainSupportedByWalletOrAccount(network, walletDetails, active)
      );
    });
  }, [supportedChainsMap, sourceToken, getNetwork, walletDetails, active]);

  const sortedTargetChains = useMemo(() => {
    const targetChains = allTargetCaipIds.flatMap((caipId) => {
      const network = getNetwork(caipId);
      if (!network) {
        return [];
      }

      return [
        {
          caipId: caipId,
          chainId: caipId,
          chainName: network.chainName,
          network,
        },
      ];
    });

    return sortDestinationChains(targetChains);
  }, [allTargetCaipIds, getNetwork]);

  // Resolve the selected chip value to a single CAIP ID for the API call
  const selectedTargetCaipId = useMemo(() => {
    if (sortedTargetChains.length === 0) return null;

    if (!selectedTargetChainId) {
      return sortedTargetChains[0]?.caipId ?? null;
    }

    if (selectedTargetChainId === 'avalanche') {
      return (
        sortedTargetChains.find(({ network }) =>
          isAvalancheChainId(network.chainId as number),
        )?.caipId ?? null
      );
    }

    return (
      sortedTargetChains.find(
        ({ network }) => network.chainId === selectedTargetChainId,
      )?.caipId ?? null
    );
  }, [selectedTargetChainId, sortedTargetChains]);

  // Build chain filter chip options from the full supported target chain list
  const targetChainOptions = useMemo(() => {
    return sortedTargetChains.map(({ network }) => {
      const chainId = network.chainId as number;
      return {
        chainId,
        chainName: getChainFilterName(chainId, network.chainName),
        logoUri: network.logoUri,
      } satisfies ChainOption;
    });
  }, [sortedTargetChains]);

  // Track whether any data has ever arrived so chain-chip changes don't
  // flip isLoading back to true and unmount the SwapPair (closing the dropdown).
  const hasEverHadData = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey: [
      'bridgeableTargetTokens',
      sourceChainId,
      sourceTokenId,
      selectedTargetCaipId,
      effectiveSearch?.type,
      effectiveSearch?.value,
    ],
    initialPageParam: 1,
    queryFn:
      !manager || !sourceAsset || !sourceChainId || !selectedTargetCaipId
        ? skipToken
        : async ({ pageParam: page }) => {
            const result = await manager.getBridgeableAssets({
              sourceAsset,
              sourceChainId: sourceChainId as `${string}:${string}`,
              targetChainId: selectedTargetCaipId as `${string}:${string}`,
              search: effectiveSearch,
              limit: LIMIT,
              page,
            });
            return {
              assets: result.assets,
              hasMore: getHasMore(
                result,
                selectedTargetCaipId,
                effectiveSearch,
                getNetwork,
              ),
            } satisfies PageResult;
          },
    getNextPageParam: (lastPage, _all, lastPageParam) =>
      lastPage.hasMore ? (lastPageParam as number) + 1 : undefined,
    // Keep previous data only when the source token AND target chain are
    // unchanged — avoids a loading flash on search-text changes while
    // preventing a stale list when the source token or target chain changes.
    placeholderData: (prevData, prevQuery) => {
      if (!prevData || !prevQuery) return undefined;
      const prevKey = prevQuery.queryKey as unknown[];
      if (
        prevKey[1] === sourceChainId &&
        prevKey[2] === sourceTokenId &&
        prevKey[3] === selectedTargetCaipId
      )
        return prevData;
      return undefined;
    },
    enabled:
      !!manager && !!sourceAsset && !!sourceChainId && !!selectedTargetCaipId,
    staleTime: 30_000,
  });

  const tokens = useMemo(() => {
    if (!selectedTargetCaipId) return [];
    const network = getNetwork(selectedTargetCaipId);
    if (!network) return [];

    const cChainAvaxLogoUri = getNetwork(
      network.isTestnet
        ? ChainId.AVALANCHE_TESTNET_ID
        : ChainId.AVALANCHE_MAINNET_ID,
    )?.networkToken.logoUri;

    const all: FungibleTokenBalance[] = [];
    for (const page of data?.pages ?? []) {
      for (const asset of page.assets) {
        const token = mapBridgeableAsset(asset, network, cChainAvaxLogoUri);
        if (!token) continue;

        let lookupKey: string;
        if (asset.type === FusionTokenType.NATIVE) {
          lookupKey = `${network.caipId}:native`;
        } else if (asset.type === FusionTokenType.SPL && asset.address) {
          lookupKey = `${network.caipId}:${String(asset.address)}`;
        } else if (asset.address) {
          lookupKey = `${network.caipId}:${String(asset.address).toLowerCase()}`;
        } else {
          all.push(token);
          continue;
        }

        const userToken = userBalanceMap.get(lookupKey);
        all.push(
          userToken
            ? {
                ...token,
                balance: userToken.balance,
                balanceDisplayValue: userToken.balanceDisplayValue,
                balanceInCurrency: userToken.balanceInCurrency,
                priceInCurrency: userToken.priceInCurrency,
              }
            : token,
        );
      }
    }

    const verified = all.filter((t) => t.isVerified !== false);
    const unverified = all.filter((t) => t.isVerified === false);

    return [
      ...verified.toSorted(sortTokensByBalance),
      ...unverified.toSorted(sortTokensByBalance),
    ];
  }, [data, selectedTargetCaipId, getNetwork, userBalanceMap]);

  if (data !== undefined) hasEverHadData.current = true;

  // True only on genuine first load — once data has arrived at least once,
  // chain-chip changes keep isLoading=false so SwapPair stays mounted and
  // the dropdown does not close or lose its open state.
  const isLoading =
    !hasEverHadData.current &&
    !!sourceToken &&
    !!selectedTargetCaipId &&
    isPending &&
    isFetching &&
    !isPlaceholderData;

  return {
    tokens,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isLoading,
    isFetching,
    targetChainOptions,
  };
};
