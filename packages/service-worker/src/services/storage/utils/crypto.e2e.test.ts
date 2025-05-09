import {
  decryptWithKey,
  decryptWithPassword,
  encryptWithKey,
  encryptWithPassword,
} from './crypto';

describe('background/services/storage/utils/crypto.e2e', () => {
  describe('password', () => {
    it('can decrypt after encryption', async () => {
      const data = 'Lorem ipsum';
      const cypher = await encryptWithPassword({
        secret: data,
        password: 'password123',
      });

      expect(
        await decryptWithPassword({
          cypher: Uint8Array.from(cypher.cypher),
          password: 'password123',
          salt: Uint8Array.from(cypher.salt),
          nonce: Uint8Array.from(cypher.nonce),
          keyDerivationVersion: cypher.keyDerivationVersion,
        }),
      ).toEqual(data);
    });

    it('uses authenticated encryption', async () => {
      const data = 'Lorem ipsum';
      const cypher = await encryptWithPassword({
        secret: data,
        password: 'password123',
      });

      // change cypther data
      // authenticated encryption should fail with error instead of returning gibberish
      cypher.cypher[0] = cypher.cypher[0] === 0 ? 1 : 0;

      await expect(
        decryptWithPassword({
          cypher: Uint8Array.from(cypher.cypher),
          password: 'password123',
          salt: Uint8Array.from(cypher.salt),
          nonce: Uint8Array.from(cypher.nonce),
          keyDerivationVersion: cypher.keyDerivationVersion,
        }),
      ).rejects.toEqual(new Error('decryption failed'));
    });
  });

  describe('key', () => {
    it('can decrypt after encryption', async () => {
      const data = 'Lorem ipsum';
      const encryptionKey = Uint8Array.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6,
        7, 8, 9, 1, 2, 3, 4, 5,
      ]);
      const cypher = await encryptWithKey({ secret: data, encryptionKey });

      expect(
        await decryptWithKey({
          cypher: Uint8Array.from(cypher.cypher),
          encryptionKey,
          nonce: Uint8Array.from(cypher.nonce),
        }),
      ).toEqual(data);
    });

    it('uses authenticated encryption', async () => {
      const data = 'Lorem ipsum';
      const encryptionKey = Uint8Array.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6,
        7, 8, 9, 1, 2, 3, 4, 5,
      ]);
      const cypher = await encryptWithKey({ secret: data, encryptionKey });

      // change cypther data
      // authenticated encryption should fail with error instead of returning gibberish
      cypher.cypher[0] = cypher.cypher[0] === 0 ? 1 : 0;

      await expect(
        decryptWithKey({
          cypher: Uint8Array.from(cypher.cypher),
          encryptionKey,
          nonce: Uint8Array.from(cypher.nonce),
        }),
      ).rejects.toEqual(new Error('decryption failed'));
    });
  });
});
