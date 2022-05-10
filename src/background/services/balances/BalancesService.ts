import { EVMBalancesService } from '@src/background/services/balances/EVMBalancesService';
import {
  BITCOIN_NETWORK,
  MAINNET_NETWORK,
  NetworkTypes,
} from '@src/background/services/network/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { BTCBalancesService } from '@src/background/services/balances/BTCBalancesService';
import { singleton } from 'tsyringe';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import {
  Account,
  AccountsEvents,
} from '@src/background/services/accounts/models';
import { EventEmitter } from 'events';
import { BalanceServiceEvents } from '@src/background/services/balances/models';
import { OnLock } from '@src/background/runtime/lifecycleCallbacks';

@singleton()
export class BalancesService implements OnLock {
  private _balances = new Map<string, any>();
  get balances() {
    return Object.fromEntries(this._balances);
  }
  private eventEmitter = new EventEmitter();

  constructor(
    private evmBalancesService: EVMBalancesService,
    private btcBalancesService: BTCBalancesService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {}

  private getBalanceServiceByProvider(provider: any) {
    const balanceService = [
      this.evmBalancesService,
      this.btcBalancesService,
    ].find((service) => {
      return !!service.getServiceForProvider(provider);
    });

    if (balanceService) return balanceService;
    throw new Error('no balances service for this provider is supported');
  }

  async getBalanceForNetwork(network: NetworkTypes, userAddress: string) {
    /**
     * At this point we need to call glacier
     *    1. check if its up and supports the current chain
     *    2. if it supports it we need to get the balances and tokens from there
     *    3. polling will be against the glacier api
     *
     * Otherwise the code below should run
     */
    const provider = this.networkService.getProviderForNetwork(network);
    const balanceService = await this.getBalanceServiceByProvider(provider);

    return balanceService.getBalances(userAddress, network);
  }

  async activate() {
    this.accountsService.addListener<Account[]>(
      AccountsEvents.ACCOUNTS_UPDATED,
      async (data) => {
        /**
         * 1. We need to normalize this data to what glacier is going to return
         * 2. we need to add polling
         *  a. considering just doing a few seconds (10 secs) and just call to update all
         */
        const allBTCAccounts = data.reduce(
          (acc: { btcAddress: string }[], account) => {
            return [...acc, { btcAddress: account.addressBTC }];
          },
          []
        );

        const allCChainAccounts = data.reduce(
          (acc: { cAddress: string }[], account) => {
            return [...acc, { cAddress: account.addressC }];
          },
          []
        );
        const btcBalances = await Promise.all(
          allBTCAccounts.map(async (address) => {
            const accountBalance = await this.getBalanceForNetwork(
              BITCOIN_NETWORK,
              address.btcAddress
            );
            return { ...address, balance: accountBalance };
          })
        );

        btcBalances.every((acc) => {
          this._balances.set(acc.btcAddress, acc.balance);
        });

        const cChainBalances = await Promise.all(
          allCChainAccounts.map(async (address) => {
            const accountBalance = await this.getBalanceForNetwork(
              MAINNET_NETWORK,
              address.cAddress
            );
            return { ...address, balance: accountBalance };
          })
        );

        cChainBalances.every((acc) => {
          this._balances.set(acc.cAddress, acc.balance);
        });

        this.eventEmitter.emit(BalanceServiceEvents.updated, this.balances);
      }
    );
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }

  onLock() {
    this._balances = new Map();
    this.eventEmitter.emit(BalanceServiceEvents.updated, this.balances);
  }
}
