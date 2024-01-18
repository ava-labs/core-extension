import { injectable } from 'tsyringe';
import { BridgeAsset } from '@avalabs/bridge-unified';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_GET_FEE,
  bigint,
  [
    asset: BridgeAsset,
    amount: bigint,
    sourceChainId: number,
    targetChainId: number
  ]
>;

@injectable()
export class UnifiedBridgeGetFee implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_GET_FEE as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [asset, amount, sourceChainId, targetChainId] = request.params;

    const transferFee = await this.unifiedBridgeService.getFee({
      asset,
      amount,
      sourceChainId,
      targetChainId,
    });

    return {
      ...request,
      result: transferFee,
    };
  };
}
