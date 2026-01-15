import { act, renderHook } from '@testing-library/react';

import { useAnalyticsContext } from '../contexts/AnalyticsProvider';
import { KeystoreFixtures } from '@core/common';

import { useImportSeedphrase } from './useImportSeedphrase';
import { usePrivateKeyImport } from './usePrivateKeyImport';
import { useKeystoreFileImport } from './useKeystoreFileImport';
import { SeedphraseImportError } from '@core/types';
import { utils } from '@avalabs/avalanchejs';
import { useAccountsContext } from '../contexts/AccountsProvider';

jest.mock('../contexts/AnalyticsProvider', () => ({
  useAnalyticsContext: jest.fn(),
}));

jest.mock('../contexts/AccountsProvider', () => ({
  useAccountsContext: jest.fn(),
}));
jest.mock('./useImportSeedphrase');
jest.mock('./usePrivateKeyImport');

const getFile = (data) => {
  const encoder = new TextEncoder();

  return new File([encoder.encode(JSON.stringify(data))], 'test-file.json', {
    type: 'application/json',
  });
};

describe('src/pages/Accounts/hooks/useKeystoreFileImport', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(useAnalyticsContext).mockReturnValue({
      capture: jest.fn(),
    } as any);

    jest.mocked(usePrivateKeyImport).mockReturnValue({
      isImporting: false,
      importPrivateKey: jest.fn(),
    });

    jest.mocked(useImportSeedphrase).mockReturnValue({
      isImporting: false,
      importSeedphrase: jest.fn(),
    });

    jest.mocked(useAccountsContext).mockReturnValue({
      selectAccount: jest.fn(),
    } as any);
  });

  describe('isValidKeystoreFile()', () => {
    it('returns true for valid Keystore files', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport({}));

      const file = getFile(KeystoreFixtures.KEYSTORE_V2.file);

      await act(
        async () =>
          await expect(hook.current.isValidKeystoreFile(file)).resolves.toBe(
            true,
          ),
      );
    });

    it('returns false for JSON files with invalid schema', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport({}));

      const file = getFile({
        dummy: 'json',
        file: true,
      });

      await act(
        async () =>
          await expect(hook.current.isValidKeystoreFile(file)).resolves.toBe(
            false,
          ),
      );
    });

    it('returns false for non-JSON files', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport({}));

      const file = new File(['hm'], 'image.png', { type: 'image/png' });

      await act(
        async () =>
          await expect(hook.current.isValidKeystoreFile(file)).resolves.toBe(
            false,
          ),
      );
    });
  });

  describe('importKeystoreFile()', () => {
    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onStarted = jest.fn();

    it('imports seed phrases from the file', async () => {
      const importSeedphrase = jest.fn();

      jest.mocked(useImportSeedphrase).mockReturnValue({
        isImporting: false,
        importSeedphrase,
      });

      const { result: hook } = renderHook(() =>
        useKeystoreFileImport({
          onStarted,
          onSuccess,
          onFailure,
        }),
      );

      const file = getFile(KeystoreFixtures.KEYSTORE_V2.file);

      await act(
        async () =>
          await hook.current.importKeystoreFile(
            file,
            KeystoreFixtures.KEYSTORE_V2.password,
          ),
      );

      expect(importSeedphrase).toHaveBeenCalledTimes(2);
      expect(importSeedphrase).toHaveBeenNthCalledWith(1, {
        mnemonic: KeystoreFixtures.KEYSTORE_V2.expectedPhrases[0].key,
      });
      expect(importSeedphrase).toHaveBeenNthCalledWith(2, {
        mnemonic: KeystoreFixtures.KEYSTORE_V2.expectedPhrases[1].key,
      });
      expect(onStarted).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('imports private keys from the file', async () => {
      const importPrivateKey = jest.fn();

      jest.mocked(usePrivateKeyImport).mockReturnValue({
        isImporting: false,
        importPrivateKey,
      });

      const { result: hook } = renderHook(() =>
        useKeystoreFileImport({
          onStarted,
          onSuccess,
          onFailure,
        }),
      );

      const file = getFile(KeystoreFixtures.KEYSTORE_V6_PKEY.file);

      await act(
        async () =>
          await hook.current.importKeystoreFile(
            file,
            KeystoreFixtures.KEYSTORE_V6_PKEY.password,
          ),
      );

      const rawKey = KeystoreFixtures.KEYSTORE_V6_PKEY.expectedPhrases[0].key;
      const expectedKey = Buffer.from(
        utils.base58check.decode(rawKey.replace('PrivateKey-', '')),
      ).toString('hex');

      expect(importPrivateKey).toHaveBeenCalledTimes(1);
      expect(importPrivateKey).toHaveBeenNthCalledWith(1, expectedKey);
      expect(onStarted).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('continues upon receiving "ExistingSeedphrase" error', async () => {
      const importSeedphrase = jest
        .fn()
        .mockRejectedValueOnce({
          code: -32000,
          data: { reason: SeedphraseImportError.ExistingSeedphrase },
        })
        .mockResolvedValueOnce({});

      jest.mocked(useImportSeedphrase).mockReturnValue({
        isImporting: false,
        importSeedphrase,
      });

      const { result: hook } = renderHook(() =>
        useKeystoreFileImport({
          onStarted,
          onSuccess,
          onFailure,
        }),
      );

      const file = getFile(KeystoreFixtures.KEYSTORE_V2.file);

      await act(
        async () =>
          await expect(
            hook.current.importKeystoreFile(
              file,
              KeystoreFixtures.KEYSTORE_V2.password,
            ),
          ).resolves.not.toThrow(),
      );

      expect(importSeedphrase).toHaveBeenCalledTimes(2);
      expect(importSeedphrase).toHaveBeenNthCalledWith(1, {
        mnemonic: KeystoreFixtures.KEYSTORE_V2.expectedPhrases[0].key,
      });
      expect(importSeedphrase).toHaveBeenNthCalledWith(2, {
        mnemonic: KeystoreFixtures.KEYSTORE_V2.expectedPhrases[1].key,
      });
      expect(onStarted).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('calls onFailure when the import fails', async () => {
      const importSeedphrase = jest.fn().mockRejectedValueOnce({});

      jest.mocked(useImportSeedphrase).mockReturnValue({
        isImporting: false,
        importSeedphrase,
      });

      const { result: hook } = renderHook(() =>
        useKeystoreFileImport({
          onStarted,
          onSuccess,
          onFailure,
        }),
      );
      const file = getFile(KeystoreFixtures.KEYSTORE_V2.file);

      await act(
        async () =>
          await expect(
            hook.current.importKeystoreFile(
              file,
              KeystoreFixtures.KEYSTORE_V2.password,
            ),
          ).resolves.not.toThrow(),
      );

      expect(onStarted).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalledTimes(1);
    });
  });

  describe('getKeyCounts()', () => {
    it('captures the version number of the keystore file', async () => {
      const captureMock = jest.fn();
      jest.mocked(useAnalyticsContext).mockReturnValue({
        capture: captureMock,
      } as any);

      const { result: hook } = renderHook(() => useKeystoreFileImport({}));

      const fileV2 = getFile(KeystoreFixtures.KEYSTORE_V2.file);

      await act(async () => {
        await hook.current.getKeyCounts(
          fileV2,
          KeystoreFixtures.KEYSTORE_V2.password,
        );
      });

      expect(captureMock).toHaveBeenCalledWith('KeystoreFileProvided', {
        version: '2.0',
      });

      const fileV6 = getFile(KeystoreFixtures.KEYSTORE_V6.file);

      await act(async () => {
        await hook.current.getKeyCounts(
          fileV6,
          KeystoreFixtures.KEYSTORE_V6.password,
        );
      });

      expect(captureMock).toHaveBeenCalledWith('KeystoreFileProvided', {
        version: '6.0',
      });
    });

    it('extracts the number of keys in the file', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport({}));

      await act(
        async () =>
          await expect(
            hook.current.getKeyCounts(
              getFile(KeystoreFixtures.KEYSTORE_V2.file),
              KeystoreFixtures.KEYSTORE_V2.password,
            ),
          ).resolves.toEqual({
            privateKeysCount: 0,
            seedPhrasesCount: 2,
          }),
      );

      await act(
        async () =>
          await expect(
            hook.current.getKeyCounts(
              getFile(KeystoreFixtures.KEYSTORE_V6_PKEY.file),
              KeystoreFixtures.KEYSTORE_V6_PKEY.password,
            ),
          ).resolves.toEqual({
            privateKeysCount: 1,
            seedPhrasesCount: 0,
          }),
      );
    });
  });
});
