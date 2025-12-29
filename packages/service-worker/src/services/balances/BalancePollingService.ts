import { uniq } from 'lodash';
import { OnAllExtensionClosed, OnLock } from '~/runtime/lifecycleCallbacks';
import { singleton } from 'tsyringe';
import { Account } from '@core/types';
import { BalanceAggregatorService } from './BalanceAggregatorService';
import { TokenType } from '@avalabs/vm-module-types';

@singleton()
export class BalancePollingService implements OnLock, OnAllExtensionClosed {
  static readonly INTERVAL = 2000;

  #timer: NodeJS.Timeout | null = null;
  #pollingIteration = 0;
  #lastPollingStartedAt?: number;
  #isPollingActive = false;

  constructor(private balanceAggregator: BalanceAggregatorService) {}

  get isPollingActive() {
    return this.#isPollingActive;
  }

  onLock() {
    this.stopPolling();
  }

  async startPolling(
    account: Account,
    activeChainId: number,
    roundRobinChainIds: number[],
    tokenTypes: TokenType[],
  ) {
    // Stop any polling that may be occurring already
    this.stopPolling();
    // Start a new interval
    this.#isPollingActive = true;
    return this.pollBalances(
      account,
      activeChainId,
      roundRobinChainIds,
      tokenTypes,
    );
  }

  onAllExtensionsClosed() {
    this.stopPolling();
  }

  stopPolling() {
    this.#isPollingActive = false;
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
      this.#pollingIteration = 0;
    }
  }

  private async pollBalances(
    account: Account,
    activeChainId: number,
    roundRobinChainIds: number[],
    tokenTypes: TokenType[],
  ) {
    const thisPollingStartedAt = performance.now();
    this.#lastPollingStartedAt = thisPollingStartedAt;

    const chainIds = uniq([
      activeChainId,
      ...this.getNetworksToUpdate(
        roundRobinChainIds,
        this.#pollingIteration,
        15,
      ),
    ]);

    try {
      await this.balanceAggregator.getBalancesForNetworks({
        chainIds,
        accounts: [account],
        tokenTypes,
      });
    } catch {
      // Do nothing, just schedule another attempt
    }

    // Only schedule the next update if another polling was not started
    // while we were waiting for balance results.
    if (
      this.#isPollingActive &&
      thisPollingStartedAt === this.#lastPollingStartedAt
    ) {
      this.scheduleNextUpdate(
        account,
        activeChainId,
        roundRobinChainIds,
        tokenTypes,
      );
    }
  }

  private scheduleNextUpdate(
    account: Account,
    activeChainId: number,
    roundRobinChainIds: number[],
    tokenTypes: TokenType[],
  ) {
    this.#pollingIteration += 1;
    this.#timer = setTimeout(
      () =>
        this.pollBalances(
          account,
          activeChainId,
          roundRobinChainIds,
          tokenTypes,
        ),
      BalancePollingService.INTERVAL,
    );
  }

  private getNetworksToUpdate(
    networkIds: number[],
    iteration: number,
    updatePeriod: number,
  ) {
    // Always load all chains for the first request.
    if (iteration === 0) {
      return networkIds;
    }
    const numberOfNetworksToUpdate = Math.ceil(
      networkIds.length / updatePeriod,
    );

    const roundsWithUpdates = Math.ceil(
      networkIds.length / numberOfNetworksToUpdate,
    );

    if (iteration % updatePeriod < roundsWithUpdates) {
      const startIndex =
        ((iteration % updatePeriod) * numberOfNetworksToUpdate) %
        networkIds.length;

      return networkIds.slice(
        startIndex,
        startIndex + numberOfNetworksToUpdate,
      );
    }

    return [];
  }
}
