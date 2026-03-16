import { Transfer } from '@avalabs/fusion-sdk';

import { ExtensionRequest } from '@core/types';

import { TransferTrackingService } from '../TransferTrackingService';
import { MarkTransferAsRead } from './markTransferAsRead';

jest.mock('../TransferTrackingService');

describe('src/background/services/transferTracking/handlers/markTransferAsRead', () => {
  const transfer = {
    id: '1234',
    status: 'source-pending',
  } as Transfer;

  it('initiates the transfer tracking process', async () => {
    const trackingServiceMock: Partial<TransferTrackingService> = {
      trackTransfer: jest.fn(),
      updatePendingTransfer: jest.fn(),
      markTransferAsRead: jest.fn(),
    };

    const handler = new MarkTransferAsRead(
      trackingServiceMock as TransferTrackingService,
    );

    const { result } = await handler.handle({
      request: {
        id: '123',
        method: ExtensionRequest.TRANSFER_TRACKING_MARK_AS_READ,
        params: [transfer.id] as const,
      } as const,
      scope: '',
      sessionId: 'session-id',
    });

    expect(trackingServiceMock.markTransferAsRead).toHaveBeenCalledWith(
      transfer.id,
    );

    expect(result).toStrictEqual(undefined);
  });
});
