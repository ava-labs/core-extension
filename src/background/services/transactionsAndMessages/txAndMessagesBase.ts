import store from 'store';

type valueId = string | number | void;

export class TransactionsAndMessagesBase<T = any> {
  private storageKey = '';
  protected values: Map<string, T>;

  constructor(key: string) {
    this.storageKey = key;
    this.values = this.readMapFromStorage(key);
  }

  getById(id: valueId) {
    return this.values.get(this.normalizeId(id));
  }

  private saveMapToStorage() {
    store.set(this.storageKey, Array.from(this.values.entries()));
  }

  private readMapFromStorage(key: string): Map<string, T> {
    const mapFromStorage = store.get(key);
    return key && mapFromStorage ? new Map(mapFromStorage) : new Map();
  }

  removeById(id: valueId) {
    this.values.delete(this.normalizeId(id));
    this.saveMapToStorage();
    return this;
  }

  private normalizeId(id: valueId) {
    return `${id}`;
  }

  protected save(value: T & { id: valueId }) {
    this.values.set(this.normalizeId(value.id), value);
    this.saveMapToStorage();
  }

  protected update(value: T & { id: valueId }) {
    this.save(value);
  }
}
