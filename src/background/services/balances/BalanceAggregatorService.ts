import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { Account, AccountsEvents } from '../accounts/models';
import { Signal } from 'micro-signals';
import { Balances, TokenWithBalance } from './models';
import { Network } from '@avalabs/chains-sdk';
import { BalancesService } from './BalancesService';
import { NetworkService } from '../network/NetworkService';

@singleton()
export class BalanceAggregatorService implements OnLock, OnUnlock {
  private _balances: Balances = {};
  private _balanceUpdates = new Signal<Balances>();
  public get balanceUpdates() {
    return this._balanceUpdates.readOnly();
  }

  get balances() {
    return this._balances;
  }

  constructor(
    private accountsService: AccountsService,
    private balancesService: BalancesService,
    private networkService: NetworkService
  ) {}

  private updateBalancesAndEmit(
    networkId: number,
    value: Record<string, TokenWithBalance[]>
  ) {
    this._balances[networkId] = value;
    this._balanceUpdates.dispatch(this._balances);
  }

  async activate() {
    this.accountsService.addListener<Account[]>(
      AccountsEvents.ACCOUNTS_UPDATED,
      async (accounts) => {
        this.updateBalancesForNetworks(
          Object.values(await this.networkService.activeNetworks.promisify()),
          accounts
        );
      }
    );
  }

  updateBalancesForNetworks(networks: Network[], accounts: Account[]) {
    networks.forEach(async (network) => {
      const balances = (
        await Promise.allSettled(
          accounts.map(async (account) => {
            return await this.balancesService.getBalanceForNetwork(
              network,
              account
            );
          })
        )
      ).reduce((acc, result) => {
        if (result.status === 'rejected') {
          return acc;
        }

        return {
          ...acc,
          [result.value.address]: result.value.balances,
        };
      }, {});
      this.updateBalancesAndEmit(network.chainId, balances);
    });
  }

  onLock() {
    this._balances = {};
  }

  onUnlock() {
    this.activate();
  }
}
