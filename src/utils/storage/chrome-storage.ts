import extension from 'extensionizer';
import { Subject } from 'rxjs';

export interface StorageEvent<T = any> {
  namespace: 'sync' | 'local' | 'managed';
  changes: { [key: string]: { newValue: T; oldValue: T } };
}

const storage: typeof chrome.storage = extension.storage;

const storageEvents = new Subject<StorageEvent>();
export function storageEventListener() {
  return storageEvents.asObservable();
}

export async function saveToStorage<T = any>(value: T) {
  return new Promise<T>((resolve, reject) => {
    if (!value) {
      reject('trying to store an empty value');
    }
    storage.local.set(value, () => {
      resolve(value);
    });
  });
}

export async function getFromStorage<T = any>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  key: string | Object | string[] | null
) {
  return new Promise<T>((resolve) => {
    storage.local.get(key, (result) => resolve(result as T));
  });
}

export async function removeFromStorage(key: string) {
  return new Promise<void>((resolve) => {
    storage.local.remove(key, () => resolve(undefined));
  });
}

/**
 * Have to use "any" because chrome StorageChange event type is not public
 *`
 * Sidenote: storage does a deep diff on object values. If what it is writing to disc is same
 * as what it already there then no event is fired.
 */
storage.onChanged.addListener(function listener(changes: any, namespace) {
  storageEvents.next({
    changes,
    namespace,
  });
});
