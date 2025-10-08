import { OnLock, OnUnlock } from '../../runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import {
  Account,
  Balances,
  BalancesInfo,
  BalanceServiceEvents,
  BALANCES_CACHE_KEY,
  CachedBalancesInfo,
  PriceChangesData,
  TOKENS_PRICE_DATA,
  TokensPriceChangeData,
  TokensPriceShortData,
  priceChangeRefreshRate,
} from '@core/types';
import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';
import { EventEmitter } from 'events';
import * as Sentry from '@sentry/browser';
import { isEqual, omit, pick } from 'lodash';

import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { resolve } from '@avalabs/core-utils-sdk';
import { SettingsService } from '../settings/SettingsService';
import { isFulfilled } from '@core/common';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';
import { groupTokensByType } from '@core/common';

@singleton()
export class BalanceAggregatorService implements OnLock, OnUnlock {
  #eventEmitter = new EventEmitter();
  #balances: Balances = {};
  #nfts: Balances<NftTokenWithBalance> = {};
  #isBalancesCached = true;

  get balances() {
    return this.#balances;
  }

  get nfts() {
    return this.#nfts;
  }

  get isBalancesCached() {
    return this.#isBalancesCached;
  }

  constructor(
    private balancesService: BalancesService,
    private networkService: NetworkService,
    private lockService: LockService,
    private storageService: StorageService,
    private settingsService: SettingsService,
  ) {}

