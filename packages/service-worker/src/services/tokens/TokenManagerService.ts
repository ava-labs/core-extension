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
import {
  mapApiTokenToContractToken,
  NetworkContractTokenWithVerified,
} from './utils/mapApiToken';

const CATALOG_PAGE_LIMIT = 1000;

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
      let page = 1;
      let complete = false;

      try {
        for (;;) {
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

          for (const token of response.data?.data?.tokens ?? []) {
            const mapped = mapApiTokenToContractToken(token);
            if (mapped) {
              tokens.push(mapped);
            }
          }

          // Advance the local page rather than the server-echoed currentPage,
          // so a stale/fixed currentPage from the API can't loop this forever.
          const totalPages = response.data?.metadata?.totalPages ?? page;
          if (page >= totalPages) {
            complete = true;
            break;
          }
          page += 1;
        }
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

  async isTokenAvailable(
    network: NetworkWithCaipId,
    address: string,
  ): Promise<boolean> {
    if (!network.caipId) {
      return false;
    }

    try {
      const response = await postV1TokenLookup<true>({
        client: tokenAggregatorApiClient,
        throwOnError: true,
        body: { tokens: [{ caip2Id: network.caipId, address }] },
      });

      return Object.keys(response.data?.data ?? {}).length > 0;
    } catch {
      // Fail open: an aggregator outage must not block adding a custom token.
      return false;
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
