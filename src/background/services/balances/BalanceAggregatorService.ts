import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { Account, AccountsEvents } from '../accounts/models';
import {
  Balances,
  BalanceServiceEvents,
  BALANCES_CACHE_KEY,
  TotalBalance,
} from './models';
import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';
import { EventEmitter } from 'events';
import * as Sentry from '@sentry/browser';

import { LockService } from '../lock/LockService';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';
import { StorageService } from '../storage/StorageService';
import { CachedBalancesInfo } from './models';
import { AccountsService } from '../accounts/AccountsService';
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

  async #setBalances(
    balances: Balances,
    changedNetworks?: number[],
    fromCache = false
  ) {
    // prevent slow promise callbacks from mutating the state after lock
    if (this.lockService.locked && Object.keys(balances).length) {
      return;
    }

    this.#balances = balances;
    this.#balancesLastUpdated = Date.now();

    if (!fromCache && !this.lockService.locked) {
      await this.updateBalancesValues(balances);
    }

    const changedBalances =
      (changedNetworks ?? []).length === 0
        ? balances
        : (changedNetworks ?? []).reduce((changed, chainId) => {
            changed[chainId] = balances[chainId];
            return changed;
          }, {});

    this.#eventEmitter.emit(BalanceServiceEvents.UPDATED, {
      balances: changedBalances,
      isBalancesCached: this.#isBalancesCached,
      totalBalance: this.#totalBalance,
    });
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
              this.#setBalances(cachedBalance?.balances, undefined, true);
            }
          });
        }
      }
    );
  }

  async updateBalancesValues(balances: Balances) {
    const networksToUpdate = Object.keys(balances);

    if (!networksToUpdate.length) {
      return;
    }

    const activeNetwork = this.networkService.activeNetwork;
    const favoriteNetworks = await this.networkService.getFavoriteNetworks();
    const cachedNetworks = [
      ...(activeNetwork?.chainId ? [activeNetwork.chainId] : []),
      ...favoriteNetworks,
    ];

    const needsCacheOverwrite = cachedNetworks.some((networkId) =>
      networksToUpdate.includes(networkId.toString())
    );

    if (needsCacheOverwrite) {
      this.#isBalancesCached = false;
      await this.#setTotalBalance(balances);
    }
  }

  async updateBalancesForNetworks(
    chainIds: number[],
    accounts: Account[]
  ): Promise<void> {
    const isFirstUpdateAttempt = this.#isBalancesCached;
    const sentryTracker = Sentry.startTransaction({
      name: 'BalanceAggregatorService: updateBalancesForNetworks',
    });

    const networks = Object.values(
      await this.networkService.activeNetworks.promisify()
    ).filter((network) => chainIds.includes(network.chainId));

    await Promise.allSettled(
      networks.map(async (network) => {
        const balances = await this.balancesService.getBalancesForNetwork(
          network,
          accounts
        );

        if (
          isFirstUpdateAttempt ||
          JSON.stringify(this.balances[network.chainId]) !==
            JSON.stringify({ ...this.balances[network.chainId], ...balances })
        ) {
          await this.#setBalances(
            {
              ...this.balances,
              [network.chainId]: {
                ...this.balances[network.chainId],
                ...balances,
              },
            },
            [network.chainId]
          );
        }
      })
    );

    sentryTracker.finish();
  }

  async getBatchedUpdatedBalancesForNetworks(
    chainIds: number[],
    accounts: Account[]
  ): Promise<Balances> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalanceAggregatorService: getBatchedUpdatedBalancesForNetworks',
    });

    const networks = Object.values(
      await this.networkService.activeNetworks.promisify()
    ).filter((network) => chainIds.includes(network.chainId));

    const updatedBalancesList = await Promise.all(
      networks.map(async (network) => {
        try {
          const networkBalances =
            await this.balancesService.getBalancesForNetwork(network, accounts);

          return {
            chainId: network.chainId,
            networkBalances,
          };
        } catch {
          return null;
        }
      })
    );

    const updatedBalances = updatedBalancesList.reduce<Balances>(
      (balances, balanceOfNetwork) => {
        if (!balanceOfNetwork) {
          return balances;
        }

        const { chainId, networkBalances } = balanceOfNetwork;
        balances[chainId] = { ...balances[chainId], ...networkBalances };

        return balances;
      },
      { ...this.balances }
    );

    await this.#setBalances(updatedBalances, chainIds);

    sentryTracker.finish();
    return updatedBalances;
  }

  async loadBalanceFromCache() {
    if (this.lockService.locked || !this.accountsService.activeAccount) {
      return;
    }

    return this.storageService.load<CachedBalancesInfo>(BALANCES_CACHE_KEY);
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

    this.#updateCachedBalancesInfo();
  }

  async #updateCachedBalancesInfo() {
    return this.storageService.save<CachedBalancesInfo>(BALANCES_CACHE_KEY, {
      balances: this.#balances,
      totalBalance: this.#totalBalance,
      lastUpdated: Date.now(),
    });
  }

  onLock() {
    this.#setBalances({});
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
