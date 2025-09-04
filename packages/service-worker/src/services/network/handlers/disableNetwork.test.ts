import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { NetworkService } from '../NetworkService';
import { DisableNetworkHandler } from './disableNetwork';

jest.mock('../NetworkService');

describe('background/services/network/handlers/disableNetwork.ts', () => {
  let mockNetworkService: NetworkService;
  let handler: DisableNetworkHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    mockNetworkService = new NetworkService({} as any, {} as any, {} as any);
    handler = new DisableNetworkHandler(mockNetworkService);
  });

  describe('handle', () => {
    it('should successfully remove an enabled network', async () => {
      const chainId = 1337;
      const expectedEnabledNetworks = [43114, 43113]; // Remaining networks after removal

      jest
        .spyOn(mockNetworkService, 'disableNetwork')
        .mockResolvedValue(expectedEnabledNetworks);

      const request = {
        id: '1234',
        method: ExtensionRequest.DISABLE_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.disableNetwork).toHaveBeenCalledWith(chainId);
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });

    it('should return error when params are not provided', async () => {
      const request = {
        id: '1234',
        method: ExtensionRequest.DISABLE_NETWORK,
        params: undefined,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.disableNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Chain ID not provided in params',
      });
    });

    it('should return error when params are null', async () => {
      const request = {
        id: '1234',
        method: ExtensionRequest.DISABLE_NETWORK,
        params: null,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.disableNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Chain ID not provided in params',
      });
    });

    it('should handle network service errors gracefully', async () => {
      const chainId = 1337;
      const serviceError = new Error('Network service failed');

      jest
        .spyOn(mockNetworkService, 'disableNetwork')
        .mockRejectedValue(serviceError);

      const request = {
        id: '1234',
        method: ExtensionRequest.DISABLE_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.disableNetwork).toHaveBeenCalledWith(chainId);
      expect(result).toEqual({
        ...request,
        error: serviceError.toString(),
      });
    });

    it('should handle removing a network that is not currently enabled', async () => {
      const chainId = 9999; // Non-existent network
      const expectedEnabledNetworks = [43114, 43113]; // Unchanged networks

      jest
        .spyOn(mockNetworkService, 'disableNetwork')
        .mockResolvedValue(expectedEnabledNetworks);

      const request = {
        id: '1234',
        method: ExtensionRequest.DISABLE_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.disableNetwork).toHaveBeenCalledWith(chainId);
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });
  });

  describe('method property', () => {
    it('should have the correct method constant', () => {
      expect(handler.method).toBe(ExtensionRequest.DISABLE_NETWORK);
    });
  });
});
