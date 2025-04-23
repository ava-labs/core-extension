import { getAccountKey } from './getAccountKey';

describe('utils/getAccountKey()', () => {
  const address = 'asdrty123';
  it('should return the address as an account key', () => {
    expect(getAccountKey({ address })).toBe(address);
  });

  it('should return a test suffix', () => {
    expect(getAccountKey({ address, isTestnet: true })).toBe(`${address}-test`);
  });
});
