import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { DAppProviderRequest } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { buildRpcCall } from '@shared/tests/test-utils';
import { NetworkService } from '../NetworkService';
import { SettingsService } from '~/services/settings/SettingsService';
import { WalletGetNetworkStateHandler } from './wallet_getNetworkState';

// Mock the services
jest.mock('../NetworkService');
jest.mock('~/services/settings/SettingsService');

describe('background/services/network/handlers/wallet_getNetworkState.ts', () => {
  let mockNetworkService: jest.Mocked<NetworkService>;
  let mockSettingsService: jest.Mocked<SettingsService>;
  let handler: WalletGetNetworkStateHandler;

  const mockActiveNetwork = {
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    caipId: `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
    chainName: 'Avalanche C-Chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    logoUri: 'https://example.com/avalanche-logo.png',
    explorerUrl: 'https://snowtrace.io',
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    vmName: NetworkVMType.EVM,
    isTestnet: false,
  };

  const mockEthereumNetwork = {
    chainId: 1,
    caipId: 'eip155:1',
    chainName: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/key',
    logoUri: 'https://example.com/ethereum-logo.png',
    explorerUrl: 'https://etherscan.io',
    networkToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    vmName: NetworkVMType.EVM,
    isTestnet: false,
  };

  const mockBitcoinNetwork = {
    chainId: ChainId.BITCOIN,
    caipId: `bip122:${ChainId.BITCOIN}`,
    chainName: 'Bitcoin',
    rpcUrl: 'https://bitcoin.rpc.url',
    logoUri: 'https://example.com/bitcoin-logo.png',
    explorerUrl: 'https://blockstream.info',
    networkToken: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 8,
    },
    vmName: NetworkVMType.BITCOIN,
    isTestnet: false,
  };

  const mockTestnetNetwork = {
    chainId: 43113,
    caipId: 'eip155:43113',
    chainName: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    logoUri: 'https://example.com/avalanche-logo.png',
    explorerUrl: 'https://testnet.snowtrace.io',
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    vmName: NetworkVMType.EVM,
    isTestnet: true,
  };

  const mockEthereumTestnetNetwork = {
    chainId: 5,
    caipId: 'eip155:5',
    chainName: 'Ethereum Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/key',
    logoUri: 'https://example.com/ethereum-logo.png',
    explorerUrl: 'https://goerli.etherscan.io',
    networkToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    vmName: NetworkVMType.EVM,
    isTestnet: true,
  };

  const mockAllNetworks = [
    mockActiveNetwork,
    mockEthereumNetwork,
    mockBitcoinNetwork,
  ];

  const mockAllNetworksWithTestnets = [
    mockActiveNetwork,
    mockEthereumNetwork,
    mockBitcoinNetwork,
    mockTestnetNetwork,
    mockEthereumTestnetNetwork,
  ];

  const mockFavoriteNetworks = [ChainId.AVALANCHE_MAINNET_ID, 1, 123];

  const mockTokenVisibility = {
    [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {
      '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': true, // enabled token
      '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': false, // disabled token
      '0xd586e7f844cea2f87f50152665bcbc2c279d8d70': true, // enabled token
    },
    'eip155:1': {
      '0xa0b86a33e6e9c6c1b1a5edc7e3d9a83c8f2f8d': false, // disabled token
      '0x6b175474e89094c44da98b954eedeac495271d0f': true, // enabled token
    },
  };

  const getNetworkStateRequest = {
    id: '123',
    method: DAppProviderRequest.WALLET_GET_NETWORK_STATE,
  } as const;

  beforeEach(() => {
    jest.resetAllMocks();

    // Create mocked instances
    mockNetworkService = new NetworkService(
      {} as any,
      {} as any,
      {} as any,
    ) as jest.Mocked<NetworkService>;
    mockSettingsService = new SettingsService(
      {} as any,
      {} as any,
    ) as jest.Mocked<SettingsService>;

    handler = new WalletGetNetworkStateHandler(
      mockNetworkService,
      mockSettingsService,
    );
  });

  describe('handleAuthenticated', () => {
    it('returns network configuration successfully with active and favorite networks', async () => {
      // Setup mocks
      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        mockFavoriteNetworks,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        mockFavoriteNetworks,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworks.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue(
        mockTokenVisibility,
      );

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(2); // Active network + Ethereum (favorite)

      // Check Avalanche network configuration
      const avalancheNetwork = result.result.networks.find(
        (n) => n.caip2ChainId === `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
      );
      expect(avalancheNetwork).toEqual({
        caip2ChainId: `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        name: 'Avalanche C-Chain',
        logoUrl: 'https://example.com/avalanche-logo.png',
        explorerUrl: 'https://snowtrace.io',
        networkToken: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        },
        enabledTokens: [
          '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
          '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
        ],
        disabledTokens: ['0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'],
      });

      // Check Ethereum network configuration
      const ethereumNetwork = result.result.networks.find(
        (n) => n.caip2ChainId === 'eip155:1',
      );
      expect(ethereumNetwork).toEqual({
        caip2ChainId: 'eip155:1',
        rpcUrl: 'https://mainnet.infura.io/v3/key',
        name: 'Ethereum Mainnet',
        logoUrl: 'https://example.com/ethereum-logo.png',
        explorerUrl: 'https://etherscan.io',
        networkToken: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
        },
        enabledTokens: ['0x6b175474e89094c44da98b954eedeac495271d0f'],
        disabledTokens: ['0xa0b86a33e6e9c6c1b1a5edc7e3d9a83c8f2f8d'],
      });
    });

    it('includes active network even if not in favorites', async () => {
      const favoritesWithoutActive = [1]; // Only Ethereum, not Avalanche

      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        favoritesWithoutActive,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        favoritesWithoutActive,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworks.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(2); // Active network + Ethereum (favorite)

      const chainIds = result.result.networks.map((n) => n.caip2ChainId);
      expect(chainIds).toContain(`eip155:${ChainId.AVALANCHE_MAINNET_ID}`);
      expect(chainIds).toContain('eip155:1');
    });

    it('handles networks without token visibility data', async () => {
      mockNetworkService.getFavoriteNetworks.mockResolvedValue([
        ChainId.AVALANCHE_MAINNET_ID,
      ]);
      mockNetworkService.getEnabledNetworks.mockResolvedValue([
        ChainId.AVALANCHE_MAINNET_ID,
      ]);
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue({
          [ChainId.AVALANCHE_MAINNET_ID]: mockActiveNetwork,
        }),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({}); // No token visibility data

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(1);

      const network = result.result.networks[0];
      expect(network.enabledTokens).toEqual([]);
      expect(network.disabledTokens).toEqual([]);
    });

    it('handles networks with optional fields missing', async () => {
      const networkWithoutOptionalFields = {
        ...mockActiveNetwork,
        logoUri: undefined,
        explorerUrl: undefined,
      };

      mockNetworkService.getFavoriteNetworks.mockResolvedValue([
        ChainId.AVALANCHE_MAINNET_ID,
      ]);
      mockNetworkService.getEnabledNetworks.mockResolvedValue([
        ChainId.AVALANCHE_MAINNET_ID,
      ]);
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue({
          [ChainId.AVALANCHE_MAINNET_ID]: networkWithoutOptionalFields,
        }),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => networkWithoutOptionalFields),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(1);

      const network = result.result.networks[0];
      expect(network.logoUrl).toBeUndefined();
      expect(network.explorerUrl).toBeUndefined();
      expect(network.caip2ChainId).toBe(
        `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
      );
    });

    it('filters out duplicate networks when active network is also in favorites', async () => {
      const favoritesWithActive = [ChainId.AVALANCHE_MAINNET_ID, 1];

      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        favoritesWithActive,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        favoritesWithActive,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworks.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(2); // No duplicates

      const chainIds = result.result.networks.map((n) => n.caip2ChainId);
      expect(
        chainIds.filter(
          (id) => id === `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
        ),
      ).toHaveLength(1);
    });

    it('handles favorite networks that are not found in allNetworks', async () => {
      const favoritesWithMissingNetwork = [ChainId.AVALANCHE_MAINNET_ID, 999]; // 999 doesn't exist

      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        favoritesWithMissingNetwork,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        favoritesWithMissingNetwork,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue({
          [ChainId.AVALANCHE_MAINNET_ID]: mockActiveNetwork,
        }),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(1); // Only the found network
      expect(result.result.networks[0].caip2ChainId).toBe(
        `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
      );
    });

    it('returns error when no active network is available', async () => {
      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        mockFavoriteNetworks,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        mockFavoriteNetworks,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworks.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => undefined), // No active network
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue(
        mockTokenVisibility,
      );

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.error).toEqual(
        ethErrors.rpc.resourceUnavailable({
          message: 'no active network',
        }),
      );
      expect(result.result).toBeUndefined();
    });

    it('correctly filters enabled and disabled tokens', async () => {
      const tokenVisibilityWithMixedTokens = {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {
          '0xtoken1': false, // disabled (false means hidden)
          '0xtoken2': true, // enabled (true means visible)
          '0xtoken3': false, // disabled
          '0xtoken4': true, // enabled
        },
      };

      mockNetworkService.getFavoriteNetworks.mockResolvedValue([
        ChainId.AVALANCHE_MAINNET_ID,
      ]);
      mockNetworkService.getEnabledNetworks.mockResolvedValue([
        ChainId.AVALANCHE_MAINNET_ID,
      ]);
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue({
          [ChainId.AVALANCHE_MAINNET_ID]: mockActiveNetwork,
        }),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue(
        tokenVisibilityWithMixedTokens,
      );

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(1);

      const network = result.result.networks[0];
      expect(network.enabledTokens).toEqual(['0xtoken2', '0xtoken4']); // true = enabled
      expect(network.disabledTokens).toEqual(['0xtoken1', '0xtoken3']); // false = disabled
    });

    it('handles empty favorite networks array', async () => {
      mockNetworkService.getFavoriteNetworks.mockResolvedValue([]);
      mockNetworkService.getEnabledNetworks.mockResolvedValue([]);
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue({
          [ChainId.AVALANCHE_MAINNET_ID]: mockActiveNetwork,
        }),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(1); // Only active network
      expect(result.result.networks[0].caip2ChainId).toBe(
        `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
      );
    });

    it('handles empty allNetworks object', async () => {
      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        mockFavoriteNetworks,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        mockFavoriteNetworks,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue({}),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork),
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(0); // No networks found
    });

    it('filters networks based on testnet status - mainnet active network', async () => {
      const favoritesIncludingTestnets = [
        ChainId.AVALANCHE_MAINNET_ID, // mainnet
        1, // ethereum mainnet
        43113, // avalanche testnet
        5, // ethereum testnet
      ];

      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        favoritesIncludingTestnets,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        favoritesIncludingTestnets,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworksWithTestnets.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockActiveNetwork), // mainnet active
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(2); // Only mainnet networks

      const chainIds = result.result.networks.map((n) => n.caip2ChainId);
      expect(chainIds).toContain(`eip155:${ChainId.AVALANCHE_MAINNET_ID}`);
      expect(chainIds).toContain('eip155:1');
      expect(chainIds).not.toContain('eip155:43113'); // testnet excluded
      expect(chainIds).not.toContain('eip155:5'); // testnet excluded
    });

    it('filters networks based on testnet status - testnet active network', async () => {
      const favoritesIncludingMainnets = [
        ChainId.AVALANCHE_MAINNET_ID, // mainnet
        1, // ethereum mainnet
        43113, // avalanche testnet
        5, // ethereum testnet
      ];

      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        favoritesIncludingMainnets,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        favoritesIncludingMainnets,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworksWithTestnets.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockTestnetNetwork), // testnet active
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(2); // Only testnet networks

      const chainIds = result.result.networks.map((n) => n.caip2ChainId);
      expect(chainIds).toContain('eip155:43113'); // testnet active
      expect(chainIds).toContain('eip155:5'); // testnet favorite
      expect(chainIds).not.toContain(`eip155:${ChainId.AVALANCHE_MAINNET_ID}`); // mainnet excluded
      expect(chainIds).not.toContain('eip155:1'); // mainnet excluded
    });

    it('includes active testnet network even if not in favorites', async () => {
      const favoritesWithoutActiveTestnet = [5]; // Only Ethereum testnet, not Avalanche testnet

      mockNetworkService.getFavoriteNetworks.mockResolvedValue(
        favoritesWithoutActiveTestnet,
      );
      mockNetworkService.getEnabledNetworks.mockResolvedValue(
        favoritesWithoutActiveTestnet,
      );
      mockNetworkService.allNetworks = {
        promisify: jest.fn().mockResolvedValue(
          mockAllNetworksWithTestnets.reduce((acc, network) => {
            acc[network.chainId] = network;
            return acc;
          }, {} as any),
        ),
      } as any;
      Object.defineProperty(mockNetworkService, 'uiActiveNetwork', {
        get: jest.fn(() => mockTestnetNetwork), // testnet active
      });
      mockSettingsService.getTokensVisibility.mockResolvedValue({});

      const result = await handler.handleAuthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.result).toBeDefined();
      expect(result.result.networks).toHaveLength(2); // Active testnet + favorite testnet

      const chainIds = result.result.networks.map((n) => n.caip2ChainId);
      expect(chainIds).toContain('eip155:43113'); // active testnet
      expect(chainIds).toContain('eip155:5'); // favorite testnet
    });
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthenticated requests', async () => {
      // Setup mocks for allNetworks property
      mockNetworkService.allNetworks = {
        promisify: jest.fn(),
      } as any;

      const result = await handler.handleUnauthenticated(
        buildRpcCall(getNetworkStateRequest),
      );

      expect(result.error).toEqual(
        ethErrors.rpc.invalidRequest({
          message: 'account not connected',
        }),
      );
      expect(result.result).toBeUndefined();

      expect(mockNetworkService.getFavoriteNetworks).not.toHaveBeenCalled();
      expect(mockNetworkService.allNetworks.promisify).not.toHaveBeenCalled();
      expect(mockSettingsService.getTokensVisibility).not.toHaveBeenCalled();
    });
  });
});
