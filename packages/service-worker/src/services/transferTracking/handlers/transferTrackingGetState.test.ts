import { ExtensionRequest } from '@core/types';

import { TransferTrackingGetState } from './transferTrackingGetState';
import { SourcePendingTransfer } from '@avalabs/unified-asset-transfer';

describe('src/background/services/transferTracking/handlers/transferTrackingGetState', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.TRANSFER_TRACKING_GET_STATE,
  } as any;

  it('returns the current state of the UnifiedBridgeService', async () => {
    const state = {
      trackedTransfers: {
        '1234': {
          id: '1234',
          status: 'source-pending',
        } as SourcePendingTransfer,
      },
    };

    const handler = new TransferTrackingGetState({
      state,
    } as any);

    const { result } = await handler.handle(request);

    expect(result).toStrictEqual(state);
  });
});
