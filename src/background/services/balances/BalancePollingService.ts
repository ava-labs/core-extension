import { uniq, isNumber } from 'lodash';
import {
  OnAllExtensionClosed,
  OnLock,
} from '@src/background/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { Account, AccountsEvents } from '../accounts/models';
import { NetworkService } from '../network/NetworkService';
import { AccountsService } from '../accounts/AccountsService';
import { BalanceAggregatorService } from './BalanceAggregatorService';

@singleton()
export class BalancePollingService implements OnLock, OnAllExtensionClosed {
  static readonly INTERVAL = 2000;
  private _timer: NodeJS.Timeout | null = null;
  private _pollingIteration = 0;
  private _requestInProgress = false;
  private _preventSchedulingNextUpdate = false;

  get isPollingActive() {
    return this._timer !== null;
  }

  constructor(
    private balanceAggregator: BalanceAggregatorService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    this.networkService.favoriteNetworksUpdated.add(() => {
      this.startPolling();
    });
    this.accountsService.addListener<Account | undefined>(
      AccountsEvents.ACTIVE_ACCOUNT_CHANGED,
      (activeAccount) => {
        if (activeAccount) {
          // Restart polling with newly activated account
          this.restartPolling();
        } else {
          this.stopPolling();
        }
      }
    );
  }

  onLock() {
    this.stopPolling();
  }

  async startPolling() {
    // Stop any polling that may be occurring already
    this.stopPolling();
    // Start a new interval
    this._preventSchedulingNextUpdate = false;
    await this.pollBalances();
  }

  onAllExtensionsClosed() {
    this.stopPolling();
  }

  stopPolling() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
      this._pollingIteration = 0;
    }

    if (this._requestInProgress) {
      this._preventSchedulingNextUpdate = true;
    }
  }

  // Only starts polling if it was already active.
  // Call this if you need to start a new polling process,
  // i.e. when favorite networks change.
  private restartPolling() {
    if (this._timer !== null) {
      this.startPolling();
    }
  }

  private async pollBalances() {
    const { activeNetwork, favoriteNetworks } = this.networkService;
    const chainIds = uniq([
      activeNetwork?.chainId,
      ...this.getNetworksToUpdate(favoriteNetworks, this._pollingIteration, 15),
    ]).filter(isNumber);

    const { activeAccount } = this.accountsService;

    if (activeAccount) {
      this._requestInProgress = true;
      try {
        await this.balanceAggregator.updateBalancesForNetworks(chainIds, [
          activeAccount,
        ]);
      } finally {
        this._requestInProgress = false;
      }

      if (!this._preventSchedulingNextUpdate) {
        this.scheduleNextUpdate();
      }
    }
  }

  private scheduleNextUpdate() {
    this._pollingIteration += 1;
    this._timer = setTimeout(
      () => this.pollBalances(),
      BalancePollingService.INTERVAL
    );
  }

  private getNetworksToUpdate(
    networkIds: number[],
    iteration: number,
    updatePeriod: number
  ) {
    // Always load all chains for the first request.
    if (iteration === 0) {
      return networkIds;
    }
    const numberOfNetworksToUpdate = Math.ceil(
      networkIds.length / updatePeriod
    );

    const roundsWithUpdates = Math.ceil(
      networkIds.length / numberOfNetworksToUpdate
    );

    if (iteration % updatePeriod < roundsWithUpdates) {
      const startIndex =
        ((iteration % updatePeriod) * numberOfNetworksToUpdate) %
        networkIds.length;

      return networkIds.slice(
        startIndex,
        startIndex + numberOfNetworksToUpdate
      );
    }

    return [];
  }
}
