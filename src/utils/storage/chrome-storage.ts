import { storageKey$ } from '@src/background/services/wallet/storageKey';
import extension from 'extensionizer';
import { firstValueFrom, Subject } from 'rxjs';
import { decrypt, encrypt } from '../crypto';

export interface StorageEvent<T = any> {
  namespace: 'sync' | 'local' | 'managed';
  changes: { [key: string]: { newValue: T; oldValue: T } };
}

export interface EncryptedData {
  cypher: number[];
  nonce: number[];
  salt: number[];
}

interface UnencryptedData<T = any> {
  data: T;
}

const storage: typeof chrome.storage = extension.storage;

const storageEvents = new Subject<StorageEvent>();
export function storageEventListener() {
  return storageEvents.asObservable();
}

export async function saveToStorage<T = any>(
  key: string,
  value: T,
  encryptData = true
): Promise<Record<string, T>> {
  if (!value) {
    throw new Error('trying to store an empty value');
  }

  let dataToStore: Record<string, UnencryptedData<T> | EncryptedData>;

  if (encryptData) {
    const data = JSON.stringify(value);

    const storageKey = await firstValueFrom(storageKey$);
    if (!storageKey) {
      throw new Error('encryption failed, no storageKey found');
    }
    const encryptedData = await encrypt(data, storageKey, false);

    dataToStore = {
      [key]: {
        cypher: Array.from(encryptedData.cypher),
        nonce: Array.from(encryptedData.nonce),
        salt: Array.from(encryptedData.salt),
      },
    };
  } else {
    dataToStore = {
      [key]: { data: value },
    };
  }

  await storage.local.set(dataToStore);
  return { [key]: value };
}

export async function getFromStorage<T = any>(
  key: string
): Promise<T | undefined> {
  const result = await storage.local.get(key);
  if (!result?.[key] || result[key]?.data) {
    return result?.[key]?.data as T;
  }

  const storageKey = await firstValueFrom(storageKey$);

  if (!storageKey) {
    throw new Error('decryption failed, no storageKey found');
    return;
  }

  const data = await decrypt(
    Uint8Array.from(result[key].cypher),
    storageKey,
    Uint8Array.from(result[key].salt),
    Uint8Array.from(result[key].nonce),
    false
  );

  return JSON.parse(data) as T;
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

export async function clearStorage() {
  return storage.local.clear();
}
