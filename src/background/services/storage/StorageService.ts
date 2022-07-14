import { deserialize } from '@src/background/serialization/deserialize';
import { serialize } from '@src/background/serialization/serialize';
import { CallbackManager } from '@src/background/runtime/CallbackManager';
import {
  decrypt,
  encrypt,
} from '@src/background/services/storage/utils/crypto';
import extension from 'extensionizer';
import { singleton } from 'tsyringe';
import nacl from 'tweetnacl';
import { WALLET_STORAGE_ENCRYPTION_KEY } from './models';

@singleton()
export class StorageService {
  private _storageKey?: string;

  constructor(private callbackManager: CallbackManager) {}

  /**
   * Initializes the storage service with a password that can decrypt the storage encryption key
   */
  async activate(password: string) {
    try {
      this._storageKey = await this.load<string>(
        WALLET_STORAGE_ENCRYPTION_KEY,
        password
      );

      this.callbackManager.onStorageReady();
    } catch (err) {
      console.error(err);
      return Promise.reject(new Error('password incorrect'));
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      // double check that the old password is correct
      const key = await this.load<string>(
        WALLET_STORAGE_ENCRYPTION_KEY,
        oldPassword
      );

      await this.save(WALLET_STORAGE_ENCRYPTION_KEY, key, newPassword);
    } catch (err) {
      console.error(err);
      return Promise.reject(new Error('password incorrect'));
    }
  }

  async createStorageKey(password: string) {
    const storageKey = Buffer.from(nacl.box.keyPair().secretKey).toString(
      'hex'
    );

    await this.save(WALLET_STORAGE_ENCRYPTION_KEY, storageKey, password);
    this._storageKey = storageKey;
    this.callbackManager.onStorageReady();
  }

  async save<T>(key: string, data: T, customEncryptionKey?: string) {
    const encryptionKey = customEncryptionKey ?? this._storageKey;
    if (!encryptionKey) {
      throw new Error('No encryption key defined');
    }

    const encryptedData = await encrypt(
      JSON.stringify(serialize(data)),
      encryptionKey,
      !!customEncryptionKey
    );

    const dataToStore = {
      [key]: {
        cypher: Array.from(encryptedData.cypher),
        nonce: Array.from(encryptedData.nonce),
        salt: Array.from(encryptedData.salt),
      },
    };

    await extension.storage.local.set(dataToStore);
  }

  async load<T>(
    key: string,
    customEncryptionKey?: string
  ): Promise<T | undefined> {
    const result = await extension.storage.local.get(key);
    if (!result || !result[key]) {
      return;
    }

    const encryptedData = result[key];
    if (!encryptedData.nonce || !encryptedData.salt || !encryptedData.cypher) {
      return;
    }
    const encryptionKey = customEncryptionKey ?? this._storageKey;
    if (!encryptionKey) {
      throw new Error('encryption key missing');
    }

    const data = await decrypt(
      Uint8Array.from(encryptedData.cypher),
      encryptionKey,
      Uint8Array.from(encryptedData.salt),
      Uint8Array.from(encryptedData.nonce)
    );

    return deserialize(JSON.parse(data)) as T;
  }

  async saveUnencrypted<T>(key: string, data: T) {
    const dataToStore = {
      [key]: { data },
    };
    await extension.storage.local.set(dataToStore);
  }

  async loadUnencrypted<T>(key: string): Promise<T | undefined> {
    const result = await extension.storage.local.get(key);
    return result?.[key]?.data as T;
  }

  async removeFromStorage(key: string) {
    await extension.storage.local.remove(key);
  }

  async saveToSessionStorage<T = any>(key: string, value: T) {
    if (!value) {
      throw new Error('trying to store an empty value');
    }

    await extension.storage.session.set({ [key]: value });
  }

  async loadFromSessionStorage<T = any>(key: string) {
    const result = await extension.storage.session.get(key);
    return result?.[key] as T;
  }

  async removeFromSessionStorage(key: string) {
    await extension.storage.session.remove(key);
  }

  async clearStorage() {
    await extension.storage.local.clear();
    await extension.storage.session.clear();
  }

  async clearSessionStorage() {
    await extension.storage.session.clear();
  }
}
