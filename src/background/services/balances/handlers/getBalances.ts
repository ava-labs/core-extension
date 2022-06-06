import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkBalanceAggregatorService } from '../NetworkBalanceAggregatorService';

@injectable()
export class GetBalancesHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BALANCES_GET];

  constructor(
    private networkBalancesService: NetworkBalanceAggregatorService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.networkBalancesService.balances,
    };
  };
}
