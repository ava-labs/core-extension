import { incrementalPromiseResolve } from './incrementalPromiseResolve';

describe('utils/incrementalPromiseResolve.ts', () => {
  const errorParserMock = jest.fn();

  const waitForRetries = async (retries: number) => {
    for (let i = 0; i < retries; i++) {
      jest.runAllTimers();
      await new Promise(jest.requireActual('timers').setImmediate);
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the resolved value', async () => {
    const callback = jest.fn(() => Promise.resolve('foo'));
    const promise = incrementalPromiseResolve(callback, errorParserMock);

    await waitForRetries(1);
    await expect(promise).resolves.toBe('foo');
  });

  it('returns the rejected value', async () => {
    const error = new Error('foo');
    const callback = jest.fn(() => Promise.reject(error));

    incrementalPromiseResolve(callback, errorParserMock).catch((err) => {
      expect(err).toStrictEqual(error);
    });

    await waitForRetries(1);
  });

  it('retries if errorParser returns true for the resolved promise', async () => {
    const callback = jest.fn(() => Promise.resolve('foo'));
    errorParserMock.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

    const promise = incrementalPromiseResolve(callback, errorParserMock);

    await waitForRetries(3);
    await expect(promise).resolves.toBe('foo');

    expect(errorParserMock).toHaveBeenCalledTimes(3);
    expect(errorParserMock).toHaveBeenCalledWith('foo');
  });

  it('retries if errorParser returns true for the resolved promise', async () => {
    const error = new Error('foo');
    const callback = jest.fn(() => Promise.reject(error));
    errorParserMock.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

    incrementalPromiseResolve(callback, errorParserMock).catch((err) => {
      expect(err).toStrictEqual(error);
    });

    await waitForRetries(3);
    expect(errorParserMock).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledTimes(3);

    for (let i = 1; i <= 3; i++) {
      expect(errorParserMock).toHaveBeenNthCalledWith(i, error);
    }
  });

  it('retries `maxRetries` times if errorParser returns true for the resolved promise', async () => {
    const callback = jest.fn(() => Promise.resolve('foo'));
    errorParserMock.mockResolvedValue(true);

    const promise = incrementalPromiseResolve(callback, errorParserMock, 0, 5);

    await waitForRetries(5);
    await expect(promise).resolves.toBe('foo');

    expect(callback).toHaveBeenCalledTimes(5);
    expect(errorParserMock).toHaveBeenCalledTimes(4);
    expect(errorParserMock).toHaveBeenCalledWith('foo');
  });

  it('retries `maxRetries` times if errorParser returns true for the rejected promise', async () => {
    const error = new Error('foo');
    const callback = jest.fn(() => Promise.reject(error));
    errorParserMock.mockResolvedValue(true);

    incrementalPromiseResolve(callback, errorParserMock, 0, 5).catch((err) => {
      expect(err).toStrictEqual(error);
    });

    await waitForRetries(5);
    expect(errorParserMock).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenCalledTimes(5);

    for (let i = 1; i <= 4; i++) {
      expect(errorParserMock).toHaveBeenNthCalledWith(i, error);
    }
  });
});
