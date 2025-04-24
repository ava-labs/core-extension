import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { keccakFromString } from 'ethereumjs-util';

import { StorageService } from '../storage/StorageService';
import { DebankService } from '../debank';
import { DefiPortfolio, DefiProtocol, DefiServiceEvents } from '@core/types';

@singleton()
export class DefiService {
  #emitter = new EventEmitter();

  constructor(
    private debankService: DebankService,
    private storageService: StorageService,
  ) {}

  async getUserPortfolio(address: string): Promise<DefiPortfolio> {
    const stalePortfolio = await this.#getCachedPortfolio(address);

    // Push cached, possibly stale portfolio to the frontend first.
    // This way we get something to render before the API responds
    // which may take a few seconds and is easily noticeable when
    // closing & re-opening the extension.
    if (stalePortfolio) {
      this.#emitter.emit(DefiServiceEvents.PortfolioUpdated, {
        address,
        portfolio: stalePortfolio,
      });
    }

    try {
      const protocols = await this.debankService.getUserProtocols(address);
      const portfolio = this.#buildPortfolio(protocols, stalePortfolio);

      this.#cachePortfolio(address, portfolio);

      return portfolio;
    } catch (err) {
      throw new Error(
        `DefiService: Unable to fetch user's portfolio: ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  addListener(event: DefiServiceEvents, callback: (data: unknown) => void) {
    this.#emitter.on(event, callback);
  }

  #buildPortfolio(
    liveProtocols: DefiProtocol[],
    stalePortfolio?: DefiPortfolio,
  ) {
    // We just want to make sure the cached protocols do not suddenly disappear
    // from the portfolio when their positions are closed.
    // If that happens, we instead want them to remain visible in the UI,
    // but in an empty state (empty protocols collection and zeroed value).
    let emptiedProtocols: DefiProtocol[] = [];

    if (stalePortfolio) {
      const liveProtocolIds = liveProtocols.map(({ id }) => id);
      emptiedProtocols = stalePortfolio.protocols
        .filter(({ id }) => !liveProtocolIds.includes(id))
        .map((protocol) => ({
          ...protocol,
          groups: [],
          totalUsdValue: 0,
        }));
    }

    const allProtocols = [...liveProtocols, ...emptiedProtocols];

    return {
      protocols: this.#sortProtocols(allProtocols),
      totalUsdValue: this.#calculateTotalValueOfUserProtocols(allProtocols),
    };
  }

  async #cachePortfolio(address: string, portfolio: DefiPortfolio) {
    try {
      await this.storageService.saveToSessionStorage(
        this.#getCacheStorageKey(address),
        portfolio,
      );
    } catch {
      // If we didn't manage to cache it - no biggie.
    }
  }

  async #getCachedPortfolio(
    address: string,
  ): Promise<DefiPortfolio | undefined> {
    return this.storageService.loadFromSessionStorage(
      this.#getCacheStorageKey(address),
    );
  }

  #getCacheStorageKey(address: string): string {
    return `defi-portfolio-${keccakFromString(address).toString()}`;
  }

  #calculateTotalValueOfUserProtocols(protocols: DefiProtocol[]): number {
    return protocols.reduce(
      (total, { totalUsdValue }) => total + totalUsdValue,
      0,
    );
  }

  #sortProtocols(protocols: DefiProtocol[]): DefiProtocol[] {
    return [...protocols].sort(
      ({ totalUsdValue: valueA }, { totalUsdValue: valueB }) => valueB - valueA,
    );
  }
}
