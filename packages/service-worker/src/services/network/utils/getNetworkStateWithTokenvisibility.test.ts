import { getNetworkStateWithTokenvisibility } from './getNetworkStateWithTokenvisibility';

describe('packages/service-worker/src/services/network/utils/getNetworkStateWithTokenvisibility', () => {
  let mockNetworkService: any;
  let mockSettingsService: any;

  const mainnetNetwork = {
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
    isTestnet: false,
  };

  const avalancheNetwork = {
    chainId: 43114,
    caipId: 'eip155:43114',
    chainName: 'Avalanche C-Chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    logoUri: 'https://example.com/avalanche-logo.png',
    explorerUrl: 'https://snowtrace.io',
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    isTestnet: false,
  };

  const testnetNetwork = {
    chainId: 5,
    caipId: 'eip155:5',
    chainName: 'Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/key',
    logoUri: 'https://example.com/goerli-logo.png',
    explorerUrl: 'https://goerli.etherscan.io',
    networkToken: {
      name: 'GoerliETH',
      symbol: 'gETH',
      decimals: 18,
    },
    isTestnet: true,
  };

  beforeEach(() => {
    mockNetworkService = {
      getFavoriteNetworks: jest.fn(),
      allNetworks: {
        promisify: jest.fn(),
      },
      uiActiveNetwork: mainnetNetwork,
    };
    mockSettingsService = {
      getTokensVisibility: jest.fn(),
    };
  });

  it('returns network state with enabled and disabled tokens', async () => {
    mockNetworkService.getFavoriteNetworks.mockResolvedValue([43114]);
    mockNetworkService.allNetworks.promisify.mockResolvedValue({
      1: mainnetNetwork,
      43114: avalancheNetwork,
      5: testnetNetwork,
    });
    mockNetworkService.uiActiveNetwork = mainnetNetwork;

    mockSettingsService.getTokensVisibility.mockResolvedValue({
      'eip155:1': { '0xTokenA': true, '0xTokenB': false },
      'eip155:43114': { '0xTokenC': true },
    });

    const result = await getNetworkStateWithTokenvisibility(
      mockNetworkService,
      mockSettingsService,
    );

    expect(result).toEqual([
      {
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
        enabledTokens: ['0xTokenA'],
        disabledTokens: ['0xTokenB'],
      },
      {
        caip2ChainId: 'eip155:43114',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        name: 'Avalanche C-Chain',
        logoUrl: 'https://example.com/avalanche-logo.png',
        explorerUrl: 'https://snowtrace.io',
        networkToken: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        },
        enabledTokens: ['0xTokenC'],
        disabledTokens: [],
      },
    ]);
  });

  it('filters out networks with mismatched isTestnet', async () => {
    mockNetworkService.getFavoriteNetworks.mockResolvedValue([5]);
    mockNetworkService.allNetworks.promisify.mockResolvedValue({
      1: mainnetNetwork,
      5: testnetNetwork,
    });
    mockNetworkService.uiActiveNetwork = mainnetNetwork;

    mockSettingsService.getTokensVisibility.mockResolvedValue({
      'eip155:1': { '0xTokenA': true },
      'eip155:5': { '0xTokenB': true },
    });

    const result = await getNetworkStateWithTokenvisibility(
      mockNetworkService,
      mockSettingsService,
    );

    // Only mainnetNetwork should be included, not testnetNetwork
    expect(result).toEqual([
      {
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
        enabledTokens: ['0xTokenA'],
        disabledTokens: [],
      },
    ]);
  });

  it('throws if activeNetwork is missing', async () => {
    mockNetworkService.uiActiveNetwork = undefined;
    mockNetworkService.getFavoriteNetworks.mockResolvedValue([1]);
    mockNetworkService.allNetworks.promisify.mockResolvedValue({
      1: mainnetNetwork,
    });
    mockSettingsService.getTokensVisibility.mockResolvedValue({});

    await expect(
      getNetworkStateWithTokenvisibility(
        mockNetworkService,
        mockSettingsService,
      ),
    ).rejects.toThrow('no active network');
  });

  it('returns empty enabled/disabled tokens if no visibility info', async () => {
    mockNetworkService.getFavoriteNetworks.mockResolvedValue([1]);
    mockNetworkService.allNetworks.promisify.mockResolvedValue({
      1: mainnetNetwork,
    });
    mockSettingsService.getTokensVisibility.mockResolvedValue({});

    const result = await getNetworkStateWithTokenvisibility(
      mockNetworkService,
      mockSettingsService,
    );

    expect(result).toEqual([
      {
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
        enabledTokens: [],
        disabledTokens: [],
      },
    ]);
  });

  it('deduplicates chainIds and preserves order', async () => {
    mockNetworkService.getFavoriteNetworks.mockResolvedValue([1, 43114, 1]);
    mockNetworkService.allNetworks.promisify.mockResolvedValue({
      1: mainnetNetwork,
      43114: avalancheNetwork,
    });
    mockSettingsService.getTokensVisibility.mockResolvedValue({
      'eip155:1': { '0xTokenA': true },
      'eip155:43114': { '0xTokenB': false },
    });

    const result = await getNetworkStateWithTokenvisibility(
      mockNetworkService,
      mockSettingsService,
    );

    expect(result.map((n) => n.caip2ChainId)).toEqual([
      'eip155:1',
      'eip155:43114',
    ]);
  });
});
