import { injectable } from 'tsyringe';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';
import { ChainAssetMap } from '@avalabs/bridge-unified';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_GET_ASSETS,
  ChainAssetMap
>;

@injectable()
export class UnifiedBridgeGetAssets implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_GET_ASSETS as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async (request) => {
    try {
      return {
        ...request,
        result: await this.unifiedBridgeService.getAssets(),
      };
    } catch (ex: any) {
      return {
        ...request,
        error: ex,
      };
    }
  };
}
