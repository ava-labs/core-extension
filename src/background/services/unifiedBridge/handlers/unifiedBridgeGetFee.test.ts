import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { serializeToJSON } from '@src/background/serialization/serialize';

import { UnifiedBridgeGetFee } from './unifiedBridgeGetFee';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/unifiedBridge/handlers/unifiedBridgeGetFee', () => {
  const unifiedBridgeService = {
    getFee: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const asset = {};
  const amount = 100n;
  const sourceChainId = 43114;
  const targetChainId = 5;
  const request = {
    id: '123',
    method: ExtensionRequest.UNIFIED_BRIDGE_GET_FEE,
    params: [asset, amount, sourceChainId, targetChainId],
  } as any;

  it('calls .getFee() with passed params', async () => {
    const handler = new UnifiedBridgeGetFee(unifiedBridgeService);

    await handler.handle(buildRpcCall(request));

    expect(unifiedBridgeService.getFee).toHaveBeenCalledWith({
      asset,
      amount,
      sourceChainId,
      targetChainId,
    });
  });

  it('returns the transfer fee', async () => {
    const handler = new UnifiedBridgeGetFee(unifiedBridgeService);

    unifiedBridgeService.getFee.mockResolvedValue(1234n);

    const { result } = await handler.handle(buildRpcCall(request));
    expect(serializeToJSON(result)).toEqual(serializeToJSON(1234n));
  });
});
