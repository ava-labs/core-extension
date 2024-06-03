import { injectable } from 'tsyringe';
import { BridgeAsset } from '@avalabs/bridge-unified';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';
import { CustomGasSettings } from '../../bridge/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_TRANSFER_ASSET,
  any,
  [
    asset: BridgeAsset,
    amount: bigint,
    targetChainId: number,
    customGasSettings?: CustomGasSettings
  ]
>;

@injectable()
export class UnifiedBridgeTransferAsset implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_TRANSFER_ASSET as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [asset, amount, targetChainId, customGasSettings] = request.params;

    try {
      const bridgeTransfer = await this.unifiedBridgeService.transfer({
        asset,
        amount,
        targetChainId,
        customGasSettings,
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
