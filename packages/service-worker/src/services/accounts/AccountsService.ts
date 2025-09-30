import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  Account,
  AccountError,
  Accounts,
  ACCOUNTS_STORAGE_KEY,
  AccountsEvents,
  AccountType,
  AccountWithOptionalAddresses,
  DerivedAddresses,
  IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP,
  ImportData,
  ImportedAccount,
  ImportType,
  PrimaryAccount,
  SecretsError,
  SecretType,
  WalletId,
} from '@core/types';
import {
  assertPresent,
  assertPropDefined,
  getAllAddressesForAccount,
  isMissingAnyAddress,
  isPrimaryAccount,
  isProductionBuild,
  mapAddressesToVMs,
  mapVMAddresses,
  ReadWriteLock,
  Monitoring,
  isImportedAccount,
} from '@core/common';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { OnLock, OnUnlock } from '../../runtime/lifecycleCallbacks';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { LedgerService } from '../ledger/LedgerService';
import { NetworkService } from '../network/NetworkService';
import { PermissionsService } from '../permissions/PermissionsService';
import { AddressResolver } from '../secrets/AddressResolver';
import { SecretsService } from '../secrets/SecretsService';
import { StorageService } from '../storage/StorageService';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { uniq } from 'lodash';
import { GlacierService } from '../glacier/GlacierService';

type AddAccountParams = {
  walletId: string;
  name?: string;
  addAllWithHistory?: boolean;
};

@singleton()
export class AccountsService implements OnLock, OnUnlock {
  #rwLock = new ReadWriteLock();

  private eventEmitter = new EventEmitter();