  async getBalancesForNetworks(
    chainIds: number[],
    accounts: Account[],
    tokenTypes: TokenType[],
    cacheResponse = true,
  ): Promise<{ tokens: Balances; nfts: Balances<NftTokenWithBalance> }> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalanceAggregatorService: getBatchedUpdatedBalancesForNetworks',
    });

    const networks = Object.values(
      await this.networkService.activeNetworks.promisify(),
    ).filter((network) => chainIds.includes(network.chainId));

    const priceChangesData = await this.getPriceChangesData();

    const updateRequests = await Promise.allSettled(
      networks.map(async (network) => {
        const networkBalances =
          await this.balancesService.getBalancesForNetwork(
            network,
            accounts,
            tokenTypes,
            priceChangesData,
          );

        return {
          chainId: network.chainId,
          networkBalances,
        };
      }),
    );

    const updatedNetworks = updateRequests
      .filter(isFulfilled)
      .map(({ value }) => value);

    const networksWithChanges = updatedNetworks
      .filter(({ chainId, networkBalances }) => {
        // We may have balances of other accounts cached for this chain ID,
        // so to check for updates we need to only compare against a subsection
        // of the cached balances.
        const fetchedAddresses = Object.keys(networkBalances);
        const cachedBalances = pick(
          this.balances[chainId] ?? {},
          fetchedAddresses,
        );

        return !isEqual(networkBalances, cachedBalances);
      })
      .map(({ chainId }) => chainId);

    const freshBalances = updatedNetworks.reduce<{
      nfts: Balances<NftTokenWithBalance>;
      tokens: Balances;
    }>(
      (balances, balanceOfNetwork) => {
        const { chainId, networkBalances } = balanceOfNetwork;

        const networkBalancesByType = groupTokensByType(networkBalances);
        balances.tokens[chainId] = networkBalancesByType.tokens;
        balances.nfts[chainId] = networkBalancesByType.nfts;

        return balances;
      },
      { tokens: {}, nfts: {} },
    );

    // NFTs don't have balance = 0, if they are sent they should be removed
    // from the list, hence deep merge doesn't work
    const hasFetchedNfts =
      tokenTypes.includes(TokenType.ERC721) ||
      tokenTypes.includes(TokenType.ERC1155);
    const aggregatedNfts = hasFetchedNfts
      ? {
          ...this.nfts,
          ...freshBalances.nfts,
        }
      : this.nfts;
    const hasBalanceChanges = networksWithChanges.length > 0;
    const hasNftChanges = !isEqual(aggregatedNfts, this.nfts);
    const hasChanges = hasBalanceChanges || hasNftChanges;

    const aggregatedBalances = { ...this.balances };
    if (hasBalanceChanges) {
      const freshData = Object.entries(freshBalances.tokens);
      // We don't want to merge the account's balances, but overwrite them.
      // Merging will result in wrong values when there are nested properties,
      // such as UTXOs or "balanceByType" for X/P chains.
      for (const [chainId, chainBalances] of freshData) {
        for (const [address, addressBalance] of Object.entries(chainBalances)) {
          aggregatedBalances[chainId] = {
            ...omit(aggregatedBalances[chainId], address), // Keep cached balances for other accounts
            ...chainBalances,
            [address]: addressBalance,
          };
        }
      }
    }

    if (cacheResponse && hasChanges && !this.lockService.locked) {
      this.#balances = aggregatedBalances;
      this.#nfts = aggregatedNfts;

      this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
        balances: {
          tokens: aggregatedBalances,
          nfts: aggregatedNfts,
        },
        isBalancesCached: false,
      } as BalancesInfo);
      await this.#updateCachedBalancesInfo();
    }

    this.#isBalancesCached = false;

    sentryTracker.finish();

    return {
      tokens: aggregatedBalances,
      nfts: aggregatedNfts,
    };
  }

  getPriceChangesData = async () => {
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const changesData =
      await this.storageService.loadUnencrypted<TokensPriceChangeData>(
        `${TOKENS_PRICE_DATA}-${selectedCurrency}`,
      );

    const lastUpdated = changesData?.lastUpdatedAt;

    let priceChangesData = changesData?.priceChanges || {};

    // Check if cached data has currentPrice field, if not fetch fresh data
    const hasCurrentPrice = Object.values(priceChangesData).some(
      (token: any) =>
        token && typeof token === 'object' && 'currentPrice' in token,
    );

    if (
      !priceChangesData ||
      !Object.keys(priceChangesData).length ||
      !hasCurrentPrice ||
      (lastUpdated && lastUpdated + priceChangeRefreshRate < Date.now())
    ) {
      const [priceChangesResult] = await resolve(
        fetch(
          `${process.env.PROXY_URL}/watchlist/tokens?currency=${selectedCurrency}`,
        ),
      );

      if (!priceChangesResult) {
        return;
      }
      const priceChanges: PriceChangesData[] = await priceChangesResult.json();
      const tokensData: TokensPriceShortData = priceChanges.reduce(
        (acc: TokensPriceShortData, data: PriceChangesData) => {
          return {
            ...acc,
            [data.symbol]: {
              priceChange: data.price_change_24h,
              priceChangePercentage: data.price_change_percentage_24h,
              currentPrice: data.current_price,
            },
          };
        },
        {},
      );

      priceChangesData = { ...tokensData };

      this.storageService.saveUnencrypted<TokensPriceChangeData>(
        `${TOKENS_PRICE_DATA}-${selectedCurrency}`,
        {
          priceChanges: tokensData,
          lastUpdatedAt: Date.now(),
          currency: selectedCurrency,
        },
      );
    }
    return priceChangesData;
  };

  async loadBalanceFromCache() {
    if (this.lockService.locked) {
      return;
    }

    return this.storageService.load<CachedBalancesInfo>(BALANCES_CACHE_KEY);
  }

  async #updateCachedBalancesInfo() {
    return this.storageService.save<CachedBalancesInfo>(BALANCES_CACHE_KEY, {
      balances: this.#balances,
    });
  }

  onLock() {
    this.#balances = {};
    this.#isBalancesCached = true;
  }

  async onUnlock() {
    // Do not set state from cache if we already have something in memory
    if (Object.keys(this.#balances).length) {
      return;
    }

    const cachedBalance = await this.loadBalanceFromCache();

    if (!cachedBalance?.balances) {
      return;
    }

    this.#balances = cachedBalance.balances;
    this.#isBalancesCached = true;

    this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
      balances: {
        tokens: this.#balances,
        nfts: this.#nfts,
      },
      isBalancesCached: true,
    } as BalancesInfo);
  }

  addListener<T = unknown>(
    event: BalanceServiceEvents,
    callback: (data: T) => void,
  ) {
    this.#eventEmitter.on(event, callback);
  }
}
