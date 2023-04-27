import { getNftMetadata } from './getNftMetadata';
import { ipfsResolverWithFallback } from './ipsfResolverWithFallback';
jest.mock('./ipsfResolverWithFallback', () => ({
  ipfsResolverWithFallback: jest.fn(),
}));

describe('utils/getNftMetadata.ts', () => {
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
      jest.resetAllMocks();
      realFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockFetchdata),
      });
      (ipfsResolverWithFallback as jest.Mock).mockImplementation(
        (input) => input
      );
      jest.useFakeTimers();
    });
    afterEach(() => {
      global.fetch = realFetch;
      jest.useRealTimers();
    });

    it('should use JSON parse', async () => {
      expect(await getNftMetadata(jsonData)).toEqual(jsonResult);
      expect(global.fetch).toBeCalledTimes(0);
    });
    it('should fetch the data', async () => {
      expect(await getNftMetadata('hereisurl.com')).toEqual(mockFetchdata);
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if failed to fetch', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('failed to fetch'));
      expect(await getNftMetadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if non JSON response', async () => {
      global.fetch = jest.fn().mockResolvedValue({});
      expect(await getNftMetadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if non JSON response', async () => {
      global.fetch = jest.fn().mockResolvedValue({});
      expect(await getNftMetadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
    it('should return empty object if non JSON response', async () => {
      const hexString = Buffer.from('123654', 'hex').toString();
      const tokenUri = `${base64Prepend}${hexString}`;
      expect(await getNftMetadata(tokenUri)).toEqual({});
      expect(global.fetch).toBeCalledTimes(0);
    });
    it('should return empty object if empty base64 string', async () => {
      expect(await getNftMetadata(base64Prepend)).toEqual({});
      expect(global.fetch).toBeCalledTimes(0);
    });
    it('should cancel request if fetch takes longer than timeout amount', async () => {
      global.fetch = jest
        .fn()
        .mockImplementation(async (uri, options: RequestInit) => {
          const { signal } = options;
          let shouldThrowError = false;
          signal?.addEventListener('abort', () => {
            shouldThrowError = true;
          });
          // default timeout is 5000 right now
          jest.advanceTimersByTime(10000);

          return shouldThrowError
            ? Promise.reject(new Error('timeout'))
            : Promise.resolve({
                json: jest.fn().mockResolvedValue(mockFetchdata),
              });
        });
      expect(await getNftMetadata('hereisurl.com')).toEqual({});
      expect(global.fetch).toBeCalledTimes(1);
    });
  });
});
