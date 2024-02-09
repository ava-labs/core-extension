import { CipherSuite, DhkemP521HkdfSha512 } from '@hpke/core';
import { encryptAnalyticsData } from './encryptAnalyticsData';

describe('src/background/services/analytics/utils/encryptAnalyticsData', () => {
  const env = process.env;

  // Dummy encryption key, do not re-use :)
  const publicKey =
    'BAH1H6IBhMSxiCi0NvutY1NmfrnRpu0Ll5/iwUt6qPp/C/OtfpPCKPxaMN0cgIgGH6M3apBDiG5bqvbUHGDjBktQJAAsimol1XosWGOAYVbisRVfZfULyYepSIqoVhJyQZxuay0ne8wJon04GWiYdclCdHDdv6KGEDWjZyDB91n8NBcptw==';
  const keyID = Buffer.from('ANALYTICS_ENCRYPTION_KEY_ID').toString('base64');

  afterEach(() => {
    process.env = env;
  });

  beforeEach(() => {
    process.env = {
      ...env,
      ANALYTICS_ENCRYPTION_KEY: publicKey,
      ANALYTICS_ENCRYPTION_KEY_ID: keyID,
    };
  });

  describe('when encryption-related env vars are not set', () => {
    beforeEach(() => {
      process.env = {
        ...env,
        ANALYTICS_ENCRYPTION_KEY: '',
        ANALYTICS_ENCRYPTION_KEY_ID: '',
      };
    });

    it('raises an error', async () => {
      await expect(encryptAnalyticsData('heyo')).rejects.toThrow(
        'Encryption setting missing'
      );
    });
  });

  it('fetches the public key from env vars', async () => {
    const sealedData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const enc = new Uint8Array([0, 1, 2, 3]);
    const mockedSender = {
      seal: jest.fn().mockResolvedValueOnce(sealedData),
      enc,
    } as any;
    const pubKey = {} as any;

    jest
      .spyOn(CipherSuite.prototype, 'createSenderContext')
      .mockResolvedValueOnce(mockedSender);
    jest
      .spyOn(DhkemP521HkdfSha512.prototype, 'deserializePublicKey')
      .mockResolvedValueOnce(pubKey);

    const message = 'heyo';
    const encodedMsg = new TextEncoder().encode(message);
    const encodedKeyId = new TextEncoder().encode(keyID);

    const result = await encryptAnalyticsData('heyo');

    expect(
      DhkemP521HkdfSha512.prototype.deserializePublicKey
    ).toHaveBeenCalledWith(Buffer.from(publicKey, 'base64'));

    expect(CipherSuite.prototype.createSenderContext).toHaveBeenCalledWith({
      recipientPublicKey: pubKey,
    });

    expect(mockedSender.seal).toHaveBeenCalledWith(encodedMsg, encodedKeyId);

    expect(result).toEqual({
      data: Buffer.from(sealedData).toString('base64'),
      enc: Buffer.from(mockedSender.enc).toString('base64'),
      keyID,
    });
  });
});
