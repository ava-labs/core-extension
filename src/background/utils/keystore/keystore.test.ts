import {
  KEYSTORE_V2,
  KEYSTORE_V3,
  KEYSTORE_V4,
  KEYSTORE_V5,
  KEYSTORE_V6,
} from './fixtures';
import { extractKeysFromDecryptedFile, readKeyFile } from './keystore';
import { KeyFileV6 } from './models';

describe('Keystore Import/Export', () => {
  test('can read v2', async () => {
    const data = await readKeyFile(KEYSTORE_V2.file, KEYSTORE_V2.password);
    expect(data.keys).toEqual(KEYSTORE_V2.expectedKeys);
    expect(extractKeysFromDecryptedFile(data)).toEqual(
      KEYSTORE_V2.expectedPhrases
    );
  });

  test('can read v3', async () => {
    const data = await readKeyFile(KEYSTORE_V3.file, KEYSTORE_V3.password);

    expect(data.keys).toEqual(KEYSTORE_V3.expectedKeys);
    expect(extractKeysFromDecryptedFile(data)).toEqual(
      KEYSTORE_V3.expectedPhrases
    );
  });

  test('can read v4', async () => {
    const data = await readKeyFile(KEYSTORE_V4.file, KEYSTORE_V4.password);

    expect(data.keys).toEqual(KEYSTORE_V4.expectedKeys);
    expect(extractKeysFromDecryptedFile(data)).toEqual(
      KEYSTORE_V4.expectedPhrases
    );
  });

  test('can read v5', async () => {
    const data = await readKeyFile(KEYSTORE_V5.file, KEYSTORE_V5.password);

    expect(data.keys).toEqual(KEYSTORE_V5.expectedKeys);
    expect(extractKeysFromDecryptedFile(data)).toEqual(
      KEYSTORE_V5.expectedPhrases
    );
  });

  test('can read v6', async () => {
    const data = await readKeyFile(
      KEYSTORE_V6.file as KeyFileV6,
      KEYSTORE_V6.password
    );

    expect(data.keys).toEqual(KEYSTORE_V5.expectedPhrases);
    expect(extractKeysFromDecryptedFile(data)).toEqual(
      KEYSTORE_V5.expectedPhrases
    );
  });
});
