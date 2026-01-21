import {
  ChainId,
  getChainsAndTokens,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { FetchRequest } from 'ethers';
import { Signal } from 'micro-signals';

import { StorageService } from '../storage/StorageService';
import { NetworkService } from './NetworkService';
import {
  NETWORK_LIST_STORAGE_KEY,
  NETWORK_OVERRIDES_STORAGE_KEY,
  NETWORK_STORAGE_KEY,
  FeatureGates,
} from '@core/types';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { runtime } from 'webextension-polyfill';
import { decorateWithCaipId } from '@core/common';
import { GlacierService } from '../glacier/GlacierService';

jest.mock('@avalabs/core-wallets-sdk', () => {
  const BitcoinProviderMock = jest.fn();
  const JsonRpcBatchInternalMock = jest.fn();
  const getDefaultFujiProviderMock = jest.fn();
  const getDefaultMainnetProviderMock = jest.fn();
  const actual = jest.requireActual('@avalabs/core-wallets-sdk');

  return {
    ...actual,
    BitcoinProvider: BitcoinProviderMock,
    JsonRpcBatchInternal: JsonRpcBatchInternalMock,
    Avalanche: {
      ...actual.Avalanche,
      JsonRpcProvider: {
        getDefaultFujiProvider: getDefaultFujiProviderMock,
        getDefaultMainnetProvider: getDefaultMainnetProviderMock,
      },
    },
  };
});

jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  FetchRequest: jest.fn(),
}));

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  addGlacierAPIKeyIfNeeded: jest.fn(),
}));

jest.mock('@avalabs/core-chains-sdk', () => ({
  ...jest.requireActual('@avalabs/core-chains-sdk'),
  getChainsAndTokens: jest.fn(),
}));

const mockNetwork = (
  vmName: NetworkVMType,
  isTestnet?: boolean,
  overrides = {},
) => {
  const network = {
    chainName: 'test chain',
    chainId: 123,
    vmName,
    rpcUrl: 'https://rpcurl.example',
    explorerUrl: 'https://explorer.url',
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
    ...overrides,
  };

  return decorateWithCaipId(network);
};

