import { act, renderHook } from '@testing-library/react-hooks';

import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import {
  KEYSTORE_V2,
  KEYSTORE_V6,
  KEYSTORE_V6_PKEY,
} from '@src/utils/keystore/fixtures';

import { useImportSeedphrase } from './useImportSeedphrase';
import { usePrivateKeyImport } from './usePrivateKeyImport';
import { useKeystoreFileImport } from './useKeystoreFileImport';
import { SeedphraseImportError } from '@src/background/services/wallet/handlers/models';
import { utils } from '@avalabs/avalanchejs';

jest.mock('@src/contexts/AnalyticsProvider');
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
  });

  describe('isValidKeystoreFile()', () => {
    it('returns true for valid Keystore files', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport());

      const file = getFile(KEYSTORE_V2.file);

      await act(
        async () =>
          await expect(hook.current.isValidKeystoreFile(file)).resolves.toBe(
            true,
          ),
      );
    });

    it('returns false for JSON files with invalid schema', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport());

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
      const { result: hook } = renderHook(() => useKeystoreFileImport());

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
    it('imports seed phrases from the file', async () => {
      const importSeedphrase = jest.fn();

      jest.mocked(useImportSeedphrase).mockReturnValue({
        isImporting: false,
        importSeedphrase,
      });

      const { result: hook } = renderHook(() => useKeystoreFileImport());

      const file = getFile(KEYSTORE_V2.file);

      await act(
        async () =>
          await hook.current.importKeystoreFile(file, KEYSTORE_V2.password),
      );

      expect(importSeedphrase).toHaveBeenCalledTimes(2);
      expect(importSeedphrase).toHaveBeenNthCalledWith(1, {
        mnemonic: KEYSTORE_V2.expectedPhrases[0].key,
      });
      expect(importSeedphrase).toHaveBeenNthCalledWith(2, {
        mnemonic: KEYSTORE_V2.expectedPhrases[1].key,
      });
    });

    it('imports private keys from the file', async () => {
      const importPrivateKey = jest.fn();

      jest.mocked(usePrivateKeyImport).mockReturnValue({
        isImporting: false,
        importPrivateKey,
      });

      const { result: hook } = renderHook(() => useKeystoreFileImport());

      const file = getFile(KEYSTORE_V6_PKEY.file);

      await act(
        async () =>
          await hook.current.importKeystoreFile(
            file,
            KEYSTORE_V6_PKEY.password,
          ),
      );

      const rawKey = KEYSTORE_V6_PKEY.expectedPhrases[0].key;
      const expectedKey = Buffer.from(
        utils.base58check.decode(rawKey.replace('PrivateKey-', '')),
      ).toString('hex');

      expect(importPrivateKey).toHaveBeenCalledTimes(1);
      expect(importPrivateKey).toHaveBeenNthCalledWith(1, expectedKey);
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

      const { result: hook } = renderHook(() => useKeystoreFileImport());

      const file = getFile(KEYSTORE_V2.file);

      await act(
        async () =>
          await expect(
            hook.current.importKeystoreFile(file, KEYSTORE_V2.password),
          ).resolves.not.toThrow(),
      );

      expect(importSeedphrase).toHaveBeenCalledTimes(2);
      expect(importSeedphrase).toHaveBeenNthCalledWith(1, {
        mnemonic: KEYSTORE_V2.expectedPhrases[0].key,
      });
      expect(importSeedphrase).toHaveBeenNthCalledWith(2, {
        mnemonic: KEYSTORE_V2.expectedPhrases[1].key,
      });
    });
  });

  describe('getKeyCounts()', () => {
    it('captures the version number of the keystore file', async () => {
      const captureMock = jest.fn();
      jest.mocked(useAnalyticsContext).mockReturnValue({
        capture: captureMock,
      } as any);

      const { result: hook } = renderHook(() => useKeystoreFileImport());

      const fileV2 = getFile(KEYSTORE_V2.file);

      await act(async () => {
        await hook.current.getKeyCounts(fileV2, KEYSTORE_V2.password);
      });

      expect(captureMock).toHaveBeenCalledWith('KeystoreFileProvided', {
        version: '2.0',
      });

      const fileV6 = getFile(KEYSTORE_V6.file);

      await act(async () => {
        await hook.current.getKeyCounts(fileV6, KEYSTORE_V6.password);
      });

      expect(captureMock).toHaveBeenCalledWith('KeystoreFileProvided', {
        version: '6.0',
      });
    });

    it('extracts the number of keys in the file', async () => {
      const { result: hook } = renderHook(() => useKeystoreFileImport());

      await act(
        async () =>
          await expect(
            hook.current.getKeyCounts(
              getFile(KEYSTORE_V2.file),
              KEYSTORE_V2.password,
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
              getFile(KEYSTORE_V6_PKEY.file),
              KEYSTORE_V6_PKEY.password,
            ),
          ).resolves.toEqual({
            privateKeysCount: 1,
            seedPhrasesCount: 0,
          }),
      );
    });
  });
});
