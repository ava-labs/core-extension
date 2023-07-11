import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { Account, AccountsEvents } from '../accounts/models';
import { Balances, BalanceServiceEvents, TotalBalance } from './models';
import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';
import { EventEmitter } from 'events';
import * as Sentry from '@sentry/browser';

import { LockService } from '../lock/LockService';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';
import { StorageService } from '../storage/StorageService';
import { CachedBalancesInfo } from './models';
import { AccountsService } from '../accounts/AccountsService';
import { keccak256 } from 'ethereumjs-util';
import { getAccountKey } from '@src/utils/getAccountKey';

@singleton()
export class BalanceAggregatorService implements OnLock {
  #eventEmitter = new EventEmitter();
  #balances: Balances = {};
  #isBalancesCached = true;
  #balancesLastUpdated?: number;
  #totalBalance?: TotalBalance = {};

  get balances() {
    return this.#balances;
  }

  set balances(balances: Balances) {
    const haveChanged =
      JSON.stringify(balances) !== JSON.stringify(this.balances);

    this.#balances = balances;

    if (haveChanged) {
      if (!this.lockService.locked) {
        this.#saveBalancesToCache(balances);
      }
      if (!this.lockService.locked && !this.isBalancesCached) {
        this.#setTotalBalance(balances);
      }
      this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
        balances,
        isBalancesCached: this.#isBalancesCached,
        totalBalance: this.#totalBalance,
      });
      this.#balancesLastUpdated = Date.now();
    }
  }

  get isBalancesCached() {
    return this.#isBalancesCached;
  }

  get balancesLastUpdated() {
    return this.#balancesLastUpdated;
  }

  get totalBalance() {
    return this.#totalBalance;
  }

  #getAccount() {
    return this.accountsService.activeAccount?.addressC;
  }

  constructor(
    private balancesService: BalancesService,
    private networkService: NetworkService,
    private lockService: LockService,
    private storageService: StorageService,
    private accountsService: AccountsService
  ) {
    this.accountsService.addListener<Account | undefined>(
      AccountsEvents.ACTIVE_ACCOUNT_CHANGED,
      (activeAccount) => {
        if (!Object.keys(this.#balances).length) {
          this.#isBalancesCached = true;
          this.loadBalanceFromCache().then((cachedBalance) => {
            const account = activeAccount?.addressC;

            if (account && cachedBalance) {
              this.#totalBalance = {
                ...this.#totalBalance,
                ...cachedBalance.totalBalance,
              };
            }

            if (cachedBalance?.balances) {
              this.balances = cachedBalance?.balances;
            }
          });
        }
      }
    );
  }

  async updateBalancesValues(balances: Balances) {
    const loadedNetworks = Object.keys(balances);

    const favoriteNetworks = await this.networkService.getFavoriteNetworks();

    const isLoaded =
      favoriteNetworks.length === 0 ||
      favoriteNetworks.some((networkId) =>
        loadedNetworks.includes(networkId.toString())
      );

    if (isLoaded) {
      this.#isBalancesCached = false;
      await this.#setTotalBalance(balances);
    }
  }

  #getAccountCacheKey() {
    if (!this.accountsService.activeAccount?.addressC) {
      return null;
    }
    return `balances-service-cache-${keccak256(
      Buffer.from(this.accountsService.activeAccount?.addressC)
    )}`;
  }

  async updateBalancesForNetworks(
    chainIds: number[],
    accounts: Account[]
  ): Promise<Balances> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalanceAggregatorService: updateBalancesForNetworks',
    });

    const networks = Object.values(
      await this.networkService.activeNetworks.promisify()
    ).filter((network) => chainIds.includes(network.chainId));

    const results = await Promise.allSettled(
      networks.map(async (network) => {
        const balances = await this.balancesService.getBalancesForNetwork(
          network,
          accounts
        );
        this.balances = {
          ...this.balances,
          [network.chainId]: {
            ...this.balances[network.chainId],
            ...balances,
          },
        };
      })
    ).then(() => {
      return networks.reduce(
        (acc, network) => ({
          ...acc,
          [network.chainId]: this.balances[network.chainId],
        }),
        {}
      );
    });
    if (this.#isBalancesCached) {
      this.updateBalancesValues(results);
    }
    sentryTracker.finish();
    return results;
  }

  async loadBalanceFromCache() {
    if (this.lockService.locked) {
      return;
    }
    const accountCacheKey = this.#getAccountCacheKey();

    if (!accountCacheKey) {
      throw new Error('There is no account to get balances');
    }
    const balance = await this.storageService.load<CachedBalancesInfo>(
      accountCacheKey
    );

    return balance;
  }

  async #saveBalancesToCache(balances: Balances) {
    const accountCacheKey = this.#getAccountCacheKey();

    if (!accountCacheKey) {
      throw new Error('There is no account to save balances');
    }

    await this.storageService.save<CachedBalancesInfo>(accountCacheKey, {
      balances,
      totalBalance: this.#totalBalance,
      lastUpdated: Date.now(),
    });
  }

  async #setTotalBalance(balances: Balances) {
    const account = this.#getAccount();
    if (!account) {
      throw new Error('There is no account to save total balances');
    }
    const accountKey = getAccountKey({
      address: account,
      isTestnet: this.networkService.activeNetwork?.isTestnet,
    });
    const favoriteNetworks = await this.networkService.getFavoriteNetworks();
    const totalBalance = {
      [accountKey]: calculateTotalBalance(
        this.networkService.activeNetwork,
        this.accountsService.activeAccount,
        favoriteNetworks,
        balances
      ),
    };
    this.#totalBalance = {
      ...this.#totalBalance,
      ...totalBalance,
    };
    this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
      balances: this.#balances,
      isBalancesCached: this.#isBalancesCached,
      totalBalance,
    });
    this.saveTotalBalanceToCache();
  }

  async saveTotalBalanceToCache() {
    const accountCacheKey = this.#getAccountCacheKey();
    accountCacheKey &&
      (await this.storageService.save<CachedBalancesInfo>(accountCacheKey, {
        balances: this.#balances,
        totalBalance: this.#totalBalance,
        lastUpdated: Date.now(),
      }));
  }

  onLock() {
    this.balances = {};
    this.#isBalancesCached = true;
    this.#totalBalance = undefined;
  }

  addListener<T = unknown>(
    event: BalanceServiceEvents,
    callback: (data: T) => void
  ) {
    this.#eventEmitter.on(event, callback);
  }
}
