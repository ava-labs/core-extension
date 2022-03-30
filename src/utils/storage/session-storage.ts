import extension from 'extensionizer';

export interface StorageEvent<T = any> {
  namespace: 'sync' | 'local' | 'managed';
  changes: { [key: string]: { newValue: T; oldValue: T } };
}

// chrome.storage.session is super new and not well documented
// remove this union once chorme.storage has implemented it
const storage: typeof chrome.storage & { session: chrome.storage.StorageArea } =
  extension.storage;

export async function saveToSessionStorage<T = any>(key: string, value: T) {
  return new Promise<T>((resolve, reject) => {
    if (!value) {
      reject('trying to store an empty value');
    }
    storage.session.set({ [key]: value }, () => {
      resolve(value);
    });
  });
}

export async function getFromSessionStorage<T = any>(key: string) {
  return new Promise<T | undefined>((resolve) => {
    storage.session.get(key, (result) => resolve(result?.[key] as T));
  });
}

export async function removeFromSessionStorage(key: string) {
  return new Promise<void>((resolve) => {
    storage.session.remove(key, () => resolve(undefined));
  });
}

export async function clearSessionStorage() {
  return storage.session.clear();
}
