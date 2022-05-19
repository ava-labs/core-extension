import { CallbackManager } from '@src/background/runtime/CallbackManager';
import { container, singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import { WalletService } from '../wallet/WalletService';
import { LOCK_TIMEOUT, SessionAuthData, SESSION_AUTH_DATA_KEY } from './models';

@singleton()
export class LockService {
  private _locked = true;

  private lockCheckInterval?: any;

  public get locked(): boolean {
    return this._locked;
  }

  constructor(
    private callbackManager: CallbackManager,
    private storageService: StorageService
  ) {}

  async activate() {
    const authData =
      await this.storageService.loadFromSessionStorage<SessionAuthData>(
        SESSION_AUTH_DATA_KEY
      );

    if (
      !authData?.password ||
      !authData?.loginTime ||
      authData.loginTime + LOCK_TIMEOUT < Date.now()
    ) {
      await this.storageService.removeFromSessionStorage(SESSION_AUTH_DATA_KEY);
      return;
    }

    await this.unlock(authData.password);
    this.startAutoLockInterval(authData?.loginTime);
  }

  async unlock(password: string) {
    try {
      await this.storageService.activate(password);
      // need to be activate before other services due to the react-wallet-components wallet objects
      // TODO use proper onUnlock callback once react-wallet-components is removed from the project
      await container.resolve(WalletService).activate();

      // save password to session storage to make auto unlock possible when the service worker restarts
      await this.storageService.saveToSessionStorage(SESSION_AUTH_DATA_KEY, {
        password,
        loginTime: Date.now(),
      });

      this._locked = false;
      this.callbackManager.onUnlock();
    } catch (e) {
      throw new Error('invalid password');
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const authData =
      await this.storageService.loadFromSessionStorage<SessionAuthData>(
        SESSION_AUTH_DATA_KEY
      );

    if (!authData || oldPassword !== authData.password) {
      throw new Error('wrong password');
    }
    await this.storageService.changePassword(oldPassword, newPassword);
  }

  private startAutoLockInterval(loginTime: number) {
    const timeToLock = loginTime + LOCK_TIMEOUT;
    this.lockCheckInterval = setInterval(() => {
      if (Date.now() > timeToLock) {
        clearInterval(this.lockCheckInterval);
        this.lock();
      }
    }, 60000);
  }

  async verifyPassword(password: string): Promise<boolean> {
    const authData =
      await this.storageService.loadFromSessionStorage<SessionAuthData>(
        SESSION_AUTH_DATA_KEY
      );

    return authData && password === authData.password;
  }

  lock() {
    this.storageService.clearSessionStorage();
    this.callbackManager.onLock();
  }
}
