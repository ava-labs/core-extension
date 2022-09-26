import { BITCOIN_NETWORK, NetworkVMType } from '@avalabs/chains-sdk';
import {
  BlockCypherProvider,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';
import { NetworkService } from './NetworkService';

jest.mock('@avalabs/wallets-sdk', () => {
  const BlockCypherProviderMock = jest.fn();
  const JsonRpcBatchInternalMock = jest.fn();
  return {
    BlockCypherProvider: BlockCypherProviderMock,
    JsonRpcBatchInternal: JsonRpcBatchInternalMock,
  };
});

jest.mock('@src/utils/addGlacierAPIKeyIfNeeded', () => ({
  addGlacierAPIKeyIfNeeded: jest.fn(),
}));

const mockEVMNetwork = {
  chainName: 'test chain',
  chainId: 123,
  vmName: NetworkVMType.EVM,
  rpcUrl: 'https://rpcurl.example',
  networkToken: {
    name: 'test network token',
    symbol: 'TNT',
    description: '',
    decimals: 18,
    logoUri: '',
  },
  logoUri: '',
};

describe('background/services/network/NetworkService', () => {
  const env = process.env;
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...env,
      GLACIER_API_KEY: 'glacierapikey',
      GLACIER_URL: 'https://glacierurl.example',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  describe('getProviderForNetwork', () => {
    let mockJsonRpcBatchInternalInstance = {};
    let mockBlockCypherProviderInstance = {};
    beforeEach(() => {
      (addGlacierAPIKeyIfNeeded as jest.Mock).mockImplementation((v) => v);
      mockJsonRpcBatchInternalInstance = {};
      mockBlockCypherProviderInstance = {};
      (JsonRpcBatchInternal as unknown as jest.Mock).mockReturnValue(
        mockJsonRpcBatchInternalInstance
      );
      (BlockCypherProvider as jest.Mock).mockReturnValue(
        mockBlockCypherProviderInstance
      );
    });

    it('returns a json rpc provider for evm chains', () => {
      const networkService = new NetworkService({} as any);

      const provider = networkService.getProviderForNetwork(mockEVMNetwork);

      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        40,
        'https://rpcurl.example',
        123
      );
      expect((provider as any).pollingInterval).toEqual(2000);
      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
    });

    it('uses multicall when requested', () => {
      const networkService = new NetworkService({} as any);
      const provider = networkService.getProviderForNetwork(
        {
          ...mockEVMNetwork,
          utilityAddresses: {
            multicall: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          },
        },
        true
      );

      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        {
          maxCalls: 40,
          multiContractAddress: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        },
        'https://rpcurl.example',
        123
      );
    });

    it('adds glacier api key for glacier urls', () => {
      (addGlacierAPIKeyIfNeeded as jest.Mock).mockReturnValue(
        'https://urlwithglacierkey.example'
      );
      const networkService = new NetworkService({} as any);

      const provider = networkService.getProviderForNetwork(mockEVMNetwork);

      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        40,
        'https://urlwithglacierkey.example',
        123
      );
    });

    it('returns blockcypher provider for BTC networks', () => {
      const networkService = new NetworkService({} as any);

      const provider = networkService.getProviderForNetwork(BITCOIN_NETWORK);

      expect(provider).toBe(mockBlockCypherProviderInstance);
      expect(BlockCypherProvider).toHaveBeenCalledTimes(1);
      expect(BlockCypherProvider).toHaveBeenCalledWith(
        true,
        'glacierapikey',
        'https://glacierurl.example/proxy/blockcypher'
      );
    });

    it('returns error when VM is not supported', () => {
      const networkService = new NetworkService({} as any);

      expect(() => {
        networkService.getProviderForNetwork({
          ...mockEVMNetwork,
          vmName: 'CRAPPYVM' as any,
        });
      }).toThrowError(new Error('unsupported network'));
    });
  });
});
