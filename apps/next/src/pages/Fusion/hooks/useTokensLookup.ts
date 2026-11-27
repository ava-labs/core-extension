import { useCallback, useMemo } from 'react';
import {
  keepPreviousData,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query';
import { TokenType } from '@avalabs/vm-module-types';
import { ERC_ZERO_ADDRESS } from '@avalabs/fusion-sdk';

import { isHypercoreNetwork } from '@core/common';
import {
  ExtensionRequest,
  type FungibleTokenBalance,
  type NetworkWithCaipId,
} from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useSettingsContext,
} from '@core/ui';
import type { LookupNetworkTokensHandler } from '@core/service-worker';

import { getNativeAssetType } from '@/hooks/useAllTokens/lib/getNativeAssetType';
import { getTokenMapper } from '@/hooks/useAllTokens/lib/getTokenMapper';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';

const ZERO_ADDRESS = ERC_ZERO_ADDRESS.toLowerCase();

type LookupResult = {
  tokens: FungibleTokenBalance[];
  failedAddresses: string[];
};

const MAX_PARTIAL_RETRIES = 5;
const PARTIAL_RETRY_BASE_MS = 2000;
const PARTIAL_RETRY_MAX_MS = 30_000;

// Only EVM addresses are case-insensitive; e.g. Solana base58 mints are not.
const normalizeAddress = (caipId: string, address: string) =>
  caipId.startsWith('eip155:') ? address.toLowerCase() : address;

const throwIfAborted = (signal: AbortSignal) => {
  if (signal.aborted) {
    throw signal.reason ?? new DOMException('Aborted', 'AbortError');
  }
};

const waitForRetry = (attempt: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const onAbort = () => {
      clearTimeout(timeout);
      reject(signal.reason);
    };
    const timeout = setTimeout(
      () => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      },
      Math.min(PARTIAL_RETRY_BASE_MS * 2 ** attempt, PARTIAL_RETRY_MAX_MS),
    );
    signal.addEventListener('abort', onAbort, { once: true });
  });

const combineQueryResults = (
  results: {
    data: LookupResult | undefined;
    isFetching: boolean;
    isPlaceholderData: boolean;
  }[],
) => ({
  data: results.map((result) => result.data?.tokens),
  isPending: results.some(
    (result) =>
      result.isFetching &&
      (!result.data ||
        result.isPlaceholderData ||
        result.data.failedAddresses.length > 0),
  ),
});

export type TokensLookupRequest = {
  network: NetworkWithCaipId;
  addresses: string[];
};

const buildNativeToken = (
  network: NetworkWithCaipId,
): FungibleTokenBalance => ({
  type: TokenType.NATIVE,
  balance: 0n,
  balanceDisplayValue: '0',
  assetType: getNativeAssetType(network),
  coreChainId: network.chainId,
  chainCaipId: network.caipId,
  name: network.networkToken.name,
  symbol: network.networkToken.symbol,
  decimals: network.networkToken.decimals,
  logoUri: network.networkToken.logoUri,
  coingeckoId: '',
});

type ChainTokens = {
  network: NetworkWithCaipId;
  native: FungibleTokenBalance;
  local: Map<string, FungibleTokenBalance>;
  unresolved: string[];
};

