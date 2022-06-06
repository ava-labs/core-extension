import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeGetTransactionsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_TRANSACTIONS_GET];

  constructor(private bridgeService: BridgeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.bridgeService.bridgeState,
    };
  };
}
