import { injectable } from 'tsyringe';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { TransferTrackingState } from '../types';
import { TransferTrackingService } from '../TransferTrackingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSFER_TRACKING_CLEAR_HISTORICAL_TRANSFERS,
  TransferTrackingState
>;

@injectable()
export class ClearHistoricalTransfers implements HandlerType {
  method =
    ExtensionRequest.TRANSFER_TRACKING_CLEAR_HISTORICAL_TRANSFERS as const;

  constructor(private trackingService: TransferTrackingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      await this.trackingService.clearHistoricalTransfers();

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
