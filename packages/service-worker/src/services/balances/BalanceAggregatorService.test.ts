import * as Sentry from '@sentry/browser';
import { Network, NetworkToken, NetworkVMType } from '@avalabs/core-chains-sdk';

import {
  Account,
  AccountType,
  BalanceAggregatorServiceErrors,
  BALANCES_CACHE_KEY,
  BalanceServiceEvents,
  FeatureGates,
} from '@core/types';
import { StorageService } from '../storage/StorageService';
import { SettingsService } from '../settings/SettingsService';

import { BalanceAggregatorService } from './BalanceAggregatorService';
import { LockService } from '../lock/LockService';
import {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
  TokenType,
} from '@avalabs/vm-module-types';
import { postV1BalanceGetBalances } from '~/api-clients/balance-api';
import { setErrorForRequestInSessionStorage } from '@core/common';

jest.mock('@sentry/browser');
jest.mock('../lock/LockService');
jest.mock('../storage/StorageService');
jest.mock('@core/common', () => {
  const actualImport = jest.requireActual('@core/common');
  return {
    ...actualImport,
    setErrorForRequestInSessionStorage: jest.fn(),
  };
});
jest.mock('~/api-clients/balance-api');

describe('src/background/services/balances/BalanceAggregatorService.ts', () => {
  global.fetch = jest.fn().mockImplementation(
    () =>
      new Promise((res) => {
        return res;
      }),
  );
  const balancesServiceMock = {
    getBalancesForNetwork: jest.fn(),
  } as any;

  const featureFlagServiceMock = {
    featureFlags: {},
  } as any;
  const mockSecretsService = {
    getAvalancheExtendedPublicKey: jest.fn(),
  } as any;

  const settingsServiceMock = {
    getSettings: () => ({ currency: 'USD' }),
  } as unknown as SettingsService;

  const lockService = new LockService({} as any, {} as any);

  const storageService = new StorageService({} as any);

  const networkToken1: NetworkToken = {
    name: 'network token 1',
    symbol: 'NT1',
    description: 'network tokwn for network 1',
    decimals: 12,
    logoUri: 'network.token.one.com',
  };

  const network1: Network = {
    chainName: 'test network 1',
    chainId: 1,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'test.one.com/rpc',
    explorerUrl: 'https://explorer.url',
    networkToken: networkToken1,
    logoUri: 'test.one.com/logo',
    primaryColor: 'purple',
  };

  const networkToken2: NetworkToken = {
    name: 'network token 2',
    symbol: 'NT2',
    description: 'network tokwn for network 2',
    decimals: 24,
    logoUri: 'network.token.two.com',
  };

  const network2: Network = {
    chainName: 'test network 2',
    chainId: 2,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'test.two.com/rpc',
    explorerUrl: 'https://explorer.url',
    networkToken: networkToken2,
    logoUri: 'test.two.com/logo',
    primaryColor: 'brown',
  };

  const accounts = {
    [network1.chainId]: network1,
    [network2.chainId]: network2,
  };

  const networkServiceMock = {
    activeNetworks: {
      promisify: jest.fn(),
    },
    getFavoriteNetworks: () => [2, 3, 4],
  } as any;
  const addressResolverMock = {} as any;

  const tokenPricesServiceMock = {
    getPriceChangesData: jest.fn().mockResolvedValue({}),
  } as any;

  const account1: Account = {
    id: 'account1-id',
    name: 'account1 name',
    addressBTC: 'account1 BTC address',
    addressC: 'account1 C address',
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'wallet-id-1',
  };

  const account2: Account = {
    id: 'account2-id',
    name: 'account2 name',
    addressBTC: 'account2 BTC address',
    addressC: 'account2 C address',
    type: AccountType.PRIMARY,
    index: 1,
    walletId: 'wallet-id-2',
  };

  const network1TokenBalance: NetworkTokenWithBalance = {
    ...networkToken1,
    type: TokenType.NATIVE,
    balance: 100n,
    balanceDisplayValue: '0.00001',
    coingeckoId: '',
  };

  const network1NftTokenBalance: NftTokenWithBalance = {
    chainId: network1.chainId,
    type: TokenType.ERC721,
    balance: 100n,
    balanceDisplayValue: '0.00001',
    address: '0x1',
    logoUri: 'logouri',
    logoSmall: '',
    tokenId: '123',
    tokenUri: 'tokenuri',
    collectionName: 'unknown',
    description: '',
    name: 'name',
    symbol: '',
  };

  const balanceForNetwork1 = {
    [account1.addressC]: {
      [networkToken1.symbol]: network1TokenBalance,
      ['0x1-123']: network1NftTokenBalance,
    },
  };

  const network2TokenBalance: NetworkTokenWithBalance = {
    ...networkToken2,
    type: TokenType.NATIVE,
    balance: 100n,
    balanceDisplayValue: '0.00001',
    coingeckoId: '',
  };

  const balanceForNetwork2 = {
    [account1.addressC]: {
      [networkToken2.symbol]: network2TokenBalance,
    },
  };

  const balanceForTwoAccounts = {
    [account1.addressC]: {
      [networkToken2.symbol]: network1TokenBalance,
    },
    [account2.addressC]: {
      [networkToken2.symbol]: network2TokenBalance,
    },
  };

  (storageService.load as jest.Mock).mockResolvedValue({
    lastUpdated: Date.now(),
  });

  beforeEach(() => {
    jest.resetAllMocks();

    (Sentry.startTransaction as jest.Mock).mockReturnValue({
      finish: jest.fn(),
    });

    networkServiceMock.activeNetworks.promisify.mockReturnValue(accounts);
    balancesServiceMock.getBalancesForNetwork.mockImplementation(
      (network, accountsList) => {
        if (accountsList.length > 1) {
          return Promise.resolve(balanceForTwoAccounts);
        }
        if (network.chainId === network1.chainId) {
          return Promise.resolve(balanceForNetwork1);
        } else if (network.chainId === network2.chainId) {
          return Promise.resolve(balanceForNetwork2);
        }
      },
    );

    // eslint-disable-next-line
    // @ts-expect-error
    lockService.locked = false;
  });

  describe('getBalancesForNetworks', () => {
    let service: BalanceAggregatorService;

    beforeEach(() => {
      service = new BalanceAggregatorService(
        balancesServiceMock,
        networkServiceMock,
        lockService,
        storageService,
        settingsServiceMock,
        featureFlagServiceMock,
        mockSecretsService,
        addressResolverMock,
        tokenPricesServiceMock,
      );
    });

    it('calls BalancesService.getBalancesForNetwork() with proper params', async () => {
      await service.getBalancesForNetworks({
        chainIds: [network1.chainId],
        accounts: [account1],
        tokenTypes: [TokenType.NATIVE],
      });
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(1);
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledWith(
        network1,
        [account1],
        [TokenType.NATIVE],
        undefined,
      );
    });

    it('only updates the balances of the requested accounts', async () => {
      // Mock the existing balances for other accounts
      (balancesServiceMock.getBalancesForNetwork as jest.Mock).mockReset();

      balancesServiceMock.getBalancesForNetwork
        .mockResolvedValueOnce({
          [account2.addressC]: {
            [networkToken1.symbol]: network1TokenBalance,
          },
        })
        .mockResolvedValueOnce({
          [account1.addressC]: {
            [networkToken1.symbol]: network1TokenBalance,
          },
        });

      // Get balances for the `account2` so they get cached
      await service.getBalancesForNetworks({
        chainIds: [network1.chainId],
        accounts: [account2],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20],
      });

      expect(balancesServiceMock.getBalancesForNetwork).toHaveBeenCalledTimes(
        1,
      );

      expect(service.balances).toEqual({
        [network1.chainId]: {
          [account2.addressC]: {
            [networkToken1.symbol]: network1TokenBalance,
          },
        },
      });

      // Now get the balances for the first account and verify the `account2` balances are kept in cache
      await service.getBalancesForNetworks({
        chainIds: [network1.chainId],
        accounts: [account1],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20],
      });

      expect(balancesServiceMock.getBalancesForNetwork).toHaveBeenCalledTimes(
        2,
      );
      expect(service.balances).toEqual({
        [network1.chainId]: {
          [account1.addressC]: {
            [networkToken1.symbol]: network1TokenBalance,
          },
          [account2.addressC]: {
            [networkToken1.symbol]: network1TokenBalance,
          },
        },
      });
    });

    it('can fetch the balance for multiple networks and one account', async () => {
      const balances = await service.getBalancesForNetworks({
        chainIds: [network1.chainId, network2.chainId],
        accounts: [account1],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC721],
      });
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(4);
      const expected = {
        tokens: {
          [network1.chainId]: {
            [account1.addressC]: {
              [networkToken1.symbol]: network1TokenBalance,
            },
          },
          [network2.chainId]: balanceForNetwork2,
        },
        atomic: {},
        nfts: {
          [network1.chainId]: {
            [account1.addressC]: {
              '0x1-123': network1NftTokenBalance,
            },
          },
          [network2.chainId]: {
            [account1.addressC]: {},
          },
        },
      };
      expect(balances).toEqual(expected);
    });

    it('fetches the balances for multiple networks and accounts', async () => {
      const result = await service.getBalancesForNetworks({
        chainIds: [network1.chainId, network2.chainId],
        accounts: [account1, account2],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC721],
      });

      const expected = {
        atomic: {},
        tokens: {
          [network1.chainId]: balanceForTwoAccounts,
          [network2.chainId]: balanceForTwoAccounts,
        },
        nfts: {
          [network1.chainId]: {
            [account1.addressC]: {},
            [account2.addressC]: {},
          },
          [network2.chainId]: {
            [account1.addressC]: {},
            [account2.addressC]: {},
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('should not mutate the state after lock', async () => {
      jest.useFakeTimers();

      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      (
        balancesServiceMock.getBalancesForNetwork as jest.Mock
      ).mockReturnValueOnce(
        new Promise((res) =>
          setTimeout(() => {
            res(balanceForNetwork1);
          }, 500),
        ),
      );

      const updatePromise = service.getBalancesForNetworks({
        chainIds: [network1.chainId],
        accounts: [account1],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC721],
      });

      // eslint-disable-next-line
      // @ts-expect-error
      lockService.locked = true;
      jest.advanceTimersByTime(500);
      await updatePromise;

      expect(service.balances).toEqual({});
      expect(eventListener).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should emit an event when successfully fetching the balance', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      await service.getBalancesForNetworks({
        chainIds: [network1.chainId, network2.chainId],
        accounts: [account1],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC721],
      });

      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(4);
      const expectedTokens = {
        [network1.chainId]: {
          [account1.addressC]: {
            [networkToken1.symbol]: network1TokenBalance,
          },
        },
        [network2.chainId]: balanceForNetwork2,
      };
      expect(service.balances).toEqual(expectedTokens);
      expect(service.nfts).toEqual({
        [network1.chainId]: {
          [account1.addressC]: {
            '0x1-123': network1NftTokenBalance,
          },
        },
        [network2.chainId]: {
          [account1.addressC]: {},
        },
      });

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith({
        balances: {
          atomic: {},
          tokens: expectedTokens,
          nfts: {
            [network1.chainId]: {
              [account1.addressC]: {
                '0x1-123': network1NftTokenBalance,
              },
            },
            [network2.chainId]: {
              [account1.addressC]: {},
            },
          },
        },
        isBalancesCached: false,
      });
    });
  });

  describe('caching', () => {
    let service: BalanceAggregatorService;

    beforeEach(() => {
      service = new BalanceAggregatorService(
        balancesServiceMock,
        networkServiceMock,
        lockService,
        storageService,
        settingsServiceMock,
        featureFlagServiceMock,
        mockSecretsService,
        addressResolverMock,
        tokenPricesServiceMock,
      );
    });

    it('should load the right cache key from the storage when there is no balance yet', async () => {
      await service.onUnlock();

      expect(storageService.load).toHaveBeenCalledWith(BALANCES_CACHE_KEY);
    });

    it('should load the data from cache when there is no balance yet', async () => {
      const cachedBalances = { [network2.chainId]: balanceForNetwork1 };

      (storageService.load as jest.Mock).mockResolvedValue({
        balances: cachedBalances,
      });

      await service.onUnlock();

      const balances = service.balances;

      expect(balances).toEqual(cachedBalances);
    });

    it('should skip the load from the cache because of there are data in the memory', async () => {
      balancesServiceMock.getBalancesForNetwork.mockResolvedValueOnce(
        balanceForNetwork2,
      );

      const cachedBalances = { [network2.chainId]: balanceForNetwork1 };
      const freshBalances = { [network2.chainId]: balanceForNetwork2 };
      (storageService.load as jest.Mock).mockResolvedValue({
        balances: cachedBalances,
      });

      await service.getBalancesForNetworks({
        chainIds: [network2.chainId],
        accounts: [account1],
        tokenTypes: [],
      });

      await service.onUnlock();

      await new Promise(process.nextTick);

      const balances = service.balances;

      expect(balances).toEqual(freshBalances);
    });

    it('emits the BalanceServiceEvents.UPDATED if balances did change', async () => {
      // Cached balances include two accounts: account1, account2
      const cachedBalances = {
        [network2.chainId]: {
          ...balanceForNetwork2,
          [account2.addressC]: network1TokenBalance,
        },
      };

      (storageService.load as jest.Mock).mockResolvedValue({
        balances: cachedBalances,
      });

      await service.onUnlock();

      // Fresh balances include only one account (account2) and the values for it HAVE changed
      balancesServiceMock.getBalancesForNetwork.mockResolvedValueOnce({
        [account2.addressC]: {
          [networkToken2.symbol]: {
            ...network1TokenBalance,
            balance: 200n,
            balanceDisplayValue: '0.00002',
          },
        },
      });

      const updatesListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, updatesListener);

      await service.getBalancesForNetworks({
        chainIds: [network2.chainId],
        accounts: [account2],
        tokenTypes: [],
      });
      await new Promise(process.nextTick);

      // The fresh balances include new information, therefore an event should be emitted.
      expect(updatesListener).toHaveBeenCalled();
    });

    it('DOES NOT emit the BalanceServiceEvents.UPDATED if balances did not change', async () => {
      // Cached balances include two accounts: account1, account2
      const cachedBalances = {
        [network2.chainId]: {
          ...balanceForNetwork2,
          [account2.addressC]: balanceForNetwork1,
        },
      };

      (storageService.load as jest.Mock).mockResolvedValue({
        balances: cachedBalances,
      });

      await service.onUnlock();

      // Fresh balances include only one account (account1) and the values for it DID NOT change
      balancesServiceMock.getBalancesForNetwork.mockResolvedValueOnce(
        balanceForNetwork2,
      );

      const updatesListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, updatesListener);

      await service.getBalancesForNetworks({
        chainIds: [network2.chainId],
        accounts: [account1],
        tokenTypes: [],
      });
      await new Promise(process.nextTick);

      // Cached & fresh balances as a whole are different,
      // but the fresh balances do not include any new information,
      // therefore no event should be emitted.
      expect(updatesListener).not.toHaveBeenCalled();
    });
  });

  describe('error scenarios', () => {
    let service: BalanceAggregatorService;

    beforeEach(() => {
      service = new BalanceAggregatorService(
        balancesServiceMock,
        networkServiceMock,
        lockService,
        storageService,
        settingsServiceMock,
        {
          featureFlags: {
            [FeatureGates.BALANCE_SERVICE_INTEGRATION]: true,
          },
        } as any,
        mockSecretsService,
        addressResolverMock,
        tokenPricesServiceMock,
      );
    });

    it('Should save to session storage that there was an error if for a given wallet there is an error with balance service', async () => {
      const walletId = 'wallet-id';

      jest.mocked(postV1BalanceGetBalances).mockImplementation(() => {
        throw new Error('So long and thanks for all the fish');
      });

      await service.getBalancesForNetworks({
        chainIds: [43114],
        accounts: [account1],
        tokenTypes: [TokenType.ERC20],
        requestId: walletId,
      });

      expect(
        jest.mocked(setErrorForRequestInSessionStorage),
      ).toHaveBeenCalledWith(
        walletId,
        BalanceAggregatorServiceErrors.ERROR_WHILE_CALLING_BALANCE__SERVICE,
      );
    });
  });
});
