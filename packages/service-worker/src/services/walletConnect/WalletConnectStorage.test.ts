import {
  WALLET_CONNECT_STORAGE_KEY,
  WalletConnectStorage,
} from './WalletConnectStorage';
import { StorageService } from '../storage/StorageService';

const getMockedStorageService = (fails = false) => {
  const state = {};
  // We don't want to use fake timers here, so try not to delay
  // things too much, otherwise the tests will get sluggish.
  const maxDelay = 10;
  let currentDelay = maxDelay;

  return {
    async load(key) {
      if (fails) {
        throw new Error('Missing encryption key');
      }

      return state[key];
    },
    save: jest.fn().mockImplementation((key, value) => {
      return new Promise<void>((resolve) => {
        // Make each subsequent call a little bit faster. This is to allow us
        // to test if the calls which arrive first are always served first.
        currentDelay = currentDelay === 1 ? maxDelay : currentDelay - 1;

        setTimeout(() => {
          state[key] = { ...value };
          resolve();
        }, currentDelay);
      });
    }),
    async removeFromStorage(key) {
      delete state[key];
    },
  } as unknown as StorageService;
};

describe('src/background/services/walletConnect/WalletConnectStorage.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('uses one parent key as a namespace for storing all data', async () => {
    const storageEngine = getMockedStorageService();
    const service = new WalletConnectStorage(storageEngine);

    await service.setItem('dummy-key', 123);

    expect(storageEngine.save).toHaveBeenCalledWith(
      WALLET_CONNECT_STORAGE_KEY,
      {
        'dummy-key': 123,
      },
    );
  });

  describe('storage management', () => {
    let service;

    beforeEach(async () => {
      const storageEngine = getMockedStorageService();
      service = new WalletConnectStorage(storageEngine);

      await service.clear();
      await service.setItem('dummy-key', 123);
    });

    it('allows reading items from the storage', async () => {
      expect(await service.getItem('dummy-key')).toEqual(123);
    });

    it('allows removing items from the storage', async () => {
      await service.removeItem('dummy-key');
      expect(await service.getItem('dummy-key')).toBeUndefined();
    });

    it('allows updating items in the storage', async () => {
      await service.setItem('dummy-key', 456);
      expect(await service.getItem('dummy-key')).toEqual(456);
    });

    it('allows storing complex data', async () => {
      const complexData = {
        a: {
          b: [{ c: 1, d: 'text' }],
          c: {
            nestedArrays: [
              [1, 2],
              [3, 4],
            ],
          },
        },
      };

      await service.setItem('complex', complexData);
      expect(await service.getItem('complex')).toEqual(complexData);
    });

    it('enumerates all keys', async () => {
      await service.setItem('key-2', 2);
      await service.setItem('key-3', 3);

      expect(await service.getKeys()).toEqual(['dummy-key', 'key-2', 'key-3']);
    });

    it('enumerates all entries', async () => {
      await service.setItem('key-2', 2);
      await service.setItem('key-3', 3);

      expect(await service.getEntries()).toEqual([
        ['dummy-key', 123],
        ['key-2', 2],
        ['key-3', 3],
      ]);
    });
  });

  it('raises errors whenever storage engine raises an error', async () => {
    const storageEngine = getMockedStorageService(true);
    const service = new WalletConnectStorage(storageEngine);

    expect(() => service.getItem('dummy-key')).rejects.toThrow(
      'Missing encryption key',
    );
  });

  it('allows clearing the storage in one call', async () => {
    const storageEngine = getMockedStorageService();
    const service = new WalletConnectStorage(storageEngine);

    // Set some data
    await service.setItem('key-1', 'value-1');
    await service.setItem('key-2', 'value-2');
    await service.setItem('key-3', 'value-3');

    expect(await service.getKeys()).toEqual(['key-1', 'key-2', 'key-3']);

    // Clear the data
    await service.clear();

    const keys = await service.getKeys();

    expect(keys).toEqual([]);
  });

  it('queues concurrent state update calls', async () => {
    const storageEngine = getMockedStorageService();
    const service = new WalletConnectStorage(storageEngine);

    await Promise.all([
      service.setItem('key-1', 1),
      service.setItem('key-2', 2),
      service.setItem('key-3', 3),
      service.removeItem('key-2'),
      service.setItem('key-4', 4),
    ]);

    expect(storageEngine.save).toHaveBeenCalledTimes(5);

    // Make sure that StorageService.save() calls are
    // queued when needed and executed in the right order,
    // one after another (FIFO queue).

    // Call: setItem('key-1', 1)
    expect(storageEngine.save).toHaveBeenNthCalledWith(
      1,
      WALLET_CONNECT_STORAGE_KEY,
      { 'key-1': 1 },
    );

    // Call: setItem('key-2', 2)
    expect(storageEngine.save).toHaveBeenNthCalledWith(
      2,
      WALLET_CONNECT_STORAGE_KEY,
      { 'key-1': 1, 'key-2': 2 },
    );

    // Call: setItem('key-3', 3)
    expect(storageEngine.save).toHaveBeenNthCalledWith(
      3,
      WALLET_CONNECT_STORAGE_KEY,
      { 'key-1': 1, 'key-2': 2, 'key-3': 3 },
    );

    // Call: removeItem('key-2')
    expect(storageEngine.save).toHaveBeenNthCalledWith(
      4,
      WALLET_CONNECT_STORAGE_KEY,
      { 'key-1': 1, 'key-3': 3 }, // key-2 was removed
    );

    // Call: setItem('key-4', 4)
    expect(storageEngine.save).toHaveBeenNthCalledWith(
      5,
      WALLET_CONNECT_STORAGE_KEY,
      { 'key-1': 1, 'key-3': 3, 'key-4': 4 },
    );
  });
});
