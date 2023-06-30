import { singleton } from 'tsyringe';

import { DefiDataProvider, DefiProtocol } from '../models';

import {
  DebankChain,
  DebankComplexProtocol,
  DebankPortfolioItemObject,
} from './models';

@singleton()
export class DebankService implements DefiDataProvider {
  chains: DebankChain[] = [];

  #initializationPromise: Promise<unknown>;
  #baseUrl = `${process.env.PROXY_URL}/proxy/debank/v1`;

  constructor() {
    this.#initializationPromise = this.#initialize();
  }

  async #initialize() {
    return Promise.allSettled([this.#fetchChainList()]);
  }

  async #fetchChainList() {
    try {
      const url = this.#buildUrl('chain/list');
      const response = await fetch(url);
      this.chains = await response.json();
    } catch {
      /**
       * Not much we can do if something goes wrong. We can't throw an error,
       * as we don't want to stop other requests from coming through.
       *
       * Worst case scenario is that we won't display the chain information
       * for the protocol (that's what we need the chain data for on the UI side).
       */
      this.chains = [];
    }
  }

  async getUserProtocols(address: string): Promise<DefiProtocol[]> {
    // Let's wait for the initialization process to finish.
    // This is just a safeguard for an edge case where the first request could
    // technically come in before the request for DeBank chain list finishes.
    await this.#initializationPromise;

    try {
      const url = this.#buildUrl('user/all_complex_protocol_list', {
        id: address,
      });
      const response = await fetch(url);
      const rawData: DebankComplexProtocol[] = await response.json();

      const protocols: DefiProtocol[] = rawData.map(
        ({
          id,
          chain: debankChainId,
          name,
          site_url,
          logo_url,
          portfolio_item_list,
        }) => {
          const chain = this.#getUniversalChain(debankChainId);

          return {
            id,
            name,
            chainId: chain?.community_id,
            chainLogoUrl: chain?.logo_url,
            siteUrl: site_url,
            logoUrl: logo_url,
            totalUsdValue:
              this.#calculateTotalValueOfProtocolItems(portfolio_item_list),
          };
        }
      );

      return protocols;
    } catch (err) {
      throw new Error(
        `DebankService: Failed to load user's DeFi portfolio. ${
          err instanceof Error ? err.message : err
        }`
      );
    }
  }

  /**
   * Debank's API responds with it's own chain IDs (e.g. "eth" instead of 1 for Ethereum).
   * They provide an endpoint that maps those ids to the chain ids as we know them,
   */
  #getUniversalChain(debankChainId: string): DebankChain | undefined {
    return this.chains.find(({ id }) => id === debankChainId);
  }

  #calculateTotalValueOfProtocolItems(
    items: DebankPortfolioItemObject[]
  ): number {
    return items.reduce((total, { stats }) => total + stats.net_usd_value, 0);
  }

  #buildUrl(path: string, params?: Record<string, string>) {
    const search = params ? `?${new URLSearchParams(params)}` : '';
    return `${this.#baseUrl}/${path}${search}`;
  }
}
