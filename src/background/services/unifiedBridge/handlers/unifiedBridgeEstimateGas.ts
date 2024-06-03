import { injectable } from 'tsyringe';
import { BridgeAsset } from '@avalabs/bridge-unified';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_ESTIMATE_GAS,
  bigint,
  [asset: BridgeAsset, amount: bigint, targetChainId: number]
>;

@injectable()
export class UnifiedBridgeEstimateGas implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_ESTIMATE_GAS as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [asset, amount, targetChainId] = request.params;

    const gasLimit = await this.unifiedBridgeService.estimateGas({
      asset,
      amount,
      targetChainId,
    });

    return {
      ...request,
      result: gasLimit,
    };
  };
}
