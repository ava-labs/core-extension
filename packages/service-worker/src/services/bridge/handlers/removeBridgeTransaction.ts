import { ExtensionRequestHandler } from '../../../connections/models';
import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';
import { UnifiedBridgeService } from '../../unifiedBridge/UnifiedBridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
  true,
  [txHash: string]
>;

@injectable()
export class BridgeRemoveTransactionHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_TRANSACTION_REMOVE as const;

  constructor(
    private bridgeService: BridgeService,
    private unifiedBridgeService: UnifiedBridgeService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [txHash] = request.params || [];

    if (!txHash) {
      return {
        ...request,
        error: 'missing txHash',
      };
    }

    const legacyBridgeTx =
      await this.bridgeService.bridgeState.bridgeTransactions[txHash];

    if (legacyBridgeTx) {
      await this.bridgeService.removeBridgeTransaction(txHash);
    } else {
      const { pendingTransfers: unifiedBridgeTxs } =
        this.unifiedBridgeService.state;

      if (unifiedBridgeTxs[txHash]) {
        await this.unifiedBridgeService.removeTrackedTransfer(txHash);
      }
    }

    return {
      ...request,
      result: true,
    };
  };
}
