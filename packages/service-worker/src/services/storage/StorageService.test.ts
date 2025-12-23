import { CallbackManager } from '~/runtime/CallbackManager';
import { StorageService } from './StorageService';
import browser from 'webextension-polyfill';
import {
  decryptWithKey,
  decryptWithPassword,
  encryptWithKey,
  encryptWithPassword,
} from './utils/crypto';
import {
  KeyDerivationVersion,
  WALLET_STORAGE_ENCRYPTION_KEY,
} from '@core/types';
import * as schemaMigrations from './schemaMigrations/schemaMigrations';

jest.mock('~/runtime/CallbackManager');
jest.mock('webextension-polyfill', () => ({
  storage: {
    local: {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    },

    session: {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    },
  },
  runtime: {
    id: 'runtime-id',
  },
}));
jest.mock('./utils/crypto');
jest.mock('@core/common', () => ({
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      SEEDLESS: 'seedless',
    },
  },
}));

describe('src/background/services/storage/StorageService.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('activate', () => {
    it('notifies callback manager when storage is ready', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const callbackManager = new CallbackManager();
      const service = new StorageService(callbackManager);
      await service.activate('some-password');

      expect(callbackManager.onStorageReady).toHaveBeenCalledTimes(1);
    });

    it('throws an error when password is incorrect', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockRejectedValue(new Error('failed to decrypt'));
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const callbackManager = new CallbackManager();
      const service = new StorageService(callbackManager);
      await expect(service.activate('wrong-password')).rejects.toThrow(
        new Error('password incorrect'),
      );

      expect(callbackManager.onStorageReady).not.toHaveBeenCalled();
    });
  });

  describe('verifyPassword', () => {
    it('returns true when password is correct', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const service = new StorageService(new CallbackManager());

      const result = await service.verifyPassword('correct-password');

      expect(result).toBe(true);
      expect(decryptWithPassword).toHaveBeenCalledTimes(1);
      expect(jest.mocked(decryptWithPassword).mock.calls[0]).toEqual([
        {
          cypher: new Uint8Array([1, 1, 1]),
          password: 'correct-password',
          salt: new Uint8Array([3, 3, 3]),
          nonce: new Uint8Array([2, 2]),
          keyDerivationVersion: KeyDerivationVersion.V1,
        },
      ]);
    });

    it('returns false when password is incorrect', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockRejectedValue(new Error('failed to decrypt'));
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const service = new StorageService(new CallbackManager());

      const result = await service.verifyPassword('wrong-password');

      expect(result).toBe(false);
      expect(decryptWithPassword).toHaveBeenCalledTimes(1);
    });

    it('does not modify internal state when verifying password', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const callbackManager = new CallbackManager();
      const service = new StorageService(callbackManager);

      await service.verifyPassword('correct-password');

      // verify that callback was not triggered (unlike activate)
      expect(callbackManager.onStorageReady).not.toHaveBeenCalled();

      // verify that storage key was not set (service should still throw when trying to save)
      await expect(service.save('STORAGE_KEY', { data: 1 })).rejects.toThrow(
        new Error('No encryption key defined'),
      );
    });
  });

  describe('onLock', () => {
    it('clears storage key on lock', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const service = new StorageService(new CallbackManager());
      await service.activate('some-password');

      service.onLock();
      // should throw an error when trying to save after lock since key is cleared

      await expect(service.save('STORAGE_KEY', { data: 1 })).rejects.toThrow(
        new Error('No encryption key defined'),
      );
    });
  });
  describe('changePassword', () => {
    it('throws error if password is incorrect', async () => {
      jest.mocked(encryptWithPassword).mockResolvedValue({
        cypher: new Uint8Array([1, 1, 1]),
        nonce: new Uint8Array([2, 2]),
        salt: new Uint8Array([3, 3, 3]),
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
      jest
        .mocked(decryptWithPassword)
        .mockRejectedValue(new Error('some-decryption-error'));
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const service = new StorageService(new CallbackManager());

      await expect(
        service.changePassword('old-password', 'new-password'),
      ).rejects.toThrow(new Error('password incorrect'));

      expect(decryptWithPassword).toHaveBeenCalledTimes(1);
      expect(jest.mocked(decryptWithPassword).mock.calls[0]).toEqual([
        {
          cypher: new Uint8Array([1, 1, 1]),
          password: 'old-password',
          salt: new Uint8Array([3, 3, 3]),
          nonce: new Uint8Array([2, 2]),
          keyDerivationVersion: KeyDerivationVersion.V1,
        },
      ]);

      expect(encryptWithPassword).not.toHaveBeenCalled();
      expect(browser.storage.local.set).not.toHaveBeenCalled();
    });

    it('re-saves encryption key with new password', async () => {
      jest.mocked(encryptWithPassword).mockResolvedValue({
        cypher: new Uint8Array([1, 1, 1]),
        nonce: new Uint8Array([2, 2]),
        salt: new Uint8Array([3, 3, 3]),
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
          keyDerivationVersion: KeyDerivationVersion.V2,
        },
      });
      const service = new StorageService(new CallbackManager());

      await service.changePassword('old-password', 'new-password');

      expect(decryptWithPassword).toHaveBeenCalledTimes(1);
      expect(jest.mocked(decryptWithPassword).mock.calls[0]).toEqual([
        {
          cypher: new Uint8Array([1, 1, 1]),
          password: 'old-password',
          salt: new Uint8Array([3, 3, 3]),
          nonce: new Uint8Array([2, 2]),
          keyDerivationVersion: KeyDerivationVersion.V2,
        },
      ]);

      expect(encryptWithPassword).toHaveBeenCalledTimes(1);
      expect(jest.mocked(encryptWithPassword).mock.calls[0]).toEqual([
        {
          secret: '{"storageKey":"encryption-key","version":2}',
          password: 'new-password',
        },
      ]);

      expect(browser.storage.local.set).toHaveBeenCalledTimes(1);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        WALLET_STORAGE_ENCRYPTION_KEY: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
          keyDerivationVersion: KeyDerivationVersion.V2,
        },
      });
    });
  });

  describe('createStorageKey', () => {
    it('generates storage key and saves with the password encrypted', async () => {
      jest.mocked(encryptWithPassword).mockResolvedValue({
        cypher: new Uint8Array([1, 1, 1]),
        nonce: new Uint8Array([2, 2]),
        salt: new Uint8Array([3, 3, 3]),
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
      jest.mocked(encryptWithKey).mockResolvedValue({
        cypher: new Uint8Array([1, 1, 1]),
        nonce: new Uint8Array([2, 2]),
      });

      const callbackManager = new CallbackManager();
      const service = new StorageService(callbackManager);

      await service.createStorageKey('password');

      expect(encryptWithPassword).toHaveBeenCalledTimes(1);
      expect(encryptWithPassword).toHaveBeenCalledWith({
        secret:
          '{"storageKey":"0101010101010101010101010101010101010101010101010101010101010101","version":2}',
        password: 'password',
      });
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        WALLET_STORAGE_ENCRYPTION_KEY: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
          keyDerivationVersion: KeyDerivationVersion.V2,
        },
      });
      expect(callbackManager.onStorageReady).toHaveBeenCalled();

      await service.save('some-key', 'some-data');
      expect(encryptWithKey).toHaveBeenCalledTimes(1);
      expect(encryptWithKey).toHaveBeenCalledWith({
        secret: '"some-data"',
        encryptionKey: Uint8Array.from(
          Buffer.from(
            '0101010101010101010101010101010101010101010101010101010101010101',
          ),
        ),
      });
    });
  });

  describe('save', () => {
    it('throws error if the service is not activated and encryption key is not provided', async () => {
      const service = new StorageService(new CallbackManager());

      await expect(service.save('STORAGE_KEY', { data: 1 })).rejects.toThrow(
        new Error('No encryption key defined'),
      );
    });

    it('adds schema version to data and encrypts with custom key', async () => {
      jest.mocked(encryptWithPassword).mockResolvedValue({
        cypher: new Uint8Array([1, 1, 1]),
        nonce: new Uint8Array([2, 2]),
        salt: new Uint8Array([3, 3, 3]),
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
      const service = new StorageService(new CallbackManager());

      await service.save('STORAGE_KEY', { data: 1 }, 'custom-password');
      expect(encryptWithKey).not.toHaveBeenCalled();
      expect(encryptWithPassword).toHaveBeenCalledTimes(1);
      expect(encryptWithPassword).toHaveBeenCalledWith({
        secret: '{"data":1}',
        password: 'custom-password',
      });

      expect(browser.storage.local.set).toHaveBeenCalledTimes(1);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        STORAGE_KEY: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
          keyDerivationVersion: KeyDerivationVersion.V2,
        },
      });
    });

    it('uses storage encryption key if no custom is provided', async () => {
      jest.mocked(encryptWithKey).mockResolvedValue({
        cypher: new Uint8Array([1, 1, 1]),
        nonce: new Uint8Array([2, 2]),
      });
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      const service = new StorageService(new CallbackManager());
      await service.activate('some-password');

      expect(jest.mocked(decryptWithPassword).mock.calls[0]).toEqual([
        {
          cypher: new Uint8Array([1, 1, 1]),
          password: 'some-password',
          salt: new Uint8Array([3, 3, 3]),
          nonce: new Uint8Array([2, 2]),
          keyDerivationVersion: KeyDerivationVersion.V1,
        },
      ]);

      await service.save('STORAGE_KEY', { data: 1 });

      expect(encryptWithKey).toHaveBeenCalledTimes(1);
      expect(encryptWithKey).toHaveBeenCalledWith({
        secret: '{"data":1}',
        encryptionKey: Uint8Array.from(Buffer.from('encryption-key')),
      });
      expect(encryptWithPassword).not.toHaveBeenCalledTimes(1);

      expect(browser.storage.local.set).toHaveBeenCalledTimes(1);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        STORAGE_KEY: { cypher: [1, 1, 1], nonce: [2, 2], salt: undefined },
      });
    });
  });

  describe('load', () => {
    it('returns undefined if key does not exist', async () => {
      const service = new StorageService(new CallbackManager());
      await expect(service.load('some-key')).resolves.toEqual(undefined);
    });

    it('returns undefined if nonce or cypher is missing', async () => {
      jest
        .mocked(browser.storage.local.get)
        .mockResolvedValueOnce({
          ['some-key']: {
            cypher: null,
            nonce: [2, 2],
          },
        })
        .mockResolvedValueOnce({
          ['some-key']: {
            cypher: [1, 1, 1],
            nonce: undefined,
          },
        });
      const service = new StorageService(new CallbackManager());
      await expect(service.load('some-key')).resolves.toEqual(undefined);
      await expect(service.load('some-key')).resolves.toEqual(undefined);
    });

    it('throws error if encryption keys are missing', async () => {
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        ['some-key']: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });

      const service = new StorageService(new CallbackManager());
      await expect(service.load('some-key')).rejects.toThrow(
        new Error('encryption key missing'),
      );
    });

    it('decrypts data with password and migrates schema before returning', async () => {
      const migrationSpy = jest.spyOn(schemaMigrations, 'migrateToLatest');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        ['some-key']: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
      });
      jest.mocked(decryptWithPassword).mockResolvedValue('"some-data"');

      const service = new StorageService(new CallbackManager());
      await expect(service.load('some-key', 'some-password')).resolves.toEqual(
        'some-data',
      );

      expect(decryptWithPassword).toHaveBeenCalledTimes(1);
      expect(jest.mocked(decryptWithPassword).mock.calls[0]).toEqual([
        {
          cypher: new Uint8Array([1, 1, 1]),
          password: 'some-password',
          salt: new Uint8Array([3, 3, 3]),
          nonce: new Uint8Array([2, 2]),
          keyDerivationVersion: KeyDerivationVersion.V1,
        },
      ]);

      expect(migrationSpy).toHaveBeenCalledTimes(1);
      expect(migrationSpy).toHaveBeenCalledWith(
        'some-key',
        'some-data',
        expect.anything(),
        expect.any(Function),
      );

      const dependencyLoader = migrationSpy.mock.calls[0]?.[3];

      const loadSpy = jest.spyOn(service, 'load');
      dependencyLoader?.('some-dependency');
      expect(loadSpy).toHaveBeenCalledWith('some-dependency', 'some-password');
    });

    it('decrypts data with encryption key', async () => {
      jest
        .mocked(decryptWithPassword)
        .mockResolvedValue('{ "storageKey": "encryption-key", "version": 2 }');
      jest.mocked(decryptWithKey).mockResolvedValue('"some-data"');
      jest.mocked(browser.storage.local.get).mockResolvedValue({
        [WALLET_STORAGE_ENCRYPTION_KEY]: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
          salt: [3, 3, 3],
        },
        ['some-key']: {
          cypher: [1, 1, 1],
          nonce: [2, 2],
        },
      });

      const fillSpy = jest.fn();
      jest
        .spyOn(Buffer, 'from')
        .mockImplementation((value) => ({ value, fill: fillSpy }) as any);

      const service = new StorageService(new CallbackManager());
      await service.activate('some-password');

      await expect(service.load('some-key')).resolves.toEqual('some-data');

      expect(decryptWithKey).toHaveBeenCalledTimes(1);
      expect(jest.mocked(decryptWithKey).mock.calls[0]).toEqual([
        {
          cypher: new Uint8Array([1, 1, 1]),
          encryptionKey: Uint8Array.from(Buffer.from('encryption-key')),
          nonce: new Uint8Array([2, 2]),
        },
      ]);

      expect(fillSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveUnencrypted', () => {
    it('saves data unencrypted to local storage', async () => {
      const service = new StorageService(new CallbackManager());
      await service.saveUnencrypted('some-key', 'some-data');

      expect(browser.storage.local.set).toHaveBeenCalledTimes(1);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        'some-key': { data: 'some-data' },
      });
    });
  });

  describe('loadUnencrypted', () => {
    it('loads raw data from local storage', async () => {
      jest
        .mocked(browser.storage.local.get)
        .mockResolvedValue({ ['some-key']: { data: 'some-data' } });
      const service = new StorageService(new CallbackManager());
      const result = await service.loadUnencrypted('some-key');

      expect(result).toEqual('some-data');

      expect(browser.storage.local.get).toHaveBeenCalledTimes(1);
      expect(browser.storage.local.get).toHaveBeenCalledWith('some-key');
    });

    it('returns undefined if key doesnt exist', async () => {
      jest.mocked(browser.storage.local.get).mockResolvedValue({});
      const service = new StorageService(new CallbackManager());
      const result = await service.loadUnencrypted('some-key');

      expect(result).toEqual(undefined);

      expect(browser.storage.local.get).toHaveBeenCalledTimes(1);
      expect(browser.storage.local.get).toHaveBeenCalledWith('some-key');
    });
  });

  describe('saveToSessionStorage', () => {
    it('saves data to session storage', async () => {
      const service = new StorageService(new CallbackManager());
      await service.saveToSessionStorage('some-key', 'some-data');

      expect(browser.storage.session.set).toHaveBeenCalledTimes(1);
      expect(browser.storage.session.set).toHaveBeenCalledWith({
        'some-key': 'some-data',
      });
    });

    it('throws error when value is not defined', async () => {
      const service = new StorageService(new CallbackManager());
      await expect(
        service.saveToSessionStorage('some-key', null),
      ).rejects.toThrow(new Error('trying to store an empty value'));

      expect(browser.storage.session.set).not.toHaveBeenCalled();
    });
  });

  describe('loadFromSessionStorage', () => {
    it('loads data from session storage', async () => {
      jest
        .mocked(browser.storage.session.get)
        .mockResolvedValue({ ['some-key']: 'some-data' });
      const service = new StorageService(new CallbackManager());
      const result = await service.loadFromSessionStorage('some-key');

      expect(result).toEqual('some-data');

      expect(browser.storage.session.get).toHaveBeenCalledTimes(1);
      expect(browser.storage.session.get).toHaveBeenCalledWith('some-key');
    });

    it('returns undefined if key doesnt exist', async () => {
      jest.mocked(browser.storage.session.get).mockResolvedValue({});
      const service = new StorageService(new CallbackManager());
      const result = await service.loadFromSessionStorage('some-key');

      expect(result).toEqual(undefined);

      expect(browser.storage.session.get).toHaveBeenCalledTimes(1);
      expect(browser.storage.session.get).toHaveBeenCalledWith('some-key');
    });
  });

  describe('removeFromSessionStorage', () => {
    it('removes key from session storage', async () => {
      const service = new StorageService(new CallbackManager());
      await service.removeFromSessionStorage('some-key');

      expect(browser.storage.session.remove).toHaveBeenCalledTimes(1);
      expect(browser.storage.session.remove).toHaveBeenCalledWith('some-key');
    });
  });

  describe('clearStorage', () => {
    it('clears all storages', async () => {
      const service = new StorageService(new CallbackManager());
      await service.clearStorage();

      expect(browser.storage.local.clear).toHaveBeenCalledTimes(1);
      expect(browser.storage.session.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearSessionStorage', () => {
    it('clears session storage only', async () => {
      const service = new StorageService(new CallbackManager());
      await service.clearSessionStorage();

      expect(browser.storage.local.clear).not.toHaveBeenCalled();
      expect(browser.storage.session.clear).toHaveBeenCalledTimes(1);
    });
  });
});
