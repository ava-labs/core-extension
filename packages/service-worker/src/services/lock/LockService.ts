import {
  AlarmsEvents,
  LockEvents,
  LockStateChangedEventPayload,
} from '@core/types';
import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { CallbackManager } from '../../runtime/CallbackManager';
import { OnAllExtensionClosed } from '../../runtime/lifecycleCallbacks';
import { StorageService } from '../storage/StorageService';

@singleton()
export class LockService implements OnAllExtensionClosed {
  private eventEmitter = new EventEmitter();
  #locked = true;

  #autoLockInMinutes = 30;

  public get locked(): boolean {
    return this.#locked;
  }

  constructor(
    private callbackManager: CallbackManager,
    private storageService: StorageService,
  ) {}

  async activate() {
    chrome.runtime.onConnect.addListener(() => {
      chrome.alarms.clear(AlarmsEvents.AUTO_LOCK);
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AlarmsEvents.AUTO_LOCK) {
        this.lock();
      }
    });
  }

  onAllExtensionsClosed(): void | Promise<void> {
    if (!this.#locked) {
      chrome.alarms.create(AlarmsEvents.AUTO_LOCK, {
        periodInMinutes: this.#autoLockInMinutes,
      });
    }
  }

  async unlock(password: string) {
    try {
      await this.storageService.activate(password);

      this.#locked = false;
      this.callbackManager.onUnlock();
      this.eventEmitter.emit(LockEvents.LOCK_STATE_CHANGED, {
        isUnlocked: true,
      });
    } catch (_err) {
      throw new Error('invalid password');
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    await this.storageService.changePassword(oldPassword, newPassword);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await this.storageService.verifyPassword(password);
  }

  lock() {
    this.#locked = true;
    this.storageService.clearSessionStorage();
    this.callbackManager.onLock();
    this.eventEmitter.emit(LockEvents.LOCK_STATE_CHANGED, {
      isUnlocked: false,
    });
    chrome.alarms.clear(AlarmsEvents.AUTO_LOCK);
  }

  addListener(
    event: LockEvents.LOCK_STATE_CHANGED,
    callback: (data: LockStateChangedEventPayload) => void,
  ) {
    this.eventEmitter.addListener(event, callback);
  }

  removeListener(
    event: LockEvents.LOCK_STATE_CHANGED,
    callback: (data: LockStateChangedEventPayload) => void,
  ) {
    this.eventEmitter.removeListener(event, callback);
  }
}
