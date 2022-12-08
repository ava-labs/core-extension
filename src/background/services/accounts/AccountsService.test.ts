import { NetworkService } from '../network/NetworkService';
import { AccountsService } from './AccountsService';
import { StorageService } from '../storage/StorageService';
import { WalletService } from '../wallet/WalletService';
import { LedgerService } from '../ledger/LedgerService';
import { LockService } from '../lock/LockService';
import {
  AccountsEvents,
  ACCOUNTS_STORAGE_KEY,
  AccountType,
  ImportType,
} from './models';
import { NetworkVMType } from '@avalabs/chains-sdk';

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

  const emptyAccounts = {
    primary: [],
    imported: {},
    active: undefined,
  };

  const evmAddress = '0x000000000';
  const btcAddress = 'btc000000000';
  const avmAddress = '';
  const pvmAddress = '';
  const coreEthAddress = '';
  const otherEvmAddress = '0x000000001';
  const otherBtcAddress = 'btc000000001';

  const getAllAddresses = (useOtherAddresses = false) => ({
    addressC: useOtherAddresses ? otherEvmAddress : evmAddress,
    addressBTC: useOtherAddresses ? otherBtcAddress : btcAddress,
    addressAVM: avmAddress,
    addressPVM: pvmAddress,
    addressCoreEth: coreEthAddress,
  });

  const mockAccounts = (
    withAddresses = false,
    withOtherAddresses = false,
    active: number | string = 0
  ) => {
    const addresses = withAddresses ? getAllAddresses(withOtherAddresses) : {};

    const primaryAccounts = [
      {
        index: 0,
        id: 'uuid1',
        name: 'Account 1',
        type: AccountType.PRIMARY,
        ...addresses,
      },
      {
        index: 1,
        id: 'uuid2',
        name: 'Account 2',
        type: AccountType.PRIMARY,
        ...addresses,
      },
    ];
    const importedAccounts = {
      '0x1': {
        id: '0x1',
        name: 'Imported Account 1',
        type: AccountType.IMPORTED,
        ...addresses,
      },
      '0x2': {
        id: '0x2',
        name: 'Imported Account 2',
        type: AccountType.IMPORTED,
        ...addresses,
      },
    };

    return {
      primary: primaryAccounts,
      imported: importedAccounts,
      active:
        typeof active === 'number'
          ? primaryAccounts[active]
          : { ...importedAccounts[active], id: active },
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (storageService.load as jest.Mock).mockResolvedValue(emptyAccounts);
    (walletService.addAddress as jest.Mock).mockResolvedValue({
      [NetworkVMType.EVM]: evmAddress,
      [NetworkVMType.BITCOIN]: btcAddress,
      [NetworkVMType.AVM]: avmAddress,
      [NetworkVMType.PVM]: pvmAddress,
      [NetworkVMType.CoreEth]: coreEthAddress,
    });
    networkService.activeNetworkChanged.add = jest.fn();
    networkService.activeNetworkChanged.remove = jest.fn();
  });

  describe('getAccountList', () => {
    it('returns a flat list of all accounts', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      const accounts = accountsService.getAccountList();

      expect(accounts).toStrictEqual([
        {
          index: 0,
          id: 'uuid1',
          name: 'Account 1',
          type: AccountType.PRIMARY,
          ...getAllAddresses(),
        },
        {
          index: 1,
          id: 'uuid2',
          name: 'Account 2',
          type: AccountType.PRIMARY,
          ...getAllAddresses(),
        },
        {
          id: '0x1',
          name: 'Imported Account 1',
          type: AccountType.IMPORTED,
          ...getAllAddresses(),
        },
        {
          id: '0x2',
          name: 'Imported Account 2',
          type: AccountType.IMPORTED,
          ...getAllAddresses(),
        },
      ]);
    });
  });

  describe('isAlreadyImported', () => {
    it('returns true if the account has been already imported', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      expect(accountsService.isAlreadyImported(evmAddress)).toBe(true);
    });

    it('returns true if the account has not been imported yet', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      expect(accountsService.isAlreadyImported('some new address')).toBe(false);
    });
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
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);
    });

    it('init returns with accounts not from updating', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);

      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });

    it('init returns with accounts with missing addresses', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(false));
      (walletService.getAddresses as jest.Mock).mockResolvedValue({
        [NetworkVMType.EVM]: evmAddress,
        [NetworkVMType.BITCOIN]: btcAddress,
        [NetworkVMType.AVM]: avmAddress,
        [NetworkVMType.PVM]: pvmAddress,
        [NetworkVMType.CoreEth]: coreEthAddress,
      });
      (walletService.getImportedAddresses as jest.Mock)
        .mockResolvedValueOnce({ ...mockedAccounts.imported['0x1'], id: '0x1' })
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['0x2'],
          id: '0x2',
        });

      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(walletService.getAddresses).toBeCalledTimes(2);
      expect(walletService.getImportedAddresses).toBeCalledTimes(2);

      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });

    it('account addresses are updated on network change', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(true));
      (walletService.getAddresses as jest.Mock).mockResolvedValue({
        [NetworkVMType.EVM]: otherEvmAddress,
        [NetworkVMType.BITCOIN]: otherBtcAddress,
        [NetworkVMType.AVM]: avmAddress,
        [NetworkVMType.PVM]: pvmAddress,
        [NetworkVMType.CoreEth]: coreEthAddress,
      });
      (walletService.getImportedAddresses as jest.Mock)
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['0x1'],
          id: '0x1',
          addressC: otherEvmAddress,
          addressBTC: otherBtcAddress,
        })
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['0x2'],
          id: '0x2',
          addressC: otherEvmAddress,
          addressBTC: otherBtcAddress,
        });
      await accountsService.onUnlock();

      expect(walletService.getAddresses).not.toBeCalled();
      const accounts = accountsService.getAccounts();
      expect(accounts).toStrictEqual(mockedAccounts);

      expect(networkService.activeNetworkChanged.add).toBeCalledTimes(1);
      // this mocks a network change
      (networkService.activeNetworkChanged.add as jest.Mock).mock.calls[0][0]();
      await new Promise(process.nextTick);

      const updatedAccounts = accountsService.getAccounts();

      expect(updatedAccounts).toStrictEqual(mockAccounts(true, true));
    });
  });

  describe('onLock', () => {
    it('clears accounts and subscriptions on lock', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.onLock();
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);
      expect(
        (networkService.activeNetworkChanged.add as jest.Mock).mock.calls[0][0]
      ).toBe(
        (networkService.activeNetworkChanged.remove as jest.Mock).mock
          .calls[0][0]
      );
    });

    it('emits ACCOUNTS_UPDATED event when onLock is called', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();
      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);
      accountsService.onLock();
      expect(eventListener).toHaveBeenCalledWith(emptyAccounts);
    });
  });

  describe('getAccounts', () => {
    it('returns accounts', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });
  });

  describe('addAccount', () => {
    describe('primary account', () => {
      it('adds account with index 0 when no accounts', async () => {
        const uuid = 'uuid';
        (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        await accountsService.onUnlock();

        expect(storageService.load).toBeCalledTimes(1);
        expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
        expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);

        await accountsService.addAccount('Account name');
        expect(walletService.addAddress).toBeCalledTimes(1);
        expect(walletService.addAddress).toBeCalledWith(0);

        const accounts = accountsService.getAccounts();
        expect(accounts).toStrictEqual({
          primary: [
            {
              ...getAllAddresses(),
              index: 0,
              id: uuid,
              name: 'Account name',
              type: AccountType.PRIMARY,
            },
          ],
          imported: {},
          active: undefined,
        });
      });

      it('sets default name when no name is given', async () => {
        const uuid = 'uuid';
        (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

        const mockedAccounts = mockAccounts(true);
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
        await accountsService.onUnlock();

        expect(storageService.load).toBeCalledTimes(1);
        expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
        expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

        await accountsService.addAccount();
        expect(walletService.addAddress).toBeCalledTimes(1);
        expect(walletService.addAddress).toBeCalledWith(2);

        const accounts = accountsService.getAccounts();

        const newAccounts = { ...mockedAccounts };
        newAccounts.primary.push({
          index: 2,
          id: uuid,
          name: 'Account 3',
          ...getAllAddresses(),
          type: AccountType.PRIMARY,
        } as any);

        expect(accounts).toStrictEqual(newAccounts);
      });

      it('adds account to end of accounts array', async () => {
        const uuid = 'uuid';
        (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

        const mockedAccounts = mockAccounts(true);
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
        await accountsService.onUnlock();
        expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

        await accountsService.addAccount('New Account');
        expect(walletService.addAddress).toBeCalledTimes(1);
        expect(walletService.addAddress).toBeCalledWith(2);

        const accounts = accountsService.getAccounts();

        const newAccounts = { ...mockedAccounts };
        newAccounts.primary.push({
          index: 2,
          id: uuid,
          name: 'New Account',
          ...getAllAddresses(),
          type: AccountType.PRIMARY,
        } as any);

        expect(accounts).toStrictEqual(newAccounts);
      });

      it('emits event when account added', async () => {
        const uuid = 'uuid';
        (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

        const mockedAccounts = mockAccounts(true);
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
        const eventListener = jest.fn();
        await accountsService.onUnlock();
        accountsService.addListener(
          AccountsEvents.ACCOUNTS_UPDATED,
          eventListener
        );
        await accountsService.addAccount('New Account');

        const newAccounts = { ...mockedAccounts };
        newAccounts.primary.push({
          index: 2,
          id: uuid,
          name: 'New Account',
          ...getAllAddresses(),
          type: AccountType.PRIMARY,
        } as any);

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith(newAccounts);
      });
    });

    describe('imported account', () => {
      const uuidMock = 'some unique id';
      const commitMock = jest.fn();

      it('adds account to the imported list correctly', async () => {
        const options = {
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        };
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        await accountsService.onUnlock();

        expect(storageService.load).toBeCalledTimes(1);
        expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
        expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);

        (walletService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
          account: {
            ...getAllAddresses(),
            id: uuidMock,
          },
          commit: commitMock,
        });

        await accountsService.addAccount('Account name', options);
        expect(walletService.addImportedWallet).toBeCalledTimes(1);
        expect(walletService.addImportedWallet).toBeCalledWith(options);
        expect(commitMock).toHaveBeenCalled();

        const accounts = accountsService.getAccounts();
        expect(accounts).toStrictEqual({
          primary: [],
          imported: {
            [uuidMock]: {
              id: uuidMock,
              ...getAllAddresses(),
              name: 'Account name',
              type: AccountType.IMPORTED,
            },
          },
          active: undefined,
        });
      });

      it('sets default name when no name is given', async () => {
        const options = {
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        };
        const mockedAccounts = mockAccounts(true);
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
        await accountsService.onUnlock();

        expect(storageService.load).toBeCalledTimes(1);
        expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
        expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

        (walletService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
          account: {
            ...getAllAddresses(true),
            id: uuidMock,
          },
          commit: commitMock,
        });

        await accountsService.addAccount('', options);
        expect(walletService.addImportedWallet).toBeCalledTimes(1);
        expect(walletService.addImportedWallet).toBeCalledWith(options);
        expect(commitMock).toHaveBeenCalled();

        const accounts = accountsService.getAccounts();

        const newAccounts = {
          ...mockedAccounts,
          imported: {
            ...mockedAccounts.imported,
            [uuidMock]: {
              id: uuidMock,
              ...getAllAddresses(true),
              name: 'Imported Account 3',
              type: AccountType.IMPORTED,
            },
          },
        };

        expect(accounts).toStrictEqual(newAccounts);
      });

      it('emits event when account added', async () => {
        const options = {
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        };
        const mockedAccounts = mockAccounts(true);
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
        const eventListener = jest.fn();
        await accountsService.onUnlock();
        accountsService.addListener(
          AccountsEvents.ACCOUNTS_UPDATED,
          eventListener
        );

        (walletService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
          account: {
            ...getAllAddresses(true),
            id: uuidMock,
          },
          commit: commitMock,
        });

        await accountsService.addAccount('New Account', options);

        const newAccounts = {
          ...mockedAccounts,
          imported: {
            ...mockedAccounts.imported,
            [uuidMock]: {
              id: uuidMock,
              ...getAllAddresses(true),
              name: 'New Account',
              type: AccountType.IMPORTED,
            },
          },
        };

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith(newAccounts);
      });

      it('throws on duplicate imported accounts', async () => {
        const options = {
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        };
        const mockedAccounts = mockAccounts(true);
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );
        (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
        await accountsService.onUnlock();

        expect(storageService.load).toBeCalledTimes(1);
        expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
        expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

        (walletService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
          account: {
            ...getAllAddresses(),
            id: uuidMock,
          },
          commit: commitMock,
        });

        await expect(
          accountsService.addAccount('', options)
        ).rejects.toThrowError(
          'Account import failed with error: Account has been already imported'
        );
        expect(walletService.addImportedWallet).toBeCalledTimes(1);
        expect(walletService.addImportedWallet).toBeCalledWith(options);
        expect(commitMock).not.toHaveBeenCalled();
      });

      it('throws on error', async () => {
        const errorMessage = 'some error';
        const options = {
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        };
        const accountsService = new AccountsService(
          storageService,
          walletService,
          networkService
        );

        (walletService.addImportedWallet as jest.Mock).mockRejectedValueOnce(
          new Error(errorMessage)
        );

        await expect(
          accountsService.addAccount('New Account', options)
        ).rejects.toThrow(`Account import failed with error: ${errorMessage}`);
      });
    });
  });

  describe('setAccountName', () => {
    it('throws error if account not found', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);

      await expect(
        accountsService.setAccountName('unknown-uuid', 'updated name')
      ).rejects.toThrow('Account rename failed: account not found');
    });

    it('throws error if account has unknown type', async () => {
      const uuid = 'uuid';

      const accountsWithUnknownTypeMock = {
        primary: [
          {
            id: uuid,
            type: 'unknown',
            name: 'name',
            addressC: 'addressC',
            addressBTC: 'addressBTC',
          },
        ],
        imported: {},
      };

      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(
        accountsWithUnknownTypeMock
      );
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(
        accountsWithUnknownTypeMock
      );

      await expect(
        accountsService.setAccountName(uuid, 'updated name')
      ).rejects.toThrow('Account rename failed: unknown account type');
    });

    it('renames primary accounts correctly', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('uuid2', 'Updated Name');
      const accounts = accountsService.getAccounts();
      const expectedAccounts = { ...mockedAccounts };
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expectedAccounts.primary[1]!.name = 'Updated Name';
      expect(accounts).toStrictEqual(expectedAccounts);
    });

    it('renames imported accounts correctly', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('0x1', 'Updated Name');
      const accounts = accountsService.getAccounts();
      const expectedAccounts = { ...mockedAccounts };
      expectedAccounts.imported['0x1'].name = 'Updated Name';
      expect(accounts).toStrictEqual(expectedAccounts);
    });

    it('emits event if name changes', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );

      await accountsService.setAccountName('uuid2', 'Updated Name');
      await accountsService.setAccountName('uuid2', 'Updated Name');
      await accountsService.setAccountName('uuid2', 'Updated Name');

      const result = accountsService.getAccounts();
      const expectedAccounts = mockAccounts(true);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expectedAccounts.primary[1]!.name = 'Updated Name';

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
    });
  });

  describe('activateAccount', () => {
    it('throws error if account not found', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await expect(
        accountsService.activateAccount('unknow-uuid')
      ).rejects.toThrow('Account activation failed: account not found');
    });

    it('changes primary account to active', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.activateAccount('uuid2');
      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockAccounts(true, false, 1));
    });

    it('changes imported account to active', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.activateAccount('0x1');
      const accounts = accountsService.getAccounts();

      const newAccounts = mockAccounts(true, false, '0x1');
      newAccounts.active = {
        ...newAccounts.active,
        id: '0x1',
      };
      expect(accounts).toStrictEqual(newAccounts);
    });

    it('emits event when activateAccount is called', async () => {
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(true));
      const eventListener = jest.fn();
      await accountsService.onUnlock();

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );

      await accountsService.activateAccount('uuid2');
      expect(eventListener).toHaveBeenCalledWith(mockAccounts(true, false, 1));
    });
  });

  describe('deleteAccounts', () => {
    it('removes the imported accounts and their secrets', async () => {
      const mockedAccounts = mockAccounts(true);
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );

      await accountsService.deleteAccounts(['0x1', '0x2']);

      const result = accountsService.getAccounts();
      const expectedAccounts = { ...mockedAccounts, imported: {} };

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
      expect(walletService.deleteImportedWallets).toHaveBeenCalledWith([
        '0x1',
        '0x2',
      ]);
    });

    it('changes the active account if deleted', async () => {
      const mockedAccounts = mockAccounts(true, false, '0x1');
      const accountsService = new AccountsService(
        storageService,
        walletService,
        networkService
      );
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener
      );

      await accountsService.deleteAccounts(['0x1']);

      const result = accountsService.getAccounts();
      const expectedAccounts = {
        ...mockedAccounts,
        active: mockedAccounts.primary[0],
      };
      delete (expectedAccounts.imported as any)['0x1'];

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
    });
  });
});
