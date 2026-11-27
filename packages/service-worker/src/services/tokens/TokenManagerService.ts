import {
  Network,
  NetworkContractToken,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { ethers } from 'ethers';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { SettingsService } from '../settings/SettingsService';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import xss from 'xss';
import { getProviderForNetwork } from '@core/common';
import { EnsureDefined, NetworkWithCaipId } from '@core/types';
import { tokenAggregatorApiClient } from '~/api-clients/clients';
import { getV2Tokens, postV1TokenLookup } from '~/api-clients/token-aggregator';
import type { NetworkTokensByCaip2Response } from '~/api-clients/token-aggregator';
import {
  mapApiTokenToContractToken,
  mapTokenInfoToContractToken,
  NetworkContractTokenWithVerified,
} from './utils/mapApiToken';

const CATALOG_PAGE_LIMIT = 1000;
const TOKEN_LOOKUP_TIMEOUT_MS = 5_000;
// Maximum number of tokens accepted by a single POST /v1/token/lookup request.
const TOKEN_LOOKUP_BATCH_SIZE = 500;
// Only EVM addresses are case-insensitive; e.g. Solana base58 mints are not.
const normalizeLookupAddress = (caip2Id: string, address: string) =>
  caip2Id.startsWith('eip155:') ? address.toLowerCase() : address;

export type SearchedContractToken = NetworkContractTokenWithVerified & {
  caip2Id: string;
};

@singleton()
export class TokenManagerService {
  // Per-chain catalog cache/in-flight dedup, scoped to the service-worker
  // lifetime, so concurrent full-catalog consumers don't re-page the API.
  #catalogCache = new Map<string, NetworkContractTokenWithVerified[]>();
  #catalogInFlight = new Map<
    string,
    Promise<NetworkContractTokenWithVerified[]>
  >();

  // Per-(chain, address) known-token lookup cache/in-flight dedup. Matters
  // because wallet_watchAsset is unrestricted, so any page can trigger these.
  #tokenLookupCache = new Map<string, boolean>();
  #tokenLookupInFlight = new Map<string, Promise<boolean>>();

  #tokenDetailsCache = new Map<string, NetworkContractTokenWithVerified>();

  constructor(
    private settingsService: SettingsService,
    private networkService: NetworkService,
  ) {}

  async getCustomTokensForNetwork(
    network: Network,
  ): Promise<NetworkContractToken[]> {
    const settings = await this.settingsService.getSettings();
    return Object.values(settings.customTokens[network.chainId] || {}) || [];
  }

  async getTokensByChainId(
    chainId: number,
  ): Promise<NetworkContractTokenWithVerified[]> {
    const network = await this.networkService.getNetwork(chainId);

    if (!network) {
      return [];
    }

    // Interim: while the startup chainlist still embeds tokens, use them to
    // avoid a latency regression for full-catalog consumers before the switch
    // to /v2/networks (which no longer carries token arrays) lands.
    if (network.tokens && network.tokens.length > 0) {
      return network.tokens;
    }

    if (!network.caipId) {
      return [];
    }

    return this.#fetchFullCatalog(network.caipId);
  }

  async #fetchFullCatalog(
    caip2Id: string,
  ): Promise<NetworkContractTokenWithVerified[]> {
    const cached = this.#catalogCache.get(caip2Id);
    if (cached) {
      return cached;
    }

    const inFlight = this.#catalogInFlight.get(caip2Id);
    if (inFlight) {
      return inFlight;
    }

    const request = (async () => {
      const tokens: NetworkContractTokenWithVerified[] = [];
      let complete = false;

      try {
        for await (const page of this.#iterateCatalogPages(caip2Id)) {
          for (const token of page) {
            const mapped = mapApiTokenToContractToken(token);
            if (mapped) {
              tokens.push(mapped);
            }
          }
        }
        complete = true;
      } catch {
        // Best-effort: a single failing page shouldn't discard the pages we
        // already collected (which would empty the swap/transfer pickers).
        // Return what we have and skip caching so the next call re-fetches.
      }

      if (complete) {
        this.#catalogCache.set(caip2Id, tokens);
      }
      return tokens;
    })();

    this.#catalogInFlight.set(caip2Id, request);
    try {
      return await request;
    } finally {
      this.#catalogInFlight.delete(caip2Id);
    }
  }

  async *#iterateCatalogPages(
    caip2Id: string,
  ): AsyncGenerator<NetworkTokensByCaip2Response['tokens']> {
    let page = 1;
    let totalPages = 1;

    do {
      const response = await getV2Tokens<true>({
        client: tokenAggregatorApiClient,
        throwOnError: true,
        query: {
          caip2Id,
          page,
          limit: CATALOG_PAGE_LIMIT,
          returnMalicious: false,
        },
      });

      // Re-read totalPages and advance a local page counter each pass, so a
      // stale/fixed currentPage echoed by the API can't loop this forever.
      totalPages = response.data?.metadata?.totalPages ?? page;
      yield response.data?.data?.tokens ?? [];
      page += 1;
    } while (page <= totalPages);
  }

  async searchTokens({
    caip2Ids,
    page,
    limit,
    keyword,
    address,
    includeMalicious,
  }: {
    caip2Ids: string[];
    page: number;
    limit: number;
    keyword?: string;
    address?: string;
    includeMalicious?: boolean;
  }): Promise<{
    tokens: SearchedContractToken[];
    currentPage: number;
    totalPages: number;
  }> {
    // `/v2/tokens` requires at least one caip2Id; avoid an unintended broad
    // query (or a 4xx) when the caller passes none.
    if (caip2Ids.length === 0) {
      return { tokens: [], currentPage: page, totalPages: page };
    }

    const response = await getV2Tokens<true>({
      client: tokenAggregatorApiClient,
      throwOnError: true,
      query: {
        caip2Id: caip2Ids,
        page,
        limit,
        returnMalicious: Boolean(includeMalicious),
        // `keyword` matches name/symbol only; contract lookups need `address`.
        ...(address ? { address } : {}),
        ...(keyword ? { keyword } : {}),
      },
    });

    const meta = response.data?.metadata;
    const currentPage = meta?.currentPage ?? page;
    const totalPages = meta?.totalPages ?? currentPage;

    const tokens = (response.data?.data?.tokens ?? []).flatMap((token) => {
      const mapped = mapApiTokenToContractToken(token);
      return mapped ? [{ ...mapped, caip2Id: token.networkCaip2Id }] : [];
    });

    return { tokens, currentPage, totalPages };
  }

  async lookupTokens(
    caip2Id: string,
    addresses: string[],
  ): Promise<{
    tokens: NetworkContractTokenWithVerified[];
    failedAddresses: string[];
  }> {
    const requested = new Map(
      addresses.map((address) => [
        normalizeLookupAddress(caip2Id, address),
        address,
      ]),
    );
    const found: NetworkContractTokenWithVerified[] = [];
    const missing: string[] = [];

    for (const [normalized, address] of requested) {
      const cached = this.#tokenDetailsCache.get(`${caip2Id}:${normalized}`);

      if (cached) {
        found.push(cached);
      } else {
        missing.push(address);
      }
    }

    const batches: string[][] = [];
    for (let i = 0; i < missing.length; i += TOKEN_LOOKUP_BATCH_SIZE) {
      batches.push(missing.slice(i, i + TOKEN_LOOKUP_BATCH_SIZE));
    }

    const settled = await Promise.allSettled(
      batches.map((batch) =>
        postV1TokenLookup<true>({
          client: tokenAggregatorApiClient,
          throwOnError: true,
          body: {
            tokens: batch.map((address) => ({ caip2Id, address })),
          },
        }),
      ),
    );

    const rejected = settled.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );
    if (
      rejected.length > 0 &&
      rejected.length === settled.length &&
      found.length === 0
    ) {
      throw rejected[0]!.reason;
    }

    const failedAddresses = batches.flatMap((batch, index) =>
      settled[index]?.status === 'rejected' ? batch : [],
    );

    // The schema doesn't specify the response keys, so addresses are matched
    // via `platforms` first; `${caip2Id}-${address}` parsing is only a fallback.
    const keyPrefix = `${caip2Id}-`;
    for (const result of settled) {
      if (result.status !== 'fulfilled') {
        continue;
      }

      for (const [key, info] of Object.entries(result.value.data?.data ?? {})) {
        const platformAddress = info.platforms?.[caip2Id];
        const address =
          platformAddress &&
          requested.has(normalizeLookupAddress(caip2Id, platformAddress))
            ? platformAddress
            : key.startsWith(keyPrefix)
              ? key.slice(keyPrefix.length)
              : undefined;

        if (
          !address ||
          !requested.has(normalizeLookupAddress(caip2Id, address))
        ) {
          continue;
        }

        const mapped = mapTokenInfoToContractToken(info, caip2Id, address);

        if (mapped) {
          this.#tokenDetailsCache.set(
            `${caip2Id}:${normalizeLookupAddress(caip2Id, address)}`,
            mapped,
          );
          found.push(mapped);
        }
      }
    }

    return { tokens: found, failedAddresses };
  }

  async isTokenAvailable(
    network: NetworkWithCaipId,
    address: string,
  ): Promise<boolean> {
    const caip2Id = network.caipId;
    if (!caip2Id) {
      return false;
    }

    const cacheKey = `${caip2Id}:${address.toLowerCase()}`;

    const cached = this.#tokenLookupCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const inFlight = this.#tokenLookupInFlight.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const lookup = (async () => {
      // wallet_watchAsset is unrestricted (any page can call it), so bound the
      // request with a timeout and abort a hung connection rather than letting
      // it stall the caller.
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        TOKEN_LOOKUP_TIMEOUT_MS,
      );

      try {
        const response = await postV1TokenLookup<true>({
          client: tokenAggregatorApiClient,
          throwOnError: true,
          signal: controller.signal,
          body: { tokens: [{ caip2Id, address }] },
        });

        const found = Object.keys(response.data?.data ?? {}).length > 0;
        // Only cache a definitive result; a fail-open false below must not
        // poison the cache and hide a token that actually exists.
        this.#tokenLookupCache.set(cacheKey, found);
        return found;
      } catch {
        // Fail open on timeout/outage: never block adding a custom token.
        return false;
      } finally {
        clearTimeout(timeout);
      }
    })();

    this.#tokenLookupInFlight.set(cacheKey, lookup);
    try {
      return await lookup;
    } finally {
      this.#tokenLookupInFlight.delete(cacheKey);
    }
  }

  async getTokenData(
    tokenAddress: string,
    network: Network,
  ): Promise<EnsureDefined<NetworkContractToken, 'chainId'> | null> {
    if (!network || network.vmName !== NetworkVMType.EVM) {
      throw new Error('No network');
    }

    const provider = await getProviderForNetwork(network);
    if (!provider || !(provider instanceof JsonRpcBatchInternal)) {
      throw new Error('No provider');
    }

    const contract = new ethers.Contract(tokenAddress, ERC20.abi, provider);

    const contractCalls = await Promise.all([
      contract.name?.(),
      contract.symbol?.(),
      contract.decimals?.(),
    ]);
    // Purify the values for XSS protection
    const name = xss(contractCalls[0]);
    const symbol = xss(contractCalls[1]);
    const decimals = parseInt(contractCalls[2]);

    return {
      name,
      chainId: network.chainId,
      symbol,
      decimals,
      address: tokenAddress,
      contractType: 'ERC-20',
    };
  }
}
