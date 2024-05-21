import { ChainId, Network, NetworkVMType } from '@avalabs/chains-sdk';
import { isPchainNetwork, isPchainNetworkId } from './isAvalanchePchainNetwork';

describe('src/background/services/network/utils/isAvalanchePchainNetwork.ts', () => {
  const testNetwork: Network = {
    chainName: 'test',
    chainId: 132,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'rpcUrl',
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

  describe('isPchainNetwork', () => {
    it('should return false if network is undefined', async () => {
      const result = isPchainNetwork(undefined);
      expect(result).toEqual(false);
    });
    it('should return false if network is not PVM', async () => {
      const result = isPchainNetwork(testNetwork);
      expect(result).toEqual(false);
    });
    it('should return true if network is PVM', async () => {
      const result = isPchainNetwork({
        ...testNetwork,
        vmName: NetworkVMType.PVM,
      });
      expect(result).toEqual(true);
    });
  });

  describe('isPchainNetworkId', () => {
    it('should return false if networkId is not pchain id', async () => {
      const result = isPchainNetworkId(ChainId.BITCOIN);
      expect(result).toEqual(false);
    });
    it('should return true if networkId is pchain id', async () => {
      const result = isPchainNetworkId(ChainId.AVALANCHE_P);
      expect(result).toEqual(true);
      const result2 = isPchainNetworkId(ChainId.AVALANCHE_TEST_P);
      expect(result2).toEqual(true);
    });
  });
});
