import { injectable } from 'tsyringe';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';

import type { UnifiedBridgeService } from '../UnifiedBridgeService';
import type { UnifiedBridgeState } from '../models';

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
