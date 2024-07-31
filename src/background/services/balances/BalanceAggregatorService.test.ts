import BN from 'bn.js';
import * as Sentry from '@sentry/browser';
import { Network, NetworkToken, NetworkVMType } from '@avalabs/core-chains-sdk';

import { StorageService } from '../storage/StorageService';
import { SettingsService } from '../settings/SettingsService';
import { Account, AccountType } from '../accounts/models';

import { BalanceAggregatorService } from './BalanceAggregatorService';
import {
  BALANCES_CACHE_KEY,
  BalanceServiceEvents,
  NetworkTokenWithBalance,
  TokenType,
} from './models';
import { LockService } from '../lock/LockService';

jest.mock('@sentry/browser');
jest.mock('../lock/LockService');
jest.mock('../storage/StorageService');

describe('src/background/services/balances/BalanceAggregatorService.ts', () => {
  global.fetch = jest.fn().mockImplementation(
    () =>
      new Promise((res) => {
        return res;
      })
  );
  const balancesServiceMock = {
    getBalancesForNetwork: jest.fn(),
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
    balance: new BN(100),
  };

  const balanceForNetwork1 = {
    [account1.addressC]: {
      [networkToken1.symbol]: network1TokenBalance,
    },
  };

  const network2TokenBalance: NetworkTokenWithBalance = {
    ...networkToken2,
    type: TokenType.NATIVE,
    balance: new BN(100),
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
      }
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
        settingsServiceMock
      );
    });

    it('calls BalancesService.getBalancesForNetwork() with proper params', async () => {
      await service.getBalancesForNetworks([network1.chainId], [account1]);
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(1);
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledWith(
        network1,
        [account1],
        undefined
      );
    });

    it('can fetch the balance for multiple networks and one account', async () => {
      const balances = await service.getBalancesForNetworks(
        [network1.chainId, network2.chainId],
        [account1]
      );
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(2);
      const expected = {
        [network1.chainId]: balanceForNetwork1,
        [network2.chainId]: balanceForNetwork2,
      };
      expect(balances).toEqual(expected);
    });

    it('fetches the balances for multiple networks and accounts', async () => {
      const result = await service.getBalancesForNetworks(
        [network1.chainId, network2.chainId],
        [account1, account2]
      );

      const expected = {
        [network1.chainId]: balanceForTwoAccounts,
        [network2.chainId]: balanceForTwoAccounts,
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
          }, 500)
        )
      );

      const updatePromise = service.getBalancesForNetworks(
        [network1.chainId],
        [account1]
      );

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

      await service.getBalancesForNetworks(
        [network1.chainId, network2.chainId],
        [account1]
      );

      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(2);
      const expected = {
        [network1.chainId]: balanceForNetwork1,
        [network2.chainId]: balanceForNetwork2,
      };
      expect(service.balances).toEqual(expected);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith({
        balances: {
          [network1.chainId]: balanceForNetwork1,
          [network2.chainId]: balanceForNetwork2,
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
        settingsServiceMock
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
        balanceForNetwork2
      );

      const cachedBalances = { [network2.chainId]: balanceForNetwork1 };
      const freshBalances = { [network2.chainId]: balanceForNetwork2 };
      (storageService.load as jest.Mock).mockResolvedValue({
        balances: cachedBalances,
      });

      await service.getBalancesForNetworks([network2.chainId], [account1]);

      await service.onUnlock();

      await new Promise(process.nextTick);

      const balances = service.balances;

      expect(balances).toEqual(freshBalances);
    });
  });
});