export const useTokensLookup = (
  requests: TokensLookupRequest[],
  { enabled = true }: { enabled?: boolean } = {},
) => {
  const { request } = useConnectionContext();
  const { customTokens } = useSettingsContext();
  const {
    accounts: { active },
  } = useAccountsContext();

  const requestsSignature = requests
    .map(
      ({ network, addresses }) =>
        `${network.caipId}:${addresses.map((a) => normalizeAddress(network.caipId, a)).join(',')}`,
    )
    .join('|');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableRequests = useMemo(() => requests, [requestsSignature]);

  const networks = useMemo(
    () => stableRequests.map(({ network }) => network),
    [stableRequests],
  );

  const heldTokens = useTokensForAccount(active, {
    networks,
    forceShowAllTokens: true,
  });

  const chains = useMemo(
    () =>
      stableRequests.map<ChainTokens>(({ network, addresses }) => {
        const local = new Map<string, FungibleTokenBalance>();
        const mapCustomToken = getTokenMapper(network.chainId, network.caipId);

        for (const token of Object.values(
          customTokens[network.chainId] ?? {},
        )) {
          local.set(
            normalizeAddress(network.caipId, token.address),
            mapCustomToken(token),
          );
        }

        let native: FungibleTokenBalance | undefined;

        for (const token of heldTokens) {
          if (token.coreChainId !== network.chainId) {
            continue;
          }

          if (token.type === TokenType.NATIVE) {
            native = token;
          } else if ('address' in token && token.address) {
            local.set(normalizeAddress(network.caipId, token.address), token);
          }
        }

        const unresolved = isHypercoreNetwork(network)
          ? []
          : [
              ...new Set(
                addresses
                  .map((address) => normalizeAddress(network.caipId, address))
                  .filter(
                    (address) =>
                      address.toLowerCase() !== ZERO_ADDRESS &&
                      !local.has(address),
                  ),
              ),
            ].sort();

        return {
          network,
          native: native ?? buildNativeToken(network),
          local,
          unresolved,
        };
      }),
    [stableRequests, customTokens, heldTokens],
  );

  const requestedCasing = useMemo(
    () =>
      new Map(
        stableRequests.flatMap(({ network, addresses }) =>
          addresses.map(
            (address) =>
              [
                `${network.caipId}:${normalizeAddress(network.caipId, address)}`,
                address,
              ] as const,
          ),
        ),
      ),
    [stableRequests],
  );

  const queryClient = useQueryClient();

  const lookedUp = useQueries({
    combine: combineQueryResults,
    queries: chains.map(({ network, unresolved }) => {
      const queryKey = ['tokensLookup', network.caipId, unresolved.join(',')];

      return {
        queryKey,
        enabled: enabled && unresolved.length > 0,
        staleTime: Infinity,
        placeholderData: keepPreviousData,
        queryFn: async ({
          signal,
        }: {
          signal: AbortSignal;
        }): Promise<LookupResult> => {
          const mapToken = getTokenMapper(network.chainId, network.caipId);
          let tokens: FungibleTokenBalance[] = [];
          let failedAddresses = unresolved;

          for (let attempt = 0; ; attempt++) {
            throwIfAborted(signal);

            if (attempt > 0) {
              await waitForRetry(attempt - 1, signal);
            }

            try {
              const response = await request<LookupNetworkTokensHandler>({
                method: ExtensionRequest.LOOKUP_NETWORK_TOKENS,
                params: [network.caipId, failedAddresses],
              });

              tokens = [
                ...tokens,
                ...response.tokens.map((token) =>
                  mapToken({
                    address:
                      requestedCasing.get(
                        `${network.caipId}:${normalizeAddress(network.caipId, token.address)}`,
                      ) ?? token.address,
                    name: token.name,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    contractType: token.contractType,
                    logoUri: token.logoUri,
                    isVerified: token.isVerified,
                  }),
                ),
              ];
              failedAddresses = response.failedAddresses;
            } catch {
              // a rejected attempt leaves the same addresses to retry
            }

            throwIfAborted(signal);

            if (
              failedAddresses.length === 0 ||
              attempt >= MAX_PARTIAL_RETRIES
            ) {
              return { tokens, failedAddresses };
            }

            queryClient.setQueryData<LookupResult>(queryKey, {
              tokens,
              failedAddresses,
            });
          }
        },
      };
    }),
  });

  const tokensByCaipId = useMemo(() => {
    const result: Record<string, FungibleTokenBalance[]> = {};

    chains.forEach(({ network, native, local }, index) => {
      const tokens = [native, ...local.values()];

      for (const token of lookedUp.data[index] ?? []) {
        tokens.push(token);
      }

      result[network.caipId] = tokens;
    });

    return result;
  }, [chains, lookedUp.data]);

  const resolveToken = useCallback(
    (caipId: string, tokenAddress: string) => {
      const tokens = tokensByCaipId[caipId] ?? [];

      if (tokenAddress.toLowerCase() === ZERO_ADDRESS) {
        return tokens.find((token) => token.type === TokenType.NATIVE);
      }

      return tokens.find(
        (token) =>
          'address' in token &&
          token.address &&
          normalizeAddress(caipId, token.address) ===
            normalizeAddress(caipId, tokenAddress),
      );
    },
    [tokensByCaipId],
  );

  return { tokensByCaipId, resolveToken, isPending: lookedUp.isPending };
};
