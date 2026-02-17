import { Transfer } from '@avalabs/unified-asset-transfer';

import { ExtensionRequest } from '@core/types';

import { TrackUnifiedTransfer } from './trackUnifiedTransfer';
import { TransferTrackingService } from '../TransferTrackingService';

jest.mock('../TransferTrackingService');

describe('src/background/services/transferTracking/handlers/trackUnifiedTransfer', () => {
  const transfer = {
    id: '1234',
    status: 'source-pending',
  } as Transfer;

  it('returns the current state of the UnifiedBridgeService', async () => {
    const trackingServiceMock: Partial<TransferTrackingService> = {
      trackTransfer: jest.fn(),
      updatePendingTransfer: jest.fn(),
    };

    const handler = new TrackUnifiedTransfer(
      trackingServiceMock as TransferTrackingService,
    );

    const { result } = await handler.handle({
      request: {
        id: '123',
        method: ExtensionRequest.TRANSFER_TRACKING_TRACK_TRANSFER,
        params: [transfer] as const,
      } as const,
      scope: '',
      sessionId: 'session-id',
    });

    expect(trackingServiceMock.trackTransfer).toHaveBeenCalledWith(transfer);

    expect(result).toStrictEqual(undefined);
  });
});
