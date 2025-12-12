import { isEqual, partition, get, merge } from 'lodash';
import { container, singleton } from 'tsyringe';
import { EventEmitter } from 'events';
import * as Sentry from '@sentry/browser';
import { resolve } from '@avalabs/core-utils-sdk';
import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';

import {
  Account,
  AtomicBalances,
  BalanceAggregatorServiceErrors,
  Balances,
  BALANCES_CACHE_KEY,
  BalanceServiceEvents,
  BalancesInfo,
  CachedBalancesInfo,
  FeatureGates,
  priceChangeRefreshRate,
  PriceChangesData,
  TOKENS_PRICE_DATA,
  TokensPriceChangeData,
  TokensPriceShortData,
} from '@core/types';
import {
  caipToChainId,
  groupTokensByType,
  isFulfilled,
  watchlistTokens,
  Monitoring,
} from '@core/common';

import { OnLock, OnUnlock } from '~/runtime/lifecycleCallbacks';
import { balanceApiClient } from '~/api-clients';
import {
  Currency,
  GetBalancesResponseError,
  postV1BalanceGetBalances,
} from '~/api-clients/balance-api';
import {
  convertStreamToArray,
  reconstructAccountFromError,
} from '~/api-clients/helpers';
import {
  convertBalanceResponsesToCacheBalanceObject,
  convertBalanceResponseToAtomicCacheBalanceObject,
  createGetBalancePayload,
} from '~/api-clients/utils';

import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { SettingsService } from '../settings/SettingsService';
import { FeatureFlagService } from '~/services/featureFlags/FeatureFlagService';
import { SecretsService } from '~/services/secrets/SecretsService';
import { AddressResolver } from '../secrets/AddressResolver';
import { AccountsService } from '~/services/accounts/AccountsService';

interface MergeWithNewSettingMissingTokenToZeroProps {
  cachedAccountBalance: {
    [p: string]: TokenWithBalance;
  };
  newAccountBalance: {
    [p: string]: TokenWithBalance;
  };
}
const mergeWithNewSettingMissingTokenToZero = ({
  cachedAccountBalance,
  newAccountBalance,
}: MergeWithNewSettingMissingTokenToZeroProps): {
  [p: string]: TokenWithBalance;
} => {
  const tempAccountBalance = newAccountBalance;
  Object.entries(cachedAccountBalance).map(([tokenAddress, tokenBalance]) => {
    // if we have the given token in the new balance, we are using that
    if (tempAccountBalance[tokenAddress]) {
      return;
    }

    // if we don't have it in the new balance but had some previously, we need to return zero for the old account
    tempAccountBalance[tokenAddress] = {
      ...tokenBalance,
      balance: 0n,
      balanceCurrencyDisplayValue: '0.00',
      balanceDisplayValue: '0',
      balanceInCurrency: 0,
      priceChanges: {},
    };
  });
  return tempAccountBalance;
};

const NFT_TYPES = [TokenType.ERC721, TokenType.ERC1155];

@singleton()
export class BalanceAggregatorService implements OnLock, OnUnlock {
  #eventEmitter = new EventEmitter();
  #balances: Balances = {};
  #atomicBalances: AtomicBalances = {};
  #nfts: Balances<NftTokenWithBalance> = {};
  #isBalancesCached = true;

  get balances() {
    return this.#balances;
  }

  get atomicBalances() {
    return this.#atomicBalances;
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
    private featureFlagService: FeatureFlagService,
    private secretsService: SecretsService,
    private addressResolver: AddressResolver,
  ) {}

