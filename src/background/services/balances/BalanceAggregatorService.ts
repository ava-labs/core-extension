import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { Account } from '../accounts/models';
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

@singleton()
export class BalanceAggregatorService implements OnLock {
  #eventEmitter = new EventEmitter();
  #balances: Balances = {};
  #isBalancesCached = true;
  #balancesLastUpdated?: number;
  #totalBalance?: TotalBalance = {};

  get balances() {
    if (!Object.keys(this.#balances).length) {
      this.loadBalanceFromCache().then((cachedBalance) => {
        const account = this.#getAccount();
        if (account && cachedBalance) {
          this.#totalBalance = {
            ...this.#totalBalance,
            [account]: cachedBalance.totalBalance || 0,
          };
        }

        if (cachedBalance?.balances) {
          this.#isBalancesCached = true;
          this.balances = cachedBalance?.balances;
        }
        return cachedBalance?.balances;
      });
    }
    return this.#balances;
  }

  set balances(balances: Balances) {
    const haveChanged =
      JSON.stringify(balances) !== JSON.stringify(this.balances);

    this.#balances = balances;

    if (haveChanged) {
      !this.lockService.locked && this.saveBalancesToCache(balances);
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
    return this.accountService.activeAccount?.addressC;
  }

  constructor(
    private balancesService: BalancesService,
    private networkService: NetworkService,
    private lockService: LockService,
    private storageService: StorageService,
    private accountService: AccountsService
  ) {}

  #getAccountCacheKey() {
    if (!this.accountService.activeAccount?.addressC) {
      return null;
    }
    return `balances-service-cache-${keccak256(
      Buffer.from(this.accountService.activeAccount?.addressC)
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

        this.#isBalancesCached = false;
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

  async saveBalancesToCache(balances: Balances) {
    const account = this.#getAccount();
    const accountCacheKey = this.#getAccountCacheKey();

    if (!accountCacheKey) {
      throw new Error('There is no account to save balances');
    }
    const totalBalance = calculateTotalBalance(
      this.networkService.activeNetwork,
      this.accountService.activeAccount,
      this.networkService.favoriteNetworks,
      this.balances
    );
    if (account) {
      this.#totalBalance = {
        ...this.#totalBalance,
        [account]: totalBalance ?? 0,
      };
    }
    await this.storageService.save<CachedBalancesInfo>(accountCacheKey, {
      balances,
      totalBalance: totalBalance ?? 0,
      lastUpdated: Date.now(),
    });
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
