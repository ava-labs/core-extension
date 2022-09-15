import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { Account, AccountsEvents } from '../accounts/models';
import { Balances } from './models';
import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';

@singleton()
export class BalanceAggregatorService implements OnLock, OnUnlock {
  private _balances: Balances = {};

  get balances() {
    return this._balances;
  }

  constructor(
    private accountsService: AccountsService,
    private balancesService: BalancesService,
    private networkService: NetworkService
  ) {}

  private async activate() {
    this.accountsService.addListener<Account[]>(
      AccountsEvents.ACCOUNTS_UPDATED,
      async (accounts) => {
        this.updateBalancesForNetworks(
          Object.values(
            await this.networkService.activeNetworks.promisify()
          ).map((n) => n.chainId),
          accounts
        );
      }
    );
  }

  async updateBalancesForNetworks(
    chainIds: number[],
    accounts: Account[]
  ): Promise<Balances> {
    const networks = Object.values(
      await this.networkService.activeNetworks.promisify()
    ).filter((network) => chainIds.includes(network.chainId));

    for (const network of networks) {
      const balances = await this.balancesService.getBalancesForNetwork(
        network,
        accounts
      );

      this._balances[network.chainId] = balances;
    }
    return networks.reduce(
      (acc, network) => ({
        ...acc,
        [network.chainId]: this._balances[network.chainId],
      }),
      {}
    );
  }

  onLock() {
    this._balances = {};
  }

  onUnlock() {
    this.activate();
  }
}
