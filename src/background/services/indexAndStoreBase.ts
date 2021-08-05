import { formatAndLog } from '@src/background/utils/logging';
import store from 'store';

type valueId = string | number | void;

/**
 * Since both messages and transactions are temporary entities only living during a connection and
 * thier state communicated via local storage we have abstracted the structure and storage away.
 *
 * How this works. Since the background page, app and content script share a chrome extension url, they
 * are all able to share the same instance of localstorage. Thus they can all see what is in localstorage. The
 * limitation there is reads and writes. None of the contexts can know for certain a read or write has been done
 * except to watch writes to localstorage and to check if the data has changed. The alternative here is to create a stream
 * from windows and communicate changes to objects. This seemed like a lot of overhead and potentially more of a security risk
 * since an open connection could potentially be exploited.
 *
 * The architecture then is such that a window is popped up to ask the user if they want to sign a tx or message and that window,
 * since it will have originated from the same extension url, will have access to the same localstroage as well. It reads the
 * respective entity and once the user has made a decision it updates the entity in localstorage. Once updated the web3 provider
 * is listening for that localstorage update and resolves the result out to the dApp.
 *
 * If the window is closed or the user cancels then the web3 provider is sent an error and that is also communicated out to the dApp.
 */
export class IndexAndStoreBase<T = any> {
  private storageKey = '';

  protected get values() {
    /**
     * This is heavy call to do on every usage of transactions and maps, especially where mobx is
     * writing everything to storage. Eventually only these entites will be written to storage and
     * we can figure out a potentially cleaner way to do this, if necessary.
     *
     * Since every transaction and message change needs to be reflected first and foremost in localstorage we
     * read from localstorage and create a new Map every time. This allows use to use localstorage as the source
     * of truth and thus always be accurate.
     *
     *
     * TODO:
     * Removed "abandoned" transactions and messages on startup. This will be
     * any entity which isnt in a finalized state on restart. We may even want to
     * have a timer that runs and periodically checks for entities that have been stagnent
     * for a certain amount of time. We could check if the dApp that created the entity is
     * still connected?
     *
     */
    return this.readMapFromStorage(this.storageKey);
  }

  constructor(key: string) {
    this.storageKey = key;
  }

  getById(id: valueId) {
    return this.values.get(this.normalizeId(id));
  }

  private saveMapToStorage(map: Map<string, T>) {
    store.set(this.storageKey, Array.from(map.entries()));
  }

  private readMapFromStorage(key: string): Map<string, T> {
    const mapFromStorage = store.get(key);
    return key && mapFromStorage ? new Map(mapFromStorage) : new Map();
  }

  removeById(id: valueId) {
    const map = this.values;
    map.delete(this.normalizeId(id));
    this.saveMapToStorage(map);
    return this;
  }

  private normalizeId(id: valueId) {
    return `${id}`;
  }

  protected save(value: T & { id: valueId }) {
    this.saveMapToStorage(this.values.set(this.normalizeId(value.id), value));
    formatAndLog(`${this.storageKey} saved`, value);
  }

  protected update(value: T & { id: valueId }) {
    this.save(value);
    formatAndLog(`${this.storageKey} updated`, value);
  }

  async removeAll() {
    return store.remove(this.storageKey);
  }
}
