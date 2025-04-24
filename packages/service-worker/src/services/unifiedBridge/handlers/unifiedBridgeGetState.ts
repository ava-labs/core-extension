import { injectable } from 'tsyringe';

import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';
import { UnifiedBridgeState } from '@core/types/src/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_GET_STATE,
  UnifiedBridgeState
>;

@injectable()
export class UnifiedBridgeGetState implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_GET_STATE as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      return {
        ...request,
        result: this.unifiedBridgeService.state,
      };
    } catch (ex: any) {
      return {
        ...request,
        error: ex,
      };
    }
  };
}
