import { injectable } from 'tsyringe';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { TransferTrackingState } from '../types';
import { TransferTrackingService } from '../TransferTrackingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSFER_TRACKING_GET_STATE,
  TransferTrackingState
>;

@injectable()
export class TransferTrackingGetState implements HandlerType {
  method = ExtensionRequest.TRANSFER_TRACKING_GET_STATE as const;

  constructor(private trackingService: TransferTrackingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      return {
        ...request,
        result: this.trackingService.state,
      };
    } catch (ex: any) {
      return {
        ...request,
        error: ex,
      };
    }
  };
}
