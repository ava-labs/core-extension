import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { UpdateDefaultNetworkHandler } from './updateDefaultNetwork';

describe('background/services/network/handlers/updateDefaultNetwork.ts', () => {
  const isValidRPCUrlMock = jest.fn();
  const updateNetworkOverridesMock = jest.fn();
  const networkServiceMock = {
    isValidRPCUrl: isValidRPCUrlMock,
    updateNetworkOverrides: updateNetworkOverridesMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // if no network -> return error
  it('if no network, returns error', async () => {
    const handler = new UpdateDefaultNetworkHandler(networkServiceMock);
    const request = {
      method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
      params: { undefined },
    } as any;

    const result = await handler.handle(request);
    expect(networkServiceMock.updateNetworkOverrides).not.toBeCalled();
    expect(result).toEqual({
      ...request,
      error: 'Network not provided in params',
    });
  });
  // if not valid -> return error
  it('if not valid RPC URL, returns error', async () => {
    isValidRPCUrlMock.mockResolvedValueOnce(false);
    const handler = new UpdateDefaultNetworkHandler(networkServiceMock);
    const request = {
      method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
      params: { network: { rpcUrl: 'rpcUrl', chainId: 43114 } },
    } as any;

    const result = await handler.handle(request);
    expect(isValidRPCUrlMock).toBeCalledWith(43114, 'rpcUrl');
    expect(networkServiceMock.updateNetworkOverrides).not.toBeCalled();
    expect(result).toEqual({
      ...request,
      error: 'ChainID does not match the rpc url',
    });
  });

  // (update rpcUrl) if network.rpcUrl -> call networkService
  describe('update network rpcUrl', () => {
    //     -> if success -> return success
    it('update network rpcUrl with overrides -> Success', async () => {
      isValidRPCUrlMock.mockResolvedValueOnce(true);
      updateNetworkOverridesMock.mockResolvedValueOnce(undefined);
      const handler = new UpdateDefaultNetworkHandler(networkServiceMock);
      const request = {
        method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
        params: { network: { rpcUrl: 'rpcUrl', chainId: 43114 } },
      } as any;

      const result = await handler.handle(request);
      expect(isValidRPCUrlMock).toBeCalledWith(43114, 'rpcUrl');
      expect(updateNetworkOverridesMock).toBeCalledWith(request.params.network);
      expect(result).toEqual({
        ...request,
        result: 'success',
      });
    });
    //     -> if error -> return err
    it('update network rpcUrl with overrides -> Error', async () => {
      isValidRPCUrlMock.mockResolvedValueOnce(true);
      updateNetworkOverridesMock.mockRejectedValueOnce(
        new Error('error comes from network service')
      );
      const handler = new UpdateDefaultNetworkHandler(networkServiceMock);
      const request = {
        method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
        params: { network: { rpcUrl: 'rpcUrl', chainId: 43114 } },
      } as any;

      const result = await handler.handle(request);
      expect(isValidRPCUrlMock).toBeCalledWith(43114, 'rpcUrl');
      expect(result).toEqual({
        ...request,
        error: 'Error: error comes from network service',
      });
    });
  });

  // (reset rpcUrl) if network.rpcUrl === undefined -> call networkService
  describe('reset network rpcUrl', () => {
    //     -> if success -> return success
    it('reset network rpcUrl -> Success', async () => {
      isValidRPCUrlMock.mockResolvedValueOnce(true);
      updateNetworkOverridesMock.mockResolvedValueOnce(undefined);
      const handler = new UpdateDefaultNetworkHandler(networkServiceMock);
      const request = {
        method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
        params: { network: { chainId: 43114 } },
      } as any;

      const result = await handler.handle(request);
      expect(isValidRPCUrlMock).not.toBeCalled();
      expect(updateNetworkOverridesMock).toBeCalledWith(request.params.network);
      expect(result).toEqual({
        ...request,
        result: 'success',
      });
    });
    //     -> if error -> return err
    it('reset network rpcUrl -> Error', async () => {
      isValidRPCUrlMock.mockResolvedValueOnce(true);
      updateNetworkOverridesMock.mockRejectedValueOnce(
        new Error('error comes from network service')
      );
      const handler = new UpdateDefaultNetworkHandler(networkServiceMock);
      const request = {
        method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
        params: { network: { chainId: 43114 } },
      } as any;

      const result = await handler.handle(request);
      expect(isValidRPCUrlMock).not.toBeCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: error comes from network service',
      });
    });
  });
});
