import Joi from 'joi';
import { useCallback } from 'react';
import { utils } from '@avalabs/avalanchejs';

import {
  extractKeysFromDecryptedFile,
  readKeyFile,
} from '@core/utils';
import { SeedphraseImportError } from '@core/service-worker';
import { isWrappedError } from '@core/utils';
import {
  AllKeyFileTypes,
  KeystoreFileContentInfo,
} from '@core/utils';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';

import { useImportSeedphrase } from './useImportSeedphrase';
import { usePrivateKeyImport } from './usePrivateKeyImport';
import { useJsonFileReader } from './useJsonFileReader';
import { useAccountsContext } from '@/contexts/AccountsProvider';

export const useKeystoreFileImport = () => {
  const { capture } = useAnalyticsContext();

  const { isReading, read } = useJsonFileReader<AllKeyFileTypes>();
  const { isImporting: isImportingSeedphrase, importSeedphrase } =
    useImportSeedphrase();
  const { isImporting: isImportingPrivateKey, importPrivateKey } =
    usePrivateKeyImport();
  const { selectAccount } = useAccountsContext();

  const extractKeys = useCallback(
    async (file: File, password: string) => {
      const data = await read(file);

      capture('KeystoreFileProvided', { version: data.version });

      const decryptedFile = await readKeyFile(data, password);
      const keys = extractKeysFromDecryptedFile(decryptedFile);

      return keys;
    },
    [capture, read],
  );

  const importKeystoreFile = useCallback(
    async (file: File, password: string) => {
      const keys = await extractKeys(file, password);

      // We need to import all keys one by one.
      for (let i = 0; i < keys.length; i++) {
        const keyData = keys[i];

        if (!keyData) {
          continue;
        }

        const { key, type } = keyData;

        if (type === 'singleton') {
          // Keystore files have the private keys base58check-encoded, but
          // we need them in hex format.
          const privateKey = Buffer.from(
            utils.base58check.decode(key.replace('PrivateKey-', '')),
          ).toString('hex');

          const accountId = await importPrivateKey(privateKey);
          await selectAccount(accountId);
        } else if (type === 'mnemonic') {
          try {
            await importSeedphrase({
              mnemonic: key,
            });
          } catch (err) {
            if (
              isWrappedError(err) &&
              err.data.reason === SeedphraseImportError.ExistingSeedphrase
            ) {
              // If the seedphrase was already imported, just ignore the error.
              continue;
            }

            throw err;
          }
        }
      }
    },
    [extractKeys, importPrivateKey, importSeedphrase, selectAccount],
  );

  const getKeyCounts = useCallback(
    async (file: File, password: string) => {
      const keys = await extractKeys(file, password);

      return keys.reduce<KeystoreFileContentInfo>(
        (counts: KeystoreFileContentInfo, key) => {
          if (key.type === 'mnemonic') {
            counts.seedPhrasesCount += 1;
          } else if (key.type === 'singleton') {
            counts.privateKeysCount += 1;
          }

          return counts;
        },
        {
          seedPhrasesCount: 0,
          privateKeysCount: 0,
        },
      );
    },
    [extractKeys],
  );

  const isValidKeystoreFile = useCallback(
    async (file: File) => {
      try {
        const data = await read(file);
        const result = KEYSTORE_FILE_SCHEMA.validate(data);

        return !result.error;
      } catch {
        return false;
      }
    },
    [read],
  );

  return {
    getKeyCounts,
    importKeystoreFile,
    isImporting: isImportingSeedphrase || isImportingPrivateKey,
    isReading,
    isValidKeystoreFile,
  };
};

const KEYSTORE_FILE_SCHEMA = Joi.object({
  version: Joi.string().required(),
  salt: Joi.string().required(),
  keys: Joi.array().items(
    Joi.object({
      key: Joi.string().required(),
      iv: Joi.string().required(),
    }).unknown(),
  ),
}).unknown();
