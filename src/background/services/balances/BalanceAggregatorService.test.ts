import { Network, NetworkToken, NetworkVMType } from '@avalabs/chains-sdk';
import { BalanceAggregatorService } from './BalanceAggregatorService';
import { Account, AccountType } from '../accounts/models';
import * as Sentry from '@sentry/browser';
import {
  BalanceServiceEvents,
  NetworkTokenWithBalance,
  TokenType,
} from './models';
import BN from 'bn.js';
import { BitcoinInputUTXO } from '@avalabs/wallets-sdk';

import { LockService } from '../lock/LockService';
import { AccountsService } from '../accounts/AccountsService';
import { StorageService } from '../storage/StorageService';

jest.mock('@sentry/browser');
jest.mock('../lock/LockService');
jest.mock('../accounts/AccountsService');
jest.mock('../storage/StorageService');

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
  } as any;

  const account1: Account = {
    id: 'account1 ID',
    name: 'account1 name',
    addressBTC: 'account1 BTC address',
    addressC: 'account1 C address',
    type: AccountType.PRIMARY,
    index: 0,
  };

  const account2: Account = {
    id: 'account2 ID',
    name: 'account2 name',
    addressBTC: 'account2 BTC address',
    addressC: 'account2 C address',
    type: AccountType.PRIMARY,
    index: 1,
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

  const accountsServiceMock = {
    activeAccount: account1,
  } as unknown as AccountsService;

  (storageService.load as jest.Mock).mockResolvedValue({
    lastUpdated: Date.now(),
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (Sentry.startTransaction as jest.Mock).mockReturnValue({
      finish: jest.fn(),
    });
    cacheServiceMock.loadBalance.mockImplementation(() => Promise.resolve()),
      networkServiceMock.activeNetworks.promisify.mockReturnValue(accounts);
    balancesServiceMock.getBalancesForNetwork.mockImplementation(
      (network, accounts) => {
        if (accounts.length > 1) {
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
          isBalancesCached: false,
          totalBalance: {
            [account1.addressC]: 0,
          },
        });
      });
    });

    it('should not emit changes if there is no change in balance', async () => {
      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      const eventListener = jest.fn();
      service.addListener(BalanceServiceEvents.UPDATED, eventListener);
      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      expect(eventListener).toBeCalledTimes(0);
    });

    it('should update the balance when successfully fetch the balance for two network for one account', async () => {
      const result = await service.updateBalancesForNetworks(
        [network1.chainId, network2.chainId],
        [account1]
      );
      expect(balancesServiceMock.getBalancesForNetwork).toBeCalledTimes(2);
      const expected = {
        [network1.chainId]: balanceForNetwork1,
        [network2.chainId]: balanceForNetwork2,
      };
      expect(result).toEqual(expected);
      expect(service.balances).toEqual(expected);
    });

    it('should update the balance for one network and add it to service balances', async () => {
      await service.updateBalancesForNetworks([network1.chainId], [account1]);
      const result = await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1]
      );
      const expected = {
        [network1.chainId]: balanceForNetwork1,
        [network2.chainId]: balanceForNetwork2,
      };
      expect(result).toEqual({ [network2.chainId]: balanceForNetwork2 });
      expect(service.balances).toEqual(expected);
    });

    it('should override the old balance when new balance is available', async () => {
      balancesServiceMock.getBalancesForNetwork
        .mockReturnValueOnce(Promise.resolve(balanceForNetwork1))
        .mockResolvedValue(Promise.resolve(updatedBalanceForNetwork1));
      const result1 = await service.updateBalancesForNetworks(
        [network1.chainId],
        [account1]
      );
      // Sanity check to make sure that the original balance was set as expected
      expect(result1).toEqual({ [network1.chainId]: balanceForNetwork1 });

      const result2 = await service.updateBalancesForNetworks(
        [network1.chainId],
        [account1]
      );
      const expected = {
        [network1.chainId]: updatedBalanceForNetwork1,
      };
      expect(result2).toEqual({
        [network1.chainId]: updatedBalanceForNetwork1,
      });
      expect(service.balances).toEqual(expected);
    });

    it('should update the balance for 2 accounts when we fetch for 2', async () => {
      const result = await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: balanceForTwoAccounts,
      };

      expect(result).toEqual(expected);
      expect(service.balances).toEqual(expected);
    });

    it('should update the balance for 1 account value when we only update for 1 and 2 account balances exits', async () => {
      balancesServiceMock.getBalancesForNetwork
        .mockReturnValueOnce(Promise.resolve(balanceForTwoAccounts))
        .mockResolvedValue(Promise.resolve(updatedBalanceForNetwork2));
      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: balanceForTwoAccounts,
      };
      expect(service.balances).toEqual(expected);

      const result = await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1]
      );

      const expected2 = {
        [network2.chainId]: {
          ...updatedBalanceForNetwork2,
          [account2.addressC]: {
            [networkToken2.symbol]: network2TokenBalance,
          },
        },
      };
      expect(result).toEqual(expected2);
      expect(service.balances).toEqual(expected2);
    });

    it('should update balance as expected when a new UTXO is added', async () => {
      const updated = { ...bitcoinTokenBalance, utxos: [utxo1, utxo2] };
      balancesServiceMock.getBalancesForNetwork
        .mockReturnValueOnce(Promise.resolve(bitcoinTokenBalance))
        .mockResolvedValue(Promise.resolve(updated));
      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: bitcoinTokenBalance,
      };
      // Sanity check to make sure that the original balance was set as expected
      expect(service.balances).toEqual(expected);

      const result = await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1]
      );

      const expected2 = {
        [network2.chainId]: updated,
      };
      expect(result).toEqual(expected2);
      expect(service.balances).toEqual(expected2);
    });

    it('should only update UTXOs when that is the only change', async () => {
      const original = { ...bitcoinTokenBalance, utxos: [utxo1, utxo2] };
      const updated = { ...bitcoinTokenBalance, utxos: [utxo1Updated, utxo2] };
      balancesServiceMock.getBalancesForNetwork
        .mockReturnValueOnce(Promise.resolve(original))
        .mockResolvedValue(Promise.resolve(updated));
      await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1, account2]
      );
      const expected = {
        [network2.chainId]: original,
      };
      // Sanity check to make sure that the original balance was set as expected
      expect(service.balances).toEqual(expected);

      const result = await service.updateBalancesForNetworks(
        [network2.chainId],
        [account1]
      );

      const expected2 = {
        [network2.chainId]: updated,
      };
      expect(result).toEqual(expected2);
      expect(service.balances).toEqual(expected2);
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
