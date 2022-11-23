import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { Account, AccountsEvents } from '../accounts/models';
import { Balances, BalanceServiceEvents } from './models';
import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';
import { EventEmitter } from 'events';
import _ from 'lodash';
import * as Sentry from '@sentry/browser';

@singleton()
export class BalanceAggregatorService implements OnLock {
  private eventEmitter = new EventEmitter();
  private _balances: Balances = {};

  get balances() {
    return this._balances;
  }

  private set balances(balances: Balances) {
    this._balances = balances;
    this.eventEmitter.emit(BalanceServiceEvents.UPDATED, balances);
  }

  constructor(
    private accountsService: AccountsService,
    private balancesService: BalancesService,
    private networkService: NetworkService
  ) {
    this.updateBalancesForNetworks.bind(this);

    this.accountsService.addListener<Account[]>(
      AccountsEvents.ACCOUNTS_UPDATED,
      async (accounts) => {
        const activeAccount = accounts.find((a) => a.active);
        const activeNetwork = this.networkService.activeNetwork;
        if (!activeAccount || !activeNetwork) {
          return;
        }

        this.updateBalancesForNetworks(
          [activeNetwork?.chainId, ...this.networkService.favoriteNetworks],
          [activeAccount]
        );
      }
    );
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

        // use deep merge to make sure we keep all accounts in there, even after a partial update
        this.balances = _.merge(this.balances, {
          [network.chainId]: balances,
        });
      })
    ).then(() => {
      return networks.reduce(
        (acc, network) => ({
          ...acc,
          [network.chainId]: this._balances[network.chainId],
        }),
        {}
      );
    });

    sentryTracker.finish();
    return results;
  }

  onLock() {
    this.balances = {};
  }

  addListener<T = unknown>(
    event: BalanceServiceEvents,
    callback: (data: T) => void
  ) {
    this.eventEmitter.on(event, callback);
  }
}
