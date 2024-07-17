import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { BalancePollingService } from '../BalancePollingService';
import { Balances } from '../models';
import { Account } from '../../accounts/models';
import { caipToChainId } from '@src/utils/caipConversion';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_START_POLLING,
  {
    balances: Balances;
    isBalancesCached: boolean;
  },
  [account: Account, roundRobinChainIds: number[]]
>;

@injectable()
export class StartBalancesPollingHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_START_POLLING as const;

  constructor(
    private pollingService: BalancePollingService,
    private aggregatorService: BalanceAggregatorService
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    if (scope && !this.pollingService.isPollingActive) {
      const activeChainId = caipToChainId(scope);
      const [account, roundRobinChainIds] = request.params;

      this.pollingService.startPolling(
        account,
        activeChainId,
        roundRobinChainIds
      );
    }

    const { balances, isBalancesCached } = this.aggregatorService;

    return {
      ...request,
      result: {
        balances,
        isBalancesCached,
      },
    };
  };
}
