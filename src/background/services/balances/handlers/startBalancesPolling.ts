import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { BalancePollingService } from '../BalancePollingService';
import { Balances, TotalBalance } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_START_POLLING,
  {
    balances: Balances;
    isBalancesCached: boolean;
    balancesLastUpdated?: number;
    totalBalance?: TotalBalance | null;
  }
>;

@injectable()
export class StartBalancesPollingHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_START_POLLING as const;

  constructor(
    private pollingService: BalancePollingService,
    private aggregatorService: BalanceAggregatorService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    if (!this.pollingService.isPollingActive) {
      const started = await this.pollingService.startPolling();

      if (!started) {
        this.pollingService.startAsSoonAsAccountIsSelected();
      }
    }

    const { balances, isBalancesCached, totalBalance, balancesLastUpdated } =
      this.aggregatorService;

    return {
      ...request,
      result: {
        balances,
        isBalancesCached,
        totalBalance,
        balancesLastUpdated,
      },
    };
  };
}
