import { injectable } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  NAVIGATION_HISTORY_STORAGE_KEY,
  NavigationHistoryState,
  NavigationHistoryStorage,
  NavigationHistoryDataState,
} from './models';

@injectable()
export class NavigationHistoryService {
  private excludedPathNames = [
    '/send/confirm',
    '/collectible/send/confirm',
    '/bridge/confirm',
  ];
  private reservedData = ['listType'];

  constructor(private storageService: StorageService) {}

  private async loadFromStorage(): Promise<NavigationHistoryStorage> {
    return (
      (await this.storageService.load<NavigationHistoryStorage>(
        NAVIGATION_HISTORY_STORAGE_KEY,
      )) ?? { state: {}, data: {} }
    );
  }

  private async saveToStorage(data: NavigationHistoryStorage) {
    await this.storageService.save<NavigationHistoryStorage>(
      NAVIGATION_HISTORY_STORAGE_KEY,
      data,
    );
  }

  async getHistory(): Promise<NavigationHistoryState> {
    const history = await this.loadFromStorage();

    return history.state || {};
  }

  async setHistory(
    state: NavigationHistoryState,
  ): Promise<NavigationHistoryState> {
    const current = await this.loadFromStorage();
    if (this.excludedPathNames.includes(state.location.pathname)) {
      return current.state;
    }

    const resetNavigationHistoryData = this.reservedData.reduce(
      (historyData, dataItem) => {
        if (current.data[dataItem]) {
          return {
            ...historyData,
            [dataItem]: current.data[dataItem],
          };
        }
        return {
          ...historyData,
        };
      },
      {},
    );

    await this.saveToStorage({
      state,
      data: resetNavigationHistoryData,
    });
    return state;
  }

  async getHistoryData(): Promise<NavigationHistoryDataState> {
    const history = await this.loadFromStorage();

    return history.data || {};
  }

  async setHistoryData(
    data: NavigationHistoryDataState,
  ): Promise<NavigationHistoryDataState> {
    const current = await this.loadFromStorage();

    await this.saveToStorage({
      ...current,
      data,
    });

    return data;
  }
}
