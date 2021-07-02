import { PersistenceStore } from 'mobx-persist-store/lib/types';
import { persistence, StorageAdapter } from 'mobx-persist-store';
import { enableLogging } from 'mobx-logger';
import store from 'store';

/**
 * Disabling actions simply because storage listener spams actions and makes a mess out of the logs
 *
 * We can disable actions by method @link https://github.com/winterbe/mobx-logger#logger-config
 * this may be a better way to go later
 */
enableLogging({ action: false });

export const persistStore = <T extends Record<string, any>, P extends keyof T>(
  target: T,
  properties: P[],
  persistName: string
): T | PersistenceStore<T> => {
  return persistence({
    name: persistName,
    properties: properties as string[],
    adapter: new StorageAdapter({
      read: async (name) => {
        return store.get(name) ?? undefined;
      },
      write: async (name, content) => {
        store.set(name, content);
      },
    }),
    reactionOptions: {
      delay: 0,
    },
  })(target);
};
