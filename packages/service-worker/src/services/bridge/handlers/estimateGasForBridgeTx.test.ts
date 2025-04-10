import Big from 'big.js';
import { Blockchain } from '@avalabs/core-bridge-sdk';

import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { serializeToJSON } from '@avalabs/core-ext-messaging/src/serialization/serialize';

import { EstimateGasForBridgeTxHandler } from './estimateGasForBridgeTx';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/bridge/handlers/estimateGasForBridgeTx', () => {
  const bridgeService = {
    estimateGas: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const asset = {};
  const amount = new Big('1.5');
  const sourceChain = Blockchain.ETHEREUM;
  const request = buildRpcCall({
    id: '123',
    method: ExtensionRequest.BRIDGE_ESTIMATE_GAS,
    params: [sourceChain, amount, asset],
  });

  it('calls .estimateGas() with passed params', async () => {
    const handler = new EstimateGasForBridgeTxHandler(bridgeService);

    await handler.handle(request);

    expect(bridgeService.estimateGas).toHaveBeenCalledWith(
      sourceChain,
      amount,
      asset,
    );
  });

  it('returns the estimated gas', async () => {
    const handler = new EstimateGasForBridgeTxHandler(bridgeService);

    bridgeService.estimateGas.mockResolvedValue(1234n);

    const { result } = await handler.handle(request);
    expect(serializeToJSON(result)).toEqual(serializeToJSON(1234n));
  });
});
