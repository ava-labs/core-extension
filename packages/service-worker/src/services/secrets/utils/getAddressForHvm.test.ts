import { addressBytesFromPubKey, getAddressForHvm } from './getAddressForHvm';

jest.mock('@noble/hashes/sha256', () => ({
  sha256: jest.fn(() => new Uint8Array(1)),
}));
jest.mock('@noble/curves/ed25519', () => ({
  ed25519: { getPublicKey: jest.fn(() => new Uint8Array(1)) },
}));

describe('background/services/secrets/utils/getAddressForHvm.ts', () => {
  it('should get the address bytes from publick key', () => {
    const result = addressBytesFromPubKey(new Uint8Array(1));
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify(new Uint8Array([0x00, ...new Uint8Array(1)])),
    );
  });
  it('should get the address', () => {
    const address = getAddressForHvm('0xASD');
    expect(address).toBe('0x000000');
  });
});
