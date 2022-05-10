import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalancesService } from '../BalancesService';

@injectable()
export class GetBalancesHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BALANCES_GET];

  constructor(private balancesService: BalancesService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.balancesService.balances,
    };
  };
}
