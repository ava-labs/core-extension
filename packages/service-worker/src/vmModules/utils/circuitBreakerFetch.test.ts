import { getExponentialBackoffDelay } from '@core/common';
import { circuitBreakerFetch } from './circuitBreakerFetch';

jest.mock('@core/common');

describe('circuitBreakerFetch', () => {
  const WAIT_TIME = 100;
  jest.mocked(getExponentialBackoffDelay).mockReturnValue(WAIT_TIME);

  const realFetch = globalThis.fetch;
  const mockFetch = jest.fn();
  globalThis.fetch = mockFetch;

  /** Unique origin per test so the module singleton dropper state never collides */
  const getRandomOrigin = () =>
    `https://${Math.random().toString(36).substring(2, 15)}.test`;

  const mockResponse = (overrides: Partial<Response>): Response =>
    ({
      ok: true,
      status: 200,
      ...overrides,
    }) as Response;

  afterAll(() => {
    globalThis.fetch = realFetch;
  });

  it('forwards input and init to fetch and returns the response', async () => {
    const base = getRandomOrigin();
    const res = mockResponse({ url: `${base}/v1` });
    jest.mocked(fetch).mockResolvedValueOnce(res);

    const out = await circuitBreakerFetch(`${base}/v1`, { method: 'POST' });

    expect(fetch).toHaveBeenCalledWith(`${base}/v1`, { method: 'POST' });
    expect(out).toBe(res);
    expect(getExponentialBackoffDelay).not.toHaveBeenCalled();
  });

  it('does not throttle client errors and clears state for the origin', async () => {
    const base = getRandomOrigin();
    jest
      .mocked(fetch)
      .mockResolvedValueOnce(
        mockResponse({ ok: false, status: 404, url: `${base}/x` }),
      )
      .mockResolvedValueOnce(mockResponse({ url: `${base}/y` }));

    await circuitBreakerFetch(`${base}/x`);
    await circuitBreakerFetch(`${base}/y`);

    expect(getExponentialBackoffDelay).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('drops subsequent requests to the same origin after a 5xx until backoff elapses', async () => {
    try {
      jest.useFakeTimers();
      const base = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValue(
        mockResponse({
          ok: false,
          status: 503,
          url: `${base}/resource`,
        }),
      );

      const first = await circuitBreakerFetch(`${base}/a`);
      const secondOutcome = await circuitBreakerFetch(`${base}/b`).catch(
        (e) => e,
      );
      jest.advanceTimersByTime(WAIT_TIME);
      await circuitBreakerFetch(`${base}/c`);

      expect(first.status).toBe(503);
      expect(getExponentialBackoffDelay).toHaveBeenCalledWith(
        expect.objectContaining({ attempt: 1 }),
      );
      expect(secondOutcome).toBeInstanceOf(Error);
      expect((secondOutcome as Error).name).toBe('RequestBreakerError');
      expect(fetch).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('drops subsequent requests after 429 until backoff elapses', async () => {
    try {
      jest.useFakeTimers();
      const base = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValue(
        mockResponse({
          ok: false,
          status: 429,
          url: `${base}/`,
        }),
      );

      await circuitBreakerFetch(`${base}/`);
      const secondOutcome = await circuitBreakerFetch(`${base}/next`).catch(
        (e) => e,
      );
      jest.advanceTimersByTime(WAIT_TIME);
      await circuitBreakerFetch(`${base}/after`);

      expect(secondOutcome).toBeInstanceOf(Error);
      expect((secondOutcome as Error).name).toBe('RequestBreakerError');
      expect(fetch).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('does not block a different origin when one origin is dropping', async () => {
    try {
      jest.useFakeTimers();
      const blocked = getRandomOrigin();
      const other = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValueOnce(
        mockResponse({
          ok: false,
          status: 500,
          url: `${blocked}/hit`,
        }),
      );
      jest
        .mocked(fetch)
        .mockResolvedValueOnce(mockResponse({ url: `${other}/ok` }));

      await circuitBreakerFetch(`${blocked}/hit`);
      const res = await circuitBreakerFetch(`${other}/ok`);

      expect(res.ok).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('increments attempt for repeated failures on the same origin', async () => {
    try {
      jest.useFakeTimers();
      const base = getRandomOrigin();
      const fail = mockResponse({
        ok: false,
        status: 500,
        url: `${base}/r`,
      });
      jest.mocked(fetch).mockResolvedValue(fail);

      await circuitBreakerFetch(`${base}/1`);
      jest.advanceTimersByTime(WAIT_TIME);
      await circuitBreakerFetch(`${base}/2`);
      jest.advanceTimersByTime(WAIT_TIME);
      await circuitBreakerFetch(`${base}/3`);

      expect(getExponentialBackoffDelay).toHaveBeenCalledTimes(3);
      expect(getExponentialBackoffDelay).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          attempt: 1,
        }),
      );
      expect(getExponentialBackoffDelay).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          attempt: 2,
        }),
      );
      expect(getExponentialBackoffDelay).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          attempt: 3,
        }),
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it('resets backoff state after a successful response', async () => {
    try {
      jest.useFakeTimers();
      const base = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValueOnce(
        mockResponse({
          ok: false,
          status: 500,
          url: `${base}/bad`,
        }),
      );
      jest
        .mocked(fetch)
        .mockResolvedValueOnce(mockResponse({ url: `${base}/good` }));
      jest
        .mocked(fetch)
        .mockResolvedValueOnce(mockResponse({ url: `${base}/again` }));

      await circuitBreakerFetch(`${base}/bad`);
      const droppedOutcome = await circuitBreakerFetch(`${base}/next`).catch(
        (e) => e,
      );
      jest.advanceTimersByTime(WAIT_TIME);
      await circuitBreakerFetch(`${base}/good`);
      await circuitBreakerFetch(`${base}/again`);

      expect(droppedOutcome).toBeInstanceOf(Error);
      expect((droppedOutcome as Error).name).toBe('RequestBreakerError');
      expect(getExponentialBackoffDelay).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(3);
    } finally {
      jest.useRealTimers();
    }
  });

  describe('when Retry-After header', () => {
    it('is a number, it uses the value to calculate delay', async () => {
      const headers = new Headers({ 'Retry-After': '1' });
      const getHeaderSpy = jest.spyOn(headers, 'get');
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');
      const base = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValue(
        mockResponse({
          ok: false,
          status: 500,
          url: `${base}/`,
          headers,
        }),
      );

      try {
        await circuitBreakerFetch(`${base}/`);
        await circuitBreakerFetch(`${base}/`).catch((e) => e);

        expect(getExponentialBackoffDelay).not.toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(getHeaderSpy).toHaveBeenCalledWith('Retry-After');
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
        setTimeoutSpy.mockRestore();
      } finally {
        jest.useRealTimers();
      }
    });

    it('is a date, it uses the value to calculate delay', async () => {
      const headers = new Headers({
        'Retry-After': 'Wed, 24 Mar 2026 12:00:00 GMT',
      });
      const getHeaderSpy = jest.spyOn(headers, 'get');
      jest.useFakeTimers();
      jest.setSystemTime(new Date('Wed, 24 Mar 2026 11:59:59 GMT'));
      const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');
      const base = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValue(
        mockResponse({
          ok: false,
          status: 500,
          url: `${base}/`,
          headers,
        }),
      );

      try {
        await circuitBreakerFetch(`${base}/`);
        await circuitBreakerFetch(`${base}/`).catch((e) => e);

        expect(getExponentialBackoffDelay).not.toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(getHeaderSpy).toHaveBeenCalledWith('Retry-After');
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
        setTimeoutSpy.mockRestore();
      } finally {
        jest.useRealTimers();
      }
    });

    it('is invalid, it falls back to exponential backoff', async () => {
      jest.useFakeTimers();
      const headers = new Headers({
        'Retry-After': 'invalid',
      });
      const getHeaderSpy = jest.spyOn(headers, 'get');
      const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');
      const base = getRandomOrigin();
      jest.mocked(fetch).mockResolvedValue(
        mockResponse({
          ok: false,
          status: 500,
          url: `${base}/`,
          headers,
        }),
      );

      try {
        await circuitBreakerFetch(`${base}/`);
        await circuitBreakerFetch(`${base}/`).catch((e) => e);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(getExponentialBackoffDelay).toHaveBeenCalledWith(
          expect.objectContaining({ attempt: 1 }),
        );
        expect(getHeaderSpy).toHaveBeenCalledWith('Retry-After');
        expect(setTimeoutSpy).toHaveBeenCalledWith(
          expect.any(Function),
          WAIT_TIME,
        );
      } finally {
        jest.useRealTimers();
        setTimeoutSpy.mockRestore();
      }
    });
  });
});
