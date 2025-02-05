import { singleton } from 'tsyringe';
import type { StorageService } from '../storage/StorageService';

export const WALLET_CONNECT_STORAGE_KEY = 'wallet-connect-data-store';

type WalletConnectStore<T = unknown> = Record<string, T>;

type Task = {
  resolve: () => void;
  reject: () => void;
  promise: Promise<void>;
  task: () => Promise<void>;
};
type TaskQueue = Task[];

/**
 * Adapter to our StorageService to be used by WalletConnect libs.
 * It needs to satisfy the required interface:
 * https://github.com/WalletConnect/walletconnect-utils/tree/master/misc/keyvaluestorage#api
 *
 * It also needs to be a singleton so that we can ensure sequential writes to chrome.storage.
 */
@singleton()
export class WalletConnectStorage {
  #taskQueue: TaskQueue = [];

  constructor(private storage: StorageService) {}

  async setItem<T = any>(
    key: keyof WalletConnectStore,
    value: T,
  ): Promise<void> {
    return this.#addToQueue(() => this.#write(key, value));
  }

  async getItem<T = any>(
    key: keyof WalletConnectStore<T>,
  ): Promise<T | undefined> {
    const store = await this.#getStore<T>();

    return store[key];
  }

  async removeItem(key: string): Promise<void> {
    return this.#addToQueue(() => this.#remove(key));
  }

  async getKeys(): Promise<string[]> {
    const store = await this.#getStore();

    return Object.keys(store);
  }

  /**
   * FIXME: The typing for .getEntries() method is not correct,
   * but it is forced by WalletConnect's expectations.
   *
   * I reported this in WalletConnect's repo:
   * https://github.com/WalletConnect/walletconnect-utils/issues/127
   *
   * The proper signature would be:
   * 		async getEntries(): Promise<[string, unknown][]>
   */
  async getEntries<T = any>(): Promise<[string, T][]> {
    const store = await this.#getStore<T>();

    return Object.entries(store);
  }

  async clear() {
    return this.storage.removeFromStorage(WALLET_CONNECT_STORAGE_KEY);
  }

  async #getStore<T = unknown>(): Promise<WalletConnectStore<T>> {
    const store = await this.storage.load<WalletConnectStore<T>>(
      WALLET_CONNECT_STORAGE_KEY,
    );

    return store ?? {};
  }

  #addToQueue(task: () => Promise<void>) {
    let resolve;
    let reject;
    const promise = new Promise<void>((promiseResolve, promiseReject) => {
      resolve = promiseResolve;
      reject = promiseReject;
    });

    this.#taskQueue.push({
      task,
      promise,
      resolve,
      reject,
    });

    // Only start processing if the queue is empty.
    // Otherwise, the item will be picked up after previous
    // write call finishes
    if (this.#taskQueue.length === 1) {
      this.#processQueue();
    }

    return promise;
  }

  #processQueue() {
    const [item] = this.#taskQueue;

    if (!item) {
      return;
    }

    const { task, resolve, reject } = item;

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.#taskQueue.shift();
        this.#processQueue();
      });
  }

  async #write<T = any>(
    key: keyof WalletConnectStore,
    value: T,
  ): Promise<void> {
    const store = await this.#getStore();

    store[key] = value;

    await this.storage.save(WALLET_CONNECT_STORAGE_KEY, store);
  }

  async #remove(key: string): Promise<void> {
    const store = await this.#getStore();

    delete store[key];

    await this.storage.save(WALLET_CONNECT_STORAGE_KEY, store);
  }
}
