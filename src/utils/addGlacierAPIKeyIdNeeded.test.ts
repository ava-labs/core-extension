import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

describe('utils/addGlacierAPIKeyIfNeeded', () => {
  const env = process.env;
  beforeEach(() => {
    process.env = {
      ...env,
      GLACIER_API_KEY: 'glacierapikey',
      GLACIER_URL: 'https://glacier-api-dev.avax.network',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('adds key on the production `glacier-api.avax.network` domain', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething'
      )
    ).toBe(
      'https://glacier-api.avax.network/somethingsomething?token=glacierapikey'
    );
  });

  it('adds key on the domain from the env var', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        `https://glacier-api-dev.avax.network/somethingsomething`
      )
    ).toBe(
      'https://glacier-api-dev.avax.network/somethingsomething?token=glacierapikey'
    );
  });

  it('supports query params', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething?aa=123'
      )
    ).toBe(
      'https://glacier-api.avax.network/somethingsomething?aa=123&token=glacierapikey'
    );
  });

  it('does nothing when no glacier key is present', () => {
    process.env = { ...env, GLACIER_URL: 'https://glacier-api.avax.network' };

    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething'
      )
    ).toBe('https://glacier-api.avax.network/somethingsomething');
  });

  it('does nothing when no glacier url is present', () => {
    process.env = { ...env, GLACIER_API_KEY: 'glacierapikey' };

    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething'
      )
    ).toBe('https://glacier-api.avax.network/somethingsomething');
  });

  it('does nothing for non glacier domains', () => {
    expect(
      addGlacierAPIKeyIfNeeded('https://glacier-api.avax-test.network')
    ).toBe('https://glacier-api.avax-test.network');
  });
});
