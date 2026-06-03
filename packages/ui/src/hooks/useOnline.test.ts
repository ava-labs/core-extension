import { act, renderHook, waitFor } from '@testing-library/react';

import { useOnline } from './useOnline';

const setNavigatorOnline = (value: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  });
};

describe('hooks/useOnline', () => {
  const originalOnLine = window.navigator.onLine;
  const originalFetch = global.fetch;
  const originalProxyUrl = process.env.PROXY_URL;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.PROXY_URL = 'https://proxy.example';
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    setNavigatorOnline(originalOnLine);
    global.fetch = originalFetch;
    process.env.PROXY_URL = originalProxyUrl;
    jest.resetAllMocks();
  });

  it('reports online without probing when the browser says online', () => {
    setNavigatorOnline(true);

    const { result } = renderHook(() => useOnline());

    expect(result.current.isOnline).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('confirms online via reachability probe when the browser flag is wrong (stuck false)', async () => {
    setNavigatorOnline(false);
    fetchMock.mockResolvedValue({} as Response);

    const { result } = renderHook(() => useOnline());

    // Initially mirrors the (wrong) browser flag.
    expect(result.current.isOnline).toBe(false);

    await waitFor(() => expect(result.current.isOnline).toBe(true));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://proxy.example?_='),
      expect.objectContaining({ method: 'HEAD', mode: 'no-cors' }),
    );
  });

  it('stays offline when the probe fails (real outage)', async () => {
    setNavigatorOnline(false);
    fetchMock.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useOnline());

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(result.current.isOnline).toBe(false);
  });

  it('re-verifies on an interval so a stuck false self-recovers', async () => {
    setNavigatorOnline(false);
    fetchMock.mockRejectedValueOnce(new Error('network error'));

    const { result } = renderHook(() => useOnline());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(result.current.isOnline).toBe(false);

    // Connectivity comes back; next scheduled probe succeeds.
    fetchMock.mockResolvedValue({} as Response);
    await act(async () => {
      jest.advanceTimersByTime(15_000);
    });

    await waitFor(() => expect(result.current.isOnline).toBe(true));
  });
});
