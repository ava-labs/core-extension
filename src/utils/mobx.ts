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
    /**
     * TODO:
     * We possibly need to move to using chrome.storage which stores actual data objects in user folder in OS,
     * maybe this can be binary data? You can force a schema on whats written @link https://developer.chrome.com/docs/extensions/mv2/manifest/storage/
     * the storage api is much faster though, per chromes docs. @link https://developer.chrome.com/docs/extensions/reference/storage/
     *
     *
     * Just for reference for later
     *
     * avalanche ext id: ehaegaebomlmdfbbkebjgpdjbfmdgnmo
     * metamask ext id: nkbihfbeogaeaoehlefnkodbefgpgknn
     *
     * file directory on mac for list of extensions by id: ~/Library/Application\ Support/Google/Chrome/Default/Extensions
     * Isnt 100% verified but I am almost certain this is where chrome.storage puts your files, on a mac:
     * ~/Library/Application Support/Google/Chrome/Default/IndexedDB/chrome-extension_{your extension id}_0.indexeddb.leveldb/{number}.ldb
     *
     */
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
