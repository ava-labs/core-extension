import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { BalancesInfo } from '../events/balancesUpdatedEvent';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_GET,
  BalancesInfo
>;

@injectable()
export class GetBalancesHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_GET as const;

  constructor(private networkBalancesService: BalanceAggregatorService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { balances, isBalancesCached } = this.networkBalancesService;

    return {
      ...request,
      result: {
        balances,
        isBalancesCached,
      },
    };
  };
}
