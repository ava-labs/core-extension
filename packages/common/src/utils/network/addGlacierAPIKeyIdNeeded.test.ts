import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

describe('utils/addGlacierAPIKeyIfNeeded', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = {
      ...env,
      GLACIER_API_KEY: 'glacierapikey',
      GLACIER_URL: 'https://glacier-api-dev.avax.network',
      PROXY_URL: 'https://proxy-api-dev.avax.network',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('adds key on the production `glacier-api.avax.network` domain', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething',
      ),
    ).toBe(
      'https://glacier-api.avax.network/somethingsomething?rltoken=glacierapikey',
    );
  });

  it('adds key on the domain from the `GLACIER_URL`` env var', () => {
    expect(
      addGlacierAPIKeyIfNeeded(`${process.env.GLACIER_URL}/somethingsomething`),
    ).toBe(
      `${process.env.GLACIER_URL}/somethingsomething?rltoken=glacierapikey`,
    );
  });

  it('adds key on the production `proxy-api.avax.network` domain', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://proxy-api.avax.network/somethingsomething',
      ),
    ).toBe(
      'https://proxy-api.avax.network/somethingsomething?rltoken=glacierapikey',
    );
  });

  it('adds key on the domain from the `PROXY_URL`` env var', () => {
    expect(
      addGlacierAPIKeyIfNeeded(`${process.env.PROXY_URL}/somethingsomething`),
    ).toBe(`${process.env.PROXY_URL}/somethingsomething?rltoken=glacierapikey`);
  });

  it('supports query params', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething?aa=123',
      ),
    ).toBe(
      'https://glacier-api.avax.network/somethingsomething?aa=123&rltoken=glacierapikey',
    );
  });

  it('does nothing when no glacier key is present', () => {
    delete process.env.GLACIER_API_KEY;

    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething',
      ),
    ).toBe('https://glacier-api.avax.network/somethingsomething');
  });

  it('does nothing when no glacier url is present', () => {
    delete process.env.GLACIER_URL;

    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething',
      ),
    ).toBe('https://glacier-api.avax.network/somethingsomething');
  });

  it('does nothing when no proxy url is present', () => {
    delete process.env.PROXY_URL;

    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething',
      ),
    ).toBe('https://glacier-api.avax.network/somethingsomething');
  });

  it('does nothing for non supported domains', () => {
    expect(
      addGlacierAPIKeyIfNeeded('https://glacier-api.avax-test.network'),
    ).toBe('https://glacier-api.avax-test.network');
  });
});
