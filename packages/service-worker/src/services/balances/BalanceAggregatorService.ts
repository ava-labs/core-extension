import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import * as Sentry from '@sentry/browser';
import { EventEmitter } from 'events';
import { get, isEqual, merge, partition } from 'lodash';
import { container, singleton } from 'tsyringe';

import {
  caipToChainId,
  groupTokensByType,
  isFulfilled,
  isPchainNetworkId,
  isRejected,
  isXchainNetworkId,
  Monitoring,
  setErrorForRequestInSessionStorage,
} from '@core/common';
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
} from '@core/types';

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
import { OnLock, OnUnlock } from '~/runtime/lifecycleCallbacks';

import { ChainId } from '@avalabs/core-chains-sdk';
import { BalanceResponse } from '~/api-clients/types';
import { AccountsService } from '~/services/accounts/AccountsService';
import { FeatureFlagService } from '~/services/featureFlags/FeatureFlagService';
import { SecretsService } from '~/services/secrets/SecretsService';
import { LockService } from '../lock/LockService';
import { NetworkService } from '../network/NetworkService';
import { AddressResolver } from '../secrets/AddressResolver';
import { SettingsService } from '../settings/SettingsService';
import { StorageService } from '../storage/StorageService';
import { BalancesService } from './BalancesService';
import { TokenPricesService } from './TokenPricesService';

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
const NFT_SUPPORTED_CHAIN_IDS = [
  ChainId.AVALANCHE_MAINNET_ID,
  ChainId.AVALANCHE_TESTNET_ID,
  ChainId.ETHEREUM_HOMESTEAD,
  ChainId.ETHEREUM_TEST_SEPOLIA,
];

// Minimum balance threshold for X/P chain filtering (0.002 AVAX in nAVAX - 9 decimals)
const DUST_THRESHOLD = 2_000_000n;

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
    private tokenPricesService: TokenPricesService,
  ) {}

  /**
   * Filters out dust UTXOs (< 0.002 AVAX) from X and P chain balances
   */
  #filterDustUtxosFromBalances(balances: Balances): Balances {
    const filteredBalances: Balances = {};

    for (const [chainIdStr, addressBalances] of Object.entries(balances)) {
      const chainId = Number(chainIdStr);

      // Only filter X and P chains
      if (!isXchainNetworkId(chainId) && !isPchainNetworkId(chainId)) {
        filteredBalances[chainId] = addressBalances;
        continue;
      }

      filteredBalances[chainId] = {};
      for (const [address, tokens] of Object.entries(addressBalances)) {
        filteredBalances[chainId][address] = {};
        for (const [tokenKey, token] of Object.entries(tokens)) {
          if (token.balance >= DUST_THRESHOLD) {
            filteredBalances[chainId][address][tokenKey] = token;
          }
        }
      }
    }

    return filteredBalances;
  }

  async #fetchBalances(
    chainIds: number[],
    accounts: Account[],
    tokenTypes: TokenType[],
  ): Promise<{ tokens: Balances; nfts: Balances<NftTokenWithBalance> }> {
    const networks = Object.values(
      await this.networkService.activeNetworks.promisify(),
    ).filter((network) => chainIds.includes(network.chainId));

    const priceChangesData =
      await this.tokenPricesService.getPriceChangesData();

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

    const filteredChainIds = chainIds.filter((chainId) =>
      NFT_SUPPORTED_CHAIN_IDS.includes(chainId),
    );

    if (filteredChainIds.length === 0) {
      return {};
    }

    const balances = await this.#fetchBalances(
      filteredChainIds,
      accounts,
      tokenTypes,
    );

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
    const settings = await this.settingsService.getSettings();

    if (
      this.featureFlagService.featureFlags[
        FeatureGates.BALANCE_SERVICE_INTEGRATION
      ]
    ) {
      const selectedCurrency = settings.currency.toLowerCase();

      const apiErrorHandler = async (error: Error) => {
        if (requestId) {
          await setErrorForRequestInSessionStorage(
            requestId,
            BalanceAggregatorServiceErrors.ERROR_WHILE_CALLING_BALANCE__SERVICE,
          );
        }
        Monitoring.sentryCaptureException(
          error,
          Monitoring.SentryExceptionTypes.BALANCES,
        );
      };

      try {
        const getBalancesRequestBodies = await createGetBalancePayload({
          accounts,
          chainIds,
          currency: selectedCurrency as Currency,
          secretsService: this.secretsService,
          addressResolver: this.addressResolver,
          filterSmallUtxos: settings.filterSmallUtxos,
        });

        const balanceServiceResponses = await Promise.allSettled(
          getBalancesRequestBodies.map(async (getBalancesRequestBody) =>
            postV1BalanceGetBalances({
              client: balanceApiClient,
              body: getBalancesRequestBody,
              onSseError: (error) => {
                throw error;
              },
            }),
          ),
        );

        const responses = await Promise.allSettled(
          balanceServiceResponses
            .filter(isFulfilled)
            .map(async (balanceServiceResponse) => {
              return convertStreamToArray(balanceServiceResponse.value.stream);
            }),
        );

        const { errors, balances } = responses.reduce(
          (acc, response) => {
            if (isFulfilled(response)) {
              acc.balances.push(...response.value.balances);
              acc.errors.push(...response.value.errors);
            } else {
              acc.errors.push({
                balances: null,
                caip2Id: response.reason.caip2Id,
                id: Date.now().toString(),
                error:
                  typeof response.reason === 'string'
                    ? response.reason
                    : 'Network error occurred.' +
                      JSON.stringify(response.reason, null, 2),
              });
            }
            return acc;
          },
          {
            errors: [] as GetBalancesResponseError[],
            balances: [] as BalanceResponse[],
          },
        );

        balanceServiceResponses.filter(isRejected).forEach(({ reason }) => {
          apiErrorHandler(reason);
        });

        const fallbackBalanceResponse =
          await this.#fallbackOnBalanceServiceErrors(errors, tokenTypes);

        const balanceObject =
          convertBalanceResponsesToCacheBalanceObject(balances);
        const atomicBalanceObject =
          convertBalanceResponseToAtomicCacheBalanceObject(balances);

        // Apply local dust filtering to ensure consistency regardless of API behavior
        const mergedTokens = merge(balanceObject, fallbackBalanceResponse);
        const filteredTokens = settings.filterSmallUtxos
          ? this.#filterDustUtxosFromBalances(mergedTokens)
          : mergedTokens;

        return {
          tokens: filteredTokens,
          atomic: atomicBalanceObject,
        };
      } catch (err) {
        apiErrorHandler(err as Error);
      }
    }

    // if there was an error with querying the balance service, or the feature flag is off, we're getting balances through vm modules
    const balances = await this.#fetchBalances(chainIds, accounts, tokenTypes);
    const filteredTokens = settings.filterSmallUtxos
      ? this.#filterDustUtxosFromBalances(balances.tokens)
      : balances.tokens;

    return { tokens: filteredTokens, atomic: {} };
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
