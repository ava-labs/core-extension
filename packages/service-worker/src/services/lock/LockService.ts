import { EXTENSION_SCRIPT } from '@core/common';
import {
  AlarmsEvents,
  DEFAULT_AUTO_LOCK_TIMER,
  isAutoLockTimer,
  LockEvents,
  LockStateChangedEventPayload,
  MAX_AUTO_LOCK_TIMER,
  SETTINGS_STORAGE_KEY,
  SettingsState,
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

  public get locked(): boolean {
    return this.#locked;
  }

  constructor(
    private callbackManager: CallbackManager,
    private storageService: StorageService,
  ) {}

  async activate() {
    chrome.runtime.onConnect.addListener((port) => {
      // Only an extension UI view (popup, side panel, approval window, tab)
      // counts as wallet activity. Content-script ports connect on every
      // http(s) page and frame, so letting them clear the alarm would mean
      // ordinary browsing keeps the wallet unlocked indefinitely.
      if (
        port?.name === EXTENSION_SCRIPT &&
        port.sender?.id === chrome.runtime.id
      ) {
        chrome.alarms.clear(AlarmsEvents.AUTO_LOCK);
      }
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AlarmsEvents.AUTO_LOCK) {
        this.lock();
      }
    });
  }

  async onAllExtensionsClosed(): Promise<void> {
    if (!this.#locked) {
      chrome.alarms.create(AlarmsEvents.AUTO_LOCK, {
        delayInMinutes: await this.#getAutoLockInMinutes(),
      });
    }
  }

  // Read the auto-lock timeout straight from encrypted storage rather than
  // depending on SettingsService, which would introduce a circular dependency:
  // LockService -> SettingsService -> FeatureFlagService -> LockService.
  async #getAutoLockInMinutes(): Promise<number> {
    try {
      const settings =
        await this.storageService.load<SettingsState>(SETTINGS_STORAGE_KEY);
      const value = settings?.autoLockTimer;
      // Never exceed the maximum, even if storage holds an unexpected value.
      return isAutoLockTimer(value)
        ? Math.min(value, MAX_AUTO_LOCK_TIMER)
        : DEFAULT_AUTO_LOCK_TIMER;
    } catch {
      return DEFAULT_AUTO_LOCK_TIMER;
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