  #_accounts: Accounts = {
    active: undefined,
    primary: {},
    imported: {},
  };

  get #accounts() {
    return this.#_accounts;
  }

  set #accounts(accounts: Accounts) {
    if (JSON.stringify(this.#_accounts) === JSON.stringify(accounts)) {
      return;
    }

    const activeAccountChanged =
      this.#_accounts.active?.id !== accounts.active?.id;
    this.#_accounts = accounts;

    if (Object.keys(accounts.primary).length > 0) {
      if (isPrimaryAccount(accounts.active)) {
        const activeWalletAccounts = accounts.primary[accounts.active.walletId];

        this.#_accounts.active =
          activeWalletAccounts?.[accounts.active.index] ?? // Try to restore the active account
          Object.values(accounts.primary).flat()[0]; // Fall back to the first primary account
      } else if (accounts.active) {
        this.#_accounts.active = accounts.imported[accounts.active.id];
      }
      this.saveAccounts(this.#_accounts);
    }

    if (activeAccountChanged) {
      this.eventEmitter.emit(
        AccountsEvents.ACTIVE_ACCOUNT_CHANGED,
        this.#_accounts.active,
      );
    }

    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.#_accounts);
  }

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private permissionsService: PermissionsService,
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private secretsService: SecretsService,
    private ledgerService: LedgerService,
    private walletConnectService: WalletConnectService,
    private addressResolver: AddressResolver,
    private glacierService: GlacierService,
  ) {}

  async onUnlock(): Promise<void> {
    await this.init();

    // refresh addresses so in case the user switches to testnet mode,
    // as the BTC address needs to be updated
    this.networkService.developerModeChanged.add(this.onDeveloperModeChanged);
  }

  async hasAddressEVMHistory(address: string) {
    const history = await this.glacierService.getAddressEVMHistory(address);
    if (!history) {
      return;
    }
    const addressHistory = history.indexedChains?.find(
      (chain) => parseInt(chain.chainId, 10) === ChainId.AVALANCHE_MAINNET_ID,
    );
    return !!addressHistory;
  }

  async getAccountFromActiveWalletByAddress(address: string) {
    const activeAccount = await this.getActiveAccount();
    if (!activeAccount) {
      return;
    }

    if (isImportedAccount(activeAccount)) {
      return activeAccount;
    }

    const accounts = this.#accounts.primary[activeAccount.walletId] ?? [];

    return accounts.find((account) =>
      getAllAddressesForAccount(account).includes(address),
    );
  }

  async getActiveAccount() {
    const accounts = await this.getAccounts();
    return accounts.active;
  }

  async getAccounts() {
    await this.#rwLock.acquireReadLock();

    try {
      return this.#accounts;
    } finally {
      await this.#rwLock.releaseReadLock();
    }
  }

  async #setAccounts(accounts: Accounts) {
    await this.#rwLock.acquireReadLock();

    try {
      const addressC = accounts.active?.addressC;
      if (addressC && addressC !== this.#accounts.active?.addressC) {
        this.networkService.getUnknownUsedNetwork(addressC);
      }

      this.#accounts = accounts;
    } finally {
      await this.#rwLock.releaseReadLock();
    }
  }

  async onLock() {
    await this.#setAccounts({
      active: undefined,
      primary: {},
      imported: {},
    });

    this.networkService.developerModeChanged.remove(
      this.onDeveloperModeChanged,
    );
  }

  private onDeveloperModeChanged = async (isTestnet?: boolean) => {
    await this.init(true);

    // In production builds, Fireblocks accounts can only be used in mainnet mode.
    // If user switches to testnet mode while Fireblocks account is active,
    // we need to change to the primary account instead.
    // UI is responsible for communicating this to the user.
    const isOnFireblocksAccount =
      this.#accounts.active?.type === AccountType.FIREBLOCKS;

    const [primaryAccount] = Object.values(this.#accounts.primary).flat();
    const shouldSwitchToPrimaryAccount =
      primaryAccount &&
      isOnFireblocksAccount &&
      isTestnet &&
      isProductionBuild();

    if (shouldSwitchToPrimaryAccount) {
      await this.activateAccount(primaryAccount.id);
    }
  };

  private init = async (updateAddresses?: boolean) => {
    await this.#rwLock.acquireWriteLock();

    try {
      const accounts = await this.loadAccounts();

      // no wallets added yet, onboarding is not finished
      if (Object.keys(accounts.primary).length === 0) {
        return;
      }

      const hasMissingAddresses = await this.#tryToDeriveMissingKeys(accounts);

      const refreshAccount = async <T extends Account>(
        account: T,
      ): Promise<T> => {
        const isUpdated =
          !updateAddresses &&
          account.addressC &&
          account.addressBTC &&
          account.addressAVM &&
          account.addressPVM &&
          account.addressCoreEth;

        if (isUpdated && !hasMissingAddresses) {
          return account;
        }

        const addresses = await this.#getAddressesForAccount(account);

        return {
          ...account,
          ...addresses,
        };
      };

      const [
        activeWalletPrimaryAccountsWithAddresses,
        importedAccountsWithAddresses,
      ] = await Promise.all([
        Promise.all(Object.values(accounts.primary).flat().map(refreshAccount)),
        Promise.all(Object.values(accounts.imported).map(refreshAccount)),
      ]);

      const primaryAccounts: Record<WalletId, PrimaryAccount[]> = {};
      for (const account of activeWalletPrimaryAccountsWithAddresses) {
        const walletAccounts =
          primaryAccounts && primaryAccounts[account.walletId];
        if (walletAccounts) {
          primaryAccounts[account.walletId] = [...walletAccounts, account];
          continue;
        }
        primaryAccounts[account.walletId] = [account];
      }

      const importedAccounts: Record<string, ImportedAccount> = {};
      for (const account of importedAccountsWithAddresses) {
        importedAccounts[account.id] = account;
      }

      if (!accounts.active) {
        throw new Error('There is no active account to restore');
      }

      // We're already wrapped in a read-write lock, so we can access .#accounts directly here.
      this.#accounts = {
        ...accounts,
        primary: primaryAccounts,
        imported: importedAccounts,
      };
    } finally {
      await this.#rwLock.releaseWriteLock();
    }
  };

  async #getAddressesForAccount(
    account: AccountWithOptionalAddresses,
  ): Promise<DerivedAddresses> {
    if (isPrimaryAccount(account)) {
      const secrets =
        await this.secretsService.getPrimaryAccountSecrets(account);

      assertPresent(secrets, SecretsError.SecretsNotFound);

      const addresses = await this.addressResolver.getAddressesForSecretId(
        account.walletId,
        account.index,
        secrets.derivationPathSpec,
      );

      assertPresent(
        addresses[NetworkVMType.EVM],
        AccountError.EVMAddressNotFound,
      );

      return mapVMAddresses(addresses);
    }
    const addresses = await this.addressResolver.getAddressesForSecretId(
      account.id,
    );

    assertPresent(
      addresses[NetworkVMType.EVM],
      AccountError.EVMAddressNotFound,
    );

    return mapVMAddresses(addresses);
  }

  async refreshAddressesForAccount(accountId: string): Promise<void> {
    const account = await this.getAccountByID(accountId);

    if (!account) {
      return;
    }

    const addresses = await this.#getAddressesForAccount(account);
    if (account.type === AccountType.PRIMARY) {
      const walletAccounts = this.#accounts.primary[account.walletId]!;

      this.#accounts = {
        ...this.#accounts,
        primary: {
          ...this.#accounts.primary,
          [account.walletId]: Object.values(walletAccounts).map((acc) => {
            if (acc.id !== accountId) {
              return acc;
            }

            return {
              ...acc,
              ...addresses,
            };
          }),
        },
      };

      return;
    } else {
      this.#accounts = {
        ...this.#accounts,
        imported: {
          ...this.#accounts.imported,
          [accountId]: {
            ...account,
            ...addresses,
          },
        },
      };
    }
  }

  private async loadAccounts(): Promise<Accounts> {
    const accounts =
      await this.storageService.load<Accounts>(ACCOUNTS_STORAGE_KEY);

    return (
      accounts ?? {
        active: undefined,
        primary: {},
        imported: {},
      }
    );
  }

  async #tryToDeriveMissingKeys(accounts: Accounts): Promise<boolean> {
    const primaryWalletIds = uniq(Object.keys(accounts.primary));

    let accountsWithMissingAddresses = 0;

    try {
      for (const walletId of primaryWalletIds) {
        const secrets = await this.secretsService.getSecretsById(walletId);

        if (secrets.secretType !== SecretType.Mnemonic) {
          continue;
        }

        const accountsForSecret = accounts.primary[walletId]!;

        for (const account of accountsForSecret) {
          if (!isMissingAnyAddress(account)) {
            continue;
          }

          accountsWithMissingAddresses += 1;

          await this.secretsService.addAddress({
            index: account.index,
            walletId,
            ledgerService: this.ledgerService,
            addressResolver: this.addressResolver,
          });
        }
      }

      return accountsWithMissingAddresses > 0;
    } catch (error) {
      // Never fail, but also log the error.
      console.error(error);
      if (error instanceof Error) {
        Monitoring.sentryCaptureException(
          error,
          Monitoring.SentryExceptionTypes.ACCOUNTS,
        );
      }

      return accountsWithMissingAddresses > 0;
    }
  }

  private async saveAccounts(accounts: Accounts) {
    await this.storageService.save<Accounts>(ACCOUNTS_STORAGE_KEY, accounts);
  }

  async getAccountByID(id: string) {
    const accounts = await this.getAccounts();

    return (
      accounts.imported[id] ??
      Object.values(accounts.primary)
        .flat()
        .find((acc) => acc.id === id)
    );
  }

  async getAccountList(): Promise<Account[]> {
    const accounts = await this.getAccounts();

    return [
      ...Object.values(accounts.primary).flat(),
      ...Object.values(accounts.imported),
    ];
  }

  #findAccountByAddress(addressC: string) {
    return Object.values(this.#accounts.imported).find(
      (acc) => acc.addressC === addressC,
    );
  }

  async getPrimaryAccountsByWalletId(walletId: string) {
    const accounts = await this.getAccounts();

    return accounts.primary[walletId] ?? [];
  }

  #buildAccount(
    accountData,
    importType: ImportType,
    suggestedName?: string,
  ): ImportedAccount {
    const type = IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP[importType];

    return {
      ...accountData,
      name:
        suggestedName ||
        `Imported Account ${Object.keys(this.#accounts.imported).length + 1}`,
      type,
    };
  }

  async #getAllAddresses() {
    const accounts = await this.getAccountList();

    return accounts.flatMap(getAllAddressesForAccount);
  }

  async #hasNextAccountsHistory({
    walletId,
    accountsCount,
    index,
  }: {
    walletId: string;
    accountsCount: number;
    index: number;
  }) {
    let hasHistory: boolean | undefined = false;

    const nextAccount = {
      id: `${index}`,
      index,
      name: `Dummy Account`,
      type: AccountType.PRIMARY as const,
      walletId: walletId,
    };

    const nextAccountAddresses =
      await this.#getAddressesForAccount(nextAccount);

    hasHistory = await this.hasAddressEVMHistory(nextAccountAddresses.addressC);

    if (hasHistory) {
      return hasHistory;
    }

    if (accountsCount <= 1) {
      return hasHistory;
    }

    return await this.#hasNextAccountsHistory({
      walletId,
      index: ++index,
      accountsCount: --accountsCount,
    });
  }

  async addPrimaryAccount({ walletId, addAllWithHistory }: AddAccountParams) {
    const selectedWalletAccounts = this.#accounts.primary[walletId] ?? [];
    const lastAccount = selectedWalletAccounts.at(-1);

    const nextIndex = lastAccount ? lastAccount.index + 1 : 0;
    const id = crypto.randomUUID();
    const newAccount = {
      id,
      index: nextIndex,
      name: `Account ${nextIndex + 1}`,
      type: AccountType.PRIMARY as const,
      walletId: walletId,
    };

    await this.secretsService.addAddress({
      index: nextIndex,
      walletId,
      ledgerService: this.ledgerService,
      addressResolver: this.addressResolver,
    });

    const addresses = await this.#getAddressesForAccount(newAccount);

    assertPropDefined(addresses, 'addressC', AccountError.EVMAddressNotFound);
    assertPropDefined(addresses, 'addressBTC', AccountError.BTCAddressNotFound);

    await this.#setAccounts({
      ...this.#accounts,
      primary: {
        ...this.#accounts.primary,
        [walletId]: [
          ...selectedWalletAccounts,
          {
            ...newAccount,
            ...addresses,
          },
        ],
      },
    });
    await this.permissionsService.whitelistCoreDomains(
      mapAddressesToVMs({
        ...newAccount,
        ...addresses,
      }),
    );

    this.analyticsServicePosthog.captureEncryptedEvent({
      name: 'addedNewPrimaryAccount',
      windowId: crypto.randomUUID(),
      properties: { addresses: await this.#getAllAddresses() },
    });

    if (addAllWithHistory) {
      const hasNextAccountsHistory = await this.#hasNextAccountsHistory({
        walletId,
        index: nextIndex + 1,
        accountsCount: 2,
      });
      if (hasNextAccountsHistory) {
        return this.addPrimaryAccount({ walletId, addAllWithHistory: true });
      }
    }

    return id;
  }

  async addImportedAccount({
    options,
    name,
  }: {
    options: ImportData;
    name?: string;
  }) {
    try {
      const { account, commit } = await this.secretsService.addImportedWallet(
        options,
        this.addressResolver,
      );

      assertPropDefined(account, 'addressC', AccountError.EVMAddressNotFound);

      const existingAccount = this.#findAccountByAddress(account.addressC);

      // If the account already exists for some reason, just return its ID.
      if (existingAccount) {
        return existingAccount.id;
      }

      // the imported account is unique, we can save its secret
      await commit();

      const newAccount: ImportedAccount = this.#buildAccount(
        account,
        options.importType,
        name,
      );

      await this.#setAccounts({
        ...this.#accounts,
        imported: {
          ...this.#accounts.imported,
          [newAccount.id]: newAccount,
        },
      });
      await this.permissionsService.whitelistCoreDomains(
        mapAddressesToVMs(newAccount),
      );
      this.analyticsServicePosthog.captureEncryptedEvent({
        name: 'addedNewImportedAccount',
        windowId: crypto.randomUUID(),
        properties: { addresses: await this.#getAllAddresses() },
      });
      return account.id;
    } catch (err) {
      throw new Error(
        `Account import failed with error: ${(err as Error).message}`,
      );
    }
  }

  async setAccountName(id: string, name: string) {
    const accountToChange = await this.getAccountByID(id);

    if (!accountToChange) {
      throw new Error(`Account rename failed: account not found`);
    }

    if (accountToChange.type === AccountType.PRIMARY) {
      return this.#renamePrimaryAccount(accountToChange, name);
    }

    return this.#renameImportedAccount(accountToChange, name);
  }

  async #renameImportedAccount(account: ImportedAccount, name: string) {
    const accountWithNewName = { ...account, name };
    const newAccounts = { ...this.#accounts.imported };
    newAccounts[account.id] = accountWithNewName;
    await this.#setAccounts({ ...this.#accounts, imported: newAccounts });
  }

  async #renamePrimaryAccount(account: PrimaryAccount, name: string) {
    const accountWithNewName = { ...account, name };

    const walletAccounts = this.#accounts.primary[account.walletId];

    if (!walletAccounts) {
      throw new Error(
        'Updated account does not exist within any of the primary wallets.',
      );
    }

    // We need to operate on a copy of the array here, otherwise we change the
    // existing .accounts property in-memory and the change will not be detected
    // by this.accounts setter.
    const newWalletAccounts = [...walletAccounts];
    newWalletAccounts[account.index] = accountWithNewName;

    await this.#setAccounts({
      ...this.#accounts,
      primary: {
        ...this.#accounts.primary,
        [accountWithNewName.walletId]: newWalletAccounts,
      },
    });
  }

  async activateAccount(id: string) {
    const accountToActivate = await this.getAccountByID(id);

    if (!accountToActivate) {
      throw new Error(`Account activation failed: account not found`);
    }

    await this.#setAccounts({
      ...this.#accounts,
      active: accountToActivate,
    });
  }

  async deleteAccounts(ids: string[]) {
    const accounts = await this.getAccounts();

    const { active } = accounts;

    const walletIds = Object.keys(this.#accounts.primary);

    const accountsCount = Object.values(this.#accounts.primary).flat().length;
    const importedAccountIds = ids.filter(
      (id) => id in this.#accounts.imported,
    );
    const primaryAccountIds = ids.filter(
      (id) => !(id in this.#accounts.imported),
    );

    if (accountsCount === primaryAccountIds.length) {
      throw new Error('You cannot delete all of your primary accounts');
    }

    let newPrimaryAccounts: Record<WalletId, PrimaryAccount[]> = {};

    for (const i in walletIds) {
      const walletId = walletIds[i];
      if (walletId === undefined) {
        continue;
      }

      const walletAccounts = this.#accounts.primary[walletId];
      if (!walletAccounts) {
        continue;
      }
      const walletType = await this.secretsService.getWalletType(walletId);

      const filteredWalletAccounts = walletAccounts.filter((account) => {
        return !primaryAccountIds.includes(account.id);
      });

      if (
        filteredWalletAccounts.length !== walletAccounts.length &&
        walletType === SecretType.Seedless
      ) {
        throw new Error('You cannot delete a seedless account!');
      }

      if (!filteredWalletAccounts.length && walletIds.length > 1) {
        await this.secretsService.deletePrimaryWallets([walletId]);
        continue;
      }

      newPrimaryAccounts = {
        ...newPrimaryAccounts,
        [walletId]: filteredWalletAccounts,
      };
    }

    let newImportedAccounts: Record<string, ImportedAccount> = {};
    for (const [walletId, values] of Object.entries(this.#accounts.imported)) {
      if (!importedAccountIds.includes(walletId)) {
        newImportedAccounts = {
          ...newImportedAccounts,
          [walletId]: values,
        };
      }
    }

    const activeWalletid = isPrimaryAccount(active) ? active.walletId : null;
    const [activeWalletFirstAccount] =
      (activeWalletid && newPrimaryAccounts[activeWalletid]) || [];

    const firstPrimaryAccount =
      activeWalletFirstAccount || Object.values(newPrimaryAccounts).flat()[0];

    const newActiveAccount =
      active && ids.includes(active.id)
        ? firstPrimaryAccount
        : this.#accounts.active;

    if (!newActiveAccount) {
      throw new Error('There is no new active account!');
    }

    await this.secretsService.deleteImportedWallets(
      ids,
      this.walletConnectService,
    );

    await this.#setAccounts({
      primary: newPrimaryAccounts,
      imported: newImportedAccounts,
      active: newActiveAccount,
    });

    return ids.length;
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
