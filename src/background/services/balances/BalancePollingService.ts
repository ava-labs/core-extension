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
  private _startAsSoonAsAccountIsSelected = false;

  get isPollingActive() {
    return this._timer !== null;
  }

  constructor(
    private balanceAggregator: BalanceAggregatorService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    this.networkService.favoriteNetworksUpdated.add(() => {
      this.restartPolling();
    });
    this.accountsService.addListener<Account | undefined>(
      AccountsEvents.ACTIVE_ACCOUNT_CHANGED,
      (activeAccount) => {
        if (!activeAccount) {
          this.stopPolling();
          return;
        }

        if (this._startAsSoonAsAccountIsSelected) {
          // It's technically possible, with some unfortunate timing, that
          // the balance polling is initiated by BalancesProvider before
          // we have an account selected. If that's the case, we should
          // make sure that we .startPolling() instead of .restartPolling()
          // as soon as AccountsService notifies us about the account selection.
          this.startPolling();
        } else {
          // Restart polling with newly activated account
          this.restartPolling();
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
    return this.pollBalances();
  }

  // This method should only be invoked by outside classes (i.e. startBalancesPolling handler).
  // Do not use it in event handlers for other services, as balance polling should only be
  // first initiated when the UI requires it, so it should never be set by the backend script itself.
  startAsSoonAsAccountIsSelected() {
    this._startAsSoonAsAccountIsSelected = true;
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

    this._startAsSoonAsAccountIsSelected = false;
  }

  // Only starts polling if it was already active.
  // Call this if you need to start a new polling process,
  // i.e. when favorite networks change.
  restartPolling() {
    if (this.isPollingActive) {
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
      this._startAsSoonAsAccountIsSelected = false;

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

      return true;
    }

    return false;
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
