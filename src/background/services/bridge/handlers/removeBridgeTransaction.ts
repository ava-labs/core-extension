import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
  true,
  [txHash: string]
>;

@injectable()
export class BridgeRemoveTransactionHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_TRANSACTION_REMOVE as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [txHash] = request.params || [];
    if (!txHash) return { ...request, error: 'missing txHash' };

    await this.bridgeService.removeBridgeTransaction(txHash);

    return {
      ...request,
      result: true,
    };
  };
}
