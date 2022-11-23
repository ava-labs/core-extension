import { NetworkService } from '../network/NetworkService';
import { AccountsService } from './AccountsService';
import { StorageService } from '../storage/StorageService';
import { WalletService } from '../wallet/WalletService';
import { LedgerService } from '../ledger/LedgerService';
import { LockService } from '../lock/LockService';
import { AccountsEvents, ACCOUNTS_STORAGE_KEY } from './models';

jest.mock('../storage/StorageService');
jest.mock('../wallet/WalletService');
jest.mock('../ledger/LedgerService');
jest.mock('../lock/LockService');

describe('background/services/accounts/AccountsService', () => {
  const networkService = new NetworkService({} as any);
  const storageService = new StorageService({} as any);
  const ledgerService = new LedgerService();
  const lockService = new LockService({} as any, {} as any);
  const walletService = new WalletService(
    storageService,
    networkService,
    ledgerService,
    lockService
  );
  const evmAddress = '0x000000000';
  const btcAddress = 'btc000000000';

  const mockAccounts = [
    {
      index: 0,
      name: 'Account 1',
      addressC: evmAddress,
      addressBTC: btcAddress,
      active: true,
    },
    {
      index: 1,
      name: 'Account 2',
      addressC: evmAddress,
      addressBTC: btcAddress,
      active: false,
    },
  ];

  const mockAccountsNoAddress = [
    {
      index: 0,
      name: 'Account 1',
      active: true,
    },
    {
      index: 1,
      name: 'Account 2',
      active: false,
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    (storageService.load as jest.Mock).mockResolvedValue([]);
    (walletService.addAddress as jest.Mock).mockResolvedValue({
      EVM: evmAddress,
      BITCOIN: btcAddress,
    });
    networkService.activeNetworkChanged.add = jest.fn();
    networkService.activeNetworkChanged.remove = jest.fn();
  });

  describe('onUnlock', () => {
    it('init returns with no accounts from storage', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toHaveLength(0);
    });

    it('init returns with accounts not from updating', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      const accounts = accountsService.getAccounts();
      expect(accounts).toHaveLength(2);
      expect(accounts).toEqual(mockAccounts);
    });

    it('init returns with accounts with missing addresses', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(
        mockAccountsNoAddress
      );
      (walletService.getAddress as jest.Mock)
        .mockResolvedValueOnce({ EVM: '1x00000000', BITCOIN: 'btc1234' })
        .mockResolvedValueOnce({ EVM: '2x00000000', BITCOIN: 'btc9876' });
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(walletService.getAddress).toBeCalledTimes(2);
      const accounts = accountsService.getAccounts();
      expect(accounts).toHaveLength(2);
      expect(accounts).toEqual([
        {
          index: 0,
          name: 'Account 1',
          addressC: '1x00000000',
          addressBTC: 'btc1234',
          active: true,
        },
        {
          index: 1,
          name: 'Account 2',
          addressC: '2x00000000',
          addressBTC: 'btc9876',
          active: false,
        },
      ]);
    });

    it('account addresses are updated on network change', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      (walletService.getAddress as jest.Mock)
        .mockResolvedValueOnce({ EVM: '1x00000000', BITCOIN: 'btc1234' })
        .mockResolvedValueOnce({ EVM: '2x00000000', BITCOIN: 'btc9876' });
      await accountsService.onUnlock();

      expect(walletService.getAddress).not.toBeCalled();
      const accounts = accountsService.getAccounts();
      expect(accounts).toHaveLength(2);
      expect(accounts).toEqual(mockAccounts);

      expect(networkService.activeNetworkChanged.add).toBeCalledTimes(1);
      // this mocks a network change
      (networkService.activeNetworkChanged.add as jest.Mock).mock.calls[0][0]();
      await new Promise(process.nextTick);

      const updatedAccounts = accountsService.getAccounts();

      expect(updatedAccounts).toEqual([
        {
          index: 0,
          name: 'Account 1',
          addressC: '1x00000000',
          addressBTC: 'btc1234',
          active: true,
        },
        {
          index: 1,
          name: 'Account 2',
          addressC: '2x00000000',
          addressBTC: 'btc9876',
          active: false,
        },
      ]);
    });
  });

  describe('onLock', () => {
    it('clears accounts and subscriptions on lock', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toHaveLength(2);

      accountsService.onLock();
      expect(accountsService.getAccounts()).toHaveLength(0);
      expect(
        (networkService.activeNetworkChanged.add as jest.Mock).mock.calls[0][0]
      ).toBe(
        (networkService.activeNetworkChanged.remove as jest.Mock).mock
          .calls[0][0]
      );
    });

    it('emits ACCOUNTS_UPDATED event when onLock is called', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();
      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );
      expect(accountsService.getAccounts()).toHaveLength(2);
      accountsService.onLock();
      expect(eventListener).toHaveBeenCalledWith([]);
    });
  });

  describe('getAccounts', () => {
    it('returns accounts', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();
      const accounts = accountsService.getAccounts();

      expect(accounts).toHaveLength(2);
      expect(accounts).toEqual(mockAccounts);
    });
  });

  describe('addAccount', () => {
    it('adds account with index 0 when no accounts', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toHaveLength(0);

      await accountsService.addAccount('Account name');
      expect(walletService.addAddress).toBeCalledTimes(1);
      expect(walletService.addAddress).toBeCalledWith(0);

      const accounts = accountsService.getAccounts();
      expect(accounts).toEqual([
        {
          active: false,
          addressBTC: btcAddress,
          addressC: evmAddress,
          index: 0,
          name: 'Account name',
        },
      ]);
    });

    it('sets default name when no name is given', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toHaveLength(2);

      await accountsService.addAccount();
      expect(walletService.addAddress).toBeCalledTimes(1);
      expect(walletService.addAddress).toBeCalledWith(2);

      const accounts = accountsService.getAccounts();
      expect(accounts).toEqual([
        ...mockAccounts,
        {
          active: false,
          addressBTC: btcAddress,
          addressC: evmAddress,
          index: 2,
          name: 'Account 3',
        },
      ]);
    });

    it('adds account to end of accounts array', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toHaveLength(2);

      await accountsService.addAccount('New Account');
      expect(walletService.addAddress).toBeCalledTimes(1);
      expect(walletService.addAddress).toBeCalledWith(2);

      const accounts = accountsService.getAccounts();
      expect(accounts).toStrictEqual([
        ...mockAccounts,
        {
          active: false,
          addressBTC: btcAddress,
          addressC: evmAddress,
          index: 2,
          name: 'New Account',
        },
      ]);
    });

    it('emits event when account added', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();
      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );
      await accountsService.addAccount('New Account');

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith([
        ...mockAccounts,
        {
          active: false,
          addressBTC: btcAddress,
          addressC: evmAddress,
          index: 2,
          name: 'New Account',
        },
      ]);
    });
  });

  describe('setAccountName', () => {
    it('throws error if no account', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toHaveLength(0);

      await expect(
        accountsService.setAccountName(2, 'updated name')
      ).rejects.toThrow('Account with index 2 not found');
    });

    it('updates account name successfully', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toHaveLength(2);

      await accountsService.setAccountName(1, 'Updated Name');
      const accounts = accountsService.getAccounts();
      expect(accounts).toHaveLength(2);
      expect(accounts).toEqual([
        {
          index: 0,
          name: 'Account 1',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: true,
        },
        {
          index: 1,
          name: 'Updated Name',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: false,
        },
      ]);
    });

    it('emits event if name changes', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toHaveLength(2);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );

      await accountsService.setAccountName(1, 'Updated Name');
      await accountsService.setAccountName(1, 'Updated Name');
      await accountsService.setAccountName(1, 'Updated Name');
      accountsService.getAccounts();

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith([
        {
          index: 0,
          name: 'Account 1',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: true,
        },
        {
          index: 1,
          name: 'Updated Name',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: false,
        },
      ]);
    });
  });

  describe('activateAccount', () => {
    it('changes account to active', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toHaveLength(2);

      await accountsService.activateAccount(1);
      const accounts = accountsService.getAccounts();
      expect(accounts).toEqual([
        {
          index: 0,
          name: 'Account 1',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: false,
        },
        {
          index: 1,
          name: 'Account 2',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: true,
        },
      ]);
    });

    it('emits event when activateAccount is called', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );

      await accountsService.activateAccount(1);
      expect(eventListener).toHaveBeenCalledWith([
        {
          index: 0,
          name: 'Account 1',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: false,
        },
        {
          index: 1,
          name: 'Account 2',
          addressC: evmAddress,
          addressBTC: btcAddress,
          active: true,
        },
      ]);
    });
  });
});
