import { toArrayBuffer } from '@core/common';
import {
  Aes256Gcm,
  CipherSuite,
  DhkemP521HkdfSha512,
  HkdfSha512,
} from '@hpke/core';

const suite = new CipherSuite({
  kem: new DhkemP521HkdfSha512(),
  kdf: new HkdfSha512(),
  aead: new Aes256Gcm(),
});

export async function encryptAnalyticsData(
  message: string,
): Promise<{ data: string; enc: string; keyID: string }> {
  if (
    !process.env.ANALYTICS_ENCRYPTION_KEY ||
    !process.env.ANALYTICS_ENCRYPTION_KEY_ID
  ) {
    throw new Error('Encryption setting missing');
  }

  const publicKey = await suite.kem.deserializePublicKey(
    toArrayBuffer(Buffer.from(process.env.ANALYTICS_ENCRYPTION_KEY, 'base64')),
  );

  const sender = await suite.createSenderContext({
    recipientPublicKey: publicKey,
  });

  const aad = new TextEncoder().encode(process.env.ANALYTICS_ENCRYPTION_KEY_ID);
  const data = new TextEncoder().encode(message);
  const ct = await sender.seal(toArrayBuffer(data), toArrayBuffer(aad));

  const encrypted = Buffer.from(ct).toString('base64');
  const enc = Buffer.from(sender.enc).toString('base64');
  return {
    data: encrypted,
    enc,
    keyID: process.env.ANALYTICS_ENCRYPTION_KEY_ID,
  };
}
