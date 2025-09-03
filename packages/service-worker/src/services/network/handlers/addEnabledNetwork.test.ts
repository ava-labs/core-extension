import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { NetworkService } from '../NetworkService';
import { AddEnabledNetworkHandler } from './addEnabledNetwork';

jest.mock('../NetworkService');

describe('background/services/network/handlers/addEnabledNetwork.ts', () => {
  let mockNetworkService: NetworkService;
  let handler: AddEnabledNetworkHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    mockNetworkService = new NetworkService({} as any, {} as any, {} as any);
    handler = new AddEnabledNetworkHandler(mockNetworkService);
  });

  describe('handle', () => {
    it('should successfully add a new enabled network', async () => {
      const chainId = 1337;
      const expectedEnabledNetworks = [43114, 43113, chainId]; // Original networks + new one

      jest
        .spyOn(mockNetworkService, 'addEnabledNetwork')
        .mockResolvedValue(expectedEnabledNetworks);

      const request = {
        id: '1234',
        method: ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.addEnabledNetwork).toHaveBeenCalledWith(
        chainId,
      );
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });

    it('should handle adding a network that is already enabled', async () => {
      const chainId = 43114; // Already enabled network
      const expectedEnabledNetworks = [43114, 43113]; // Unchanged networks

      jest
        .spyOn(mockNetworkService, 'addEnabledNetwork')
        .mockResolvedValue(expectedEnabledNetworks);

      const request = {
        id: '1234',
        method: ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.addEnabledNetwork).toHaveBeenCalledWith(
        chainId,
      );
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });

    it('should handle adding a default enabled network', async () => {
      const chainId = 43114; // Assuming this is a default enabled network
      const expectedEnabledNetworks = [43114, 43113]; // Unchanged networks

      jest
        .spyOn(mockNetworkService, 'addEnabledNetwork')
        .mockResolvedValue(expectedEnabledNetworks);

      const request = {
        id: '1234',
        method: ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.addEnabledNetwork).toHaveBeenCalledWith(
        chainId,
      );
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });

    it('should handle network service errors gracefully', async () => {
      const chainId = 1337;
      const serviceError = new Error('Network service failed');

      jest
        .spyOn(mockNetworkService, 'addEnabledNetwork')
        .mockRejectedValue(serviceError);

      const request = {
        id: '1234',
        method: ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.addEnabledNetwork).toHaveBeenCalledWith(
        chainId,
      );
      expect(result).toEqual({
        ...request,
        error: serviceError.toString(),
      });
    });

    it('should throw error when  undefined param is provided', async () => {
      const request = {
        id: '1234',
        method: ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK,
        params: undefined,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.addEnabledNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Chain ID not provided in params',
      });
    });

    it('should handle large chain IDs', async () => {
      const chainId = Number.MAX_SAFE_INTEGER;
      const expectedEnabledNetworks = [43114, 43113, chainId];

      jest
        .spyOn(mockNetworkService, 'addEnabledNetwork')
        .mockResolvedValue(expectedEnabledNetworks);

      const request = {
        id: '1234',
        method: ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK,
        params: chainId,
      } as any;

      const result = await handler.handle(buildRpcCall(request));

      expect(mockNetworkService.addEnabledNetwork).toHaveBeenCalledWith(
        chainId,
      );
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });
  });

  describe('method property', () => {
    it('should have the correct method constant', () => {
      expect(handler.method).toBe(ExtensionRequest.NETWORK_ADD_ENABLED_NETWORK);
    });
  });
});
