import { DAppProviderRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { NetworkService } from '../NetworkService';
import { WalletEnableNetworkHandler } from './wallet_enableNetwork';

jest.mock('../NetworkService');

describe('background/services/network/handlers/wallet_enableNetwork.ts', () => {
  let mockNetworkService: jest.Mocked<NetworkService>;
  let handler: WalletEnableNetworkHandler;

  const mockNetwork = {
    chainId: 1337,
    chainName: 'Test Network',
    rpcUrl: 'https://test.network/rpc',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockNetworkService = new NetworkService(
      {} as any,
      {} as any,
      {} as any,
    ) as jest.Mocked<NetworkService>;
    handler = new WalletEnableNetworkHandler(mockNetworkService);
  });

  describe('handleAuthenticated', () => {
    it('successfully enables a network', async () => {
      const chainId = 1337;
      const expectedEnabledNetworks = [43114, 43113, chainId];

      mockNetworkService.getNetwork.mockResolvedValue(mockNetwork as any);
      mockNetworkService.enableNetwork.mockResolvedValue(
        expectedEnabledNetworks,
      );

      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: { chainId },
      } as const;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(chainId);
      expect(mockNetworkService.enableNetwork).toHaveBeenCalledWith(chainId);
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });

    it('handles enabling a network that is already enabled', async () => {
      const chainId = 43114;
      const expectedEnabledNetworks = [43114, 43113];

      mockNetworkService.getNetwork.mockResolvedValue(mockNetwork as any);
      mockNetworkService.enableNetwork.mockResolvedValue(
        expectedEnabledNetworks,
      );

      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: { chainId },
      } as const;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(chainId);
      expect(mockNetworkService.enableNetwork).toHaveBeenCalledWith(chainId);
      expect(result).toEqual({
        ...request,
        result: expectedEnabledNetworks,
      });
    });

    it('returns error when chainId is missing', async () => {
      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: {},
      } as const;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).not.toHaveBeenCalled();
      expect(mockNetworkService.enableNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Missing parameter: chainId',
      });
    });

    it('returns error when params is undefined', async () => {
      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: undefined,
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).not.toHaveBeenCalled();
      expect(mockNetworkService.enableNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Missing parameter: chainId',
      });
    });

    it('returns error when network is not found', async () => {
      const chainId = 999999;

      mockNetworkService.getNetwork.mockResolvedValue(undefined);

      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: { chainId },
      } as const;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(chainId);
      expect(mockNetworkService.enableNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: `Unknown chain id: ${chainId}`,
      });
    });

    it('handles network service errors gracefully', async () => {
      const chainId = 1337;
      const serviceError = new Error('Network service failed');

      mockNetworkService.getNetwork.mockResolvedValue(mockNetwork as any);
      mockNetworkService.enableNetwork.mockRejectedValue(serviceError);

      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: { chainId },
      } as const;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(chainId);
      expect(mockNetworkService.enableNetwork).toHaveBeenCalledWith(chainId);
      expect(result).toEqual({
        ...request,
        error: serviceError.toString(),
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthenticated requests', () => {
      const request = {
        id: '1234',
        method: DAppProviderRequest.WALLET_ENABLE_NETWORK,
        params: { chainId: 1337 },
      } as const;

      const result = handler.handleUnauthenticated(buildRpcCall(request));

      expect(mockNetworkService.getNetwork).not.toHaveBeenCalled();
      expect(mockNetworkService.enableNetwork).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Not authorized',
      });
    });
  });
});
