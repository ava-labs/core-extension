import {
  BITCOIN_NETWORK,
  BITCOIN_TEST_NETWORK,
  ChainId,
  getChainsAndTokens,
  NetworkVMType,
} from '@avalabs/chains-sdk';
import {
  BitcoinProvider,
  JsonRpcBatchInternal,
  Avalanche,
} from '@avalabs/wallets-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';
import { StorageService } from '../storage/StorageService';
import { NetworkService } from './NetworkService';
import { Network } from 'ethers';
import { NETWORK_LIST_STORAGE_KEY } from './models';
import { Signal } from 'micro-signals';

jest.mock('@avalabs/wallets-sdk', () => {
  const BitcoinProviderMock = jest.fn();
  const JsonRpcBatchInternalMock = jest.fn();
  const getDefaultFujiProviderMock = jest.fn();
  const getDefaultMainnetProviderMock = jest.fn();
  return {
    ...jest.requireActual('@avalabs/wallets-sdk'),
    BitcoinProvider: BitcoinProviderMock,
    JsonRpcBatchInternal: JsonRpcBatchInternalMock,
    Avalanche: {
      JsonRpcProvider: {
        getDefaultFujiProvider: getDefaultFujiProviderMock,
        getDefaultMainnetProvider: getDefaultMainnetProviderMock,
      },
    },
  };
});

jest.mock('@src/utils/addGlacierAPIKeyIfNeeded', () => ({
  addGlacierAPIKeyIfNeeded: jest.fn(),
}));

jest.mock('@avalabs/chains-sdk', () => ({
  ...jest.requireActual('@avalabs/chains-sdk'),
  getChainsAndTokens: jest.fn(),
}));

const mockNetwork = (vmName: NetworkVMType, isTestnet?: boolean) => ({
  chainName: 'test chain',
  chainId: 123,
  vmName,
  rpcUrl: 'https://rpcurl.example',
  networkToken: {
    name: 'test network token',
    symbol: 'TNT',
    description: '',
    decimals: 18,
    logoUri: '',
  },
  logoUri: '',
  primaryColor: 'blue',
  isTestnet: isTestnet ?? true,
});

