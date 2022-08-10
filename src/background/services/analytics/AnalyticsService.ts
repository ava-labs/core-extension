import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  AnalyticsEvents,
  AnalyticsSessionState,
  AnalyticsState,
  AnalyticsUnencryptedState,
  ANALYTICS_SESSION_KEY,
  ANALYTICS_STORAGE_KEY,
  ANALYTICS_UNENCRYPTED_STORAGE_KEY,
} from './models';

@singleton()
export class AnalyticsService implements OnStorageReady {
  private eventEmitter = new EventEmitter();

  constructor(private storageService: StorageService) {}

  async onStorageReady(): Promise<void> {
    const state = await this.getIds();
    if (state) {
      this.eventEmitter.emit(AnalyticsEvents.ANALYTICS_STATE_UPDATED, state);
    }

    this.getSessionId();
  }

  async clearIds() {
    await this.storageService.removeFromStorage(ANALYTICS_STORAGE_KEY);
  }

  async getSessionId() {
    const session =
      await this.storageService.loadFromSessionStorage<AnalyticsSessionState>(
        ANALYTICS_SESSION_KEY
      );

    if (session) {
      return session.sessionId;
    }

    const newSession: AnalyticsSessionState = {
      sessionId: crypto.randomUUID(),
    };
    await this.storageService.saveToSessionStorage(
      ANALYTICS_SESSION_KEY,
      newSession
    );

    return newSession.sessionId;
  }

  async getIds(): Promise<AnalyticsState | undefined> {
    // get cache first since it's already decrypted
    const cachedState =
      await this.storageService.loadFromSessionStorage<AnalyticsState>(
        ANALYTICS_STORAGE_KEY
      );
    if (cachedState) {
      return cachedState;
    }

    const state = await this.storageService.load<AnalyticsState>(
      ANALYTICS_STORAGE_KEY
    );
    if (state) {
      await this.cacheAnalyticsIds(state);
    }
    return state;
  }

  async initIds(storeInStorage: boolean) {
    const analyticsUnencryptedState: AnalyticsUnencryptedState | undefined =
      await this.storageService.loadUnencrypted(
        ANALYTICS_UNENCRYPTED_STORAGE_KEY
      );
    const savedDeviceId = analyticsUnencryptedState?.deviceId;

    const state: AnalyticsState = {
      deviceId: savedDeviceId || crypto.randomUUID(),
      userId: crypto.randomUUID(),
    };

    if (!savedDeviceId) {
      // we don't need to encrypt the device id it doesn't carry any sensible information
      // we want to restore that id after the user logs out and it's possible if the data isn't encrypted
      // this will persist the device id through sign outs
      await this.storageService.saveUnencrypted(
        ANALYTICS_UNENCRYPTED_STORAGE_KEY,
        {
          deviceId: state.deviceId,
        }
      );
    }

    await this.cacheAnalyticsIds(state);
    if (storeInStorage) {
      await this.storageService.save(ANALYTICS_STORAGE_KEY, state);
    }
    this.eventEmitter.emit(AnalyticsEvents.ANALYTICS_STATE_UPDATED, state);
  }

  async saveTemporaryAnalyticsIds() {
    const state =
      await this.storageService.loadFromSessionStorage<AnalyticsState>(
        ANALYTICS_STORAGE_KEY
      );
    if (!state) {
      throw new Error('temporary analytics Ids not found');
    }

    await this.storageService.save(ANALYTICS_STORAGE_KEY, state);
  }

  private async cacheAnalyticsIds(state: AnalyticsState) {
    await this.storageService.saveToSessionStorage(
      ANALYTICS_STORAGE_KEY,
      state
    );
  }

  async getUnencryptedDeviceId() {
    const analyticsUnencryptedState =
      await this.storageService.loadUnencrypted<AnalyticsUnencryptedState>(
        ANALYTICS_UNENCRYPTED_STORAGE_KEY
      );

    return analyticsUnencryptedState?.deviceId;
  }

  async setUnencryptedDeviceId(deviceId?: string) {
    await this.storageService.saveUnencrypted<AnalyticsUnencryptedState>(
      ANALYTICS_UNENCRYPTED_STORAGE_KEY,
      {
        deviceId,
      }
    );
  }

  addListener(event: AnalyticsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
