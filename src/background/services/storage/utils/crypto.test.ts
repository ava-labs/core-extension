import { decrypt, encrypt } from './crypto';
import nacl from 'tweetnacl';
import { scrypt } from '@noble/hashes/scrypt';

jest.mock('@noble/hashes/scrypt', () => ({
  scrypt: jest.fn(),
}));

jest.mock('tweetnacl', () => ({
  secretbox: jest.fn(),
}));

const secret = 'secret';
const encryptionKey = '12345678901234567890123456789012'; // length 32
const cypher = new Uint8Array(10);
const salt = new Uint8Array(11);
const nonce = new Uint8Array(12);
const cypherResult = new Uint8Array([1, 1, 1, 1, 1]);
const expectedNonceForEncrypt = new Uint8Array([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);
const expectedSaltForEncrypt = new Uint8Array([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);

describe('background/services/storage/utils/crypto.ts', () => {
  const buffer = Buffer;
  const bufferInstance = {
    fill: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (scrypt as jest.Mock).mockReturnValue(new Uint8Array(6));
    (nacl.secretbox as unknown as jest.Mock).mockReturnValue(cypherResult);

    jest.spyOn(Uint8Array.prototype, 'fill');
    // eslint-disable-next-line no-global-assign
    Buffer = {
      from: jest.fn().mockImplementation(() => {
        return bufferInstance;
      }),
    } as any;
  });

  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    Buffer = buffer;
  });

  describe('encrypt', () => {
    it('should call Buffer.fill if key holds buffer value', async () => {
      await encrypt(secret, encryptionKey, false);
      expect(Buffer.from).toHaveBeenCalledTimes(1);
      expect(Buffer.from).toHaveBeenCalledWith(encryptionKey);
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(0);
    });

    it('should call Uint8Array.fill value if key holds Uint8Array value', async () => {
      await encrypt(secret, encryptionKey, true);
      expect(Buffer.from).toHaveBeenCalledTimes(0);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(1);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledWith(0);
      expect(bufferInstance.fill).toHaveBeenCalledTimes(0);
    });

    it('should return expected results using Uint8Array', async () => {
      const result = await encrypt(secret, encryptionKey, true);
      expect(result.cypher).toEqual(cypherResult);
      expect(result.nonce).toEqual(expectedNonceForEncrypt);
      expect(result.salt).toEqual(expectedSaltForEncrypt);
    });

    it('should return expected results using Buffer', async () => {
      const result = await encrypt(secret, encryptionKey, false);
      expect(result.cypher).toEqual(cypherResult);
      expect(result.nonce).toEqual(expectedNonceForEncrypt);
      expect(result.salt).toEqual(expectedSaltForEncrypt);
    });
  });

  describe('decrypt', () => {
    beforeEach(() => {
      nacl.secretbox.open = jest.fn();
    });

    it('should call Buffer.fill if key holds buffer value', async () => {
      (nacl.secretbox.open as jest.Mock).mockReturnValue(new Uint8Array(5));
      await decrypt(cypher, encryptionKey, salt, nonce, false);

      expect(Buffer.from).toHaveBeenCalledTimes(1);
      expect(Buffer.from).toHaveBeenCalledWith(encryptionKey);
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(0);
    });

    it('should call Buffer.fill if key holds buffer value and open attempt fails', async () => {
      (nacl.secretbox.open as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        await decrypt(cypher, encryptionKey, salt, nonce, false);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(Buffer.from).toHaveBeenCalledTimes(1);
        expect(Buffer.from).toHaveBeenCalledWith(encryptionKey);
        expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
        expect(bufferInstance.fill).toHaveBeenCalledWith(0);
        expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(0);
      }
    });

    it('should call Uint8Array.fill value if key holds Uint8Array value', async () => {
      (nacl.secretbox.open as jest.Mock).mockImplementation(() => {
        return cypher;
      });
      await decrypt(cypher, encryptionKey, salt, nonce, true);
      expect(Buffer.from).toHaveBeenCalledTimes(0);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(1);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledWith(0);
      expect(bufferInstance.fill).toHaveBeenCalledTimes(0);
    });

    it('should call Uint8Array.fill value if key holds Uint8Array value and open attempt fails', async () => {
      (nacl.secretbox.open as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });
      try {
        await decrypt(cypher, encryptionKey, salt, nonce, true);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(Buffer.from).toHaveBeenCalledTimes(0);
        expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(1);
        expect(Uint8Array.prototype.fill).toHaveBeenCalledWith(0);
        expect(bufferInstance.fill).toHaveBeenCalledTimes(0);
      }
    });

    it('should return expected results using Uint8Array', async () => {
      const encoder = new TextEncoder();
      const expected = 'Expected';
      const mockValue = encoder.encode(expected);
      (nacl.secretbox.open as jest.Mock).mockReturnValue(mockValue);

      const result = await decrypt(cypher, encryptionKey, salt, nonce, true);
      expect(result).toEqual(expected);
    });

    it('should return expected results using Buffer', async () => {
      const encoder = new TextEncoder();
      const expected = 'Expected';
      const mockValue = encoder.encode(expected);
      (nacl.secretbox.open as jest.Mock).mockReturnValue(mockValue);

      const result = await decrypt(cypher, encryptionKey, salt, nonce, false);
      expect(result).toEqual(expected);
    });
  });
});
