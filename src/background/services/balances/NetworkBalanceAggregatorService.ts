import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { injectAll, singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { Account, AccountsEvents } from '../accounts/models';
import { onBalanceUpdate } from './balanceEmitters/models';
import { Signal } from 'micro-signals';
import './balanceEmitters/registry';
import { Balances, TokenWithBalance } from './models';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';

@singleton()
export class NetworkBalanceAggregatorService implements OnLock, OnUnlock {
  private _balances: Balances = {};
  private _balanceUpdates = new Signal<Balances>();
  public get balanceUpdates() {
    return this._balanceUpdates.readOnly();
  }

  get balances() {
    return this._balances;
  }

  constructor(
    @injectAll('NetworkBalanceEmitter') private emitters: onBalanceUpdate[],
    private accountsService: AccountsService
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
      (accounts) => {
        this.onNetworkBalanceUpdate(accounts);
      }
    );
  }

  updateEVMBalancesForNetworks(networks: Network[], accounts: Account[]) {
    const emitter = this.emitters.find(
      (emitter) => emitter.vmType === NetworkVMType.EVM
    );
    if (!emitter) throw new Error('no subnet balance emitter found');
    this.onNetworkBalanceUpdate(accounts, networks, [emitter]);
  }

  updateBTCBalancesForNetwork(accounts: Account[]) {
    const emitter = this.emitters.find(
      (emitter) => emitter.vmType === NetworkVMType.BITCOIN
    );
    if (!emitter) throw new Error('no BTC balance emitter found');
    this.onNetworkBalanceUpdate(accounts, undefined, [emitter]);
  }

  private onNetworkBalanceUpdate(
    accounts: Account[],
    customNetworks?: Network[],
    customEmitters?: onBalanceUpdate[]
  ) {
    (customEmitters || this.emitters).forEach(async (emitter) => {
      emitter.onUpdate(
        accounts,
        this.updateBalancesAndEmit.bind(this),
        customNetworks
      );
    });
  }

  onLock() {
    this._balances = {};
  }

  onUnlock() {
    this.activate();
  }
}
