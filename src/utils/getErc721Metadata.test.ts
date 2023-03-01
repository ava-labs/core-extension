import { getErc721Metadata } from './getErc721Metadata';
import { ipfsResolverWithFallback } from './ipsfResolverWithFallback';
jest.mock('./ipsfResolverWithFallback', () => ({
  ipfsResolverWithFallback: jest.fn(),
}));

describe('utils/getErc721Metadata.ts', () => {
  const base64Prepend = 'data:application/json;base64,';
  const jsonData = `${base64Prepend}eyJ0ZXN0S2V5IjoidGVzdCJ9`;

  const jsonResult = {
    testKey: 'test',
  };

  const mockFetchdata = {
    result: 'test',
  };

  let realFetch;
  describe('getErc721Metadata', () => {
    beforeEach(() => {
      realFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockFetchdata),
      });
      (ipfsResolverWithFallback as jest.Mock).mockImplementation(
        (input) => input
      );
    });
    afterEach(() => {
      global.fetch = realFetch;
    });

    it('should use JSON parse', async () => {
      expect(await getErc721Metadata(jsonData)).toEqual(jsonResult);
      expect(global.fetch).toBeCalledTimes(0);
    });
    it('should fetch the data', async () => {
      expect(await getErc721Metadata('hereisurl.com')).toEqual(mockFetchdata);
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if failed to fetch', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('failed to fetch'));
      expect(await getErc721Metadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if non JSON response', async () => {
      global.fetch = jest.fn().mockResolvedValue({});
      expect(await getErc721Metadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if non JSON response', async () => {
      global.fetch = jest.fn().mockResolvedValue({});
      expect(await getErc721Metadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if non JSON response', async () => {
      const hexString = Buffer.from('123654', 'hex').toString();
      const tokenUri = `${base64Prepend}${hexString}`;
      expect(await getErc721Metadata(tokenUri)).toEqual({});
      expect(global.fetch).toBeCalledTimes(0);
    });
    it('should return empty object if empty base64 string', async () => {
      expect(await getErc721Metadata(base64Prepend)).toEqual({});
      expect(global.fetch).toBeCalledTimes(0);
    });
  });
});
