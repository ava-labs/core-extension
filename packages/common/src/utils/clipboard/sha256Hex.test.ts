import { sha256Hex } from './sha256Hex';

describe('sha256Hex', () => {
  it('returns the hex encoded SHA-256 digest', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('returns a 64 character lowercase hex string', () => {
    expect(sha256Hex('')).toMatch(/^[0-9a-f]{64}$/);
  });
});
