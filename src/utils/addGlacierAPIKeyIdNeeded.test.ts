import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

describe('utils/addGlacierAPIKeyIfNeeded', () => {
  const env = process.env;
  beforeEach(() => {
    process.env = {
      ...env,
      GLACIER_API_KEY: 'glacierapikey',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('adds key on `glacier-api.avax-test.network` domain', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax-test.network/somethingsomething'
      )
    ).toBe(
      'https://glacier-api.avax-test.network/somethingsomething?token=glacierapikey'
    );
  });

  it('adds key on `glacier-api.avax.network` domain', () => {
    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething'
      )
    ).toBe(
      'https://glacier-api.avax.network/somethingsomething?token=glacierapikey'
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
    process.env = { ...env };

    expect(
      addGlacierAPIKeyIfNeeded(
        'https://glacier-api.avax.network/somethingsomething'
      )
    ).toBe('https://glacier-api.avax.network/somethingsomething');
  });

  it('does nothing for non glacier domains', () => {
    expect(addGlacierAPIKeyIfNeeded('https://somerandomdomain.example')).toBe(
      'https://somerandomdomain.example'
    );
  });
});
