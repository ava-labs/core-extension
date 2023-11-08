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
} from './models';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { WalletService } from '../wallet/WalletService';
import { NetworkService } from '../network/NetworkService';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { PermissionsService } from '../permissions/PermissionsService';
import { isProductionBuild } from '@src/utils/environment';
import { DerivedAddresses } from '../secrets/models';
import { isPrimaryAccount } from './utils/typeGuards';

@singleton()
export class AccountsService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();

  private _accounts: Accounts = {
    active: undefined,
    primary: [],
    imported: {},
  };

  private set accounts(accounts: Accounts) {
    if (JSON.stringify(this._accounts) === JSON.stringify(accounts)) {
      return;
    }

    const activeAccountChanged =
      this._accounts.active?.id !== accounts.active?.id;
    this._accounts = accounts;

    // do not save empty list of accounts to storage
    if (accounts.primary.length > 0) {
      if (accounts.active) {
        const activeAccount = isPrimaryAccount(accounts.active)
          ? accounts.primary[accounts.active.index]
          : accounts.imported[accounts.active.id];

        this._accounts.active = activeAccount;
      }

      this.saveAccounts(this._accounts);
    }

    if (activeAccountChanged) {
      this.eventEmitter.emit(
        AccountsEvents.ACTIVE_ACCOUNT_CHANGED,
        this.accounts.active
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
    private walletService: WalletService,
    private networkService: NetworkService,
    private permissionsService: PermissionsService
  ) {}

  async onUnlock(): Promise<void> {
    await this.init();

    // refresh addresses so in case the user switches to testnet mode,
    // as the BTC address needs to be updated
    this.networkService.developerModeChanged.add(this.onDeveloperModeChanged);
  }

  onLock() {
    this.accounts = {
      active: undefined,
      primary: [],
      imported: {},
    };

    this.networkService.developerModeChanged.remove(
      this.onDeveloperModeChanged
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

    const [primaryAccount] = this.accounts.primary;
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
    // no accounts added yet, onboarding is not done yet
    if (accounts.primary.length === 0) {
      return;
    }

    const refreshAccount = async <T extends Account>(
      account: T
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

    const [primaryAccountsWithAddresses, importedAccountsWithAddresses] =
      await Promise.all([
        Promise.all(accounts.primary.map(refreshAccount)),
        Promise.all(Object.values(accounts.imported).map(refreshAccount)),
      ]);

    this.accounts = {
      ...accounts,
      primary: primaryAccountsWithAddresses,
      imported: importedAccountsWithAddresses.reduce((imported, account) => {
        imported[account.id] = account;
        return imported;
      }, {}),
    };
  };

  async getAddressesForAccount(account: Account): Promise<DerivedAddresses> {
    if (account.type !== AccountType.PRIMARY) {
      return this.walletService.getImportedAddresses(account.id);
    }

    const addresses = await this.walletService.getAddresses(account.index);

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
        primary: this.accounts.primary.map((acc) => {
          if (acc.id !== accountId) {
            return acc;
          }

          return {
            ...acc,
            ...addresses,
          };
        }),
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
    const accounts = await this.storageService.load<Accounts>(
      ACCOUNTS_STORAGE_KEY
    );

    return (
      accounts ?? {
        active: undefined,
        primary: [],
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
      this.accounts.primary.find((acc) => acc.id === id)
    );
  }

  getAccounts(): Accounts {
    return this.accounts;
  }

  getAccountList(): Account[] {
    return [...this.accounts.primary, ...Object.values(this.accounts.imported)];
  }

  #findAccountByAddress(addressC: string) {
    return Object.values(this.accounts.imported).find(
      (acc) => acc.addressC === addressC
    );
  }

  #buildAccount(
    accountData,
    importType: ImportType,
    suggestedName?: string
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

  async addAccount(name?: string, options?: ImportData) {
    if (options) {
      try {
        const { account, commit } = await this.walletService.addImportedWallet(
          options
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
          name
        );

        this.accounts = {
          ...this.accounts,
          imported: {
            ...this.accounts.imported,
            [newAccount.id]: newAccount,
          },
        };
        await this.permissionsService.addWhitelistDomains(newAccount.addressC);
        return account.id;
      } catch (err) {
        throw new Error(
          `Account import failed with error: ${(err as Error).message}`
        );
      }
    } else {
      const lastAccount = this.accounts.primary.at(-1);
      const nextIndex = lastAccount ? lastAccount.index + 1 : 0;
      const newAccount = {
        index: nextIndex,
        name: name || `Account ${nextIndex + 1}`,
        type: AccountType.PRIMARY as const,
      };

      const addresses = await this.walletService.addAddress(nextIndex);
      const id = crypto.randomUUID();

      this.accounts = {
        ...this.accounts,
        primary: [
          ...this.accounts.primary,
          {
            ...newAccount,
            id,
            addressC: addresses[NetworkVMType.EVM],
            addressBTC: addresses[NetworkVMType.BITCOIN],
            addressAVM: addresses[NetworkVMType.AVM],
            addressPVM: addresses[NetworkVMType.PVM],
            addressCoreEth: addresses[NetworkVMType.CoreEth],
          },
        ],
      };
      await this.permissionsService.addWhitelistDomains(
        addresses[NetworkVMType.EVM]
      );
      return id;
    }
  }

  async setAccountName(id: string, name: string) {
    const accountToChange = this.getAccountByID(id);

    if (!accountToChange) {
      throw new Error(`Account rename failed: account not found`);
    }

    if (accountToChange.type === AccountType.PRIMARY) {
      const accountWithNewName = { ...accountToChange, name };
      const newAccounts = [...this.accounts.primary];
      newAccounts[accountToChange.index] = accountWithNewName;
      this.accounts = { ...this.accounts, primary: newAccounts };
    } else {
      const accountWithNewName = { ...accountToChange, name };
      const newAccounts = { ...this.accounts.imported };
      newAccounts[id] = accountWithNewName;
      this.accounts = { ...this.accounts, imported: newAccounts };
    }
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
    const newAccounts = ids.reduce(
      (accounts, id) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...otherAccounts } = accounts;
        return otherAccounts;
      },
      { ...this.accounts.imported }
    );

    const { active } = this.accounts;

    const newActive =
      active && ids.includes(active.id)
        ? this.accounts.primary[0]
        : this.accounts.active;

    await this.walletService.deleteImportedWallets(ids);

    this.accounts = {
      ...this.accounts,
      imported: newAccounts,
      active: newActive,
    };
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
