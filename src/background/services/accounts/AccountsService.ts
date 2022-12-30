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
} from './models';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { WalletService } from '../wallet/WalletService';
import { NetworkService } from '../network/NetworkService';
import { NetworkVMType } from '@avalabs/chains-sdk';

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

    this._accounts = accounts;

    // do not save empty list of accounts to storage
    if (accounts.primary.length > 0) {
      if (accounts.active?.type === AccountType.PRIMARY) {
        const activeAccount = accounts.primary[accounts.active.index];

        if (activeAccount) {
          this._accounts.active = activeAccount;
        }
      } else if (accounts.active?.type === AccountType.IMPORTED) {
        const activeAccount = accounts.imported[accounts.active.id];

        if (activeAccount) {
          this._accounts.active = activeAccount;
        }
      }

      this.saveAccounts(this._accounts);
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
    private networkService: NetworkService
  ) {}

  async onUnlock(): Promise<void> {
    await this.init();

    // refresh addresses so in case the user switches to testnet the BTC address gets updated
    this.networkService.activeNetworkChanged.add(this.onDeveloperModeChanged);
  }

  onLock() {
    this.accounts = {
      active: undefined,
      primary: [],
      imported: {},
    };

    this.networkService.activeNetworkChanged.remove(
      this.onDeveloperModeChanged
    );
  }

  private onDeveloperModeChanged = () => {
    this.init(true);
  };

  private init = async (updateAddresses?: boolean) => {
    const accounts = await this.loadAccounts();
    // no accounts added yet, onboarding is not done yet
    if (accounts.primary.length === 0) {
      return;
    }

    const isUpdated = (account: Account) =>
      !updateAddresses &&
      account.addressC &&
      account.addressBTC &&
      account.addressAVM &&
      account.addressPVM &&
      account.addressCoreEth;

    const [primaryAccountsWithAddresses, importedAccountsWithAddresses] =
      await Promise.all([
        Promise.all(
          accounts.primary.map(async (account) => {
            if (isUpdated(account)) {
              return account;
            } else {
              const addresses = await this.walletService.getAddresses(
                account.index
              );

              return {
                ...account,
                addressC: addresses[NetworkVMType.EVM],
                addressBTC: addresses[NetworkVMType.BITCOIN],
                addressAVM: addresses[NetworkVMType.AVM],
                addressPVM: addresses[NetworkVMType.PVM],
                addressCoreEth: addresses[NetworkVMType.CoreEth],
              };
            }
          })
        ),
        Promise.all(
          Object.values(accounts.imported).map(async (account) => {
            if (isUpdated(account)) {
              return account;
            } else {
              const addresses = await this.walletService.getImportedAddresses(
                account.id
              );

              return {
                ...account,
                ...addresses,
              };
            }
          })
        ),
      ]);

    this.accounts = {
      ...accounts,
      primary: primaryAccountsWithAddresses,
      imported: importedAccountsWithAddresses.reduce((accounts, account) => {
        accounts[account.id] = account;
        return accounts;
      }, {}),
    };
  };

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

  isAlreadyImported(addressC: string) {
    return Object.values(this.accounts.imported).some(
      (acc) => acc.addressC === addressC
    );
  }

  async addAccount(name?: string, options?: ImportData) {
    if (options) {
      try {
        const { account, commit } = await this.walletService.addImportedWallet(
          options
        );

        if (this.isAlreadyImported(account.addressC)) {
          throw new Error('Account has been already imported');
        }

        // the imported account is unique, we can save its secret
        await commit();

        const newAccount: ImportedAccount = {
          ...account,
          name:
            name ||
            `Imported Account ${
              Object.keys(this.accounts.imported).length + 1
            }`,
          type: AccountType.IMPORTED as const,
        };

        this.accounts = {
          ...this.accounts,
          imported: {
            ...this.accounts.imported,
            [newAccount.id]: newAccount,
          },
        };

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
    } else if (accountToChange.type === AccountType.IMPORTED) {
      const accountWithNewName = { ...accountToChange, name };
      const newAccounts = { ...this.accounts.imported };
      newAccounts[id] = accountWithNewName;
      this.accounts = { ...this.accounts, imported: newAccounts };
    } else {
      throw new Error('Account rename failed: unknown account type');
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
        const { [id]: _, ...newAccounts } = accounts;
        return newAccounts;
      },
      { ...this.accounts.imported }
    );

    const active =
      this.accounts.active?.type === AccountType.IMPORTED &&
      ids.includes(this.accounts.active.id)
        ? this.accounts.primary[0]
        : this.accounts.active;

    await this.walletService.deleteImportedWallets(ids);

    this.accounts = {
      ...this.accounts,
      imported: newAccounts,
      active,
    };
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
