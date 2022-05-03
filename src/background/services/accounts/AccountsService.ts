import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import { NetworkService } from '../network/NetworkService';
import {
  activateAccount,
  addAccount as addAccountSDK,
} from '@avalabs/wallet-react-components';
import { accounts$ as sdkAccount$ } from '@avalabs/wallet-react-components';
import {
  Account,
  AccountsEvents,
  AccountStorageItem,
  ACCOUNTS_STORAGE_KEY,
} from './models';
import { firstValueFrom } from 'rxjs';
import { StorageEvents } from '../storage/models';
import { LockService } from '../lock/LockService';
import { LockEvents } from '../lock/models';

@singleton()
export class AccountsService {
  private eventEmitter = new EventEmitter();

  private accounts: Account[] = [];

  public get activeAccount(): Account | undefined {
    return this.accounts.find((a) => a.active);
  }

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private lockService: LockService
  ) {
    storageService.addListener(StorageEvents.INITIALIZED, () => {
      this.init();
    });
    // Implement tsyringe Disposable interface once it's released
    lockService.addListener(LockEvents.LOCKED, () => {
      this.accounts = [];
      this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
    });
  }

  private async init() {
    const accounts = await this.loadAccounts();
    // no accounts added yet, onboarding is not done yet
    if (accounts.length === 0) {
      return;
    }
    const sdkAccounts = await firstValueFrom(sdkAccount$);

    // add missing accounts
    for (let i = sdkAccounts.length; i < accounts.length; i++) {
      sdkAccounts.push(addAccountSDK());
    }
    const activeIndex = accounts.find((a) => a.active)?.index || 0;
    this.accounts = accounts.map((acc) => ({
      ...acc,
      active: acc.index === activeIndex,
      addressC: sdkAccounts[acc.index].wallet.getAddressC(),
      addressBTC: sdkAccounts[acc.index].wallet.getAddressBTC(
        this.networkService.isMainnet ? 'bitcoin' : 'testnet'
      ),
    }));

    // activate account
    await this.activateAccount(activeIndex);
    this.refreshBalances();
  }

  private async refreshBalances() {
    const sdkAccounts = await firstValueFrom(sdkAccount$);
    const accountsWithBallances: Account[] = [];
    for (const account of this.accounts) {
      const balance = await firstValueFrom(sdkAccounts[account.index].balance$);
      accountsWithBallances.push({
        ...account,
        balance,
      });
    }

    this.accounts = accountsWithBallances;
    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

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

    const newSDKAccount = addAccountSDK();
    const newAccount = {
      index: newSDKAccount.index,
      name: name || `Account ${newSDKAccount.index + 1}`,
      active: false,
    };

    const balance = await firstValueFrom(newSDKAccount.balance$);

    this.accounts = [
      ...this.accounts,
      {
        ...newAccount,
        addressC: newSDKAccount.wallet.getAddressC(),
        addressBTC: newSDKAccount.wallet.getAddressBTC(
          this.networkService.isMainnet ? 'bitcoin' : 'testnet'
        ),
        balance,
      },
    ];

    await this.saveAccounts([...storageAccounts, newAccount]);
    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  async setAccountName(index: number, name: string) {
    if (!this.accounts[index]) {
      throw new Error(`Account widh index ${index} not found`);
    }

    const storageAccounts = await this.loadAccounts();

    storageAccounts[index].name = name;
    this.accounts[index].name = name;

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

    await activateAccount(index);
    await this.saveAccounts(newAccounts);

    this.accounts = this.accounts.map((acc) => ({
      ...acc,
      active: acc.index === index,
    }));

    this.eventEmitter.emit(AccountsEvents.ACCOUNTS_UPDATED, this.accounts);
  }

  addListener(event: AccountsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
