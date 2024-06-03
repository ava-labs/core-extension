import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalancePollingService } from '../BalancePollingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_STOP_POLLING,
  boolean
>;

@injectable()
export class StopBalancesPollingHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_STOP_POLLING as const;

  constructor(private pollingService: BalancePollingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    this.pollingService.stopPolling();

    return {
      ...request,
      result: true,
    };
  };
}
