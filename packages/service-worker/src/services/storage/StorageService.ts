import { deserializeFromJSON, serializeToJSON } from '@core/messaging';
import { CallbackManager } from '../../runtime/CallbackManager';
import {
  decryptWithKey,
  decryptWithPassword,
  encryptWithKey,
  encryptWithPassword,
} from './utils/crypto';
import browser from 'webextension-polyfill';
import { singleton } from 'tsyringe';
import {
  EncryptedData,
  KeyDerivationVersion,
  WALLET_STORAGE_ENCRYPTION_KEY,
  WalletStorageEncryptionKeyData,
} from '@core/types';
import {
  getDataWithSchemaVersion,
  migrateToLatest,
} from './schemaMigrations/schemaMigrations';
import { OnLock } from '../../runtime/lifecycleCallbacks';

@singleton()
export class StorageService implements OnLock {
  private _storageKey?: string;

  constructor(private callbackManager: CallbackManager) {}

  /**
   * Initializes the storage service with a password that can decrypt the storage encryption key
   */
  async activate(password: string) {
    try {
      const keyData = await this.load<WalletStorageEncryptionKeyData>(
        WALLET_STORAGE_ENCRYPTION_KEY,
        password,
      );
      this._storageKey = keyData?.storageKey;

      this.callbackManager.onStorageReady();
    } catch (_err) {
      return Promise.reject(new Error('password incorrect'));
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    try {
      // attempt to load the storage encryption key with the provided password
      // will throw an error if the password is incorrect
      await this.load<WalletStorageEncryptionKeyData>(
        WALLET_STORAGE_ENCRYPTION_KEY,
        password,
      );
      return true;
    } catch (_err) {
      return false;
    }
  }

  onLock() {
    // Clear the encryption key when wallet is locked to prevent unauthorized storage access.
    this._storageKey = undefined;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      // double check that the old password is correct
      const key = await this.load<WalletStorageEncryptionKeyData>(
        WALLET_STORAGE_ENCRYPTION_KEY,
        oldPassword,
      );

      if (!key) {
        throw new Error('password incorrect');
      }

      await this.save<WalletStorageEncryptionKeyData>(
        WALLET_STORAGE_ENCRYPTION_KEY,
        key,
        newPassword,
      );
    } catch (_err) {
      return Promise.reject(new Error('password incorrect'));
    }
  }

  async createStorageKey(password: string) {
    const storageKey = Buffer.from(
      // generate cryptographically strong random values
      // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
      crypto.getRandomValues(new Uint8Array(32)),
    ).toString('hex');

    await this.save<WalletStorageEncryptionKeyData>(
      WALLET_STORAGE_ENCRYPTION_KEY,
      {
        storageKey,
      },
      password,
    );
    this._storageKey = storageKey;
    this.callbackManager.onStorageReady();
  }

  async save<T>(key: string, data: T, customEncryptionKey?: string) {
    if (!this._storageKey && !customEncryptionKey) {
      throw new Error('No encryption key defined');
    }

    const dataWithSchemaVersion = getDataWithSchemaVersion<T>(key, data);

    const encryptedData: {
      cypher: Uint8Array;
      nonce: Uint8Array;
      salt?: Uint8Array;
      keyDerivationVersion?: KeyDerivationVersion;
    } = customEncryptionKey
      ? await encryptWithPassword({
          secret: serializeToJSON<T>(dataWithSchemaVersion),
          password: customEncryptionKey,
        })
      : await encryptWithKey({
          secret: serializeToJSON<T>(dataWithSchemaVersion),
          encryptionKey: Uint8Array.from(Buffer.from(this._storageKey ?? '')),
        });

    const dataToStore: Record<string, EncryptedData> = {
      [key]: {
        cypher: Array.from(encryptedData.cypher),
        nonce: Array.from(encryptedData.nonce),
        salt: encryptedData.salt ? Array.from(encryptedData.salt) : undefined,
        keyDerivationVersion: encryptedData.keyDerivationVersion,
      },
    };

    await browser.storage.local.set(dataToStore);
  }

  async load<T>(
    key: string,
    customEncryptionKey?: string,
  ): Promise<T | undefined> {
    const result = await browser.storage.local.get(key);

    if (!result || !result[key]) {
      return;
    }

    const encryptedData: EncryptedData = result[key];
    if (!encryptedData.nonce || !encryptedData.cypher) {
      return;
    }

    if (!customEncryptionKey && !this._storageKey) {
      throw new Error('encryption key missing');
    }

    let data: string;
    if (customEncryptionKey) {
      data = await decryptWithPassword({
        cypher: Uint8Array.from(encryptedData.cypher),
        password: customEncryptionKey,
        salt: Uint8Array.from(encryptedData.salt ?? []),
        nonce: Uint8Array.from(encryptedData.nonce),
        keyDerivationVersion:
          encryptedData.keyDerivationVersion ?? KeyDerivationVersion.V1,
      });
    } else {
      const keyBuffer = Buffer.from(this._storageKey ?? '');

      try {
        data = await decryptWithKey({
          cypher: Uint8Array.from(encryptedData.cypher),
          encryptionKey: Uint8Array.from(keyBuffer),
          nonce: Uint8Array.from(encryptedData.nonce),
          salt: encryptedData.salt && Uint8Array.from(encryptedData.salt),
        });
      } finally {
        keyBuffer.fill(0);
      }
    }

    const deserializedData = deserializeFromJSON<T>(data);

    if (deserializedData) {
      return migrateToLatest(
        key,
        deserializedData,
        (migratedData) => this.save(key, migratedData, customEncryptionKey),
        (dependencyKey: string) =>
          this.load(dependencyKey, customEncryptionKey),
      ) as T;
    }

    return deserializedData;
  }

  async saveUnencrypted<T>(key: string, data: T) {
    const dataToStore = {
      [key]: { data },
    };
    await browser.storage.local.set(dataToStore);
  }

  async loadUnencrypted<T>(key: string): Promise<T | undefined> {
    const result = await browser.storage.local.get(key);
    return result?.[key]?.data as T;
  }

  async removeFromStorage(key: string) {
    await browser.storage.local.remove(key);
  }

  async saveToSessionStorage<T = any>(key: string, value: T) {
    if (!value) {
      throw new Error('trying to store an empty value');
    }

    await browser.storage.session.set({ [key]: value });
  }

  async loadFromSessionStorage<T = any>(key: string) {
    const result = await browser.storage.session.get(key);
    return result?.[key] as T;
  }

  async removeFromSessionStorage(key: string) {
    await browser.storage.session.remove(key);
  }

  async clearStorage() {
    await browser.storage.local.clear();
    await browser.storage.session.clear();
  }

  async clearSessionStorage() {
    await browser.storage.session.clear();
  }
}
