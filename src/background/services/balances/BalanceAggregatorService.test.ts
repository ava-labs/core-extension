import { Network, NetworkToken, NetworkVMType } from '@avalabs/chains-sdk';
import { BalanceAggregatorService } from './BalanceAggregatorService';
import { Account, AccountType } from '../accounts/models';
import * as Sentry from '@sentry/browser';
import {
  BalanceServiceEvents,
  BALANCES_CACHE_KEY,
  NetworkTokenWithBalance,
  TokenType,
} from './models';
import BN from 'bn.js';
import { BitcoinInputUTXO } from '@avalabs/wallets-sdk';

import { LockService } from '../lock/LockService';
import { AccountsService } from '../accounts/AccountsService';
import { StorageService } from '../storage/StorageService';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';

jest.mock('@sentry/browser');
jest.mock('../lock/LockService');
jest.mock('../accounts/AccountsService');
jest.mock('../storage/StorageService');
jest.mock('../../../utils/calculateTotalBalance');

describe('src/background/services/balances/BalanceAggregatorService.ts', () => {
  const balancesServiceMock = {
    getBalancesForNetwork: jest.fn(),
  } as any;

  const cacheServiceMock = {
    loadBalance: jest.fn(),
    saveBalances: jest.fn(),
  } as any;

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
    activeNetworkChanged: {
      add: jest.fn(),
    },
    favoriteNetworksUpdated: {
      add: jest.fn(),
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

  const updatedBalanceForNetwork1 = {
    [account1.addressC]: {
      [networkToken1.symbol]: {
        ...network1TokenBalance,
        balance: new BN(10000),
      },
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

  const updatedBalanceForNetwork2 = {
    [account1.addressC]: {
      [networkToken2.symbol]: {
        ...network2TokenBalance,
        balance: new BN(10000),
      },
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

  const bitcoinToken: NetworkToken = {
    name: 'Bitcoin',
    symbol: 'BTC',
    description: 'Bitcoin token',
    decimals: 24,
    logoUri: 'bitcoin.token.com',
  };

  const utxo1: BitcoinInputUTXO = {
    txHash: 'utxo 1 hash',
    index: 1,
    value: 1,
    script: 'utxo 1 script',
    blockHeight: 1,
    confirmations: 1,
  };

  const utxo2: BitcoinInputUTXO = {
    txHash: 'utxos 2 hash',
    index: 2,
    value: 2,
    script: 'utxo 2 script',
    blockHeight: 2,
    confirmations: 2,
  };

  const utxo1Updated: BitcoinInputUTXO = {
    txHash: 'utxo 1 hash',
    index: 1,
    value: 1,
    script: 'utxo 1 script',
    blockHeight: 1,
    confirmations: 10,
  };

  const bitcoinTokenBalance: NetworkTokenWithBalance = {
    ...bitcoinToken,
    type: TokenType.NATIVE,
    balance: new BN(100),
    utxos: [utxo1],
  };

  const addListenerMock = jest.fn();
  const accountsServiceMock = {
    activeAccount: account1,
    addListener: addListenerMock,
  } as unknown as AccountsService;

  (storageService.load as jest.Mock).mockResolvedValue({
    lastUpdated: Date.now(),
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (Sentry.startTransaction as jest.Mock).mockReturnValue({
      finish: jest.fn(),
    });
    (calculateTotalBalance as jest.Mock).mockReturnValue(1);
    cacheServiceMock.loadBalance.mockImplementation(() => Promise.resolve()),
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
  });

  describe('updateBalancesForNetworks', () => {
    let service;
    beforeEach(() => {
      service = new BalanceAggregatorService(
        balancesServiceMock,
        networkServiceMock,
        lockService,
        storageService,
        accountsServiceMock
      );
    });

    it('calls BalancesService.getBalancesForNetwork() with proper params', async () => {
      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(1);
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledWith(
        network1,
        [account1]
      );
    });

    describe('when balance is successfully fetched for one network & one account', () => {
      it('updates the balances', async () => {
        await service.updateBalancesForNetworks([network1.chainId], [account1]);
        expect(service.balances).toEqual({
          [network1.chainId]: balanceForNetwork1,
        });
      });

      it('emits the BalanceServiceEvents.UPDATED event', async () => {
        const eventListener = jest.fn();
        service.addListener(BalanceServiceEvents.UPDATED, eventListener);
        await service.updateBalancesForNetworks([network1.chainId], [account1]);
        expect(eventListener).toHaveBeenCalledWith({
          balances: {
            [network1.chainId]: balanceForNetwork1,
          },
          isBalancesCached: true,
          totalBalance: {},
        });
      });
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

      const updatePromise = service.updateBalancesForNetworks(
        [network1.chainId],
        [account1]
      );

      service['lockService'].locked = true;
      jest.advanceTimersByTime(500);
      await updatePromise;

      expect(service.balances).toEqual({});
      expect(eventListener).not.toBeCalled();

      service['lockService'].locked = false;
      jest.useRealTimers();
    });

    it('should not emit changes if there is no change in balance', async () => {
      await service.updateBalancesForNetworks([network2.chainId], [account1]);

      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      await service.updateBalancesForNetworks([network2.chainId], [account1]);
      expect(eventListener).toBeCalledTimes(0);
    });

    it('should update the balance when successfully fetch the balance for two network for one account', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      await service.updateBalancesForNetworks(
        [network1.chainId, network2.chainId],
        [account1]
      );
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(2);
      const expected = {
        [network1.chainId]: balanceForNetwork1,
        [network2.chainId]: balanceForNetwork2,
      };
      expect(service.balances).toEqual(expected);

      expect(eventListener).toBeCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, {
        balances: {
          [network1.chainId]: balanceForNetwork1,
        },
        isBalancesCached: false,
        totalBalance: {},
      });
      expect(eventListener).toHaveBeenNthCalledWith(2, {
        balances: {
          [network2.chainId]: balanceForNetwork2,
        },
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
    });

    it('should update the balance for one network and add it to service balances', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      await service.updateBalancesForNetworks([network2.chainId], [account1]);

      const expected = {
        [network1.chainId]: balanceForNetwork1,
        [network2.chainId]: balanceForNetwork2,
      };

      expect(service.balances).toEqual(expected);
      expect(eventListener).toBeCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, {
        balances: {
          [network1.chainId]: balanceForNetwork1,
        },
        isBalancesCached: true,
        totalBalance: {}, // network1 is not the active or a favorite network
      });
      expect(eventListener).toHaveBeenNthCalledWith(2, {
        balances: {
          [network2.chainId]: balanceForNetwork2,
        },
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
    });

    it('should override the old balance when new balance is available', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      balancesServiceMock.getBalancesForNetwork
        .mockResolvedValueOnce(balanceForNetwork1)
        .mockResolvedValueOnce(updatedBalanceForNetwork1);

      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      // Sanity check to make sure that the original balance was set as expected
      expect(service.balances).toEqual({
        [network1.chainId]: balanceForNetwork1,
      });

      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      expect(service.balances).toEqual({
        [network1.chainId]: updatedBalanceForNetwork1,
      });

      expect(eventListener).toBeCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, {
        balances: {
          [network1.chainId]: balanceForNetwork1,
        },
        isBalancesCached: true,
        totalBalance: {}, // network1 is not the active or a favorite network
      });
      expect(eventListener).toHaveBeenNthCalledWith(2, {
        balances: {
          [network1.chainId]: updatedBalanceForNetwork1,
        },
        isBalancesCached: true,
        totalBalance: {}, // network1 is not the active or a favorite network
      });
    });

    it('should update the balance for 2 accounts when we fetch for 2', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: balanceForTwoAccounts,
      };
      expect(service.balances).toEqual(expected);

      expect(eventListener).toBeCalledTimes(1);
      expect(eventListener).toBeCalledWith({
        balances: {
          [network2.chainId]: balanceForTwoAccounts,
        },
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
    });

    it('should update the balance for 1 account value when we only update for 1 and 2 account balances exits', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      balancesServiceMock.getBalancesForNetwork
        .mockResolvedValueOnce(balanceForTwoAccounts)
        .mockResolvedValueOnce(updatedBalanceForNetwork2);

      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: balanceForTwoAccounts,
      };
      expect(service.balances).toEqual(expected);

      await service.updateBalancesForNetworks([network2.chainId], [account1]);

      const expected2 = {
        [network2.chainId]: {
          ...updatedBalanceForNetwork2,
          [account2.addressC]: {
            [networkToken2.symbol]: network2TokenBalance,
          },
        },
      };
      expect(service.balances).toEqual(expected2);
      expect(eventListener).toBeCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, {
        balances: {
          [network2.chainId]: balanceForTwoAccounts,
        },
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
      expect(eventListener).toHaveBeenNthCalledWith(2, {
        balances: expected2,
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
    });

    it('should update balance as expected when a new UTXO is added', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      const updated = { ...bitcoinTokenBalance, utxos: [utxo1, utxo2] };

      balancesServiceMock.getBalancesForNetwork
        .mockResolvedValueOnce(bitcoinTokenBalance)
        .mockResolvedValueOnce(updated);
      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: bitcoinTokenBalance,
      };
      // Sanity check to make sure that the original balance was set as expected
      expect(service.balances).toEqual(expected);

      await service.updateBalancesForNetworks([network2.chainId], [account1]);

      const expected2 = {
        [network2.chainId]: updated,
      };
      expect(service.balances).toEqual(expected2);
      expect(eventListener).toBeCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, {
        balances: {
          [network2.chainId]: bitcoinTokenBalance,
        },
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
      expect(eventListener).toHaveBeenNthCalledWith(2, {
        balances: {
          [network2.chainId]: updated,
        },
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
    });

    it('should only update UTXOs when that is the only change', async () => {
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      const original = { ...bitcoinTokenBalance, utxos: [utxo1, utxo2] };
      const updated = { ...bitcoinTokenBalance, utxos: [utxo1Updated, utxo2] };
      balancesServiceMock.getBalancesForNetwork
        .mockResolvedValueOnce(original)
        .mockResolvedValueOnce(updated);
      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: original,
      };
      // Sanity check to make sure that the original balance was set as expected
      expect(service.balances).toEqual(expected);

      await service.updateBalancesForNetworks([network2.chainId], [account1]);

      const expected2 = {
        [network2.chainId]: updated,
      };
      expect(service.balances).toEqual(expected2);

      expect(eventListener).toBeCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, {
        balances: expected,
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
      expect(eventListener).toHaveBeenNthCalledWith(2, {
        balances: expected2,
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1 },
      });
    });

    it('should set the balanceCached flag', async () => {
      const balances = { [network2.chainId]: balanceForNetwork1 };
      expect(service.isBalancesCached).toBe(true);
      await service.updateBalancesValues(balances);
      expect(service.isBalancesCached).toBe(false);
    });

    it('should set the balanceCached flag for active network if there are no favorites', async () => {
      service = new BalanceAggregatorService(
        balancesServiceMock,
        {
          activeNetwork: {
            chainId: 2,
          },
          activeNetworks: {
            promisify: jest.fn(),
          },
          activeNetworkChanged: {
            add: jest.fn(),
          },
          favoriteNetworksUpdated: {
            add: jest.fn(),
          },
          getFavoriteNetworks: () => [],
        } as any,
        lockService,
        storageService,
        accountsServiceMock
      );

      const balances = { [network2.chainId]: balanceForNetwork1 };
      expect(service.isBalancesCached).toBe(true);
      await service.updateBalancesValues(balances);
      expect(service.isBalancesCached).toBe(false);
    });

    describe('caching', () => {
      it('should load the right cache key from the storage when there is no balance yet', () => {
        addListenerMock.mock.calls[0][1]();

        expect(storageService.load).toHaveBeenCalledWith(BALANCES_CACHE_KEY);
      });

      it('should load the data from cache when there is no balance yet', async () => {
        const setBalances = { [network2.chainId]: balanceForNetwork1 };
        const setTotalBalance = { [account1.addressC]: 2 };
        (storageService.load as jest.Mock).mockResolvedValue({
          lastUpdated: 1,
          totalBalance: setTotalBalance,
          balances: setBalances,
        });

        addListenerMock.mock.calls[0][1](account1);

        await new Promise(process.nextTick);

        const totalBalance = service.totalBalance;

        const balances = service.balances;

        expect(balances).toEqual(setBalances);
        expect(totalBalance).toEqual(setTotalBalance);
      });

      it('should set empty values because nothing in the cache', async () => {
        (storageService.load as jest.Mock).mockResolvedValue({
          lastUpdated: 1,
        });

        addListenerMock.mock.calls[0][1](account1);

        await new Promise(process.nextTick);

        const totalBalance = service.totalBalance;

        const balances = service.balances;

        expect(balances).toEqual({});
        expect(totalBalance).toEqual({});
      });

      it('should skip the load from the cache because of there are data in the memory', async () => {
        balancesServiceMock.getBalancesForNetwork.mockResolvedValueOnce(
          balanceForNetwork2
        );

        const setBalances = { [network2.chainId]: balanceForNetwork1 };
        const setBalances2 = { [network2.chainId]: balanceForNetwork2 };
        const setTotalBalance = { [account1.addressC]: 2 };
        (storageService.load as jest.Mock).mockResolvedValue({
          lastUpdated: 1,
          totalBalance: setTotalBalance,
          balances: setBalances,
        });

        await service.updateBalancesForNetworks([network2.chainId], [account1]);

        addListenerMock.mock.calls[0][1](account1);

        await new Promise(process.nextTick);

        const balances = service.balances;

        const totalBalance = service.totalBalance;

        expect(balances).toEqual(setBalances2);
        expect(totalBalance).toEqual({ [account1.addressC]: 1 });
      });
    });
  });

  describe('getBatchedUpdatedBalancesForNetworks', () => {
    it('gets fetches the balances and emits an update event only once', async () => {
      const service = new BalanceAggregatorService(
        balancesServiceMock,
        networkServiceMock,
        lockService,
        storageService,
        accountsServiceMock
      );

      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);

      const result = await service.getBatchedUpdatedBalancesForNetworks(
        [network1.chainId, network2.chainId],
        [account1, account2]
      );

      const expected = {
        [network1.chainId]: balanceForTwoAccounts,
        [network2.chainId]: balanceForTwoAccounts,
      };

      expect(result).toEqual(expected);
      expect(service.balances).toEqual(expected);

      expect(eventListener).toBeCalledTimes(1);
      expect(eventListener).toBeCalledWith({
        balances: expected,
        isBalancesCached: false,
        totalBalance: { [account1.addressC]: 1, [account2.addressC]: 1 },
      });
    });
  });

  describe('onLock', () => {
    it('should empty the balances', async () => {
      const service = new BalanceAggregatorService(
        balancesServiceMock,
        networkServiceMock,
        lockService,
        storageService,
        accountsServiceMock
      );
      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      const expected = { [network1.chainId]: balanceForNetwork1 };
      expect(service.balances).toEqual(expected);
      service.onLock();
      expect(service.balances).toEqual({});
    });
  });
});