  async #fetchBalances(
    chainIds: number[],
    accounts: Account[],
    tokenTypes: TokenType[],
  ): Promise<{ tokens: Balances; nfts: Balances<NftTokenWithBalance> }> {
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

    return updatedNetworks.reduce<{
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
  }

  async #getNftBalances(
    chainIds: number[],
    accounts: Account[],
    tokenTypes: TokenType[],
  ): Promise<Balances<NftTokenWithBalance>> {
    if (!tokenTypes.some((tokenType) => NFT_TYPES.includes(tokenType))) {
      return {};
    }

    const balances = await this.#fetchBalances(chainIds, accounts, tokenTypes);

    return balances.nfts;
  }

  async #fallbackOnBalanceServiceErrors(
    errors: GetBalancesResponseError[],
    tokenTypes: TokenType[],
  ): Promise<Balances> {
    if (errors.length === 0) {
      return {};
    }

    // TODO: if we need to differentiate between chains we can filter based on the networkType
    const accounts = errors.map(reconstructAccountFromError);
    const chainIds = errors.map(({ caip2Id }) => caipToChainId(caip2Id));

    try {
      const { tokens } = await this.#fetchBalances(
        Array.from(new Set(chainIds)),
        accounts,
        tokenTypes,
      );
      return tokens;
    } catch (_error) {
      return {};
    }
  }

  async #getTokenBalances({
    chainIds,
    accounts,
    tokenTypes,
    requestId,
  }: {
    chainIds: number[];
    accounts: Account[];
    tokenTypes: TokenType[];
    requestId?: string;
  }): Promise<{ tokens: Balances; atomic: AtomicBalances }> {
    if (tokenTypes.some((tokenType) => NFT_TYPES.includes(tokenType))) {
      return { tokens: {}, atomic: {} };
    }

    if (
      this.featureFlagService.featureFlags[
        FeatureGates.BALANCE_SERVICE_INTEGRATION
      ]
    ) {
      const selectedCurrency = (
        await this.settingsService.getSettings()
      ).currency.toLowerCase();
      try {
        const getBalancesRequestBody = await createGetBalancePayload({
          accounts,
          chainIds,
          currency: selectedCurrency as Currency,
          secretsService: this.secretsService,
          addressResolver: this.addressResolver,
        });

        const balanceServiceResponse = await postV1BalanceGetBalances({
          client: balanceApiClient,
          body: getBalancesRequestBody,
          onSseError: (error) => {
            throw error;
          },
        });

        const { balances: balanceServiceResponseArray, errors } =
          await convertStreamToArray(balanceServiceResponse.stream);

        const fallbackBalanceResponse =
          await this.#fallbackOnBalanceServiceErrors(errors, tokenTypes);

        const balanceObject = convertBalanceResponsesToCacheBalanceObject(
          balanceServiceResponseArray,
        );
        const atomicBalanceObject =
          convertBalanceResponseToAtomicCacheBalanceObject(
            balanceServiceResponseArray,
          );

        return {
          tokens: merge(balanceObject, fallbackBalanceResponse),
          atomic: atomicBalanceObject,
        };
      } catch (err) {
        if (requestId) {
          await this.storageService.saveToSessionStorage(
            requestId,
            BalanceAggregatorServiceErrors.ERROR_WHILE_CALLING_BALANCE__SERVICE,
          );
        }
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.BALANCES,
        );
      }
    }

    // if there was an error with querying the balance service, or the feature flag is off, we're getting balances through vm modules
    const balances = await this.#fetchBalances(chainIds, accounts, tokenTypes);

    return { tokens: balances.tokens, atomic: {} };
  }

  async getBalancesForNetworks({
    chainIds,
    accounts,
    tokenTypes,
    cacheResponse = true,
    requestId,
  }: {
    chainIds: number[];
    accounts: Account[];
    tokenTypes: TokenType[];
    cacheResponse?: boolean;
    requestId?: string;
  }): Promise<{
    tokens: Balances;
    nfts: Balances<NftTokenWithBalance>;
    atomic: AtomicBalances;
  }> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalanceAggregatorService: getBatchedUpdatedBalancesForNetworks',
    });

    const [nftTokenTypes, notNftTokenTypes] = partition(
      tokenTypes,
      (tokenType) => NFT_TYPES.includes(tokenType),
    );

    const [nfts, { tokens, atomic }] = (
      await Promise.allSettled([
        this.#getNftBalances(chainIds, accounts, nftTokenTypes),
        this.#getTokenBalances({
          chainIds,
          accounts,
          tokenTypes: notNftTokenTypes,
          requestId,
        }),
      ])
    ).map((promiseResolve) =>
      promiseResolve.status === 'rejected' ? null : promiseResolve.value,
    ) as [
      Balances<NftTokenWithBalance>,
      { tokens: Balances; atomic: AtomicBalances },
    ];

    const freshBalances = {
      nfts: (nfts ?? {}) as Balances<NftTokenWithBalance>,
      tokens: (tokens ?? {}) as Balances,
      atomic: (atomic ?? {}) as AtomicBalances,
    };

    // NFTs don't have balance = 0, if they are sent they should be removed
    // from the list, hence deep merge doesn't work
    const hasFetchedNfts = tokenTypes.some((tokenType) =>
      NFT_TYPES.includes(tokenType),
    );
    const aggregatedNfts = hasFetchedNfts
      ? {
          ...this.nfts,
          ...freshBalances.nfts,
        }
      : this.nfts;
    /*
     * {
     *   1: {
     *     0xa81e63fC485Dd1263D35d55D88422215884C6430: {
     *       ETH: {
     *        // the token properties
     *       }
     *     }
     *   }
     * }
     * */
    const hasBalanceChanges = Object.entries(freshBalances.tokens).some(
      ([chainId, networkBalances]) => {
        return Object.keys(networkBalances).some((fetchedAddress) => {
          const pathToCheck = [chainId, fetchedAddress];
          return !isEqual(
            get(this.balances, pathToCheck),
            get(freshBalances.tokens, pathToCheck),
          );
        });
      },
    );
    const hasAtomicBalanceChanges = Object.entries(freshBalances.atomic).some(
      ([chainId, balances]) => {
        return Object.keys(balances).some((fetchedAddress) => {
          const pathToCheck = [chainId, fetchedAddress];
          return !isEqual(
            get(this.atomicBalances, pathToCheck),
            get(freshBalances.atomic, pathToCheck),
          );
        });
      },
    );
    const hasNftChanges = !isEqual(aggregatedNfts, this.nfts);
    const hasChanges =
      hasBalanceChanges || hasNftChanges || hasAtomicBalanceChanges;

    const aggregatedBalances = { ...this.balances };
    if (hasBalanceChanges) {
      const freshData = Object.entries(freshBalances.tokens);
      // We don't want to merge the account's balances, but overwrite them.
      // Merging will result in wrong values when there are nested properties,
      // such as UTXOs or "balanceByType" for X/P chains.
      for (const [chainId, chainBalances] of freshData) {
        for (const [address, addressBalance] of Object.entries(chainBalances)) {
          aggregatedBalances[chainId] = {
            ...aggregatedBalances[chainId], // Keep cached balances for other accounts
            ...chainBalances,
            [address]: mergeWithNewSettingMissingTokenToZero({
              newAccountBalance: addressBalance,
              cachedAccountBalance:
                aggregatedBalances[chainId]?.[address] ?? {},
            }),
          };
        }
      }
    }

    const aggregatedAtomicBalances = { ...this.atomicBalances };
    if (hasAtomicBalanceChanges) {
      const freshData = Object.entries(freshBalances.atomic);

      for (const [chainId, chainBalances] of freshData) {
        for (const [address, addressBalance] of Object.entries(chainBalances)) {
          aggregatedAtomicBalances[chainId] = {
            ...aggregatedAtomicBalances[chainId], // Keep cached balances for other accounts
            ...chainBalances,
            [address]: { ...addressBalance },
          };
        }
      }
    }

    if (cacheResponse && hasChanges && !this.lockService.locked) {
      this.#balances = aggregatedBalances;
      this.#nfts = aggregatedNfts;
      this.#atomicBalances = aggregatedAtomicBalances;

      this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
        balances: {
          tokens: aggregatedBalances,
          nfts: aggregatedNfts,
          atomic: aggregatedAtomicBalances,
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
      atomic: aggregatedAtomicBalances,
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
      const [
        [priceChangesResult, priceChangeResultError],
        [priceResult, priceResultError],
      ] = await Promise.all([
        resolve(
          fetch(
            `${process.env.PROXY_URL}/watchlist/tokens?currency=${selectedCurrency}`,
          ),
        ),
        resolve(fetch(`${process.env.PROXY_URL}/watchlist/price`)),
      ]);

      if ((priceResultError && priceChangeResultError) || !priceChangesResult) {
        return;
      }
      const priceChanges: PriceChangesData[] = await priceChangesResult.json();
      const price = priceResult ? await priceResult.json() : {};
      const tokensData: TokensPriceShortData = priceChanges.reduce(
        (acc: TokensPriceShortData, data: PriceChangesData) => {
          return {
            ...acc,
            [data.symbol]: {
              priceChange: data.price_change_24h,
              priceChangePercentage: data.price_change_percentage_24h,
              currentPrice: watchlistTokens.includes(data.symbol.toLowerCase())
                ? (price[data.symbol] ?? data.current_price)
                : data.current_price,
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
      atomicBalances: this.#atomicBalances,
    });
  }

  onLock() {
    this.#balances = {};
    this.#atomicBalances = {};
    this.#isBalancesCached = true;
  }

  async onUnlock() {
    // Do not set state from cache if we already have something in memory
    if (Object.keys(this.#balances).length) {
      return;
    }

    if (this.featureFlagService[FeatureGates.BALANCE_SERVICE_INTEGRATION]) {
      try {
        const accountsService = container.resolve(AccountsService);
        const networkService = container.resolve(NetworkService);

        networkService.enabledNetworksUpdated.addOnce(async () => {
          const [accounts, enabledNetworks] = await Promise.all([
            accountsService.getAccounts(),
            networkService.getEnabledNetworks(),
          ]);
          this.getBalancesForNetworks({
            chainIds: enabledNetworks,
            accounts: [
              ...Object.values(accounts.primary),
              ...Object.values(accounts.imported),
            ].flat(),
            tokenTypes: Object.values(TokenType),
          });
        });
      } catch (_error) {
        /* if there was an error just continue */
      }
    }

    const cachedBalance = await this.loadBalanceFromCache();

    if (!cachedBalance?.balances) {
      return;
    }

    this.#balances = cachedBalance.balances;
    this.#atomicBalances = cachedBalance.atomicBalances ?? {};
    this.#isBalancesCached = true;

    this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
      balances: {
        tokens: this.#balances,
        nfts: this.#nfts,
        atomic: this.#atomicBalances,
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
