import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { Balances } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_GET,
  Balances
>;

@injectable()
export class GetBalancesHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_GET as const;

  constructor(private networkBalancesService: BalanceAggregatorService) {}

  handle: HandlerType['handle'] = async (request) => {
    return {
      ...request,
      result: this.networkBalancesService.balances,
    };
  };
}
