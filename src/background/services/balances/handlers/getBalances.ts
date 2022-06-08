import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalanceAggregatorService } from '../BalanceAggregatorService';

@injectable()
export class GetBalancesHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BALANCES_GET];

  constructor(private networkBalancesService: BalanceAggregatorService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.networkBalancesService.balances,
    };
  };
}
