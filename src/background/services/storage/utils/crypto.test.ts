import {
  decryptWithKey,
  decryptWithPassword,
  encryptWithKey,
  encryptWithPassword,
} from './crypto';
import nacl from 'tweetnacl';
import { scrypt } from '@noble/hashes/scrypt';
import { sha256 } from '@noble/hashes/sha256';
import { KeyDerivationVersion } from '../models';
import argon2Browser from 'argon2-browser';

jest.mock('@noble/hashes/scrypt', () => ({
  scrypt: jest.fn(),
}));

jest.mock('argon2-browser');

jest.mock('@noble/hashes/sha256', () => ({
  sha256: jest.fn(),
}));

jest.mock('tweetnacl', () => ({
  secretbox: jest.fn(),
}));

const secret = 'secret';
const encryptionPassword = 'somepassword';
const encryptionKey = new Uint8Array([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
]);
const mockSha256Hash = new Uint8Array([
  1, 2, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
]);

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
    jest.mocked(scrypt).mockReturnValue(encryptionKey);
    jest
      .mocked(argon2Browser.hash)
      .mockResolvedValue({ hash: encryptionKey, encoded: '', hashHex: '0x' });
    jest.mocked(nacl.secretbox).mockReturnValue(cypherResult);

    jest.mocked(sha256).mockReturnValue(mockSha256Hash);

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

  describe('encryptWithPassword', () => {
    it('should call Uint8Array.fill value if key holds Uint8Array value', async () => {
      await encryptWithPassword({ secret, password: encryptionPassword });
      expect(Buffer.from).toHaveBeenCalledTimes(0);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledTimes(1);
      expect(Uint8Array.prototype.fill).toHaveBeenCalledWith(0);
      expect(bufferInstance.fill).toHaveBeenCalledTimes(0);
    });

    it('should return expected results using Uint8Array', async () => {
      const result = await encryptWithPassword({
        secret,
        password: encryptionPassword,
      });
      expect(result.cypher).toEqual(cypherResult);
      expect(result.nonce).toEqual(expectedNonceForEncrypt);
      expect(result.salt).toEqual(expectedSaltForEncrypt);
      expect(result.keyDerivationVersion).toEqual(KeyDerivationVersion.V2);
    });

    it('uses V2 encryption method', async () => {
      await encryptWithPassword({
        secret,
        password: encryptionPassword,
      });

      expect(argon2Browser.hash).toHaveBeenCalledTimes(1);
      expect(argon2Browser.hash).toHaveBeenCalledWith(
        expect.objectContaining({
          hashLen: 32,
          mem: 65536,
          parallelism: 1,
          pass: encryptionPassword,
          time: 3,
          type: argon2Browser.ArgonType.Argon2id,
        })
      );
    });
  });

  describe('encryptWithKey', () => {
    it('throws error when encryption key is wrong length', async () => {
      try {
        await encryptWithKey({
          secret,
          encryptionKey: new Uint8Array([1, 1, 1]),
        });
      } catch (e) {
        expect(e).toStrictEqual(new Error('invalid encryption key'));
      }
    });

    it('should return expected results using Buffer', async () => {
      const result = await encryptWithKey({ secret, encryptionKey });
      expect(sha256).not.toHaveBeenCalled();
      expect(result.cypher).toEqual(cypherResult);
      expect(result.nonce).toEqual(expectedNonceForEncrypt);
    });

    it('only accepts 32 and 64 byte long keys', async () => {
      await expect(
        encryptWithKey({ secret, encryptionKey: new Uint8Array(4) })
      ).rejects.toThrow(new Error('invalid encryption key'));
      await expect(
        encryptWithKey({ secret, encryptionKey: new Uint8Array(33) })
      ).rejects.toThrow(new Error('invalid encryption key'));
      await expect(
        encryptWithKey({
          secret,
          encryptionKey: crypto.getRandomValues(new Uint8Array(65)),
        })
      ).rejects.toThrow(new Error('invalid encryption key'));
    });

    it('hashes 64 byte long keys down to 32', async () => {
      const result = await encryptWithKey({
        secret,
        encryptionKey: new Uint8Array(64),
      });

      expect(sha256).toHaveBeenCalledTimes(1);
      expect(sha256).toHaveBeenCalledWith(new Uint8Array(64));
      expect(jest.mocked(nacl.secretbox).mock.calls[0]).toStrictEqual([
        new TextEncoder().encode(secret),
        crypto.getRandomValues(new Uint8Array(24)),
        mockSha256Hash,
      ]);

      expect(result.cypher).toEqual(cypherResult);
      expect(result.nonce).toEqual(expectedNonceForEncrypt);
    });
  });

  describe('decryptWithKey', () => {
    beforeEach(() => {
      nacl.secretbox.open = jest.fn();
    });

    it('should throw if key is the wrong length', async () => {
      try {
        await decryptWithKey({ cypher, encryptionKey, nonce });
      } catch (e) {
        expect(e).toStrictEqual(new Error('invalid encryption key'));
      }
    });

    it('should throw if decryption fails', async () => {
      (nacl.secretbox.open as jest.Mock).mockReturnValue(null);
      try {
        await decryptWithKey({ cypher, encryptionKey, nonce });
      } catch (e) {
        expect(e).toStrictEqual(new Error('decryption failed'));
      }
    });

    it('should return expected results using Buffer', async () => {
      const encoder = new TextEncoder();
      const expected = 'Expected';
      const mockValue = encoder.encode(expected);
      (nacl.secretbox.open as jest.Mock).mockReturnValue(mockValue);

      const result = await decryptWithKey({ cypher, encryptionKey, nonce });
      expect(result).toEqual(expected);
      expect(sha256).not.toHaveBeenCalled();
    });

    it('only accepts 32 and 64 byte long keys', async () => {
      await expect(
        decryptWithKey({ cypher, encryptionKey: new Uint8Array(4), nonce })
      ).rejects.toThrow(new Error('invalid decryption key'));
      await expect(
        decryptWithKey({ cypher, encryptionKey: new Uint8Array(33), nonce })
      ).rejects.toThrow(new Error('invalid decryption key'));
      await expect(
        decryptWithKey({
          cypher,
          encryptionKey: crypto.getRandomValues(new Uint8Array(65)),
          nonce,
        })
      ).rejects.toThrow(new Error('invalid decryption key'));
    });

    it('hashes 64 byte long keys down to 32', async () => {
      const expected = 'Expected';
      const mockValue = new TextEncoder().encode(expected);
      (nacl.secretbox.open as jest.Mock).mockReturnValue(mockValue);
      const result = await decryptWithKey({
        cypher,
        encryptionKey: new Uint8Array(64),
        nonce,
      });

      expect(sha256).toHaveBeenCalledTimes(1);
      expect(sha256).toHaveBeenCalledWith(new Uint8Array(64));
      expect(jest.mocked(nacl.secretbox.open).mock.calls[0]).toStrictEqual([
        cypher,
        nonce,
        mockSha256Hash,
      ]);

      expect(result).toEqual(expected);
    });
  });

  describe('decryptWithPassword', () => {
    beforeEach(() => {
      nacl.secretbox.open = jest.fn();
    });

    it('should return expected results using Buffer', async () => {
      const encoder = new TextEncoder();
      const expected = 'Expected';
      const mockValue = encoder.encode(expected);
      (nacl.secretbox.open as jest.Mock).mockReturnValue(mockValue);

      const result = await decryptWithKey({ cypher, encryptionKey, nonce });
      expect(result).toEqual(expected);
      expect(sha256).not.toHaveBeenCalled();
    });

    it('only accepts 32 and 64 byte long keys', async () => {
      await expect(
        decryptWithKey({ cypher, encryptionKey: new Uint8Array(4), nonce })
      ).rejects.toThrow(new Error('invalid decryption key'));
      await expect(
        decryptWithKey({ cypher, encryptionKey: new Uint8Array(33), nonce })
      ).rejects.toThrow(new Error('invalid decryption key'));
      await expect(
        decryptWithKey({
          cypher,
          encryptionKey: crypto.getRandomValues(new Uint8Array(65)),
          nonce,
        })
      ).rejects.toThrow(new Error('invalid decryption key'));
    });

    it('hashes 64 byte long keys down to 32', async () => {
      const expected = 'Expected';
      const mockValue = new TextEncoder().encode(expected);
      (nacl.secretbox.open as jest.Mock).mockReturnValue(mockValue);
      const result = await decryptWithKey({
        cypher,
        encryptionKey: new Uint8Array(64),
        nonce,
      });

      expect(sha256).toHaveBeenCalledTimes(1);
      expect(sha256).toHaveBeenCalledWith(new Uint8Array(64));
      expect(jest.mocked(nacl.secretbox.open).mock.calls[0]).toStrictEqual([
        cypher,
        nonce,
        mockSha256Hash,
      ]);

      expect(result).toEqual(expected);
    });
  });

  describe('decryptWithPassword', () => {
    beforeEach(() => {
      nacl.secretbox.open = jest.fn();
    });

    it('should call Uint8Array.fill value if key holds Uint8Array value', async () => {
      (nacl.secretbox.open as jest.Mock).mockImplementation(() => {
        return cypher;
      });
      await decryptWithPassword({
        cypher,
        password: encryptionPassword,
        salt,
        nonce,
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
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
        await decryptWithPassword({
          cypher,
          password: encryptionPassword,
          salt,
          nonce,
          keyDerivationVersion: KeyDerivationVersion.V2,
        });
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

      const result = await decryptWithPassword({
        cypher,
        password: encryptionPassword,
        salt,
        nonce,
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
      expect(result).toEqual(expected);
    });

    it('uses V1 key derviation method', async () => {
      await decryptWithPassword({
        cypher,
        password: encryptionPassword,
        salt,
        nonce,
        keyDerivationVersion: KeyDerivationVersion.V1,
      });
      expect(argon2Browser.hash).not.toHaveBeenCalled();
      expect(scrypt).toHaveBeenCalledTimes(1);
    });

    it('uses V2 key derviation method', async () => {
      await decryptWithPassword({
        cypher,
        password: encryptionPassword,
        salt,
        nonce,
        keyDerivationVersion: KeyDerivationVersion.V2,
      });
      expect(argon2Browser.hash).toHaveBeenCalledTimes(1);
      expect(scrypt).not.toHaveBeenCalled();
    });
  });
});
