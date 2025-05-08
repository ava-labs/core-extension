import { ExtensionRequest } from '@core/types';

import { UnifiedBridgeGetState } from './unifiedBridgeGetState';

describe('src/background/services/unifiedBridge/handlers/unifiedBridgeGetFee', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.UNIFIED_BRIDGE_GET_STATE,
  } as any;

  it('returns the current state of the UnifiedBridgeService', async () => {
    const state = {
      pendingTransfers: {
        '0x1234': {},
      },
    };

    const handler = new UnifiedBridgeGetState({
      state,
    } as any);

    const { result } = await handler.handle(request);

    expect(result).toStrictEqual(state);
  });
});
