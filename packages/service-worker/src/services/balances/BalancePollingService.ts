import { wait } from '@avalabs/core-utils-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { getExponentialBackoffDelay } from '@core/common/src/utils/exponentialBackoff';
import { Account } from '@core/types';
import { uniq } from 'lodash';
import { singleton } from 'tsyringe';
import { OnAllExtensionClosed, OnLock } from '~/runtime/lifecycleCallbacks';
import { BalanceAggregatorService } from './BalanceAggregatorService';

@singleton()
export class BalancePollingService implements OnLock, OnAllExtensionClosed {
  static readonly INTERVAL = 5000;

  #timer: NodeJS.Timeout | null = null;
  #pollingIteration = 0;
  #lastPollingStartedAt?: number;
  #isPollingActive = false;
  #failedAttempts = 0;

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
      this.#failedAttempts = 0;
    } catch {
      this.#failedAttempts += 1;
      await wait(getExponentialBackoffDelay({ attempt: this.#failedAttempts }));
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
    if (iteration === 0) {
      return networkIds;
    }
    const networkCount = networkIds.length;
    const batchSize = Math.ceil(networkCount / updatePeriod);

    const roundsWithUpdates = Math.ceil(networkCount / batchSize);
    const round = iteration % updatePeriod;

    if (round < roundsWithUpdates) {
      const startIndex = (round * batchSize) % networkCount;
      return networkIds.slice(startIndex, startIndex + batchSize);
    }

    return [];
  }
}
