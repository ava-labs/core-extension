import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeRemoveTransactionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_TRANSACTION_REMOVE];

  constructor(private bridgeService: BridgeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [txHash] = request.params || [];
    if (!txHash) return { ...request, error: 'missing txHash' };

    await this.bridgeService.removeBridgeTransaction(txHash);

    return {
      ...request,
      result: true,
    };
  };
}