describe('background/services/network/NetworkService', () => {
  const env = process.env;

  const storageServiceMock = jest.mocked<StorageService>({
    load: jest.fn(),
    loadUnencrypted: jest.fn(),
    save: jest.fn(),
    saveUnencrypted: jest.fn(),
  } as any);
  const service = new NetworkService(storageServiceMock);

  beforeAll(() => {
    process.env = {
      ...env,
      GLACIER_API_KEY: 'glacierapikey',
      PROXY_URL: 'https://proxyurl.example',
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(getChainsAndTokens).mockResolvedValue({
      [43114]: {
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
        primaryColor: 'blue',
        isTestnet: false,
      },
    });
  });

  afterAll(() => {
    process.env = env;
  });

  describe('.updateNetworkOverrides()', () => {
    beforeEach(() => {
      storageServiceMock.load.mockResolvedValue({});
      storageServiceMock.save.mockResolvedValue();
    });

    it('updates the active network if it was the one updated', async () => {
      const activeNetwork = {
        chainId: 1337,
        rpcUrl: 'http://default.rpc',
      } as const;

      const networkService = new NetworkService(storageServiceMock);

      // eslint-disable-next-line
      // @ts-expect-error
      jest.spyOn(networkService._rawNetworks, 'promisify').mockResolvedValue({
        1337: activeNetwork,
      });
      jest.spyOn(networkService.allNetworks, 'promisify').mockResolvedValue({
        1337: activeNetwork,
      } as any);

      await networkService.setNetwork(activeNetwork.chainId);

      await networkService.updateNetworkOverrides({
        chainId: 1337,
        rpcUrl: 'http://custom.rpc',
      } as any);

      expect(networkService.activeNetwork).toEqual({
        chainId: 1337,
        rpcUrl: 'http://custom.rpc',
      });
    });
  });

  describe('saveCustomNetwork()', () => {
    let customNetwork;
    beforeEach(() => {
      customNetwork = mockNetwork(NetworkVMType.EVM, false);
    });
    it('should throw an error because of the chainlist failed to load', async () => {
      jest
        // eslint-disable-next-line
        // @ts-expect-error
        .spyOn(service._rawNetworks, 'promisify')
        .mockResolvedValue(Promise.resolve(undefined));
      expect(service.saveCustomNetwork(customNetwork)).rejects.toThrow(
        'chainlist failed to load'
      );
    });
    it('should throw an error because of duplicated ID', async () => {
      const newCustomNetwork = { ...customNetwork, chainId: 43114 };
      expect(service.saveCustomNetwork(newCustomNetwork)).rejects.toThrow(
        'chain ID already exists'
      );
    });
    it('should save the custom network', async () => {
      await service.saveCustomNetwork(customNetwork);
      const network = !!service.customNetworks[customNetwork.chainId];
      expect(network).toBe(true);
    });
    it('should set the custom network as an active network', async () => {
      await service.saveCustomNetwork(customNetwork);
      expect(service.activeNetwork?.chainId).toEqual(customNetwork.chainId);
    });
    it('should update the active custom network data', async () => {
      const newRpcUrl = 'https://new.url.set';
      await service.saveCustomNetwork(customNetwork);
      await service.saveCustomNetwork({
        ...customNetwork,
        rpcUrl: newRpcUrl,
      });
      const activeNetworkRpcUrl = service.activeNetwork?.rpcUrl;
      expect(activeNetworkRpcUrl).toBe(newRpcUrl);
    });
    it('should call `updateNetworkState`', async () => {
      service.updateNetworkState = jest.fn();
      await service.saveCustomNetwork(customNetwork);
      expect(service.updateNetworkState).toHaveBeenCalled();
    });
  });
  describe('when chain list is not available through Glacier', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest
        .mocked(getChainsAndTokens)
        .mockRejectedValue(new Error('Unavailable'));
    });

    it('falls back to the chainlist cached in storage when unlocked', async () => {
      const cachedChainList = {
        [1337]: {
          chainName: 'cached chain',
          chainId: 1337,
          vmName: NetworkVMType.EVM,
          rpcUrl: 'https://rpcurl.example',
          logoUri: '',
          primaryColor: 'blue',
          isTestnet: false,
        },
      };
      const dispatchSpy = jest.spyOn(Signal.prototype, 'dispatch');

      jest.spyOn(storageServiceMock, 'load').mockResolvedValue(cachedChainList);

      await service.init();
      await service.onLock();

      expect(storageServiceMock.load).toHaveBeenCalledWith(
        NETWORK_LIST_STORAGE_KEY
      );
      expect(dispatchSpy).toHaveBeenCalledWith(cachedChainList);
    });
  });

  it('should return without the (filtered out testnet) favorite networks', async () => {
    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
    service.allNetworks = {
      promisify: () =>
        Promise.resolve({
          [mockEVMNetwork.chainId]: { ...mockEVMNetwork },
        }),
    } as any;
    await service.addFavoriteNetwork(123);
    await service.addFavoriteNetwork(2);
    const favoriteNetworks = await service.getFavoriteNetworks();
    expect(favoriteNetworks).toEqual([2]);
  });

  it('should set the correct network to be active after lock', async () => {
    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM, false);
    jest
      // eslint-disable-next-line
      // @ts-ignore Gotta mock private property
      .spyOn(service._chainListFetched, 'promisify')
      .mockResolvedValue({
        [mockEVMNetwork.chainId]: { ...mockEVMNetwork },
      });
    service.allNetworks.promisify = jest
      .fn()
      .mockResolvedValue({ [ChainId.AVALANCHE_MAINNET_ID]: mockEVMNetwork });
    await service.init();
    await service.onLock();
    const activeNetwork = service.activeNetwork;
    expect(activeNetwork).toEqual(mockEVMNetwork);
  });

  describe('when config overrides are present', () => {
    const originalChainList = {
      '1': {
        chainId: 1,
        rpcUrl: 'http://avax.network/rpc',
      },
      '1337': {
        chainId: 1337,
        rpcUrl: 'http://default.rpc',
      },
    } as const;

    beforeEach(() => {
      storageServiceMock.load.mockResolvedValue({
        '1337': {
          rpcUrl: 'http://my.custom.rpc',
        },
      });
    });

    it('applies config overrides to .allNetworks signal', async () => {
      const networkService = new NetworkService(storageServiceMock);

      // eslint-disable-next-line
      // @ts-expect-error
      networkService._allNetworks.dispatch(originalChainList);

      const networksPromise = await networkService.allNetworks.promisify();

      expect(await networksPromise).toEqual({
        ...originalChainList,
        '1337': {
          ...originalChainList['1337'],
          rpcUrl: 'http://my.custom.rpc',
        },
      });
    });

    it('applies config overrides to .activeNetworks signal', async () => {
      const networkService = new NetworkService(storageServiceMock);

      // eslint-disable-next-line
      // @ts-expect-error
      networkService._allNetworks.dispatch(originalChainList);

      const networksPromise = await networkService.activeNetworks.promisify();

      expect(await networksPromise).toEqual({
        ...originalChainList,
        '1337': {
          ...originalChainList['1337'],
          rpcUrl: 'http://my.custom.rpc',
        },
      });
    });
  });

  it('filters networks by .isTestnet for .activeNetworks signal', async () => {
    const networkService = new NetworkService(storageServiceMock);

    jest.spyOn(networkService, 'activeNetwork', 'get').mockReturnValue({
      isTestnet: false,
    } as any);

    const allNetworks = {
      '1': {
        chainId: 1,
        isTestnet: false,
      },
      '1337': {
        chainId: 1337,
        isTestnet: true,
      },
    } as any;

    // eslint-disable-next-line
    // @ts-expect-error
    networkService._allNetworks.dispatch(allNetworks);

    const mainnetNetworksPromise =
      await networkService.activeNetworks.promisify();

    expect(await mainnetNetworksPromise).toEqual({
      '1': {
        chainId: 1,
        isTestnet: false,
      },
    });

    jest.spyOn(networkService, 'activeNetwork', 'get').mockReturnValue({
      isTestnet: true,
    } as any);
    // eslint-disable-next-line
    // @ts-expect-error
    networkService._allNetworks.dispatch(allNetworks);

    const testnetNetworksPromise =
      await networkService.activeNetworks.promisify();

    expect(await testnetNetworksPromise).toEqual({
      '1337': {
        chainId: 1337,
        isTestnet: true,
      },
    });
  });

  describe('getProviderForNetwork', () => {
    const mockJsonRpcBatchInternalInstance = {};
    const mockBitcoinProviderInstance = {};
    const mockFujiProviderInstance = {};
    const mockMainnetProviderInstance = {};

    const networkService = new NetworkService({} as unknown as StorageService);

    beforeEach(() => {
      (addGlacierAPIKeyIfNeeded as jest.Mock).mockImplementation((v) => v);
      (JsonRpcBatchInternal as unknown as jest.Mock).mockReturnValue(
        mockJsonRpcBatchInternalInstance
      );
      (BitcoinProvider as jest.Mock).mockReturnValue(
        mockBitcoinProviderInstance
      );
      (
        Avalanche.JsonRpcProvider.getDefaultFujiProvider as jest.Mock
      ).mockReturnValue(mockFujiProviderInstance);
      (
        Avalanche.JsonRpcProvider.getDefaultMainnetProvider as jest.Mock
      ).mockReturnValue(mockMainnetProviderInstance);
    });

    it('returns a json rpc provider for evm chains', () => {
      const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
      const provider = networkService.getProviderForNetwork(mockEVMNetwork);

      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        40,
        mockEVMNetwork.rpcUrl,
        new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
      );
      expect((provider as JsonRpcBatchInternal).pollingInterval).toEqual(2000);
      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
    });

    it('uses multicall when requested', () => {
      const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
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
        new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
      );
    });

    it('adds glacier api key for glacier urls', () => {
      (addGlacierAPIKeyIfNeeded as jest.Mock).mockReturnValue(
        'https://urlwithglacierkey.example'
      );

      const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
      const provider = networkService.getProviderForNetwork(mockEVMNetwork);

      expect(provider).toBe(mockJsonRpcBatchInternalInstance);
      expect(addGlacierAPIKeyIfNeeded).toHaveBeenCalledWith(
        mockEVMNetwork.rpcUrl
      );
      expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
      expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
        40,
        'https://urlwithglacierkey.example',
        new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
      );
    });

    it('returns bitcoin provider for BTC testnet', () => {
      const provider =
        networkService.getProviderForNetwork(BITCOIN_TEST_NETWORK);

      expect(provider).toBe(mockBitcoinProviderInstance);
      expect(BitcoinProvider).toHaveBeenCalledTimes(1);
      expect(BitcoinProvider).toHaveBeenCalledWith(
        false,
        undefined,
        `${process.env.PROXY_URL}/proxy/nownodes/btcbook-testnet`,
        `${process.env.PROXY_URL}/proxy/nownodes/btc-testnet`,
        { token: process.env.GLACIER_API_KEY }
      );
    });

    it('returns bitcoin provider for BTC mainnet', () => {
      const provider = networkService.getProviderForNetwork(BITCOIN_NETWORK);

      expect(provider).toBe(mockBitcoinProviderInstance);
      expect(BitcoinProvider).toHaveBeenCalledTimes(1);
      expect(BitcoinProvider).toHaveBeenCalledWith(
        true,
        undefined,
        `${process.env.PROXY_URL}/proxy/nownodes/btcbook`,
        `${process.env.PROXY_URL}/proxy/nownodes/btc`,
        { token: process.env.GLACIER_API_KEY }
      );
    });

    it('returns fuji provider for X-chain test network', () => {
      const mockAVMNetwork = mockNetwork(NetworkVMType.AVM);
      const provider = networkService.getProviderForNetwork(mockAVMNetwork);

      expect(provider).toBe(mockFujiProviderInstance);
      expect(
        Avalanche.JsonRpcProvider.getDefaultFujiProvider
      ).toHaveBeenCalledTimes(1);
    });

    it('returns mainnet provider for X-chain network', () => {
      const mockAVMNetwork = mockNetwork(NetworkVMType.AVM, false);
      const provider = networkService.getProviderForNetwork(mockAVMNetwork);

      expect(provider).toBe(mockMainnetProviderInstance);
      expect(
        Avalanche.JsonRpcProvider.getDefaultMainnetProvider
      ).toHaveBeenCalledTimes(1);
    });

    it('returns fuji provider for P-chain test network', () => {
      const mockAVMNetwork = mockNetwork(NetworkVMType.PVM);
      const provider = networkService.getProviderForNetwork(mockAVMNetwork);

      expect(provider).toBe(mockFujiProviderInstance);
      expect(
        Avalanche.JsonRpcProvider.getDefaultFujiProvider
      ).toHaveBeenCalledTimes(1);
    });

    it('returns mainnet provider for P-chain network', () => {
      const mockAVMNetwork = mockNetwork(NetworkVMType.PVM, false);
      const provider = networkService.getProviderForNetwork(mockAVMNetwork);

      expect(provider).toBe(mockMainnetProviderInstance);
      expect(
        Avalanche.JsonRpcProvider.getDefaultMainnetProvider
      ).toHaveBeenCalledTimes(1);
    });

    it('returns error when VM is not supported', () => {
      const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
      expect(() => {
        networkService.getProviderForNetwork({
          ...mockEVMNetwork,
          vmName: 'CRAPPYVM' as unknown as NetworkVMType,
        });
      }).toThrow(new Error('unsupported network'));
    });
  });
});
