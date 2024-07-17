import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { serializeToJSON } from '@src/background/serialization/serialize';

import { UnifiedBridgeEstimateGas } from './unifiedBridgeEstimateGas';
import { buildRpcCall } from '@src/tests/test-utils';
import { caipToChainId } from '@src/utils/caipConversion';

jest.mock('@src/utils/caipConversion');

describe('src/background/services/unifiedBridge/handlers/unifiedBridgeEstimateGas', () => {
  const unifiedBridgeService = {
    estimateGas: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(caipToChainId).mockReturnValue(43113);
  });

  const asset = {};
  const amount = 100n;
  const targetChainId = 5;
  const request = {
    id: '123',
    method: ExtensionRequest.UNIFIED_BRIDGE_ESTIMATE_GAS,
    params: [asset, amount, targetChainId],
  } as any;

  it('calls .estimateGas() with passed params', async () => {
    const handler = new UnifiedBridgeEstimateGas(unifiedBridgeService);

    await handler.handle(buildRpcCall(request));

    expect(unifiedBridgeService.estimateGas).toHaveBeenCalledWith({
      asset,
      amount,
      sourceChainId: 43113,
      targetChainId,
    });
  });

  it('returns the gas limit estimation', async () => {
    const handler = new UnifiedBridgeEstimateGas(unifiedBridgeService);

    unifiedBridgeService.estimateGas.mockResolvedValue(1234n);

    const { result } = await handler.handle(buildRpcCall(request));
    expect(serializeToJSON(result)).toEqual(serializeToJSON(1234n));
  });
});
