import { AvalancheDevnetMode, ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { NetworkService } from '../NetworkService';
import { UpdateAvalancheDevnetModeHandler } from './updateAvalancheDevnetMode';

describe('background/services/network/handlers/updateAvalancheDevnetMode.ts', () => {
  const updateAvalancheDevnetModeMock: jest.MockedFunction<
    NetworkService['updateAvalancheDevnetMode']
  > = jest.fn();

  const networkServiceMock = {
    updateAvalancheDevnetMode: updateAvalancheDevnetModeMock,
  } as unknown as NetworkService;

  const devnetMode: AvalancheDevnetMode = {
    enabled: true,
    rpcUrl: 'http://localhost:9650',
    explorerUrl: 'https://explorer.example.com',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns an error when devnet mode is not provided', async () => {
    const handler = new UpdateAvalancheDevnetModeHandler(networkServiceMock);
    const request = {
      id: 'request-id',
      method: ExtensionRequest.NETWORK_UPDATE_AVALANCHE_DEVNET_MODE as const,
      params: [undefined] as unknown as [AvalancheDevnetMode],
    };

    const result = await handler.handle(buildRpcCall(request));

    expect(updateAvalancheDevnetModeMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      ...request,
      error: 'Avalanche devnet mode not provided in params',
    });
  });

  it('updates the devnet mode via NetworkService and returns success', async () => {
    updateAvalancheDevnetModeMock.mockResolvedValueOnce(undefined);
    const handler = new UpdateAvalancheDevnetModeHandler(networkServiceMock);
    const request = {
      id: 'request-id',
      method: ExtensionRequest.NETWORK_UPDATE_AVALANCHE_DEVNET_MODE as const,
      params: [devnetMode] as [AvalancheDevnetMode],
    };

    const result = await handler.handle(buildRpcCall(request));

    expect(updateAvalancheDevnetModeMock).toHaveBeenCalledWith(devnetMode);
    expect(result).toEqual({
      ...request,
      result: 'success',
    });
  });

  it('returns an error when NetworkService throws', async () => {
    updateAvalancheDevnetModeMock.mockRejectedValueOnce(
      new Error('error comes from network service'),
    );
    const handler = new UpdateAvalancheDevnetModeHandler(networkServiceMock);
    const request = {
      id: 'request-id',
      method: ExtensionRequest.NETWORK_UPDATE_AVALANCHE_DEVNET_MODE as const,
      params: [devnetMode] as [AvalancheDevnetMode],
    };

    const result = await handler.handle(buildRpcCall(request));

    expect(updateAvalancheDevnetModeMock).toHaveBeenCalledWith(devnetMode);
    expect(result).toEqual({
      ...request,
      error: 'Error: error comes from network service',
    });
  });
});
