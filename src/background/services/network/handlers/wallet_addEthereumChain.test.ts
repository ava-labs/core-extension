import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { ethErrors } from 'eth-rpc-errors';
import { container } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { Action, ActionStatus } from '../../actions/models';
import { NetworkService } from '../NetworkService';
import { WalletAddEthereumChainHandler } from './wallet_addEthereumChain';

jest.mock('../NetworkService');
jest.mock('@src/utils/extensionUtils', () => ({
  openExtensionNewWindow: jest.fn(),
}));

const mockActiveNetwork: Network = {
  chainName: 'Avalanche (C-Chain)',
  chainId: 43114,
  vmName: NetworkVMType.EVM,
  subnetExplorerUriId: 'c-chain',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  networkToken: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    description: '',
    logoUri: 'token-logo.png',
  },
  logoUri: 'chain-logo.png',
  tokens: [],
  primaryColor: 'violet',
};

describe('background/services/network/handlers/wallet_addEthereumChain.ts', () => {
  let mockNetworkService: NetworkService;
  let handler: WalletAddEthereumChainHandler;
  const actionsServiceMock = {
    addAction: jest.fn(),
  };
  container.registerInstance(ActionsService, actionsServiceMock as any);

  beforeEach(() => {
    jest.resetAllMocks();

    mockNetworkService = new NetworkService({} as any, {} as any);
    (mockNetworkService.isValidRPCUrl as jest.Mock).mockReturnValue(true);
    (mockNetworkService as any).activeNetwork = { ...mockActiveNetwork };
    mockNetworkService.allNetworks = {
      promisify: () =>
        Promise.resolve({
          [mockActiveNetwork.chainId]: { ...mockActiveNetwork },
          [43113]: { ...mockActiveNetwork, id: 43113 },
        }),
    } as any;
    handler = new WalletAddEthereumChainHandler(mockNetworkService);
    (openExtensionNewWindow as jest.Mock).mockReturnValue({ id: 123 });
  });

  it('returns null when already on the same network', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa86a', // 43114
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(result).toEqual({
      ...request,
      result: null,
    });
  });

  it('opens switch network flow when network is already added', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa869', // 43113
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
        },
      ],
    };
    openExtensionNewWindow;
    const result = await handler.handleUnauthenticated(request);

    expect(openExtensionNewWindow).toHaveBeenCalledTimes(1);
    expect(openExtensionNewWindow).toHaveBeenCalledWith(
      'network/switch?id=1234',
      ''
    );
    expect(actionsServiceMock.addAction).toHaveBeenCalledTimes(1);
    expect(actionsServiceMock.addAction).toHaveBeenCalledWith({
      ...request,
      displayData: {
        chainId: 43113,
        chainName: 'Avalanche',
        vmName: NetworkVMType.EVM,
        primaryColor: 'black',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        explorerUrl: 'https://snowtrace.io/',
        logoUri: '',
        networkToken: {
          symbol: 'AVAX',
          decimals: 18,
          description: '',
          name: 'AVAX',
          logoUri: '',
        },
      },
      tabId: undefined,
      popupWindowId: 123,
    });

    expect(result).toEqual({
      ...request,
      result: DEFERRED_RESPONSE,
    });
  });

  it('returns error when rpc url missing', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: [],
          blockExplorerUrls: ['https://snowtrace.io/'],
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(openExtensionNewWindow).not.toHaveBeenCalled();
    expect(actionsServiceMock.addAction).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'RPC url missing',
      }),
    });
  });

  it('returns error when native currency missing', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(openExtensionNewWindow).not.toHaveBeenCalled();
    expect(actionsServiceMock.addAction).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Expected nativeCurrency param to be defined',
      }),
    });
  });

  it('should throw an error because of the missing name of the network', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          nativeCurrency: { symbol: 'AVAX', name: 'Avalanche', decimals: 18 },
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(openExtensionNewWindow).not.toHaveBeenCalled();
    expect(actionsServiceMock.addAction).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Network Name is required',
      }),
    });
  });

  it('should throw an error because of the missing name of the network token', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          nativeCurrency: { symbol: 'AVAX', decimals: 18 },
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(openExtensionNewWindow).not.toHaveBeenCalled();
    expect(actionsServiceMock.addAction).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Network Token Name is required',
      }),
    });
  });

  it('should throw an error because of the missing symbol of the network token', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          nativeCurrency: { name: 'Avalanche', decimals: 18 },
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(openExtensionNewWindow).not.toHaveBeenCalled();
    expect(actionsServiceMock.addAction).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Network Token Symbol is required',
      }),
    });
  });

  it('returns error when rpc url is not valid', async () => {
    (mockNetworkService.isValidRPCUrl as jest.Mock).mockReturnValue(false);

    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'ChainID does not match the rpc url',
      }),
    });

    expect(mockNetworkService.isValidRPCUrl).toHaveBeenCalledTimes(1);
    expect(mockNetworkService.isValidRPCUrl).toHaveBeenCalledWith(
      43112,
      'https://api.avax.network/ext/bc/C/rpc'
    );

    expect(openExtensionNewWindow).not.toHaveBeenCalled();
    expect(actionsServiceMock.addAction).not.toHaveBeenCalled();
  });

  it('opens approval dialog', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          iconUrls: ['logo.png'],
        },
      ],
    };
    const result = await handler.handleUnauthenticated(request);

    expect(result).toEqual({
      ...request,
      result: DEFERRED_RESPONSE,
    });

    expect(openExtensionNewWindow).toHaveBeenCalledTimes(1);
    expect(openExtensionNewWindow).toHaveBeenCalledWith(
      'networks/add-popup?id=1234',
      ''
    );
    expect(actionsServiceMock.addAction).toHaveBeenCalledTimes(1);
    expect(actionsServiceMock.addAction).toHaveBeenCalledWith({
      ...request,
      displayData: {
        chainId: 43112,
        chainName: 'Avalanche',
        vmName: NetworkVMType.EVM,
        primaryColor: 'black',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        logoUri: 'logo.png',
        explorerUrl: 'https://snowtrace.io/',
        networkToken: {
          symbol: 'AVAX',
          decimals: 18,
          description: '',
          name: 'AVAX',
          logoUri: 'logo.png',
        },
      },
      tabId: undefined,
      popupWindowId: 123,
    });
  });

  it('works for authenticated', async () => {
    const request = {
      id: 1234,
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          iconUrls: ['logo.png'],
        },
      ],
    };
    const result = await handler.handleAuthenticated(request);

    expect(result).toEqual({
      ...request,
      result: DEFERRED_RESPONSE,
    });

    expect(openExtensionNewWindow).toHaveBeenCalledTimes(1);
    expect(openExtensionNewWindow).toHaveBeenCalledWith(
      'networks/add-popup?id=1234',
      ''
    );
    expect(actionsServiceMock.addAction).toHaveBeenCalledTimes(1);
    expect(actionsServiceMock.addAction).toHaveBeenCalledWith({
      ...request,
      displayData: {
        chainId: 43112,
        chainName: 'Avalanche',
        vmName: NetworkVMType.EVM,
        primaryColor: 'black',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        logoUri: 'logo.png',
        explorerUrl: 'https://snowtrace.io/',
        networkToken: {
          symbol: 'AVAX',
          decimals: 18,
          description: '',
          name: 'AVAX',
          logoUri: 'logo.png',
        },
      },
      tabId: undefined,
      popupWindowId: 123,
    });
  });

  describe('onActionApproved', () => {
    const mockPendingAction: Action = {
      id: '1234',
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          iconUrls: ['logo.png'],
        },
      ],
      displayData: {
        chainId: 43112,
        chainName: 'Avalanche',
        vmName: NetworkVMType.EVM,
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        logoUri: 'logo.png',
        explorerUrl: 'https://snowtrace.io/',
        networkToken: {
          symbol: 'AVAX',
          decimals: 18,
          description: '',
          name: 'AVAX',
          logoUri: 'logo.png',
        },
      },
      time: 123123,
      status: ActionStatus.SUBMITTING,
      jsonrpc: '2.0',
      tabId: undefined,
    };

    it('saves custom network on approval', async () => {
      (mockNetworkService.saveCustomNetwork as jest.Mock).mockResolvedValue(
        undefined
      );

      const successHandler = jest.fn();
      const errorHandler = jest.fn();

      await handler.onActionApproved(
        mockPendingAction,
        undefined,
        successHandler,
        errorHandler
      );

      expect(mockNetworkService.setNetwork).not.toHaveBeenCalled();
      expect(mockNetworkService.saveCustomNetwork).toHaveBeenCalledTimes(1);
      expect(mockNetworkService.saveCustomNetwork).toHaveBeenCalledWith({
        ...mockPendingAction.displayData,
      });

      expect(successHandler).toHaveBeenCalledTimes(1);
      expect(successHandler).toHaveBeenCalledWith(null);
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('calls error when saving custom network fails', async () => {
      (mockNetworkService.saveCustomNetwork as jest.Mock).mockRejectedValue(
        new Error('some serious error')
      );

      const successHandler = jest.fn();
      const errorHandler = jest.fn();

      await handler.onActionApproved(
        mockPendingAction,
        undefined,
        successHandler,
        errorHandler
      );

      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(
        new Error('some serious error')
      );
      expect(successHandler).not.toHaveBeenCalled();
    });

    it('switches network if network already added', async () => {
      (mockNetworkService.setNetwork as jest.Mock).mockResolvedValue(undefined);

      const successHandler = jest.fn();
      const errorHandler = jest.fn();

      await handler.onActionApproved(
        {
          ...mockPendingAction,
          displayData: {
            ...mockPendingAction.displayData,
            chainId: 43113,
          },
        },
        undefined,
        successHandler,
        errorHandler
      );

      expect(mockNetworkService.saveCustomNetwork).not.toHaveBeenCalled();
      expect(mockNetworkService.setNetwork).toHaveBeenCalledTimes(1);
      expect(mockNetworkService.setNetwork).toHaveBeenCalledWith(43113);

      expect(successHandler).toHaveBeenCalledTimes(1);
      expect(successHandler).toHaveBeenCalledWith(null);
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('calls error when switching network fails', async () => {
      (mockNetworkService.setNetwork as jest.Mock).mockRejectedValue(
        new Error('some serious error')
      );

      const successHandler = jest.fn();
      const errorHandler = jest.fn();

      await handler.onActionApproved(
        {
          ...mockPendingAction,
          displayData: {
            ...mockPendingAction.displayData,
            chainId: 43113,
          },
        },
        undefined,
        successHandler,
        errorHandler
      );

      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(
        new Error('some serious error')
      );
      expect(successHandler).not.toHaveBeenCalled();
    });
  });
});
