import { injectable } from 'tsyringe';
import { Asset } from '@avalabs/bridge-unified';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_TRANSFER_ASSET,
  any,
  [asset: Asset, amount: bigint, targetChainId: number]
>;

@injectable()
export class UnifiedBridgeTransferAsset implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_TRANSFER_ASSET as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [asset, amount, targetChainId] = request.params;

    try {
      const bridgeTransfer = await this.unifiedBridgeService.transfer({
        asset,
        amount,
        targetChainId,
        tabId: request.tabId,
      });

      return {
        ...request,
        result: bridgeTransfer.sourceTxHash,
      };
    } catch (ex: any) {
      return {
        ...request,
        error: ex,
      };
    }
  };
}
