import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  AnalyticsEvents,
  AnalyticsState,
  ANALYTICS_STORAGE_KEY,
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
  }

  async clearIds() {
    await this.storageService.removeFromStorage(ANALYTICS_STORAGE_KEY);
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
    const state = {
      deviceId: crypto.randomUUID(),
      userId: crypto.randomUUID(),
    };

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

  addListener(event: AnalyticsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
