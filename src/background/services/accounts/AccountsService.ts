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

  private accounts: Account[] = [];

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
    this.networkService.developerModeChanges.add(this.init);
  }

  onLock() {
    this.accounts = [];
    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
    this.networkService.developerModeChanges.remove(this.init);
  }

  private init = async () => {
    const accounts = await this.loadAccounts();
    // no accounts added yet, onboarding is not done yet
    if (accounts.length === 0) {
      return;
    }

    const activeIndex = accounts.find((a) => a.active)?.index || 0;
    this.accounts = [];
    for (const acc of accounts) {
      const addresses = await this.walletService.getAddress(acc.index);

      this.accounts.push({
        ...acc,
        active: acc.index === activeIndex,
        addressC: addresses[NetworkVMType.EVM],
        addressBTC: addresses[NetworkVMType.BITCOIN],
      });
    }

    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
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
    const storageAccounts = await this.loadAccounts();
    const lastAccount = this.accounts.at(-1);
    const nextIndex = lastAccount ? lastAccount.index + 1 : 0;
    const newAccount = {
      index: nextIndex,
      name: name || `Account ${nextIndex + 1}`,
      active: false,
    };

    const addresses = await this.walletService.getAddress(nextIndex);

    this.accounts = [
      ...this.accounts,
      {
        ...newAccount,
        addressC: addresses[NetworkVMType.EVM],
        addressBTC: addresses[NetworkVMType.BITCOIN],
      },
    ];

    await this.saveAccounts([...storageAccounts, newAccount]);
    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  async setAccountName(index: number, name: string) {
    const account = this.accounts[index];
    if (!account) {
      throw new Error(`Account with index ${index} not found`);
    }

    const storageAccounts = await this.loadAccounts();

    const storedAccount = storageAccounts[index];
    if (storedAccount) storedAccount.name = name;
    account.name = name;

    await this.saveAccounts(storageAccounts);

    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  async activateAccount(index: number) {
    let accounts: AccountStorageItem[] = [];
    try {
      accounts = await this.loadAccounts();
    } catch (e) {
      console.error(e);
    }
    const newAccounts = accounts.map((acc) => ({
      ...acc,
      active: acc.index === index,
    }));

    await this.saveAccounts(newAccounts);

    this.accounts = this.accounts.map((acc) => ({
      ...acc,
      active: acc.index === index,
    }));

    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  addListener<T = unknown>(event: AccountsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
