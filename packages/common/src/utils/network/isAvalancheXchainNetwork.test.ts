import { ChainId, Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { isXchainNetwork, isXchainNetworkId } from './isAvalancheXchainNetwork';

describe('src/background/services/network/utils/isAvalancheXchainNetwork.ts', () => {
  const testNetwork: Network = {
    chainName: 'test',
    chainId: ChainId.AVALANCHE_TEST_X,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'rpcUrl',
    explorerUrl: 'https://explorer.url',
    networkToken: {
      name: 'networkTokenName',
      symbol: 'TEST',
      description: 'networkToken description',
      decimals: 10,
      logoUri: 'networkToken.logo.uri',
    },
    logoUri: 'logoUri',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isXchainNetwork', () => {
    it('should return false if network is undefined', async () => {
      const result = isXchainNetwork(undefined);
      expect(result).toEqual(false);
    });
    it('should return false if network is not AVM', async () => {
      const result = isXchainNetwork(testNetwork);
      expect(result).toEqual(false);
    });
    it('should return true if network is AVM', async () => {
      const result = isXchainNetwork({
        ...testNetwork,
        vmName: NetworkVMType.AVM,
      });
      expect(result).toEqual(true);
    });
  });

  describe('isXchainNetworkId', () => {
    it('should return false if networkId is not xchain id', async () => {
      const result = isXchainNetworkId(ChainId.BITCOIN);
      expect(result).toEqual(false);
    });
    it('should return true if networkId is xchain id', async () => {
      const result = isXchainNetworkId(ChainId.AVALANCHE_TEST_X); //TODO: Switch to real xchain chainId later
      expect(result).toEqual(true);
      const result2 = isXchainNetworkId(ChainId.AVALANCHE_X); //TODO: Switch to real xchain chainId later
      expect(result2).toEqual(true);
    });
  });
});
