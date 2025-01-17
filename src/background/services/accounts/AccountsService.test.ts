import { NetworkService } from '../network/NetworkService';
import { AccountsService } from './AccountsService';
import { StorageService } from '../storage/StorageService';
import { LedgerService } from '../ledger/LedgerService';
import {
  AccountsEvents,
  ACCOUNTS_STORAGE_KEY,
  AccountType,
  ImportType,
  ImportData,
} from './models';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { WalletConnectStorage } from '../walletConnect/WalletConnectStorage';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { PermissionsService } from '../permissions/PermissionsService';
import { SecretsService } from '../secrets/SecretsService';
import { isProductionBuild } from '@src/utils/environment';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { SecretType } from '../secrets/models';

jest.mock('../storage/StorageService');
jest.mock('../secrets/SecretsService');
jest.mock('../ledger/LedgerService');
jest.mock('../lock/LockService');
jest.mock('../permissions/PermissionsService');
jest.mock('../analytics/utils/encryptAnalyticsData');
jest.mock('@src/utils/environment');

const WALLET_ID = 'wallet-id';

describe('background/services/accounts/AccountsService', () => {
  const networkService = new NetworkService(
    {} as any,
    { addListener: jest.fn() } as any,
  );
  const storageService = new StorageService({} as any);
  const ledgerService = new LedgerService();
  const walletConnectService = new WalletConnectService(
    new WalletConnectStorage(storageService),
  );
  const secretsService = new SecretsService(storageService);

  const permissionsService = new PermissionsService({} as any);

  const analyticsServicePosthog = new AnalyticsServicePosthog(
    {} as any,
    {} as any,
    {} as any,
  );

  let accountsService: AccountsService;
  const emptyAccounts = {
    primary: {},
    imported: {},
    active: undefined,
  };

  const walletId = 'wallet-id';
  const secondaryWalletId = 'secondary-wallet-id';

  const evmAddress = '0x000000000';
  const btcAddress = 'btc000000000';
  const avmAddress = 'X-';
  const pvmAddress = 'P-';
  const coreEthAddress = 'C-';
  const otherEvmAddress = '0x000000001';
  const otherBtcAddress = 'btc000000001';
  const hvmAddress = undefined;

  const getAllAddresses = (useOtherAddresses = false) => ({
    addressC: useOtherAddresses ? otherEvmAddress : evmAddress,
    addressBTC: useOtherAddresses ? otherBtcAddress : btcAddress,
    addressAVM: avmAddress,
    addressPVM: pvmAddress,
    addressCoreEth: coreEthAddress,
    addressHVM: hvmAddress,
  });

  const mockAccounts = (
    withAddresses = false,
    withOtherAddresses = false,
    active: number | string = 0,
  ) => {
    const addresses = withAddresses ? getAllAddresses(withOtherAddresses) : {};

    const primaryAccounts = {
      [walletId]: [
        {
          index: 0,
          id: 'uuid1',
          name: 'Account 1',
          type: AccountType.PRIMARY,
          walletId,
          ...addresses,
        },
        {
          index: 1,
          id: 'uuid2',
          name: 'Account 2',
          type: AccountType.PRIMARY,
          walletId,
          ...addresses,
        },
      ],
      [secondaryWalletId]: [
        {
          index: 0,
          id: 'uuid3',
          name: 'Wallet 2 Account 1',
          type: AccountType.PRIMARY,
          walletId: secondaryWalletId,
          ...addresses,
        },
      ],
    };
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
      'fb-acc': {
        id: 'fb-acc',
        name: 'Fireblocks account',
        type: AccountType.FIREBLOCKS,
      },
    };

    return {
      primary: primaryAccounts,
      imported: importedAccounts,
      active:
        typeof active === 'number'
          ? primaryAccounts[walletId][active]
          : { ...importedAccounts[active], id: active },
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (storageService.load as jest.Mock).mockResolvedValue(emptyAccounts);
    analyticsServicePosthog.captureEncryptedEvent = jest.fn();
    (secretsService.addAddress as jest.Mock).mockResolvedValue({
      [NetworkVMType.EVM]: evmAddress,
      [NetworkVMType.BITCOIN]: btcAddress,
      [NetworkVMType.AVM]: avmAddress,
      [NetworkVMType.PVM]: pvmAddress,
      [NetworkVMType.CoreEth]: coreEthAddress,
      [NetworkVMType.HVM]: hvmAddress,
    });
    networkService.developerModeChanged.add = jest.fn();
    networkService.developerModeChanged.remove = jest.fn();
    accountsService = new AccountsService(
      storageService,
      networkService,
      permissionsService,
      analyticsServicePosthog,
      secretsService,
      ledgerService,
      walletConnectService,
    );
  });

  describe('getAccountList', () => {
    it('returns a flat list of all accounts', async () => {
      const mockedAccounts = mockAccounts(true);

      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      const accounts = accountsService.getAccountList();

      expect(accounts).toStrictEqual([
        {
          index: 0,
          id: 'uuid1',
          name: 'Account 1',
          type: AccountType.PRIMARY,
          walletId,
          ...getAllAddresses(),
        },
        {
          index: 1,
          id: 'uuid2',
          name: 'Account 2',
          type: AccountType.PRIMARY,
          walletId,
          ...getAllAddresses(),
        },
        {
          index: 0,
          id: 'uuid3',
          name: 'Wallet 2 Account 1',
          type: AccountType.PRIMARY,
          walletId: secondaryWalletId,
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
        { id: 'fb-acc', name: 'Fireblocks account', type: 'fireblocks' },
      ]);
    });
  });

  describe('onUnlock', () => {
    it('init returns with no accounts from storage', async () => {
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);
    });

    it('init returns with accounts not from updating', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);

      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });

    it('init returns with accounts with missing addresses', async () => {
      const mockedAccounts = mockAccounts(true);

      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(false));
      (secretsService.getAddresses as jest.Mock).mockResolvedValue({
        [NetworkVMType.EVM]: evmAddress,
        [NetworkVMType.BITCOIN]: btcAddress,
        [NetworkVMType.AVM]: avmAddress,
        [NetworkVMType.PVM]: pvmAddress,
        [NetworkVMType.CoreEth]: coreEthAddress,
        [NetworkVMType.HVM]: hvmAddress,
      });
      (secretsService.getImportedAddresses as jest.Mock)
        .mockResolvedValueOnce({ ...mockedAccounts.imported['0x1'], id: '0x1' })
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['0x2'],
          id: '0x2',
        });

      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(secretsService.getAddresses).toBeCalledTimes(3);
      expect(secretsService.getAddresses).toHaveBeenNthCalledWith(
        1,
        0,
        walletId,
        networkService,
      );
      expect(secretsService.getAddresses).toHaveBeenNthCalledWith(
        2,
        1,
        walletId,
        networkService,
      );
      expect(secretsService.getImportedAddresses).toBeCalledTimes(3);

      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });

    it('account addresses are updated on developer mode change', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(true));
      (secretsService.getAddresses as jest.Mock).mockResolvedValue({
        [NetworkVMType.EVM]: otherEvmAddress,
        [NetworkVMType.BITCOIN]: otherBtcAddress,
        [NetworkVMType.AVM]: avmAddress,
        [NetworkVMType.PVM]: pvmAddress,
        [NetworkVMType.CoreEth]: coreEthAddress,
        [NetworkVMType.HVM]: hvmAddress,
      });
      (secretsService.getImportedAddresses as jest.Mock)
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['fb-acc'],
        })
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
        })
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['fb-acc'],
        });

      await accountsService.onUnlock();

      expect(secretsService.getAddresses).not.toBeCalled();
      const accounts = accountsService.getAccounts();
      expect(accounts).toStrictEqual(mockedAccounts);

      expect(networkService.developerModeChanged.add).toBeCalledTimes(1);
      // this mocks a network change
      (networkService.developerModeChanged.add as jest.Mock).mock.calls[0][0]();
      await new Promise(process.nextTick);

      const updatedAccounts = accountsService.getAccounts();

      expect(updatedAccounts).toStrictEqual(mockAccounts(true, true));
    });
  });

  describe('.refreshAddressesForAccount()', () => {
    let mockedAccounts;

    beforeEach(async () => {
      mockedAccounts = mockAccounts(true);
      jest.mocked(storageService.load).mockResolvedValue(mockedAccounts);
      jest.mocked(secretsService.getAddresses).mockResolvedValue({
        [NetworkVMType.EVM]: otherEvmAddress,
        [NetworkVMType.BITCOIN]: otherBtcAddress,
        [NetworkVMType.AVM]: avmAddress,
        [NetworkVMType.PVM]: pvmAddress,
        [NetworkVMType.CoreEth]: coreEthAddress,
        [NetworkVMType.HVM]: otherEvmAddress,
      });

      await accountsService.onUnlock();
    });

    it('correctly updates addresses for selected primary account', async () => {
      jest
        .mocked(secretsService.getImportedAddresses)
        .mockImplementation((id) => mockedAccounts.imported[id]);
      await accountsService.refreshAddressesForAccount(
        mockedAccounts.primary[walletId][0]?.id as string,
      );

      expect(secretsService.getAddresses).toHaveBeenCalledTimes(1);
      expect(accountsService.getAccounts().primary[0]).toEqual(
        mockAccounts(true, true).primary[0],
      );
    });

    it('correctly updates addresses for selected imported account', async () => {
      jest
        .mocked(secretsService.getImportedAddresses)
        .mockImplementation((id) => {
          if (id === 'fb-acc') {
            return {
              ...mockedAccounts.imported['fb-acc'],
              addressC: 'addressC-new',
            };
          }

          return mockedAccounts.imported[id];
        });

      await accountsService.refreshAddressesForAccount('fb-acc');

      expect(secretsService.getImportedAddresses).toHaveBeenCalledWith(
        'fb-acc',
        networkService,
      );
      expect(secretsService.getAddresses).toHaveBeenCalledTimes(0);
      expect(accountsService.getAccounts().imported['fb-acc']).toEqual({
        ...mockAccounts(true, true).imported['fb-acc'],
        addressC: 'addressC-new',
      });
    });
  });

  describe('when testnet mode gets enabled and fireblocks account is active', () => {
    beforeEach(() => {
      jest.mocked(isProductionBuild).mockReturnValue(true);
    });

    it('activates the primary account', async () => {
      const mockedAccounts = mockAccounts(true, false, 'fb-acc');
      jest.spyOn(accountsService, 'activateAccount');
      jest.mocked(storageService.load).mockResolvedValue(mockedAccounts);
      jest.mocked(secretsService.getAddresses).mockResolvedValue({
        [NetworkVMType.EVM]: otherEvmAddress,
        [NetworkVMType.BITCOIN]: otherBtcAddress,
        [NetworkVMType.AVM]: avmAddress,
        [NetworkVMType.PVM]: pvmAddress,
        [NetworkVMType.CoreEth]: coreEthAddress,
        [NetworkVMType.HVM]: otherEvmAddress,
      });
      jest
        .mocked(secretsService.getImportedAddresses)
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['0x1'],
          addressC: otherEvmAddress,
          addressBTC: otherBtcAddress,
        })
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['0x2'],
          addressC: otherEvmAddress,
          addressBTC: otherBtcAddress,
        })
        .mockResolvedValueOnce({
          ...mockedAccounts.imported['fb-acc'],
          addressC: 'addressC',
        });

      await accountsService.onUnlock();

      const testnetModeListener = jest.mocked(
        networkService.developerModeChanged.add,
      ).mock.calls[0]?.[0];

      // mocks a change to testnet
      testnetModeListener?.(true);

      await new Promise(process.nextTick);

      expect(accountsService.activateAccount).toHaveBeenCalledWith(
        mockedAccounts.primary[walletId][0]?.id,
      );
    });
  });

  describe('onLock', () => {
    it('clears accounts and subscriptions on lock', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.onLock();
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);
      expect(
        (networkService.developerModeChanged.add as jest.Mock).mock.calls[0][0],
      ).toBe(
        (networkService.developerModeChanged.remove as jest.Mock).mock
          .calls[0][0],
      );
    });

    it('emits ACCOUNTS_UPDATED event when onLock is called', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();
      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);
      accountsService.onLock();
      expect(eventListener).toHaveBeenCalledWith(emptyAccounts);
    });
  });

  describe('getAccounts', () => {
    it('returns accounts', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });
  });

  describe('addPrimaryAccount()', () => {
    it('should thrown an error because of missing addresses', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValue(uuid);

      await accountsService.onUnlock();
      (secretsService.addAddress as jest.Mock).mockResolvedValueOnce({});

      await expect(
        accountsService.addPrimaryAccount({
          name: 'Account name',
          walletId,
        }),
      ).rejects.toThrow(new Error('The account has no EVM or BTC address'));
    });
    it('adds account with index 0 when no accounts', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValue(uuid);

      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);

      await accountsService.addPrimaryAccount({
        name: 'Account name',
        walletId,
      });
      expect(secretsService.addAddress).toBeCalledTimes(1);
      expect(secretsService.addAddress).toBeCalledWith({
        index: 0,
        walletId: WALLET_ID,
        networkService,
        ledgerService,
      });

      const accounts = accountsService.getAccounts();
      expect(accounts).toStrictEqual({
        primary: {
          [walletId]: [
            {
              ...getAllAddresses(),
              index: 0,
              id: uuid,
              name: 'Account 1',
              type: AccountType.PRIMARY,
              walletId,
            },
          ],
        },
        imported: {},
        active: undefined,
      });

      expect(
        analyticsServicePosthog.captureEncryptedEvent,
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          windowId: uuid,
          name: 'addedNewPrimaryAccount',
          properties: { addresses: Object.values(getAllAddresses()) },
        }),
      );
    });

    it('sets default name when no name is given', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

      const mockedAccounts = mockAccounts(true);

      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.addPrimaryAccount({ walletId: WALLET_ID });
      expect(secretsService.addAddress).toBeCalledTimes(1);
      expect(secretsService.addAddress).toBeCalledWith({
        index: 2,
        walletId: WALLET_ID,
        networkService,
        ledgerService,
      });
      expect(permissionsService.addWhitelistDomains).toBeCalledTimes(1);
      expect(permissionsService.addWhitelistDomains).toBeCalledWith(
        '0x000000000',
      );

      const accounts = accountsService.getAccounts();

      const newAccounts = { ...mockedAccounts };
      newAccounts.primary[walletId].push({
        index: 2,
        id: uuid,
        name: 'Account 3',
        ...getAllAddresses(),
        type: AccountType.PRIMARY,
        walletId,
      } as any);

      expect(accounts).toStrictEqual(newAccounts);
    });

    it('adds account to end of accounts array', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

      const mockedAccounts = mockAccounts(true);

      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.addPrimaryAccount({
        name: 'New Account',
        walletId: WALLET_ID,
      });
      expect(secretsService.addAddress).toBeCalledTimes(1);
      expect(secretsService.addAddress).toBeCalledWith({
        index: 2,
        walletId: WALLET_ID,
        networkService,
        ledgerService,
      });
      expect(permissionsService.addWhitelistDomains).toBeCalledTimes(1);
      expect(permissionsService.addWhitelistDomains).toBeCalledWith(
        '0x000000000',
      );

      const accounts = accountsService.getAccounts();

      const newAccounts = { ...mockedAccounts };
      newAccounts.primary[walletId].push({
        index: 2,
        id: uuid,
        name: 'Account 3',
        ...getAllAddresses(),
        type: AccountType.PRIMARY,
        walletId,
      } as any);

      expect(accounts).toStrictEqual(newAccounts);
    });

    it('emits event when account added', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();
      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );
      await accountsService.addPrimaryAccount({
        name: 'New Account',
        walletId: WALLET_ID,
      });
      expect(permissionsService.addWhitelistDomains).toBeCalledTimes(1);
      expect(permissionsService.addWhitelistDomains).toBeCalledWith(
        '0x000000000',
      );

      const newAccounts = { ...mockedAccounts };
      newAccounts.primary[walletId].push({
        index: 2,
        id: uuid,
        name: 'Account 3',
        ...getAllAddresses(),
        type: AccountType.PRIMARY,
        walletId,
      } as any);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(newAccounts);
    });
  });

  describe('addImportedAccount()', () => {
    const uuidMock = 'some unique id';
    const commitMock = jest.fn();

    it('adds account to the imported list correctly', async () => {
      const options: ImportData = {
        importType: ImportType.PRIVATE_KEY,
        data: 'privateKey',
      };
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);

      (secretsService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
        account: {
          ...getAllAddresses(),
          id: uuidMock,
        },
        commit: commitMock,
      });

      await accountsService.addImportedAccount({
        name: 'Account name',
        options,
      });
      expect(secretsService.addImportedWallet).toBeCalledTimes(1);
      expect(secretsService.addImportedWallet).toBeCalledWith(
        options,
        networkService,
      );
      expect(commitMock).toHaveBeenCalled();
      expect(permissionsService.addWhitelistDomains).toBeCalledTimes(1);
      expect(permissionsService.addWhitelistDomains).toBeCalledWith(
        '0x000000000',
      );

      const accounts = accountsService.getAccounts();
      expect(accounts).toStrictEqual({
        primary: {},
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

      expect(
        analyticsServicePosthog.captureEncryptedEvent,
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'addedNewImportedAccount',
          properties: { addresses: Object.values(getAllAddresses()) },
        }),
      );
    });

    it('sets default name when no name is given', async () => {
      const options: ImportData = {
        importType: ImportType.PRIVATE_KEY,
        data: 'privateKey',
      };
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      (secretsService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
        account: {
          ...getAllAddresses(true),
          id: uuidMock,
        },
        commit: commitMock,
      });

      await accountsService.addImportedAccount({ options });
      expect(secretsService.addImportedWallet).toBeCalledTimes(1);
      expect(secretsService.addImportedWallet).toBeCalledWith(
        options,
        networkService,
      );
      expect(commitMock).toHaveBeenCalled();
      expect(permissionsService.addWhitelistDomains).toBeCalledTimes(1);
      expect(permissionsService.addWhitelistDomains).toBeCalledWith(
        '0x000000001',
      );

      const accounts = accountsService.getAccounts();

      const newAccounts = {
        ...mockedAccounts,
        imported: {
          ...mockedAccounts.imported,
          [uuidMock]: {
            id: uuidMock,
            ...getAllAddresses(true),
            name: 'Imported Account 4',
            type: AccountType.IMPORTED,
          },
        },
      };

      expect(accounts).toStrictEqual(newAccounts);
    });

    it('emits event when account added', async () => {
      const options: ImportData = {
        importType: ImportType.PRIVATE_KEY,
        data: 'privateKey',
      };
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();
      await accountsService.onUnlock();
      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      (secretsService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
        account: {
          ...getAllAddresses(true),
          id: uuidMock,
        },
        commit: commitMock,
      });

      await accountsService.addImportedAccount({
        name: 'New Account',
        options,
      });
      expect(permissionsService.addWhitelistDomains).toBeCalledTimes(1);
      expect(permissionsService.addWhitelistDomains).toBeCalledWith(
        '0x000000001',
      );

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

    it('returns the existing account id on duplicated accounts imports', async () => {
      const options: ImportData = {
        importType: ImportType.PRIVATE_KEY,
        data: 'privateKey',
      };
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      (secretsService.addImportedWallet as jest.Mock).mockResolvedValueOnce({
        account: {
          ...getAllAddresses(),
          id: '0x1',
        },
        commit: commitMock,
      });

      expect(await accountsService.addImportedAccount({ options })).toEqual(
        '0x1',
      );
      expect(secretsService.addImportedWallet).toBeCalledTimes(1);
      expect(secretsService.addImportedWallet).toBeCalledWith(
        options,
        networkService,
      );
      expect(commitMock).not.toHaveBeenCalled();
      expect(permissionsService.addWhitelistDomains).not.toHaveBeenCalled();
    });

    it('throws on error', async () => {
      const errorMessage = 'some error';
      const options: ImportData = {
        importType: ImportType.PRIVATE_KEY,
        data: 'privateKey',
      };

      (secretsService.addImportedWallet as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );
      expect(permissionsService.addWhitelistDomains).not.toHaveBeenCalled();

      await expect(
        accountsService.addImportedAccount({ name: 'New Account', options }),
      ).rejects.toThrow(`Account import failed with error: ${errorMessage}`);
    });
  });

  describe('setAccountName', () => {
    it('throws error if account not found', async () => {
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(emptyAccounts);

      await expect(
        accountsService.setAccountName('unknown-uuid', 'updated name'),
      ).rejects.toThrow('Account rename failed: account not found');
    });

    it('only modifies the account belonging to other wallets', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('uuid3', 'Updated Name');

      const accounts = accountsService.getAccounts();

      expect(accounts.primary[walletId]).toEqual(
        mockedAccounts.primary[walletId],
      );

      expect(accounts.primary[secondaryWalletId]).toEqual([
        { ...accounts.primary[secondaryWalletId]![0], name: 'Updated Name' },
      ]);
    });

    it('renames primary accounts correctly', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('uuid2', 'Updated Name');
      const accounts = accountsService.getAccounts();
      const expectedAccounts = { ...mockedAccounts };

      expectedAccounts.primary[walletId][1]!.name = 'Updated Name';
      expect(accounts).toStrictEqual(expectedAccounts);
    });

    it('renames imported accounts correctly', async () => {
      const mockedAccounts = mockAccounts(true);
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
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.setAccountName('uuid2', 'Updated Name');
      await accountsService.setAccountName('uuid2', 'Updated Name');
      await accountsService.setAccountName('uuid2', 'Updated Name');

      const result = accountsService.getAccounts();
      const expectedAccounts = mockAccounts(true);

      expectedAccounts.primary[walletId][1]!.name = 'Updated Name';

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
    });
  });

  describe('activateAccount', () => {
    it('throws error if account not found', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await expect(
        accountsService.activateAccount('unknow-uuid'),
      ).rejects.toThrow('Account activation failed: account not found');
    });

    it('changes primary account to active', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.activateAccount('uuid2');
      const accounts = accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockAccounts(true, false, 1));
    });

    it('changes imported account to active', async () => {
      const mockedAccounts = mockAccounts(true);
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
      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(true));
      const eventListener = jest.fn();
      await accountsService.onUnlock();

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.activateAccount('uuid2');
      expect(eventListener).toHaveBeenCalledWith(mockAccounts(true, false, 1));
    });
  });

  describe('deleteAccounts', () => {
    it('removes the imported accounts and their secrets', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.deleteAccounts(['0x1', '0x2']);

      const result = accountsService.getAccounts();
      const expectedAccounts = {
        ...mockedAccounts,
        imported: {
          'fb-acc': {
            id: 'fb-acc',
            name: 'Fireblocks account',
            type: 'fireblocks',
          },
        },
      };

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
      expect(secretsService.deleteImportedWallets).toHaveBeenCalledWith(
        ['0x1', '0x2'],
        walletConnectService,
      );
    });

    it('changes the active account if deleted', async () => {
      const mockedAccounts = mockAccounts(true, false, '0x1');

      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.deleteAccounts(['0x1']);

      const result = accountsService.getAccounts();
      const expectedAccounts = {
        ...mockedAccounts,
        active: mockedAccounts.primary[walletId][0],
      };
      delete (expectedAccounts.imported as any)['0x1'];

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
    });

    it('should throw an error because of all the primary accounts cannot be deleted', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(
        async () =>
          await accountsService.deleteAccounts(['uuid1', 'uuid2', 'uuid3']),
      ).rejects.toThrow('You cannot delete all of your primary accounts');
    });

    it('should throw an error because a seedles account cannot be deleted', async () => {
      const mockedAccounts = mockAccounts(true);
      (secretsService.getWalletType as jest.Mock).mockReturnValue(
        SecretType.Seedless,
      );

      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(
        async () => await accountsService.deleteAccounts(['uuid1']),
      ).rejects.toThrow('You cannot delete a seedless account!');
    });
    it('should delete a primary account', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      const result = await accountsService.deleteAccounts(['uuid1']);
      expect(result).toBe(1);

      const accounts = accountsService.getAccounts();
      const primaryAccounts = accounts.primary[walletId];
      expect(primaryAccounts && primaryAccounts.length).toBe(1);
    });
  });
});
