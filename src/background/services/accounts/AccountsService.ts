import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  Account,
  AccountsEvents,
  AccountStorageItem,
  ACCOUNTS_STORAGE_KEY,
} from './models';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { WalletService } from '../wallet/WalletService';
import { NetworkService } from '../network/NetworkService';
import { NetworkVMType } from '@avalabs/chains-sdk';

@singleton()
export class AccountsService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();

  private _accounts: Account[] = [];

  private set accounts(acc: Account[]) {
    if (JSON.stringify(this._accounts) === JSON.stringify(acc)) {
      return;
    }
    this._accounts = acc;

    // do not save empty list of accounts to storage
    if (this._accounts.length > 0) {
      this.saveAccounts(this._accounts);
    }
    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  private get accounts(): Account[] {
    return this._accounts;
  }

  public get activeAccount(): Account | undefined {
    return this.accounts.find((a) => a.active);
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
    this.accounts = [];
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
    if (accounts.length === 0) {
      return;
    }

    const accountsWithAddresses: Account[] = [];

    for (const acc of accounts) {
      // use cached addresses unless they need to be updated due to testnet switches
      if (!updateAddresses && acc.addressC && acc.addressBTC) {
        accountsWithAddresses.push({
          ...acc,
          addressC: acc.addressC,
          addressBTC: acc.addressBTC,
        });
      } else {
        const addresses = await this.walletService.getAddress(acc.index);

        accountsWithAddresses.push({
          ...acc,
          addressC: addresses[NetworkVMType.EVM],
          addressBTC: addresses[NetworkVMType.BITCOIN],
        });
      }
    }
    this.accounts = accountsWithAddresses;
  };

  private async loadAccounts(): Promise<AccountStorageItem[]> {
    const accounts = await this.storageService.load<AccountStorageItem[]>(
      ACCOUNTS_STORAGE_KEY
    );

    return accounts ?? [];
  }

  private async saveAccounts(accounts: AccountStorageItem[]) {
    await this.storageService.save<AccountStorageItem[]>(
      ACCOUNTS_STORAGE_KEY,
      accounts
    );
  }

  getAccounts(): Account[] {
    return this.accounts;
  }

  async addAccount(name?: string) {
    const lastAccount = this.accounts.at(-1);
    const nextIndex = lastAccount ? lastAccount.index + 1 : 0;
    const newAccount = {
      index: nextIndex,
      name: name || `Account ${nextIndex + 1}`,
      active: false,
    };

    const addresses = await this.walletService.addAddress(nextIndex);

    this.accounts = [
      ...this.accounts,
      {
        ...newAccount,
        addressC: addresses[NetworkVMType.EVM],
        addressBTC: addresses[NetworkVMType.BITCOIN],
      },
    ];
  }

  async setAccountName(index: number, name: string) {
    const accountToChange = this.accounts[index];

    if (!accountToChange) {
      throw new Error(`Account with index ${index} not found`);
    }
    // create copy of the object to prevent updating this.accounts
    const accountWithNewName = { ...accountToChange, name };
    const newAccounts = [...this.accounts];
    newAccounts[index] = accountWithNewName;

    this.accounts = newAccounts;
  }

  async activateAccount(index: number) {
    this.accounts = this.accounts.map((acc) => ({
      ...acc,
      active: acc.index === index,
    }));
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
