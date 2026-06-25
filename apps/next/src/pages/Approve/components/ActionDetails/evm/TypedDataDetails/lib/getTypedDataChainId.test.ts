import { getTypedDataChainId } from './getTypedDataChainId';

const withChainId = (chainId: unknown) => ({
  primaryType: 'Permit',
  domain: { name: 'USD Coin', chainId },
  message: {},
});

describe('getTypedDataChainId', () => {
  it('reads a numeric domain chainId', () => {
    expect(getTypedDataChainId(withChainId(1))).toBe(1);
  });

  it('reads a hex-string domain chainId', () => {
    expect(getTypedDataChainId(withChainId('0x89'))).toBe(137);
  });

  it('reads a decimal-string domain chainId', () => {
    expect(getTypedDataChainId(withChainId('43114'))).toBe(43114);
  });

  it('returns undefined when the domain has no chainId', () => {
    expect(getTypedDataChainId({ domain: { name: 'x' }, message: {} })).toBe(
      undefined,
    );
  });

  it('returns undefined for V1 (array) typed data and non-objects', () => {
    expect(getTypedDataChainId([])).toBeUndefined();
    expect(getTypedDataChainId(undefined)).toBeUndefined();
    expect(getTypedDataChainId('hello')).toBeUndefined();
  });

  it('returns undefined for an unparseable chainId', () => {
    expect(getTypedDataChainId(withChainId('not-a-number'))).toBeUndefined();
    expect(getTypedDataChainId(withChainId(0))).toBeUndefined();
  });
});
