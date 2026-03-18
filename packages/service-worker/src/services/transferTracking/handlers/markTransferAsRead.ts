import { injectable } from 'tsyringe';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { TransferTrackingService } from '../TransferTrackingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSFER_TRACKING_MARK_AS_READ,
  void,
  [transferId: string]
>;

@injectable()
export class MarkTransferAsRead implements HandlerType {
  method = ExtensionRequest.TRANSFER_TRACKING_MARK_AS_READ as const;

  constructor(private trackingService: TransferTrackingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [transferId] = request.params;

    try {
      await this.trackingService.markTransferAsRead(transferId);

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
