import { useEffect, useRef, useState } from 'react';

const REACHABILITY_TIMEOUT_MS = 5_000;
const RECHECK_INTERVAL_MS = 15_000;

/**
 * Actively verifies that the internet is actually reachable.
 *
 * `navigator.onLine` only reflects the state of the OS network adapter, not
 * whether the internet is reachable. It is known to get *stuck* reporting
 * `false` on some machines (stale virtual network adapters, Chromium
 * network-service bugs, certain driver/enterprise setups) even when the
 * connection works fine. Because of that we never trust a `false` value
 * without confirming it with a real request first.
 *
 * Uses `no-cors` so any reply from the server (even an opaque one or a 4xx)
 * counts as "reachable"; only an actual network failure rejects. We hit the
 * base URL with a cache-busting param rather than a dedicated endpoint, since
 * reachability is all we need and there is no guaranteed health route.
 */
async function checkReachability(signal: AbortSignal): Promise<boolean> {
  const target = process.env.PROXY_URL;

  // Without a known endpoint to probe we have nothing better than the flag.
  if (!target) {
    return window.navigator.onLine;
  }

  const timeoutController = new AbortController();
  const timer = setTimeout(
    () => timeoutController.abort(),
    REACHABILITY_TIMEOUT_MS,
  );
  const onParentAbort = () => timeoutController.abort();
  signal.addEventListener('abort', onParentAbort, { once: true });

  const separator = target.includes('?') ? '&' : '?';

  try {
    await fetch(`${target}${separator}_=${Date.now()}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: timeoutController.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', onParentAbort);
  }
}

export function useOnline() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const isOnlineRef = useRef(isOnline);
  isOnlineRef.current = isOnline;

  useEffect(() => {
    const abortController = new AbortController();
    // Verifications can overlap (interval + events). Track the latest call so a
    // slow probe can't apply a stale result after a newer check already ran.
    let latestVerifyId = 0;

    const verify = async () => {
      const verifyId = ++latestVerifyId;

      // A `true` from the browser is reliable enough to treat as online,
      // and lets us avoid a network request on the happy path.
      if (window.navigator.onLine) {
        if (!isOnlineRef.current) {
          setIsOnline(true);
        }
        return;
      }

      // The browser claims we're offline. Confirm with a real request before
      // surfacing the offline UI, since the flag is frequently wrong.
      const reachable = await checkReachability(abortController.signal);
      if (
        !abortController.signal.aborted &&
        verifyId === latestVerifyId &&
        reachable !== isOnlineRef.current
      ) {
        setIsOnline(reachable);
      }
    };

    const onConnectionChange = () => {
      void verify();
    };
    const onVisibilityChange = () => {
      // The popup is mounted/unmounted constantly, so re-verify whenever it
      // becomes visible again to recover from a previously stuck state.
      if (document.visibilityState === 'visible') {
        void verify();
      }
    };

    window.addEventListener('online', onConnectionChange, {
      signal: abortController.signal,
    });
    window.addEventListener('offline', onConnectionChange, {
      signal: abortController.signal,
    });
    document.addEventListener('visibilitychange', onVisibilityChange, {
      signal: abortController.signal,
    });

    // Periodically re-verify so a stuck `false` self-recovers without
    // requiring any user interaction.
    const intervalId = setInterval(() => void verify(), RECHECK_INTERVAL_MS);

    // Correct a potentially wrong initial flag on mount.
    void verify();

    return () => {
      abortController.abort();
      clearInterval(intervalId);
    };
  }, []);

  return { isOnline };
}
