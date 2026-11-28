import {
  getLedgerSpeculosUrl,
  LEDGER_SPECULOS_URL_STORAGE_KEY,
  parseLedgerSpeculosUrl,
} from './ledgerSpeculos';

describe('utils/ledgerSpeculos', () => {
  const realStorage = chrome.storage;
  const originalRelease = process.env.RELEASE;
  let get: jest.Mock;

  beforeEach(() => {
    get = jest.fn().mockResolvedValue({});
    chrome.storage = { local: { get } } as unknown as typeof chrome.storage;
  });

  afterEach(() => {
    chrome.storage = realStorage;
    process.env.RELEASE = originalRelease;
  });

  describe('parseLedgerSpeculosUrl', () => {
    it.each([
      ['http://localhost:5050', 'http://localhost:5050'],
      ['http://127.0.0.1:5050/', 'http://127.0.0.1:5050'],
      ['https://localhost:5050', 'https://localhost:5050'],
      ['  http://localhost:5050/apdu  ', 'http://localhost:5050'],
    ])('accepts %s', (input, expected) => {
      expect(parseLedgerSpeculosUrl(input)).toBe(expected);
    });

    it.each([
      'http://example.com:5050',
      'http://192.168.0.10:5050',
      'http://localhost.evil.com:5050',
      'http://localhost@evil.com',
      'ftp://localhost:5050',
      'chrome-extension://localhost',
      'localhost:5050',
      'not a url',
      '',
      undefined,
      null,
      42,
    ])('rejects %p', (input) => {
      expect(parseLedgerSpeculosUrl(input)).toBeUndefined();
    });
  });

  describe('getLedgerSpeculosUrl', () => {
    it('returns the stored loopback URL', async () => {
      get.mockResolvedValue({
        [LEDGER_SPECULOS_URL_STORAGE_KEY]: 'http://localhost:5050',
      });

      await expect(getLedgerSpeculosUrl()).resolves.toBe(
        'http://localhost:5050',
      );
      expect(get).toHaveBeenCalledWith(LEDGER_SPECULOS_URL_STORAGE_KEY);
    });

    it('returns undefined when nothing is stored', async () => {
      await expect(getLedgerSpeculosUrl()).resolves.toBeUndefined();
    });

    it('ignores a non-loopback URL', async () => {
      get.mockResolvedValue({
        [LEDGER_SPECULOS_URL_STORAGE_KEY]: 'http://example.com:5050',
      });

      await expect(getLedgerSpeculosUrl()).resolves.toBeUndefined();
    });

    it('ignores the stored URL in production builds without reading storage', async () => {
      process.env.RELEASE = 'production';
      get.mockResolvedValue({
        [LEDGER_SPECULOS_URL_STORAGE_KEY]: 'http://localhost:5050',
      });

      await expect(getLedgerSpeculosUrl()).resolves.toBeUndefined();
      expect(get).not.toHaveBeenCalled();
    });

    it('returns undefined when storage is unavailable', async () => {
      chrome.storage = undefined as unknown as typeof chrome.storage;

      await expect(getLedgerSpeculosUrl()).resolves.toBeUndefined();
    });

    it('returns undefined when reading storage fails', async () => {
      get.mockRejectedValue(new Error('boom'));

      await expect(getLedgerSpeculosUrl()).resolves.toBeUndefined();
    });
  });
});
