import { injectable } from 'tsyringe';
import { Transfer } from '@avalabs/unified-asset-transfer';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { TransferTrackingService } from '../TransferTrackingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSFER_TRACKING_TRACK_TRANSFER,
  void,
  [transfer: Transfer]
>;

@injectable()
export class TrackUnifiedTransfer implements HandlerType {
  method = ExtensionRequest.TRANSFER_TRACKING_TRACK_TRANSFER as const;

  constructor(private trackingService: TransferTrackingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [transfer] = request.params;

    try {
      await this.trackingService
        .updatePendingTransfer(transfer)
        .then(() => this.trackingService.trackTransfer(transfer));

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
