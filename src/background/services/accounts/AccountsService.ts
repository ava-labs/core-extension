import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  Account,
  Accounts,
  AccountsEvents,
  ACCOUNTS_STORAGE_KEY,
  AccountType,
  ImportData,
  ImportedAccount,
  ImportType,
  IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP,
  PrimaryAccount,
  WalletId,
} from './models';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { NetworkService } from '../network/NetworkService';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { PermissionsService } from '../permissions/PermissionsService';
import { isProductionBuild } from '@src/utils/environment';
import { DerivedAddresses, SecretType } from '../secrets/models';
import { isPrimaryAccount } from './utils/typeGuards';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import getAllAddressesForAccount from '@src/utils/getAllAddressesForAccount';
import { SecretsService } from '../secrets/SecretsService';
import { LedgerService } from '../ledger/LedgerService';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { Network } from '../network/models';
import { isDevnet } from '@src/utils/isDevnet';

type AddAccountParams = {
  walletId: string;
  name?: string;
};

@singleton()
export class AccountsService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();

  private _accounts: Accounts = {
    active: undefined,
    primary: {},
    imported: {},
  };

  private set accounts(accounts: Accounts) {
    if (JSON.stringify(this._accounts) === JSON.stringify(accounts)) {
      return;
    }

    const activeAccountChanged =
      this._accounts.active?.id !== accounts.active?.id;
    this._accounts = accounts;

    if (Object.keys(accounts.primary).length > 0) {
      if (isPrimaryAccount(accounts.active)) {
        const activeWalletAccounts = accounts.primary[accounts.active.walletId];

        this._accounts.active =
          activeWalletAccounts?.[accounts.active.index] ?? // Try to restore the active account
          Object.values(accounts.primary).flat()[0]; // Fall back to the first primary account
      } else if (accounts.active) {
        this._accounts.active = accounts.imported[accounts.active.id];
      }
      this.saveAccounts(this._accounts);
    }

    if (activeAccountChanged) {
      this.eventEmitter.emit(
        AccountsEvents.ACTIVE_ACCOUNT_CHANGED,
        this.accounts.active,
      );
    }

    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  private get accounts() {
    return this._accounts;
  }

  public get activeAccount() {
    return this.accounts.active;
  }

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private permissionsService: PermissionsService,
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private secretsService: SecretsService,
    private ledgerService: LedgerService,
    private walletConnectService: WalletConnectService,
  ) {}

  async onUnlock(): Promise<void> {
    await this.init();

    // refresh addresses so in case the user switches to testnet mode,
    // as the BTC address needs to be updated
    this.networkService.developerModeChanged.add(this.onDeveloperModeChanged);

    // TODO(@meeh0w):
    // Remove this listener after E-upgrade activation on Fuji. It will be no longer needed.
    this.networkService.uiActiveNetworkChanged.add(
      this.#onActiveNetworkChanged,
    );
  }

  #wasDevnet = false;

  #onActiveNetworkChanged = async (network?: Network) => {
    if (!network) {
      return;
    }

    if (isDevnet(network) !== this.#wasDevnet) {
      this.#wasDevnet = isDevnet(network);
      await this.onDeveloperModeChanged(network?.isTestnet);
    }
  };

  onLock() {
    this.accounts = {
      active: undefined,
      primary: {},
      imported: {},
    };

    this.networkService.developerModeChanged.remove(
      this.onDeveloperModeChanged,
    );
    this.networkService.uiActiveNetworkChanged.remove(
      this.#onActiveNetworkChanged,
    );
  }

  private onDeveloperModeChanged = async (isTestnet?: boolean) => {
    await this.init(true);

    // In production builds, Fireblocks accounts can only be used in mainnet mode.
    // If user switches to testnet mode while Fireblocks account is active,
    // we need to change to the primary account instead.
    // UI is responsible for communicating this to the user.
    const isOnFireblocksAccount =
      this.activeAccount?.type === AccountType.FIREBLOCKS;

    const [primaryAccount] = Object.values(this.accounts.primary).flat();
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
    const accounts = await this.loadAccounts();

    // no wallets added yet, onboarding is not finished
    if (Object.keys(accounts.primary).length === 0) {
      return;
    }

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

      if (isUpdated) {
        return account;
      }

      const addresses = await this.getAddressesForAccount(account);

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
    this.accounts = {
      ...accounts,
      primary: primaryAccounts,
      imported: importedAccounts,
    };
  };

  async getAddressesForAccount(account: Account): Promise<DerivedAddresses> {
    if (account.type !== AccountType.PRIMARY) {
      return this.secretsService.getImportedAddresses(
        account.id,
        this.networkService,
      );
    }

    const addresses = await this.secretsService.getAddresses(
      account.index,
      account.walletId,
      this.networkService,
    );

    return {
      addressC: addresses[NetworkVMType.EVM],
      addressBTC: addresses[NetworkVMType.BITCOIN],
      addressAVM: addresses[NetworkVMType.AVM],
      addressPVM: addresses[NetworkVMType.PVM],
      addressCoreEth: addresses[NetworkVMType.CoreEth],
    };
  }

  async refreshAddressesForAccount(accountId: string): Promise<void> {
    const account = this.getAccountByID(accountId);

    if (!account) {
      return;
    }

    const addresses = await this.getAddressesForAccount(account);
    if (account.type === AccountType.PRIMARY) {
      this.accounts = {
        ...this.accounts,
        primary: {
          ...this.accounts.primary,
          [account.walletId]: Object.values(this.accounts.primary)
            .flat()
            .map((acc) => {
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
      this.accounts = {
        ...this.accounts,
        imported: {
          ...this.accounts.imported,
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

  private async saveAccounts(accounts: Accounts) {
    await this.storageService.save<Accounts>(ACCOUNTS_STORAGE_KEY, accounts);
  }

  getAccountByID(id: string) {
    return (
      this.accounts.imported[id] ??
      Object.values(this.accounts.primary)
        .flat()
        .find((acc) => acc.id === id)
    );
  }

  getAccounts(): Accounts {
    return this.accounts;
  }

  getAccountList(): Account[] {
    return [
      ...Object.values(this.accounts.primary).flat(),
      ...Object.values(this.accounts.imported),
    ];
  }

  #findAccountByAddress(addressC: string) {
    return Object.values(this.accounts.imported).find(
      (acc) => acc.addressC === addressC,
    );
  }

  getPrimaryAccountsByWalletId(walletId: string) {
    return this.accounts.primary[walletId] ?? [];
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
        `Imported Account ${Object.keys(this.accounts.imported).length + 1}`,
      type,
    };
  }
  #getAllAddresses() {
    return this.getAccountList().flatMap(getAllAddressesForAccount);
  }

  async addPrimaryAccount({ walletId }: AddAccountParams) {
    const selectedWalletAccounts = this.accounts.primary[walletId] ?? [];
    const lastAccount = selectedWalletAccounts.at(-1);

    const nextIndex = lastAccount ? lastAccount.index + 1 : 0;
    const newAccount = {
      index: nextIndex,
      name: `Account ${nextIndex + 1}`,
      type: AccountType.PRIMARY as const,
      walletId: walletId,
    };

    const addresses = await this.secretsService.addAddress({
      index: nextIndex,
      walletId,
      networkService: this.networkService,
      ledgerService: this.ledgerService,
    });

    const id = crypto.randomUUID();

    this.accounts = {
      ...this.accounts,
      primary: {
        ...this.accounts.primary,
        [walletId]: [
          ...selectedWalletAccounts,
          {
            ...newAccount,
            id,
            addressC: addresses[NetworkVMType.EVM],
            addressBTC: addresses[NetworkVMType.BITCOIN],
            addressAVM: addresses[NetworkVMType.AVM],
            addressPVM: addresses[NetworkVMType.PVM],
            addressCoreEth: addresses[NetworkVMType.CoreEth],
            addressHVM: addresses[NetworkVMType.HVM],
          },
        ],
      },
    };
    await this.permissionsService.addWhitelistDomains(
      addresses[NetworkVMType.EVM],
    );

    this.analyticsServicePosthog.captureEncryptedEvent({
      name: 'addedNewPrimaryAccount',
      windowId: crypto.randomUUID(),
      properties: { addresses: this.#getAllAddresses() },
    });
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
        this.networkService,
      );

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

      this.accounts = {
        ...this.accounts,
        imported: {
          ...this.accounts.imported,
          [newAccount.id]: newAccount,
        },
      };
      await this.permissionsService.addWhitelistDomains(newAccount.addressC);
      this.analyticsServicePosthog.captureEncryptedEvent({
        name: 'addedNewImportedAccount',
        windowId: crypto.randomUUID(),
        properties: { addresses: this.#getAllAddresses() },
      });
      return account.id;
    } catch (err) {
      throw new Error(
        `Account import failed with error: ${(err as Error).message}`,
      );
    }
  }

  async setAccountName(id: string, name: string) {
    const accountToChange = this.getAccountByID(id);

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
    const newAccounts = { ...this.accounts.imported };
    newAccounts[account.id] = accountWithNewName;
    this.accounts = { ...this.accounts, imported: newAccounts };
  }

  async #renamePrimaryAccount(account: PrimaryAccount, name: string) {
    const accountWithNewName = { ...account, name };

    const walletAccounts = this.accounts.primary[account.walletId];

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

    this.accounts = {
      ...this.accounts,
      primary: {
        ...this.accounts.primary,
        [accountWithNewName.walletId]: newWalletAccounts,
      },
    };
  }

  async activateAccount(id: string) {
    const accountToActivate = this.getAccountByID(id);

    if (!accountToActivate) {
      throw new Error(`Account activation failed: account not found`);
    }

    this.accounts = {
      ...this.accounts,
      active: accountToActivate,
    };
  }

  async deleteAccounts(ids: string[]) {
    const { active } = this.accounts;

    const walletIds = Object.keys(this.accounts.primary);

    const accountsCount = Object.values(this.accounts.primary).flat().length;
    const importedAccountIds = ids.filter((id) => id in this.accounts.imported);
    const primaryAccountIds = ids.filter(
      (id) => !(id in this.accounts.imported),
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

      const walletAccounts = this.accounts.primary[walletId];
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
    for (const [walletId, values] of Object.entries(this.accounts.imported)) {
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
        : this.accounts.active;

    if (!newActiveAccount) {
      throw new Error('There is no new active account!');
    }

    await this.secretsService.deleteImportedWallets(
      ids,
      this.walletConnectService,
    );

    this.accounts = {
      primary: newPrimaryAccounts,
      imported: newImportedAccounts,
      active: newActiveAccount,
    };

    return ids.length;
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
