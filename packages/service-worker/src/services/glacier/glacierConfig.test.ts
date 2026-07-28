import { AppName } from '@avalabs/vm-module-types';
import { runtime } from 'webextension-polyfill';

describe('glacierConfig', () => {
  it('contains the correct headers', async () => {
    const { HEADERS } = await import('./glacierConfig');

    expect(HEADERS).toStrictEqual({
      'x-application-name': AppName.CORE_EXTENSION,
      'x-application-version': runtime.getManifest().version,
    });
  });
});
