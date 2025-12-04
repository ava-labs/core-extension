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
  Account,
  SecretType,
  AccountError,
  Accounts,
  MnemonicSecrets,
  LedgerSecrets,
} from '@core/types';
import { WalletConnectStorage } from '../walletConnect/WalletConnectStorage';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { PermissionsService } from '../permissions/PermissionsService';
import { SecretsService } from '../secrets/SecretsService';
import { emptyAddresses } from '../secrets/utils';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { AddressResolver } from '../secrets/AddressResolver';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  isProductionBuild,
  mapAddressesToVMs,
  mapVMAddresses,
} from '@core/common';
import { expectToThrowErrorCode } from '@shared/tests/test-utils';
import { NetworkVMType } from '@avalabs/vm-module-types';

jest.mock('../storage/StorageService');
jest.mock('../secrets/SecretsService');
jest.mock('../ledger/LedgerService');
jest.mock('../lock/LockService');
jest.mock('../permissions/PermissionsService');
jest.mock('../secrets/AddressResolver');
jest.mock('../analytics/utils/encryptAnalyticsData');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      ACCOUNTS: 'accounts',
    },
  },
  isProductionBuild: jest.fn(),
}));

const WALLET_ID = 'wallet-id';

describe('background/services/accounts/AccountsService', () => {
  const networkService = new NetworkService(
    {} as any,
    { addListener: jest.fn() } as any,
    {} as any,
  );
  networkService.getUnknownUsedNetwork = jest.fn();
  const storageService = new StorageService({} as any);
  const ledgerService = new LedgerService();
  const walletConnectService = new WalletConnectService(
    new WalletConnectStorage(storageService),
  );
  const secretsService = new SecretsService(storageService);
  const addressResolver = new AddressResolver(networkService, secretsService);
  addressResolver.init({
    loadModuleByNetwork: jest.fn(),
  } as unknown as ModuleManager);

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
  const hvmAddress = 'hvm0000001';

  const getAllAddresses = (useOtherAddresses = false) => ({
    addressC: useOtherAddresses ? otherEvmAddress : evmAddress,
    addressBTC: useOtherAddresses ? otherBtcAddress : btcAddress,
    addressAVM: avmAddress,
    addressPVM: pvmAddress,
    addressCoreEth: coreEthAddress,
    addressHVM: hvmAddress,
  });

  const getAllAddressesByVMs = (useOtherAddresses = false) => ({
    [NetworkVMType.EVM]: useOtherAddresses ? otherEvmAddress : evmAddress,
    [NetworkVMType.BITCOIN]: useOtherAddresses ? otherBtcAddress : btcAddress,
    [NetworkVMType.AVM]: avmAddress,
    [NetworkVMType.PVM]: pvmAddress,
    [NetworkVMType.CoreEth]: coreEthAddress,
    [NetworkVMType.HVM]: hvmAddress,
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
        ...(withAddresses
          ? ({
              addressC: withOtherAddresses ? otherEvmAddress : evmAddress,
            } as any)
          : {}),
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

  const mockAddressResolution = (useOtherAddresses = false) => {
    const mockedSecrets = {
      derivationPathSpec: DerivationPath.BIP44,
    } as any;
    jest
      .mocked(secretsService.getPrimaryAccountSecrets)
      .mockResolvedValue(mockedSecrets);
    jest
      .mocked(addressResolver.getAddressesForSecretId)
      .mockImplementation(async (id) =>
        id === 'fb-acc'
          ? ({
              [NetworkVMType.EVM]: useOtherAddresses
                ? otherEvmAddress
                : evmAddress,
            } as any)
          : getAllAddressesByVMs(useOtherAddresses),
      );
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (storageService.load as jest.Mock).mockResolvedValue(emptyAccounts);
    analyticsServicePosthog.captureEncryptedEvent = jest.fn();
    (secretsService.addAddress as jest.Mock).mockResolvedValue(undefined);
    jest.mocked(secretsService.getSecretsById).mockResolvedValue({
      id: walletId,
      secretType: SecretType.Ledger,
    } as LedgerSecrets);
    addressResolver.getAddressesForSecretId = jest.fn();
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
      addressResolver,
    );
  });

  describe('getAccountList', () => {
    it('returns a flat list of all accounts', async () => {
      const mockedAccounts = mockAccounts(true);

      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      mockAddressResolution();

      await accountsService.onUnlock();

      const accounts = await accountsService.getAccountList();

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
        {
          id: 'fb-acc',
          name: 'Fireblocks account',
          type: 'fireblocks',
          addressC: evmAddress,
        },
      ]);
    });
  });

  describe('onUnlock', () => {
    it('attempts to derive missing keys', async () => {
      const active: Account = {
        index: 0,
        addressC: '0x1234...',
        addressBTC: 'btc1234...',
        addressAVM: 'X-1234...',
        addressPVM: 'P-1234...',
        addressCoreEth: 'C-1234...',
        addressHVM: 'hvm1234...',
        addressSVM: 'svm1234...',
        id: 'uuid1',
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId,
      };
      const mockedAccounts: Accounts = {
        active,
        imported: {},
        primary: {
          [walletId]: [
            active,
            {
              index: 1,
              addressC: '0x5678...',
              addressBTC: 'btc5678...',
              addressAVM: 'X-5678...',
              addressPVM: 'P-5678...',
              addressCoreEth: 'C-5678...',
              addressHVM: 'hvm5678...',
              addressSVM: '', // MISSING ADDRESS
              id: 'uuid2',
              name: 'Account 2',
              type: AccountType.PRIMARY,
              walletId,
            },
          ],
        },
      };

      mockAddressResolution();

      jest.mocked(secretsService.getSecretsById).mockResolvedValue({
        id: walletId,
        secretType: SecretType.Mnemonic,
      } as MnemonicSecrets);

      jest.mocked(storageService.load).mockResolvedValue(mockedAccounts);

      await accountsService.onUnlock();

      expect(secretsService.addAddress).toHaveBeenCalledTimes(1);
      expect(secretsService.addAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 1,
          walletId,
        }),
      );
    });
    it('init returns with no accounts from storage', async () => {
      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(await accountsService.getAccounts()).toStrictEqual(emptyAccounts);
    });

    it('init returns with accounts not from updating', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      mockAddressResolution();

      await accountsService.onUnlock();

      expect(storageService.load).toHaveBeenCalledTimes(1);
      expect(storageService.load).toHaveBeenCalledWith(ACCOUNTS_STORAGE_KEY);

      const accounts = await accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });

    it('updates addresses when missing', async () => {
      const mockedAccounts = mockAccounts(true);

      (storageService.load as jest.Mock).mockResolvedValue(mockAccounts(false));
      mockAddressResolution();

      await accountsService.onUnlock();

      expect(storageService.load).toHaveBeenCalledTimes(1);
      expect(storageService.load).toHaveBeenCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(addressResolver.getAddressesForSecretId).toHaveBeenCalledTimes(6);
      expect(addressResolver.getAddressesForSecretId).toHaveBeenNthCalledWith(
        1,
        '0x1',
      );
      expect(addressResolver.getAddressesForSecretId).toHaveBeenNthCalledWith(
        2,
        '0x2',
      );
      expect(addressResolver.getAddressesForSecretId).toHaveBeenNthCalledWith(
        3,
        'fb-acc',
      );
      expect(addressResolver.getAddressesForSecretId).toHaveBeenNthCalledWith(
        4,
        walletId,
        0,
        DerivationPath.BIP44,
      );
      expect(addressResolver.getAddressesForSecretId).toHaveBeenNthCalledWith(
        5,
        walletId,
        1,
        DerivationPath.BIP44,
      );
      expect(addressResolver.getAddressesForSecretId).toHaveBeenNthCalledWith(
        6,
        secondaryWalletId,
        0,
        DerivationPath.BIP44,
      );

      const accounts = await accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });

    it('updates addresses on developer mode change', async () => {
      const mockedAccounts = mockAccounts(true);

      jest.mocked(storageService.load).mockResolvedValue(mockedAccounts);

      mockAddressResolution();

      await accountsService.onUnlock();

      const accounts = await accountsService.getAccounts();
      expect(accounts).toStrictEqual(mockedAccounts);

      mockAddressResolution(true);

      expect(networkService.developerModeChanged.add).toHaveBeenCalledTimes(1);

      // Since this is also called on unlock, we need to reset the mock to avoid counting those calls.
      jest.mocked(addressResolver.getAddressesForSecretId).mockClear();

      // this mocks a network change
      (networkService.developerModeChanged.add as jest.Mock).mock.calls[0][0]();
      await new Promise(process.nextTick);

      expect(addressResolver.getAddressesForSecretId).toHaveBeenCalledTimes(6);

      const updatedAccounts = await accountsService.getAccounts();
      expect(updatedAccounts).toStrictEqual(mockAccounts(true, true));
    });
  });

  describe('.refreshAddressesForAccount()', () => {
    let mockedAccounts;

    beforeEach(async () => {
      mockedAccounts = mockAccounts(true);
      jest.mocked(storageService.load).mockResolvedValue(mockedAccounts);

      mockAddressResolution();

      await accountsService.onUnlock();
    });

    it('correctly updates addresses for selected primary account', async () => {
      jest
        .mocked(addressResolver.getAddressesForSecretId)
        .mockReset()
        .mockResolvedValue({
          [NetworkVMType.EVM]: otherEvmAddress,
          [NetworkVMType.BITCOIN]: otherBtcAddress,
          [NetworkVMType.AVM]: avmAddress,
          [NetworkVMType.PVM]: pvmAddress,
          [NetworkVMType.CoreEth]: coreEthAddress,
          [NetworkVMType.HVM]: otherEvmAddress,
          [NetworkVMType.SVM]: '',
        });

      await accountsService.refreshAddressesForAccount(
        mockedAccounts.primary[walletId][0]?.id as string,
      );

      expect(addressResolver.getAddressesForSecretId).toHaveBeenCalledTimes(1);

      const accounts = await accountsService.getAccounts();
      expect(accounts.primary[0]).toEqual(mockAccounts(true, true).primary[0]);
    });

    it('correctly updates addresses for selected imported account', async () => {
      jest
        .mocked(addressResolver.getAddressesForSecretId)
        .mockResolvedValueOnce({
          ...emptyAddresses(),
          [NetworkVMType.EVM]: 'addressC-new',
        } as any);

      await accountsService.refreshAddressesForAccount('fb-acc');

      expect(addressResolver.getAddressesForSecretId).toHaveBeenCalledWith(
        'fb-acc',
      );

      const accounts = await accountsService.getAccounts();
      expect(accounts.imported['fb-acc']).toEqual({
        ...mockAccounts(true, true).imported['fb-acc'],
        ...mapVMAddresses(emptyAddresses()),
        addressC: 'addressC-new',
      });
    });
  });

  describe('when testnet mode gets enabled and fireblocks account is active', () => {
    beforeEach(() => {
      mockAddressResolution();
      jest.mocked(isProductionBuild).mockReturnValue(true);
    });

    it('activates the primary account', async () => {
      const mockedAccounts = mockAccounts(true, false, 'fb-acc');
      jest.spyOn(accountsService, 'activateAccount');
      jest.mocked(storageService.load).mockResolvedValue(mockedAccounts);

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
    beforeEach(() => {
      mockAddressResolution();
    });

    it('clears accounts and subscriptions on lock', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.onLock();
      expect(await accountsService.getAccounts()).toStrictEqual(emptyAccounts);
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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);
      await accountsService.onLock();
      expect(eventListener).toHaveBeenCalledWith(emptyAccounts);
    });
  });

  describe('getAccounts', () => {
    beforeEach(() => {
      mockAddressResolution();
    });

    it('returns accounts', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      const accounts = await accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockedAccounts);
    });
  });

  describe('addPrimaryAccount()', () => {
    beforeEach(() => {
      mockAddressResolution();
    });

    it('should thrown an error because of missing addresses', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValue(uuid);

      await accountsService.onUnlock();
      jest
        .mocked(addressResolver.getAddressesForSecretId)
        .mockResolvedValueOnce({} as any);

      await expectToThrowErrorCode(
        accountsService.addPrimaryAccount({
          name: 'Account name',
          walletId,
        }),
        AccountError.EVMAddressNotFound,
      );
    });
    it('adds account with index 0 when no accounts', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValue(uuid);

      await accountsService.onUnlock();

      expect(storageService.load).toBeCalledTimes(1);
      expect(storageService.load).toBeCalledWith(ACCOUNTS_STORAGE_KEY);
      expect(await accountsService.getAccounts()).toStrictEqual(emptyAccounts);

      await accountsService.addPrimaryAccount({
        name: 'Account name',
        walletId,
      });
      expect(secretsService.addAddress).toBeCalledTimes(1);
      expect(secretsService.addAddress).toBeCalledWith({
        index: 0,
        walletId: WALLET_ID,
        ledgerService,
        addressResolver,
      });

      const accounts = await accountsService.getAccounts();
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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.addPrimaryAccount({ walletId: WALLET_ID });
      expect(secretsService.addAddress).toBeCalledTimes(1);
      expect(secretsService.addAddress).toBeCalledWith({
        index: 2,
        walletId: WALLET_ID,
        ledgerService,
        addressResolver,
      });
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledTimes(1);
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledWith(
        mapAddressesToVMs(getAllAddresses() as Account),
      );

      const accounts = await accountsService.getAccounts();

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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.addPrimaryAccount({
        name: 'New Account',
        walletId: WALLET_ID,
      });
      expect(secretsService.addAddress).toBeCalledTimes(1);
      expect(secretsService.addAddress).toBeCalledWith({
        index: 2,
        walletId: WALLET_ID,
        ledgerService,
        addressResolver,
      });
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledTimes(1);
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledWith(
        mapAddressesToVMs(getAllAddresses() as Account),
      );

      const accounts = await accountsService.getAccounts();

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
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledTimes(1);
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledWith(
        mapAddressesToVMs(getAllAddresses() as Account),
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
    beforeEach(() => {
      mockAddressResolution();
    });

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
      expect(await accountsService.getAccounts()).toStrictEqual(emptyAccounts);

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
        addressResolver,
      );
      expect(commitMock).toHaveBeenCalled();
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledTimes(1);
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledWith(
        mapAddressesToVMs(getAllAddresses() as Account),
      );

      const accounts = await accountsService.getAccounts();
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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

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
        addressResolver,
      );
      expect(commitMock).toHaveBeenCalled();
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledTimes(1);
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledWith(
        mapAddressesToVMs(getAllAddresses(true) as Account),
      );

      const accounts = await accountsService.getAccounts();

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
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledTimes(1);
      expect(permissionsService.whitelistCoreDomains).toHaveBeenCalledWith(
        mapAddressesToVMs(getAllAddresses(true) as Account),
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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

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
        addressResolver,
      );
      expect(commitMock).not.toHaveBeenCalled();
      expect(permissionsService.whitelistCoreDomains).not.toHaveBeenCalled();
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
      expect(permissionsService.whitelistCoreDomains).not.toHaveBeenCalled();

      await expect(
        accountsService.addImportedAccount({ name: 'New Account', options }),
      ).rejects.toThrow(`Account import failed with error: ${errorMessage}`);
    });
  });

  describe('setAccountName', () => {
    beforeEach(() => {
      mockAddressResolution();
    });

    it('throws error if account not found', async () => {
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(emptyAccounts);

      await expect(
        accountsService.setAccountName('unknown-uuid', 'updated name'),
      ).rejects.toThrow('Account rename failed: account not found');
    });

    it('only modifies the account belonging to other wallets', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('uuid3', 'Updated Name');

      const accounts = await accountsService.getAccounts();

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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('uuid2', 'Updated Name');
      const accounts = await accountsService.getAccounts();
      const expectedAccounts = { ...mockedAccounts };

      expectedAccounts.primary[walletId][1]!.name = 'Updated Name';
      expect(accounts).toStrictEqual(expectedAccounts);
    });

    it('renames imported accounts correctly', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.setAccountName('0x1', 'Updated Name');
      const accounts = await accountsService.getAccounts();
      const expectedAccounts = { ...mockedAccounts };
      expectedAccounts.imported['0x1'].name = 'Updated Name';
      expect(accounts).toStrictEqual(expectedAccounts);
    });

    it('emits event if name changes', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.setAccountName('uuid2', 'Updated Name');
      await accountsService.setAccountName('uuid2', 'Updated Name');
      await accountsService.setAccountName('uuid2', 'Updated Name');

      const result = await accountsService.getAccounts();
      const expectedAccounts = mockAccounts(true);

      expectedAccounts.primary[walletId][1]!.name = 'Updated Name';

      expect(result).toStrictEqual(expectedAccounts);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(expectedAccounts);
    });
  });

  describe('activateAccount', () => {
    beforeEach(() => {
      mockAddressResolution();
    });

    it('throws error if account not found', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await expect(
        accountsService.activateAccount('unknown-uuid'),
      ).rejects.toThrow('Account activation failed: account not found');
    });

    it('changes primary account to active', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.activateAccount('uuid2');
      const accounts = await accountsService.getAccounts();

      expect(accounts).toStrictEqual(mockAccounts(true, false, 1));
    });

    it('changes imported account to active', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      await accountsService.activateAccount('0x1');
      const accounts = await accountsService.getAccounts();

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
    beforeEach(() => {
      mockAddressResolution();
    });

    it('removes the imported accounts and their secrets', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);
      const eventListener = jest.fn();

      await accountsService.onUnlock();
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.deleteAccounts(['0x1', '0x2']);

      const result = await accountsService.getAccounts();
      const expectedAccounts = {
        ...mockedAccounts,
        imported: {
          'fb-acc': {
            id: 'fb-acc',
            name: 'Fireblocks account',
            type: 'fireblocks',
            addressC: evmAddress,
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
      expect(await accountsService.getAccounts()).toStrictEqual(mockedAccounts);

      accountsService.addListener(
        AccountsEvents.ACCOUNTS_UPDATED,
        eventListener,
      );

      await accountsService.deleteAccounts(['0x1']);

      const result = await accountsService.getAccounts();
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

      const accounts = await accountsService.getAccounts();
      const primaryAccounts = accounts.primary[walletId];
      expect(primaryAccounts && primaryAccounts.length).toBe(1);
    });
  });

  describe('#setAccounts', () => {
    beforeEach(() => {
      mockAddressResolution();
    });

    it('should call networkService.getUnknownUsedNetwork when active account changes', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      const getUnknownUsedNetworkSpy = jest.spyOn(
        networkService,
        'getUnknownUsedNetwork',
      );

      await accountsService.onUnlock();

      // Make uuid2 have a different EVM address
      jest
        .mocked(addressResolver.getAddressesForSecretId)
        .mockReset()
        .mockResolvedValueOnce({
          [NetworkVMType.EVM]: otherEvmAddress,
          [NetworkVMType.BITCOIN]: otherBtcAddress,
          [NetworkVMType.AVM]: avmAddress,
          [NetworkVMType.PVM]: pvmAddress,
          [NetworkVMType.CoreEth]: coreEthAddress,
          [NetworkVMType.HVM]: otherEvmAddress,
          [NetworkVMType.SVM]: '',
        } as any);
      await accountsService.refreshAddressesForAccount('uuid2');

      // Clear any previous calls during initialization or refresh
      getUnknownUsedNetworkSpy.mockClear();

      // Change active account to trigger the call
      await accountsService.activateAccount('uuid2');

      expect(getUnknownUsedNetworkSpy).toHaveBeenCalledTimes(1);
      expect(getUnknownUsedNetworkSpy).toHaveBeenCalledWith(otherEvmAddress);
    });

    it('should not call networkService.getUnknownUsedNetwork when active account remains the same', async () => {
      const mockedAccounts = mockAccounts(true);
      (storageService.load as jest.Mock).mockResolvedValue(mockedAccounts);

      const getUnknownUsedNetworkSpy = jest.spyOn(
        networkService,
        'getUnknownUsedNetwork',
      );

      await accountsService.onUnlock();

      // Clear any previous calls during initialization
      getUnknownUsedNetworkSpy.mockClear();

      // Activate the same account that's already active
      await accountsService.activateAccount('uuid1'); // This is already the active account
      expect(getUnknownUsedNetworkSpy).not.toHaveBeenCalled();
    });
  });
});
