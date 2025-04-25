import { injectable } from 'tsyringe';
import { BridgeTransfer } from '@avalabs/bridge-unified';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { UnifiedBridgeService } from '../UnifiedBridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNIFIED_BRIDGE_TRACK_TRANSFER,
  void,
  [transfer: BridgeTransfer]
>;

@injectable()
export class UnifiedBridgeTrackTransfer implements HandlerType {
  method = ExtensionRequest.UNIFIED_BRIDGE_TRACK_TRANSFER as const;

  constructor(private unifiedBridgeService: UnifiedBridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [transfer] = request.params;

    try {
      await this.unifiedBridgeService.updatePendingTransfer(transfer);

      this.unifiedBridgeService.trackTransfer(transfer);

      return {
        ...request,
        result: undefined,
      };
    } catch (ex: any) {
      return {
        ...request,
        error: ex,
      };
    }
  };
}
