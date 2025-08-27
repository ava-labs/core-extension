import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';
import {
  Action,
  ActionStatus,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
  Network,
} from '@core/types';
import { canSkipApproval, decorateWithCaipId } from '@core/common';
import { buildRpcCall } from '@shared/tests/test-utils';
import { ethErrors } from 'eth-rpc-errors';
import { NetworkService } from '../NetworkService';
import { WalletAddEthereumChainHandler } from './wallet_addEthereumChain';

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  canSkipApproval: jest.fn(),
}));
jest.mock('../NetworkService');
jest.mock('~/runtime/openApprovalWindow');

const mockActiveNetwork: Network = {
  chainName: 'Avalanche (C-Chain)',
  chainId: 43114,
  vmName: NetworkVMType.EVM,
  subnetExplorerUriId: 'c-chain',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  explorerUrl: 'https://explorer.url',
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

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(canSkipApproval).mockResolvedValue(false);
    mockNetworkService = new NetworkService({} as any, {} as any, {} as any);
    (mockNetworkService.isValidRPCUrl as jest.Mock).mockReturnValue(true);
    jest.spyOn(mockNetworkService, 'setNetwork');
    mockNetworkService.allNetworks = {
      promisify: () =>
        Promise.resolve({
          [mockActiveNetwork.chainId]: { ...mockActiveNetwork },
          [43113]: { ...mockActiveNetwork, id: 43113 },
        }),
    } as any;
    handler = new WalletAddEthereumChainHandler(mockNetworkService);
    (openApprovalWindow as jest.Mock).mockReturnValue({ id: 123 });

    (crypto.randomUUID as jest.Mock).mockReturnValue('uuid');
  });

  it('returns null when already on the same network', async () => {
    const request = {
      id: '1234',
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
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };

    jest
      .spyOn(mockNetworkService, 'getNetwork')
      .mockResolvedValue({ chainId: 43114 } as any);

    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: null,
    });
  });

  it('opens switch network flow when network is already added', async () => {
    const request = {
      id: '1234',
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
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(openApprovalWindow).toHaveBeenCalledTimes(1);
    expect(openApprovalWindow).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1234' }),
      'network/switch',
    );

    expect(result).toEqual({
      ...request,
      result: DEFERRED_RESPONSE,
    });
  });

  it('returns error when rpc url missing', async () => {
    const request = {
      id: '1234',
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
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'RPC url missing',
      }),
    });
  });

  it('returns error when native currency missing', async () => {
    const request = {
      id: '1234',
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          chainName: 'Avalanche',
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
        },
      ],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Expected nativeCurrency param to be defined',
      }),
    });
  });

  it('should throw an error because of the missing name of the network', async () => {
    const request = {
      id: '1234',
      method: DAppProviderRequest.WALLET_ADD_CHAIN,
      params: [
        {
          chainId: '0xa868', // 43112
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io/'],
          nativeCurrency: { symbol: 'AVAX', name: 'Avalanche', decimals: 18 },
        },
      ],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Network Name is required',
      }),
    });
  });

  it('should throw an error because of the missing name of the network token', async () => {
    const request = {
      id: '1234',
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
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'Network Token Name is required',
      }),
    });
  });

  it('should throw an error because of the missing symbol of the network token', async () => {
    const request = {
      id: '1234',
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
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();

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
      id: '1234',
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
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams({
        message: 'ChainID does not match the rpc url',
      }),
    });

    expect(mockNetworkService.isValidRPCUrl).toHaveBeenCalledTimes(1);
    expect(mockNetworkService.isValidRPCUrl).toHaveBeenCalledWith(
      43112,
      'https://api.avax.network/ext/bc/C/rpc',
    );

    expect(openApprovalWindow).not.toHaveBeenCalled();
  });

  it('opens approval dialog', async () => {
    const request = {
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
      site: {
        domain: 'google.app',
        tabId: 1,
      },
    };
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: DEFERRED_RESPONSE,
    });

    expect(openApprovalWindow).toHaveBeenCalledTimes(1);
    expect(openApprovalWindow).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1234' }),
      'networks/add-popup',
    );
  });

  describe('when glacier API key is required', () => {
    it('opens the proper approval window', async () => {
      const request = {
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
            requiresGlacierApiKey: true,
          },
        ],
        site: {
          domain: 'google.app',
          tabId: 1,
        },
      };
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(openApprovalWindow).toHaveBeenCalledTimes(1);
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1234' }),
        'networks/add-popup',
      );
    });

    it('works for authenticated', async () => {
      const request = {
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
        site: {
          domain: 'google.app',
          tabId: 3,
        },
      };
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(openApprovalWindow).toHaveBeenCalledTimes(1);
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1234' }),
        'networks/add-popup',
      );
    });

    it('handles non standard isTestnet values', async () => {
      const request = {
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
            isTestnet: 'ofc',
          },
        ],
        site: {
          domain: 'google.app',
          tabId: 3,
        },
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(openApprovalWindow).toHaveBeenCalledTimes(1);
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1234' }),
        'networks/add-popup',
      );
    });

    it('does not opens approval dialog and switch to a known network if the request is from core web', async () => {
      jest.mocked(canSkipApproval).mockResolvedValue(true);

      const request = {
        id: '852',
        method: DAppProviderRequest.WALLET_ADD_CHAIN,
        params: [
          {
            chainId: '0xa869', // 43113
            chainName: 'Avalanche',
            nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
            rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
            blockExplorerUrls: ['https://snowtrace.io/'],
            iconUrls: ['logo.png'],
          },
        ],
        site: {
          domain: 'core.app',
          name: 'Core',
          tabId: 123,
        },
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: null,
      });

      expect(openApprovalWindow).not.toHaveBeenCalled();
      expect(mockNetworkService.setNetwork).toHaveBeenCalledTimes(1);
      expect(mockNetworkService.setNetwork).toHaveBeenCalledWith(
        'core.app',
        'eip155:43113',
      );
    });

    it('does not opens approval dialog and add and switch to a new network if the request is from a core domain', async () => {
      jest.mocked(canSkipApproval).mockResolvedValue(true);

      const request = {
        id: '852',
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
        site: {
          domain: 'core.app',
          name: 'Core',
          tabId: 123,
        },
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: null,
      });

      expect(openApprovalWindow).not.toHaveBeenCalled();
      expect(mockNetworkService.saveCustomNetwork).toHaveBeenCalledTimes(1);
      expect(mockNetworkService.saveCustomNetwork).toHaveBeenCalledWith({
        caipId: 'eip155:43112',
        chainId: 43112,
        chainName: 'Avalanche',
        explorerUrl: 'https://snowtrace.io/',
        isTestnet: false,
        logoUri: 'logo.png',
        networkToken: {
          decimals: 18,
          description: '',
          logoUri: 'logo.png',
          name: 'AVAX',
          symbol: 'AVAX',
        },
        primaryColor: 'black',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        vmName: 'EVM',
      });
    });

    it('adds testnet networks', async () => {
      const request = {
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
            isTestnet: true,
          },
        ],
        site: {
          domain: 'google.app',
          tabId: 3,
        },
      };
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(openApprovalWindow).toHaveBeenCalledTimes(1);
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1234' }),
        'networks/add-popup',
      );
    });

    describe('onActionApproved', () => {
      const mockPendingAction: Action = {
        id: 'uuid',
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
        tabId: undefined,
        site: {
          domain: 'core.app',
        },
        actionId: 'uuid',
        displayData: {
          network: decorateWithCaipId({
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
          }),
        },
        time: 123123,
        status: ActionStatus.SUBMITTING,
      } as any;

      describe('when glacier API key is provided', () => {
        const preppedAction = {
          ...mockPendingAction,
          displayData: {
            network: {
              ...mockPendingAction.displayData.network,
              customRpcHeaders: {
                'X-Glacier-Api-Key': 'test-1234',
              },
            },
            options: {
              requiresGlacierApiKey: true,
            },
          },
        };

        it('saves the API key header in network config overrides', async () => {
          (
            mockNetworkService.updateNetworkOverrides as jest.Mock
          ).mockResolvedValue(undefined);

          await handler.onActionApproved(
            preppedAction,
            undefined,
            () => {},
            () => {},
          );

          expect(
            mockNetworkService.updateNetworkOverrides,
          ).toHaveBeenCalledWith(
            expect.objectContaining({
              customRpcHeaders: {
                'X-Glacier-Api-Key': 'test-1234',
              },
            }),
          );

          expect(
            mockNetworkService.updateNetworkOverrides,
          ).toHaveBeenCalledWith(
            expect.not.objectContaining({
              rpcUrl: expect.any(String), // RPC is not supposed to be passed here
            }),
          );
        });
      });

      it('saves custom network on approval', async () => {
        (mockNetworkService.saveCustomNetwork as jest.Mock).mockResolvedValue(
          undefined,
        );

        const successHandler = jest.fn();
        const errorHandler = jest.fn();

        await handler.onActionApproved(
          mockPendingAction,
          undefined,
          successHandler,
          errorHandler,
        );

        expect(mockNetworkService.setNetwork).toHaveBeenCalledWith(
          mockPendingAction.site?.domain,
          mockPendingAction.displayData.network.caipId,
        );
        expect(mockNetworkService.saveCustomNetwork).toHaveBeenCalledTimes(1);
        expect(mockNetworkService.saveCustomNetwork).toHaveBeenCalledWith({
          ...mockPendingAction.displayData.network,
        });

        expect(successHandler).toHaveBeenCalledTimes(1);
        expect(successHandler).toHaveBeenCalledWith(null);
        expect(errorHandler).not.toHaveBeenCalled();
      });

      it('calls error when saving custom network fails', async () => {
        (mockNetworkService.saveCustomNetwork as jest.Mock).mockRejectedValue(
          new Error('some serious error'),
        );

        const successHandler = jest.fn();
        const errorHandler = jest.fn();

        await handler.onActionApproved(
          mockPendingAction,
          undefined,
          successHandler,
          errorHandler,
        );

        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledWith(
          new Error('some serious error'),
        );
        expect(successHandler).not.toHaveBeenCalled();
      });

      it('switches network if network already added', async () => {
        jest.mocked(mockNetworkService.setNetwork).mockResolvedValue(undefined);

        const successHandler = jest.fn();
        const errorHandler = jest.fn();

        const network = {
          ...mockPendingAction.displayData.network,
          chainId: 43113,
        };

        await handler.onActionApproved(
          {
            ...mockPendingAction,
            displayData: {
              network,
              options: {
                requiresGlacierApiKey: false,
              },
            },
          },
          undefined,
          successHandler,
          errorHandler,
        );

        expect(mockNetworkService.saveCustomNetwork).not.toHaveBeenCalled();
        expect(mockNetworkService.setNetwork).toHaveBeenCalledWith(
          mockPendingAction.site?.domain,
          network.caipId,
        );

        expect(successHandler).toHaveBeenCalledTimes(1);
        expect(successHandler).toHaveBeenCalledWith(null);
        expect(errorHandler).not.toHaveBeenCalled();
      });

      it('calls error when switching network fails', async () => {
        jest
          .mocked(mockNetworkService.setNetwork)
          .mockRejectedValue(new Error('some serious error'));

        const successHandler = jest.fn();
        const errorHandler = jest.fn();

        await handler.onActionApproved(
          {
            ...mockPendingAction,
            displayData: {
              network: {
                ...mockPendingAction.displayData.network,
                chainId: 43113,
              },
              options: {
                requiresGlacierApiKey: false,
              },
            },
          },
          undefined,
          successHandler,
          errorHandler,
        );

        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledWith(
          new Error('some serious error'),
        );
        expect(successHandler).not.toHaveBeenCalled();
      });
    });
  });
});
