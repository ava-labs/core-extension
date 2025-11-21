import { AppName } from '@avalabs/vm-module-types';
import { runtime } from 'webextension-polyfill';

describe('glacierConfig', () => {
  const realEnv = process.env;

  beforeEach(() => {
    process.env = { ...realEnv };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = realEnv;
  });

  it('contains the correct headers without API key', async () => {
    process.env.GLACIER_API_KEY = undefined;

    const { HEADERS } = await import('./glacierConfig');

    expect(HEADERS).toStrictEqual({
      'x-application-name': AppName.CORE_EXTENSION,
      'x-application-version': runtime.getManifest().version,
    });
  });

  it('contains the correct headers with API key', async () => {
    process.env.GLACIER_API_KEY = 'glacierapikey';

    const { HEADERS } = await import('./glacierConfig');

    expect(HEADERS).toStrictEqual({
      'x-application-name': AppName.CORE_EXTENSION,
      'x-application-version': runtime.getManifest().version,
      'x-api-key': 'glacierapikey',
    });
  });
});
