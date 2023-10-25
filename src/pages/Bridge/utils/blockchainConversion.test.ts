import { ChainId, Network, NetworkVMType } from '@avalabs/chains-sdk';
import {
  blockchainToNetwork,
  networkToBlockchain,
} from './blockchainConversion';
import { Blockchain, BridgeConfig } from '@avalabs/bridge-sdk';
import { t } from 'i18next';

jest.mock('i18next', () => ({
  t: jest.fn(),
}));

describe('src/pages/Bridge/utils/blockchainConversion.ts', () => {
  const btcSymbol = 'BTC';
  const mockBTCNetwork: Network = {
    chainName: 'BTC network',
    chainId: ChainId.BITCOIN,
    vmName: NetworkVMType.BITCOIN,
    rpcUrl: 'https://www.test.com/',
    networkToken: {
      name: 'test',
      symbol: btcSymbol,
      description: 'btc mock',
      decimals: 5,
      logoUri: 'https://www.test.com/token/logo',
    },
    logoUri: 'https://www.test.com/network/logo',
  };
  const mockBTCTestnetNetwork: Network = {
    chainName: 'BTC testnet',
    chainId: ChainId.BITCOIN_TESTNET,
    vmName: NetworkVMType.BITCOIN,
    rpcUrl: 'https://www.test1.com/',
    networkToken: {
      name: 'test',
      symbol: btcSymbol,
      description: 'btc testnet mock',
      decimals: 6,
      logoUri: 'https://www.test1.com/token/logo',
    },
    logoUri: 'https://www.test1.com/network/logo',
  };

  const mockAvalancheNetwork: Network = {
    chainName: 'Avalanche',
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://www.test2.com/',
    networkToken: {
      name: 'test',
      symbol: 'AVAX',
      description: 'Avalanche mock',
      decimals: 7,
      logoUri: 'https://www.test2.com/token/logo',
    },
    logoUri: 'https://www.test2.com/network/logo',
  };

  const mockEthereumNetwork: Network = {
    chainName: 'Ethereum',
    chainId: ChainId.ETHEREUM_HOMESTEAD,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://www.test3.com/',
    networkToken: {
      name: 'test',
      symbol: 'ETH',
      description: 'Ethereum mock',
      decimals: 8,
      logoUri: 'https://www.test3.com/token/logo',
    },
    logoUri: 'https://www.test3.com/network/logo',
  };
  const mockedNetworks = [
    mockBTCNetwork,
    mockBTCTestnetNetwork,
    mockAvalancheNetwork,
    mockEthereumNetwork,
  ];

  const bridgeConfigMock: BridgeConfig = {
    config: {
      critical: {
        networks: {
          [Blockchain.AVALANCHE]: ChainId.AVALANCHE_MAINNET_ID,
          [Blockchain.ETHEREUM]: ChainId.ETHEREUM_HOMESTEAD,
        },
        assets: {},
        walletAddresses: {
          avalanche: 'testWalletAddress',
          ethereum: 'testWalletAddress2',
        },
        addressBlocklist: [],
        disableFrontend: false,
        operationMode: 'normal',
        operatorAddress: 'operatorAddress',
        operatorEvmAddress: 'operatorEvmAddress',
      },
      nonCritical: {
        unwrapFeeApproximation: {},
        wrapFeeApproximation: {},
        minimumConfirmations: {},
        currentEthPrice: '325000000000',
        currentAvaxPrice: '4000000000',
        currentGasPrices: {
          avalanche: {
            nextBaseFee: '28125000000',
            suggestedTip: '2000000000',
          },
          ethereum: {
            nextBaseFee: '10',
            suggestedTip: '7000000917',
          },
        },
        updated: '2023-09-06 17:38:09.209137826 +0000 UTC m=+703815.679116735',
        startupTime: '2023-08-29 14:07:53.598356223 +0000 UTC m=+0.068335132',
      },
      criticalBitcoin: {
        bitcoinAssets: {},
        useNewFeeStructure: true,
        addressBlocklist: [],
        avalancheChainId: ChainId.AVALANCHE_MAINNET_ID,
        useEip1559TransactionFormat: true,
        walletAddresses: {
          avalanche: 'testWalletAddress',
          btc: 'testWalletAddressBTC',
        },
        disableFrontend: false,
        operationMode: 'normal',
        operatorAddress: 'operatorAddressBtc',
        operatorEvmAddress: 'operatorEvmAddressBtc',
        offboardDelaySeconds: 1,
      },
      nonCriticalBitcoin: {
        networkInfo: {
          btc: {
            currentBridgeFeeEstimate: {
              dustThreshold: 100,
              wrapFeeEstimate: {
                minimumFeeAmount: '200',
                maximumFeeAmount: '300',
                feePercentage: 1,
                feePercentageDecimals: 0,
              },
              unwrapFeeEstimate: {
                bridgeToll: {
                  minimumFeeAmount: '400',
                  maximumFeeAmount: '500',
                  feePercentage: 2,
                  feePercentageDecimals: 1,
                },
                estimatedTxFee: {
                  constAmount: 600,
                  numeratorPerSat: 700,
                  denominatorPerSat: 800,
                },
              },
            },
            minimumConfirmations: 5,
            minimumOnboardSize: 900,
            currentPrice: '1000',
            currentFeeRate: {
              feeRate: 10,
              source: 'smartFeeEstimate',
            },
            currentUtxoStatistics: {
              btcAddress: {
                mean: '10183577',
                count: '11',
              },
            },
            reserveBalance: 1100,
            networkView: {
              lastIndexedBlock: 2476631,
              lastSeenBlock: 2476634,
              nodeVersion: '/Satoshi:25.0.0/',
            },
          },
        },
        updated: '2023-09-06 17:38:09.212574949 +0000 UTC m=+703815.682553868',
      },
      startupTime: '2023-08-29 14:07:53.598356223 +0000 UTC m=+0.068335132',
      version: 'v0.2.67',
    },
  };
  beforeEach(() => {
    jest.resetAllMocks();
    (t as jest.Mock).mockImplementation((a) => a);
  });

  describe('blockchainToNetwork', () => {
    it('returns Avalanche network when blockchain is avalanche', () => {
      const result = blockchainToNetwork(
        Blockchain.AVALANCHE,
        mockedNetworks,
        bridgeConfigMock
      );

      expect(result).toEqual(mockAvalancheNetwork);
    });

    it('returns Ethereum network when blockchain is ethereum', () => {
      const result = blockchainToNetwork(
        Blockchain.ETHEREUM,
        mockedNetworks,
        bridgeConfigMock
      );

      expect(result).toEqual(mockEthereumNetwork);
    });

    it('returns Mainnet Bitcoin network when blockchain is bitcoin and isTestnet is false', () => {
      const result = blockchainToNetwork(
        Blockchain.BITCOIN,
        mockedNetworks,
        bridgeConfigMock,
        false
      );

      expect(result).toEqual(mockBTCNetwork);
    });

    it('returns testnet Bitcoin network when blockchain is bitcoin and isTestnet is true', () => {
      const result = blockchainToNetwork(
        Blockchain.BITCOIN,
        mockedNetworks,
        bridgeConfigMock,
        true
      );

      expect(result).toEqual(mockBTCTestnetNetwork);
    });

    it('returns the first Bitcoin network found when blockchain is bitcoin and isTestnet is undefined', () => {
      const result = blockchainToNetwork(
        Blockchain.BITCOIN,
        mockedNetworks,
        bridgeConfigMock
      );

      expect(result).toEqual(mockBTCNetwork);
    });

    it('should throw an error when unknown blockchain is used', () => {
      expect(() =>
        blockchainToNetwork(
          Blockchain.UNKNOWN,
          mockedNetworks,
          bridgeConfigMock
        )
      ).toThrowError('Blockchain not supported');
    });
  });

  describe('blockchainToNetwork', () => {
    const baseNetwork = {
      chainName: 'chainName',
      chainId: ChainId.AVALANCHE_MAINNET_ID,
      vmName: NetworkVMType.EVM,
      rpcUrl: 'https://www.test10.com/',
      networkToken: {
        name: 'test',
        symbol: 'AVAX',
        description: 'test network token',
        decimals: 6,
        logoUri: 'https://www.test10.com/token/logo',
      },
      logoUri: 'https://www.test10.com/network/logo',
    };
    it('should return AVALANCHE if network is AVALANCHE_MAINNET_ID', () => {
      const result = networkToBlockchain(baseNetwork);
      expect(result).toEqual(Blockchain.AVALANCHE);
    });
    it('should return AVALANCHE if network is AVALANCHE_LOCAL_ID', () => {
      const network = { ...baseNetwork, chainId: ChainId.AVALANCHE_LOCAL_ID };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.AVALANCHE);
    });
    it('should return AVALANCHE if network is AVALANCHE_TESTNET_ID', () => {
      const network = { ...baseNetwork, chainId: ChainId.AVALANCHE_TESTNET_ID };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.AVALANCHE);
    });
    it('should return ETHEREUM if network is ETHEREUM_HOMESTEAD', () => {
      const network = { ...baseNetwork, chainId: ChainId.ETHEREUM_HOMESTEAD };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.ETHEREUM);
    });
    it('should return ETHEREUM if network is ETHEREUM_TEST_RINKEBY', () => {
      const network = {
        ...baseNetwork,
        chainId: ChainId.ETHEREUM_TEST_RINKEBY,
      };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.ETHEREUM);
    });
    it('should return ETHEREUM if network is ETHEREUM_TEST_GOERLY', () => {
      const network = { ...baseNetwork, chainId: ChainId.ETHEREUM_TEST_GOERLY };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.ETHEREUM);
    });
    it('should return BITCOIN if network is BITCOIN', () => {
      const network = { ...baseNetwork, chainId: ChainId.BITCOIN };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.BITCOIN);
    });
    it('should return BITCOIN if network is BITCOIN_TESTNET', () => {
      const network = { ...baseNetwork, chainId: ChainId.BITCOIN_TESTNET };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.BITCOIN);
    });
    it('should return UNKNOWN if network is unknown to this function', () => {
      const network = { ...baseNetwork, chainId: ChainId.AVALANCHE_TEST_XP };
      const result = networkToBlockchain(network);
      expect(result).toEqual(Blockchain.UNKNOWN);
    });
  });
});
