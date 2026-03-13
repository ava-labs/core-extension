import { injectable } from 'tsyringe';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { TransferTrackingService } from '../TransferTrackingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSFER_TRACKING_MARK_AS_READ,
  void,
  string[]
>;

@injectable()
export class MarkTransfersAsRead implements HandlerType {
  method = ExtensionRequest.TRANSFER_TRACKING_MARK_AS_READ as const;

  constructor(private trackingService: TransferTrackingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const transferIds = request.params;

    try {
      await this.trackingService.markTransfersAsRead(transferIds);

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