describe('background/services/network/NetworkService', () => {
  const env = process.env;

  const storageServiceMock = jest.mocked<StorageService>({
    load: jest.fn(),
    loadUnencrypted: jest.fn(),
    save: jest.fn(),
    saveUnencrypted: jest.fn(),
  } as any);

  const featureFlagsServiceMock = jest.mocked<FeatureFlagService>({
    featureFlags: {
      [FeatureGates.IN_APP_SUPPORT_P_CHAIN]: true,
    },
    addListener: jest.fn(),
  } as any);

  const glacierServiceMock = jest.mocked<GlacierService>({
    getEvmChainsForAddress: jest.fn(),
  } as any);

  let service = new NetworkService(
    storageServiceMock,
    featureFlagsServiceMock,
    glacierServiceMock,
  );

  const ethMainnet = mockNetwork(NetworkVMType.EVM, false, { chainId: 1 });
  const avaxMainnet = mockNetwork(NetworkVMType.EVM, false, {
    chainId: 43114,
  });
  const leetNetwork = mockNetwork(NetworkVMType.EVM, false, {
    chainId: 1337,
  });
  const btcNetwork = mockNetwork(NetworkVMType.BITCOIN, false, {
    chainId: ChainId.BITCOIN,
  });
  const sepolia = mockNetwork(NetworkVMType.EVM, true, {
    chainId: 11155111,
  });

  const mockChainList = (instance: NetworkService) => {
    // eslint-disable-next-line
    // @ts-ignore
    jest.spyOn(instance._rawNetworks, 'promisify').mockResolvedValue(
      Promise.resolve({
        [ethMainnet.chainId]: ethMainnet,
        [avaxMainnet.chainId]: avaxMainnet,
        [btcNetwork.chainId]: btcNetwork,
        [leetNetwork.chainId]: leetNetwork,
        [sepolia.chainId]: sepolia,
      }),
    );
    jest.spyOn(instance.allNetworks, 'promisify').mockResolvedValue(
      Promise.resolve({
        [ethMainnet.chainId]: ethMainnet,
        [avaxMainnet.chainId]: avaxMainnet,
        [btcNetwork.chainId]: btcNetwork,
        [leetNetwork.chainId]: leetNetwork,
        [sepolia.chainId]: sepolia,
      }),
    );
  };

  beforeAll(() => {
    process.env = {
      ...env,
      PROXY_URL: 'https://proxyurl.example',
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(getChainsAndTokens).mockResolvedValue({});

    jest.mocked(FetchRequest).mockImplementation((url) => ({ url }) as any);
    mockChainList(service);
  });

  afterAll(() => {
    process.env = env;
  });

  describe('.getNetwork()', () => {
    beforeEach(() => {
      jest.spyOn(service.allNetworks, 'promisify').mockResolvedValue(
        Promise.resolve({
          [ethMainnet.chainId]: ethMainnet,
          [avaxMainnet.chainId]: avaxMainnet,
        }),
      );
    });

    it('works with hexadecimal chain ids', async () => {
      expect(await service.getNetwork('0x1')).toEqual(ethMainnet);
      expect(await service.getNetwork('0xa86a')).toEqual(avaxMainnet);
    });

    it('works with numeric chain ids', async () => {
      expect(await service.getNetwork(1)).toEqual(ethMainnet);
      expect(await service.getNetwork(43114)).toEqual(avaxMainnet);
    });

    it('works with caip ids', async () => {
      expect(await service.getNetwork('eip155:1')).toEqual(ethMainnet);
      expect(await service.getNetwork('eip155:43114')).toEqual(avaxMainnet);
    });
  });

  describe('.getInitialNetworkForDapp()', () => {
    const chainlist = {
      [ethMainnet.chainId]: ethMainnet,
      [avaxMainnet.chainId]: avaxMainnet,
      [leetNetwork.chainId]: leetNetwork,
      [btcNetwork.chainId]: btcNetwork,
      [sepolia.chainId]: sepolia,
    };

    it('returns the most recently active network for given domain', async () => {
      storageServiceMock.load
        .mockResolvedValueOnce({
          dappScopes: {
            'test.app': 'eip155:1',
          },
        })
        .mockResolvedValueOnce(chainlist);

      await service.init();

      const network = await service.getInitialNetworkForDapp('test.app');

      expect(network).toEqual(ethMainnet);
    });

    it('defaults to UIs active network when extension is on EVM chain', async () => {
      storageServiceMock.load
        .mockResolvedValueOnce({
          dappScopes: {},
        })
        .mockResolvedValueOnce(chainlist);

      await service.init();
      await service.setNetwork(runtime.id, leetNetwork.caipId);

      const network = await service.getInitialNetworkForDapp('test.app');

      expect(network).toEqual(leetNetwork);
    });

    it('defaults to UIs active network when extension is on non-EVM chain and dApp is synced', async () => {
      storageServiceMock.load
        .mockResolvedValueOnce({
          dappScopes: {},
        })
        .mockResolvedValueOnce(chainlist);

      await service.init();
      await service.setNetwork(runtime.id, btcNetwork.caipId);

      const network = await service.getInitialNetworkForDapp('core.app');

      expect(network).toEqual(btcNetwork);
    });

    it('defaults to C-Chain when extension is on non-EVM chain and dApp is NOT synced', async () => {
      storageServiceMock.load
        .mockResolvedValueOnce({
          dappScopes: {},
        })
        .mockResolvedValueOnce(chainlist);

      await service.init();
      await service.setNetwork(runtime.id, btcNetwork.caipId);

      const network = await service.getInitialNetworkForDapp('test.app');

      expect(network).toEqual(avaxMainnet);
    });

    it('defaults to C-Chain when there is no active network for UI (extension is locked)', async () => {
      storageServiceMock.load
        .mockResolvedValueOnce({
          dappScopes: {},
        })
        .mockResolvedValueOnce(chainlist);

      await service.init();
      await service.onLock();

      const network = await service.getInitialNetworkForDapp('test.app');

      expect(network).toEqual(avaxMainnet);
    });
  });

  describe('.setNetwork()', () => {
    beforeEach(() => {
      storageServiceMock.load.mockResolvedValue({});
      storageServiceMock.save.mockResolvedValue();
    });

    it('persists current network for given domain', async () => {
      await service.setNetwork('test.app', ethMainnet.caipId);

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NETWORK_STORAGE_KEY,
        expect.objectContaining({
          dappScopes: expect.objectContaining({
            'test.app': ethMainnet.caipId,
          }),
        }),
      );
    });

    it('notifies about the change', async () => {
      const listener = jest.fn();

      service.dappScopeChanged.addOnce(listener);

      await service.setNetwork('test.app', ethMainnet.caipId);

      expect(listener).toHaveBeenCalledWith({
        domain: 'test.app',
        scope: ethMainnet.caipId,
      });
    });

    describe('when dApp network switch results in environment change', () => {
      beforeEach(async () => {
        service = new NetworkService(
          storageServiceMock,
          featureFlagsServiceMock,
          glacierServiceMock,
        );
        mockChainList(service);
        // Set Ethereum Mainnet directly for the frontend
        await service.setNetwork(runtime.id, ethMainnet.caipId);
        expect(service.uiActiveNetwork).toEqual(ethMainnet);
      });

      it(`changes dApp's network to the specified chain`, async () => {
        storageServiceMock.load.mockResolvedValueOnce({
          [runtime.id]: sepolia.caipId,
        });
        await service.setNetwork('app.uniswap.io', sepolia.caipId);
        expect(storageServiceMock.save).toHaveBeenCalledWith(
          NETWORK_STORAGE_KEY,
          expect.objectContaining({
            dappScopes: expect.objectContaining({
              'app.uniswap.io': sepolia.caipId,
            }),
          }),
        );
      });

      it(`changes all other dApps' networks to C-Chain, extension included`, async () => {
        storageServiceMock.load.mockResolvedValueOnce({
          [runtime.id]: sepolia.caipId,
        });
        await service.setNetwork('app.uniswap.io', sepolia.caipId);
        expect(service.uiActiveNetwork).toEqual(sepolia);
        expect(storageServiceMock.save).toHaveBeenCalledWith(
          NETWORK_STORAGE_KEY,
          expect.objectContaining({
            dappScopes: expect.objectContaining({
              'app.uniswap.io': sepolia.caipId,
              [runtime.id]: 'eip155:43113',
            }),
          }),
        );
      });

      it('notifies on developer mode change', async () => {
        const onDevModeChange = jest.fn();

        service.developerModeChanged.addOnce(onDevModeChange);

        await service.setNetwork('app.uniswap.io', sepolia.caipId);
        expect(service.uiActiveNetwork).toEqual(sepolia);

        expect(onDevModeChange).toHaveBeenCalledWith(true);
      });
    });

    describe('when changing network for synchronized dApps', () => {
      it('uses the extension ID as domain', async () => {
        await service.setNetwork('core.app', ethMainnet.caipId);

        expect(storageServiceMock.save).toHaveBeenCalledWith(
          NETWORK_STORAGE_KEY,
          expect.objectContaining({
            dappScopes: expect.objectContaining({
              [runtime.id]: ethMainnet.caipId,
            }),
          }),
        );
      });

      it('changes the network for the extension ui as well', async () => {
        jest.spyOn(service.allNetworks, 'promisify').mockResolvedValue(
          Promise.resolve({
            [ethMainnet.chainId]: ethMainnet,
            [avaxMainnet.chainId]: avaxMainnet,
          }),
        );
        // Set Ethereum directly for the frontend
        await service.setNetwork(runtime.id, ethMainnet.caipId);
        expect(service.uiActiveNetwork).toEqual(ethMainnet);

        // Set C-Chain for core.app and expect it to change also for the extension UI
        await service.setNetwork('core.app', avaxMainnet.caipId);
        expect(service.uiActiveNetwork).toEqual(avaxMainnet);
      });

      it('notifies about the change', async () => {
        const listener = jest.fn();

        service.dappScopeChanged.addOnce(listener);
        jest.spyOn(service.allNetworks, 'promisify').mockResolvedValue(
          Promise.resolve({
            [ethMainnet.chainId]: ethMainnet,
          }),
        );

        await service.setNetwork('core.app', ethMainnet.caipId);

        expect(listener).toHaveBeenCalledWith({
          domain: runtime.id,
          scope: ethMainnet.caipId,
        });
      });
    });
  });

  describe('.updateNetworkOverrides()', () => {
    beforeEach(() => {
      storageServiceMock.load.mockResolvedValue({});
      storageServiceMock.save.mockResolvedValue();
    });

    it('saves custom RPC headers', async () => {
      const overrides = {
        chainId: 1337,
        caipId: 'eip155:1337',
        customRpcHeaders: {
          'X-Glacier-Api-Key': 'my-elite-api-key',
        },
      } as any;

      const networkService = new NetworkService(
        storageServiceMock,
        featureFlagsServiceMock,
        glacierServiceMock,
      );

      await networkService.updateNetworkOverrides(overrides);

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NETWORK_OVERRIDES_STORAGE_KEY,
        {
          1337: {
            customRpcHeaders: {
              'X-Glacier-Api-Key': 'my-elite-api-key',
            },
          },
        },
      );
    });

    it('updates the active network if it was the one updated', async () => {
      const activeNetwork = {
        caipId: 'eip155:1337',
        vmName: NetworkVMType.EVM,
        chainId: 1337,
        rpcUrl: 'http://default.rpc',
      } as any;

      const networkService = new NetworkService(
        storageServiceMock,
        featureFlagsServiceMock,
        glacierServiceMock,
      );

      // eslint-disable-next-line
      // @ts-expect-error
      jest.spyOn(networkService._rawNetworks, 'promisify').mockResolvedValue({
        1337: activeNetwork,
      });
      jest.spyOn(networkService.allNetworks, 'promisify').mockResolvedValue(
        Promise.resolve({
          1337: activeNetwork,
        }),
      );

      await networkService.setNetwork(runtime.id, activeNetwork.caipId);

      await networkService.updateNetworkOverrides({
        caipId: 'eip155:1337',
        vmName: NetworkVMType.EVM,
        chainId: 1337,
        rpcUrl: 'http://custom.rpc',
      } as any);

      expect(networkService.uiActiveNetwork).toEqual({
        caipId: 'eip155:1337',
        vmName: NetworkVMType.EVM,
        chainId: 1337,
        rpcUrl: 'http://custom.rpc',
      });
    });
  });

  describe('saveCustomNetwork()', () => {
    let customNetwork;

    beforeEach(async () => {
      customNetwork = mockNetwork(NetworkVMType.EVM, false);
    });

    it('should throw an error because of the chainlist failed to load', async () => {
      jest
        // eslint-disable-next-line
        // @ts-ignore
        .spyOn(service._rawNetworks, 'promisify')
        .mockResolvedValueOnce(Promise.resolve(undefined));

      await expect(service.saveCustomNetwork(customNetwork)).rejects.toThrow(
        'chainlist failed to load',
      );
    });

    it('should throw an error because of duplicated ID', async () => {
      const newCustomNetwork = { ...customNetwork, chainId: 43114 };
      await expect(service.saveCustomNetwork(newCustomNetwork)).rejects.toThrow(
        'chain ID already exists',
      );
    });

    it('should save the custom network', async () => {
      await service.saveCustomNetwork(customNetwork);
      const network = !!service.customNetworks[customNetwork.chainId];
      expect(network).toBe(true);
    });

    it('should update the network config if the network already exists', async () => {
      const newRpcUrl = 'https://new.url.set';

      // Mock the existing custom network
      await service.saveCustomNetwork(customNetwork);

      // Update the existing custom network
      const newCustomNetwork = {
        ...customNetwork,
        rpcUrl: newRpcUrl,
      };
      const savedActiveNetwork =
        await service.saveCustomNetwork(newCustomNetwork);

      expect(savedActiveNetwork?.rpcUrl).toBe(newRpcUrl);
    });

    it('should preserve customRpcHeaders when saving a network', async () => {
      const customHeaders = {
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'custom-value',
      };
      const networkWithHeaders = {
        ...customNetwork,
        customRpcHeaders: customHeaders,
      };

      const savedNetwork = await service.saveCustomNetwork(networkWithHeaders);
      const storedNetwork = service.customNetworks[customNetwork.chainId];

      expect((savedNetwork as any).customRpcHeaders).toEqual(customHeaders);
      expect(storedNetwork).toBeDefined();
      expect((storedNetwork! as any).customRpcHeaders).toEqual(customHeaders);
    });

    it('should preserve customRpcHeaders when updating an existing network', async () => {
      const initialHeaders = {
        Authorization: 'Bearer initial-token',
      };
      const updatedHeaders = {
        Authorization: 'Bearer updated-token',
        'Content-Type': 'application/json',
      };

      // Save network with initial headers
      const networkWithInitialHeaders = {
        ...customNetwork,
        customRpcHeaders: initialHeaders,
      };
      await service.saveCustomNetwork(networkWithInitialHeaders);

      // Update network with new headers
      const networkWithUpdatedHeaders = {
        ...customNetwork,
        customRpcHeaders: updatedHeaders,
        rpcUrl: 'https://updated.rpc.url',
      };
      const updatedNetwork = await service.saveCustomNetwork(
        networkWithUpdatedHeaders,
      );
      const storedNetwork = service.customNetworks[customNetwork.chainId];

      expect((updatedNetwork as any).customRpcHeaders).toEqual(updatedHeaders);
      expect((storedNetwork as any)?.customRpcHeaders).toEqual(updatedHeaders);
      expect(storedNetwork?.rpcUrl).toBe('https://updated.rpc.url');
    });

    it('should handle networks with empty customRpcHeaders', async () => {
      const networkWithEmptyHeaders = {
        ...customNetwork,
        customRpcHeaders: {},
      };

      const savedNetwork = await service.saveCustomNetwork(
        networkWithEmptyHeaders,
      );
      const storedNetwork = service.customNetworks[customNetwork.chainId];

      expect((savedNetwork as any).customRpcHeaders).toEqual({});
      expect(storedNetwork).toBeDefined();
      expect((storedNetwork! as any).customRpcHeaders).toEqual({});
    });

    it('should handle networks without customRpcHeaders property', async () => {
      // Network without customRpcHeaders property (like legacy networks)
      const networkWithoutHeaders = { ...customNetwork };
      delete networkWithoutHeaders.customRpcHeaders;

      const savedNetwork = await service.saveCustomNetwork(
        networkWithoutHeaders,
      );
      const storedNetwork = service.customNetworks[customNetwork.chainId];

      // Should not have customRpcHeaders property if it wasn't provided
      expect('customRpcHeaders' in savedNetwork).toBe(
        'customRpcHeaders' in networkWithoutHeaders,
      );
      expect(storedNetwork).toBeDefined();
      expect('customRpcHeaders' in storedNetwork!).toBe(
        'customRpcHeaders' in networkWithoutHeaders,
      );
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
        [43114]: {
          chainName: 'cached chain',
          chainId: 43114,
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
        NETWORK_LIST_STORAGE_KEY,
      );
      expect(dispatchSpy).toHaveBeenCalledWith(cachedChainList);
    });
  });

  describe('enabled networks management', () => {
    beforeEach(() => {
      service = new NetworkService(
        storageServiceMock,
        featureFlagsServiceMock,
        glacierServiceMock,
      );
      mockChainList(service);
      service.updateNetworkState = jest.fn();
    });

    describe('enableNetwork', () => {
      it('should add a new network to enabled networks', async () => {
        const chainId = 1337;

        const result = await service.enableNetwork(chainId);

        expect(service['_enabledNetworks']).toContain(chainId);
        expect(result).toEqual(service['_enabledNetworks']);
        expect(service.updateNetworkState).toHaveBeenCalled();
        expect(service['_networkAvailability'][chainId]).toEqual({
          isEnabled: true,
        });
      });

      it('should not add duplicate networks to enabled networks', async () => {
        const chainId = 1337;

        await service.enableNetwork(chainId);
        const firstAddResult = [...service['_enabledNetworks']];

        await service.enableNetwork(chainId); // Try to add again
        const secondAddResult = [...service['_enabledNetworks']];

        expect(firstAddResult).toEqual(secondAddResult);
        expect(service['_networkAvailability'][chainId]).toEqual({
          isEnabled: true,
        });
        // Should contain the added network (and default networks)
        expect(service['_enabledNetworks']).toContain(chainId);
        // Should not have duplicates of the added network
        const occurrences = service['_enabledNetworks'].filter(
          (id) => id === chainId,
        ).length;
        expect(occurrences).toBe(1);
      });

      it('should not add networks that are already in NETWORKS_ENABLED_FOREVER', async () => {
        // Mock NETWORKS_ENABLED_FOREVER to include a specific chainId
        const defaultChainId = 43114; // Avalanche Mainnet
        jest.doMock('@core/types', () => ({
          ...jest.requireActual('@core/types'),
          NETWORKS_ENABLED_FOREVER: [defaultChainId],
        }));

        const initialLength = service['_enabledNetworks'].length;
        const result = await service.enableNetwork(defaultChainId);

        // Should not change the length since the network is already enabled by default
        expect(service['_enabledNetworks']).toHaveLength(initialLength);
        expect(result).toEqual(service['_enabledNetworks']);
        // Should contain the default chain ID since it's enabled by default
        expect(service['_enabledNetworks']).toContain(defaultChainId);
        expect(service['_networkAvailability'][defaultChainId]).toEqual(
          undefined,
        );
      });

      it('should return current enabled networks if network is already enabled', async () => {
        const chainId = 1337;

        // First add
        await service.enableNetwork(chainId);
        const firstResult = [...service['_enabledNetworks']];

        // Clear the mock to track only the second call
        jest.clearAllMocks();

        // Try to add again
        const secondResult = await service.enableNetwork(chainId);

        expect(secondResult).toEqual(firstResult);
        expect(service.updateNetworkState).not.toHaveBeenCalled(); // Should not be called for duplicate
        expect(service['_networkAvailability'][chainId]).toEqual({
          isEnabled: true,
        });
      });

      it('should trigger enabledNetworksUpdated signal', async () => {
        const chainId = 1337;
        const signalSpy = jest.spyOn(
          service.enabledNetworksUpdated,
          'dispatch',
        );

        await service.enableNetwork(chainId);

        expect(signalSpy).toHaveBeenCalled();
        expect(signalSpy).toHaveBeenCalledWith(
          expect.arrayContaining([chainId]),
        );
      });
    });

    describe('disableNetwork', () => {
      it('should remove a network from enabled networks', async () => {
        const chainId = 1337;

        // First add the network
        await service.enableNetwork(chainId);
        expect(service['_enabledNetworks']).toContain(chainId);

        // Then remove it
        const result = await service.disableNetwork(chainId);

        expect(service['_enabledNetworks']).not.toContain(chainId);
        expect(result).toEqual(service['_enabledNetworks']);
        expect(service.updateNetworkState).toHaveBeenCalled();
        expect(service['_networkAvailability'][chainId]).toEqual({
          isEnabled: false,
        });
      });

      it('should handle removing unknown network gracefully', async () => {
        const chainId = 9999; // This chain ID is not in default enabled networks or networkAvailability in storage
        const initialEnabledNetworks = [...service['_enabledNetworks']];

        const result = await service.disableNetwork(chainId);

        expect(service['_enabledNetworks']).toEqual(initialEnabledNetworks);
        expect(result).toEqual(service['_enabledNetworks']);
        expect(service.updateNetworkState).toHaveBeenCalled();
        expect(service['_networkAvailability'][chainId]).toEqual({
          isEnabled: false,
        });
      });

      it('should trigger enabledNetworksUpdated signal', async () => {
        const chainId = 1337;

        // Add network first
        await service.enableNetwork(chainId);

        const signalSpy = jest.spyOn(
          service.enabledNetworksUpdated,
          'dispatch',
        );

        // Then remove it
        await service.disableNetwork(chainId);

        expect(signalSpy).toHaveBeenCalled();
        expect(signalSpy).toHaveBeenCalledWith(
          expect.not.arrayContaining([chainId]),
        );
        expect(service['_networkAvailability'][chainId]).toEqual({
          isEnabled: false,
        });
      });

      it('should remove only the specified network when multiple are present', async () => {
        const chainId1 = 1337;
        const chainId2 = 1338;

        // Add both networks
        await service.enableNetwork(chainId1);
        await service.enableNetwork(chainId2);

        expect(service['_enabledNetworks']).toContain(chainId1);
        expect(service['_enabledNetworks']).toContain(chainId2);

        // Remove only one
        await service.disableNetwork(chainId1);

        expect(service['_enabledNetworks']).not.toContain(chainId1);
        expect(service['_enabledNetworks']).toContain(chainId2);
        expect(service['_networkAvailability'][chainId1]).toEqual({
          isEnabled: false,
        });
        expect(service['_networkAvailability'][chainId2]).toEqual({
          isEnabled: true,
        });
      });
    });

    describe('getEnabledNetworks', () => {
      beforeEach(() => {
        service.allNetworks = {
          promisify: () =>
            Promise.resolve({
              1337: mockNetwork(NetworkVMType.EVM, false, { chainId: 1337 }),
              1338: mockNetwork(NetworkVMType.EVM, true, { chainId: 1338 }),
              43114: mockNetwork(NetworkVMType.EVM, false, { chainId: 43114 }),
            }),
        } as any;
      });

      it('should return enabled networks filtered by mainnet/testnet', async () => {
        // Set service to mainnet mode
        jest.spyOn(service, 'isMainnet').mockReturnValue(true);

        await service.enableNetwork(1337); // mainnet
        await service.enableNetwork(1338); // testnet

        const enabledNetworks = await service.getEnabledNetworks();

        // Should only return mainnet networks
        expect(enabledNetworks).toContain(1337);
        expect(enabledNetworks).not.toContain(1338);
      });

      it('should include NETWORKS_ENABLED_FOREVER in the result', async () => {
        // Mock isMainnet to return true
        jest.spyOn(service, 'isMainnet').mockReturnValue(true);

        const enabledNetworks = await service.getEnabledNetworks();

        // Should include networks from NETWORKS_ENABLED_FOREVER
        expect(enabledNetworks.length).toBeGreaterThan(0);
      });

      it('should remove duplicates when combining with NETWORKS_ENABLED_FOREVER', async () => {
        const defaultChainId = 43114; // Assuming this is in NETWORKS_ENABLED_FOREVER
        jest.spyOn(service, 'isMainnet').mockReturnValue(true);

        await service.enableNetwork(defaultChainId);

        const enabledNetworks = await service.getEnabledNetworks();
        const duplicateCount = enabledNetworks.filter(
          (id) => id === defaultChainId,
        ).length;

        expect(duplicateCount).toBe(1);
      });
    });
  });

  describe('when config overrides are present', () => {
    const originalChainList = {
      '1': {
        vmName: NetworkVMType.EVM,
        caipId: 'eip155:1',
        chainId: 1,
        rpcUrl: 'http://avax.network/rpc',
      },
      '1337': {
        vmName: NetworkVMType.EVM,
        caipId: 'eip155:1337',
        chainId: 1337,
        rpcUrl: 'http://default.rpc',
      },
    } as const;

    beforeEach(() => {
      storageServiceMock.load.mockResolvedValue({
        '1337': {
          vmName: NetworkVMType.EVM,
          rpcUrl: 'http://my.custom.rpc',
        },
      });
    });

    it('applies config overrides to .allNetworks signal', async () => {
      const networkService = new NetworkService(
        storageServiceMock,
        featureFlagsServiceMock,
        glacierServiceMock,
      );

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
      const networkService = new NetworkService(
        storageServiceMock,
        featureFlagsServiceMock,
        glacierServiceMock,
      );

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
    const networkService = new NetworkService(
      storageServiceMock,
      featureFlagsServiceMock,
      glacierServiceMock,
    );

    jest
      .spyOn(networkService, 'uiActiveNetwork', 'get')
      .mockReturnValue({ isTestnet: false } as any);

    const allNetworks = {
      '1': {
        chainId: 1,
        vmName: 'EVM',
        isTestnet: false,
      },
      '1337': {
        chainId: 1337,
        vmName: 'EVM',
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
        vmName: NetworkVMType.EVM,
        caipId: 'eip155:1',
        chainId: 1,
        isTestnet: false,
      },
    });

    jest
      .spyOn(networkService, 'uiActiveNetwork', 'get')
      .mockReturnValue({ isTestnet: true } as any);
    // eslint-disable-next-line
    // @ts-expect-error
    networkService._allNetworks.dispatch(allNetworks);

    const testnetNetworksPromise =
      await networkService.activeNetworks.promisify();

    expect(await testnetNetworksPromise).toEqual({
      '1337': {
        vmName: NetworkVMType.EVM,
        caipId: 'eip155:1337',
        chainId: 1337,
        isTestnet: true,
      },
    });
  });

  it('filters pchain network by feature flag when dispatching allNetowrks signal', async () => {
    const allNetworks = {
      '1': {
        vmName: NetworkVMType.EVM,
        chainId: 1,
        caipId: 'eip155:1',
        isTestnet: false,
      },
      [ChainId.AVALANCHE_P]: {
        chainId: ChainId.AVALANCHE_P,
        vmName: NetworkVMType.PVM,
        caipId: 'avax:11111111111111111111111111111111LpoYY',
        isTestnet: false,
      },
    } as any;
    const networkService = new NetworkService(
      storageServiceMock,
      featureFlagsServiceMock,
      glacierServiceMock,
    );

    jest
      .spyOn(networkService, 'uiActiveNetwork', 'get')
      .mockReturnValue({ isTestnet: false } as any);

    // Feature flag turned on. Should include Pchain

    // eslint-disable-next-line
    // @ts-expect-error
    networkService._allNetworks.dispatch(allNetworks);

    const result1 = await networkService.activeNetworks.promisify();
    expect(await result1).toEqual(allNetworks);

    featureFlagsServiceMock.featureFlags[FeatureGates.IN_APP_SUPPORT_P_CHAIN] =
      false;

    // Feature flag turned off. Should not include Pchain

    // eslint-disable-next-line
    // @ts-expect-error
    networkService._allNetworks.dispatch(allNetworks);

    const result2 = await networkService.activeNetworks.promisify();
    expect(await result2).toEqual({
      '1': {
        caipId: 'eip155:1',
        vmName: 'EVM',
        chainId: 1,
        isTestnet: false,
      },
    });
  });
});
