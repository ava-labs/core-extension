import { formatAndLog } from '@src/background/utils/logging';
import store from 'store';

type valueId = string | number | void;

export class TransactionsAndMessagesBase<T = any> {
  private storageKey = '';

  protected get values() {
    /**
     * TODO:
     * Removed "abandoned" transactions and messages on startup. This will be
     * any entity which isnt in a finalized state on restart. We may even want to
     * have a timer that runs and periodically checks for entities that have been stagnent
     * for a certain amount of time. We could check if the dApp that created the entity is
     * still connected?
     *
     * This is heavy call to do on every usage of transactions and maps, especially where mobx is
     * writing everything to storage. Eventually only these entites will be written to storage and
     * we can figure out a potentially cleaner way to do this, if necessary.
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
    formatAndLog('message saved', value);
  }

  protected update(value: T & { id: valueId }) {
    this.save(value);
    formatAndLog('message updated', value);
  }
}
