import { BITCOIN_NETWORK, NetworkVMType } from '@avalabs/chains-sdk';
import {
  BlockCypherProvider,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';
import { StorageService } from '../storage/StorageService';
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

  beforeAll(() => {
    process.env = {
      ...env,
      GLACIER_API_KEY: 'glacierapikey',
      PROXY_URL: 'https://proxyurl.example',
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    process.env = env;
  });

  describe('getProviderForNetwork', () => {
    const mockJsonRpcBatchInternalInstance = {};
    const mockBlockCypherProviderInstance = {};

    const networkService = new NetworkService({} as unknown as StorageService);

    beforeEach(() => {
      (addGlacierAPIKeyIfNeeded as jest.Mock).mockImplementation((v) => v);
      (JsonRpcBatchInternal as unknown as jest.Mock).mockReturnValue(
        mockJsonRpcBatchInternalInstance
      );
      (BlockCypherProvider as jest.Mock).mockReturnValue(
        mockBlockCypherProviderInstance
      );
    });

    it('returns a json rpc provider for evm chains', () => {
      const provider = networkService.getProviderForNetwork(mockEVMNetwork);

      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        40,
        mockEVMNetwork.rpcUrl,
        mockEVMNetwork.chainId
      );
      expect((provider as JsonRpcBatchInternal).pollingInterval).toEqual(2000);
      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
    });

    it('uses multicall when requested', () => {
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
        mockEVMNetwork.rpcUrl,
        mockEVMNetwork.chainId
      );
    });

    it('adds glacier api key for glacier urls', () => {
      (addGlacierAPIKeyIfNeeded as jest.Mock).mockReturnValue(
        'https://urlwithglacierkey.example'
      );

      const provider = networkService.getProviderForNetwork(mockEVMNetwork);

      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
      expect(addGlacierAPIKeyIfNeeded).toHaveBeenCalledWith(
        mockEVMNetwork.rpcUrl
      );
      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        40,
        'https://urlwithglacierkey.example',
        mockEVMNetwork.chainId
      );
    });

    it('returns blockcypher provider for BTC networks', () => {
      const provider = networkService.getProviderForNetwork(BITCOIN_NETWORK);

      expect(provider).toBe(mockBlockCypherProviderInstance);
      expect(BlockCypherProvider).toHaveBeenCalledTimes(1);
      expect(BlockCypherProvider).toHaveBeenCalledWith(
        true,
        process.env.GLACIER_API_KEY,
        `${process.env.PROXY_URL}/proxy/blockcypher`
      );
    });

    it('returns error when VM is not supported', () => {
      expect(() => {
        networkService.getProviderForNetwork({
          ...mockEVMNetwork,
          vmName: 'CRAPPYVM' as unknown as NetworkVMType,
        });
      }).toThrowError(new Error('unsupported network'));
    });
  });
});
